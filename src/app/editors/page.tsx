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
      <h1 className="text-3xl font-bold text-center mb-10">
        🎯 Top 10 Editor’s Picks
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {picks.map((anime, index) => (
          <div
            key={anime.id}
            tabIndex={0}
            className="group relative rounded-lg border border-gray-700 bg-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-blue-400 transition duration-200"
          >
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
              #{index + 1}
            </div>

            <Image
              src={anime.image}
              alt={anime.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded-t-lg"
            />

            <div className="p-4 space-y-2">
              <h2 className="text-base font-semibold leading-tight line-clamp-1">
                {anime.title}
              </h2>
              <p className="text-sm text-gray-300 line-clamp-3 leading-snug">
                {anime.synopsis}
              </p>

              <Link href={anime.url} target="_blank">
                <button
                  className="mt-2 w-full py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  aria-label={`View more about ${anime.title}`}
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
