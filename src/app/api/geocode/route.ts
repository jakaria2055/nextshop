import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { message: "Latitude and longitude required" },
        { status: 400 }
      );
    }

    const result = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "NextShop",
        },
      }
    );

    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { message: "Geocoding failed" },
      { status: 500 }
    );
  }
}