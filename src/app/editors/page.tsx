import Image from "next/image";
import { getTopAnime } from "../lib/jikan";

export const revalidate = 21600;

function shuffle<T>(list: T[]): T[] {
  return [...list].sort(() => Math.random() - 0.5);
}

export default async function EditorsPage() {
  const animeList = await getTopAnime();

  const picks = shuffle(animeList)
    .slice(0, 12)
    .map((anime) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
      url: `https://myanimelist.net/anime/${anime.mal_id}`,
    }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-10">
        🎯 Top 12 Editor’s Picks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {picks.map((anime, index) => (
          <article
            key={anime.id}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-md hover:shadow-blue-400/30 hover:scale-[1.03] active:scale-[0.98] transition overflow-hidden flex flex-col"
            aria-labelledby={`anime-title-${index}`}
            aria-describedby={`anime-desc-${index}`}
          >
            <Image
              src={anime.image}
              alt={`Cover for ${anime.title}`}
              width={400}
              height={560}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              preload={index < 4}
              className="w-full h-56 object-cover"
            />

            <div className="p-4 space-y-2 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between gap-2">
                <h2
                  id={`anime-title-${index}`}
                  className="text-base font-bold leading-snug line-clamp-2"
                >
                  {anime.title}
                </h2>
                <span className="text-xs bg-white text-black font-bold px-2 py-1 rounded">
                  #{index + 1}
                </span>
              </div>

              <p
                id={`anime-desc-${index}`}
                className="text-sm text-gray-300 leading-snug line-clamp-2"
              >
                {anime.synopsis || "No description available."}
              </p>

              <a
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-sm font-semibold py-2 px-4 rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 mt-auto"
                aria-label={`View more about ${anime.title}`}
              >
                View More
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}