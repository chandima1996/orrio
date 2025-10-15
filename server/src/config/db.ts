import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env file

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("Error: MONGO_URI is not defined in .env file");
      process.exit(1); // Stop the application
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // === START: UPDATED ERROR HANDLING ===
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("An unknown error occurred:", error);
    }
    // === END: UPDATED ERROR HANDLING ===
    process.exit(1);
  }
};

export default connectDB;
