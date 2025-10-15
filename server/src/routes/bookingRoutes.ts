import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingById,
} from "../controllers/bookingController";

const router = express.Router();

router.route("/mybookings").get(ClerkExpressRequireAuth(), getMyBookings);

// Route to create a new booking
router.route("/").post(ClerkExpressRequireAuth(), createBooking); // Creating a booking should be a protected action

router.route("/:id").get(ClerkExpressRequireAuth(), getBookingById);
// Route to cancel a specific booking
router.route("/:id/cancel").put(ClerkExpressRequireAuth(), cancelBooking);

export default router;
