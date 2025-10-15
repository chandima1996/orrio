import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import { hotelsData } from "../src/data/dummyData"; // 1. Path eka hariyatama thiyenawa
import Hotel from "../src/models/hotelModel";
import Room, { IRoom } from "../src/models/roomModel"; // 2. IRoom interface eka import karanawa
import connectDB from "../src/config/db";

dotenv.config();
colors.enable();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Room.deleteMany();
    await Hotel.deleteMany();

    console.log(colors.cyan("Seeding hotels and rooms..."));

    const createdHotels = await Hotel.insertMany(hotelsData);

    // 3. 'roomsToCreate' ekata hari type eka denawa
    const roomsToCreate: Partial<IRoom>[] = [];

    createdHotels.forEach((hotel) => {
      // Create 5 sample rooms for each hotel
      for (let i = 1; i <= 5; i++) {
        const roomType =
          i === 1 ? "Suite" : i <= 3 ? "Deluxe Room" : "Standard Room";

        // 4. Hotel eke price nathi nisa, base price ekak use karanawa
        let price = 100; // Base price for a standard room
        if (roomType === "Suite") price = 250;
        if (roomType === "Deluxe Room") price = 150;

        roomsToCreate.push({
          hotel: hotel._id,
          type: roomType,
          pricePerNight: price,
          capacity: i <= 2 ? 4 : 2, // Suites and Deluxe have more capacity
          size: i <= 2 ? 500 : 300,
          beds: { king: i === 1 ? 1 : 0, queen: i <= 3 ? 1 : 1 },
          amenities: [
            "Free Wi-Fi",
            "Air Conditioning",
            i <= 3 ? "Balcony" : "City View",
          ],
          images: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
            "https://images.unsplash.com/photo-1590490359853-382a297e65b3",
          ],
          roomNumbers: [
            { number: `${i}01`, isAvailable: true },
            { number: `${i}02`, isAvailable: true },
          ],
        });
      }
    });

    await Room.insertMany(roomsToCreate);

    console.log(
      colors.bold.green(
        "✅ Data Imported Successfully! All hotels and rooms are seeded."
      )
    );
    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error(colors.red.inverse(error.message));
    } else {
      console.error(colors.red.inverse("An unknown error occurred"));
    }
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Room.deleteMany();
    await Hotel.deleteMany();
    console.log(colors.red.inverse("🗑️ Data Destroyed!"));
    process.exit();
  } catch (error) {
    if (error instanceof Error) {
      console.error(colors.red.inverse(error.message));
    } else {
      console.error(colors.red.inverse("An unknown error occurred"));
    }
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
