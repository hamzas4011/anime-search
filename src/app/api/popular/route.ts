import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Jikan API returned ${response.status}`);
      return NextResponse.json({ error: "Failed to fetch anime" }, { status: 502 });
    }

    const data = await response.json();

    if (!Array.isArray(data?.data)) {
      console.error("Unexpected Jikan response shape:", data);
      return NextResponse.json({ error: "Failed to fetch anime" }, { status: 502 });
    }

    return NextResponse.json({ data: data.data.slice(0, 16) });
  } catch (error) {
    console.error("API Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
  }
}
