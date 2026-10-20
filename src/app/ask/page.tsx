"use client";
import { useState } from "react";
import Image from "next/image";

type Recommendation = {
  title: string;
  reason: string;
  image: string | null;
  score: number | null;
  episodes: number | null;
  url: string | null;
};

const EXAMPLES = [
  "Something like Attack on Titan",
  "Short anime under 13 episodes",
  "Funny anime",
];

function malSearchUrl(title: string) {
  return `https://myanimelist.net/anime.php?q=${encodeURIComponent(title)}`;
}

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setRecommendations([]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setAnswer(data.answer);
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-3">
          🤖 Find Your Next Anime
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Name an anime you like, a genre or a mood, and AI will find your next watch.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex flex-col gap-3"
        >
          <label htmlFor="question" className="text-sm font-medium text-gray-300">
            What do you want to watch?
          </label>
          <textarea
            id="question"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(question);
              }
            }}
            maxLength={200}
            enterKeyHint="send"
            aria-describedby="question-hint"
            placeholder="e.g. dark fantasy with a strong main character"
            className="resize-none bg-gray-800 border border-gray-700 rounded px-4 py-3 text-base leading-6 text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-base font-semibold py-3 px-6 rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>
        <p id="question-hint" className="text-sm text-gray-400 mt-2">
          Up to 5 picks per question · max 200 characters
        </p>

        {!loading && !answer && !error && recommendations.length === 0 && (
          <section aria-labelledby="examples-heading" className="mt-8">
            <h2 id="examples-heading" className="text-sm font-medium text-gray-300 mb-3">
              Not sure what to ask? Try one:
            </h2>
            <ul className="flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <li key={example}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuestion(example);
                      ask(example);
                    }}
                    className="min-h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {example}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Short status for screen readers; the results themselves are not announced */}
        <p role="status" className={loading ? "mt-8 text-gray-300" : "sr-only"}>
          {loading
            ? "Finding your picks…"
            : recommendations.length > 0
              ? `Found ${recommendations.length} ${recommendations.length === 1 ? "pick" : "picks"}`
              : ""}
        </p>

        <div className="mt-8">
          {error && (
            <p role="alert" className="text-red-400 bg-gray-800 border border-red-900 rounded-xl p-4">
              {error}
            </p>
          )}
          {answer && (
            <div className="whitespace-pre-wrap leading-relaxed text-gray-200">
              {answer}
            </div>
          )}
          {recommendations.length > 0 && (
            <ul className="mt-4 space-y-4">
              {recommendations.map((rec, index) => {
                const link = rec.url ?? malSearchUrl(rec.title);
                return (
                <li
                  key={rec.title}
                  className="flex gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4"
                >
                  {rec.image && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="self-start flex-shrink-0 rounded-md overflow-hidden hover:opacity-80 transition"
                    >
                      <Image
                        src={rec.image}
                        alt=""
                        width={96}
                        height={136}
                        loading={index === 0 ? "eager" : "lazy"}
                        style={{ height: "auto" }}
                        className="w-20 sm:w-24 object-cover"
                      />
                    </a>
                  )}
                  <div className="min-w-0">
                    <h2 className="font-semibold text-white">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-300 hover:underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        {rec.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </h2>
                    {Boolean(rec.score || rec.episodes) && (
                      <p className="text-xs text-gray-400 mt-1">
                        {rec.score ? `⭐ ${rec.score}` : ""}
                        {rec.score && rec.episodes ? " · " : ""}
                        {rec.episodes ? `${rec.episodes} episodes` : ""}
                      </p>
                    )}
                    <p className="text-sm text-gray-300 mt-2 leading-relaxed">{rec.reason}</p>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 underline rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {rec.url ? "View on MyAnimeList ↗" : "Search on MyAnimeList ↗"}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
