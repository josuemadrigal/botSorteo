// import "dotenv/config";
// // database.service.ts
// import mongoose from "mongoose";

// class DatabaseService {
//   public isConnected = false;
//   public ready: Promise<void>;

//   constructor() {
//     this.ready = this.connect();

//     mongoose.connection.on("connected", () => {
//       this.isConnected = true;
//       console.log("✅ MongoDB connection established");
//     });

//     mongoose.connection.on("disconnected", () => {
//       this.isConnected = false;
//       console.log("❌ MongoDB disconnected");
//     });
//   }

//   private async connect(): Promise<void> {
//     try {
//       await mongoose.connect(process.env.MONGODB_URI || "", {
//         serverSelectionTimeoutMS: 30000,
//         socketTimeoutMS: 45000,
//         maxPoolSize: 10,
//         retryWrites: true,
//         w: "majority",
//       });
//     } catch (error) {
//       console.error("MongoDB connection error:", error);
//       throw error;
//     }
//   }
// }

// export const databaseService = new DatabaseService();
