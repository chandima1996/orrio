import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Hotel from "../src/models/hotelModel";
import connectDB from "../src/config/db";
import OpenAI from "openai";

dotenv.config();
// colors.enable() line eka dan ona na, mokada api eka direct use karanne

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateEmbeddings = async () => {
  try {
    await connectDB();
    const hotels = await Hotel.find({});

    // === START: UPDATED CONSOLE LOGS ===
    console.log(colors.cyan("Starting to generate embeddings for hotels..."));

    for (const hotel of hotels) {
      const inputText = `Hotel: ${hotel.name}. Location: ${
        hotel.location
      }. Amenities: ${hotel.amenities.join(", ")}.`;

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small", // MEKA WENAS KARANNA
        input: inputText,
      });
      const embedding = response.data[0].embedding;

      hotel.descriptionEmbedding = embedding;
      await hotel.save();
      console.log(colors.green(`✅ Embedded: ${hotel.name}`));
    }

    console.log(
      colors.bold.green("All hotels have been embedded successfully!")
    );
    // === END: UPDATED CONSOLE LOGS ===

    process.exit();
  } catch (error) {
    console.error(colors.red("Error during embedding process:"), error);
    process.exit(1);
  }
};

generateEmbeddings();
