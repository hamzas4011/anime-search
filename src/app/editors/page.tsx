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
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        🎯 Top 10 Editor’s Picks
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {picks.map((anime, index) => (
          <div
            key={anime.id}
            className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:shadow-blue-500/40 transition duration-300"
          >
            <div className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded-full z-10">
              #{index + 1}
            </div>
            <Image
              src={anime.image}
              alt={anime.title}
              width={400}
              height={600}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold truncate">{anime.title}</h2>
              <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                {anime.synopsis}
              </p>
              <Link href={anime.url} target="_blank">
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition">
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
