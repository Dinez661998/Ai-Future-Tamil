import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

const imageModules = import.meta.glob(
  "../assets/visual-library/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

/* =========================================================
   IMAGE DATA
========================================================= */

function buildImageLibrary() {
  return Object.entries(imageModules)
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .map(
      (
        [path, src],
        index
      ) => {
        const fileName =
          path.split("/").pop() ||
          `visual-${index + 1}`;

        const extension =
          fileName
            .split(".")
            .pop()
            ?.toUpperCase() ||
          "IMAGE";

        return {
          id: `${fileName}-${index}`,
          src,
          fileName,
          extension,

          title:
            `AI Visual Guide ${String(
              index + 1
            ).padStart(3, "0")}`,
        };
      }
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function VisualLibrary() {
  const [searchParams] =
    useSearchParams();

  const allImages =
    useMemo(
      () =>
        buildImageLibrary(),
      []
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState("ALL");

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
     FILTERS
  ========================================================= */

  const formats =
    useMemo(() => {
      return [
        "ALL",

        ...Array.from(
          new Set(
            allImages.map(
              (image) =>
                image.extension
            )
          )
        ),
      ];
    }, [allImages]);

  const filteredImages =
    useMemo(() => {
      return allImages.filter(
        (image) => {
          const matchesFormat =
            filter === "ALL" ||
            image.extension ===
              filter;

          const query =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !query ||
            image.title
              .toLowerCase()
              .includes(query) ||
            image.fileName
              .toLowerCase()
              .includes(query);

          return (
            matchesFormat &&
            matchesSearch
          );
        }
      );
    }, [
      allImages,
      filter,
      search,
    ]);

  /* =========================================================
     OPEN FROM URL
  ========================================================= */

  useEffect(() => {
    const requested =
      Number(
        searchParams.get("image")
      );

    if (
      Number.isFinite(
        requested
      ) &&
      requested > 0 &&
      requested <=
        allImages.length
    ) {
      const item =
        allImages[
          requested - 1
        ];

      const index =
        filteredImages.findIndex(
          (image) =>
            image.id === item.id
        );

      if (index >= 0) {
        setSelectedIndex(
          index
        );
      }
    }
  }, [
    searchParams,
    allImages,
    filteredImages,
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
      // optional browser storage
    }
  }, [favorites]);

  function toggleFavorite(
    imageId
  ) {
    setFavorites(
      (previous) => {
        if (
          previous.includes(
            imageId
          )
        ) {
          return previous.filter(
            (id) =>
              id !== imageId
          );
        }

        return [
          ...previous,
          imageId,
        ];
      }
    );
  }

  /* =========================================================
     MODAL
  ========================================================= */

  const closeModal =
    useCallback(() => {
      setSelectedIndex(null);
    }, []);

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

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    if (
      selectedIndex === null
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
        "ArrowLeft"
      ) {
        previousImage();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        nextImage();
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
    previousImage,
    nextImage,
  ]);

  const selectedImage =
    selectedIndex !== null
      ? filteredImages[
          selectedIndex
        ]
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-4 pb-24 pt-8 text-white sm:px-6 lg:px-8">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-120px] top-20 h-96 w-96 rounded-full bg-cyan-500/[0.08] blur-[130px]" />

        <div className="absolute right-[-100px] top-[35%] h-[420px] w-[420px] rounded-full bg-purple-600/[0.08] blur-[150px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[420px] w-[420px] rounded-full bg-blue-600/[0.06] blur-[150px]" />
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

          <span>→</span>

          <span className="text-cyan-300">
            Visual Library
          </span>

        </div>

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[36px] border border-white/[0.09] bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9 lg:p-11">

          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/[0.08] blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-24 left-[20%] h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[100px]" />

          <div className="relative">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
              📚 AI Future Tamil
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

              <div>
                <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  AI Visual Learning
                  <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Library
                  </span>
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                  Premium visual reference library containing AI guides,
                  prompt engineering notes, AI tools, automation concepts,
                  learning sheets and useful technology resources.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Resources
                  </p>

                  <p className="mt-2 text-3xl font-black text-cyan-300">
                    {allImages.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-400/15 bg-violet-400/[0.05] px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Saved
                  </p>

                  <p className="mt-2 text-3xl font-black text-violet-300">
                    {
                      favorites.length
                    }
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* SEARCH + FILTER */}

        <section className="sticky top-[76px] z-30 mt-6 rounded-[26px] border border-white/[0.08] bg-[#070b16]/90 p-4 shadow-2xl backdrop-blur-2xl">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative flex-1">

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
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
                placeholder="Search visual guides..."
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/30 focus:bg-cyan-400/[0.04]"
              />

            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">

              {formats.map(
                (format) => (
                  <button
                    key={
                      format
                    }
                    onClick={() =>
                      setFilter(
                        format
                      )
                    }
                    className={`shrink-0 rounded-xl border px-4 py-3 text-xs font-black transition ${
                      filter ===
                      format
                        ? "border-cyan-400/30 bg-cyan-400/[0.10] text-cyan-300"
                        : "border-white/[0.07] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {
                      format ===
                      "ALL"
                        ? "All"
                        : format
                    }
                  </button>
                )
              )}

            </div>

          </div>

        </section>

        {/* RESULT INFO */}

        <div className="mt-7 flex items-center justify-between gap-4">

          <div>
            <h2 className="text-xl font-black sm:text-2xl">
              Visual Resources
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              {
                filteredImages.length
              }{" "}
              resources available
            </p>
          </div>

          <div className="hidden rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-500 sm:block">
            Click any image to view full size
          </div>

        </div>

        {/* GALLERY */}

        {filteredImages.length >
        0 ? (
          <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">

            {filteredImages.map(
              (
                image,
                index
              ) => {
                const favorite =
                  favorites.includes(
                    image.id
                  );

                return (
                  <article
                    key={
                      image.id
                    }
                    className="group relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#090e1b] p-2 shadow-[0_16px_45px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_25px_70px_rgba(6,182,212,0.11)] sm:p-2.5"
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
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.035]"
                        style={{
                          imageRendering:
                            "auto",

                          filter:
                            "contrast(1.025) saturate(1.025)",
                        }}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.02]" />

                      <div className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur-lg">
                        #
                        {String(
                          allImages.findIndex(
                            (
                              item
                            ) =>
                              item.id ===
                              image.id
                          ) + 1
                        ).padStart(
                          3,
                          "0"
                        )}
                      </div>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-xl border border-white/10 bg-black/75 px-3 py-2 text-[10px] font-black text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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

                        <p className="mt-1 text-[10px] font-bold text-slate-600">
                          {
                            image.extension
                          }{" "}
                          • Visual Guide
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
                            ? "border-pink-400/25 bg-pink-400/[0.10] text-pink-300"
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

          </section>
        ) : (
          <div className="mt-6 rounded-[30px] border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="mt-5 text-xl font-black">
              No visual guides found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or
              format.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter(
                  "ALL"
                );
              }}
              className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-black text-black"
            >
              Reset Filters
            </button>

          </div>
        )}

      </div>

      {/* =====================================================
          FULL SCREEN VIEWER
      ===================================================== */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/[0.94] p-3 backdrop-blur-xl sm:p-6"
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

          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-3 bg-gradient-to-b from-black/90 to-transparent p-4 sm:p-6">

            <div className="min-w-0">

              <p className="truncate text-sm font-black text-white sm:text-base">
                {
                  selectedImage.title
                }
              </p>

              <p className="mt-1 text-[10px] font-bold text-slate-500 sm:text-xs">
                {selectedIndex +
                  1}{" "}
                /{" "}
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
                className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-black text-white transition hover:bg-white/[0.12]"
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
                className="hidden h-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 text-xs font-black text-cyan-300 transition hover:bg-cyan-400/[0.14] sm:flex"
              >
                Open Original ↗
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

          <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center pt-14">

            <img
              src={
                selectedImage.src
              }
              alt={
                selectedImage.title
              }
              draggable="false"
              className="max-h-full max-w-full select-none object-contain shadow-[0_35px_100px_rgba(0,0,0,0.7)]"
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
              className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-2xl font-black text-white backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-cyan-400/15 sm:left-6 sm:h-14 sm:w-14"
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
              className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-2xl font-black text-white backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-cyan-400/15 sm:right-6 sm:h-14 sm:w-14"
            >
              ›
            </button>
          )}

          {/* HELP */}

          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[10px] font-bold text-slate-500 backdrop-blur-xl sm:block">
            ← Previous · → Next · ESC Close
          </div>

        </div>
      )}

    </main>
  );
}