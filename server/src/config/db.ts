import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("Error: MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("An unknown error occurred:", error);
    }
    process.exit(1);
  }
};

export default connectDB;
