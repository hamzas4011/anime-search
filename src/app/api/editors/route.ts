import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Pretend the first 12 anime are editor's picks
    const picks = data.data.slice(0, 12).map((anime: any) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
      url: `https://myanimelist.net/anime/${anime.mal_id}`,
    }));

    return NextResponse.json(picks);
  } catch (error) {
    console.error("Editor Picks API Error:", error);
    return NextResponse.json({ error: "Failed to fetch editor picks" }, { status: 500 });
  }
}
