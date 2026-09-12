import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  supabase,
} from "../supabase/client";

export default function NewsDetails() {
  const {
    id,
  } = useParams();

  const [news, setNews] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchNews();
  }, [id]);

  async function fetchNews() {
    setLoading(true);
    setError("");

    const {
      data,
      error: fetchError,
    } = await supabase
      .from("ai_news")
      .select("*")
      .eq("slug", id)
      .maybeSingle();

    if (fetchError) {
      console.error(
        fetchError
      );

      setError(
        "News load aagala."
      );
    }

    setNews(data || null);
    setLoading(false);
  }

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
        Loading News...
      </main>
    );
  }

  if (
    error ||
    !news
  ) {
    return (
      <main
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          px-5
          text-white
        "
      >

        <div className="text-center">

          <div className="text-6xl">
            📰
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-black
            "
          >
            News Not Found
          </h1>

          <Link
            to="/ai-news"
            className="
              mt-6
              inline-block
              rounded-xl
              bg-white
              px-6
              py-3
              font-black
              text-black
            "
          >
            ← Back to AI News
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        px-5
        py-10
        text-white
        sm:px-7
        lg:px-10
      "
    >

      <article
        className="
          mx-auto
          max-w-5xl
        "
      >

        <Link
          to="/ai-news"
          className="
            text-sm
            font-bold
            text-cyan-400
          "
        >
          ← Back to AI News
        </Link>

        <div
          className="
            mt-6
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.08]
            bg-black/30
          "
        >

          {news.image_url && (
            <img
              src={
                news.image_url
              }
              alt={
                news.title
              }
              className="
                max-h-[520px]
                w-full
                object-cover
              "
            />
          )}

          <div
            className="
              p-7
              sm:p-10
            "
          >

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
                  bg-cyan-400/[0.07]
                  px-3
                  py-1
                  text-sm
                  font-bold
                  text-cyan-300
                "
              >
                {news.category}
              </span>

              {news.trending && (
                <span
                  className="
                    rounded-full
                    bg-orange-400/[0.07]
                    px-3
                    py-1
                    text-sm
                    font-bold
                    text-orange-300
                  "
                >
                  🔥 Trending
                </span>
              )}

              {news.featured && (
                <span
                  className="
                    rounded-full
                    bg-yellow-400/[0.07]
                    px-3
                    py-1
                    text-sm
                    font-bold
                    text-yellow-300
                  "
                >
                  ⭐ Featured
                </span>
              )}

            </div>

            <h1
              className="
                mt-6
                text-4xl
                font-black
                leading-tight
                sm:text-5xl
              "
            >
              {news.title}
            </h1>

            {news.summary && (
              <p
                className="
                  mt-6
                  text-xl
                  leading-8
                  text-gray-400
                "
              >
                {news.summary}
              </p>
            )}

            <div
              className="
                mt-8
                whitespace-pre-line
                text-base
                leading-8
                text-gray-300
              "
            >
              {news.content}
            </div>

            {news.source_url && (
              <a
                href={
                  news.source_url
                }
                target="_blank"
                rel="noreferrer"
                className="
                  mt-10
                  inline-block
                  rounded-xl
                  bg-white
                  px-6
                  py-3
                  font-black
                  text-black
                "
              >
                View Original Source ↗
              </a>
            )}

          </div>

        </div>

      </article>

    </main>
  );
}