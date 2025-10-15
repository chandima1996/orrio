import express from "express";
import {
  getRoomsByHotel,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getRoomStats,
} from "../controllers/roomController";

const router = express.Router();

router.route("/").post(createRoom);

router.route("/stats").get(getRoomStats);

router.route("/hotel/:hotelId").get(getRoomsByHotel);

router.route("/:id").get(getRoomById).put(updateRoom).delete(deleteRoom);

export default router;
