import { NextResponse } from "next/server";
import { getTopAnime } from "../../lib/jikan";

export async function GET() {
  try {
    const animeList = await getTopAnime();
    const shuffled = [...animeList].sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, 12).map((anime) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
      url: `https://myanimelist.net/anime/${anime.mal_id}`,
    }));

    return NextResponse.json(picks);
  } catch (error) {
    console.error("Editor Picks API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch editor picks" },
      { status: 502 }
    );
  }
}