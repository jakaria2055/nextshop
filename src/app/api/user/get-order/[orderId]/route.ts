import connectDB from "@/lib/db";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, { params }: { params: { orderId: string } }) {
  try {
    await connectDB();
    const {orderId} = await params;
    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");
    if (!order) {
      return NextResponse.json(
        { message: "order not found!" },
        { status: 400 },
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get order by id API error: ${error}` },
      { status: 500 },
    );
  }
}
