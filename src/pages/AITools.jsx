import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  getFavoriteTools,
  toggleFavoriteTool,
} from "../utils/dashboardStorage";

/* =========================================================
   AI TOOLS DATA
========================================================= */

const tools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "AI Chat",
    icon: "🤖",
    description:
      "AI assistant for writing, coding, learning and productivity.",
    badge: "popular",
    pricing: "free",
    popularity: 95,
    goodFor: ["writing", "chat"],
  },

  {
    id: "gemini",
    name: "Gemini",
    category: "AI Chat",
    icon: "💎",
    description:
      "Google AI assistant for research, writing and everyday tasks.",
    badge: "popular",
    pricing: "free",
    popularity: 88,
    goodFor: ["writing", "chat"],
  },

  {
    id: "claude",
    name: "Claude",
    category: "AI Chat",
    icon: "🧠",
    description:
      "Powerful AI assistant for writing, analysis and coding.",
    badge: "popular",
    pricing: "free",
    popularity: 90,
    goodFor: ["writing", "chat"],
  },

  {
    id: "midjourney",
    name: "Midjourney",
    category: "AI Image",
    icon: "🎨",
    description:
      "Create stunning AI-generated images from text prompts.",
    badge: "new",
    pricing: "paid",
    popularity: 82,
    goodFor: ["image"],
  },

  {
    id: "runway",
    name: "Runway",
    category: "AI Video",
    icon: "🎬",
    description:
      "Create and edit videos using powerful AI tools.",
    badge: "new",
    pricing: "paid",
    popularity: 70,
    goodFor: ["video"],
  },

  {
    id: "suno",
    name: "Suno AI",
    category: "AI Music",
    icon: "🎵",
    description:
      "Generate songs and music using artificial intelligence.",
    badge: null,
    pricing: "free",
    popularity: 65,
    goodFor: ["music"],
  },
];

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

const categoryIcons = {
  All: "✨",
  "AI Chat": "🤖",
  "AI Image": "🎨",
  "AI Video": "🎬",
  "AI Music": "🎵",
};

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

  const handleFavorite = (event) => {
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
  };

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
              shadow-[0_0_18px_rgba(236,72,153,.15)]
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
   BADGES
========================================================= */

function ToolBadges({ badge, pricing }) {
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
          🔥 Popular
        </span>
      )}

      {badge === "new" && (
        <span
          className="
            rounded-full
            border
            border-green-400/20
            bg-green-400/[0.06]
            px-3
            py-1
            text-[11px]
            font-bold
            text-green-300
          "
        >
          🆕 New
        </span>
      )}

      <span
        className={`
          rounded-full
          border
          px-3
          py-1
          text-[11px]
          font-bold

          ${
            pricing === "free"
              ? `
                border-cyan-400/20
                bg-cyan-400/[0.06]
                text-cyan-300
              `
              : `
                border-purple-400/20
                bg-purple-400/[0.06]
                text-purple-300
              `
          }
        `}
      >
        {pricing === "free"
          ? "✓ Free"
          : "💎 Paid"}
      </span>

    </div>
  );
}

/* =========================================================
   POPULARITY BAR
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
            transition-all
            duration-700
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
   FIND MY TOOL MODAL
========================================================= */

function ToolFinderQuiz({
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

  const handleSelect = (value) => {
    setSelected(value);

    const match =
      tools.find((tool) =>
        tool.goodFor.includes(value)
      ) || tools[0];

    setTimeout(() => {
      onResult(match);
    }, 250);
  };

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
          shadow-[0_0_70px_rgba(34,211,238,.10)]
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
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              text-gray-500
              transition
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
                duration-300
                hover:-translate-y-1

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
   MAIN PAGE
========================================================= */

function AITools() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [favoriteCount, setFavoriteCount] =
    useState(0);

  const [compareIds, setCompareIds] =
    useState([]);

  const [showCompare, setShowCompare] =
    useState(false);

  const [showQuiz, setShowQuiz] =
    useState(false);

  const [quizResult, setQuizResult] =
    useState(null);

  /* =======================================================
     FAVORITES
  ======================================================= */

  const updateFavoriteCount = () => {
    setFavoriteCount(
      getSafeFavorites().length
    );
  };

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
     TOOL OF THE DAY
  ======================================================= */

  const toolOfTheDay =
    tools[
      new Date().getDate() %
        tools.length
    ];

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = [
    "All",
    "AI Chat",
    "AI Image",
    "AI Video",
    "AI Music",
  ];

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
        tool.category === activeCategory;

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
  }, [search, activeCategory]);

  /* =======================================================
     COMPARE
  ======================================================= */

  const toggleCompare = (toolId) => {
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
  };

  const compareTools = tools.filter(
    (tool) =>
      compareIds.includes(tool.id)
  );

  /* =======================================================
     SURPRISE
  ======================================================= */

  const handleSurprise = () => {
    const tool =
      tools[
        Math.floor(
          Math.random() *
            tools.length
        )
      ];

    navigate(
      `/ai-tools/${tool.id}`
    );
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        text-white
        pb-20
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

            {/* HERO STATS */}

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
                  {categories.length - 1}
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
                <p className="text-2xl font-black text-pink-300">
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
                transition-all
                hover:-translate-y-0.5
                hover:bg-cyan-400/10
              "
            >
              🎯 Find My Tool
            </button>

            <button
              type="button"
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
                transition-all
                hover:-translate-y-0.5
                hover:bg-pink-400/10
              "
            >
              🎲 Surprise Me
            </button>

            <p
              className="
                hidden
                text-sm
                text-gray-600
                xl:block
              "
            >
              Choose a tool instantly or
              let us recommend one.
            </p>
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

        <section className="mt-5">

          <div
            className="
              relative
              overflow-hidden
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
                relative
                z-10
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
                    rounded-2xl
                    border
                    border-yellow-400/20
                    bg-yellow-400/[0.06]
                    text-4xl
                  "
                >
                  {toolOfTheDay.icon}
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

              <Link
                to={`/ai-tools/${toolOfTheDay.id}`}
                className="
                  shrink-0
                  rounded-xl
                  bg-white
                  px-6
                  py-3
                  text-center
                  text-sm
                  font-black
                  text-black
                  transition
                  hover:bg-gray-200
                "
              >
                Explore Tool →
              </Link>

            </div>
          </div>

        </section>

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
                placeholder="Search ChatGPT, image tools, video AI..."
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
                  transition-all
                  placeholder:text-gray-600
                  focus:border-cyan-400/40
                  focus:shadow-[0_0_25px_rgba(34,211,238,.06)]
                "
              />

            </div>

            {/* CATEGORIES */}

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
                      transition-all

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
                            hover:border-cyan-400/25
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {
                      categoryIcons[
                        category
                      ]
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
                  {compareIds.length}/2
                  selected
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
                    text-white
                    transition
                    disabled:cursor-not-allowed
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
            SECTION HEADER
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

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {filteredTools.length}{" "}
            {filteredTools.length === 1
              ? "tool"
              : "tools"}{" "}
            found
          </p>
        </section>

        {/* =================================================
            TOOL GRID
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
                🔍
              </div>

              <h3
                className="
                  mt-5
                  text-xl
                  font-black
                "
              >
                No tools found
              </h3>

              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                Try another search or
                category.
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
                      key={tool.id}
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
                        hover:shadow-[0_20px_60px_rgba(0,0,0,.22)]

                        ${
                          selected
                            ? `
                              border-purple-400/45
                              shadow-[0_0_30px_rgba(168,85,247,.10)]
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
                            rounded-2xl
                            border
                            border-white/[0.08]
                            bg-white/[0.035]
                            text-4xl
                            transition-all
                            duration-300
                            group-hover:scale-105
                            group-hover:border-cyan-400/20
                          "
                        >
                          {tool.icon}
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
                              transition

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
                                    hover:text-white
                                  `
                              }
                            `}
                          >
                            <span>
                              {selected
                                ? "✓"
                                : "⚖️"}
                            </span>

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

                      {/* CATEGORY + BADGES */}

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
                          badge={tool.badge}
                          pricing={
                            tool.pricing
                          }
                        />

                      </div>

                      {/* TITLE */}

                      <h3
                        className="
                          mt-5
                          text-2xl
                          font-black
                          tracking-tight
                        "
                      >
                        {tool.name}
                      </h3>

                      {/* DESCRIPTION */}

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

                      {/* FOOTER */}

                      <div
                        className="
                          mt-6
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <Link
                          to={`/ai-tools/${tool.id}`}
                          className="
                            flex-1
                            rounded-xl
                            bg-white
                            px-5
                            py-3.5
                            text-center
                            text-sm
                            font-black
                            text-black
                            transition
                            hover:bg-gray-200
                          "
                        >
                          Open Tool →
                        </Link>

                        <Link
                          to={`/ai-tools/${tool.id}`}
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
                            transition
                            hover:border-cyan-400/25
                            hover:text-cyan-300
                          "
                        >
                          ↗
                        </Link>
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
          QUIZ MODAL
      =================================================== */}

      {showQuiz && !quizResult && (
        <ToolFinderQuiz
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
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setQuizResult(null);
              setShowQuiz(false);
            }
          }}
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
              shadow-[0_0_70px_rgba(34,197,94,.10)]
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

              <Link
                to={`/ai-tools/${quizResult.id}`}
                className="
                  rounded-xl
                  bg-white
                  py-3
                  font-black
                  text-black
                "
              >
                Open →
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================
          COMPARE MODAL
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
            onClick={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowCompare(false);
              }
            }}
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
                shadow-[0_0_70px_rgba(168,85,247,.10)]
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
                      key={tool.id}
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
                            {tool.pricing ===
                            "free"
                              ? "Free"
                              : "Paid"}
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
                            {tool.badge ===
                            "popular"
                              ? "🔥 Popular"
                              : tool.badge ===
                                "new"
                              ? "🆕 New"
                              : "Standard"}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/ai-tools/${tool.id}`}
                        className="
                          mt-6
                          block
                          rounded-xl
                          bg-white
                          py-3
                          text-center
                          font-black
                          text-black
                        "
                      >
                        Open Tool →
                      </Link>

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

export default AITools;