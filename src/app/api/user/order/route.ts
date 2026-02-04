import connectDB from "@/lib/db";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();
    if (!items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "All Credentials Required!" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Order place API error: ${error}` },
      { status: 500 },
    );
  }
}
