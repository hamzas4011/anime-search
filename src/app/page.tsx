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
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">🗣️ Iconic Anime Quotes</h2>
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="italic text-lg">"I'm gonna be King of the Pirates!"</p>
            <p className="text-sm text-gray-400 mt-2">— Monkey D. Luffy, One Piece</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="italic text-lg">"A lesson without pain is meaningless."</p>
            <p className="text-sm text-gray-400 mt-2">— Edward Elric, Fullmetal Alchemist</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="italic text-lg">"Power comes in response to a need, not a desire."</p>
            <p className="text-sm text-gray-400 mt-2">— Goku, Dragon Ball Z</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="italic text-lg">"The world isn’t perfect. But it’s there for us, doing the best it can… that’s what makes it so damn beautiful."</p>
            <p className="text-sm text-gray-400 mt-2">— Roy Mustang, Fullmetal Alchemist</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="italic text-lg">"You should enjoy the little detours. Because that's where you'll find the things more important than what you want."</p>
            <p className="text-sm text-gray-400 mt-2">— Ging Freecss, Hunter x Hunter</p>
          </div>
        </div>
      </section>
    </main>
  );
}
