import { NextResponse } from 'next/server';
import { getTopAnime } from '../../lib/jikan';

export async function GET() {
  try {
    const animeList = await getTopAnime();
    const shuffled = [...animeList].sort(() => Math.random() - 0.5);

    const trendingAnime = shuffled.slice(0, 4).map((anime) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
      url: anime.url,
    }));

    return NextResponse.json(trendingAnime, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending anime' }, { status: 502 });
  }
}