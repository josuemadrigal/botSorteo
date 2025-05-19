// mongo-client.service.ts
import { MongoClient, Db } from "mongodb";

class MongoClientService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  public async connect(): Promise<Db> {
    if (this.db) return this.db;

    try {
      this.client = new MongoClient(process.env.MONGO_DB_URI!);
      await this.client.connect();
      this.db = this.client.db(process.env.MONGO_DB_NAME);
      console.log("✅ Conexión directa a MongoDB establecida");
      return this.db;
    } catch (error) {
      console.error("❌ Error al conectar con MongoDB:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log("🔌 Desconectado de MongoDB");
    }
  }

  public getDatabase(): Db {
    if (!this.db) throw new Error("Base de datos no conectada");
    return this.db;
  }
}

export const mongoClientService = new MongoClientService();
