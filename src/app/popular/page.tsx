"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function HomePage() {
  const [latestAnime, setLatestAnime] = useState<Anime[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatestAnime = async () => {
      try {
        const response = await fetch("/api/latest", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch");
        const data: { data: Anime[] } = await response.json();
        setLatestAnime(data.data.slice(0, 16));
      } catch (err) {
        console.error("Error:", err);
        setError("Could not load latest anime.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnime();
  }, []);

  if (loading)
    return <p className="text-center text-lg mt-10 text-white">Loading latest anime...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6">
      {/* Animated Header */}
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        🔥 Discover Your Next Favorite Anime
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {latestAnime.map((anime) => (
          <motion.div
            key={anime.mal_id}
            onClick={() => {
              setSelectedAnime(anime);
              setShowFullSynopsis(false);
            }}
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
                <span>{anime.episodes ? `${anime.episodes} eps` : "?? eps"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAnime && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black rounded-lg max-w-md w-full p-6 relative shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
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

              <p className="text-gray-700 text-sm mb-3 whitespace-pre-line">
                {selectedAnime.synopsis ? (
                  <>
                    {showFullSynopsis
                      ? selectedAnime.synopsis
                      : selectedAnime.synopsis.slice(0, 200) + "... "}
                    {selectedAnime.synopsis.length > 200 && (
                      <button
                        onClick={() => setShowFullSynopsis((prev) => !prev)}
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {showFullSynopsis ? "Show less" : "Read more"}
                      </button>
                    )}
                  </>
                ) : (
                  "No synopsis available."
                )}
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
                className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold py-2 px-4 rounded hover:opacity-90 transition"
              >
                View on MyAnimeList
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
