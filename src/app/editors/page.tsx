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

export default function EditorsPage() {
  const [picks, setPicks] = useState<Anime[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await fetch("/api/editors");
        if (!res.ok) throw new Error("Failed to load editor's picks");
        const data: Anime[] = await res.json();
        setPicks(data);
      } catch {
        setError("Could not load editor’s picks.");
      }
    };

    fetchPicks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">🎯 Top 12 Editor’s Picks</h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {picks.map((anime, index) => (
          <div
            key={anime.id}
            tabIndex={0}
            className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-800 shadow-md hover:shadow-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              #{index + 1}
            </div>

            <Image
              src={anime.image}
              alt={anime.title}
              width={400}
              height={250}
              className="w-full h-52 object-cover rounded-t-lg"
            />

            <div className="p-4 space-y-2">
              <h2 className="text-base font-semibold truncate">{anime.title}</h2>
              <p className="text-sm text-gray-300 leading-snug line-clamp-3">
                {anime.synopsis}
              </p>

              <Link href={anime.url} target="_blank">
                <button
                  className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`More info about ${anime.title}`}
                >
                  More Info
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
