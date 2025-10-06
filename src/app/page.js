
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(true);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPrompt() {
      setIsLoadingPrompt(true);
      try {
        const res = await fetch("/api/word", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load word");
        const json = await res.json();
        if (isMounted) setPrompt(json.word ?? "");
      } finally {
        if (isMounted) setIsLoadingPrompt(false);
      }
    }

    loadPrompt();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // Submission intentionally not implemented yet.
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 dark:bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />

          <div className="p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4">
              Spanish Vocab Drill
            </h1>

            <div className="mb-6">
              {isLoadingPrompt ? (
                <div className="h-6 w-3/4 animate-pulse rounded bg-white/10" />
              ) : (
                <p className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">{prompt}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="answer" className="sr-only">
                  Your answer
                </label>
                <input
                  id="answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-foreground/50"
                  autoComplete="off"
                  disabled={isLoadingPrompt}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!answer.trim() || isLoadingPrompt}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-white transition hover:from-cyan-400 hover:to-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-foreground/60">
          Tip: Press Enter to submit
        </div>
      </div>
    </div>
  );
}
