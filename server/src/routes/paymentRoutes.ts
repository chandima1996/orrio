import express from "express";
import { createPaymentIntent } from "../controllers/paymentController";
const router = express.Router();
router.route("/create-payment-intent").post(createPaymentIntent);
export default router;
