import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";

import {
  getFavoriteTools,
  toggleFavoriteTool,
} from "../utils/dashboardStorage";

/* =========================================================
   HELPERS
========================================================= */

function getSafeFavorites() {
  try {
    const favorites = getFavoriteTools();

    return Array.isArray(favorites)
      ? favorites.map(String)
      : [];
  } catch (error) {
    console.error("Favorite read error:", error);
    return [];
  }
}

function getCategoryIcon(category) {
  const icons = {
    "AI Chat": "🤖",
    "AI Image": "🎨",
    "AI Video": "🎬",
    "AI Music": "🎵",
    "AI Coding": "💻",
    "AI Writing": "✍️",
    Productivity: "⚡",
    Education: "🎓",
    Other: "✨",
  };

  return icons[category] || "🤖";
}

function getGoodFor(category) {
  const map = {
    "AI Chat": ["writing", "chat"],
    "AI Image": ["image"],
    "AI Video": ["video"],
    "AI Music": ["music"],
    "AI Coding": ["coding"],
    "AI Writing": ["writing"],
    Productivity: ["productivity"],
    Education: ["learning"],
  };

  return map[category] || ["other"];
}

function normalizePricing(value) {
  const pricing = String(value || "Free").toLowerCase();

  if (pricing.includes("free") && pricing.includes("trial")) {
    return "Free Trial";
  }

  if (pricing.includes("freemium")) {
    return "Freemium";
  }

  if (pricing.includes("paid")) {
    return "Paid";
  }

  return "Free";
}

function getPopularity(tool) {
  if (tool.trending && tool.featured) return 95;
  if (tool.trending) return 88;
  if (tool.featured) return 82;

  return 70;
}

function getBadge(tool) {
  if (tool.trending) return "popular";
  if (tool.featured) return "featured";

  return null;
}

/* =========================================================
   FAVORITE BUTTON
========================================================= */

function FavoriteButton({ tool, onChange }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const updateFavorite = () => {
      setFavorite(
        getSafeFavorites().includes(String(tool.id))
      );
    };

    updateFavorite();

    window.addEventListener(
      "dashboard-data-updated",
      updateFavorite
    );

    window.addEventListener(
      "storage",
      updateFavorite
    );

    return () => {
      window.removeEventListener(
        "dashboard-data-updated",
        updateFavorite
      );

      window.removeEventListener(
        "storage",
        updateFavorite
      );
    };
  }, [tool.id]);

  function handleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      toggleFavoriteTool(tool.id);

      setFavorite((current) => !current);

      window.dispatchEvent(
        new Event("dashboard-data-updated")
      );

      onChange?.();
    } catch (error) {
      console.error(
        "Favorite button error:",
        error
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleFavorite}
      aria-label={
        favorite
          ? "Remove favorite"
          : "Add favorite"
      }
      className={`
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border
        text-xl
        transition-all
        duration-300

        ${
          favorite
            ? `
              border-pink-400/40
              bg-pink-500/10
              text-pink-400
            `
            : `
              border-white/[0.08]
              bg-white/[0.03]
              text-gray-500
              hover:border-pink-400/30
              hover:text-pink-400
            `
        }
      `}
    >
      {favorite ? "❤️" : "♡"}
    </button>
  );
}

/* =========================================================
   TOOL BADGES
========================================================= */

function ToolBadges({
  badge,
  pricing,
  featured,
}) {
  return (
    <div className="flex flex-wrap gap-2">

      {badge === "popular" && (
        <span
          className="
            rounded-full
            border
            border-orange-400/20
            bg-orange-400/[0.06]
            px-3
            py-1
            text-[11px]
            font-bold
            text-orange-300
          "
        >
          🔥 Trending
        </span>
      )}

      {featured && (
        <span
          className="
            rounded-full
            border
            border-yellow-400/20
            bg-yellow-400/[0.06]
            px-3
            py-1
            text-[11px]
            font-bold
            text-yellow-300
          "
        >
          ⭐ Featured
        </span>
      )}

      <span
        className="
          rounded-full
          border
          border-cyan-400/20
          bg-cyan-400/[0.06]
          px-3
          py-1
          text-[11px]
          font-bold
          text-cyan-300
        "
      >
        {pricing}
      </span>

    </div>
  );
}

/* =========================================================
   POPULARITY
========================================================= */

function PopularityBar({ value }) {
  return (
    <div className="mt-5">

      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          text-xs
        "
      >
        <span className="text-gray-500">
          🔥 Popularity
        </span>

        <span className="font-bold text-gray-300">
          {value}%
        </span>
      </div>

      <div
        className="
          h-1.5
          overflow-hidden
          rounded-full
          bg-white/[0.06]
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-cyan-400
            via-purple-500
            to-pink-500
          "
          style={{
            width: `${value}%`,
          }}
        />
      </div>

    </div>
  );
}

/* =========================================================
   TOOL FINDER
========================================================= */

function ToolFinderQuiz({
  tools,
  onClose,
  onResult,
}) {
  const [selected, setSelected] =
    useState(null);

  const options = [
    {
      icon: "✍️",
      title: "Writing & Chat",
      value: "writing",
    },
    {
      icon: "🎨",
      title: "AI Images",
      value: "image",
    },
    {
      icon: "🎬",
      title: "AI Videos",
      value: "video",
    },
    {
      icon: "🎵",
      title: "AI Music",
      value: "music",
    },
  ];

  function handleSelect(value) {
    setSelected(value);

    const match =
      tools.find((tool) =>
        tool.goodFor.includes(value)
      ) || tools[0];

    if (!match) return;

    setTimeout(() => {
      onResult(match);
    }, 200);
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[10000]
        flex
        items-center
        justify-center
        bg-black/80
        px-4
        backdrop-blur-md
      "
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-xl
          rounded-[30px]
          border
          border-cyan-400/20
          bg-[#080a13]
          p-7
          sm:p-9
        "
      >

        <div
          className="
            mb-8
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                mb-2
                text-sm
                font-bold
                text-cyan-400
              "
            >
              🎯 Smart Tool Finder
            </p>

            <h2
              className="
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              What do you want to create?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              text-gray-500
              hover:text-white
            "
          >
            ✕
          </button>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                handleSelect(option.value)
              }
              className={`
                rounded-2xl
                border
                p-5
                text-left
                transition-all

                ${
                  selected === option.value
                    ? `
                      border-cyan-400/40
                      bg-cyan-400/[0.08]
                    `
                    : `
                      border-white/[0.08]
                      bg-white/[0.025]
                      hover:border-cyan-400/20
                    `
                }
              `}
            >
              <div className="mb-3 text-3xl">
                {option.icon}
              </div>

              <p className="font-bold">
                {option.title}
              </p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function AITools() {
  const [tools, setTools] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    favoriteCount,
    setFavoriteCount,
  ] = useState(0);

  const [
    compareIds,
    setCompareIds,
  ] = useState([]);

  const [
    showCompare,
    setShowCompare,
  ] = useState(false);

  const [
    showQuiz,
    setShowQuiz,
  ] = useState(false);

  const [
    quizResult,
    setQuizResult,
  ] = useState(null);

  /* =======================================================
     LOAD TOOLS FROM SUPABASE
  ======================================================= */

  useEffect(() => {
    fetchTools();
  }, []);

  async function fetchTools() {
    setLoading(true);
    setError("");

    try {
      const {
        data,
        error: fetchError,
      } = await supabase
        .from("ai_tools")
        .select("*")
        .order("trending", {
          ascending: false,
        })
        .order("featured", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) {
        throw fetchError;
      }

      const formattedTools =
        (data || []).map((tool) => ({
          dbId: tool.id,

          /*
            IMPORTANT:
            Website route/favorites-ku slug use pannrom.
          */

          id:
            tool.slug ||
            String(tool.id),

          slug:
            tool.slug ||
            String(tool.id),

          name:
            tool.name ||
            "AI Tool",

          category:
            tool.category ||
            "Other",

          description:
            tool.description ||
            "Explore this AI tool on AI Future Tamil.",

          websiteUrl:
            tool.website_url || "",

          logoUrl:
            tool.logo_url || "",

          pricing:
            normalizePricing(
              tool.pricing
            ),

          featured:
            Boolean(tool.featured),

          trending:
            Boolean(tool.trending),

          icon:
            getCategoryIcon(
              tool.category
            ),

          badge:
            getBadge(tool),

          popularity:
            getPopularity(tool),

          goodFor:
            getGoodFor(
              tool.category
            ),
        }));

      setTools(formattedTools);
    } catch (fetchError) {
      console.error(
        "AI Tools fetch error:",
        fetchError
      );

      setError(
        "AI Tools load aagala. Konjam refresh panni try pannunga."
      );

      setTools([]);
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     FAVORITES
  ======================================================= */

  function updateFavoriteCount() {
    setFavoriteCount(
      getSafeFavorites().length
    );
  }

  useEffect(() => {
    updateFavoriteCount();

    const update = () =>
      updateFavoriteCount();

    window.addEventListener(
      "dashboard-data-updated",
      update
    );

    window.addEventListener(
      "storage",
      update
    );

    return () => {
      window.removeEventListener(
        "dashboard-data-updated",
        update
      );

      window.removeEventListener(
        "storage",
        update
      );
    };
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        tools
          .map((tool) => tool.category)
          .filter(Boolean)
      ),
    ];

    return [
      "All",
      ...uniqueCategories,
    ];
  }, [tools]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredTools = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return tools.filter((tool) => {
      const categoryMatch =
        activeCategory === "All" ||
        tool.category ===
          activeCategory;

      const searchMatch =
        tool.name
          .toLowerCase()
          .includes(query) ||
        tool.category
          .toLowerCase()
          .includes(query) ||
        tool.description
          .toLowerCase()
          .includes(query);

      return (
        categoryMatch &&
        searchMatch
      );
    });
  }, [
    tools,
    search,
    activeCategory,
  ]);

  /* =======================================================
     TOOL OF DAY
  ======================================================= */

  const toolOfTheDay = useMemo(() => {
    if (tools.length === 0) {
      return null;
    }

    return tools[
      new Date().getDate() %
        tools.length
    ];
  }, [tools]);

  /* =======================================================
     COMPARE
  ======================================================= */

  function toggleCompare(toolId) {
    setCompareIds((current) => {
      if (
        current.includes(toolId)
      ) {
        return current.filter(
          (id) => id !== toolId
        );
      }

      if (current.length >= 2) {
        return [
          current[1],
          toolId,
        ];
      }

      return [
        ...current,
        toolId,
      ];
    });
  }

  const compareTools =
    tools.filter((tool) =>
      compareIds.includes(tool.id)
    );

  /* =======================================================
     SURPRISE
  ======================================================= */

  function handleSurprise() {
    if (tools.length === 0) {
      return;
    }

    const tool =
      tools[
        Math.floor(
          Math.random() *
            tools.length
        )
      ];

    openTool(tool);
  }

  /* =======================================================
     OPEN TOOL
  ======================================================= */

  function openTool(tool) {
    if (tool.websiteUrl) {
      window.open(
        tool.websiteUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    window.location.href =
      `/ai-tools/${tool.slug}`;
  }

  /* =======================================================
     CATEGORY ICON
  ======================================================= */

  function categoryButtonIcon(
    category
  ) {
    if (category === "All") {
      return "✨";
    }

    return getCategoryIcon(
      category
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          text-white
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-white/10
              border-t-cyan-400
            "
          />

          <p
            className="
              mt-5
              font-bold
              text-gray-400
            "
          >
            Loading AI Tools...
          </p>

        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        pb-20
        text-white
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-5
          py-8
          sm:px-7
          lg:px-9
          lg:py-10
        "
      >

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.08]
            bg-black/25
            px-6
            py-9
            backdrop-blur-xl
            sm:px-8
            lg:px-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-8
              xl:flex-row
              xl:items-end
              xl:justify-between
            "
          >

            <div className="max-w-3xl">

              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-400/20
                  bg-cyan-400/[0.05]
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-cyan-300
                "
              >
                🤖 AI Collection
              </div>

              <h1
                className="
                  text-4xl
                  font-black
                  tracking-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Discover the Best{" "}

                <span
                  className="
                    bg-gradient-to-r
                    from-cyan-300
                    via-purple-400
                    to-pink-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  AI Tools
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base
                  leading-7
                  text-gray-400
                  sm:text-lg
                "
              >
                Find powerful AI tools for
                chat, images, videos, music,
                coding, learning and
                productivity.
              </p>

            </div>

            {/* STATS */}

            <div
              className="
                grid
                grid-cols-3
                gap-3
                sm:min-w-[430px]
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  p-4
                "
              >
                <p className="text-2xl font-black">
                  {tools.length}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  AI Tools
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  p-4
                "
              >
                <p className="text-2xl font-black">
                  {Math.max(
                    categories.length - 1,
                    0
                  )}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Categories
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-pink-400/20
                  bg-pink-400/[0.05]
                  p-4
                "
              >
                <p
                  className="
                    text-2xl
                    font-black
                    text-pink-300
                  "
                >
                  {favoriteCount}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Saved
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-400/20
              bg-red-400/[0.05]
              p-5
              text-red-300
            "
          >
            ❌ {error}

            <button
              type="button"
              onClick={fetchTools}
              className="
                ml-4
                font-bold
                underline
              "
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section
          className="
            mt-5
            grid
            grid-cols-1
            gap-4
            lg:grid-cols-[1fr_auto]
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              rounded-2xl
              border
              border-white/[0.08]
              bg-black/25
              p-4
              backdrop-blur-xl
            "
          >
            <button
              type="button"
              disabled={
                tools.length === 0
              }
              onClick={() =>
                setShowQuiz(true)
              }
              className="
                rounded-xl
                border
                border-cyan-400/30
                bg-cyan-400/[0.06]
                px-5
                py-3
                text-sm
                font-bold
                text-cyan-300
                disabled:opacity-40
              "
            >
              🎯 Find My Tool
            </button>

            <button
              type="button"
              disabled={
                tools.length === 0
              }
              onClick={handleSurprise}
              className="
                rounded-xl
                border
                border-pink-400/30
                bg-pink-400/[0.06]
                px-5
                py-3
                text-sm
                font-bold
                text-pink-300
                disabled:opacity-40
              "
            >
              🎲 Surprise Me
            </button>

            <button
              type="button"
              onClick={fetchTools}
              className="
                rounded-xl
                border
                border-green-400/20
                bg-green-400/[0.05]
                px-5
                py-3
                text-sm
                font-bold
                text-green-300
              "
            >
              🔄 Refresh Tools
            </button>

          </div>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-pink-400/15
              bg-black/25
              px-5
              py-4
            "
          >
            <span className="text-xl">
              ❤️
            </span>

            <div>
              <p className="text-xs text-gray-600">
                Your Favorites
              </p>

              <p className="font-black">
                {favoriteCount} saved
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            TOOL OF THE DAY
        ================================================= */}

        {toolOfTheDay && (
          <section className="mt-5">

            <div
              className="
                rounded-[28px]
                border
                border-yellow-400/20
                bg-gradient-to-r
                from-yellow-400/[0.05]
                via-purple-400/[0.04]
                to-pink-400/[0.05]
                p-6
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-5
                  "
                >
                  <div
                    className="
                      flex
                      h-20
                      w-20
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border
                      border-yellow-400/20
                      bg-yellow-400/[0.06]
                      text-4xl
                    "
                  >
                    {toolOfTheDay.logoUrl ? (
                      <img
                        src={
                          toolOfTheDay.logoUrl
                        }
                        alt={
                          toolOfTheDay.name
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      toolOfTheDay.icon
                    )}
                  </div>

                  <div>
                    <p
                      className="
                        mb-1
                        text-sm
                        font-bold
                        text-yellow-300
                      "
                    >
                      ✨ Tool of the Day
                    </p>

                    <h2
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {toolOfTheDay.name}
                    </h2>

                    <p
                      className="
                        mt-2
                        max-w-xl
                        text-sm
                        leading-6
                        text-gray-400
                      "
                    >
                      {
                        toolOfTheDay.description
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openTool(
                      toolOfTheDay
                    )
                  }
                  className="
                    shrink-0
                    rounded-xl
                    bg-white
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-black
                    hover:bg-gray-200
                  "
                >
                  Explore Tool →
                </button>

              </div>
            </div>

          </section>
        )}

        {/* =================================================
            SEARCH
        ================================================= */}

        <section
          className="
            mt-7
            rounded-[28px]
            border
            border-white/[0.08]
            bg-black/25
            p-5
            backdrop-blur-xl
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >

            <div className="relative flex-1">

              <span
                className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-gray-600
                "
              >
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search AI tools..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/[0.09]
                  bg-[#080a13]
                  py-4
                  pl-12
                  pr-5
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-cyan-400/40
                "
              />

            </div>

            <div
              className="
                flex
                gap-2
                overflow-x-auto
                pb-1
              "
            >
              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                    className={`
                      min-w-max
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-sm
                      font-bold

                      ${
                        activeCategory ===
                        category
                          ? `
                            border-white
                            bg-white
                            text-black
                          `
                          : `
                            border-white/[0.08]
                            bg-white/[0.025]
                            text-gray-400
                          `
                      }
                    `}
                  >
                    {
                      categoryButtonIcon(
                        category
                      )
                    }{" "}
                    {category}
                  </button>
                )
              )}
            </div>

          </div>
        </section>

        {/* =================================================
            COMPARE BAR
        ================================================= */}

        {compareIds.length > 0 && (
          <section className="mt-5">

            <div
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-purple-400/25
                bg-purple-400/[0.06]
                px-5
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>
                <p
                  className="
                    font-bold
                    text-purple-300
                  "
                >
                  ⚖️ Compare Tools
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  {compareIds.length}/2 selected
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setCompareIds([])
                  }
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2
                    text-sm
                    text-gray-400
                  "
                >
                  Clear
                </button>

                <button
                  type="button"
                  disabled={
                    compareIds.length !== 2
                  }
                  onClick={() =>
                    setShowCompare(true)
                  }
                  className="
                    rounded-xl
                    bg-purple-500
                    px-5
                    py-2
                    text-sm
                    font-bold
                    disabled:opacity-40
                  "
                >
                  Compare Now
                </button>

              </div>
            </div>

          </section>
        )}

        {/* =================================================
            TITLE
        ================================================= */}

        <section
          className="
            mt-10
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-sm
                font-bold
                text-cyan-400
              "
            >
              ⚡ Explore Collection
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              {activeCategory === "All"
                ? "All AI Tools"
                : activeCategory}
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredTools.length}{" "}
            {filteredTools.length === 1
              ? "tool"
              : "tools"}{" "}
            found
          </p>
        </section>

        {/* =================================================
            GRID
        ================================================= */}

        <section className="mt-6">

          {filteredTools.length === 0 ? (

            <div
              className="
                rounded-[28px]
                border
                border-dashed
                border-white/10
                bg-black/25
                px-6
                py-16
                text-center
              "
            >
              <div className="text-5xl">
                🤖
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-black
                "
              >
                No AI Tools Found
              </h3>

              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                Admin Dashboard-la tool
                add pannunga.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory(
                    "All"
                  );
                }}
                className="
                  mt-6
                  rounded-xl
                  border
                  border-cyan-400/25
                  bg-cyan-400/[0.05]
                  px-5
                  py-3
                  font-bold
                  text-cyan-300
                "
              >
                Reset Filters
              </button>
            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {filteredTools.map(
                (tool) => {

                  const selected =
                    compareIds.includes(
                      tool.id
                    );

                  return (
                    <article
                      key={tool.dbId}
                      className={`
                        group
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border
                        bg-[#111318]/85
                        p-6
                        transition-all
                        duration-300
                        hover:-translate-y-1

                        ${
                          selected
                            ? `
                              border-purple-400/45
                            `
                            : `
                              border-white/[0.08]
                              hover:border-cyan-400/25
                            `
                        }
                      `}
                    >

                      {/* TOP */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-4
                        "
                      >

                        <div
                          className="
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-white/[0.035]
                            text-4xl
                          "
                        >
                          {tool.logoUrl ? (
                            <img
                              src={
                                tool.logoUrl
                              }
                              alt={tool.name}
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          ) : (
                            tool.icon
                          )}
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              toggleCompare(
                                tool.id
                              )
                            }
                            className={`
                              flex
                              h-11
                              items-center
                              gap-2
                              rounded-xl
                              border
                              px-3
                              text-xs
                              font-bold

                              ${
                                selected
                                  ? `
                                    border-purple-400/35
                                    bg-purple-400/[0.08]
                                    text-purple-300
                                  `
                                  : `
                                    border-white/[0.08]
                                    bg-white/[0.025]
                                    text-gray-500
                                  `
                              }
                            `}
                          >
                            {selected
                              ? "✓"
                              : "⚖️"}{" "}
                            Compare
                          </button>

                          <FavoriteButton
                            tool={tool}
                            onChange={
                              updateFavoriteCount
                            }
                          />

                        </div>
                      </div>

                      {/* CATEGORY */}

                      <div className="mt-6">

                        <p
                          className="
                            mb-3
                            text-sm
                            font-bold
                            text-cyan-400
                          "
                        >
                          {tool.category}
                        </p>

                        <ToolBadges
                          badge={
                            tool.badge
                          }
                          pricing={
                            tool.pricing
                          }
                          featured={
                            tool.featured
                          }
                        />

                      </div>

                      <h3
                        className="
                          mt-5
                          text-2xl
                          font-black
                        "
                      >
                        {tool.name}
                      </h3>

                      <p
                        className="
                          mt-3
                          min-h-[72px]
                          text-sm
                          leading-6
                          text-gray-400
                        "
                      >
                        {tool.description}
                      </p>

                      <PopularityBar
                        value={
                          tool.popularity
                        }
                      />

                      <div
                        className="
                          mt-6
                          flex
                          gap-3
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            openTool(tool)
                          }
                          className="
                            flex-1
                            rounded-xl
                            bg-white
                            px-5
                            py-3.5
                            text-sm
                            font-black
                            text-black
                            transition
                            hover:bg-gray-200
                          "
                        >
                          Visit Tool →
                        </button>

                        {tool.websiteUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                tool.websiteUrl,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            className="
                              flex
                              h-[50px]
                              w-[50px]
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-white/[0.08]
                              bg-white/[0.025]
                              text-gray-400
                              hover:text-cyan-300
                            "
                          >
                            ↗
                          </button>
                        )}

                      </div>

                    </article>
                  );
                }
              )}
            </div>

          )}

        </section>

      </div>

      {/* ===================================================
          QUIZ
      =================================================== */}

      {showQuiz &&
        !quizResult &&
        tools.length > 0 && (
          <ToolFinderQuiz
            tools={tools}
            onClose={() =>
              setShowQuiz(false)
            }
            onResult={(tool) =>
              setQuizResult(tool)
            }
          />
        )}

      {/* ===================================================
          QUIZ RESULT
      =================================================== */}

      {quizResult && (
        <div
          className="
            fixed
            inset-0
            z-[10000]
            flex
            items-center
            justify-center
            bg-black/80
            px-4
            backdrop-blur-md
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-[30px]
              border
              border-green-400/25
              bg-[#080a13]
              p-8
              text-center
            "
          >
            <div className="text-6xl">
              {quizResult.icon}
            </div>

            <p
              className="
                mt-5
                text-sm
                font-bold
                text-green-400
              "
            >
              🎯 Best match for you
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-black
              "
            >
              {quizResult.name}
            </h2>

            <p
              className="
                mt-4
                leading-7
                text-gray-400
              "
            >
              {
                quizResult.description
              }
            </p>

            <div
              className="
                mt-7
                grid
                grid-cols-2
                gap-3
              "
            >
              <button
                type="button"
                onClick={() => {
                  setQuizResult(null);
                  setShowQuiz(false);
                }}
                className="
                  rounded-xl
                  border
                  border-white/10
                  py-3
                  font-bold
                  text-gray-400
                "
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  openTool(
                    quizResult
                  )
                }
                className="
                  rounded-xl
                  bg-white
                  py-3
                  font-black
                  text-black
                "
              >
                Visit →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================
          COMPARE
      =================================================== */}

      {showCompare &&
        compareTools.length === 2 && (
          <div
            className="
              fixed
              inset-0
              z-[10000]
              flex
              items-center
              justify-center
              bg-black/80
              px-4
              backdrop-blur-md
            "
          >
            <div
              className="
                w-full
                max-w-4xl
                rounded-[30px]
                border
                border-purple-400/25
                bg-[#080a13]
                p-6
                sm:p-8
              "
            >

              <div
                className="
                  mb-7
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      font-bold
                      text-purple-400
                    "
                  >
                    ⚖️ Side by Side
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-black
                    "
                  >
                    Compare AI Tools
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowCompare(false)
                  }
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    text-gray-500
                  "
                >
                  ✕
                </button>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-2
                "
              >
                {compareTools.map(
                  (tool) => (
                    <div
                      key={tool.dbId}
                      className="
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.025]
                        p-6
                      "
                    >

                      <div className="text-5xl">
                        {tool.icon}
                      </div>

                      <h3
                        className="
                          mt-4
                          text-2xl
                          font-black
                        "
                      >
                        {tool.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-bold
                          text-cyan-400
                        "
                      >
                        {tool.category}
                      </p>

                      <div
                        className="
                          mt-6
                          space-y-4
                          text-sm
                        "
                      >

                        <div
                          className="
                            flex
                            justify-between
                            border-b
                            border-white/[0.07]
                            pb-3
                          "
                        >
                          <span className="text-gray-500">
                            Pricing
                          </span>

                          <span className="font-bold">
                            {tool.pricing}
                          </span>
                        </div>

                        <div
                          className="
                            flex
                            justify-between
                            border-b
                            border-white/[0.07]
                            pb-3
                          "
                        >
                          <span className="text-gray-500">
                            Popularity
                          </span>

                          <span className="font-bold">
                            {
                              tool.popularity
                            }
                            %
                          </span>
                        </div>

                        <div
                          className="
                            flex
                            justify-between
                          "
                        >
                          <span className="text-gray-500">
                            Status
                          </span>

                          <span className="font-bold">
                            {tool.trending
                              ? "🔥 Trending"
                              : tool.featured
                              ? "⭐ Featured"
                              : "Standard"}
                          </span>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openTool(tool)
                        }
                        className="
                          mt-6
                          block
                          w-full
                          rounded-xl
                          bg-white
                          py-3
                          text-center
                          font-black
                          text-black
                        "
                      >
                        Visit Tool →
                      </button>

                    </div>
                  )
                )}
              </div>

            </div>
          </div>
        )}

    </main>
  );
}