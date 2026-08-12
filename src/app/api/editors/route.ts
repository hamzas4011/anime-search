import { NextResponse } from "next/server";

type JikanAnime = {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

export async function GET() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Jikan API returned ${response.status}`);
      return NextResponse.json({ error: "Failed to fetch editor picks" }, { status: 502 });
    }

    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error("Unexpected Jikan response shape:", data);
      return NextResponse.json({ error: "Failed to fetch editor picks" }, { status: 502 });
    }

    const shuffled = data.data.sort(() => Math.random() - 0.5);
    const picks = (shuffled as JikanAnime[]).slice(0, 12).map((anime) => ({
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
      { status: 500 }
    );
  }
}
