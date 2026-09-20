import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AIChat from "./AIChat";

import {
  getFavoriteTools,
  toggleFavoriteTool,
  trackToolVisit,
  markToolExplored,
} from "../utils/dashboardStorage";

/* =========================================================
   AI TOOLS DATA
========================================================= */

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
    id: "ai-writer",
    name: "AI Writer",
    icon: "✍️",
    category: "AI Writing",
    description:
      "Create blogs, YouTube scripts, emails, captions, stories and professional content using AI.",
    website: null,
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

/* =========================================================
   AI WRITER QUICK EXAMPLES
========================================================= */

const writerExamples = [
  {
    icon: "🎥",
    title: "YouTube Script",
    prompt:
      "Create a YouTube video script explaining Artificial Intelligence for beginners.",
    type: "YouTube Script",
  },
  {
    icon: "📧",
    title: "Professional Email",
    prompt:
      "Write a professional leave request email to my manager.",
    type: "Email",
  },
  {
    icon: "📱",
    title: "Social Caption",
    prompt:
      "Create an attractive Instagram caption about learning AI.",
    type: "Social Media Caption",
  },
  {
    icon: "📝",
    title: "Blog Article",
    prompt:
      "Write an article about how AI can improve productivity.",
    type: "Blog / Article",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ToolDetails() {
  const { id } = useParams();

  const tool = tools.find(
    (item) => item.id === id
  );

    // =========================================================
  // GEMINI -> OPEN FULL AI CHAT PAGE
  // =========================================================
  if (id === "gemini") {
    return <Navigate to="/ai-chat" replace />;
  }

  /* =========================================================
     FAVORITE
  ========================================================= */

  const [favorite, setFavorite] =
    useState(false);

  /* =========================================================
     AI WRITER STATES
  ========================================================= */

  const [writerTopic, setWriterTopic] =
    useState("");

  const [contentType, setContentType] =
    useState("Blog / Article");

  const [
    writerLanguage,
    setWriterLanguage,
  ] = useState("English");

  const [writerTone, setWriterTone] =
    useState("Professional");

  const [
    writerLength,
    setWriterLength,
  ] = useState("Medium");

  const [writerResult, setWriterResult] =
    useState("");

  const [
    writerLoading,
    setWriterLoading,
  ] = useState(false);

  const [writerError, setWriterError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  /* =========================================================
     LOAD FAVORITE
  ========================================================= */

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

  /* =========================================================
     TRACK TOOL VISIT
  ========================================================= */

  useEffect(() => {
    if (!tool) return;

    try {
      trackToolVisit(tool);
      markToolExplored(tool.id);
    } catch (error) {
      console.error(
        "Tool visit error:",
        error
      );
    }
  }, [tool]);

  /* =========================================================
     FAVORITE BUTTON
  ========================================================= */

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

  /* =========================================================
     AI WRITER GENERATE
  ========================================================= */

  const handleGenerateWriter =
    async () => {
      const cleanTopic =
        writerTopic.trim();

      if (!cleanTopic) {
        setWriterError(
          "Please tell AI Writer what you want to write."
        );

        return;
      }

      const writerPrompt = `
You are the professional AI Writer inside a website called "AI Future Tamil".

Create high-quality original content based on the user's requirements.

USER REQUEST:
${cleanTopic}

CONTENT TYPE:
${contentType}

LANGUAGE:
${writerLanguage}

TONE:
${writerTone}

LENGTH:
${writerLength}

IMPORTANT INSTRUCTIONS:

1. Follow the requested content type exactly.
2. Write in the selected language.
3. Follow the selected tone.
4. Make the result clean, useful and ready to use.
5. Do not explain how you generated it.
6. Do not start with phrases like "Sure" or "Here is your content".
7. Directly provide the finished content.
8. Use headings and sections when they improve readability.
9. Avoid unnecessary repetition.
10. Keep the content natural and human-friendly.

LENGTH GUIDE:

Short:
Create a concise result.

Medium:
Create a useful moderately detailed result.

Long:
Create a detailed and comprehensive result.

Now generate the final content.
      `.trim();

      try {
        setWriterLoading(true);
        setWriterError("");
        setWriterResult("");
        setCopied(false);

        const response =
          await fetch("/api/chat", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message: writerPrompt,
            }),
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "AI Writer request failed."
          );
        }

        setWriterResult(
          data?.reply ||
            "No content received."
        );
      } catch (error) {
        console.error(
          "AI Writer Error:",
          error
        );

        setWriterError(
          error?.message ||
            "Something went wrong. Please try again."
        );
      } finally {
        setWriterLoading(false);
      }
    };

  /* =========================================================
     AI WRITER CLEAR
  ========================================================= */

  const handleClearWriter = () => {
    setWriterTopic("");
    setContentType("Blog / Article");
    setWriterLanguage("English");
    setWriterTone("Professional");
    setWriterLength("Medium");
    setWriterResult("");
    setWriterError("");
    setCopied(false);
  };

  /* =========================================================
     AI WRITER COPY
  ========================================================= */

  const handleCopyWriter =
    async () => {
      if (!writerResult) return;

      try {
        await navigator.clipboard.writeText(
          writerResult
        );

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error(
          "Copy error:",
          error
        );
      }
    };

  /* =========================================================
     TOOL NOT FOUND
  ========================================================= */

  if (!tool) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-transparent px-6 text-white">
        <div className="text-center">
          <div className="mb-6 text-6xl">
            😕
          </div>

          <h1 className="mb-6 text-4xl font-bold">
            Tool Not Found
          </h1>

          <Link
            to="/ai-tools"
            className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black"
          >
            ← Back to AI Tools
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 text-white sm:px-6">

      <div
        className={
          tool.id === "gemini"
            ? "mx-auto max-w-[1500px]"
            : "mx-auto max-w-5xl"
        }
      >

        {/* =====================================================
            TOOL INFORMATION
        ===================================================== */}

        <div
          className="
            rounded-[30px]
            border
            border-white/10
            bg-[#111218]/95
            p-6
            shadow-[0_25px_80px_rgba(0,0,0,.35)]
            sm:p-8
            md:p-10
          "
        >

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

            <button
              type="button"
              onClick={handleFavorite}
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
                transition
                hover:scale-105
                hover:border-pink-500
              "
            >
              {favorite ? "❤️" : "♡"}
            </button>

          </div>

          {/* CATEGORY */}

          <p className="mb-3 mt-8 font-medium text-blue-400">
            {tool.category}
          </p>

          {/* TITLE */}

          <h1 className="mb-6 text-4xl font-black sm:text-5xl">
            {tool.name}
          </h1>

          {/* DESCRIPTION */}

          <p className="text-lg leading-8 text-gray-400 sm:text-xl">
            {tool.description}
          </p>

          {/* =====================================================
              GEMINI = FULL EXISTING AI CHAT
          ===================================================== */}

          {tool.id === "gemini" && (
            <div className="mt-10">

              <div
                className="
                  mb-8
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-400/40
                  to-transparent
                "
              />

              <div className="mb-6">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-cyan-400/20
                      bg-cyan-500/[0.08]
                      text-2xl
                    "
                  >
                    ✨
                  </div>

                  <div>
                    <h2 className="text-2xl font-black sm:text-3xl">
                      AI Future Tamil Chat
                    </h2>

                    <p className="mt-1 text-sm text-cyan-300">
                      Powered by Gemini AI
                    </p>
                  </div>

                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400">
                  Chat with Gemini directly inside
                  AI Future Tamil. Model selection,
                  language modes, chat history,
                  regenerate, copy and your existing
                  AI Chat features are available here.
                </p>

              </div>

              {/* IMPORTANT:
                  This is your SAME existing AIChat.jsx.
                  No second Gemini API/chat code is created.
              */}

              <div
                className="
                  relative
                  w-full
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/[0.09]
                  bg-[#07090f]
                  shadow-[0_25px_80px_rgba(0,0,0,.35)]
                "
              >
                <AIChat />
              </div>

            </div>
          )}

          {/* =====================================================
              AI WRITER
          ===================================================== */}

          {tool.id === "ai-writer" && (
            <div className="mt-10">

              <div
                className="
                  mb-8
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-purple-400/40
                  to-transparent
                "
              />

              {/* HEADER */}

              <div className="mb-8">

                <div className="flex items-center gap-4">

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-purple-400/20
                      bg-purple-500/[0.08]
                      text-2xl
                    "
                  >
                    ✨
                  </div>

                  <div>

                    <h2 className="text-2xl font-black sm:text-3xl">
                      AI Content Generator
                    </h2>

                    <p className="mt-1 text-sm text-purple-300">
                      Powered by AI Future Tamil
                    </p>

                  </div>

                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400">
                  Tell AI Writer what you need,
                  choose your content style and
                  generate ready-to-use content
                  in seconds.
                </p>

              </div>

              {/* QUICK START */}

              <div className="mb-7">

                <p
                  className="
                    mb-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-gray-500
                  "
                >
                  Quick Start
                </p>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-4
                  "
                >
                  {writerExamples.map(
                    (example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setWriterTopic(
                            example.prompt
                          );

                          setContentType(
                            example.type
                          );

                          setWriterResult("");
                          setWriterError("");
                          setCopied(false);
                        }}
                        className="
                          rounded-2xl
                          border
                          border-white/[0.08]
                          bg-white/[0.025]
                          p-4
                          text-left
                          transition
                          hover:border-purple-400/30
                          hover:bg-purple-500/[0.06]
                        "
                      >
                        <div className="text-2xl">
                          {example.icon}
                        </div>

                        <p className="mt-3 text-sm font-bold text-gray-200">
                          {example.title}
                        </p>
                      </button>
                    )
                  )}
                </div>

              </div>

              {/* WRITER PANEL */}

              <div
                className="
                  rounded-[28px]
                  border
                  border-purple-400/20
                  bg-[#080a12]
                  p-5
                  sm:p-6
                "
              >

                {/* TOPIC */}

                <div>

                  <div className="mb-3 flex items-center justify-between gap-3">

                    <label className="text-sm font-bold text-gray-200">
                      ✍️ What do you want to write?
                    </label>

                    <span className="text-xs text-gray-600">
                      {writerTopic.length}/3000
                    </span>

                  </div>

                  <textarea
                    value={writerTopic}
                    onChange={(event) =>
                      setWriterTopic(
                        event.target.value
                      )
                    }
                    maxLength={3000}
                    rows={5}
                    placeholder="Example: Create a YouTube script about Artificial Intelligence for beginners..."
                    className="
                      min-h-[140px]
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-white/[0.09]
                      bg-black/30
                      px-5
                      py-4
                      text-base
                      leading-7
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-600
                      focus:border-purple-400/40
                    "
                  />

                </div>

                {/* OPTIONS */}

                <div
                  className="
                    mt-6
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                  "
                >

                  {/* CONTENT TYPE */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      📄 Content Type
                    </label>

                    <select
                      value={contentType}
                      onChange={(event) =>
                        setContentType(
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/[0.09]
                        bg-[#11131c]
                        px-4
                        py-3.5
                        text-sm
                        text-white
                        outline-none
                        focus:border-purple-400/40
                      "
                    >
                      <option>
                        Blog / Article
                      </option>

                      <option>
                        YouTube Script
                      </option>

                      <option>Email</option>

                      <option>
                        Social Media Caption
                      </option>

                      <option>
                        Product Description
                      </option>

                      <option>Story</option>

                      <option>
                        Advertisement Copy
                      </option>

                      <option>
                        Resume Summary
                      </option>
                    </select>

                  </div>

                  {/* LANGUAGE */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      🌐 Language
                    </label>

                    <select
                      value={writerLanguage}
                      onChange={(event) =>
                        setWriterLanguage(
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/[0.09]
                        bg-[#11131c]
                        px-4
                        py-3.5
                        text-sm
                        text-white
                        outline-none
                        focus:border-cyan-400/40
                      "
                    >
                      <option>English</option>
                      <option>Tamil</option>
                      <option>Tanglish</option>
                    </select>

                  </div>

                  {/* TONE */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      🎭 Tone
                    </label>

                    <select
                      value={writerTone}
                      onChange={(event) =>
                        setWriterTone(
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/[0.09]
                        bg-[#11131c]
                        px-4
                        py-3.5
                        text-sm
                        text-white
                        outline-none
                        focus:border-pink-400/40
                      "
                    >
                      <option>
                        Professional
                      </option>

                      <option>
                        Friendly
                      </option>

                      <option>
                        Creative
                      </option>

                      <option>
                        Simple
                      </option>

                      <option>
                        Persuasive
                      </option>

                      <option>
                        Educational
                      </option>

                      <option>
                        Funny
                      </option>
                    </select>

                  </div>

                  {/* LENGTH */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      📏 Length
                    </label>

                    <select
                      value={writerLength}
                      onChange={(event) =>
                        setWriterLength(
                          event.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/[0.09]
                        bg-[#11131c]
                        px-4
                        py-3.5
                        text-sm
                        text-white
                        outline-none
                        focus:border-green-400/40
                      "
                    >
                      <option>Short</option>
                      <option>Medium</option>
                      <option>Long</option>
                    </select>

                  </div>

                </div>

                {/* BUTTONS */}

                <div
                  className="
                    mt-6
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <p className="text-xs leading-5 text-gray-600">
                    Choose your settings and
                    generate your content.
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <button
                      type="button"
                      onClick={
                        handleClearWriter
                      }
                      disabled={
                        writerLoading
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-5
                        py-3.5
                        text-sm
                        font-bold
                        text-gray-300
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      🗑️ Clear
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleGenerateWriter
                      }
                      disabled={
                        writerLoading ||
                        !writerTopic.trim()
                      }
                      className="
                        min-w-[190px]
                        rounded-xl
                        bg-gradient-to-r
                        from-purple-500
                        via-pink-500
                        to-cyan-400
                        px-6
                        py-3.5
                        text-sm
                        font-black
                        text-white
                        shadow-[0_0_30px_rgba(168,85,247,.15)]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      {writerLoading
                        ? "✨ Writing..."
                        : "✨ Generate Content"}
                    </button>

                  </div>

                </div>

              </div>

              {/* ERROR */}

              {writerError && (
                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-red-500/25
                    bg-red-500/[0.07]
                    p-4
                    text-sm
                    leading-6
                    text-red-300
                  "
                >
                  ⚠️ {writerError}
                </div>
              )}

              {/* LOADING */}

              {writerLoading && (
                <div
                  className="
                    mt-6
                    rounded-[24px]
                    border
                    border-purple-400/20
                    bg-purple-500/[0.05]
                    p-6
                  "
                >
                  <div className="flex items-center gap-4">

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-purple-500/10
                        text-2xl
                      "
                    >
                      ✍️
                    </div>

                    <div>
                      <p className="font-black text-white">
                        AI Writer is creating...
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Preparing your{" "}
                        {contentType}.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* RESULT */}

              {writerResult &&
                !writerLoading && (
                  <div
                    className="
                      mt-6
                      overflow-hidden
                      rounded-[26px]
                      border
                      border-purple-400/20
                      bg-gradient-to-br
                      from-purple-500/[0.06]
                      via-pink-500/[0.03]
                      to-cyan-500/[0.04]
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        border-b
                        border-white/[0.07]
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div>
                        <p className="font-black text-white">
                          ✨ Generated Content
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {contentType}
                          {" • "}
                          {writerLanguage}
                          {" • "}
                          {writerTone}
                          {" • "}
                          {writerLength}
                        </p>
                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={
                            handleCopyWriter
                          }
                          className="
                            rounded-xl
                            border
                            border-white/10
                            bg-black/20
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            text-gray-200
                            transition
                            hover:border-cyan-400/30
                          "
                        >
                          {copied
                            ? "✓ Copied"
                            : "📋 Copy"}
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleGenerateWriter
                          }
                          disabled={
                            writerLoading
                          }
                          className="
                            rounded-xl
                            border
                            border-purple-400/25
                            bg-purple-500/[0.08]
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            text-purple-200
                            disabled:opacity-40
                          "
                        >
                          🔄 Regenerate
                        </button>

                      </div>

                    </div>

                    <div className="p-5 sm:p-7">

                      <div
                        className="
                          whitespace-pre-wrap
                          break-words
                          text-[17px]
                          leading-8
                          text-gray-200
                        "
                      >
                        {writerResult}
                      </div>

                    </div>

                  </div>
                )}

              <p className="mt-4 text-xs leading-5 text-gray-600">
                ✨ AI generated content may
                need editing before publishing.
                Review important information
                before using it.
              </p>

            </div>
          )}

          {/* =====================================================
              OFFICIAL WEBSITE BUTTON
          ===================================================== */}

          {tool.website && (
            <div
              className={
                tool.id === "gemini"
                  ? "mt-10 border-t border-white/[0.07] pt-7"
                  : "mt-8"
              }
            >
              <a
                href={tool.website}
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
                  transition
                  hover:bg-gray-200
                "
              >
                Visit Official Website →
              </a>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}

export default ToolDetails;