import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/groceryModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Role Based Access Error. User Not an Admin" },
        { status: 400 },
      );
    }

  
    

   const {groceryId} = await req.json()

    const grocery = await Grocery.findByIdAndDelete(groceryId);

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    console.error("Delete Grocery Error:", error);
    return NextResponse.json(
      { message: `Delete Grocery API Error! ${error}` },
      { status: 500 },
    );
  }
}
