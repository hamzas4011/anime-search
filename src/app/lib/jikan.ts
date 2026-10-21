import "server-only"; 
import fallbackAnime from "./fallback-anime.json";
import type { AnimeDetails } from "./anilist";

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
      small_image_url?: string;
    };
  };
};

const JIKAN_TOP_URL = "https://api.jikan.moe/v4/top/anime";
const REVALIDATE_SECONDS = 21600;
const FETCH_TIMEOUT_MS = 2500;
const RETRY_DELAY_MS = 300;
const RATE_LIMIT_DELAY_MS = 1000;
const FAILURE_COOLDOWN_MS = 60_000; 

const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

class JikanHttpError extends Error {
  constructor(public status: number) {
    super(`Jikan API returned ${status}`);
    this.name = "JikanHttpError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
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

function isTimeout(error: unknown): boolean {
  return error instanceof Error && error.name === "TimeoutError";
}

function shouldRetry(error: unknown): boolean {
  if (error instanceof JikanHttpError) {
    return error.status === 429 || error.status >= 500;
  }
  if (isTimeout(error)) return false;
  return true;
}

function retryDelay(error: unknown): number {
  return error instanceof JikanHttpError && error.status === 429
    ? RATE_LIMIT_DELAY_MS
    : RETRY_DELAY_MS;
}

async function loadTopAnime(): Promise<JikanAnime[] | null> {
  try {
    return await fetchOnce();
  } catch (firstError) {
    if (!shouldRetry(firstError)) {
      console.error(`Jikan fetch failed, using fallback (${describeError(firstError)})`);
      return null;
    }

    await sleep(retryDelay(firstError));

    try {
      return await fetchOnce();
    } catch (secondError) {
      console.error(
        `Jikan fetch failed after retry, using fallback (${describeError(firstError)} / ${describeError(secondError)})`
      );
      return null;
    }
  }
}

let memoryCache: { data: JikanAnime[]; expires: number } | null = null;
let inFlight: Promise<JikanAnime[]> | null = null;

function refresh(): Promise<JikanAnime[]> {
  if (!inFlight) {
    inFlight = loadTopAnime()
      .then((data) => {
        if (data) {
          memoryCache = { data, expires: Date.now() + REVALIDATE_SECONDS * 1000 };
          return data;
        }
        const result = memoryCache?.data ?? (fallbackAnime as JikanAnime[]);
        memoryCache = { data: result, expires: Date.now() + FAILURE_COOLDOWN_MS };
        return result;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export async function getTopAnime(): Promise<JikanAnime[]> {
  if (memoryCache && memoryCache.expires > Date.now()) {
    return memoryCache.data;
  }

  if (memoryCache) {
    void refresh();
    return memoryCache.data;
  }

  if (IS_BUILD) {
    return refresh();
  }

  void refresh();
  return fallbackAnime as JikanAnime[];
}

// Backup for the AI page when AniList is down.
const JIKAN_SEARCH_URL = "https://api.jikan.moe/v4/anime";
const SEARCH_TIMEOUT_MS = 4000;
// Jikan allows about 3 requests per second, so searches run one at a time.
const SEARCH_SPACING_MS = 400;
const SEARCH_CACHE_LIMIT = 500;

const searchCache = new Map<string, AnimeDetails | null>();
let searchQueue: Promise<unknown> = Promise.resolve();
let searchDownUntil = 0;

async function searchOnce(title: string): Promise<AnimeDetails | null> {
  const url = `${JIKAN_SEARCH_URL}?q=${encodeURIComponent(title)}&limit=1`;
  const response = await fetch(url, { signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS) });

  if (!response.ok) {
    throw new JikanHttpError(response.status);
  }

  const data = await response.json();
  const anime = data?.data?.[0];
  if (!anime) {
    return null;
  }

  return {
    image: anime.images?.jpg?.large_image_url ?? anime.images?.jpg?.image_url ?? null,
    score: anime.score ?? null,
    episodes: anime.episodes ?? null,
    url: anime.url ?? null,
  };
}

// Resolves to undefined when the search was skipped because Jikan is down.
function queueSearch(title: string): Promise<AnimeDetails | null | undefined> {
  const run = searchQueue.then(async () => {
    // An earlier search in the queue failed; skip instead of waiting for another timeout.
    if (Date.now() < searchDownUntil) {
      return undefined;
    }
    try {
      return await searchOnce(title);
    } finally {
      await sleep(SEARCH_SPACING_MS);
    }
  });
  searchQueue = run.catch(() => undefined);
  return run;
}

export async function searchAnimeDetails(title: string): Promise<AnimeDetails | null> {
  const key = title.trim().toLowerCase();
  if (searchCache.has(key)) {
    return searchCache.get(key) ?? null;
  }
  if (Date.now() < searchDownUntil) {
    return null;
  }

  try {
    const result = await queueSearch(title);
    if (result === undefined) {
      return null;
    }
    if (searchCache.size >= SEARCH_CACHE_LIMIT) {
      searchCache.delete(searchCache.keys().next().value!);
    }
    searchCache.set(key, result);
    return result;
  } catch (error) {
    console.error(`Jikan search failed for "${title}" (${describeError(error)})`);
    // A 429 only means we were too fast; don't treat Jikan as down for that.
    if (!(error instanceof JikanHttpError && error.status === 429)) {
      searchDownUntil = Date.now() + FAILURE_COOLDOWN_MS;
    }
    return null;
  }
}