import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }


    // Check if user is populated
    if (!order.user || typeof order.user === "string") {
      return NextResponse.json(
        { message: "user information not found" },
        { status: 400 },
      );
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    order.deliveryOtp = otp;
    await order.save();

    // Access email from populated user
    const userEmail = (order.user as any).email;


    if (!userEmail) {
      return NextResponse.json(
        { message: "user email not found" },
        { status: 400 },
      );
    }

    await sendMail(
      userEmail,
      "NextShop Delivery OTP",
      `<h2>NextShop Delivery OTP is <strong>${otp}</strong></h2>`,
    );

    return NextResponse.json(
      { message: "otp sent successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Send OTP API error:", error);
    return NextResponse.json(
      { message: `sent otp API error: ${error}` },
      { status: 500 } 
    );
  }
}
