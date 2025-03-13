import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
        <h2 className="text-2xl font-semibold mb-4">Trending Anime</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-800 p-3 rounded-lg">
              <Image src={`/anime-${index + 1}.jpg`} alt="Anime" width={200} height={280} className="rounded-md" />
              <h3 className="mt-2 text-base font-medium">Anime {index + 1}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-12 py-10">
        <h2 className="text-2xl font-semibold mb-4">Latest Releases</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-800 p-3 rounded-lg">
              <Image src={`/anime-${index + 6}.jpg`} alt="Anime" width={200} height={280} className="rounded-md" />
              <h3 className="mt-2 text-base font-medium">New Anime {index + 1}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
