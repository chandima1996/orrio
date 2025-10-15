import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  hotel: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  roomNumber: string;
  user: string; // Clerk User ID
  checkInDate: Date;
  checkOutDate: Date;
  guests: { adults: number; children: number };
  totalPrice: number;
  bookingStatus: "pending" | "paid" | "cancelled";
  paymentDetails?: {
    paymentId: string;
    paymentMethod: string;
  };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    address: string;
  };
}

const bookingSchema: Schema = new Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Room" },
    roomNumber: { type: String, required: true },
    user: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: {
      adults: { type: Number, required: true },
      children: { type: Number, default: 0 },
    },
    totalPrice: { type: Number, required: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    paymentDetails: { type: Object },
    guestInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      contactNo: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
