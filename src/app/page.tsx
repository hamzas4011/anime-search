import Image from "next/image";
import Link from "next/link";
import { getTopAnime } from "./lib/jikan";

export default async function Home() {
  const animeList = await getTopAnime();
  const shuffled = [...animeList].sort(() => Math.random() - 0.5);
  const trendingAnime = shuffled.slice(0, 4).map((anime) => ({
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.jpg.image_url,
    synopsis: anime.synopsis,
    url: anime.url,
  }));

  return (
    <main className="bg-gray-900 text-white">
      <section className="flex flex-col items-center justify-center text-center min-h-[20vh] px-6 pt-6 pb-2">
        <h1 className="text-4xl md:text-5xl font-bold">AnimeExplorer</h1>
        <p className="mt-2 text-lg text-gray-400">
          Discover, explore, and check out the most popular anime.
        </p>
      </section>

      <section className="px-4 md:px-12 pt-4 pb-8">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
          🔥 Trending Anime
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingAnime.map((anime) => (
            <div
              key={anime.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={anime.image}
                alt={anime.title}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
                priority
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold truncate">{anime.title}</h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {anime.synopsis}
                </p>
                <Link href={anime.url} target="_blank">
                  <button className="mt-3 w-full py-2 text-xs bg-blue-600 hover:bg-blue-700 rounded-md text-white transition">
                    More Info
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* genre section stays exactly the same, no changes needed */}
    </main>
  );
}