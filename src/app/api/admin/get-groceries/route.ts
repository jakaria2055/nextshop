import connectDB from "@/lib/db";
import Grocery from "@/models/groceryModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const groceries = await Grocery.find({});

    return NextResponse.json(groceries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Get groceries API error: ${error}` },
      { status: 500 },
    );
  }
}
