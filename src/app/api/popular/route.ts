import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ data: data.data.slice(0, 16) });
  } catch (error) {
    console.error("API Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
  }
}
