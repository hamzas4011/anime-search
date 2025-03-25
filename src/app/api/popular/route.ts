export async function GET(): Promise<Response> {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const popular = data.data.slice(0, 16).map((anime: any) => ({
      mal_id: anime.mal_id,
      title: anime.title,
      images: {
        jpg: {
          image_url: anime.images?.jpg?.image_url || ""
        }
      }
    }));

    return Response.json({ data: popular });
  } catch (error) {
    console.error("Popular API Fetch Error:", error);
    return Response.json({ error: "Failed to fetch popular anime" }, { status: 500 });
  }
}
