import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const PaymentForm = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/dashboard`,
      },
      redirect: "if_required", // Don't redirect immediately
    });

    if (error) {
      toast.error("Payment Failed", { description: error.message });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment Successful!");
      onPaymentSuccess(paymentIntent.id); // Pass payment ID to parent
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        disabled={isProcessing || !stripe || !elements}
        className="w-full mt-6"
      >
        {isProcessing ? "Processing..." : "Pay & Confirm"}
      </Button>
    </form>
  );
};
