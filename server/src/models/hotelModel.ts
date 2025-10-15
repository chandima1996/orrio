import mongoose, { Document, Schema } from "mongoose";

// Interface for TypeScript type checking
export interface IHotel extends Document {
  name: string;
  location: string;
  description?: string;
  starClass: number;
  rating: number;
  images: string[];
  amenities: string[];
  email: string;
  phone: string;
  descriptionEmbedding?: number[];
}

// Mongoose Schema Definition
const hotelSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    starClass: { type: Number, required: true },
    rating: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    email: { type: String, required: true },
    phone: { type: String, required: true },
    descriptionEmbedding: { type: [Number] },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Hotel model
const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;
