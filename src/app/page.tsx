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
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [errorTrending, setErrorTrending] = useState("");

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await fetch("/api/trending");
        if (!response.ok) throw new Error("Failed to fetch trending anime.");
        const data: Anime[] = await response.json();
        setTrendingAnime(data);
      } catch (err) {
        setErrorTrending("Could not load trending anime.");
      } finally {
        setLoadingTrending(false);
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
          <button className="mt-5 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition duration-300">
            Start Exploring
          </button>
        </Link>
      </section>

      <section className="px-4 md:px-12 py-10">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">🔥 Trending Anime</h2>
        {loadingTrending && <p className="text-center text-gray-400">Loading trending anime...</p>}
        {errorTrending && <p className="text-center text-red-500">{errorTrending}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingAnime.map((anime) => (
            <div key={anime.id} className="bg-gray-800 p-4 rounded-lg shadow-lg transition hover:scale-105 hover:bg-gray-700 duration-300">
              <Image src={anime.image} alt={anime.title} width={200} height={280} className="rounded-md object-cover w-full h-64" />
              <h3 className="mt-2 text-base font-semibold truncate">{anime.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{anime.synopsis}</p>
              <Link href={anime.url} target="_blank">
                <button className="mt-3 w-full px-4 py-2 bg-blue-500 text-sm rounded-md hover:bg-blue-600 transition duration-300">
                  More Info
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-12 py-10">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">🎭 Top Anime by Genre</h2>
        <div className="space-y-6 text-gray-300 text-base">
          <div>
            <h3 className="text-lg font-semibold text-white">💥 Action</h3>
            <ul className="list-disc list-inside pl-2">
              <li>Attack on Titan</li>
              <li>Jujutsu Kaisen</li>
              <li>Vinland Saga</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">💖 Romance</h3>
            <ul className="list-disc list-inside pl-2">
              <li>Your Lie in April</li>
              <li>Toradora</li>
              <li>Clannad: After Story</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">😂 Comedy</h3>
            <ul className="list-disc list-inside pl-2">
              <li>Gintama</li>
              <li>Konosuba</li>
              <li>Great Teacher Onizuka</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">🧠 Psychological</h3>
            <ul className="list-disc list-inside pl-2">
              <li>Death Note</li>
              <li>Monster</li>
              <li>Paranoia Agent</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
