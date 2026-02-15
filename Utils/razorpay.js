import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config(); // ensure env is loaded

let razorpayInstance = null;

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "Razorpay keys are missing! Payment features will be disabled. Check your .env file for RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
  );
} else {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export default razorpayInstance;
