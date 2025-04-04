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
    <main className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
        🎯 Top 12 Editor’s Picks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {picks.map((anime, index) => (
          <motion.article
            key={anime.id}
            whileHover={{ scale: 1.02 }}
            className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-md hover:shadow-blue-400/30 transition overflow-hidden flex flex-col"
            tabIndex={0}
            aria-labelledby={`anime-title-${index}`}
            aria-describedby={`anime-desc-${index}`}
          >
            <img
              src={anime.image}
              alt={`Cover for ${anime.title}`}
              className="w-full h-56 object-cover"
            />

            <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
              <div className="flex items-center justify-between">
                <h2 id={`anime-title-${index}`} className="text-base font-bold truncate">
                  {anime.title}
                </h2>
                <span className="text-xs bg-white text-black font-bold px-2 py-1 rounded">
                  #{index + 1}
                </span>
              </div>

              <p
                id={`anime-desc-${index}`}
                className="text-sm text-gray-300 leading-snug line-clamp-2"
              >
                {anime.synopsis || "No description available."}
              </p>

              <span className="inline-block w-fit text-xs font-medium px-2 py-1 bg-blue-600 rounded-md text-white">
                Editor’s Pick
              </span>

              <a
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto block w-full text-center bg-blue-600 hover:bg-blue-700 text-sm font-semibold rounded-md py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`View more about ${anime.title}`}
              >
                View More
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  );
}
