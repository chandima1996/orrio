import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  hotel: mongoose.Types.ObjectId;
  type: string;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  beds: { king: number; queen: number };
  capacity: number;
  size: number;
  roomNumbers: { number: string; isAvailable: boolean }[];
}

const roomSchema: Schema = new Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
      index: true,
    },
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    beds: {
      king: { type: Number, default: 0 },
      queen: { type: Number, default: 0 },
    },
    capacity: { type: Number, required: true },
    size: { type: Number, required: true },
    roomNumbers: [
      { number: String, isAvailable: { type: Boolean, default: true } },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;
