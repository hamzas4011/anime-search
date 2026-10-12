import { NextResponse } from "next/server";
import { getTopAnime } from "../../lib/jikan";

export async function GET() {
  try {
    const animeList = await getTopAnime();
    return NextResponse.json({ data: animeList.slice(0, 16) });
  } catch (error) {
    console.error("API Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch anime" }, { status: 502 });
  }
}