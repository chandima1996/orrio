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

router.route("/").post(ClerkExpressRequireAuth(), createBooking);
router.route("/:id").get(ClerkExpressRequireAuth(), getBookingById);
router.route("/:id/cancel").put(ClerkExpressRequireAuth(), cancelBooking);

export default router;
