import "server-only";

export type AnimeDetails = {
  image: string | null;
  score: number | null;
  episodes: number | null;
  url: string | null;
};

const ANILIST_URL = "https://graphql.anilist.co";
const FETCH_TIMEOUT_MS = 3000;
const FAILURE_COOLDOWN_MS = 60_000;
const CACHE_LIMIT = 500;

const SEARCH_QUERY = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      idMal
      siteUrl
      averageScore
      episodes
      coverImage { large }
    }
  }
`;

type AniListMedia = {
  idMal: number | null;
  siteUrl: string | null;
  averageScore: number | null;
  episodes: number | null;
  coverImage: { large: string | null } | null;
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
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: SEARCH_QUERY, variables: { search: title } }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  // AniList answers 404 when nothing matches the search.
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`AniList API returned ${response.status}`);
  }

  const data = await response.json();
  const media = data?.data?.Media as AniListMedia | null | undefined;
  if (!media) {
    return null;
  }

  return {
    image: media.coverImage?.large ?? null,
    score: media.averageScore ? media.averageScore / 10 : null,
    episodes: media.episodes ?? null,
    url: media.idMal ? `https://myanimelist.net/anime/${media.idMal}` : null,
  };
}

export async function getAnimeDetails(title: string): Promise<AnimeDetails | null> {
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
    console.error(`AniList search failed for "${title}" (${describeError(error)})`);
    downUntil = Date.now() + FAILURE_COOLDOWN_MS;
    return null;
  }
}
