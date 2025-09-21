import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    method: {
      type: String,
      enum: ["card", "paypal", "gpay", "cod"],
      required: true,
    },

    cardName: { type: String },
    last4: { type: String },
    expiry: { type: String },
    transactionId: { type: String },

    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

paymentSchema.methods.setCardData = function (cardNumber, cardName, expiry) {
  if (cardNumber) {
    this.last4 = cardNumber.slice(-4);
  }
  this.cardName = cardName;
  this.expiry = expiry;
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
