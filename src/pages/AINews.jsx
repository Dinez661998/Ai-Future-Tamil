import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  supabase,
} from "../supabase/client";

export default function AINews() {
  const [news, setNews] =
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

  /* =========================================================
     LOAD NEWS
  ========================================================= */

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    setError("");

    try {
      const {
        data,
        error: fetchError,
      } = await supabase
        .from("ai_news")
        .select("*")
        .order(
          "trending",
          {
            ascending: false,
          }
        )
        .order(
          "featured",
          {
            ascending: false,
          }
        )
        .order(
          "published_at",
          {
            ascending: false,
          }
        );

      if (fetchError) {
        throw fetchError;
      }

      setNews(
        data || []
      );
    } catch (err) {
      console.error(
        "AI News fetch error:",
        err
      );

      setError(
        "AI News load aagala."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories =
    useMemo(() => {
      return [
        "All",

        ...new Set(
          news
            .map(
              (item) =>
                item.category
            )
            .filter(Boolean)
        ),
      ];
    }, [news]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredNews =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();

      return news.filter(
        (item) => {
          const categoryMatch =
            activeCategory ===
              "All" ||
            item.category ===
              activeCategory;

          const searchMatch =
            String(
              item.title || ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              item.summary || ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              item.category || ""
            )
              .toLowerCase()
              .includes(query);

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      news,
      search,
      activeCategory,
    ]);

  const featuredNews =
    news.find(
      (item) =>
        item.featured
    ) || news[0];

  /* =========================================================
     DATE
  ========================================================= */

  function formatDate(value) {
    if (!value) {
      return "";
    }

    return new Date(
      value
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

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
            Loading AI News...
          </p>

        </div>

      </main>
    );
  }

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
          max-w-[1500px]
          px-5
          py-8
          sm:px-7
          lg:px-9
          lg:py-10
        "
      >

        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.08]
            bg-black/25
            p-7
            backdrop-blur-xl
            sm:p-10
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
            "
          >

            <div
              className="
                inline-flex
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
              📰 Latest AI Updates
            </div>

            <h1
              className="
                mt-5
                text-4xl
                font-black
                sm:text-5xl
                lg:text-6xl
              "
            >
              AI News &{" "}

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
                Trends
              </span>

            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-lg
                leading-8
                text-gray-400
              "
            >
              Discover important AI
              launches, tools,
              updates and technology
              changes in one place.
            </p>

            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-3
              "
            >

              <div
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-5
                  py-3
                "
              >
                <strong>
                  {news.length}
                </strong>{" "}
                News
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-orange-400/20
                  bg-orange-400/[0.05]
                  px-5
                  py-3
                "
              >
                🔥{" "}
                {
                  news.filter(
                    (item) =>
                      item.trending
                  ).length
                }{" "}
                Trending
              </div>

            </div>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div
            className="
              mt-6
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
              onClick={
                fetchNews
              }
              className="
                ml-3
                underline
              "
            >
              Retry
            </button>

          </div>
        )}

        {/* FEATURED */}

        {featuredNews && (
          <section
            className="
              mt-7
              overflow-hidden
              rounded-[30px]
              border
              border-purple-400/20
              bg-black/30
            "
          >

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
              "
            >

              <div
                className="
                  min-h-[280px]
                  overflow-hidden
                  bg-white/[0.03]
                "
              >

                {featuredNews.image_url ? (

                  <img
                    src={
                      featuredNews.image_url
                    }
                    alt={
                      featuredNews.title
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      flex
                      h-full
                      min-h-[280px]
                      items-center
                      justify-center
                      text-8xl
                    "
                  >
                    🤖
                  </div>

                )}

              </div>

              <div
                className="
                  flex
                  flex-col
                  justify-center
                  p-7
                  sm:p-10
                "
              >

                <p
                  className="
                    text-sm
                    font-bold
                    text-purple-300
                  "
                >
                  ⭐ Featured News
                </p>

                <h2
                  className="
                    mt-4
                    text-3xl
                    font-black
                    leading-tight
                  "
                >
                  {
                    featuredNews.title
                  }
                </h2>

                <p
                  className="
                    mt-4
                    leading-7
                    text-gray-400
                  "
                >
                  {
                    featuredNews.summary
                  }
                </p>

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    gap-3
                  "
                >

                  <Link
                    to={`/ai-news/${featuredNews.slug}`}
                    className="
                      rounded-xl
                      bg-white
                      px-6
                      py-3
                      font-black
                      text-black
                    "
                  >
                    Read News →
                  </Link>

                  {featuredNews.source_url && (
                    <a
                      href={
                        featuredNews.source_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="
                        rounded-xl
                        border
                        border-white/10
                        px-6
                        py-3
                        font-bold
                        text-gray-300
                      "
                    >
                      Source ↗
                    </a>
                  )}

                </div>

              </div>

            </div>

          </section>
        )}

        {/* SEARCH */}

        <section
          className="
            mt-7
            rounded-[26px]
            border
            border-white/[0.08]
            bg-black/25
            p-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              xl:flex-row
            "
          >

            <input
              type="text"
              value={
                search
              }
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
              placeholder="Search AI news..."
              className="
                flex-1
                rounded-xl
                border
                border-white/10
                bg-[#080a13]
                px-5
                py-4
                outline-none
                focus:border-cyan-400/40
              "
            />

            <div
              className="
                flex
                gap-2
                overflow-x-auto
              "
            >

              {categories.map(
                (category) => (
                  <button
                    key={
                      category
                    }
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
                            border-white/10
                            bg-white/[0.03]
                            text-gray-400
                          `
                      }
                    `}
                  >
                    {category}
                  </button>
                )
              )}

            </div>

          </div>

        </section>

        {/* NEWS TITLE */}

        <section
          className="
            mt-10
            flex
            items-end
            justify-between
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
              ⚡ Latest Updates
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-black
              "
            >
              {activeCategory ===
              "All"
                ? "All AI News"
                : activeCategory}
            </h2>

          </div>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {
              filteredNews.length
            }{" "}
            results
          </p>

        </section>

        {/* GRID */}

        <section className="mt-6">

          {filteredNews.length ===
          0 ? (

            <div
              className="
                rounded-[28px]
                border
                border-dashed
                border-white/10
                bg-black/25
                py-20
                text-center
              "
            >

              <div className="text-6xl">
                📰
              </div>

              <h3
                className="
                  mt-5
                  text-2xl
                  font-black
                "
              >
                No AI News Found
              </h3>

              <p
                className="
                  mt-2
                  text-gray-500
                "
              >
                Admin panel-la first
                news add pannunga.
              </p>

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

              {filteredNews.map(
                (item) => (
                  <article
                    key={
                      item.id
                    }
                    className="
                      group
                      overflow-hidden
                      rounded-[26px]
                      border
                      border-white/[0.08]
                      bg-[#111318]/85
                      transition
                      hover:-translate-y-1
                      hover:border-cyan-400/20
                    "
                  >

                    <div
                      className="
                        aspect-[16/9]
                        overflow-hidden
                        bg-white/[0.03]
                      "
                    >

                      {item.image_url ? (

                        <img
                          src={
                            item.image_url
                          }
                          alt={
                            item.title
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-full
                            items-center
                            justify-center
                            text-6xl
                          "
                        >
                          📰
                        </div>

                      )}

                    </div>

                    <div className="p-6">

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        <span
                          className="
                            rounded-full
                            bg-cyan-400/[0.06]
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-cyan-300
                          "
                        >
                          {
                            item.category
                          }
                        </span>

                        {item.trending && (
                          <span
                            className="
                              rounded-full
                              bg-orange-400/[0.07]
                              px-3
                              py-1
                              text-xs
                              font-bold
                              text-orange-300
                            "
                          >
                            🔥 Trending
                          </span>
                        )}

                      </div>

                      <h3
                        className="
                          mt-4
                          text-xl
                          font-black
                          leading-snug
                        "
                      >
                        {
                          item.title
                        }
                      </h3>

                      <p
                        className="
                          mt-3
                          line-clamp-3
                          text-sm
                          leading-6
                          text-gray-400
                        "
                      >
                        {
                          item.summary
                        }
                      </p>

                      <p
                        className="
                          mt-4
                          text-xs
                          text-gray-600
                        "
                      >
                        {
                          formatDate(
                            item.published_at
                          )
                        }
                      </p>

                      <Link
                        to={`/ai-news/${item.slug}`}
                        className="
                          mt-5
                          block
                          rounded-xl
                          bg-white
                          px-5
                          py-3
                          text-center
                          font-black
                          text-black
                          transition
                          hover:bg-gray-200
                        "
                      >
                        Read More →
                      </Link>

                    </div>

                  </article>
                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}