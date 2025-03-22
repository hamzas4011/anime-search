export async function GET(): Promise<Response> {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return Response.json({ data: data.data.slice(0, 16) }); // ✅ Always return `{ data: [...] }`
  } catch (error) {
    console.error("API Fetch Error:", error);
    return Response.json({ error: "Failed to fetch latest anime" }, { status: 500 });
  }
}
