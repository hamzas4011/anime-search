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

export async function getTopAnime(): Promise<JikanAnime[]> {
  const response = await fetch("https://api.jikan.moe/v4/top/anime", {
    next: { revalidate: 3600 },
  } as RequestInit);

  if (!response.ok) {
    throw new Error(`Jikan API returned ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data?.data)) {
    throw new Error("Unexpected Jikan response shape");
  }

  return data.data;
}