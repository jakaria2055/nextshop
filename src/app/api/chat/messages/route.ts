import connectDB from "@/lib/db";
import Message from "@/models/messageModel";
import Order from "@/models/orderModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { roomId } = await req.json();
    const room = await Order.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "room not found" }, { status: 400 });
    }

    const messages = await Message.find({ roomId: room._id });

    return NextResponse.json(messages, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `get message API error: ${error}` },
      { status: 500 },
    );
  }
}
