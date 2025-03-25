export async function GET(): Promise<Response> {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Map to your frontend's expected format
    const latest = data.data.slice(0, 16).map((anime: any) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images?.jpg?.image_url || "",
      synopsis: anime.synopsis || "",
      url: anime.url || "#"
    }));

    return Response.json({ data: latest });
  } catch (error) {
    console.error("Latest Anime API Error:", error);
    return Response.json({ error: "Failed to fetch latest anime" }, { status: 500 });
  }
}
