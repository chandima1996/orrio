import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Hotel from "../models/hotelModel";
import OpenAI from "openai";
import Room from "../models/roomModel";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc    Fetch all hotels
// @route   GET /api/hotels
const getAllHotels = asyncHandler(async (req: Request, res: Response) => {
  const {
    guests,
    minPrice,
    maxPrice,
    starClass,
    userRating,
    location,
    amenities,
  } = req.query;

  const totalGuests = Number(guests || 0);

  const roomMatchStage: any = {};
  if (totalGuests > 0) roomMatchStage.capacity = { $gte: totalGuests };
  if (minPrice && maxPrice)
    roomMatchStage.pricePerNight = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  if (amenities) {
    const amenitiesArr = Array.isArray(amenities) ? amenities : [amenities];
    if (amenitiesArr.length > 0)
      roomMatchStage.amenities = { $all: amenitiesArr };
  }

  const hotelMatchStage: any = {};
  if (starClass) {
    const starArr = (Array.isArray(starClass) ? starClass : [starClass]).map(
      Number
    );
    if (starArr.length > 0) hotelMatchStage.starClass = { $in: starArr };
  }
  if (userRating) hotelMatchStage.rating = { $gte: Number(userRating) };
  if (location) {
    const locArr = Array.isArray(location) ? location : [location];
    if (locArr.length > 0) hotelMatchStage.location = { $in: locArr };
  }

  if (Object.keys(roomMatchStage).length > 0) {
    const hotelIdsWithMatchingRooms = await Room.find(roomMatchStage).distinct(
      "hotel"
    );
    hotelMatchStage._id = { $in: hotelIdsWithMatchingRooms };
  }

  const hotels = await Hotel.find(hotelMatchStage);
  res.json({ hotels, page: 1, pages: 1 });
});

// @desc    Fetch single hotel by ID
// @route   GET /api/hotels/:id
const getHotelById = asyncHandler(async (req: Request, res: Response) => {
  const hotel = await Hotel.findById(req.params.id);
  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404).json({ message: "Hotel not found" });
  }
});

// @desc    Create a new hotel
// @route   POST /api/hotels
const createHotel = asyncHandler(async (req: Request, res: Response) => {
  const hotel = new Hotel(req.body);
  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
});

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
const updateHotel = asyncHandler(async (req: Request, res: Response) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!hotel) {
    res.status(404).json({ message: "Hotel not found" });
    return;
  }
  res.json(hotel);
});

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
const deleteHotel = asyncHandler(async (req: Request, res: Response) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) {
    res.status(404).json({ message: "Hotel not found" });
    return;
  }
  res.json({ message: "Hotel removed" });
});

// @desc    Search hotels using AI Chat Completion
// @route   GET /api/hotels/search
const searchHotels = asyncHandler(async (req: Request, res: Response) => {
  const userQuery = req.query.q as string;

  if (!userQuery) {
    return res.status(400).json({ message: "Search query is required." });
  }

  const allHotels = await Hotel.find({});

  const simplifiedHotels = allHotels.map((hotel) => ({
    id: hotel._id,
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
    amenities: hotel.amenities.join(", "),
    starClass: hotel.starClass,
  }));

  const systemPrompt = `You are an intelligent hotel matching assistant. I will provide a user's query and a JSON list of available hotels (including name, location, description, amenities). Your ONLY task is to analyze the user's query and return a comma-separated string of the hotel IDs that best match the user's described vibe or requirements. Do not provide any explanation, greeting, or any other text. JUST THE COMMA-SEPARATED IDs. If no hotels match, return an empty string.

    Available Hotels:
    ${JSON.stringify(simplifiedHotels)}
    `;

  console.log("--- Sending to AI ---");
  console.log("User Query:", userQuery);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `User query: "${userQuery}"` },
    ],
    temperature: 0,
  });

  const aiResponseContent = response.choices[0].message.content;

  console.log("--- Received from AI ---");
  console.log("AI Response:", aiResponseContent);

  if (!aiResponseContent) {
    return res.json([]);
  }

  const matchingHotelIds = aiResponseContent
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id);

  if (matchingHotelIds.length === 0) {
    return res.json([]);
  }

  const finalHotels = await Hotel.find({
    _id: { $in: matchingHotelIds },
  });

  res.json(finalHotels);
});

export {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
};
