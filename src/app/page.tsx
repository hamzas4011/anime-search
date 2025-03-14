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

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await fetch("/api/trending"); // Make sure this matches your API path
        if (!response.ok) throw new Error("Failed to fetch trending anime");
        
        const data = await response.json();
        setTrendingAnime(data);
      } catch (err) {
        setError("Could not load anime. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingAnime();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <section className="flex flex-col items-center justify-center text-center h-[50vh] px-6">
        <h1 className="text-4xl md:text-5xl font-bold">AnimeExplorer</h1>
        <p className="mt-3 text-lg text-gray-400">Discover, explore, and track your favorite anime.</p>
        <Link href="/explore">
          <button className="mt-5 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium">
            Start Exploring
          </button>
        </Link>
      </section>

      <section className="px-4 md:px-12 py-10">
        <h2 className="text-2xl font-semibold mb-4">🔥 Trending Anime</h2>

        {loading && <p className="text-center text-gray-400">Loading anime...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingAnime.map((anime) => (
            <div key={anime.id} className="bg-gray-800 p-3 rounded-lg">
              <Image src={anime.image} alt={anime.title} width={200} height={280} className="rounded-md" />
              <h3 className="mt-2 text-base font-medium">{anime.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{anime.synopsis}</p>
              <Link href={anime.url} target="_blank">
                <button className="mt-3 px-4 py-1 bg-blue-500 text-sm rounded-md hover:bg-blue-600">
                  More Info
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
