import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  phone: string;
  name?: string;
  isAdmin?: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", UserSchema);
