import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import hotelRoutes from "./routes/hotelRoutes";
import roomRoutes from "./routes/roomRoutes";
import userRoutes from "./routes/userRoutes";
import taxRoutes from "./routes/taxRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Orrio Backend! 👋");
});

app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/taxes", taxRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
