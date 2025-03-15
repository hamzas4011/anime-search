import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/seasons/now');
    const data = await response.json();

    const latestAnime = data.data.slice(0, 5).map((anime: any) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
      url: anime.url,
    }));

    return NextResponse.json(latestAnime, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch latest anime' }, { status: 500 });
  }
}
