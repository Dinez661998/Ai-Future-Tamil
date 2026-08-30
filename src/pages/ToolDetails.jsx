import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getFavoriteTools,
  toggleFavoriteTool,
  trackToolVisit,
  markToolExplored,
} from "../utils/dashboardStorage";

const tools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    category: "AI Chat",
    description:
      "AI assistant for writing, coding, learning and productivity.",
    website: "https://chatgpt.com/",
  },

  {
    id: "gemini",
    name: "Gemini",
    icon: "💎",
    category: "AI Chat",
    description:
      "Google AI assistant for research, writing and everyday tasks.",
    website: "https://gemini.google.com/",
  },

  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
    category: "AI Chat",
    description:
      "Powerful AI assistant for writing, analysis and coding.",
    website: "https://claude.ai/",
  },

  {
    id: "midjourney",
    name: "Midjourney",
    icon: "🎨",
    category: "AI Image",
    description:
      "Create stunning AI-generated images from text prompts.",
    website: "https://www.midjourney.com/",
  },

  {
    id: "runway",
    name: "Runway",
    icon: "🎬",
    category: "AI Video",
    description:
      "Create and edit videos using powerful AI tools.",
    website: "https://runwayml.com/",
  },

  {
    id: "suno",
    name: "Suno AI",
    icon: "🎵",
    category: "AI Music",
    description:
      "Generate songs and music using artificial intelligence.",
    website: "https://suno.com/",
  },
];

function ToolDetails() {
  const { id } = useParams();

  const tool = tools.find(
    (item) => item.id === id
  );

  /* =========================================
     FAVORITE
  ========================================= */

  const [favorite, setFavorite] =
    useState(false);

  /* =========================================
     GEMINI CHAT
  ========================================= */

  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================
     LOAD FAVORITE
  ========================================= */

  useEffect(() => {
    if (!tool) return;

    try {
      const favorites =
        getFavoriteTools();

      setFavorite(
        Array.isArray(favorites) &&
          favorites.some(
            (item) =>
              String(item) ===
              String(tool.id)
          )
      );
    } catch (error) {
      console.error(
        "Favorite load error:",
        error
      );

      setFavorite(false);
    }
  }, [tool]);

  /* =========================================
     TRACK TOOL VISIT
  ========================================= */

  useEffect(() => {
    if (!tool) return;

    try {
      trackToolVisit(tool);

      markToolExplored(
        tool.id
      );
    } catch (error) {
      console.error(
        "Tool visit error:",
        error
      );
    }
  }, [tool]);

  /* =========================================
     FAVORITE BUTTON
  ========================================= */

  const handleFavorite = () => {
    if (!tool) return;

    try {
      const newStatus =
        toggleFavoriteTool(tool);

      setFavorite(
        Boolean(newStatus)
      );
    } catch (error) {
      console.error(
        "Favorite button error:",
        error
      );
    }
  };

  /* =========================================
     GEMINI SEND MESSAGE
  ========================================= */

  const handleSendMessage =
    async () => {
      const cleanMessage =
        message.trim();

      if (!cleanMessage) {
        setError(
          "Please type a message first."
        );

        return;
      }

      try {
        setLoading(true);

        setError("");

        setReply("");

        const response =
          await fetch(
            "/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                message:
                  cleanMessage,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "AI request failed."
          );
        }

        setReply(
          data?.reply ||
            "No response received."
        );
      } catch (error) {
        console.error(
          "Gemini Chat Error:",
          error
        );

        setError(
          error?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================
     ENTER TO SEND
  ========================================= */

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!loading) {
        handleSendMessage();
      }
    }
  };

  /* =========================================
     CLEAR CHAT
  ========================================= */

  const handleClearChat =
    () => {
      setMessage("");

      setReply("");

      setError("");
    };

  /* =========================================
     EXAMPLE PROMPTS
  ========================================= */

  const examplePrompts = [
    "Explain Artificial Intelligence in simple Tamil.",

    "Give me 5 YouTube video ideas about AI.",

    "Create a professional email for requesting leave.",

    "Explain JavaScript functions with a simple example.",
  ];

  /* =========================================
     TOOL NOT FOUND
  ========================================= */

  if (!tool) {
    return (
      <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-6">
            😕
          </div>

          <h1 className="text-4xl font-bold mb-6">
            Tool Not Found
          </h1>

          <Link
            to="/ai-tools"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >
            ← Back to AI Tools
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent text-white px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* =====================================
            MAIN TOOL CARD
        ===================================== */}

        <div className="bg-[#111218]/95 border border-white/10 rounded-[30px] p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,.35)]">

          {/* TOP */}

          <div className="flex items-start justify-between gap-5">

            <div
              className="
                flex
                h-[90px]
                w-[90px]
                items-center
                justify-center
                rounded-[24px]
                border
                border-blue-400/20
                bg-blue-500/[0.06]
                text-6xl
              "
            >
              {tool.icon}
            </div>

            {/* HEART */}

            <button
              type="button"
              onClick={
                handleFavorite
              }
              aria-label="Favorite tool"
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                border
                border-gray-700
                bg-black
                text-3xl
                transition-colors
                hover:border-pink-500
              "
            >
              {favorite
                ? "❤️"
                : "♡"}
            </button>
          </div>

          {/* CATEGORY */}

          <p className="text-blue-400 mt-8 mb-3 font-medium">
            {tool.category}
          </p>

          {/* TITLE */}

          <h1 className="text-4xl sm:text-5xl font-black mb-6">
            {tool.name}
          </h1>

          {/* DESCRIPTION */}

          <p className="text-gray-400 text-lg sm:text-xl leading-8">
            {tool.description}
          </p>

          {/* =====================================
              GEMINI CHAT
          ===================================== */}

          {tool.id ===
            "gemini" && (
            <div className="mt-10">

              {/* DIVIDER */}

              <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-400/30 to-transparent mb-8" />

              {/* CHAT HEADER */}

              <div className="mb-6">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/[0.08] text-xl">
                    ✨
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      Ask Gemini
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Powered by Gemini AI
                    </p>
                  </div>

                </div>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  Ask questions,
                  create content,
                  learn concepts,
                  write code and
                  explore ideas directly
                  inside AI Future Tamil.
                </p>
              </div>

              {/* =================================
                  EXAMPLE PROMPTS
              ================================= */}

              <div className="mb-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                  Try an example
                </p>

                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map(
                    (
                      prompt,
                      index
                    ) => (
                      <button
                        key={
                          index
                        }
                        type="button"
                        onClick={() => {
                          setMessage(
                            prompt
                          );

                          setReply(
                            ""
                          );

                          setError(
                            ""
                          );
                        }}
                        className="
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.035]
                          px-4
                          py-2
                          text-left
                          text-xs
                          text-gray-300
                          transition-colors
                          hover:border-blue-400/30
                          hover:bg-blue-500/[0.07]
                          hover:text-white
                        "
                      >
                        {prompt}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* =================================
                  INPUT
              ================================= */}

              <div
                className="
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-blue-400/20
                  bg-[#080b12]
                "
              >
                <textarea
                  value={
                    message
                  }
                  onChange={(
                    event
                  ) =>
                    setMessage(
                      event
                        .target
                        .value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Ask Gemini anything..."
                  rows={6}
                  maxLength={
                    6000
                  }
                  className="
                    min-h-[150px]
                    w-full
                    resize-none
                    bg-transparent
                    px-5
                    py-5
                    text-base
                    leading-7
                    text-white
                    outline-none
                    placeholder:text-gray-600
                  "
                />

                {/* INPUT BOTTOM */}

                <div className="flex flex-col gap-3 border-t border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="text-xs text-gray-600">
                    {
                      message.length
                    }
                    /6000
                    {" • "}
                    Enter to send
                    {" • "}
                    Shift + Enter
                    for new line
                  </div>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={
                        handleClearChat
                      }
                      disabled={
                        loading
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-gray-300
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleSendMessage
                      }
                      disabled={
                        loading ||
                        !message.trim()
                      }
                      className="
                        min-w-[135px]
                        rounded-xl
                        bg-gradient-to-r
                        from-cyan-400
                        to-blue-500
                        px-5
                        py-3
                        text-sm
                        font-black
                        text-[#020711]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      {loading
                        ? "Thinking..."
                        : "✨ Ask Gemini"}
                    </button>

                  </div>
                </div>
              </div>

              {/* =================================
                  ERROR
              ================================= */}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-500/25 bg-red-500/[0.07] p-4 text-sm leading-6 text-red-300">
                  ⚠️{" "}
                  {error}
                </div>
              )}

              {/* =================================
                  LOADING
              ================================= */}

              {loading && (
                <div className="mt-6 rounded-[24px] border border-blue-400/15 bg-blue-500/[0.04] p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      💎
                    </span>

                    <div>
                      <p className="font-bold text-white">
                        Gemini is
                        thinking...
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Creating your
                        response.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================
                  AI RESPONSE
              ================================= */}

              {reply &&
                !loading && (
                  <div className="mt-6 overflow-hidden rounded-[24px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.06] via-blue-500/[0.04] to-purple-500/[0.05]">

                    {/* RESPONSE HEADER */}

                    <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">

                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          💎
                        </span>

                        <div>
                          <p className="font-black text-white">
                            Gemini
                            Response
                          </p>

                          <p className="text-xs text-gray-500">
                            AI generated
                            answer
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          navigator
                            .clipboard
                            .writeText(
                              reply
                            );
                        }}
                        className="
                          rounded-lg
                          border
                          border-white/10
                          bg-black/20
                          px-3
                          py-2
                          text-xs
                          font-bold
                          text-gray-300
                        "
                      >
                        📋 Copy
                      </button>
                    </div>

                    {/* RESPONSE TEXT */}

                    <div className="p-5 sm:p-6">
                      <div
                        className="
                          whitespace-pre-wrap
                          break-words
                          text-[15px]
                          leading-8
                          text-gray-200
                        "
                      >
                        {reply}
                      </div>
                    </div>

                  </div>
                )}

              {/* SMALL NOTE */}

              <p className="mt-4 text-xs leading-5 text-gray-600">
                AI responses can
                contain mistakes.
                Verify important
                information before
                using it.
              </p>
            </div>
          )}

          {/* =====================================
              WEBSITE BUTTON
          ===================================== */}

          <div
            className={
              tool.id ===
              "gemini"
                ? "mt-10 border-t border-white/[0.07] pt-7"
                : "mt-8"
            }
          >
            <a
              href={
                tool.website
              }
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-white
                px-7
                py-4
                font-bold
                text-black
                transition-colors
                hover:bg-gray-200
              "
            >
              Visit Official
              Website →
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}

export default ToolDetails;