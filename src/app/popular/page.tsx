"use client";

import { useEffect, useState } from "react";

export default function PopularPage() {
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/popular")
      .then((res) => res.json())
      .then((data) => setAnimeList(data.slice(0, 16)))
      .catch(() => setError("Failed to load anime."));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Popular Anime</h1>
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {animeList.map((anime: any) => (
            <div key={anime.mal_id} className="bg-gray-800 text-white rounded-lg p-4">
              <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-40 object-cover rounded-md" />
              <h2 className="text-lg font-semibold mt-2 text-center">{anime.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
