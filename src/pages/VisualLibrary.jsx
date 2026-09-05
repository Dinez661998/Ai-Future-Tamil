import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

/* =========================================================
   AUTO LOAD ALL IMAGES
   ROOT + SUBFOLDERS
========================================================= */

const imageModules = import.meta.glob(
  [
    "../assets/visual-library/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
    "../assets/visual-library/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  ],
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

/* =========================================================
   CATEGORY SETTINGS
========================================================= */

const CATEGORY_CONFIG = {
  all: {
    id: "all",
    icon: "📚",
    title: "All Visual Guides",
    short: "Explore the complete visual library",
    gradient:
      "from-cyan-500/15 via-blue-500/10 to-violet-500/15",
  },

  chatgpt: {
    id: "chatgpt",
    icon: "🤖",
    title: "ChatGPT & AI Commands",
    short: "Commands, shortcuts and AI assistant guides",
    gradient:
      "from-emerald-500/15 via-cyan-500/10 to-blue-500/15",
  },

  prompts: {
    id: "prompts",
    icon: "✨",
    title: "Prompt Engineering",
    short: "Prompt formulas, frameworks and writing guides",
    gradient:
      "from-violet-500/15 via-purple-500/10 to-pink-500/15",
  },

  "ai-tools": {
    id: "ai-tools",
    icon: "🛠️",
    title: "AI Tools & Automation",
    short: "AI apps, automation and workflow guides",
    gradient:
      "from-blue-500/15 via-cyan-500/10 to-emerald-500/15",
  },

  productivity: {
    id: "productivity",
    icon: "💼",
    title: "Work & Productivity",
    short: "Email, meetings, office work and productivity",
    gradient:
      "from-orange-500/15 via-amber-500/10 to-yellow-500/15",
  },

  learning: {
    id: "learning",
    icon: "🎓",
    title: "Learning & Skills",
    short: "Roadmaps, study guides and skill development",
    gradient:
      "from-green-500/15 via-emerald-500/10 to-cyan-500/15",
  },

  special: {
    id: "special",
    icon: "🧠",
    title: "Special AI Guides",
    short: "Creator, medical, education and niche AI guides",
    gradient:
      "from-pink-500/15 via-purple-500/10 to-violet-500/15",
  },

  other: {
    id: "other",
    icon: "🗂️",
    title: "Other Guides",
    short: "Uncategorized visual learning resources",
    gradient:
      "from-slate-500/15 via-gray-500/10 to-zinc-500/15",
  },
};

/* =========================================================
   CATEGORY ORDER
========================================================= */

const CATEGORY_ORDER = [
  "chatgpt",
  "prompts",
  "ai-tools",
  "productivity",
  "learning",
  "special",
  "other",
];

/* =========================================================
   HELPER — CLEAN FILE NAME
========================================================= */

function cleanFileName(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   HELPER — NICE TITLE
========================================================= */

function createNiceTitle(
  fileName,
  index
) {
  const cleaned =
    cleanFileName(fileName);

  const mostlyNumber =
    /^[0-9\s]+$/.test(
      cleaned
    );

  const screenshotName =
    cleaned
      .toLowerCase()
      .startsWith(
        "screenshot"
      );

  if (
    !cleaned ||
    mostlyNumber ||
    screenshotName
  ) {
    return `AI Visual Guide ${String(
      index + 1
    ).padStart(
      3,
      "0"
    )}`;
  }

  return cleaned
    .split(" ")
    .map(
      (word) =>
        word
          ? word
              .charAt(0)
              .toUpperCase() +
            word.slice(1)
          : ""
    )
    .join(" ");
}

/* =========================================================
   FALLBACK CATEGORY FROM FILE NAME
========================================================= */

function detectCategoryFromName(
  name
) {
  const value =
    name.toLowerCase();

  if (
    value.includes(
      "chatgpt"
    ) ||
    value.includes(
      "gpt"
    ) ||
    value.includes(
      "command"
    ) ||
    value.includes(
      "shortcut"
    )
  ) {
    return "chatgpt";
  }

  if (
    value.includes(
      "prompt"
    ) ||
    value.includes(
      "prompting"
    ) ||
    value.includes(
      "framework"
    )
  ) {
    return "prompts";
  }

  if (
    value.includes(
      "claude"
    ) ||
    value.includes(
      "gemini"
    ) ||
    value.includes(
      "midjourney"
    ) ||
    value.includes(
      "automation"
    ) ||
    value.includes(
      "workflow"
    ) ||
    value.includes(
      "tool"
    )
  ) {
    return "ai-tools";
  }

  if (
    value.includes(
      "email"
    ) ||
    value.includes(
      "meeting"
    ) ||
    value.includes(
      "office"
    ) ||
    value.includes(
      "productivity"
    ) ||
    value.includes(
      "work"
    ) ||
    value.includes(
      "business"
    ) ||
    value.includes(
      "excel"
    ) ||
    value.includes(
      "presentation"
    )
  ) {
    return "productivity";
  }

  if (
    value.includes(
      "learn"
    ) ||
    value.includes(
      "learning"
    ) ||
    value.includes(
      "study"
    ) ||
    value.includes(
      "skill"
    ) ||
    value.includes(
      "roadmap"
    ) ||
    value.includes(
      "course"
    ) ||
    value.includes(
      "coding"
    ) ||
    value.includes(
      "developer"
    )
  ) {
    return "learning";
  }

  if (
    value.includes(
      "medical"
    ) ||
    value.includes(
      "health"
    ) ||
    value.includes(
      "youtube"
    ) ||
    value.includes(
      "instagram"
    ) ||
    value.includes(
      "creator"
    ) ||
    value.includes(
      "education"
    ) ||
    value.includes(
      "teacher"
    ) ||
    value.includes(
      "design"
    )
  ) {
    return "special";
  }

  return "other";
}

/* =========================================================
   DETECT CATEGORY
   FOLDER NAME GETS FIRST PRIORITY
========================================================= */

function detectCategory(
  path,
  fileName
) {
  const normalized =
    path.toLowerCase();

  const segments =
    normalized.split("/");

  const visualIndex =
    segments.findIndex(
      (segment) =>
        segment ===
        "visual-library"
    );

  let folder = "";

  if (
    visualIndex >= 0 &&
    segments.length >
      visualIndex + 2
  ) {
    folder =
      segments[
        visualIndex + 1
      ];
  }

  const folderMap = {
    chatgpt:
      "chatgpt",

    commands:
      "chatgpt",

    prompts:
      "prompts",

    prompt:
      "prompts",

    "prompt-engineering":
      "prompts",

    "ai-tools":
      "ai-tools",

    tools:
      "ai-tools",

    automation:
      "ai-tools",

    productivity:
      "productivity",

    work:
      "productivity",

    business:
      "productivity",

    learning:
      "learning",

    skills:
      "learning",

    roadmap:
      "learning",

    education:
      "learning",

    special:
      "special",

    medical:
      "special",

    creator:
      "special",

    creators:
      "special",

    other:
      "other",
  };

  if (
    folder &&
    folderMap[folder]
  ) {
    return folderMap[
      folder
    ];
  }

  return detectCategoryFromName(
    fileName
  );
}

/* =========================================================
   BUILD IMAGE LIBRARY
========================================================= */

function buildLibrary() {
  return Object.entries(
    imageModules
  )
    .sort(
      ([a], [b]) =>
        a.localeCompare(b)
    )
    .map(
      (
        [path, src],
        index
      ) => {
        const fileName =
          path
            .split("/")
            .pop() ||
          `image-${index + 1}`;

        const extension =
          fileName
            .split(".")
            .pop()
            ?.toUpperCase() ||
          "IMAGE";

        const category =
          detectCategory(
            path,
            fileName
          );

        return {
          id:
            `${path}-${index}`,

          src,

          path,

          fileName,

          extension,

          category,

          title:
            createNiceTitle(
              fileName,
              index
            ),
        };
      }
    );
}

/* =========================================================
   MAIN
========================================================= */

export default function VisualLibrary() {
  const images =
    useMemo(
      () =>
        buildLibrary(),
      []
    );

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("all");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(null);

  const [
    favorites,
    setFavorites,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          "aft-visual-favorites"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });

  /* =========================================================
     CATEGORY COUNTS
  ========================================================= */

  const categoryCounts =
    useMemo(() => {
      const result = {
        all:
          images.length,
      };

      CATEGORY_ORDER.forEach(
        (category) => {
          result[
            category
          ] =
            images.filter(
              (image) =>
                image.category ===
                category
            ).length;
        }
      );

      return result;
    }, [images]);

  /* =========================================================
     CATEGORY PREVIEWS
  ========================================================= */

  const categoryPreviews =
    useMemo(() => {
      const result = {};

      CATEGORY_ORDER.forEach(
        (category) => {
          result[
            category
          ] =
            images
              .filter(
                (image) =>
                  image.category ===
                  category
              )
              .slice(
                0,
                3
              );
        }
      );

      return result;
    }, [images]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredImages =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return images.filter(
        (image) => {
          const categoryMatch =
            activeCategory ===
              "all" ||
            image.category ===
              activeCategory;

          const searchMatch =
            !query ||
            image.title
              .toLowerCase()
              .includes(query) ||
            image.fileName
              .toLowerCase()
              .includes(query);

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      images,
      activeCategory,
      search,
    ]);

  /* =========================================================
     FAVORITES
  ========================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "aft-visual-favorites",
        JSON.stringify(
          favorites
        )
      );
    } catch {
      // Browser storage optional.
    }
  }, [favorites]);

  function toggleFavorite(
    id
  ) {
    setFavorites(
      (current) =>
        current.includes(id)
          ? current.filter(
              (item) =>
                item !== id
            )
          : [
              ...current,
              id,
            ]
    );
  }

  /* =========================================================
     OPEN CATEGORY
  ========================================================= */

  function openCategory(
    category
  ) {
    setActiveCategory(
      category
    );

    setSearch("");

    setSelectedIndex(
      null
    );

    setTimeout(() => {
      document
        .getElementById(
          "visual-gallery"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",

          block:
            "start",
        });
    }, 100);
  }

  /* =========================================================
     MODAL
  ========================================================= */

  const closeModal =
    useCallback(() => {
      setSelectedIndex(
        null
      );
    }, []);

  const nextImage =
    useCallback(() => {
      setSelectedIndex(
        (current) => {
          if (
            current === null ||
            filteredImages.length ===
              0
          ) {
            return null;
          }

          return (
            current + 1
          ) %
            filteredImages.length;
        }
      );
    }, [
      filteredImages.length,
    ]);

  const previousImage =
    useCallback(() => {
      setSelectedIndex(
        (current) => {
          if (
            current === null ||
            filteredImages.length ===
              0
          ) {
            return null;
          }

          return (
            current -
            1 +
            filteredImages.length
          ) %
            filteredImages.length;
        }
      );
    }, [
      filteredImages.length,
    ]);

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    if (
      selectedIndex === null
    ) {
      return undefined;
    }

    function handleKey(
      event
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        closeModal();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        nextImage();
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previousImage();
      }
    }

    document.addEventListener(
      "keydown",
      handleKey
    );

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKey
      );

      document.body.style.overflow =
        oldOverflow;
    };
  }, [
    selectedIndex,
    closeModal,
    nextImage,
    previousImage,
  ]);

  const selectedImage =
    selectedIndex !== null
      ? filteredImages[
          selectedIndex
        ]
      : null;

  const activeConfig =
    CATEGORY_CONFIG[
      activeCategory
    ] ||
    CATEGORY_CONFIG.all;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-4 pb-24 pt-8 text-white sm:px-6 lg:px-8">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.07] blur-[140px]" />

        <div className="absolute right-[-150px] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.08] blur-[160px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.06] blur-[160px]" />

      </div>

      <div className="relative mx-auto max-w-[1500px]">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500">

          <Link
            to="/"
            className="transition hover:text-cyan-300"
          >
            Home
          </Link>

          <span>→</span>

          <span className="text-cyan-300">
            Visual Library
          </span>

        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[36px] border border-white/[0.09] bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent p-7 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-10 lg:p-12">

          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-[110px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                📚 AI FUTURE TAMIL
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">

                AI Visual Learning

                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Library
                </span>

              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                Browse AI guides by category instead of searching through one
                large mixed gallery. New images added to category folders are
                detected automatically.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-5 py-4">

                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Resources
                </p>

                <p className="mt-2 text-3xl font-black text-cyan-300">
                  {images.length}
                </p>

              </div>

              <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] px-5 py-4">

                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Saved
                </p>

                <p className="mt-2 text-3xl font-black text-violet-300">
                  {favorites.length}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY TITLE
        ===================================================== */}

        <section className="mt-12">

          <div className="mb-7">

            <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-300">
              🗂️ Browse Categories
            </div>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Choose What You Want to Learn
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Select a category to view only the visual guides related to that
              topic.
            </p>

          </div>

          {/* =================================================
              CATEGORY CARDS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {CATEGORY_ORDER.map(
              (category) => {
                const config =
                  CATEGORY_CONFIG[
                    category
                  ];

                const previews =
                  categoryPreviews[
                    category
                  ] || [];

                const count =
                  categoryCounts[
                    category
                  ] || 0;

                return (
                  <button
                    type="button"
                    key={
                      category
                    }
                    onClick={() =>
                      openCategory(
                        category
                      )
                    }
                    className={`group relative overflow-hidden rounded-[30px] border p-5 text-left transition-all duration-500 hover:-translate-y-2 ${
                      activeCategory ===
                      category
                        ? "border-cyan-400/35 bg-cyan-400/[0.07] shadow-[0_25px_70px_rgba(6,182,212,.10)]"
                        : "border-white/[0.08] bg-white/[0.025] hover:border-white/20"
                    }`}
                  >

                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50`}
                    />

                    <div className="relative">

                      {/* PREVIEWS */}

                      <div className="grid h-36 grid-cols-3 gap-2">

                        {previews.length >
                        0 ? (
                          previews.map(
                            (
                              image,
                              previewIndex
                            ) => (
                              <div
                                key={
                                  image.id
                                }
                                className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 ${
                                  previewIndex ===
                                  1
                                    ? "translate-y-2"
                                    : ""
                                }`}
                              >
                                <img
                                  src={
                                    image.src
                                  }
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>
                            )
                          )
                        ) : (
                          <div className="col-span-3 flex items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-4xl opacity-40">
                            {
                              config.icon
                            }
                          </div>
                        )}

                      </div>

                      {/* INFO */}

                      <div className="mt-6 flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-2xl">
                          {
                            config.icon
                          }
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-3">

                            <h3 className="text-lg font-black text-white">
                              {
                                config.title
                              }
                            </h3>

                            <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-black text-cyan-300">
                              {
                                count
                              }
                            </span>

                          </div>

                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {
                              config.short
                            }
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs font-black text-cyan-300">
                            Explore Category

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* =====================================================
            GALLERY
        ===================================================== */}

        <section
          id="visual-gallery"
          className="scroll-mt-28 pt-14"
        >

          {/* GALLERY HEADER */}

          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <button
                type="button"
                onClick={() =>
                  setActiveCategory(
                    "all"
                  )
                }
                className="mb-3 text-xs font-bold text-slate-500 transition hover:text-cyan-300"
              >
                ← View All Categories
              </button>

              <div className="flex items-center gap-3">

                <div className="text-3xl">
                  {
                    activeConfig.icon
                  }
                </div>

                <div>

                  <h2 className="text-2xl font-black sm:text-3xl">
                    {
                      activeConfig.title
                    }
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      filteredImages.length
                    }{" "}
                    visual resources
                  </p>

                </div>

              </div>

            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                🔎
              </span>

              <input
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder={`Search ${activeConfig.title}...`}
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30 focus:bg-cyan-400/[0.04]"
              />

            </div>

          </div>

          {/* QUICK CATEGORY FILTER */}

          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">

            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  "all"
                )
              }
              className={`shrink-0 rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                activeCategory ===
                "all"
                  ? "border-cyan-400/30 bg-cyan-400/[0.10] text-cyan-300"
                  : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:text-white"
              }`}
            >
              📚 All (
              {
                categoryCounts.all
              }
              )
            </button>

            {CATEGORY_ORDER.map(
              (category) => {
                const config =
                  CATEGORY_CONFIG[
                    category
                  ];

                return (
                  <button
                    type="button"
                    key={
                      category
                    }
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                      activeCategory ===
                      category
                        ? "border-cyan-400/30 bg-cyan-400/[0.10] text-cyan-300"
                        : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:text-white"
                    }`}
                  >
                    {
                      config.icon
                    }{" "}
                    {
                      config.title
                    }{" "}
                    (
                    {
                      categoryCounts[
                        category
                      ]
                    }
                    )
                  </button>
                );
              }
            )}

          </div>

          {/* =================================================
              IMAGE GRID
          ================================================= */}

          {filteredImages.length >
          0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">

              {filteredImages.map(
                (
                  image,
                  index
                ) => {
                  const favorite =
                    favorites.includes(
                      image.id
                    );

                  const config =
                    CATEGORY_CONFIG[
                      image.category
                    ] ||
                    CATEGORY_CONFIG.other;

                  return (
                    <article
                      key={
                        image.id
                      }
                      className="group overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#090e1b] p-2.5 shadow-[0_18px_45px_rgba(0,0,0,.30)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_25px_70px_rgba(6,182,212,.10)]"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIndex(
                            index
                          )
                        }
                        className="relative block aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-gradient-to-b from-[#171d30] to-[#090d17]"
                      >

                        <img
                          src={
                            image.src
                          }
                          alt={
                            image.title
                          }
                          loading="lazy"
                          decoding="async"
                          draggable="false"
                          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                          style={{
                            imageRendering:
                              "auto",

                            filter:
                              "contrast(1.02) saturate(1.02)",
                          }}
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                        <span className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur-xl">
                          {
                            config.icon
                          }{" "}
                          {
                            config.title
                              .split(
                                "&"
                              )[0]
                              .trim()
                          }
                        </span>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-xl border border-white/10 bg-black/75 px-3 py-2 text-[10px] font-black text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          🔍 Full View
                        </div>

                      </button>

                      <div className="flex items-center gap-2 px-1 pb-1 pt-3">

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-xs font-black text-white sm:text-sm">
                            {
                              image.title
                            }
                          </p>

                          <p className="mt-1 truncate text-[10px] font-bold text-slate-600">
                            {
                              image.extension
                            }{" "}
                            •{" "}
                            {
                              config.title
                            }
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleFavorite(
                              image.id
                            )
                          }
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                            favorite
                              ? "border-pink-400/30 bg-pink-400/[0.10] text-pink-300"
                              : "border-white/[0.08] bg-white/[0.03] text-slate-500 hover:text-pink-300"
                          }`}
                        >
                          {
                            favorite
                              ? "♥"
                              : "♡"
                          }
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.02] p-14 text-center">

              <div className="text-5xl">
                🔍
              </div>

              <h3 className="mt-5 text-xl font-black">
                No images found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add images to this category folder or try another search.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  setActiveCategory(
                    "all"
                  );
                }}
                className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-black text-black"
              >
                View All Images
              </button>

            </div>
          )}

        </section>

      </div>

      {/* =====================================================
          FULL SCREEN VIEWER
      ===================================================== */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/[0.95] p-3 backdrop-blur-xl sm:p-6"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          {/* TOP */}

          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black to-transparent p-4 sm:p-6">

            <div className="min-w-0">

              <p className="truncate text-sm font-black sm:text-base">
                {
                  selectedImage.title
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {
                  CATEGORY_CONFIG[
                    selectedImage
                      .category
                  ]?.title
                }{" "}
                •{" "}
                {selectedIndex +
                  1}{" "}
                /{" "}
                {
                  filteredImages.length
                }
              </p>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  toggleFavorite(
                    selectedImage.id
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-xs font-black"
              >
                {favorites.includes(
                  selectedImage.id
                )
                  ? "♥ Saved"
                  : "♡ Save"}
              </button>

              <a
                href={
                  selectedImage.src
                }
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-xs font-black text-cyan-300 sm:block"
              >
                Original ↗
              </a>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-xl"
              >
                ×
              </button>

            </div>

          </div>

          {/* IMAGE */}

          <div className="flex h-[calc(100vh-110px)] w-full items-center justify-center pt-14">

            <img
              src={
                selectedImage.src
              }
              alt={
                selectedImage.title
              }
              draggable="false"
              className="max-h-full max-w-full select-none object-contain shadow-[0_35px_100px_rgba(0,0,0,.8)]"
            />

          </div>

          {/* PREVIOUS */}

          {filteredImages.length >
            1 && (
            <button
              type="button"
              onClick={
                previousImage
              }
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/75 text-3xl transition hover:border-cyan-400/40 sm:left-6"
            >
              ‹
            </button>
          )}

          {/* NEXT */}

          {filteredImages.length >
            1 && (
            <button
              type="button"
              onClick={
                nextImage
              }
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/75 text-3xl transition hover:border-cyan-400/40 sm:right-6"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[10px] font-bold text-slate-500 sm:block">
            ← Previous · → Next · ESC Close
          </div>

        </div>
      )}

    </main>
  );
}