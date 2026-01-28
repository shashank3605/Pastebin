import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URL;

  if (!mongoURI) {
    console.error("MONGODB_URL is not defined in .env");
    process.exit(1);
  }

  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(mongoURI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed");
    console.error(error);
    process.exit(1);
  }
}
