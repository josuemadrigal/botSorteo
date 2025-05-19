import "dotenv/config";
import { whatsappService } from "./services/whatsapp.service";
import { apiService } from "./services/api.service";

console.log("🚀 Iniciando WhatsApp Bot...");

// Configuración para evitar reinicios por cambios en estos archivos
const WATCH_OPTIONS = {
  ignore: ["src/services/whatsapp.service.ts", "src/services/api.service.ts"],
};

// Iniciar API
apiService.start();

// Verificar estado periódicamente
setInterval(() => {
  console.log(
    `Estado conexión: ${
      whatsappService.isConnected ? "✅ Conectado" : "❌ Desconectado"
    }`
  );
}, 100000);
