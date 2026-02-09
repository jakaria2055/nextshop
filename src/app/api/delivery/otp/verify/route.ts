import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignmentModel";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderId, otp } = await req.json();

    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "orderId or OTP not found!" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "order not found!" },
        { status: 400 },
      );
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        { message: "incorrect or expired Otp" },
        { status: 400 },
      );
    }

    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();
    await order.save();

    await DeliveryAssignment.updateOne(
      { order: orderId },
      { $set: { assignedTo: null, status: "completed" } },
    );

    return NextResponse.json(
      { message: "Delivery successfully completed" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `otp verify API error: ${error}` },
      { status: 500 },
    );
  }
}
