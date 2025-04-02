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
      <h1 className="text-2xl sm:text-3xl font-semibold text-center text-white mb-10">
        🎯 Editor’s Pick: Handpicked Favorites
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {picks.map((anime) => (
          <div
            key={anime.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-400/30 transition duration-300 border border-gray-700"
          >
            <Image
              src={anime.image}
              alt={anime.title}
              width={400}
              height={600}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold truncate">{anime.title}</h2>
              <p className="text-sm text-gray-400 mt-2 line-clamp-3">
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
