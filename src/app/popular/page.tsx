"use client";

import { useEffect, useState } from "react";

export default function PopularPage() {
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("/api/popular");

        if (!response.ok) {
          throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        setAnimeList(data.slice(0, 16));
      } catch (err) {
        setError("Failed to load anime.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading anime...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Popular Anime</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {animeList.length > 0 ? (
          animeList.map((anime: any) => (
            <div key={anime.mal_id} className="bg-gray-800 text-white rounded-lg p-4">
              <img src={anime.images?.jpg?.image_url} alt={anime.title} className="w-full h-40 object-cover rounded-md" />
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
