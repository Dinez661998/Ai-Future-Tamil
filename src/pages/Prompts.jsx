import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../supabase/client";

import {
  getSavedPrompts,
  savePrompt,
  removeSavedPrompt,
  isPromptSaved,
} from "../utils/dashboardStorage";

/* =========================================================
   CATEGORY ICON
========================================================= */

function getCategoryIcon(category = "") {
  const value =
    category.toLowerCase();

  if (
    value.includes("youtube") ||
    value.includes("creator")
  ) {
    return "🎬";
  }

  if (
    value.includes("image") ||
    value.includes("design")
  ) {
    return "🎨";
  }

  if (
    value.includes("code") ||
    value.includes("coding") ||
    value.includes("developer")
  ) {
    return "💻";
  }

  if (
    value.includes("education") ||
    value.includes("study") ||
    value.includes("learning")
  ) {
    return "📚";
  }

  if (
    value.includes("marketing") ||
    value.includes("social")
  ) {
    return "📢";
  }

  if (
    value.includes("business")
  ) {
    return "💡";
  }

  if (
    value.includes("writing") ||
    value.includes("blog")
  ) {
    return "✍️";
  }

  return "✨";
}

/* =========================================================
   PROMPTS
========================================================= */

function Prompts() {
  const [
    prompts,
    setPrompts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("All");

  const [
    saved,
    setSaved,
  ] = useState([]);

  /* =========================================================
     LOAD SAVED PROMPTS
  ========================================================= */

  const loadSaved =
    useCallback(() => {
      const savedPrompts =
        getSavedPrompts();

      setSaved(
        Array.isArray(
          savedPrompts
        )
          ? savedPrompts
          : []
      );
    }, []);

  /* =========================================================
     LOAD PROMPTS FROM SUPABASE
  ========================================================= */

  const loadPrompts =
    useCallback(
      async () => {
        try {
          setLoading(true);

          setError("");

          const {
            data,
            error:
              fetchError,
          } =
            await supabase
              .from("prompts")
              .select(
                `
                  id,
                  title,
                  slug,
                  prompt_text,
                  description,
                  category,
                  image_url,
                  featured,
                  premium,
                  published,
                  created_at,
                  updated_at
                `
              )
              .eq(
                "published",
                true
              )
              .order(
                "featured",
                {
                  ascending:
                    false,
                }
              )
              .order(
                "created_at",
                {
                  ascending:
                    false,
                }
              );

          if (
            fetchError
          ) {
            throw fetchError;
          }

          setPrompts(
            (data || []).map(
              (item) => ({
                ...item,

                icon:
                  getCategoryIcon(
                    item.category
                  ),

                prompt:
                  item.prompt_text ||
                  "",
              })
            )
          );

        } catch (
          err
        ) {
          console.error(
            "Prompt loading error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load prompts."
          );

          setPrompts([]);

        } finally {
          setLoading(false);
        }
      },
      []
    );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadSaved();

    loadPrompts();

    const handleUpdate =
      () => {
        loadSaved();
      };

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

  }, [
    loadPrompts,
    loadSaved,
  ]);

  /* =========================================================
     REALTIME CMS UPDATE
  ========================================================= */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "public-prompts-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "prompts",
          },
          () => {
            loadPrompts();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };

  }, [
    loadPrompts,
  ]);

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories =
    useMemo(
      () => [
        "All",

        ...[
          ...new Set(
            prompts
              .map(
                (item) =>
                  item.category
              )
              .filter(Boolean)
          ),
        ].sort(),
      ],
      [
        prompts,
      ]
    );

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredPrompts =
    useMemo(
      () => {
        const query =
          search
            .toLowerCase()
            .trim();

        return prompts.filter(
          (item) => {
            const matchesSearch =
              !query ||
              item.title
                ?.toLowerCase()
                .includes(
                  query
                ) ||
              item.description
                ?.toLowerCase()
                .includes(
                  query
                ) ||
              item.prompt
                ?.toLowerCase()
                .includes(
                  query
                ) ||
              item.category
                ?.toLowerCase()
                .includes(
                  query
                );

            const matchesCategory =
              category ===
                "All" ||
              item.category ===
                category;

            return (
              matchesSearch &&
              matchesCategory
            );
          }
        );
      },
      [
        prompts,
        search,
        category,
      ]
    );

  /* =========================================================
     COPY
  ========================================================= */

  const copyPrompt =
    async (
      prompt
    ) => {
      try {
        await navigator.clipboard.writeText(
          prompt
        );

        alert(
          "Prompt copied! ✅"
        );

      } catch {
        alert(
          "Unable to copy prompt."
        );
      }
    };

  /* =========================================================
     SAVE / UNSAVE
  ========================================================= */

  const toggleSave =
    (id) => {
      if (
        isPromptSaved(id)
      ) {
        const updated =
          removeSavedPrompt(
            id
          );

        setSaved(
          Array.isArray(
            updated
          )
            ? updated
            : []
        );

      } else {
        const updated =
          savePrompt(id);

        setSaved(
          Array.isArray(
            updated
          )
            ? updated
            : []
        );
      }

      window.dispatchEvent(
        new Event(
          "dashboard-data-updated"
        )
      );

      window.dispatchEvent(
        new Event(
          "ai-future-data-change"
        )
      );
    };

  const isSaved =
    (id) =>
      saved.some(
        (
          savedId
        ) =>
          String(
            savedId
          ) ===
          String(id)
      );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent px-6 py-20 text-white">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

          <p className="mt-5 text-gray-400">
            Loading AI Prompts...
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent px-6 py-20 text-white">

        <div className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-8 text-center">

          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Unable to load prompts
          </h1>

          <p className="mt-3 text-sm text-red-300">
            {error}
          </p>

          <button
            type="button"
            onClick={
              loadPrompts
            }
            className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-black"
          >
            Retry
          </button>

        </div>

      </main>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

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
          Ready-to-use AI
          prompts for creators,
          coding, education,
          marketing, images,
          writing and much more.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-gray-300">
            ✨{" "}
            {prompts.length}{" "}
            Prompts
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-gray-300">
            🗂️{" "}
            {Math.max(
              categories.length -
                1,
              0
            )}{" "}
            Categories
          </span>

        </div>

      </section>

      {/* SEARCH */}

      <section className="mx-auto mt-12 max-w-4xl">

        <input
          type="text"
          placeholder="Search prompts..."
          value={search}
          onChange={(
            e
          ) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none transition focus:border-blue-500"
        />

      </section>

      {/* CATEGORIES */}

      <section className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-3">

        {categories.map(
          (
            item
          ) => (
            <button
              key={
                item
              }
              type="button"
              onClick={() =>
                setCategory(
                  item
                )
              }
              className={`rounded-full border px-5 py-2 transition ${
                category ===
                item
                  ? "border-white bg-white text-black"
                  : "border-zinc-700 bg-zinc-900 text-gray-300 hover:border-blue-500"
              }`}
            >
              {
                item
              }
            </button>
          )
        )}

      </section>

      {/* SAVED COUNT */}

      <section className="mx-auto mt-10 max-w-6xl">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <p className="text-sm text-gray-500">
            {
              filteredPrompts.length
            }{" "}
            {filteredPrompts.length ===
            1
              ? "prompt"
              : "prompts"}{" "}
            found
          </p>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">

            <span className="text-gray-400">
              ❤️ Saved:
            </span>

            <span className="ml-2 font-bold">
              {
                saved.length
              }
            </span>

          </div>

        </div>

      </section>

      {/* PROMPT CARDS */}

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredPrompts.map(
          (
            item
          ) => {
            const savedNow =
              isSaved(
                item.id
              );

            return (
              <article
                key={
                  item.id
                }
                className="
                  relative
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  p-7
                  transition
                  hover:-translate-y-1
                  hover:border-blue-500
                "
              >

                {/* FEATURED GLOW */}

                {item.featured && (
                  <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />
                )}

                {/* TOP */}

                <div className="relative flex items-start justify-between">

                  <div className="mb-5 text-5xl">

                    {item.image_url ? (
                      <img
                        src={
                          item.image_url
                        }
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      item.icon
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleSave(
                        item.id
                      )
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

                {/* BADGES */}

                <div className="mb-4 flex flex-wrap gap-2">

                  <span className="rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-3 py-1 text-xs font-bold text-blue-400">
                    {
                      item.category ||
                      "General"
                    }
                  </span>

                  {item.featured && (
                    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/[0.07] px-3 py-1 text-xs font-bold text-yellow-300">
                      ⭐ Featured
                    </span>
                  )}

                  {item.premium && (
                    <span className="rounded-full border border-purple-500/20 bg-purple-500/[0.07] px-3 py-1 text-xs font-bold text-purple-300">
                      💎 Premium
                    </span>
                  )}

                </div>

                {/* TITLE */}

                <h2 className="mb-3 text-2xl font-bold">
                  {
                    item.title
                  }
                </h2>

                {/* DESCRIPTION */}

                <p className="mb-6 leading-7 text-gray-400">
                  {item.description ||
                    "Ready-to-use AI prompt."}
                </p>

                {/* PROMPT */}

                <div className="mb-5 flex-1 rounded-xl border border-zinc-800 bg-black p-4">

                  <p className="whitespace-pre-line text-sm leading-6 text-gray-300">
                    {
                      item.prompt
                    }
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
                      toggleSave(
                        item.id
                      )
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

              </article>
            );
          }
        )}

      </section>

      {/* EMPTY */}

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
            Try another search
            or category.
          </p>

        </div>
      )}

    </main>
  );
}

export default Prompts;