"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Anime {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  url: string;
}

export default function HomeTrending() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorTrending, setErrorTrending] = useState("");

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await fetch("/api/trending");
        if (!response.ok) throw new Error("Failed to fetch trending anime.");
        const data: Anime[] = await response.json();
        setTrendingAnime(data);
      } catch {
        setErrorTrending("Could not load trending anime.");
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingAnime();
  }, []);

  return (
    <section className="px-4 md:px-12 py-10">
      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
        🔥 Trending Anime
      </h2>
      {loadingTrending && (
        <p className="text-center text-gray-400">Loading trending anime...</p>
      )}
      {errorTrending && (
        <p className="text-center text-red-500">{errorTrending}</p>
      )}

      <div className="overflow-x-auto overflow-y-hidden hide-scrollbar">
        <div className="flex gap-6 min-w-full">
          {trendingAnime.map((anime) => (
            <div
              key={anime.id}
              className="flex-shrink-0 w-60 bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={anime.image}
                alt={anime.title}
                width={240}
                height={160}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{anime.title}</h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {anime.synopsis}
                </p>
                <Link href={anime.url} target="_blank">
                  <button className="mt-3 w-full py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-md text-white transition">
                    More Info
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
