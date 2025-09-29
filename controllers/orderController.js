import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { z } from "zod";

const orderSchema = z.object({
  orderItems: z.array(
    z.object({
      product: z.string().min(1, "Product ID is required"),
      name: z.string().min(1, "Product name is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().min(0, "Price must be positive"),
      image: z.string().optional(),
    })
  ),
  shippingAddress: z.object({
    fullName: z.string().min(1, "Full name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
  itemsPrice: z.number().min(0),
  taxPrice: z.number().min(0),
  shippingPrice: z.number().min(0),
  totalPrice: z.number().min(0),
});

export const addOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = orderSchema.parse(req.body);

    // Check stock for each item first
    for (const item of validatedData.orderItems) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      if ((product.stock ?? 0) < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${
            product.stock ?? 0
          }`,
        });
      }
    }

    // Decrement stock
    for (const item of validatedData.orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );
      if (!updated) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Stock changed for an item. Please retry checkout.`,
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      ...validatedData,
    });

    const createdOrder = await order.save({ session });
    await session.commitTransaction();
    res.status(201).json(createdOrder);
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
