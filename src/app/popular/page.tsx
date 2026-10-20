"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Anime {
  mal_id: number;
  title: string;
  synopsis?: string;
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
        const response = await fetch("/api/popular");
        if (!response.ok) throw new Error("Failed to fetch popular anime");
        const { data } = await response.json();
        setPopularAnime(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Could not load popular anime.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAnime();
  }, []);

  useEffect(() => {
    if (!selectedAnime) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedAnime(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedAnime]);

  if (loading)
    return <p className="text-center text-lg mt-10 text-white">Loading popular anime...</p>;

  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-10">
        🏆 Most Popular Anime of All Time
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {popularAnime.map((anime) => (
          <motion.div
            key={anime.mal_id}
            onClick={() => setSelectedAnime(anime)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedAnime(anime);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Show details for ${anime.title}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800 rounded-xl cursor-pointer overflow-hidden shadow-md hover:shadow-blue-400/30 border border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition duration-300"
          >
            <div className="relative w-full h-56">
              <Image
                src={anime.images.jpg.image_url}
                alt={anime.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              <h2 className="text-base font-bold truncate">{anime.title}</h2>
              <p className="text-sm text-gray-300 leading-snug line-clamp-2">
                {anime.synopsis ?? "No description available."}
              </p>
              <div className="flex justify-end text-sm text-white font-bold">
                ⭐ {anime.score ?? "N/A"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedAnime && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAnime(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="anime-title"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl pt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="relative w-full h-56 mb-4">
              <Image
                src={selectedAnime.images.jpg.image_url}
                alt={`Poster of ${selectedAnime.title}`}
                fill
                sizes="(min-width: 768px) 28rem, 100vw"
                className="object-cover rounded-md"
              />
            </div>

            <h2 id="anime-title" className="text-2xl font-bold mb-2">
              {selectedAnime.title}
            </h2>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {selectedAnime.synopsis
                ? `${selectedAnime.synopsis.slice(0, 200)}...`
                : "No description available."}
              {selectedAnime.synopsis && (
                <a
                  href={`https://myanimelist.net/anime/${selectedAnime.mal_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 hover:underline text-sm"
                >
                  Read more
                </a>
              )}
            </p>

            <ul className="text-sm text-gray-800 space-y-1 mb-4">
              <li>
                <strong>Episodes:</strong> {selectedAnime.episodes ?? "?"}
              </li>
              <li>
                <strong>Score:</strong> {selectedAnime.score ?? "N/A"}
              </li>
            </ul>

            <a
              href={`https://myanimelist.net/anime/${selectedAnime.mal_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              View on MyAnimeList
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
}