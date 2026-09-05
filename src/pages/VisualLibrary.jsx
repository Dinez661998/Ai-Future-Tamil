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
   AUTO LOAD ALL VISUAL LIBRARY IMAGES
   ROOT + EVERY SUBFOLDER
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
   DESIGN PRESETS
========================================================= */

const CATEGORY_STYLES = [
  {
    gradient:
      "from-cyan-500/15 via-blue-500/10 to-violet-500/15",
    border:
      "hover:border-cyan-400/30",
    text:
      "text-cyan-300",
  },

  {
    gradient:
      "from-violet-500/15 via-purple-500/10 to-pink-500/15",
    border:
      "hover:border-violet-400/30",
    text:
      "text-violet-300",
  },

  {
    gradient:
      "from-emerald-500/15 via-cyan-500/10 to-blue-500/15",
    border:
      "hover:border-emerald-400/30",
    text:
      "text-emerald-300",
  },

  {
    gradient:
      "from-orange-500/15 via-amber-500/10 to-yellow-500/15",
    border:
      "hover:border-orange-400/30",
    text:
      "text-orange-300",
  },

  {
    gradient:
      "from-pink-500/15 via-purple-500/10 to-violet-500/15",
    border:
      "hover:border-pink-400/30",
    text:
      "text-pink-300",
  },

  {
    gradient:
      "from-blue-500/15 via-indigo-500/10 to-purple-500/15",
    border:
      "hover:border-blue-400/30",
    text:
      "text-blue-300",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function cleanText(value = "") {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value = "") {
  return cleanText(value)
    .split(" ")
    .map((word) => {
      if (!word) {
        return "";
      }

      const upperWords = [
        "AI",
        "APP",
        "UI",
        "UX",
        "SEO",
        "PDF",
        "API",
        "HTML",
        "CSS",
        "JS",
        "GPT",
      ];

      if (
        upperWords.includes(
          word.toUpperCase()
        )
      ) {
        return word.toUpperCase();
      }

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function getCategoryIcon(
  categoryName
) {
  const value =
    categoryName.toLowerCase();

  if (
    value.includes("chatgpt") ||
    value.includes("gpt")
  ) {
    return "🤖";
  }

  if (
    value.includes("claude")
  ) {
    return "🧡";
  }

  if (
    value.includes("prompt")
  ) {
    return "✨";
  }

  if (
    value.includes("tool")
  ) {
    return "🛠️";
  }

  if (
    value.includes("video")
  ) {
    return "🎬";
  }

  if (
    value.includes("camera")
  ) {
    return "📸";
  }

  if (
    value.includes("money") ||
    value.includes("offer")
  ) {
    return "💰";
  }

  if (
    value.includes("app")
  ) {
    return "📱";
  }

  if (
    value.includes("website") ||
    value.includes("web")
  ) {
    return "🌐";
  }

  if (
    value.includes("skill")
  ) {
    return "🎯";
  }

  if (
    value.includes("learn") ||
    value.includes("education")
  ) {
    return "🎓";
  }

  if (
    value.includes("roadmap")
  ) {
    return "🗺️";
  }

  if (
    value.includes("productivity")
  ) {
    return "💼";
  }

  if (
    value.includes("medical") ||
    value.includes("health")
  ) {
    return "🩺";
  }

  if (
    value.includes("math")
  ) {
    return "➗";
  }

  if (
    value.includes("science")
  ) {
    return "🔬";
  }

  if (
    value.includes("english")
  ) {
    return "🇬🇧";
  }

  if (
    value.includes("tamil")
  ) {
    return "தமிழ்";
  }

  if (
    value.includes("language")
  ) {
    return "🌍";
  }

  if (
    value.includes("story")
  ) {
    return "📖";
  }

  if (
    value.includes("motivation")
  ) {
    return "🔥";
  }

  if (
    value.includes("life")
  ) {
    return "🌱";
  }

  if (
    value.includes("instagram")
  ) {
    return "📷";
  }

  if (
    value.includes("youtube")
  ) {
    return "▶️";
  }

  if (
    value.includes("pinterest")
  ) {
    return "📌";
  }

  if (
    value.includes("content")
  ) {
    return "✍️";
  }

  if (
    value.includes("detail") ||
    value.includes("note")
  ) {
    return "🧠";
  }

  if (
    value.includes("other")
  ) {
    return "🗂️";
  }

  return "📚";
}

/* =========================================================
   CATEGORY DESCRIPTION
========================================================= */

function getCategoryDescription(
  categoryName
) {
  const value =
    categoryName.toLowerCase();

  if (
    value.includes("chatgpt")
  ) {
    return "ChatGPT commands, prompts, tips and visual guides.";
  }

  if (
    value.includes("claude")
  ) {
    return "Claude AI guides, automation ideas and useful workflows.";
  }

  if (
    value.includes("prompt")
  ) {
    return "Prompt engineering, prompt frameworks and creative prompt ideas.";
  }

  if (
    value.includes("tool")
  ) {
    return "AI tools, apps and useful technology resources.";
  }

  if (
    value.includes("video")
  ) {
    return "AI video tools, generation guides and visual references.";
  }

  if (
    value.includes("money")
  ) {
    return "AI money-making ideas, business concepts and earning skills.";
  }

  if (
    value.includes("skill")
  ) {
    return "Practical AI skills, learning paths and career development.";
  }

  if (
    value.includes("english")
  ) {
    return "English learning, communication and language reference guides.";
  }

  if (
    value.includes("tamil")
  ) {
    return "Tamil learning, stories and useful Tamil visual resources.";
  }

  if (
    value.includes("math")
  ) {
    return "Maths concepts, learning notes and visual explanations.";
  }

  if (
    value.includes("science")
  ) {
    return "Science concepts and visual learning resources.";
  }

  if (
    value.includes("medical")
  ) {
    return "Medical and health-related visual reference resources.";
  }

  if (
    value.includes("story")
  ) {
    return "Stories, inspiration and visual storytelling resources.";
  }

  if (
    value.includes("roadmap")
  ) {
    return "Step-by-step learning and career roadmap resources.";
  }

  if (
    value.includes("productivity")
  ) {
    return "Work, planning and productivity visual resources.";
  }

  if (
    value.includes("website")
  ) {
    return "Website building, web design and development resources.";
  }

  if (
    value.includes("app")
  ) {
    return "App building, application ideas and development guides.";
  }

  return `${titleCase(
    categoryName
  )} visual learning resources.`;
}

/* =========================================================
   FILE TITLE
========================================================= */

function createImageTitle(
  fileName,
  index
) {
  const withoutExtension =
    fileName.replace(
      /\.[^/.]+$/,
      ""
    );

  const cleaned =
    cleanText(
      withoutExtension
    );

  const numeric =
    /^[0-9\s]+$/.test(
      cleaned
    );

  const screenshot =
    cleaned
      .toLowerCase()
      .startsWith(
        "screenshot"
      );

  if (
    !cleaned ||
    numeric ||
    screenshot
  ) {
    return `Visual Guide ${String(
      index + 1
    ).padStart(
      3,
      "0"
    )}`;
  }

  return titleCase(
    cleaned
  );
}

/* =========================================================
   GET CATEGORY FROM REAL FOLDER
========================================================= */

function getFolderCategory(
  path
) {
  const normalized =
    path.replace(
      /\\/g,
      "/"
    );

  const marker =
    "/visual-library/";

  const index =
    normalized.indexOf(
      marker
    );

  if (index === -1) {
    return {
      id:
        "other-guides",

      name:
        "Other Guides",
    };
  }

  const afterLibrary =
    normalized.slice(
      index +
        marker.length
    );

  const parts =
    afterLibrary.split(
      "/"
    );

  /*
    If path:
    visual-library/Chatgpt/image.jpg

    parts:
    ["Chatgpt", "image.jpg"]

    First part = Category.
  */

  if (
    parts.length >= 2
  ) {
    const folder =
      cleanText(
        parts[0]
      );

    return {
      id:
        slugify(
          folder
        ) ||
        "other-guides",

      name:
        titleCase(
          folder
        ),
    };
  }

  /*
    Root-level images:
    visual-library/image.jpg
  */

  return {
    id:
      "other-guides",

    name:
      "Other Guides",
  };
}

/* =========================================================
   BUILD IMAGE LIBRARY
========================================================= */

function buildImageLibrary() {
  return Object.entries(
    imageModules
  )
    .sort(
      ([pathA], [pathB]) =>
        pathA.localeCompare(
          pathB
        )
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
          getFolderCategory(
            path
          );

        return {
          id:
            `${path}-${index}`,

          src,

          path,

          fileName,

          extension,

          categoryId:
            category.id,

          categoryName:
            category.name,

          title:
            createImageTitle(
              fileName,
              index
            ),
        };
      }
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function VisualLibrary() {
  const images =
    useMemo(
      () =>
        buildImageLibrary(),
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
        ? JSON.parse(
            saved
          )
        : [];
    } catch {
      return [];
    }
  });

  /* =========================================================
     BUILD CATEGORIES AUTOMATICALLY
  ========================================================= */

  const categories =
    useMemo(() => {
      const map =
        new Map();

      images.forEach(
        (image) => {
          if (
            !map.has(
              image.categoryId
            )
          ) {
            map.set(
              image.categoryId,
              {
                id:
                  image.categoryId,

                name:
                  image.categoryName,

                icon:
                  getCategoryIcon(
                    image.categoryName
                  ),

                description:
                  getCategoryDescription(
                    image.categoryName
                  ),

                images:
                  [],
              }
            );
          }

          map
            .get(
              image.categoryId
            )
            .images.push(
              image
            );
        }
      );

      return Array.from(
        map.values()
      )
        .map(
          (
            category,
            index
          ) => ({
            ...category,

            count:
              category.images
                .length,

            previews:
              category.images.slice(
                0,
                3
              ),

            style:
              CATEGORY_STYLES[
                index %
                  CATEGORY_STYLES.length
              ],
          })
        )
        .sort(
          (a, b) => {
            if (
              a.id ===
              "other-guides"
            ) {
              return 1;
            }

            if (
              b.id ===
              "other-guides"
            ) {
              return -1;
            }

            return a.name.localeCompare(
              b.name
            );
          }
        );
    }, [images]);

  /* =========================================================
     ACTIVE CATEGORY INFO
  ========================================================= */

  const activeCategoryInfo =
    useMemo(() => {
      if (
        activeCategory ===
        "all"
      ) {
        return {
          id:
            "all",

          name:
            "All Visual Guides",

          icon:
            "📚",

          description:
            "Explore all visual learning resources.",
        };
      }

      return (
        categories.find(
          (category) =>
            category.id ===
            activeCategory
        ) || {
          id:
            "all",

          name:
            "All Visual Guides",

          icon:
            "📚",

          description:
            "Explore all visual learning resources.",
        }
      );
    }, [
      activeCategory,
      categories,
    ]);

  /* =========================================================
     FILTERED IMAGES
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
            image.categoryId ===
              activeCategory;

          const searchMatch =
            !query ||
            image.title
              .toLowerCase()
              .includes(query) ||
            image.fileName
              .toLowerCase()
              .includes(query) ||
            image.categoryName
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
      // Optional browser storage.
    }
  }, [favorites]);

  function toggleFavorite(
    imageId
  ) {
    setFavorites(
      (current) => {
        if (
          current.includes(
            imageId
          )
        ) {
          return current.filter(
            (id) =>
              id !== imageId
          );
        }

        return [
          ...current,
          imageId,
        ];
      }
    );
  }

  /* =========================================================
     OPEN CATEGORY
  ========================================================= */

  function openCategory(
    categoryId
  ) {
    setActiveCategory(
      categoryId
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

  const selectedImage =
    selectedIndex !== null
      ? filteredImages[
          selectedIndex
        ]
      : null;

  /* =========================================================
     KEYBOARD VIEWER
  ========================================================= */

  useEffect(() => {
    if (
      selectedIndex ===
      null
    ) {
      return undefined;
    }

    function handleKeyboard(
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
      handleKeyboard
    );

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    selectedIndex,
    closeModal,
    nextImage,
    previousImage,
  ]);

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-4 pb-24 pt-8 text-white sm:px-6 lg:px-8">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.07] blur-[140px]" />

        <div className="absolute right-[-150px] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.08] blur-[160px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.06] blur-[160px]" />

      </div>

      <div className="relative mx-auto max-w-[1500px]">

        {/* BREADCRUMB */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">

          <Link
            to="/"
            className="transition hover:text-cyan-300"
          >
            Home
          </Link>

          <span>
            →
          </span>

          <span className="text-cyan-300">
            Visual Library
          </span>

        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[36px] border border-white/[0.09] bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent p-7 shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-10 lg:p-12">

          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/[0.10] blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-28 left-[20%] h-72 w-72 rounded-full bg-cyan-500/[0.08] blur-[100px]" />

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
                Every folder inside your visual library becomes its own category
                automatically. Add a new folder, add images, restart Vite and
                your library updates automatically.
              </p>

            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-4">

                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Resources
                </p>

                <p className="mt-2 text-2xl font-black text-cyan-300 sm:text-3xl">
                  {
                    images.length
                  }
                </p>

              </div>

              <div className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.05] px-4 py-4">

                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Categories
                </p>

                <p className="mt-2 text-2xl font-black text-blue-300 sm:text-3xl">
                  {
                    categories.length
                  }
                </p>

              </div>

              <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] px-4 py-4">

                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Saved
                </p>

                <p className="mt-2 text-2xl font-black text-violet-300 sm:text-3xl">
                  {
                    favorites.length
                  }
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY SECTION
        ===================================================== */}

        <section className="mt-12">

          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-300">
                🗂️ Browse Categories
              </div>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Choose What You Want to Learn
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Categories are created automatically from the folders inside
                src/assets/visual-library.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                openCategory(
                  "all"
                )
              }
              className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-5 py-3 text-sm font-black text-cyan-300 transition hover:bg-cyan-400/[0.12]"
            >
              📚 View All {
                images.length
              } Images
            </button>

          </div>

          {/* CATEGORY CARDS */}

          {categories.length >
          0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {categories.map(
                (
                  category
                ) => (
                  <button
                    type="button"
                    key={
                      category.id
                    }
                    onClick={() =>
                      openCategory(
                        category.id
                      )
                    }
                    className={`group relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-5 text-left shadow-[0_18px_50px_rgba(0,0,0,.20)] transition-all duration-500 hover:-translate-y-2 ${category.style.border}`}
                  >

                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.style.gradient} opacity-60`}
                    />

                    <div className="relative">

                      {/* PREVIEW IMAGES */}

                      <div className="grid h-36 grid-cols-3 gap-2">

                        {category.previews
                          .length >
                        0 ? (
                          category.previews.map(
                            (
                              image,
                              previewIndex
                            ) => (
                              <div
                                key={
                                  image.id
                                }
                                className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090e1b] ${
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
                                  decoding="async"
                                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
                                />

                              </div>
                            )
                          )
                        ) : (
                          <div className="col-span-3 flex items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-4xl">
                            {
                              category.icon
                            }
                          </div>
                        )}

                      </div>

                      {/* CATEGORY INFO */}

                      <div className="mt-6 flex items-start gap-4">

                        <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/25 px-2 text-xl">
                          {
                            category.icon
                          }
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <h3 className="text-lg font-black text-white">
                              {
                                category.name
                              }
                            </h3>

                            <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black text-cyan-300">
                              {
                                category.count
                              }
                            </span>

                          </div>

                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {
                              category.description
                            }
                          </p>

                          <div className={`mt-4 flex items-center gap-2 text-xs font-black ${category.style.text}`}>

                            Explore Category

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </button>
                )
              )}

            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

              <div className="text-5xl">
                📁
              </div>

              <h3 className="mt-4 text-xl font-black">
                No categories found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add image folders inside src/assets/visual-library.
              </p>

            </div>
          )}

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
                ← View All Visual Guides
              </button>

              <div className="flex items-center gap-4">

                <div className="flex h-14 min-w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-2 text-2xl">
                  {
                    activeCategoryInfo.icon
                  }
                </div>

                <div>

                  <h2 className="text-2xl font-black sm:text-3xl">
                    {
                      activeCategoryInfo.name
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
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder={`Search ${activeCategoryInfo.name}...`}
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30 focus:bg-cyan-400/[0.04]"
              />

            </div>

          </div>

          {/* CATEGORY FILTERS */}

          <div className="mb-7 overflow-x-auto pb-3">

            <div className="flex min-w-max gap-2">

              <button
                type="button"
                onClick={() =>
                  setActiveCategory(
                    "all"
                  )
                }
                className={`rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                  activeCategory ===
                  "all"
                    ? "border-cyan-400/30 bg-cyan-400/[0.10] text-cyan-300"
                    : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:text-white"
                }`}
              >
                📚 All (
                {
                  images.length
                }
                )
              </button>

              {categories.map(
                (
                  category
                ) => (
                  <button
                    type="button"
                    key={
                      category.id
                    }
                    onClick={() =>
                      setActiveCategory(
                        category.id
                      )
                    }
                    className={`rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                      activeCategory ===
                      category.id
                        ? "border-cyan-400/30 bg-cyan-400/[0.10] text-cyan-300"
                        : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:text-white"
                    }`}
                  >
                    {
                      category.icon
                    }{" "}
                    {
                      category.name
                    }{" "}
                    (
                    {
                      category.count
                    }
                    )
                  </button>
                )
              )}

            </div>

          </div>

          {/* IMAGE GRID */}

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

                  const category =
                    categories.find(
                      (item) =>
                        item.id ===
                        image.categoryId
                    );

                  return (
                    <article
                      key={
                        image.id
                      }
                      className="group overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#090e1b] p-2.5 shadow-[0_18px_45px_rgba(0,0,0,.30)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_25px_70px_rgba(6,182,212,.10)]"
                    >

                      {/* IMAGE */}

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

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        {/* CATEGORY BADGE */}

                        <span className="absolute left-2.5 top-2.5 max-w-[80%] truncate rounded-full border border-white/10 bg-black/75 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur-xl">

                          {
                            category?.icon ||
                            "📚"
                          }{" "}

                          {
                            image.categoryName
                          }

                        </span>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-[10px] font-black text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          🔍 Full View
                        </div>

                      </button>

                      {/* INFO */}

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
                              image.categoryName
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
                          aria-label="Save visual"
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
                Try another category or clear your search.
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
          FULL SCREEN IMAGE VIEWER
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

          {/* TOP BAR */}

          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black via-black/80 to-transparent p-4 sm:p-6">

            <div className="min-w-0">

              <p className="truncate text-sm font-black text-white sm:text-base">
                {
                  selectedImage.title
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">

                {
                  selectedImage.categoryName
                }

                {" • "}

                {
                  selectedIndex +
                  1
                }

                {" / "}

                {
                  filteredImages.length
                }

              </p>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  toggleFavorite(
                    selectedImage.id
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 text-xs font-black text-white transition hover:bg-white/[0.13]"
              >

                {
                  favorites.includes(
                    selectedImage.id
                  )
                    ? "♥ Saved"
                    : "♡ Save"
                }

              </button>

              <a
                href={
                  selectedImage.src
                }
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-xs font-black text-cyan-300 transition hover:bg-cyan-400/[0.14] sm:block"
              >
                Original ↗
              </a>

              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-xl font-black text-white transition hover:bg-red-400/20"
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
              style={{
                imageRendering:
                  "auto",

                filter:
                  "contrast(1.02) saturate(1.02)",
              }}
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
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/75 text-3xl font-black text-white backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-cyan-400/10 sm:left-6 sm:h-14 sm:w-14"
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
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/75 text-3xl font-black text-white backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-cyan-400/10 sm:right-6 sm:h-14 sm:w-14"
            >
              ›
            </button>
          )}

          {/* HELP */}

          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[10px] font-bold text-slate-500 backdrop-blur-xl sm:block">
            ← Previous · → Next · ESC Close
          </div>

        </div>
      )}

    </main>
  );
}