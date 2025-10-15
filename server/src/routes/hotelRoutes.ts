import express from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels, // searchHotels import karala thiyenawada balanna
} from "../controllers/hotelController";

const router = express.Router();

// --- ROUTE ORDER FIX ---

// GET /api/hotels
router.route("/").get(getAllHotels).post(createHotel);

// GET /api/hotels/search
// Me SPECIFIC route eka, DYNAMIC route ekata (/:id) kalin enna ona
router.route("/search").get(searchHotels);

// GET, PUT, DELETE /api/hotels/:id
router.route("/:id").get(getHotelById).put(updateHotel).delete(deleteHotel);

export default router;
