"use client";
import { useState } from "react";

const EXAMPLES = [
  "Recommend anime like Attack on Titan",
  "A short, funny anime for a weekend",
  "Best romance anime for beginners",
];

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-3">
          🤖 Ask AI
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Get anime recommendations or ask anything about anime.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <label htmlFor="question" className="sr-only">
            Your question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={500}
            placeholder="e.g. Anime like Demon Slayer?"
            className="flex-grow bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-semibold py-2 px-6 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuestion(example);
                ask(example);
              }}
              disabled={loading}
              className="text-xs bg-gray-800 border border-gray-700 hover:border-blue-400 rounded-full px-3 py-1 transition disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="mt-8">
          {error && (
            <p role="alert" className="text-red-400 bg-gray-800 border border-red-900 rounded-xl p-4">
              {error}
            </p>
          )}
          {answer && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 whitespace-pre-wrap leading-relaxed text-gray-200">
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
