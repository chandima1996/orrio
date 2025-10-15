import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Room from "../models/roomModel";

// @desc    Get all rooms for a specific hotel
// @route   GET /api/rooms/hotel/:hotelId
const getRoomsByHotel = asyncHandler(async (req: Request, res: Response) => {
  const rooms = await Room.find({ hotel: req.params.hotelId });
  res.json(rooms);
});

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    res.json(room);
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

// @desc    Create a new room for a hotel
// @route   POST /api/rooms
const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { roomNumberRange, ...otherDetails } = req.body;

  const roomNumbers = [];
  if (roomNumberRange) {
    const [startStr, endStr] = roomNumberRange.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    if (!isNaN(start) && !isNaN(end) && end >= start) {
      for (let i = start; i <= end; i++) {
        roomNumbers.push({ number: i.toString(), isAvailable: true });
      }
    }
  }

  const room = new Room({
    ...otherDetails,
    roomNumbers: roomNumbers,
  });

  const createdRoom = await room.save();
  res.status(201).json(createdRoom);
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }
  res.json(room);
});

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }
  res.json({ message: "Room removed" });
});

// @desc    Get room statistics (min/max price)
// @route   GET /api/rooms/stats
const getRoomStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Room.aggregate([
    {
      $group: {
        _id: null,
        minPrice: { $min: "$pricePerNight" },
        maxPrice: { $max: "$pricePerNight" },
      },
    },
  ]);

  if (stats.length > 0) {
    res.json(stats[0]);
  } else {
    res.json({ minPrice: 0, maxPrice: 1000 });
  }
});

export {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats,
};
