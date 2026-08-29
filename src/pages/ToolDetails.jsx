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

  const [favorite, setFavorite] = useState(false);

  // Load favorite status
  useEffect(() => {
    if (!tool) return;

    try {
      const favorites = getFavoriteTools();

      setFavorite(
        Array.isArray(favorites) &&
          favorites.some(
            (item) =>
              String(item) === String(tool.id)
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

  // Track visit
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

  // Tool not found
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

  // SAFE HEART CLICK
  const handleFavorite = () => {
    try {
      const newStatus =
        toggleFavoriteTool(tool);

      // Immediately update UI
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

  return (
    <main className="min-h-screen bg-transparent text-white px-6 py-10">

      <div className="max-w-4xl mx-auto">

        {/* BACK */}
      

        {/* CARD */}
        <div className="bg-[#18181b] border border-gray-800 rounded-3xl p-8 md:p-10">

          {/* TOP */}
          <div className="flex items-start justify-between">

            <div className="text-7xl">
              {tool.icon}
            </div>

            {/* HEART */}
            <button
              type="button"
              onClick={handleFavorite}
              aria-label="Favorite tool"
              className="w-14 h-14 rounded-full bg-black border border-gray-700 flex items-center justify-center text-3xl hover:border-pink-500 transition-all"
            >
              {favorite ? "❤️" : "♡"}
            </button>

          </div>

          {/* CATEGORY */}
          <p className="text-blue-400 mt-8 mb-3">
            {tool.category}
          </p>

          {/* TITLE */}
          <h1 className="text-5xl font-bold mb-6">
            {tool.name}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-xl leading-8 mb-8">
            {tool.description}
          </p>

          {/* WEBSITE */}
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Visit Official Website →
          </a>

        </div>

      </div>

    </main>
  );
}

export default ToolDetails;