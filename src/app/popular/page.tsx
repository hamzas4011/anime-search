"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Anime {
  mal_id: number;
  title: string;
  synopsis?: string;
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

  useEffect(() => {
    const fetchLatestAnime = async () => {
      try {
        const response = await fetch("/api/latest", { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data: { data: Anime[] } = await response.json();
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
      <h1 className="text-3xl font-bold text-center mb-6">Popular Anime</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latestAnime.map((anime) => (
          <motion.div
            key={anime.mal_id}
            className="bg-gray-800 text-white rounded-lg p-4 cursor-pointer hover:scale-105 transform transition duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAnime(anime)}
          >
            <img
              src={anime.images?.jpg?.image_url}
              alt={anime.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2 text-center">{anime.title}</h2>
          </motion.div>
        ))}
      </div>

      {/* Modal for selected anime */}
      {selectedAnime && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            className="bg-white text-black p-6 rounded-lg max-w-md w-full shadow-xl relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
            <img
              src={selectedAnime.images.jpg.image_url}
              alt={selectedAnime.title}
              className="w-full h-56 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedAnime.title}</h2>
            <p className="text-sm text-gray-700">
              {selectedAnime.synopsis || "No synopsis available."}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
