import {
  makeWASocket,
  useMultiFileAuthState,
  Browsers,
  DisconnectReason,
  proto,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom";
import { Message } from "../models/message.model";
// import { databaseService } from "./database.service";
import mongoose from "mongoose";
import { mongoClientService } from "./mongo-client.service";

class WhatsAppService {
  private sock: any;
  private qrCode: string = "";
  private connectionStatus: "disconnected" | "connecting" | "connected" =
    "disconnected";

  constructor() {
    this.initialize();
  }

  public get isConnected() {
    return this.connectionStatus === "connected";
  }

  private async initialize() {
    this.connectionStatus = "connecting";

    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        process.env.SESSION_NAME || "session"
      );

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Desactivamos el QR automático
        browser: Browsers.macOS("Desktop"),
      });

      this.sock.ev.on("connection.update", (update: any) => {
        const { connection, qr, isNewLogin } = update;

        // Manejo del código QR
        if (qr) {
          this.qrCode = qr;
          console.log("\nEscanea este código QR para conectar:");
          qrcode.generate(qr, { small: true });
          console.log("\n");
        }

        if (connection === "open") {
          this.connectionStatus = "connected";
          console.log("✅ Conexión exitosa con WhatsApp");
        }

        if (connection === "close") {
          this.handleConnectionClose(update);
        }

        if (isNewLogin) {
          console.log("⚠️ Nueva sesión detectada, verifica tu teléfono");
        }
      });

      this.sock.ev.on("creds.update", saveCreds);
    } catch (error) {
      console.error("Error al inicializar:", error);
      this.connectionStatus = "disconnected";
    }
  }

  private handleConnectionClose(update: any) {
    this.connectionStatus = "disconnected";
    const { lastDisconnect } = update;
    const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;

    if (statusCode === DisconnectReason.loggedOut) {
      console.log("❌ Sesión cerrada, por favor escanea el QR nuevamente");
      // Borra la sesión existente
      require("fs").rmSync(process.env.SESSION_NAME || "session", {
        recursive: true,
        force: true,
      });
    } else {
      console.log("⚡ Intentando reconectar...");
      setTimeout(() => this.initialize(), 3000);
    }
  }

  public async sendMessage(
    phone: string,
    content: {
      text?: string;
      imageUrl?: string;
      caption?: string;
      cedula?: string;
      municipio?: string;
      name?: string;
    }
  ) {
    if (!this.isConnected) {
      throw new Error("El bot no está conectado a WhatsApp");
    }

    const phoneUser = `${phone}@s.whatsapp.net`;
    let result;

    try {
      if (content.imageUrl) {
        // Enviar mensaje con imagen
        result = await this.sock.sendMessage(phoneUser, {
          image: { url: content.imageUrl },
          caption: content.caption || content.text || "",
          mimetype: this.getMimeTypeFromUrl(content.imageUrl),
        });
      } else if (content.text) {
        // Enviar solo texto
        result = await this.sock.sendMessage(phoneUser, {
          text: content.text,
          contextInfo: { mentionedphoneUser: [phoneUser] },
        });
      } else {
        throw new Error("Debe proporcionar al menos texto o imagen");
      }

      await this.saveMessageLog(
        phone,
        content.text || content.caption || "",
        content.cedula,
        content.municipio,
        content.name
      );
      return result;
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      throw error;
    }
  }

  private async saveMessageLog(
    phone: string,
    message: string,
    cedula: string,
    municipio: string,
    name: string
  ): Promise<void> {
    try {
      const db = await mongoClientService.connect();
      const collection = db.collection("messages");

      await collection.insertOne({
        phone,
        name,
        cedula,
        municipio,
        message,
        timestamp: new Date(),
      });

      console.log("📝 Mensaje guardado en MongoDB");
    } catch (error) {
      console.error("Error al guardar el log:", error);

      // Intento alternativo con reintentos
      await this.retrySaveMessage(phone, message);
    }
  }

  private async retrySaveMessage(
    phone: string,
    message: string,
    attempts = 3
  ): Promise<void> {
    for (let i = 0; i < attempts; i++) {
      try {
        const db = await mongoClientService.connect();
        const collection = db.collection("messages");

        await collection.insertOne({
          phone,
          message,
          timestamp: new Date(),
        });

        console.log(`🔄 Mensaje guardado en intento ${i + 1}`);
        return;
      } catch (retryError) {
        console.error(`Intento ${i + 1} fallido:`, retryError);
        if (i === attempts - 1) throw retryError;
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
      }
    }
  }

  private getMimeTypeFromUrl(url: string): string {
    const extension = url.split(".").pop()?.split("?")[0].toLowerCase();
    switch (extension) {
      case "png":
        return "image/png";
      case "webp":
        return "image/webp";
      case "gif":
        return "image/gif";
      default:
        return "image/jpeg";
    }
  }
}

export const whatsappService = new WhatsAppService();
