"use client";

import { useEffect, useState } from "react";

export default function PopularPage() {
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        const response = await fetch("/api/popular");

        if (!response.ok) throw new Error(`Failed to fetch anime: ${response.status}`);

        const data = await response.json();
        setAnimeList(data.slice(0, 16)); 
      } catch (err) {
        setError("Failed to load popular anime. Please try again later.");
        console.error("Fetch error:", err);
      }
    };

    fetchPopularAnime();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Popular Anime</h1>
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {animeList.map((anime: any) => (
            <div key={anime.mal_id} className="bg-gray-800 text-white rounded-lg shadow-md p-4">
              <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-lg font-semibold mt-2 text-center">{anime.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
