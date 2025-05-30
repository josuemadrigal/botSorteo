import express, { Express, Request, Response } from "express";
import cors from "cors";
import { whatsappService } from "./whatsapp.service";
import {
  convertirCedula,
  getFecha,
  getHora,
  getLugar,
  getPremio,
} from "../utils";

class ApiService {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000");
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("WhatsApp Bot API");
    });

    this.app.post("/v1/send-message", async (req: Request, res: Response) => {
      try {
        const { phone, imageUrl, cedula, message, name, municipio } = req.body;

        const nombre = name.split(" ")[0].toUpperCase();
        const nombreFormateado =
          nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

        const imgUrl =
          "https://app.eduardespiritusanto.com/registrate-aqui-app.jpeg";

        let municipioTitle;

        switch (municipio) {
          case "caleta":
            municipioTitle = "Caleta";
            break;
          case "cumayasa":
            municipioTitle = "Cumayasa";
            break;
          case "guaymate":
            municipioTitle = "Guaymate";
            break;
          case "villa-hermosa":
            municipioTitle = "Villa Hermosa";
            break;
          case "la-romana":
            municipioTitle = "La Romana";
            break;
          default:
            municipioTitle = "Municipio no válido";
            break;
        }

        const defaultMessage = `👋🏼 Hola *${nombreFormateado}*, gracias por registrarte. 
        \nTe has registrado exitosamente para el sorteo de *${municipioTitle}*, que se llevará a cabo 📍 en *${getLugar(
          municipio
        )}*, 🗓️ el *${getFecha(municipio)}* a las *${getHora(municipio)}*. 
        \nRecuerda que debes *llevar tu cédula* (${convertirCedula(
          cedula
        )}) al evento para participar. 
        \n*¡Te esperamos! ☘️*
        `;

        if (!phone) {
          return res
            .status(400)
            .json({ error: "El número de teléfono es requerido" });
        }

        await whatsappService.sendMessage(phone, {
          text: defaultMessage,
          imageUrl: imgUrl,
          caption: defaultMessage,
          cedula: cedula,
          municipio: municipio,
          name: name,
        });

        res.json({
          success: true,
          message: "Enviado correctamente",
        });
      } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({
          error: error.message || "Error interno del servidor",
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }
    });

    this.app.post("/v1/ganador", async (req: Request, res: Response) => {
      try {
        const { phone, cedula, name, municipio, premio, slug_premio } =
          req.body;

        const nombre = name.trim().split(" ")[0];
        const nombreFormateado =
          nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

        const imgUrl =
          "https://app.eduardespiritusanto.com/registrate-aqui-app.jpeg";

        let municipioTitle;

        switch (municipio) {
          case "caleta":
            municipioTitle = "Caleta";
            break;
          case "cumayasa":
            municipioTitle = "Cumayasa";
            break;
          case "guaymate":
            municipioTitle = "Guaymate";
            break;
          case "villa-hermosa":
            municipioTitle = "Villa Hermosa";
            break;
          case "la-romana":
            municipioTitle = "La Romana";
            break;
          default:
            municipioTitle = "Municipio no válido";
            break;
        }
        const getPremioWs = getPremio(slug_premio);

        const defaultMessage = `🎉 *_MUCHAS FELICIDADES_* 🎉  *${nombreFormateado}*, has sido ganadora de *${
          getPremioWs.title
        }*. 
        \n Debes pasar a recoger tu premio 📍 en la *OFICINA SENATORIAL*, ubicada en la Av. Padre Abreu #5, La Romana, frente a Frank Muebles, 🗓️ el *Sabado 31 de Mayo* a las *10:00* de la mañana. 
        \nRecuerda que debes *llevar tu cédula* (${convertirCedula(
          cedula
        )}) para poder retirar tu premio. 
        \n*¡Te esperamos! ☘️*
        \n
        Unete a nuestro grupo de whatsapp para *Madres con Eduard*, para que estes informada de todas nuestras actividades.
        https://chat.whatsapp.com/IipgJE45h3D5FxgcstROMk
        `;

        if (!phone) {
          return res
            .status(400)
            .json({ error: "El número de teléfono es requerido" });
        }

        await whatsappService.sendMessageGanador(phone, {
          text: defaultMessage,
          imageUrl: imgUrl,
          caption: defaultMessage,
          cedula: cedula,
          municipio: municipioTitle,
          name: name,
          premio: getPremioWs.title,
          slug_premio: slug_premio,
        });

        res.json({
          success: true,
          message: "Enviado correctamente",
        });
      } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({
          error: error.message || "Error interno del servidor",
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }
    });

    this.app.post("/v1/recordatorio", async (req: Request, res: Response) => {
      try {
        const { phone, cedula, name, municipio } = req.body;

        const nombre = name.split(" ")[0].toUpperCase();
        const nombreFormateado =
          nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

        const imgUrl =
          "https://app.eduardespiritusanto.com/registrate-aqui-app.jpeg";

        let municipioTitle;

        switch (municipio) {
          case "caleta":
            municipioTitle = "Caleta";
            break;
          case "cumayasa":
            municipioTitle = "Cumayasa";
            break;
          case "guaymate":
            municipioTitle = "Guaymate";
            break;
          case "villa-hermosa":
            municipioTitle = "Villa Hermosa";
            break;
          case "la-romana":
            municipioTitle = "La Romana";
            break;
          default:
            municipioTitle = "Municipio no válido";
            break;
        }

        const defaultMessage = `🌹 _¡HOY ES EL DIA!_ 🌹
        \n*${nombreFormateado}*, gracias por apoyar las actividades de tu senador _Eduard Espiritusanto_. 
        \nTe recordamos que el sorteo de *${municipioTitle}* en el que te registraste es HOY (*${getFecha(
          municipio
        )}).* Estaremos 📍 en *${getLugar(
          municipio
        )}*, dando inicio a las *${getHora(municipio)}*. 
        \nRecuerda que debes *llevar tu cédula* (${convertirCedula(
          cedula
        )}) al evento para participar. 
        \n*¡Te esperamos! ☘️*
        `;

        if (!phone) {
          return res
            .status(400)
            .json({ error: "El número de teléfono es requerido" });
        }

        await whatsappService.sendMessageRecordatorio(phone, {
          text: defaultMessage,
          // imageUrl: imgUrl,
          caption: defaultMessage,
          cedula: cedula,
          municipio: municipio,
          name: name,
        });

        res.json({
          success: true,
          message: "Enviado correctamente",
        });
      } catch (error: any) {
        console.error("Error:", error);
        res.status(500).json({
          error: error.message || "Error interno del servidor",
          details:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
      }
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`API server running on port ${this.port}`);
    });
  }
}

export const apiService = new ApiService();
