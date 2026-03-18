import { NextResponse } from "next/server";
import { getWeather } from "@/services/weather";

// Default: Istanbul, Turkey
const DEFAULT_LAT = 41.0082;
const DEFAULT_LON = 28.9784;
const DEFAULT_CITY = "Istanbul";

export async function GET() {
  try {
    const data = await getWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
