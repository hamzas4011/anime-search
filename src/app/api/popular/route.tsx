export async function GET() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const data = await response.json();

    return Response.json(data.data.slice(0, 16)); 
  } catch (error) {
    return Response.json({ error: "Failed to fetch anime." }, { status: 500 });
  }
}
