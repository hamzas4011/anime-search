import fallbackAnime from "./fallback-anime.json";

type JikanAnime = {
  mal_id: number;
  title: string;
  synopsis: string;
  url: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

let cachedAnime: JikanAnime[] | null = null;
let inFlightRequest: Promise<JikanAnime[]> | null = null;

async function fetchOnce(): Promise<JikanAnime[]> {
  const response = await fetch("https://api.jikan.moe/v4/top/anime", {
    next: { revalidate: 21600 },
  });

  if (!response.ok) {
    throw new Error(`Jikan API returned ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data?.data)) {
    throw new Error("Unexpected Jikan response shape");
  }

  return data.data;
}

async function fetchWithRetries(): Promise<JikanAnime[]> {
  const attempts = 3;

  for (let i = 0; i < attempts; i++) {
    try {
      const result = await fetchOnce();
      cachedAnime = result;
      return result;
    } catch (error) {
      const isLastAttempt = i === attempts - 1;
      if (!isLastAttempt) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
        continue;
      }
      console.error("Jikan fetch failed after retries:", error);
      if (cachedAnime) {
        console.error("Serving in-memory stale cache");
        return cachedAnime;
      }
      console.error("Serving static fallback data");
      return fallbackAnime as JikanAnime[];
    }
  }

  return fallbackAnime as JikanAnime[];
}

export async function getTopAnime(): Promise<JikanAnime[]> {
  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetchWithRetries().finally(() => {
    inFlightRequest = null;
  });

  return inFlightRequest;
}