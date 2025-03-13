import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/hero-banner.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold">Welcome to AnimeWorld</h1>
          <p className="mt-4 text-lg text-gray-300">Discover and explore your favorite anime collections</p>
          <Link href="/explore">
            <button className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold">
              Explore Now
            </button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 md:px-12">
        <h2 className="text-3xl font-bold mb-6">🔥 Trending Anime</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <Image src={`/anime-${index + 1}.jpg`} alt="Anime" width={200} height={300} className="rounded-md" />
              <h3 className="mt-2 text-lg font-semibold">Anime Title</h3>
              <p className="text-sm text-gray-400">Action, Adventure</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 md:px-12">
        <h2 className="text-3xl font-bold mb-6">📅 Latest Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <Image src={`/anime-${index + 6}.jpg`} alt="Anime" width={200} height={300} className="rounded-md" />
              <h3 className="mt-2 text-lg font-semibold">New Anime {index + 1}</h3>
              <p className="text-sm text-gray-400">Fantasy, Drama</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-center">
        <h2 className="text-3xl font-bold">Join the Anime Community</h2>
        <p className="text-lg mt-4">Sign up to save your favorites and track your watchlist</p>
        <Link href="/signup">
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-200">
            Sign Up Now
          </button>
        </Link>
      </section>
    </main>
  );
}
