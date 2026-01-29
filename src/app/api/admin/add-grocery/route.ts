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

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const unit = formData.get("unit") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;

    // Validation
    if (!name || !category || !unit || !price) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const grocery = await Grocery.create({
      name,
      category,
      unit,
      price,
      image: imageUrl,
    });

    return NextResponse.json(grocery, { status: 201 });
  } catch (error) {
    console.error("Create Grocery Error:", error);
    return NextResponse.json(
      { message: `Create Grocery API Error! ${error}` },
      { status: 500 },
    );
  }
}
