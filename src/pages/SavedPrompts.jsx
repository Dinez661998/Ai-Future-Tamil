import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getSavedPrompts,
  removeSavedPrompt,
} from "../utils/dashboardStorage";

const prompts = [
  {
    id: 1,
    title: "YouTube Video Script",
    category: "YouTube",
    icon: "🎬",
    prompt:
      "Create a 5-minute YouTube video script about [TOPIC]. Include a powerful hook, introduction, main content, curiosity points, examples, conclusion and CTA.",
  },
  {
    id: 2,
    title: "AI Image Prompt",
    category: "Image",
    icon: "🎨",
    prompt:
      "Create a highly detailed cinematic AI image prompt for [TOPIC]. Include subject, environment, lighting, camera angle, composition, colors and realistic details.",
  },
  {
    id: 3,
    title: "Coding Assistant",
    category: "Coding",
    icon: "💻",
    prompt:
      "Act as an expert software developer. Analyze the following code, identify problems, explain them simply and provide an improved version.",
  },
  {
    id: 4,
    title: "Study Assistant",
    category: "Education",
    icon: "📚",
    prompt:
      "Explain [TOPIC] in simple language. Include key points, examples, important terms, a short summary and 5 practice questions.",
  },
  {
    id: 5,
    title: "Marketing Content",
    category: "Marketing",
    icon: "📢",
    prompt:
      "Create 10 engaging social media posts about [PRODUCT/SERVICE]. Include hooks, short captions, CTA and suitable hashtags.",
  },
  {
    id: 6,
    title: "Business Ideas",
    category: "Business",
    icon: "💡",
    prompt:
      "Generate 10 practical online business ideas based on my skills, budget and available time. Explain the target audience, earning model and first steps.",
  },
];

function SavedPrompts() {
  const [saved, setSaved] =
    useState([]);

  const loadSaved = () => {
    const data =
      getSavedPrompts();

    setSaved(
      Array.isArray(data)
        ? data
        : []
    );
  };

  useEffect(() => {
    loadSaved();

    const handleUpdate =
      () => loadSaved();

    window.addEventListener(
      "dashboard-data-updated",
      handleUpdate
    );

    window.addEventListener(
      "ai-future-data-change",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "dashboard-data-updated",
        handleUpdate
      );

      window.removeEventListener(
        "ai-future-data-change",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  const savedPrompts =
    prompts.filter((item) =>
      saved.some(
        (savedId) =>
          String(savedId) ===
          String(item.id)
      )
    );

  const removePrompt = (id) => {
    const updated =
      removeSavedPrompt(id);

    setSaved(
      Array.isArray(updated)
        ? updated
        : []
    );
  };

  const copyPrompt = async (
    prompt
  ) => {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      alert("Prompt copied! ✅");
    } catch {
      alert(
        "Unable to copy prompt."
      );
    }
  };

  return (
    <main className="min-h-screen bg-transparent px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <section className="mb-14 text-center">
          <p className="mb-4 text-lg text-red-400">
            ❤️ Your Collection
          </p>

          <h1 className="mb-5 text-5xl font-bold">
            Saved Prompts
          </h1>

          <p className="text-lg text-gray-400">
            Your favourite AI prompts are
            saved here.
          </p>
        </section>

        {/* EMPTY */}
        {savedPrompts.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">
            <div className="mb-6 text-6xl">
              ❤️
            </div>

            <h2 className="mb-3 text-2xl font-bold">
              No saved prompts yet
            </h2>

            <p className="mb-8 leading-7 text-gray-400">
              Explore the Prompt Library
              and save your favourite
              prompts.
            </p>

            <Link
              to="/prompts"
              className="inline-block rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Explore Prompts →
            </Link>
          </div>
        )}

        {/* SAVED CARDS */}
        {savedPrompts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedPrompts.map(
              (item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7"
                >
                  <div className="flex items-start justify-between">
                    <div className="mb-5 text-5xl">
                      {item.icon}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removePrompt(
                          item.id
                        )
                      }
                      aria-label={`Remove ${item.title}`}
                      className="text-2xl text-red-500 transition hover:text-red-400"
                    >
                      ❤️
                    </button>
                  </div>

                  <p className="mb-2 text-sm text-blue-400">
                    {item.category}
                  </p>

                  <h2 className="mb-4 text-2xl font-bold">
                    {item.title}
                  </h2>

                  <div className="mb-5 rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-sm leading-6 text-gray-300">
                      {item.prompt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyPrompt(
                        item.prompt
                      )
                    }
                    className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200"
                  >
                    📋 Copy Prompt
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default SavedPrompts;