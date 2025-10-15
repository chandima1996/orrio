import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// @desc    Create a stripe payment intent
// @route   POST /api/payments/create-payment-intent
const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const { amount } = req.body; // Amount in USD

    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }
);

export { createPaymentIntent };
