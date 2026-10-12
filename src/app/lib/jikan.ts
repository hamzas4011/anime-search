import { after } from "next/server";
import fallbackAnime from "./fallback-anime.json";

type JikanAnime = {
  mal_id: number;
  title: string;
  synopsis: string;
  url: string;
  episodes: number | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

let cachedAnime: JikanAnime[] | null = null;
let lastFetchTime = 0;
let inFlightRequest: Promise<JikanAnime[]> | null = null;

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const RETRY_AFTER_FAILURE_MS = 10 * 60 * 1000;
const FETCH_TIMEOUT_MS = 25000;

async function fetchOnce(): Promise<JikanAnime[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime", {
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetries(): Promise<JikanAnime[]> {
  const attempts = 2;

  for (let i = 0; i < attempts; i++) {
    try {
      const result = await fetchOnce();
      cachedAnime = result;
      lastFetchTime = Date.now();
      return result;
    } catch (error) {
      const isLastAttempt = i === attempts - 1;
      if (!isLastAttempt) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }
      console.error("Jikan fetch failed after retries:", error);
      lastFetchTime = Date.now() - CACHE_TTL_MS + RETRY_AFTER_FAILURE_MS;
      if (cachedAnime) {
        return cachedAnime;
      }
      return fallbackAnime as JikanAnime[];
    }
  }

  return fallbackAnime as JikanAnime[];
}

export async function getTopAnime(): Promise<JikanAnime[]> {
  const isStale = Date.now() - lastFetchTime > CACHE_TTL_MS;

  if (isStale && !inFlightRequest) {
    const request = fetchWithRetries().finally(() => {
      inFlightRequest = null;
    });
    inFlightRequest = request;
    after(() => request);
  }

  return cachedAnime ?? (fallbackAnime as JikanAnime[]);
}