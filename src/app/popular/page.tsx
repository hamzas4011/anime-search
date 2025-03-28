"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Anime {
  mal_id: number;
  title: string;
  synopsis?: string;
  type?: string;
  score?: number;
  episodes?: number;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export default function PopularPage() {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        const response = await fetch("/api/popular", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch");
        const data: { data: Anime[] } = await response.json();
        setPopularAnime(data.data.slice(0, 16));
      } catch (err) {
        console.error("Error:", err);
        setError("Could not load popular anime.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAnime();
  }, []);

  if (loading)
    return <p className="text-center text-lg mt-10">Loading popular anime...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        🌟 Popular Anime
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {popularAnime.map((anime) => (
          <motion.div
            key={anime.mal_id}
            onClick={() => setSelectedAnime(anime)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gray-900 cursor-pointer text-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
          >
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1 truncate">
                {anime.title}
              </h2>
              <div className="flex justify-between text-sm text-gray-300">
                <span>{anime.type ?? "Unknown"}</span>
                <span>⭐ {anime.score ?? "N/A"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedAnime && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white text-black rounded-lg max-w-md w-full p-6 relative shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <img
              src={selectedAnime.images.jpg.image_url}
              alt={selectedAnime.title}
              className="w-full h-56 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedAnime.title}</h2>
            <p className="text-gray-700 text-sm mb-3">
              {selectedAnime.synopsis
                ? selectedAnime.synopsis.slice(0, 300) + "..."
                : "No description available."}
            </p>
            <ul className="text-sm text-gray-800 space-y-1 mb-4">
              <li><strong>Type:</strong> {selectedAnime.type ?? "Unknown"}</li>
              <li><strong>Episodes:</strong> {selectedAnime.episodes ?? "?"}</li>
              <li><strong>Score:</strong> {selectedAnime.score ?? "N/A"}</li>
            </ul>
            <a
              href={`https://myanimelist.net/anime/${selectedAnime.mal_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              View on MyAnimeList
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
}
