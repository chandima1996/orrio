import { Clerk } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Hotel from "../models/hotelModel";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// @desc    Get all users from Clerk
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await clerk.users.getUserList();
  res.json(users);
});

// @desc    Update a user's details (name, contact)
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { firstName, lastName, contactNo } = req.body;

  const user = await clerk.users.getUser(userId);

  const updatedUser = await clerk.users.updateUser(userId, {
    firstName: firstName,
    lastName: lastName,
    publicMetadata: {
      ...user.publicMetadata,
      contactNo: contactNo,
    },
  });

  res.json(updatedUser);
});

// @desc    Delete a user from Clerk
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  await clerk.users.deleteUser(userId);
  res.json({ message: "User deleted successfully" });
});

// @desc    Update a user's role
const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || (role !== "admin" && role !== "user")) {
    res.status(400).json({ message: "Invalid role specified" });
    return;
  }

  // === START: THE FIX ===
  // Get the existing metadata first to avoid overwriting it
  const user = await clerk.users.getUser(userId);

  // Update only the role, keeping other metadata (like contactNo) intact
  const updatedUser = await clerk.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      role: role,
    },
  });
  // === END: THE FIX ===

  res.json(updatedUser);
});
// @desc    Get user's favorite hotels
// @route   GET /api/users/me/favorites
const getMyFavorites = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as any).auth; // Clerk eken ena user ID eka
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await clerk.users.getUser(userId);
  const favoriteHotelIds = user.privateMetadata.favorites || [];

  const favoriteHotels = await Hotel.find({ _id: { $in: favoriteHotelIds } });
  res.json(favoriteHotels);
});

// @desc    Toggle a hotel in user's favorites
// @route   POST /api/users/me/favorites
const toggleFavorite = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as any).auth;
  const { hotelId } = req.body;

  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const user = await clerk.users.getUser(userId);
  const favorites = (user.privateMetadata.favorites as string[]) || [];

  let updatedFavorites;
  if (favorites.includes(hotelId)) {
    updatedFavorites = favorites.filter((id) => id !== hotelId); // Remove
  } else {
    updatedFavorites = [...favorites, hotelId]; // Add
  }

  await clerk.users.updateUser(userId, {
    privateMetadata: { ...user.privateMetadata, favorites: updatedFavorites },
  });

  res.json({ favorites: updatedFavorites });
});

export {
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  toggleFavorite,
  getMyFavorites,
};
