import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Booking from "../models/bookingModel";

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = new Booking(req.body);
  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/mybookings
const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as any).auth;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const bookings = await Booking.find({ user: userId })
    .populate("hotel")
    .populate("room");
  res.json(bookings);
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) {
    booking.bookingStatus = "cancelled";
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hotel")
    .populate("room");

  if (booking) {
    const { userId } = (req as any).auth;
    if (booking.user.toString() !== userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    res.json(booking);
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

export { createBooking, cancelBooking, getMyBookings, getBookingById };
