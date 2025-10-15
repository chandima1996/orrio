import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  getMyFavorites,
  toggleFavorite,
} from "../controllers/userController";

const router = express.Router();

// --- Admin Routes ---
// These routes are for the admin dashboard to manage all users
router.route("/").get(getAllUsers); // This could be protected to be admin-only later

router
  .route("/:userId")
  .put(updateUser) // This could also be used by a user to update their own info
  .delete(deleteUser); // Admin-only action

router.route("/:userId/role").put(updateUserRole); // Admin-only action

// --- User-Specific Protected Routes ---
// These routes are for the logged-in user to manage their own data
router
  .route("/me/favorites")
  .get(ClerkExpressRequireAuth(), getMyFavorites)
  .post(ClerkExpressRequireAuth(), toggleFavorite);

export default router;
