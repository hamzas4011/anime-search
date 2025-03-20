export async function GET() {
    try {
      const response = await fetch("https://api.jikan.moe/v4/top/anime");
      const data = await response.json();
  
      return Response.json(data.data);
    } catch (error) {
      return Response.json({ error: "Failed to fetch popular anime" }, { status: 500 });
    }
  }
  