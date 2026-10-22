"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { AI_EXAMPLES, askUrl } from "./lib/ai-examples";

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
        if (!response.ok) throw new Error("Failed to fetch trending anime");
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
    <div className="bg-gray-900 text-white">
      <section className="flex flex-col items-center justify-center text-center min-h-[20vh] px-6 pt-6 pb-2">
        <h1 className="text-4xl md:text-5xl font-bold">AnimeExplorer</h1>
        <p className="mt-2 text-lg text-gray-400">
          Discover popular anime, or let AI pick your next watch.
        </p>

        <label htmlFor="home-ai-question" className="mt-6 text-base text-gray-300">
          Not sure what to watch? Describe it and AI will pick for you.
        </label>
        <Form action="/ask" className="mt-3 w-full max-w-xl flex flex-col sm:flex-row gap-2">
          <input
            id="home-ai-question"
            name="q"
            type="text"
            required
            maxLength={200}
            enterKeyHint="send"
            placeholder="🤖 e.g. Please suggest some sad anime"
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-base text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base font-semibold py-3 px-6 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Ask AI
          </button>
        </Form>

        <ul aria-label="Example questions" className="mt-3 flex flex-wrap justify-center gap-2">
          {AI_EXAMPLES.map((example) => (
            <li key={example}>
              <Link
                href={askUrl(example)}
                className="inline-flex items-center min-h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {example}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 md:px-12 pt-4 pb-8">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
          🔥 Trending Anime
        </h2>
        {loadingTrending && (
          <p className="text-center text-gray-400">Loading trending anime...</p>
        )}
        {errorTrending && (
          <p className="text-center text-red-500">{errorTrending}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingAnime.map((anime, index) => (
            <div
              key={anime.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={anime.image}
                alt={anime.title}
                width={400}
                height={250}
                loading={index < 4 ? "eager" : "lazy"}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold truncate">{anime.title}</h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {anime.synopsis}
                </p>
                <Link
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`More info about ${anime.title} (opens in a new tab)`}
                  className="block mt-3 w-full py-3 text-sm text-center bg-blue-600 hover:bg-blue-700 rounded-md text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  More Info
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-12 pt-4 pb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
          🎭 Top Anime by Genre
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 border-l-4 border-blue-500 p-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-bold text-blue-400 mb-1">💥 Action</h3>
            <p className="text-sm text-gray-400 mb-3">
              High-energy battles and epic fight scenes.
            </p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition">
                • Attack on Titan
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Jujutsu Kaisen
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Vinland Saga
              </li>
            </ul>
            <Link
              href="https://myanimelist.net/anime/genre/1/Action"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="block mt-3 py-1 text-sm text-blue-400 hover:underline">
                Explore Action Anime →
              </span>
            </Link>
          </div>

          <div className="bg-gray-800 border-l-4 border-pink-500 p-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-bold text-pink-400 mb-1">💖 Romance</h3>
            <p className="text-sm text-gray-400 mb-3">
              Heartfelt stories of love, connection, and emotion.
            </p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition">
                • Your Lie in April
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Toradora
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Clannad: After Story
              </li>
            </ul>
            <Link
              href="https://myanimelist.net/anime/genre/22/Romance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="block mt-3 py-1 text-sm text-pink-400 hover:underline">
                Explore Romance Anime →
              </span>
            </Link>
          </div>

          <div className="bg-gray-800 border-l-4 border-yellow-400 p-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-bold text-yellow-300 mb-1">😂 Comedy</h3>
            <p className="text-sm text-gray-400 mb-3">
              Hilarious characters and over-the-top fun moments.
            </p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition">
                • Gintama
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Konosuba
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Great Teacher Onizuka
              </li>
            </ul>
            <Link
              href="https://myanimelist.net/anime/genre/4/Comedy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="block mt-3 py-1 text-sm text-yellow-300 hover:underline">
                Explore Comedy Anime →
              </span>
            </Link>
          </div>

          <div className="bg-gray-800 border-l-4 border-purple-500 p-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300">
            <h3 className="text-xl font-bold text-purple-400 mb-1">
              🧠 Psychological
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Mind-bending plots and intense character studies.
            </p>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li className="hover:text-white hover:translate-x-1 transition">
                • Death Note
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Monster
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                • Paranoia Agent
              </li>
            </ul>
            <Link
              href="https://myanimelist.net/anime/genre/40/Psychological"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="block mt-3 py-1 text-sm text-purple-400 hover:underline">
                Explore Psychological Anime →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}