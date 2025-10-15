import express from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
} from "../controllers/hotelController";

const router = express.Router();

router.route("/").get(getAllHotels).post(createHotel);

router.route("/search").get(searchHotels);

router.route("/:id").get(getHotelById).put(updateHotel).delete(deleteHotel);

export default router;
