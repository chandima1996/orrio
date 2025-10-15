import { Clerk } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Hotel from "../models/hotelModel";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await clerk.users.getUserList();
  res.json(users);
});

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

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  await clerk.users.deleteUser(userId);
  res.json({ message: "User deleted successfully" });
});

const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || (role !== "admin" && role !== "user")) {
    res.status(400).json({ message: "Invalid role specified" });
    return;
  }

  const user = await clerk.users.getUser(userId);

  const updatedUser = await clerk.users.updateUser(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      role: role,
    },
  });

  res.json(updatedUser);
});
const getMyFavorites = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as any).auth;
  if (!userId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await clerk.users.getUser(userId);
  const favoriteHotelIds = user.privateMetadata.favorites || [];

  const favoriteHotels = await Hotel.find({ _id: { $in: favoriteHotelIds } });
  res.json(favoriteHotels);
});

const toggleFavorite = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = (req as any).auth;
  const { hotelId } = req.body;

  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const user = await clerk.users.getUser(userId);
  const favorites = (user.privateMetadata.favorites as string[]) || [];

  let updatedFavorites;
  if (favorites.includes(hotelId)) {
    updatedFavorites = favorites.filter((id) => id !== hotelId);
  } else {
    updatedFavorites = [...favorites, hotelId];
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
