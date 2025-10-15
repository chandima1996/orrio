import express from "express";
import {
  getRoomsByHotel,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById, // getRoomById import karanna
  getRoomStats, // getRoomStats import karanna
} from "../controllers/roomController";

const router = express.Router();

// --- CORRECT ROUTE ORDER ---

// Route to create a new room
router.route("/").post(createRoom);

// Specific static route for statistics. MUST come before dynamic /:id route.
router.route("/stats").get(getRoomStats);

// Route to get all rooms for a specific hotel
router.route("/hotel/:hotelId").get(getRoomsByHotel);

// Dynamic route for a single room. MUST come last among similar paths.
router.route("/:id").get(getRoomById).put(updateRoom).delete(deleteRoom);

export default router;
