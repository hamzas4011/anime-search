import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/anime', {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Jikan API returned ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch trending anime' },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error('Unexpected Jikan response shape:', data);
      return NextResponse.json(
        { error: 'Failed to fetch trending anime' },
        { status: 502 }
      );
    }

    const trendingAnime = data.data.slice(0, 4).map((anime: {
      mal_id: number;
      title: string;
      images: { jpg: { image_url: string } };
      synopsis: string;
      url: string;
    }) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
      url: anime.url,
    }));

    return NextResponse.json(trendingAnime, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending anime' }, { status: 500 });
  }
}
