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

const MAX_RETRIES = 3;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTopAnime(): Promise<JikanAnime[]> {
  let lastError: Error = new Error("Jikan API request failed");

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(2 ** attempt * 250);
    }

    let response: Response;
    try {
      response = await fetch("https://api.jikan.moe/v4/top/anime", {
        next: { revalidate: 3600 },
      } as RequestInit);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }

    if (!response.ok) {
      lastError = new Error(`Jikan API returned ${response.status}`);
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES) {
        continue;
      }
      throw lastError;
    }

    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      throw new Error("Unexpected Jikan response shape");
    }

    return data.data;
  }

  throw lastError;
}