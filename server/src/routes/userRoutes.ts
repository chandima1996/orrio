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

router.route("/").get(getAllUsers);

router.route("/:userId").put(updateUser).delete(deleteUser);

router.route("/:userId/role").put(updateUserRole);

router
  .route("/me/favorites")
  .get(ClerkExpressRequireAuth(), getMyFavorites)
  .post(ClerkExpressRequireAuth(), toggleFavorite);

export default router;
