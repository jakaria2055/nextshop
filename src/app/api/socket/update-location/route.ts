import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, location } = await req.json();

    if (!userId || !location) {
      return NextResponse.json(
        { message: "Missing userid or location info" },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(userId, { location });
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 400 });
    }

    return NextResponse.json({ message: "location updated." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Location update API error: ${error}` },
      { status: 500 },
    );
  }
}
