import { Schema, model, Document } from "mongoose";

interface IMessage extends Document {
  phone: string;
  message: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  phone: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", MessageSchema);
