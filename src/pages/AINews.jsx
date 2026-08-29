import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getNewsRead,
  trackNewsRead,
  addRecentActivity,
} from "../utils/dashboardStorage";

/* =========================================================
   NEWS DATA
========================================================= */

const news = [
  {
    id: 1,
    category: "AI Trends",
    title: "AI is changing the future",
    description:
      "Artificial Intelligence is becoming more powerful and useful in everyday life.",
    icon: "🚀",
    date: "Today",
  },
  {
    id: 2,
    category: "AI Agents",
    title: "AI Agents are growing fast",
    description:
      "AI agents can help users with research, coding, automation and productivity.",
    icon: "🤖",
    date: "Today",
  },
  {
    id: 3,
    category: "AI Images",
    title: "AI Image Generation is evolving",
    description:
      "New AI image tools are making it easier to create high-quality visuals and designs.",
    icon: "🎨",
    date: "Latest",
  },
  {
    id: 4,
    category: "AI Videos",
    title: "AI Video Creation is becoming easier",
    description:
      "AI video tools are helping creators generate videos, animations and creative content.",
    icon: "🎬",
    date: "Latest",
  },
  {
    id: 5,
    category: "AI Coding",
    title: "AI Coding Tools are improving",
    description:
      "Developers can use AI coding assistants to write, explain and debug code faster.",
    icon: "💻",
    date: "Trending",
  },
  {
    id: 6,
    category: "Future AI",
    title: "AI is becoming part of daily life",
    description:
      "From education to business, AI is becoming an important part of everyday workflows.",
    icon: "🧠",
    date: "Trending",
  },
];

/* =========================================================
   MAIN
========================================================= */

function AINews() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [readNews, setReadNews] = useState([]);

  const categories = [
    "All",
    "AI Trends",
    "AI Agents",
    "AI Images",
    "AI Videos",
    "AI Coding",
    "Future AI",
  ];

  /* =========================================================
     LOAD READ NEWS
  ========================================================= */

  const loadReadNews = () => {
    const saved = getNewsRead();

    setReadNews(
      Array.isArray(saved)
        ? saved.map(String)
        : []
    );
  };

  useEffect(() => {
    loadReadNews();

    const handleUpdate = () => {
      loadReadNews();
    };

    window.addEventListener(
      "dashboard-data-updated",
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
        "storage",
        handleUpdate
      );
    };
  }, []);

  /* =========================================================
     FILTER NEWS
  ========================================================= */

  const filteredNews = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return news.filter((item) => {
      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query) ||
        item.category
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
  }, [search, category]);

  /* =========================================================
     READ CHECK
  ========================================================= */

  const isRead = (id) =>
    readNews.includes(String(id));

  /* =========================================================
     TRACK ARTICLE
  ========================================================= */

  const handleReadArticle = (item) => {
    const alreadyRead =
      isRead(item.id);

    trackNewsRead(item.id);

    /*
      Recent activity duplicate avoid panna
      first time read pannumbodhu mattum activity add pannrom.
    */

    if (!alreadyRead) {
      addRecentActivity({
        icon: item.icon,
        title: item.title,
        description: `Read ${item.category} news`,
        link: `/ai-news/${item.id}`,
      });
    }

    loadReadNews();
  };

  /* =========================================================
     STATS
  ========================================================= */

  const totalRead =
    readNews.filter((id) =>
      news.some(
        (item) =>
          String(item.id) ===
          String(id)
      )
    ).length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-transparent px-4 py-12 text-white sm:px-6 sm:py-16 lg:py-20">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-6xl text-center">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300">
          📰 Latest AI Updates
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          AI News
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            & Trends
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
          Stay updated with the latest
          AI news, tools, trends and
          innovations shaping the future.
        </p>

      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.05] p-5 text-center">
          <p className="text-sm text-gray-500">
            Total Articles
          </p>

          <p className="mt-2 text-3xl font-black text-blue-300">
            {news.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-400/15 bg-green-400/[0.05] p-5 text-center">
          <p className="text-sm text-gray-500">
            Articles Read
          </p>

          <p className="mt-2 text-3xl font-black text-green-300">
            {totalRead}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-400/15 bg-purple-400/[0.05] p-5 text-center">
          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <p className="mt-2 text-3xl font-black text-purple-300">
            {Math.max(
              news.length -
                totalRead,
              0
            )}
          </p>
        </div>

      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="mx-auto mt-10 max-w-4xl">

        <div className="relative">

          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search AI news..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-white/10
              bg-black/30
              py-4
              pl-12
              pr-5
              text-white
              outline-none
              backdrop-blur-xl
              transition-all
              duration-300
              placeholder:text-gray-600
              focus:border-blue-400/50
              focus:shadow-[0_0_30px_rgba(59,130,246,.10)]
            "
          />

        </div>

      </section>

      {/* =====================================================
          CATEGORY FILTER
      ===================================================== */}

      <section className="mx-auto mt-7 flex max-w-6xl flex-wrap justify-center gap-3">

        {categories.map((item) => {
          const active =
            category === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() =>
                setCategory(item)
              }
              className={`
                rounded-full
                border
                px-5
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-300
                ${
                  active
                    ? "border-blue-400/60 bg-blue-400/15 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,.12)]"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-blue-400/30 hover:bg-blue-400/[0.06] hover:text-blue-300"
                }
              `}
            >
              {item}
            </button>
          );
        })}

      </section>

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <section className="mx-auto mt-10 max-w-6xl">

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredNews.length}
              </span>{" "}
              articles
            </p>
          </div>

          <Link
            to="/dashboard"
            className="text-sm font-semibold text-purple-300 transition hover:text-purple-200"
          >
            📚 View My Library →
          </Link>

        </div>

      </section>

      {/* =====================================================
          NEWS CARDS
      ===================================================== */}

      <section className="mx-auto mt-6 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filteredNews.map((item) => {
          const articleRead =
            isRead(item.id);

          return (
            <article
              key={item.id}
              className={`
                group
                relative
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-3xl
                border
                p-6
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-2
                ${
                  articleRead
                    ? "border-green-400/20 bg-[linear-gradient(145deg,rgba(20,35,28,.65),rgba(7,9,22,.85))] hover:border-green-400/40 hover:shadow-[0_0_40px_rgba(34,197,94,.08)]"
                    : "border-white/[0.08] bg-[linear-gradient(145deg,rgba(14,17,38,.82),rgba(6,8,22,.80))] hover:border-blue-400/40 hover:shadow-[0_0_45px_rgba(59,130,246,.09)]"
                }
              `}
            >

              {/* TOP GLOW */}

              <div
                className={`
                  pointer-events-none
                  absolute
                  inset-x-10
                  top-0
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  to-transparent
                  ${
                    articleRead
                      ? "via-green-400"
                      : "via-blue-400"
                  }
                `}
              />

              {/* ICON + STATUS */}

              <div className="flex items-start justify-between">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-4xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {item.icon}
                </div>

                {articleRead ? (
                  <div className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-bold text-green-300">
                    ✓ READ
                  </div>
                ) : (
                  <div className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-300">
                    NEW
                  </div>
                )}

              </div>

              {/* CATEGORY */}

              <div className="mt-6 flex items-center justify-between gap-3">

                <span className="text-sm font-semibold text-blue-400">
                  {item.category}
                </span>

                <span className="text-xs text-gray-600">
                  {item.date}
                </span>

              </div>

              {/* TITLE */}

              <h2 className="mt-4 text-2xl font-bold leading-tight transition-colors group-hover:text-blue-200">
                {item.title}
              </h2>

              {/* DESCRIPTION */}

              <p className="mt-4 flex-1 text-sm leading-7 text-gray-500">
                {item.description}
              </p>

              {/* DIVIDER */}

              <div className="my-6 h-px bg-white/[0.06]" />

              {/* ACTION */}

              <Link
                to={`/ai-news/${item.id}`}
                onClick={() =>
                  handleReadArticle(
                    item
                  )
                }
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-sm
                  font-bold
                  transition-all
                  duration-300
                  ${
                    articleRead
                      ? "border-green-400/20 bg-green-400/[0.06] text-green-300 hover:bg-green-400/10"
                      : "border-blue-400/20 bg-blue-400/[0.07] text-blue-300 hover:border-blue-400/40 hover:bg-blue-400/12"
                  }
                `}
              >
                <span>
                  {articleRead
                    ? "Read Again"
                    : "Read Article"}
                </span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </article>
          );
        })}

      </section>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredNews.length === 0 && (
        <section className="mx-auto mt-14 max-w-3xl">

          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-14 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="mt-5 text-xl font-bold">
              No AI news found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search term or
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-6 rounded-xl border border-blue-400/20 bg-blue-400/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-400/15"
            >
              Reset Filters
            </button>

          </div>

        </section>
      )}

    </main>
  );
}

export default AINews;