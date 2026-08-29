import { useEffect, useState } from "react";

import {
  getSavedPrompts,
  savePrompt,
  removeSavedPrompt,
  isPromptSaved,
} from "../utils/dashboardStorage";

const prompts = [
  {
    id: 1,
    title: "YouTube Video Script",
    category: "YouTube",
    icon: "🎬",
    description:
      "Create engaging YouTube video scripts with hooks, storytelling and CTA.",
    prompt:
      "Create a 5-minute YouTube video script about [TOPIC]. Include a powerful hook, introduction, main content, curiosity points, examples, conclusion and CTA.",
  },
  {
    id: 2,
    title: "AI Image Prompt",
    category: "Image",
    icon: "🎨",
    description:
      "Generate professional prompts for AI image generation.",
    prompt:
      "Create a highly detailed cinematic AI image prompt for [TOPIC]. Include subject, environment, lighting, camera angle, composition, colors and realistic details.",
  },
  {
    id: 3,
    title: "Coding Assistant",
    category: "Coding",
    icon: "💻",
    description:
      "Use AI to generate, explain and improve your code.",
    prompt:
      "Act as an expert software developer. Analyze the following code, identify problems, explain them simply and provide an improved version.",
  },
  {
    id: 4,
    title: "Study Assistant",
    category: "Education",
    icon: "📚",
    description:
      "Turn difficult topics into simple study notes.",
    prompt:
      "Explain [TOPIC] in simple language. Include key points, examples, important terms, a short summary and 5 practice questions.",
  },
  {
    id: 5,
    title: "Marketing Content",
    category: "Marketing",
    icon: "📢",
    description:
      "Create social media and marketing content using AI.",
    prompt:
      "Create 10 engaging social media posts about [PRODUCT/SERVICE]. Include hooks, short captions, CTA and suitable hashtags.",
  },
  {
    id: 6,
    title: "Business Ideas",
    category: "Business",
    icon: "💡",
    description:
      "Generate practical business ideas using AI.",
    prompt:
      "Generate 10 practical online business ideas based on my skills, budget and available time. Explain the target audience, earning model and first steps.",
  },
];

function Prompts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All");

  const [saved, setSaved] =
    useState([]);

  const categories = [
    "All",
    "YouTube",
    "Image",
    "Coding",
    "Education",
    "Marketing",
    "Business",
  ];

  const loadSaved = () => {
    const savedPrompts =
      getSavedPrompts();

    // Safety guarantee
    setSaved(
      Array.isArray(savedPrompts)
        ? savedPrompts
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

  const filteredPrompts =
    prompts.filter((item) => {
      const query =
        search.toLowerCase();

      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

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

  const toggleSave = (id) => {
    if (isPromptSaved(id)) {
      const updated =
        removeSavedPrompt(id);

      setSaved(
        Array.isArray(updated)
          ? updated
          : []
      );
    } else {
      const updated =
        savePrompt(id);

      setSaved(
        Array.isArray(updated)
          ? updated
          : []
      );
    }
  };

  const isSaved = (id) =>
    saved.some(
      (savedId) =>
        String(savedId) ===
        String(id)
    );

  return (
    <main className="min-h-screen bg-transparent px-6 py-20 text-white">
      {/* HEADER */}
      <section className="mx-auto max-w-6xl text-center">
        <p className="mb-4 text-lg text-blue-400">
          ✨ AI Prompt Library
        </p>

        <h1 className="mb-5 text-5xl font-bold">
          Powerful AI Prompts
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-gray-400">
          Ready-to-use AI prompts for
          YouTube, coding, education,
          marketing, images and much more.
        </p>
      </section>

      {/* SEARCH */}
      <section className="mx-auto mt-12 max-w-4xl">
        <input
          type="text"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none focus:border-blue-500"
        />
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-3">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setCategory(item)
            }
            className={`rounded-full border px-5 py-2 transition ${
              category === item
                ? "border-white bg-white text-black"
                : "border-zinc-700 bg-zinc-900 text-gray-300 hover:border-blue-500"
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      {/* SAVED COUNT */}
      <section className="mx-auto mt-10 max-w-6xl">
        <div className="flex justify-end">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
            <span className="text-gray-400">
              ❤️ Saved:
            </span>

            <span className="ml-2 font-bold">
              {saved.length}
            </span>
          </div>
        </div>
      </section>

      {/* PROMPT CARDS */}
      <section className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map(
          (item) => {
            const savedNow =
              isSaved(item.id);

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition hover:border-blue-500"
              >
                {/* TOP */}
                <div className="flex items-start justify-between">
                  <div className="mb-5 text-5xl">
                    {item.icon}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleSave(item.id)
                    }
                    aria-label={
                      savedNow
                        ? `Remove ${item.title} from saved prompts`
                        : `Save ${item.title}`
                    }
                    className={`text-2xl transition ${
                      savedNow
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-400"
                    }`}
                  >
                    {savedNow
                      ? "❤️"
                      : "♡"}
                  </button>
                </div>

                {/* CATEGORY */}
                <p className="mb-2 text-sm text-blue-400">
                  {item.category}
                </p>

                {/* TITLE */}
                <h2 className="mb-3 text-2xl font-bold">
                  {item.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="mb-6 leading-7 text-gray-400">
                  {item.description}
                </p>

                {/* PROMPT */}
                <div className="mb-5 rounded-xl border border-zinc-800 bg-black p-4">
                  <p className="text-sm leading-6 text-gray-300">
                    {item.prompt}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      copyPrompt(
                        item.prompt
                      )
                    }
                    className="flex-1 rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200"
                  >
                    📋 Copy
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleSave(item.id)
                    }
                    aria-label={
                      savedNow
                        ? "Remove saved prompt"
                        : "Save prompt"
                    }
                    className={`rounded-lg border px-5 transition ${
                      savedNow
                        ? "border-red-500 text-red-500"
                        : "border-zinc-700 text-gray-400 hover:border-red-500 hover:text-red-400"
                    }`}
                  >
                    {savedNow
                      ? "❤️"
                      : "♡"}
                  </button>
                </div>
              </div>
            );
          }
        )}
      </section>

      {/* EMPTY STATE */}
      {filteredPrompts.length ===
        0 && (
        <div className="mt-16 text-center text-gray-400">
          <div className="mb-4 text-5xl">
            🔍
          </div>

          <p className="text-xl">
            No prompts found.
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Try another search or category.
          </p>
        </div>
      )}
    </main>
  );
}

export default Prompts;