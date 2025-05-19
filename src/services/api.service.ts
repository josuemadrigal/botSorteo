import express, { Express, Request, Response } from "express";
import cors from "cors";
import { whatsappService } from "./whatsapp.service";
import { convertirCedula, getFecha, getHora, getLugar } from "../utils";

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
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`API server running on port ${this.port}`);
    });
  }
}

export const apiService = new ApiService();
