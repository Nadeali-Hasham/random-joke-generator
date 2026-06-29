"use client";

import { useEffect, useState } from "react";

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

export default function RandomJoke() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRandomJoke = async () => {
    setLoading(true);
    setShowPunchline(false);
    try {
      const res = await fetch(
        "https://official-joke-api.appspot.com/random_joke",
      );
      if (!res.ok) throw new Error("Failed to fetch joke");
      const data = await res.json();
      setJoke(data);
    } catch (error) {
      console.error("Error fetching joke:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomJoke();
  }, []);

  const handleReveal = () => setShowPunchline(true);
  const handleHide = () => setShowPunchline(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 to-black px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          😄 Random Joke Generator
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : joke ? (
          <div className="space-y-6">
            {/* Setup */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <p className="text-sm text-gray-500 font-medium mb-2">Setup:</p>
              <p className="text-xl font-semibold text-gray-800">
                {joke.setup}
              </p>
            </div>

            {/* Punchline */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 min-h-[80px] flex flex-col justify-center">
              <p className="text-sm text-gray-500 font-medium mb-2">
                Punchline:
              </p>
              {showPunchline ? (
                <p className="text-xl font-bold text-purple-600 animate-fadeIn">
                  {joke.punchline}
                </p>
              ) : (
                <button
                  onClick={handleReveal}
                  className="text-left text-gray-400 hover:text-purple-500 transition-colors"
                >
                  👆 Click to reveal
                </button>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {showPunchline ? (
                <button
                  onClick={handleHide}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Hide Punchline
                </button>
              ) : (
                <button
                  onClick={handleReveal}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium"
                >
                  Reveal Punchline
                </button>
              )}

              <button
                onClick={fetchRandomJoke}
                className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
              >
                Next Joke →
              </button>
            </div>

            {/* Joke type badge */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                Type: {joke.type || "General"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Failed to load joke. Please try again.</p>
            <button
              onClick={fetchRandomJoke}
              className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
