import User from "../models/User.js";
import { z } from "zod";

const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  address: z.string().optional(),
  profilePic: z.string().url("Invalid image URL").optional(),
});

export const updateUserProfile = async (req, res) => {
  try {
    const updates = updateSchema.parse(req.body);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, updates);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      email: updatedUser.email,
      address: updatedUser.address,
      profilePic: updatedUser.profilePic,
      token: req.headers.authorization.split(" ")[1],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};
