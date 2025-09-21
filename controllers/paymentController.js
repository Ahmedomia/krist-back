import Payment from "../models/Payment.js";
import { z } from "zod";

const paymentSchema = z
  .object({
    method: z.enum(["card", "gpay", "paypal", "cod"], {
      required_error: "Payment method is required",
    }),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
  })
  .refine(
    (data) =>
      data.method !== "card" ||
      (data.cardNumber && data.cardName && data.expiry && data.cvv),
    { message: "All card details are required for card payment" }
  );

export const addPayment = async (req, res) => {
  try {
    const validatedData = paymentSchema.parse(req.body);

    let payment = await Payment.findOne({ user: req.user._id });

    if (!payment) {
      payment = new Payment({
        user: req.user._id,
        method: validatedData.method,
      });
    } else {
      payment.method = validatedData.method;
    }

    if (validatedData.method === "card") {
      payment.setCardData(
        validatedData.cardNumber,
        validatedData.cardName,
        validatedData.expiry
      );
    } else {
      payment.cardName = undefined;
      payment.last4 = undefined;
      payment.expiry = undefined;
    }

    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
