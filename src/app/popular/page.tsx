"use client";

import { useEffect, useState } from "react";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export default function HomePage() {
  const [latestAnime, setLatestAnime] = useState<Anime[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestAnime = async () => {
      try {
        const response = await fetch("/api/latest", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to fetch latest anime: ${response.status}`);
        }

        const data: { data: Anime[] } = await response.json();

        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid API response format");
        }

        setLatestAnime(data.data.slice(0, 16));
      } catch (err) {
        setError("Failed to load latest anime.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnime();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading latest anime...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Popular anime</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latestAnime.length > 0 ? (
          latestAnime.map((anime) => (
            <div key={anime.mal_id} className="bg-gray-800 text-white rounded-lg p-4">
              <img
                src={anime.images?.jpg?.image_url}
                alt={anime.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-lg font-semibold mt-2 text-center">{anime.title}</h2>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No anime found.</p>
        )}
      </div>
    </div>
  );
}
