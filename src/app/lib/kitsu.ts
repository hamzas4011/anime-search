import "server-only";
import type { AnimeDetails } from "./anilist";

const KITSU_URL = "https://kitsu.io/api/edge/anime";
const FETCH_TIMEOUT_MS = 3000;
const FAILURE_COOLDOWN_MS = 60_000;
const CACHE_LIMIT = 500;

type KitsuAnime = {
  attributes: {
    slug: string;
    averageRating: string | null;
    episodeCount: number | null;
    posterImage: { medium?: string; small?: string } | null;
  };
};

type KitsuMapping = {
  attributes: { externalSite: string; externalId: string };
};

const cache = new Map<string, AnimeDetails | null>();
let downUntil = 0;

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}

async function searchOnce(title: string): Promise<AnimeDetails | null> {
  const params = new URLSearchParams({
    "filter[text]": title,
    "page[limit]": "1",
    include: "mappings",
    "fields[anime]": "slug,averageRating,episodeCount,posterImage,mappings",
    "fields[mappings]": "externalSite,externalId",
  });
  const response = await fetch(`${KITSU_URL}?${params}`, {
    headers: { Accept: "application/vnd.api+json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Kitsu API returned ${response.status}`);
  }

  const data = await response.json();
  const anime = data?.data?.[0] as KitsuAnime | undefined;
  if (!anime) {
    return null;
  }

  const { slug, averageRating, episodeCount, posterImage } = anime.attributes;
  const malId = (data.included as KitsuMapping[] | undefined)?.find(
    (mapping) => mapping.attributes.externalSite === "myanimelist/anime"
  )?.attributes.externalId;
  const rating = averageRating ? parseFloat(averageRating) : NaN;

  return {
    image: posterImage?.medium ?? posterImage?.small ?? null,
    // Kitsu rates out of 100; show it out of 10 like AniList.
    score: Number.isFinite(rating) ? Math.round(rating) / 10 : null,
    episodes: episodeCount ?? null,
    url: malId ? `https://myanimelist.net/anime/${malId}` : `https://kitsu.app/anime/${slug}`,
  };
}

export async function getKitsuDetails(title: string): Promise<AnimeDetails | null> {
  const key = title.trim().toLowerCase();
  if (cache.has(key)) {
    return cache.get(key) ?? null;
  }
  if (Date.now() < downUntil) {
    return null;
  }

  try {
    const result = await searchOnce(title);
    if (cache.size >= CACHE_LIMIT) {
      cache.delete(cache.keys().next().value!);
    }
    cache.set(key, result);
    return result;
  } catch (error) {
    console.error(`Kitsu search failed for "${title}" (${describeError(error)})`);
    downUntil = Date.now() + FAILURE_COOLDOWN_MS;
    return null;
  }
}
