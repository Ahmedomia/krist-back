import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Krist Shop" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanks for subscribing to Krist 🖤",
      html: `
        <h2>Welcome to Krist!</h2>
        <p>Thank you for subscribing. You’ll be the first to hear about our new collections and product launches.</p>
      `,
    });

    res.status(200).json({ message: "Subscription email sent successfully" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;
