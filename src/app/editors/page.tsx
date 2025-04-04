"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Anime {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  url: string;
}

export default function EditorsPage() {
  const [picks, setPicks] = useState<Anime[]>([]);
  const [error, setError] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await fetch("/api/editors", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load editor's picks");
        const data: Anime[] = await res.json();
        setPicks(data.slice(0, 12));
      } catch {
        setError("Could not load editor’s picks.");
      } finally {
        setLoading(false);
      }
    };

    fetchPicks();
  }, []);

  if (loading)
    return <p className="text-center text-lg mt-10 text-white">Loading editor’s picks...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
        🎯 Top 12 Editor’s Picks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {picks.map((anime, index) => (
          <motion.div
            key={anime.id}
            onClick={() => {
              setSelectedAnime(anime);
              setSelectedIndex(index + 1);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800 rounded-xl cursor-pointer overflow-hidden shadow-md hover:shadow-blue-400/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          >
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-base font-bold truncate">{anime.title}</h2>
              <p className="text-sm text-gray-300 leading-snug line-clamp-2">
                {anime.synopsis ?? "No description available."}
              </p>
              <div className="flex justify-end text-sm text-white font-bold">
                🏅 #{index + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedAnime && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="anime-title"
        >
          <motion.div
            className="bg-white text-black rounded-lg max-w-md w-full p-6 relative shadow-2xl pt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => {
                setSelectedAnime(null);
                setSelectedIndex(null);
              }}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Close modal"
            >
              ×
            </button>

            <img
              src={selectedAnime.image}
              alt={`Poster of ${selectedAnime.title}`}
              className="w-full h-56 object-cover rounded-md mb-4"
            />

            <h2 id="anime-title" className="text-2xl font-bold mb-2">
              {selectedAnime.title}
            </h2>

            <div className="text-sm text-gray-800 font-semibold mb-2">
              🏅 Ranked #{selectedIndex}
            </div>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {selectedAnime.synopsis
                ? `${selectedAnime.synopsis.slice(0, 200)}...`
                : "No description available."}
              {selectedAnime.synopsis && (
                <a
                  href={selectedAnime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:underline text-sm"
                >
                  Read more
                </a>
              )}
            </p>

            <a
              href={selectedAnime.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              View on External Site
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
}
