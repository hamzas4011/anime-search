import fallbackAnime from "./fallback-anime.json";

export type JikanAnime = {
  mal_id: number;
  title: string;
  synopsis: string;
  url: string;
  score?: number | null;
  episodes: number | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

const JIKAN_TOP_URL = "https://api.jikan.moe/v4/top/anime";
const REVALIDATE_SECONDS = 21600; // 6 timer
const FETCH_TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT_DELAY_MS = 2000;

class JikanHttpError extends Error {
  constructor(public status: number) {
    super(`Jikan API returned ${status}`);
    this.name = "JikanHttpError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOnce(): Promise<JikanAnime[]> {
  const response = await fetch(JIKAN_TOP_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new JikanHttpError(response.status);
  }

  const data = await response.json();

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    throw new Error("Unexpected Jikan response shape");
  }

  return data.data as JikanAnime[];
}

function shouldRetry(error: unknown): boolean {
  if (error instanceof JikanHttpError) {
    // Retry on rate limit and server errors, not on other 4xx
    return error.status === 429 || error.status >= 500;
  }
  // Timeouts, network errors, bad JSON
  return true;
}

function retryDelay(error: unknown): number {
  return error instanceof JikanHttpError && error.status === 429
    ? RATE_LIMIT_DELAY_MS
    : RETRY_DELAY_MS;
}

export async function getTopAnime(): Promise<JikanAnime[]> {
  try {
    return await fetchOnce();
  } catch (firstError) {
    if (!shouldRetry(firstError)) {
      console.error("Jikan fetch failed, using fallback:", firstError);
      return fallbackAnime as JikanAnime[];
    }

    console.warn("Jikan first attempt failed, retrying:", firstError);
    await sleep(retryDelay(firstError));

    try {
      return await fetchOnce();
    } catch (secondError) {
      console.error("Jikan fetch failed after retry, using fallback:", secondError);
      return fallbackAnime as JikanAnime[];
    }
  }
}