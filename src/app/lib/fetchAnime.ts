export type Anime = {
  mal_id: number;
  title: string;
  synopsis: string;
  url: string;
  score?: number;
  episodes?: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

const JIKAN_TIMEOUT_MS = 4000;

async function fetchFromJikan(): Promise<Anime[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), JIKAN_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime", {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Jikan API returned ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data?.data) || data.data.length === 0) {
      throw new Error("Unexpected Jikan response shape");
    }

    return data.data;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromApi(): Promise<Anime[]> {
  const response = await fetch("/api/popular");

  if (!response.ok) {
    throw new Error("Failed to fetch anime");
  }

  const data: { data: Anime[] } = await response.json();
  return data.data;
}

export async function fetchTopAnime(): Promise<Anime[]> {
  try {
    return await fetchFromJikan();
  } catch (error) {
    console.warn("Jikan unavailable, using fallback:", error);
    return fetchFromApi();
  }
}

export function shuffle<T>(list: T[]): T[] {
  return [...list].sort(() => Math.random() - 0.5);
}