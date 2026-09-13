import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Hero from "../components/sections/Hero";
import Tools from "../components/sections/Tools";
import Features from "../components/sections/Features";
import VisualLibrarySection from "../components/VisualLibrarySection";

import AINews from "./AINews";

import {
  supabase,
} from "../supabase/supabaseClient";

import {
  getFavoriteTools,
  getRecentlyVisitedTools,
  getSavedPrompts,
  getNewsRead,
  getCompletedCourses,
  getToolsExploredCount,
} from "../utils/dashboardStorage";

/* =========================================================
   DATA
========================================================= */

const toolLibrary = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    description:
      "AI assistant for writing, coding, learning and productivity.",
    path: "/ai-tools/chatgpt",
    category: "AI Chat",
  },

  {
    id: "gemini",
    name: "Gemini",
    icon: "💎",
    description:
      "Google AI assistant for research, productivity and learning.",
    path: "/ai-tools/gemini",
    category: "AI Chat",
  },

  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
    description:
      "AI assistant for writing, analysis and coding.",
    path: "/ai-tools/claude",
    category: "AI Chat",
  },

  {
    id: "midjourney",
    name: "Midjourney",
    icon: "🎨",
    description:
      "Create professional AI-generated images and artwork.",
    path: "/ai-tools/midjourney",
    category: "AI Image",
  },

  {
    id: "runway",
    name: "Runway",
    icon: "🎬",
    description:
      "AI video generation and creative video editing.",
    path: "/ai-tools/runway",
    category: "AI Video",
  },

  {
    id: "suno",
    name: "Suno AI",
    icon: "🎵",
    description:
      "Generate music, songs and audio using AI.",
    path: "/ai-tools/suno",
    category: "AI Music",
  },
];

const promptLibrary = [
  {
    id: 1,
    title: "YouTube Video Script",
    icon: "🎬",
    category: "YouTube",
    description:
      "Create engaging YouTube scripts with hooks, storytelling and CTA.",
  },

  {
    id: 2,
    title: "AI Image Prompt",
    icon: "🎨",
    category: "Image",
    description:
      "Create detailed professional AI image generation prompts.",
  },

  {
    id: 3,
    title: "Coding Assistant",
    icon: "💻",
    category: "Coding",
    description:
      "Analyze, debug and improve code using AI.",
  },

  {
    id: 4,
    title: "Study Assistant",
    icon: "📚",
    category: "Education",
    description:
      "Simplify difficult topics and create useful study notes.",
  },

  {
    id: 5,
    title: "Marketing Content",
    icon: "📢",
    category: "Marketing",
    description:
      "Generate social media and marketing content.",
  },

  {
    id: 6,
    title: "Business Ideas",
    icon: "💡",
    category: "Business",
    description:
      "Generate practical online business ideas.",
  },
];

const newsLibrary = [
  {
    id: 1,
    icon: "🚀",
    title: "AI is changing the future",
    category: "AI Trends",
  },

  {
    id: 2,
    icon: "🤖",
    title: "AI Agents are growing fast",
    category: "AI Agents",
  },

  {
    id: 3,
    icon: "🎨",
    title: "AI Image Generation is evolving",
    category: "AI Images",
  },

  {
    id: 4,
    icon: "🎬",
    title: "AI Video Creation is becoming easier",
    category: "AI Videos",
  },

  {
    id: 5,
    icon: "💻",
    title: "AI Coding Tools are improving",
    category: "AI Coding",
  },

  {
    id: 6,
    icon: "🧠",
    title: "AI is becoming part of daily life",
    category: "Future AI",
  },
];

const courseLibrary = [
  {
    id: "ai-tools-for-beginners",
    icon: "🤖",
    title: "AI Tools for Beginners",
    level: "Beginner",
    duration: "3 Hours",
    lessons: 5,
  },

  {
    id: "prompt-engineering-masterclass",
    icon: "✨",
    title: "Prompt Engineering Masterclass",
    level: "Beginner",
    duration: "4 Hours",
    lessons: 5,
  },

  {
    id: "ai-image-generation",
    icon: "🎨",
    title: "AI Image Generation",
    level: "Intermediate",
    duration: "4.5 Hours",
    lessons: 5,
  },

  {
    id: "ai-video-creation",
    icon: "🎬",
    title: "AI Video Creation",
    level: "Intermediate",
    duration: "5 Hours",
    lessons: 5,
  },

  {
    id: "ai-automation",
    icon: "⚡",
    title: "AI Automation",
    level: "Advanced",
    duration: "5 Hours",
    lessons: 5,
  },

  {
    id: "ai-productivity",
    icon: "📈",
    title: "AI Productivity",
    level: "Beginner",
    duration: "3.5 Hours",
    lessons: 5,
  },
];

/* =========================================================
   SAFE STORAGE
========================================================= */

function readObject(
  key,
  fallback = {}
) {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed =
      JSON.parse(value);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

/* =========================================================
   LEVEL
========================================================= */

function getLevelInfo(xp) {
  const xpPerLevel = 500;

  const safeXP =
    Math.max(
      0,
      Number(xp) || 0
    );

  const level =
    Math.floor(
      safeXP / xpPerLevel
    ) + 1;

  const currentXP =
    safeXP % xpPerLevel;

  const progress =
    Math.min(
      100,
      Math.round(
        (
          currentXP /
          xpPerLevel
        ) * 100
      )
    );

  let rank =
    "AI Rookie";

  let icon =
    "🌱";

  if (level >= 3) {
    rank =
      "AI Explorer";

    icon =
      "🚀";
  }

  if (level >= 5) {
    rank =
      "AI Builder";

    icon =
      "⚡";
  }

  if (level >= 8) {
    rank =
      "AI Pro";

    icon =
      "🔥";
  }

  if (level >= 12) {
    rank =
      "AI Master";

    icon =
      "👑";
  }

  return {
    level,
    currentXP,
    progress,
    rank,
    icon,
    xpPerLevel,
  };
}

/* =========================================================
   NORMALIZE RECENT TOOL
========================================================= */

function normalizeRecentTool(
  item
) {
  if (!item) {
    return null;
  }

  const id =
    String(
      item.id ||
      item.toolId ||
      item.tool_id ||
      ""
    );

  const match =
    toolLibrary.find(
      (tool) =>
        String(
          tool.id
        ) === id
    );

  if (match) {
    return match;
  }

  if (
    item.name ||
    item.title
  ) {
    return {
      id:
        id ||
        item.name ||
        item.title,

      name:
        item.name ||
        item.title,

      icon:
        item.icon ||
        "🤖",

      description:
        item.description ||
        "Recently explored AI tool.",

      category:
        item.category ||
        "AI Tool",

      path:
        item.path ||
        item.link ||
        `/ai-tools/${id}`,
    };
  }

  return null;
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

      <div>

        {eyebrow && (
          <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
            {eyebrow}
          </div>
        )}

        <h2 className="text-2xl font-black text-white sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}

/* =========================================================
   EMPTY CARD
========================================================= */

function EmptyCard({
  icon,
  title,
  description,
  link,
  button,
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-7 text-center">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="mt-4 font-black text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
        {description}
      </p>

      {link && (
        <Link
          to={link}
          className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/[0.12]"
        >
          {button}
        </Link>
      )}

    </div>
  );
}

const MEGA_TRENDING_FALLBACK = [
  {
    name:
      "ChatGPT",
    icon:
      "🤖",
    category:
      "General AI",
    bestFor:
      "Writing, coding, learning and everyday work",
    url:
      "https://chatgpt.com",
    tag:
      "All-rounder",
  },

  {
    name:
      "Gemini",
    icon:
      "💎",
    category:
      "Multimodal AI",
    bestFor:
      "Google ecosystem, research and multimodal tasks",
    url:
      "https://gemini.google.com",
    tag:
      "Multimodal",
  },

  {
    name:
      "Claude",
    icon:
      "🧠",
    category:
      "Deep Work",
    bestFor:
      "Long documents, analysis and coding",
    url:
      "https://claude.ai",
    tag:
      "Deep work",
  },

  {
    name:
      "Perplexity",
    icon:
      "🔎",
    category:
      "AI Research",
    bestFor:
      "Web research with citations and source discovery",
    url:
      "https://www.perplexity.ai",
    tag:
      "Research",
  },

  {
    name:
      "NotebookLM",
    icon:
      "📚",
    category:
      "Study AI",
    bestFor:
      "Learning from your own notes, PDFs and source material",
    url:
      "https://notebooklm.google.com",
    tag:
      "Students",
  },

  {
    name:
      "Canva AI",
    icon:
      "🎨",
    category:
      "Design AI",
    bestFor:
      "Social graphics, presentations and quick creative work",
    url:
      "https://www.canva.com/ai",
    tag:
      "Design",
  },

  {
    name:
      "Cursor",
    icon:
      "💻",
    category:
      "AI Coding",
    bestFor:
      "AI-first coding, refactoring and project development",
    url:
      "https://www.cursor.com",
    tag:
      "Developers",
  },

  {
    name:
      "n8n",
    icon:
      "⚙️",
    category:
      "Automation",
    bestFor:
      "Connecting apps and building AI-powered workflows",
    url:
      "https://n8n.io",
    tag:
      "Automation",
  },

  {
    name:
      "Runway",
    icon:
      "🎬",
    category:
      "AI Video",
    bestFor:
      "Generative video and creative production workflows",
    url:
      "https://runwayml.com",
    tag:
      "Video",
  },

  {
    name:
      "ElevenLabs",
    icon:
      "🎙️",
    category:
      "AI Voice",
    bestFor:
      "Voice generation, narration and audio localization",
    url:
      "https://elevenlabs.io",
    tag:
      "Audio",
  },

];

const MEGA_GOAL_PATHS = [
  {
    icon:
      "🎓",
    title:
      "Learn AI from Zero",
    description:
      "Start with beginner-friendly lessons and build confidence step by step.",
    route:
      "/courses",
    accent:
      "cyan",
  },

  {
    icon:
      "✨",
    title:
      "Write Better Prompts",
    description:
      "Use practical prompt patterns for learning, work and creative tasks.",
    route:
      "/prompts",
    accent:
      "violet",
  },

  {
    icon:
      "🤖",
    title:
      "Choose the Right AI",
    description:
      "Browse assistants, image tools, video tools and productivity apps.",
    route:
      "/ai-tools",
    accent:
      "blue",
  },

  {
    icon:
      "📰",
    title:
      "Track AI Changes",
    description:
      "Follow useful launches, product updates and important AI trends.",
    route:
      "/ai-news",
    accent:
      "pink",
  },

  {
    icon:
      "🧪",
    title:
      "Experiment with New Tech",
    description:
      "Try advanced concepts, prototypes and future-facing ideas.",
    route:
      "/innovation-lab",
    accent:
      "amber",
  },

  {
    icon:
      "🧭",
    title:
      "Experience Interactive Demos",
    description:
      "Explore hands-on showcases designed to make technology easier to understand.",
    route:
      "/experience-zone",
    accent:
      "emerald",
  },

];

const MEGA_CREATOR_RESOURCES = [
  {
    icon:
      "▶️",
    title:
      "YouTube Growth",
    description:
      "Ideas, scripts, channel planning and creator workflows.",
    route:
      "/creators/youtube",
  },

  {
    icon:
      "📱",
    title:
      "Instagram Studio",
    description:
      "Reels, captions, post ideas and social growth resources.",
    route:
      "/creators/instagram",
  },

  {
    icon:
      "✂️",
    title:
      "Video Editing",
    description:
      "Editing workflows, storytelling and production shortcuts.",
    route:
      "/creators/video-editing",
  },

  {
    icon:
      "🖼️",
    title:
      "Thumbnail Lab",
    description:
      "Clickable thumbnail ideas, composition and visual hooks.",
    route:
      "/creators/thumbnails",
  },

  {
    icon:
      "🎧",
    title:
      "Music & SFX",
    description:
      "Audio resources for intros, reels, shorts and storytelling.",
    route:
      "/creators/music-sfx",
  },

  {
    icon:
      "🎞️",
    title:
      "CapCut Resources",
    description:
      "Templates, editing ideas and mobile-first production help.",
    route:
      "/creators/capcut",
  },

  {
    icon:
      "🎬",
    title:
      "Premiere Workflows",
    description:
      "Professional editing shortcuts and structured production.",
    route:
      "/creators/premiere",
  },

  {
    icon:
      "🎨",
    title:
      "Canva Creator Kit",
    description:
      "Fast designs for posts, presentations and branded content.",
    route:
      "/creators/canva",
  },

  {
    icon:
      "💫",
    title:
      "Motion Graphics",
    description:
      "Animated titles, transitions and engaging visual movement.",
    route:
      "/creators/motion-graphics",
  },

  {
    icon:
      "🟩",
    title:
      "Green Screen Pack",
    description:
      "Keying concepts, backgrounds and compositing resources.",
    route:
      "/creators/green-screen",
  },

  {
    icon:
      "🧩",
    title:
      "PNG Assets",
    description:
      "Transparent visual elements for fast content design.",
    route:
      "/creators/png-packs",
  },

  {
    icon:
      "🚀",
    title:
      "Intro & Outro",
    description:
      "Brand-ready opening and closing ideas for videos.",
    route:
      "/creators/intro-outro",
  },

];

const MEGA_TECH_RESOURCES = [
  {
    icon:
      "🤖",
    title:
      "Android Skills",
    description:
      "Apps, settings, productivity tricks and mobile workflows.",
    route:
      "/technology/android",
  },

  {
    icon:
      "🪟",
    title:
      "Windows Guide",
    description:
      "PC setup, performance, shortcuts and troubleshooting.",
    route:
      "/technology/windows",
  },

  {
    icon:
      "🧠",
    title:
      "AI Software",
    description:
      "Useful AI applications for real work and daily productivity.",
    route:
      "/technology/ai-software",
  },

  {
    icon:
      "📲",
    title:
      "Mobile Tips",
    description:
      "Practical phone features, settings and time-saving tricks.",
    route:
      "/technology/mobile-tips",
  },

  {
    icon:
      "🌐",
    title:
      "Chrome Power Tips",
    description:
      "Browser productivity, privacy and workflow improvements.",
    route:
      "/technology/chrome",
  },

  {
    icon:
      "💻",
    title:
      "Laptop Optimization",
    description:
      "Improve performance, storage, battery and everyday usability.",
    route:
      "/technology/laptop-tips",
  },

  {
    icon:
      "🛡️",
    title:
      "Cyber Safety",
    description:
      "Safer browsing, account protection and security basics.",
    route:
      "/technology/cyber-security",
  },

  {
    icon:
      "🧑‍💻",
    title:
      "Programming Path",
    description:
      "Build coding fundamentals through practical projects.",
    route:
      "/technology/programming",
  },

  {
    icon:
      "📦",
    title:
      "Coding Resources",
    description:
      "Helpful references, starter materials and developer assets.",
    route:
      "/technology/coding-resources",
  },

];

const MEGA_PRODUCT_RESOURCES = [
  {
    icon:
      "🎁",
    title:
      "Free Resources",
    description:
      "Useful downloads and starter assets without cost.",
    route:
      "/products/free",
  },

  {
    icon:
      "💎",
    title:
      "Premium Packs",
    description:
      "Higher-value resources for serious creators and builders.",
    route:
      "/products/premium",
  },

  {
    icon:
      "✨",
    title:
      "Prompt Packs",
    description:
      "Ready-to-use prompt collections for practical workflows.",
    route:
      "/products/prompts",
  },

  {
    icon:
      "📕",
    title:
      "Ebooks",
    description:
      "Structured guides for learning and reference.",
    route:
      "/products/ebooks",
  },

  {
    icon:
      "🧱",
    title:
      "Templates",
    description:
      "Reusable layouts to speed up projects and content.",
    route:
      "/products/templates",
  },

  {
    icon:
      "🔤",
    title:
      "Icons & Fonts",
    description:
      "Design assets for clean interfaces and visual branding.",
    route:
      "/products/icons-fonts",
  },

  {
    icon:
      "🧩",
    title:
      "UI Kits",
    description:
      "Interface components and patterns for faster design.",
    route:
      "/products/ui-kits",
  },

  {
    icon:
      "</>",
    title:
      "Source Code",
    description:
      "Starter code and examples for building useful projects.",
    route:
      "/products/source-code",
  },

  {
    icon:
      "🖌️",
    title:
      "Photoshop Assets",
    description:
      "Creative resources for photo and graphic workflows.",
    route:
      "/products/photoshop",
  },

  {
    icon:
      "🎞️",
    title:
      "CapCut Packs",
    description:
      "Mobile editing resources for fast video production.",
    route:
      "/products/capcut",
  },

  {
    icon:
      "🎚️",
    title:
      "LUT Collection",
    description:
      "Color looks for cinematic and branded video styles.",
    route:
      "/products/luts",
  },

  {
    icon:
      "💫",
    title:
      "Animation Assets",
    description:
      "Motion-ready elements for engaging digital content.",
    route:
      "/products/animations",
  },

];

const MEGA_PLAYGROUND_RESOURCES = [
  {
    icon:
      "📱",
    title:
      "AI Apps",
    description:
      "Explore useful AI-powered applications.",
    route:
      "/ai-apps",
  },

  {
    icon:
      "🖼️",
    title:
      "AI Images",
    description:
      "Discover image generation and visual creation workflows.",
    route:
      "/ai-images",
  },

  {
    icon:
      "🎥",
    title:
      "AI Videos",
    description:
      "Explore generative video and animation possibilities.",
    route:
      "/ai-videos",
  },

  {
    icon:
      "🧠",
    title:
      "AI Models",
    description:
      "Understand model choices and capabilities.",
    route:
      "/ai-models",
  },

  {
    icon:
      "🗃️",
    title:
      "AI Datasets",
    description:
      "Learn how data supports machine learning systems.",
    route:
      "/ai-datasets",
  },

  {
    icon:
      "💻",
    title:
      "Developer Source",
    description:
      "Explore AI-oriented source code and build examples.",
    route:
      "/source-code",
  },

  {
    icon:
      "🧰",
    title:
      "AI Templates",
    description:
      "Start faster with reusable AI project structures.",
    route:
      "/ai-templates",
  },

  {
    icon:
      "🌌",
    title:
      "Tech Wallpapers",
    description:
      "Give your devices a futuristic visual identity.",
    route:
      "/wallpapers",
  },

];

const MEGA_WORKFLOW_BLUEPRINTS = [
  {
    icon:
      "🧠",
    title:
      "Research Sprint",
    description:
      "Question → sources → notes → summary → action list.",
    steps: [
      "Ask a focused question",
      "Collect reliable sources",
      "Extract key facts",
      "Summarize differences",
      "Save next actions",
    ],
  },

  {
    icon:
      "🎬",
    title:
      "Video Production Loop",
    description:
      "Idea → script → visuals → voice → edit → publish.",
    steps: [
      "Choose one audience problem",
      "Draft a hook-first script",
      "Plan visuals scene by scene",
      "Create clean narration",
      "Edit for retention",
    ],
  },

  {
    icon:
      "💻",
    title:
      "Build Faster",
    description:
      "Plan → scaffold → code → test → improve.",
    steps: [
      "Write the user goal",
      "Break work into components",
      "Generate a clean first version",
      "Test important flows",
      "Polish accessibility",
    ],
  },

  {
    icon:
      "📚",
    title:
      "Study Smarter",
    description:
      "Learn → recall → practice → review → repeat.",
    steps: [
      "Simplify one concept",
      "Create active-recall questions",
      "Practice without notes",
      "Check weak areas",
      "Review later",
    ],
  },

  {
    icon:
      "📣",
    title:
      "Content Repurposing",
    description:
      "One idea → many useful formats.",
    steps: [
      "Create one strong core idea",
      "Turn it into a short video",
      "Create a carousel",
      "Write a short post",
      "Reuse the best hook",
    ],
  },

  {
    icon:
      "⚙️",
    title:
      "Automation Starter",
    description:
      "Trigger → process → check → deliver.",
    steps: [
      "Pick a repetitive task",
      "Define the trigger",
      "Map the steps",
      "Add a quality check",
      "Track the outcome",
    ],
  },

];

const MEGA_COMPARE_ROWS = [
  {
    task:
      "Everyday AI assistant",
    first:
      "ChatGPT",
    second:
      "Gemini",
    note:
      "Choose based on ecosystem and workflow.",
  },

  {
    task:
      "Long document analysis",
    first:
      "Claude",
    second:
      "ChatGPT",
    note:
      "Use strong context and verify important claims.",
  },

  {
    task:
      "Research with sources",
    first:
      "Perplexity",
    second:
      "Gemini",
    note:
      "Open and verify the original sources.",
  },

  {
    task:
      "Learning from your files",
    first:
      "NotebookLM",
    second:
      "ChatGPT",
    note:
      "Great for notes, PDFs and study material.",
  },

  {
    task:
      "AI-first coding",
    first:
      "Cursor",
    second:
      "ChatGPT",
    note:
      "Keep version control and test generated changes.",
  },

  {
    task:
      "Design for non-designers",
    first:
      "Canva AI",
    second:
      "ChatGPT",
    note:
      "Use AI for ideas, then refine the visual hierarchy.",
  },

  {
    task:
      "Generative video",
    first:
      "Runway",
    second:
      "AI Video Hub",
    note:
      "Storyboarding still matters more than effects.",
  },

  {
    task:
      "Voice and narration",
    first:
      "ElevenLabs",
    second:
      "Creator Audio Hub",
    note:
      "Keep pacing natural and respect voice permissions.",
  },

];

const MEGA_PROJECT_IDEAS = [
  {
    domain:
      "Student",
    icon:
      "🎓",
    title:
      "AI Revision Buddy",
    description:
      "Create a mini study assistant that converts a topic into notes, recall questions and a quick quiz.",
    route:
      "/courses",
  },

  {
    domain:
      "Creator",
    icon:
      "🎬",
    title:
      "Shorts Idea Factory",
    description:
      "Build a workflow that turns one topic into hooks, scenes, captions and thumbnail text.",
    route:
      "/creators/youtube",
  },

  {
    domain:
      "Developer",
    icon:
      "💻",
    title:
      "Bug Explainer",
    description:
      "Build a simple tool that explains an error, probable cause, fix steps and test checklist.",
    route:
      "/technology/programming",
  },

  {
    domain:
      "Designer",
    icon:
      "🎨",
    title:
      "Brand Moodboard Helper",
    description:
      "Generate mood, palette, typography direction and visual references from a brand brief.",
    route:
      "/creators/canva",
  },

  {
    domain:
      "Business",
    icon:
      "💼",
    title:
      "FAQ Assistant",
    description:
      "Turn common customer questions into a structured response library and support workflow.",
    route:
      "/smart-hub",
  },

  {
    domain:
      "Productivity",
    icon:
      "⚡",
    title:
      "Daily Priority Coach",
    description:
      "Convert a messy task list into priorities, time blocks and a realistic action plan.",
    route:
      "/utility-hub",
  },

  {
    domain:
      "Tamil",
    icon:
      "🌴",
    title:
      "Tamil Learning Companion",
    description:
      "Create bilingual explanations, examples and practice tasks for everyday learning.",
    route:
      "/prompts",
  },

  {
    domain:
      "Kids",
    icon:
      "🧒",
    title:
      "Visual Science Explorer",
    description:
      "Turn a school concept into a safe, visual, step-by-step learning activity.",
    route:
      "/visual-library",
  },

];

const MEGA_GROWTH_LINKS = [
  {
    icon:
      "👥",
    title:
      "Community",
    description:
      "Connect, share discoveries and learn with other explorers.",
    route:
      "/community",
  },

  {
    icon:
      "📣",
    title:
      "Promotion",
    description:
      "Discover ways to showcase useful creator work and projects.",
    route:
      "/promotion",
  },

  {
    icon:
      "💎",
    title:
      "Premium",
    description:
      "Unlock higher-value resources and advanced experiences.",
    route:
      "/premium",
  },

  {
    icon:
      "💳",
    title:
      "Plans",
    description:
      "Compare membership options and choose what fits your goals.",
    route:
      "/pricing",
  },

  {
    icon:
      "🤝",
    title:
      "Contact",
    description:
      "Reach the AI Future Tamil team for support or collaboration.",
    route:
      "/contact",
  },

  {
    icon:
      "🚀",
    title:
      "About",
    description:
      "See the mission behind the platform and where it is heading.",
    route:
      "/about",
  },

];

const MEGA_POWER_SKILLS = [
  {
    icon:
      "🔍",
    title:
      "Ask Better Questions",
    description:
      "Turn vague requests into clear goals, context and constraints.",
  },

  {
    icon:
      "🧪",
    title:
      "Verify AI Output",
    description:
      "Check sources, numbers, assumptions and important details before using results.",
  },

  {
    icon:
      "🧱",
    title:
      "Build Small Projects",
    description:
      "Learn faster by creating useful mini projects instead of only reading theory.",
  },

  {
    icon:
      "🎯",
    title:
      "Pick One Tool per Job",
    description:
      "Avoid tool overload; choose a reliable tool for each repeated task.",
  },

  {
    icon:
      "📝",
    title:
      "Save Reusable Workflows",
    description:
      "Turn good prompts and steps into repeatable systems.",
  },

  {
    icon:
      "🔐",
    title:
      "Protect Private Data",
    description:
      "Avoid sharing sensitive personal or business information unnecessarily.",
  },

  {
    icon:
      "🧭",
    title:
      "Measure the Outcome",
    description:
      "Judge AI by useful results, not by how impressive the interface looks.",
  },

  {
    icon:
      "🌱",
    title:
      "Improve Every Week",
    description:
      "Review what worked, remove friction and upgrade one workflow at a time.",
  },

];


/* =========================================================
   ADVANCED HOME EXPERIENCE — SHARED HELPERS
========================================================= */

function MegaHomeMotionLayer() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll(".mh-reveal")
    );

    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window)
    ) {
      nodes.forEach((node) => {
        node.classList.add("mh-visible");
      });

      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("mh-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeRevealNode = (node) => {
      if (
        node instanceof Element &&
        node.classList.contains("mh-reveal") &&
        !node.classList.contains("mh-visible")
      ) {
        observer.observe(node);
      }

      if (node instanceof Element) {
        node.querySelectorAll(".mh-reveal").forEach((child) => {
          if (!child.classList.contains("mh-visible")) {
            observer.observe(child);
          }
        });
      }
    };

    nodes.forEach((node) => {
      observer.observe(node);
    });

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          observeRevealNode(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <style>{`
      @keyframes mhFloat {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes mhGlow {
        0%, 100% {
          opacity: .36;
          transform: scale(1);
        }
        50% {
          opacity: .72;
          transform: scale(1.08);
        }
      }

      @keyframes mhSweep {
        0% {
          transform: translateX(-160%) skewX(-18deg);
        }
        65%, 100% {
          transform: translateX(360%) skewX(-18deg);
        }
      }

      @keyframes mhOrbit {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes mhPulse {
        0%, 100% {
          box-shadow: 0 0 0 rgba(34,211,238,0);
        }
        50% {
          box-shadow: 0 0 36px rgba(34,211,238,.18);
        }
      }

      @keyframes mhGradientMove {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      @keyframes mhProgress {
        from {
          transform: scaleX(0);
        }
        to {
          transform: scaleX(1);
        }
      }

      .mh-reveal {
        opacity: 0;
        transform: translateY(24px) scale(.985);
        transition:
          opacity .72s ease,
          transform .72s cubic-bezier(.2,.8,.2,1);
      }

      .mh-reveal.mh-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .mh-card {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        transition:
          transform .28s ease,
          border-color .28s ease,
          background-color .28s ease,
          box-shadow .28s ease;
      }

      .mh-card::after {
        content: "";
        position: absolute;
        top: -130%;
        bottom: -130%;
        left: -40%;
        width: 20%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,.15),
          transparent
        );
        transform: translateX(-160%) skewX(-18deg);
        transition: opacity .25s ease;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
      }

      .mh-card:hover {
        transform: translateY(-6px);
      }

      .mh-card:hover::after {
        opacity: 1;
        animation: mhSweep 1.1s ease forwards;
      }

      .mh-icon-float {
        animation: mhFloat 4.6s ease-in-out infinite;
      }

      .mh-ambient {
        animation: mhGlow 6s ease-in-out infinite;
      }

      .mh-orbit {
        animation: mhOrbit 32s linear infinite;
      }

      .mh-title-gradient {
        background-size: 220% 220%;
        animation: mhGradientMove 8s ease infinite;
      }

      .mh-live-dot {
        animation: mhPulse 2.5s ease-in-out infinite;
      }

      .mh-scene {
        position: relative;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,.035);
      }

      .mh-scene::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .9;
        background-image:
          linear-gradient(rgba(255,255,255,.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.012) 1px, transparent 1px);
        background-size: 48px 48px;
        mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
      }

      .mh-scene-goal {
        background:
          radial-gradient(circle at 10% 20%, rgba(6,182,212,.12), transparent 26%),
          radial-gradient(circle at 88% 70%, rgba(59,130,246,.11), transparent 30%),
          linear-gradient(180deg, rgba(3,10,22,.98), rgba(4,12,24,.98));
      }

      .mh-scene-trending {
        background:
          radial-gradient(circle at 84% 22%, rgba(168,85,247,.16), transparent 30%),
          radial-gradient(circle at 16% 74%, rgba(236,72,153,.10), transparent 28%),
          linear-gradient(180deg, rgba(10,7,24,.98), rgba(9,8,20,.98));
      }

      .mh-scene-utility {
        background:
          radial-gradient(circle at 14% 18%, rgba(16,185,129,.13), transparent 26%),
          radial-gradient(circle at 84% 76%, rgba(34,211,238,.10), transparent 30%),
          linear-gradient(180deg, rgba(3,18,18,.98), rgba(4,13,20,.98));
      }

      .mh-scene-prompt {
        background:
          radial-gradient(circle at 82% 18%, rgba(244,63,94,.13), transparent 26%),
          radial-gradient(circle at 14% 74%, rgba(217,70,239,.12), transparent 28%),
          linear-gradient(180deg, rgba(20,6,18,.98), rgba(13,6,20,.98));
      }

      .mh-scene-creator {
        background:
          radial-gradient(circle at 18% 18%, rgba(245,158,11,.13), transparent 28%),
          radial-gradient(circle at 88% 70%, rgba(239,68,68,.09), transparent 28%),
          linear-gradient(180deg, rgba(22,13,4,.98), rgba(16,8,8,.98));
      }

      .mh-scene-tech {
        background:
          radial-gradient(circle at 82% 18%, rgba(37,99,235,.16), transparent 30%),
          radial-gradient(circle at 12% 75%, rgba(14,165,233,.10), transparent 30%),
          linear-gradient(180deg, rgba(4,9,26,.98), rgba(4,10,20,.98));
      }

      .mh-scene-products {
        background:
          radial-gradient(circle at 14% 20%, rgba(99,102,241,.15), transparent 28%),
          radial-gradient(circle at 86% 74%, rgba(168,85,247,.10), transparent 30%),
          linear-gradient(180deg, rgba(10,8,28,.98), rgba(7,8,20,.98));
      }

      .mh-scene-playground {
        background:
          radial-gradient(circle at 84% 16%, rgba(20,184,166,.14), transparent 28%),
          radial-gradient(circle at 12% 70%, rgba(6,182,212,.10), transparent 30%),
          linear-gradient(180deg, rgba(3,18,22,.98), rgba(4,11,18,.98));
      }

      .mh-scene-ideas {
        background:
          radial-gradient(circle at 16% 18%, rgba(217,70,239,.14), transparent 28%),
          radial-gradient(circle at 86% 72%, rgba(99,102,241,.10), transparent 30%),
          linear-gradient(180deg, rgba(18,6,24,.98), rgba(10,7,20,.98));
      }

      .mh-scene-focus {
        background:
          radial-gradient(circle at 82% 22%, rgba(148,163,184,.10), transparent 28%),
          radial-gradient(circle at 18% 72%, rgba(59,130,246,.08), transparent 30%),
          linear-gradient(180deg, rgba(9,12,20,.98), rgba(5,9,16,.98));
      }

      .mh-scene-workflow {
        background:
          radial-gradient(circle at 14% 18%, rgba(249,115,22,.13), transparent 26%),
          radial-gradient(circle at 86% 74%, rgba(234,179,8,.09), transparent 30%),
          linear-gradient(180deg, rgba(22,12,4,.98), rgba(15,9,5,.98));
      }

      .mh-scene-stack {
        background:
          radial-gradient(circle at 84% 18%, rgba(139,92,246,.16), transparent 28%),
          radial-gradient(circle at 12% 74%, rgba(59,130,246,.09), transparent 30%),
          linear-gradient(180deg, rgba(12,7,25,.98), rgba(7,8,20,.98));
      }

      .mh-scene-compare {
        background:
          radial-gradient(circle at 16% 20%, rgba(34,197,94,.12), transparent 28%),
          radial-gradient(circle at 84% 72%, rgba(20,184,166,.09), transparent 30%),
          linear-gradient(180deg, rgba(4,19,14,.98), rgba(5,12,16,.98));
      }

      .mh-scene-growth {
        background:
          radial-gradient(circle at 86% 18%, rgba(14,165,233,.14), transparent 28%),
          radial-gradient(circle at 14% 74%, rgba(99,102,241,.10), transparent 30%),
          linear-gradient(180deg, rgba(4,12,24,.98), rgba(7,8,20,.98));
      }

      .mh-scene-skills {
        background:
          radial-gradient(circle at 15% 20%, rgba(236,72,153,.13), transparent 28%),
          radial-gradient(circle at 85% 72%, rgba(168,85,247,.10), transparent 30%),
          linear-gradient(180deg, rgba(18,6,18,.98), rgba(8,8,18,.98));
      }

      .mh-scene-visual {
        background:
          radial-gradient(circle at 12% 16%, rgba(59,130,246,.08), transparent 26%),
          radial-gradient(circle at 90% 68%, rgba(168,85,247,.08), transparent 30%),
          #050816;
      }

      .mh-scene-personal {
        background:
          radial-gradient(circle at 18% 18%, rgba(6,182,212,.08), transparent 28%),
          radial-gradient(circle at 82% 76%, rgba(168,85,247,.08), transparent 30%),
          #060817;
      }

      .mh-scene-directory {
        background:
          radial-gradient(circle at 86% 20%, rgba(34,211,238,.07), transparent 28%),
          #050914;
      }

      .mh-scene-features {
        background:
          radial-gradient(circle at 14% 18%, rgba(139,92,246,.08), transparent 28%),
          #080714;
      }

      .mh-scene-news {
        background:
          radial-gradient(circle at 82% 20%, rgba(236,72,153,.07), transparent 28%),
          #090711;
      }

      @media (prefers-reduced-motion: reduce) {
        .mh-reveal,
        .mh-card,
        .mh-icon-float,
        .mh-ambient,
        .mh-orbit,
        .mh-title-gradient,
        .mh-live-dot {
          animation: none !important;
          transition: none !important;
          transform: none !important;
          opacity: 1 !important;
        }
      }
    `}</style>
  );
}

function MegaSectionFrame({
  id,
  scene,
  children,
  className = "",
}) {
  return (
    <section
      id={id}
      className={`
        mh-scene
        ${scene}
        ${className}
        px-4
        py-16
        sm:px-6
        lg:px-8
        lg:py-20
      `}
    >
      <div
        className="
          mh-ambient
          pointer-events-none
          absolute
          -left-24
          top-10
          h-64
          w-64
          rounded-full
          bg-white/[0.025]
          blur-[90px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-28
          bottom-0
          h-72
          w-72
          rounded-full
          border
          border-white/[0.04]
        "
      >
        <div
          className="
            mh-orbit
            absolute
            inset-7
            rounded-full
            border
            border-dashed
            border-white/[0.04]
          "
        />
      </div>

      <div
        className="
          relative
          z-[1]
          mx-auto
          max-w-7xl
        "
      >
        {children}
      </div>
    </section>
  );
}

function MegaSectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div
      className="
        mh-reveal
        mb-9
        flex
        flex-col
        gap-5
        lg:flex-row
        lg:items-end
        lg:justify-between
      "
    >
      <div>
        <div
          className="
            mb-3
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            px-3
            py-1.5
            text-[11px]
            font-black
            uppercase
            tracking-[0.18em]
            text-cyan-200
            backdrop-blur-xl
          "
        >
          {eyebrow}
        </div>

        <h2
          className="
            mh-title-gradient
            max-w-4xl
            bg-gradient-to-r
            from-white
            via-cyan-100
            to-purple-200
            bg-clip-text
            text-3xl
            font-black
            leading-tight
            text-transparent
            sm:text-4xl
            lg:text-5xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-4
            max-w-3xl
            text-sm
            leading-7
            text-gray-400
            sm:text-base
          "
        >
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function MegaRouteCard({
  item,
  badge,
  index = 0,
}) {
  return (
    <Link
      to={item.route}
      className="
        mh-card
        mh-reveal
        group
        rounded-[26px]
        border
        border-white/[0.08]
        bg-black/20
        p-5
        shadow-[0_20px_70px_rgba(0,0,0,.18)]
        backdrop-blur-xl
        hover:border-cyan-300/25
        hover:bg-white/[0.045]
      "
      style={{
        transitionDelay: `${Math.min(index * 35, 245)}ms`,
      }}
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div
          className="
            mh-icon-float
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-white/10
            bg-white/[0.05]
            text-3xl
            shadow-[inset_0_1px_0_rgba(255,255,255,.08)]
          "
        >
          {item.icon}
        </div>

        {badge && (
          <span
            className="
              rounded-full
              border
              border-cyan-300/15
              bg-cyan-300/[0.06]
              px-2.5
              py-1
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-cyan-200
            "
          >
            {badge}
          </span>
        )}
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-black
          text-white
          transition
          group-hover:text-cyan-100
        "
      >
        {item.title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-gray-500
        "
      >
        {item.description}
      </p>

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          text-sm
          font-black
          text-cyan-300
        "
      >
        Open
        <span
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </div>
    </Link>
  );
}

function MegaGoalNavigator() {
  return (
    <MegaSectionFrame
      id="goal-navigator"
      scene="mh-scene-goal"
    >
      <MegaSectionHeader
        eyebrow="🎯 Start with your goal"
        title="Tell the website what you want to achieve."
        description="Choose one clear outcome instead of searching through everything. Each path takes you directly to the most useful area for that goal."
      />

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {MEGA_GOAL_PATHS.map((item, index) => (
          <MegaRouteCard
            key={item.title}
            item={item}
            badge={`Path ${String(index + 1).padStart(2, "0")}`}
            index={index}
          />
        ))}
      </div>
    </MegaSectionFrame>
  );
}

function MegaTrendingAISection() {
  const [items, setItems] = useState(MEGA_TRENDING_FALLBACK);
  const [status, setStatus] = useState("Curated 2026 picks");

  const loadTrending = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("trending", { ascending: false })
        .order("featured", { ascending: false })
        .limit(8);

      if (error) {
        throw error;
      }

      const cmsItems = (data || []).map((tool) => ({
        id: tool.id,
        name: tool.name || "AI Tool",
        icon: "🤖",
        category: tool.category || "AI Tool",
        bestFor: tool.description || "Explore this AI tool from your live directory.",
        url: tool.website_url || "",
        internal: `/ai-tools/${tool.slug || tool.id}`,
        tag: tool.trending
          ? "CMS Trending"
          : tool.featured
            ? "CMS Featured"
            : "Live CMS",
      }));

      const seen = new Set();
      const merged = [
        ...cmsItems,
        ...MEGA_TRENDING_FALLBACK,
      ].filter((item) => {
        const key = String(item.name || "")
          .trim()
          .toLowerCase();

        if (!key || seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });

      setItems(merged.slice(0, 10));
      setStatus(
        cmsItems.length > 0
          ? "Live CMS + curated picks"
          : "Curated 2026 picks"
      );
    } catch (error) {
      console.error("Home trending tools error:", error);
      setItems(MEGA_TRENDING_FALLBACK);
      setStatus("Curated 2026 picks");
    }
  }, []);

  useEffect(() => {
    loadTrending();

    const channel = supabase
      .channel("home-trending-ai-stack")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ai_tools",
        },
        loadTrending
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTrending]);

  return (
    <MegaSectionFrame
      id="trending-ai-stack"
      scene="mh-scene-trending"
    >
      <MegaSectionHeader
        eyebrow="🔥 Trending AI Stack"
        title="Useful AI tools for real 2026 workflows."
        description="Your own CMS tools appear first, then carefully selected tools for research, study, design, coding, automation, video and voice."
        action={
          <div
            className="
              mh-live-dot
              rounded-full
              border
              border-green-400/20
              bg-green-400/[0.06]
              px-4
              py-2
              text-xs
              font-black
              text-green-300
            "
          >
            ● {status}
          </div>
        }
      />

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
      >
        {items.map((tool, index) => {
          const content = (
            <>
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    mh-icon-float
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-purple-300/15
                    bg-purple-300/[0.07]
                    text-2xl
                  "
                >
                  {tool.icon}
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-purple-300/15
                    bg-purple-300/[0.05]
                    px-2
                    py-1
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-purple-200
                  "
                >
                  {tool.tag}
                </span>
              </div>

              <h3
                className="
                  mt-4
                  text-lg
                  font-black
                  text-white
                "
              >
                {tool.name}
              </h3>

              <p
                className="
                  mt-1
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-purple-300
                "
              >
                {tool.category}
              </p>

              <p
                className="
                  mt-3
                  line-clamp-3
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                {tool.bestFor}
              </p>

              <div
                className="
                  mt-4
                  text-sm
                  font-black
                  text-purple-200
                "
              >
                Explore →
              </div>
            </>
          );

          const className = `
            mh-card
            mh-reveal
            rounded-[24px]
            border
            border-white/[0.08]
            bg-black/20
            p-4
            hover:border-purple-300/25
            hover:bg-purple-300/[0.04]
          `;

          if (tool.internal) {
            return (
              <Link
                key={`${tool.name}-${index}`}
                to={tool.internal}
                className={className}
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={`${tool.name}-${index}`}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className={className}
            >
              {content}
            </a>
          );
        })}
      </div>
    </MegaSectionFrame>
  );
}

function MegaUtilityStudio() {
  const modes = [
    {
      key: "words",
      icon: "🔢",
      label: "Word Counter",
    },
    {
      key: "case",
      icon: "🔤",
      label: "Case Converter",
    },
    {
      key: "reading",
      icon: "⏱️",
      label: "Reading Time",
    },
    {
      key: "slug",
      icon: "🔗",
      label: "Slug Maker",
    },
  ];

  const [mode, setMode] = useState("words");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed
      ? trimmed.split(/\s+/).filter(Boolean).length
      : 0;
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((item) => item.trim()).length
      : 0;
    const minutes = words === 0
      ? 0
      : Math.max(1, Math.ceil(words / 200));

    return {
      words,
      characters,
      charactersNoSpace,
      sentences,
      minutes,
    };
  }, [text]);

  const output = useMemo(() => {
    if (mode === "case") {
      return {
        title: "UPPERCASE OUTPUT",
        value: text.toUpperCase(),
        secondaryTitle: "lowercase output",
        secondaryValue: text.toLowerCase(),
      };
    }

    if (mode === "slug") {
      const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        title: "Clean URL Slug",
        value: slug,
        secondaryTitle: "Character count",
        secondaryValue: String(slug.length),
      };
    }

    if (mode === "reading") {
      return {
        title: "Estimated Reading Time",
        value: stats.words === 0
          ? "Add some text to calculate"
          : `${stats.minutes} minute${stats.minutes === 1 ? "" : "s"}`,
        secondaryTitle: "Reading pace",
        secondaryValue: "~200 words / minute",
      };
    }

    return {
      title: "Text Statistics",
      value: `${stats.words} words • ${stats.characters} characters`,
      secondaryTitle: "Extra detail",
      secondaryValue: `${stats.sentences} sentences • ${stats.charactersNoSpace} non-space characters`,
    };
  }, [mode, stats, text]);

  async function copyUtilityOutput() {
    const value = [
      output.value,
      output.secondaryValue,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <MegaSectionFrame
      id="utility-studio"
      scene="mh-scene-utility"
    >
      <MegaSectionHeader
        eyebrow="🧰 Quick Utility Studio"
        title="Small tools that save time every day."
        description="No popup, no extra page and no installation. Paste text, choose a tool and get the result instantly."
      />

      <div
        className="
          mh-reveal
          rounded-[32px]
          border
          border-emerald-300/10
          bg-black/25
          p-5
          shadow-[0_30px_100px_rgba(0,0,0,.25)]
          backdrop-blur-xl
          sm:p-7
        "
      >
        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          {modes.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setMode(item.key)}
              className={`
                rounded-xl
                border
                px-4
                py-2.5
                text-sm
                font-black
                transition
                ${
                  mode === item.key
                    ? "border-emerald-300/30 bg-emerald-300/[0.10] text-emerald-200"
                    : "border-white/[0.07] bg-white/[0.03] text-gray-400 hover:text-white"
                }
              `}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div
          className="
            mt-5
            grid
            gap-5
            lg:grid-cols-[1.15fr_.85fr]
          "
        >
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste or type your text here..."
            className="
              min-h-[260px]
              w-full
              resize-none
              rounded-2xl
              border
              border-white/[0.08]
              bg-[#061013]
              p-5
              text-sm
              leading-7
              text-white
              outline-none
              transition
              placeholder:text-gray-700
              focus:border-emerald-300/30
              focus:ring-2
              focus:ring-emerald-300/5
            "
          />

          <div
            className="
              rounded-2xl
              border
              border-emerald-300/10
              bg-emerald-300/[0.035]
              p-5
            "
          >
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-emerald-300
              "
            >
              {output.title}
            </p>

            <div
              className="
                mt-4
                min-h-[92px]
                break-words
                rounded-2xl
                border
                border-white/[0.06]
                bg-black/20
                p-4
                text-lg
                font-black
                leading-7
                text-white
              "
            >
              {output.value || "Your result will appear here."}
            </div>

            <p
              className="
                mt-5
                text-xs
                font-black
                uppercase
                tracking-[0.15em]
                text-gray-600
              "
            >
              {output.secondaryTitle}
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-400
              "
            >
              {output.secondaryValue}
            </p>

            <div
              className="
                mt-5
                flex
                flex-wrap
                gap-2
              "
            >
              <button
                type="button"
                onClick={copyUtilityOutput}
                className="
                  rounded-xl
                  bg-emerald-400
                  px-4
                  py-2.5
                  text-sm
                  font-black
                  text-black
                  transition
                  hover:scale-[1.02]
                "
              >
                {copied ? "✓ Copied" : "Copy Result"}
              </button>

              <button
                type="button"
                onClick={() => setText("")}
                className="
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-gray-300
                  transition
                  hover:bg-white/[0.06]
                "
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </MegaSectionFrame>
  );
}

function MegaPromptBuilder() {
  const roles = [
    "Teacher",
    "Creator",
    "Developer",
    "Designer",
    "Researcher",
    "Business Coach",
  ];

  const tones = [
    "Simple",
    "Professional",
    "Friendly",
    "Creative",
    "Concise",
  ];

  const formats = [
    "Step by step",
    "Checklist",
    "Table",
    "Action plan",
    "Example first",
  ];

  const [role, setRole] = useState("Teacher");
  const [tone, setTone] = useState("Simple");
  const [format, setFormat] = useState("Step by step");
  const [task, setTask] = useState("");
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    const cleanTask = task.trim() || "Explain the topic I provide";

    return [
      `ROLE: Act as a ${role}.`,
      `TASK: ${cleanTask}.`,
      `TONE: Use a ${tone.toLowerCase()} tone.`,
      `FORMAT: Respond as a ${format.toLowerCase()}.`,
      "QUALITY: Give a practical example, avoid unnecessary jargon, and end with one clear next action.",
    ].join("\n\n");
  }, [role, tone, format, task]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <MegaSectionFrame
      id="prompt-builder"
      scene="mh-scene-prompt"
    >
      <MegaSectionHeader
        eyebrow="✨ Smart Prompt Builder"
        title="Build a clean prompt without memorizing prompt formulas."
        description="Choose a role, tone and output style, then describe the task. The builder creates a reusable prompt you can copy into any AI assistant."
      />

      <div
        className="
          mh-reveal
          grid
          gap-5
          lg:grid-cols-[.9fr_1.1fr]
        "
      >
        <div
          className="
            rounded-[30px]
            border
            border-pink-300/10
            bg-black/25
            p-6
            backdrop-blur-xl
          "
        >
          <PromptChoiceGroup
            label="1. Choose a role"
            items={roles}
            value={role}
            onChange={setRole}
          />

          <PromptChoiceGroup
            label="2. Choose a tone"
            items={tones}
            value={tone}
            onChange={setTone}
          />

          <PromptChoiceGroup
            label="3. Choose an output style"
            items={formats}
            value={format}
            onChange={setFormat}
          />

          <label
            className="
              mt-6
              block
              text-xs
              font-black
              uppercase
              tracking-[0.16em]
              text-pink-200
            "
          >
            4. Describe the task
          </label>

          <textarea
            value={task}
            onChange={(event) => setTask(event.target.value)}
            placeholder="Example: Teach me machine learning from zero using Tamil-friendly examples"
            className="
              mt-3
              min-h-[150px]
              w-full
              resize-none
              rounded-2xl
              border
              border-white/[0.08]
              bg-[#120912]
              p-4
              text-sm
              leading-7
              text-white
              outline-none
              placeholder:text-gray-700
              focus:border-pink-300/30
            "
          />
        </div>

        <div
          className="
            rounded-[30px]
            border
            border-purple-300/10
            bg-gradient-to-br
            from-purple-300/[0.06]
            to-transparent
            p-6
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-purple-200
                "
              >
                Generated Prompt
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Reusable across AI assistants
              </p>
            </div>

            <button
              type="button"
              onClick={copyPrompt}
              className="
                rounded-xl
                bg-white
                px-4
                py-2.5
                text-sm
                font-black
                text-black
                transition
                hover:scale-[1.02]
              "
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <pre
            className="
              mt-5
              whitespace-pre-wrap
              break-words
              rounded-2xl
              border
              border-white/[0.06]
              bg-black/25
              p-5
              font-sans
              text-sm
              leading-7
              text-gray-300
            "
          >
            {prompt}
          </pre>

          <Link
            to="/prompts"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              text-sm
              font-black
              text-pink-300
            "
          >
            Explore ready-made prompts →
          </Link>
        </div>
      </div>
    </MegaSectionFrame>
  );
}

function PromptChoiceGroup({
  label,
  items,
  value,
  onChange,
}) {
  return (
    <div
      className="
        mt-5
        first:mt-0
      "
    >
      <p
        className="
          text-xs
          font-black
          uppercase
          tracking-[0.16em]
          text-pink-200
        "
      >
        {label}
      </p>

      <div
        className="
          mt-3
          flex
          flex-wrap
          gap-2
        "
      >
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`
              rounded-xl
              border
              px-3
              py-2
              text-xs
              font-bold
              transition
              ${
                value === item
                  ? "border-pink-300/30 bg-pink-300/[0.10] text-pink-100"
                  : "border-white/[0.07] bg-white/[0.03] text-gray-500 hover:text-white"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function MegaResourceGrid({
  items,
  badge,
}) {
  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {items.map((item, index) => (
        <MegaRouteCard
          key={item.title}
          item={item}
          badge={badge}
          index={index}
        />
      ))}
    </div>
  );
}

function MegaCreatorLaunchpad() {
  return (
    <MegaSectionFrame
      id="creator-launchpad"
      scene="mh-scene-creator"
    >
      <MegaSectionHeader
        eyebrow="🎥 Creator Launchpad"
        title="Everything a modern creator needs, organized by the job."
        description="Jump directly into channel growth, editing, design, audio, thumbnails and production resources without repeating the same cards in multiple places."
      />

      <MegaResourceGrid
        items={MEGA_CREATOR_RESOURCES}
        badge="Creator"
      />
    </MegaSectionFrame>
  );
}

function MegaTechnologyNavigator() {
  return (
    <MegaSectionFrame
      id="technology-navigator"
      scene="mh-scene-tech"
    >
      <MegaSectionHeader
        eyebrow="💻 Technology Navigator"
        title="Solve everyday device problems and grow technical skills."
        description="Use focused paths for Android, Windows, browsers, laptops, cybersecurity and programming instead of hunting through unrelated content."
      />

      <MegaResourceGrid
        items={MEGA_TECH_RESOURCES}
        badge="Technology"
      />
    </MegaSectionFrame>
  );
}

function MegaProductVault() {
  return (
    <MegaSectionFrame
      id="resource-vault"
      scene="mh-scene-products"
    >
      <MegaSectionHeader
        eyebrow="📦 Digital Resource Vault"
        title="Reusable assets that help you finish work faster."
        description="Browse each product family once: free resources, premium packs, ebooks, UI assets, code, editing packs and design materials."
      />

      <MegaResourceGrid
        items={MEGA_PRODUCT_RESOURCES}
        badge="Resource"
      />
    </MegaSectionFrame>
  );
}

function MegaAIPlayground() {
  return (
    <MegaSectionFrame
      id="ai-playground"
      scene="mh-scene-playground"
    >
      <MegaSectionHeader
        eyebrow="🧪 AI Playground"
        title="Explore the building blocks behind AI products."
        description="Move beyond chatbots and discover apps, visual AI, video AI, models, datasets, code templates and futuristic assets."
      />

      <MegaResourceGrid
        items={MEGA_PLAYGROUND_RESOURCES}
        badge="Explore"
      />
    </MegaSectionFrame>
  );
}

function MegaIdeaLab() {
  const domains = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          MEGA_PROJECT_IDEAS.map((item) => item.domain)
        )
      ),
    ],
    []
  );

  const [domain, setDomain] = useState("All");
  const [activeIdea, setActiveIdea] = useState(MEGA_PROJECT_IDEAS[0]);

  const filtered = useMemo(() => {
    if (domain === "All") {
      return MEGA_PROJECT_IDEAS;
    }

    return MEGA_PROJECT_IDEAS.filter(
      (item) => item.domain === domain
    );
  }, [domain]);

  function generateIdea() {
    const pool = filtered.length > 0
      ? filtered
      : MEGA_PROJECT_IDEAS;

    const index = Math.floor(Math.random() * pool.length);
    setActiveIdea(pool[index]);
  }

  useEffect(() => {
    if (
      domain !== "All" &&
      activeIdea.domain !== domain
    ) {
      const first = MEGA_PROJECT_IDEAS.find(
        (item) => item.domain === domain
      );

      if (first) {
        setActiveIdea(first);
      }
    }
  }, [domain, activeIdea.domain]);

  return (
    <MegaSectionFrame
      id="idea-lab"
      scene="mh-scene-ideas"
    >
      <MegaSectionHeader
        eyebrow="💡 Project Idea Lab"
        title="Turn learning into something you can actually build."
        description="Pick a direction and generate a practical mini-project. The goal is to create, test and learn — not only consume content."
      />

      <div
        className="
          mh-reveal
          grid
          gap-5
          lg:grid-cols-[.75fr_1.25fr]
        "
      >
        <div
          className="
            rounded-[28px]
            border
            border-fuchsia-300/10
            bg-black/20
            p-5
          "
        >
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.16em]
              text-fuchsia-200
            "
          >
            Choose a direction
          </p>

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-2
            "
          >
            {domains.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDomain(item)}
                className={`
                  rounded-xl
                  border
                  px-3
                  py-2
                  text-xs
                  font-black
                  transition
                  ${
                    domain === item
                      ? "border-fuchsia-300/30 bg-fuchsia-300/[0.10] text-fuchsia-100"
                      : "border-white/[0.07] bg-white/[0.03] text-gray-500 hover:text-white"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={generateIdea}
            className="
              mt-6
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-fuchsia-400
              to-purple-400
              px-5
              py-3.5
              text-sm
              font-black
              text-black
              transition
              hover:scale-[1.01]
            "
          >
            🎲 Generate Another Idea
          </button>
        </div>

        <div
          className="
            mh-card
            rounded-[30px]
            border
            border-fuchsia-300/15
            bg-gradient-to-br
            from-fuchsia-300/[0.08]
            via-purple-300/[0.04]
            to-transparent
            p-7
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <div
              className="
                mh-icon-float
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-black/20
                text-3xl
              "
            >
              {activeIdea.icon}
            </div>

            <div>
              <span
                className="
                  rounded-full
                  border
                  border-fuchsia-300/15
                  bg-fuchsia-300/[0.06]
                  px-2.5
                  py-1
                  text-[10px]
                  font-black
                  uppercase
                  tracking-wider
                  text-fuchsia-200
                "
              >
                {activeIdea.domain}
              </span>

              <h3
                className="
                  mt-3
                  text-2xl
                  font-black
                  text-white
                  sm:text-3xl
                "
              >
                {activeIdea.title}
              </h3>
            </div>
          </div>

          <p
            className="
              mt-5
              max-w-3xl
              text-sm
              leading-7
              text-gray-400
              sm:text-base
            "
          >
            {activeIdea.description}
          </p>

          <Link
            to={activeIdea.route}
            className="
              mt-6
              inline-flex
              rounded-xl
              border
              border-white/10
              bg-white/[0.05]
              px-4
              py-2.5
              text-sm
              font-black
              text-white
              transition
              hover:border-fuchsia-300/25
              hover:bg-fuchsia-300/[0.07]
            "
          >
            Start Building →
          </Link>
        </div>
      </div>
    </MegaSectionFrame>
  );
}

function MegaFocusTimer() {
  const FOCUS_SECONDS = 25 * 60;
  const BREAK_SECONDS = 5 * 60;

  const [timerMode, setTimerMode] = useState("focus");
  const [seconds, setSeconds] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(() => {
    try {
      return Number(localStorage.getItem("aft_home_focus_sessions")) || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);

          if (timerMode === "focus") {
            setSessions((value) => {
              const next = value + 1;

              try {
                localStorage.setItem(
                  "aft_home_focus_sessions",
                  String(next)
                );
              } catch {
                // Optional local progress only.
              }

              return next;
            });
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [running, timerMode]);

  function chooseTimerMode(nextMode) {
    setRunning(false);
    setTimerMode(nextMode);
    setSeconds(
      nextMode === "focus"
        ? FOCUS_SECONDS
        : BREAK_SECONDS
    );
  }

  function resetTimer() {
    setRunning(false);
    setSeconds(
      timerMode === "focus"
        ? FOCUS_SECONDS
        : BREAK_SECONDS
    );
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const total = timerMode === "focus"
    ? FOCUS_SECONDS
    : BREAK_SECONDS;
  const progress = Math.max(
    0,
    Math.min(100, ((total - seconds) / total) * 100)
  );

  return (
    <MegaSectionFrame
      id="focus-zone"
      scene="mh-scene-focus"
    >
      <MegaSectionHeader
        eyebrow="⏳ Focus Zone"
        title="Turn intention into focused work."
        description="Use the built-in timer for a short learning or creation sprint. Progress stays simple and local to your browser."
      />

      <div
        className="
          mh-reveal
          grid
          gap-5
          lg:grid-cols-[.8fr_1.2fr]
        "
      >
        <div
          className="
            rounded-[30px]
            border
            border-white/[0.08]
            bg-black/25
            p-7
            text-center
          "
        >
          <div
            className="
              flex
              justify-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={() => chooseTimerMode("focus")}
              className={`
                rounded-xl
                border
                px-4
                py-2
                text-xs
                font-black
                ${
                  timerMode === "focus"
                    ? "border-cyan-300/30 bg-cyan-300/[0.10] text-cyan-200"
                    : "border-white/[0.07] bg-white/[0.03] text-gray-500"
                }
              `}
            >
              Focus 25
            </button>

            <button
              type="button"
              onClick={() => chooseTimerMode("break")}
              className={`
                rounded-xl
                border
                px-4
                py-2
                text-xs
                font-black
                ${
                  timerMode === "break"
                    ? "border-green-300/30 bg-green-300/[0.10] text-green-200"
                    : "border-white/[0.07] bg-white/[0.03] text-gray-500"
                }
              `}
            >
              Break 5
            </button>
          </div>

          <div
            className="
              mt-8
              text-6xl
              font-black
              tracking-tight
              text-white
              sm:text-7xl
            "
          >
            {String(minutes).padStart(2, "0")}:{String(remainingSeconds).padStart(2, "0")}
          </div>

          <div
            className="
              mt-7
              h-2
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
                to-purple-400
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div
            className="
              mt-7
              flex
              justify-center
              gap-3
            "
          >
            <button
              type="button"
              onClick={() => setRunning((value) => !value)}
              disabled={seconds === 0}
              className="
                rounded-xl
                bg-white
                px-6
                py-3
                text-sm
                font-black
                text-black
                transition
                enabled:hover:scale-[1.02]
                disabled:opacity-40
              "
            >
              {running ? "Pause" : "Start"}
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.03]
                px-6
                py-3
                text-sm
                font-bold
                text-gray-300
              "
            >
              Reset
            </button>
          </div>
        </div>

        <div
          className="
            rounded-[30px]
            border
            border-white/[0.08]
            bg-white/[0.025]
            p-7
          "
        >
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.18em]
              text-cyan-200
            "
          >
            Focus guidance
          </p>

          <h3
            className="
              mt-3
              text-2xl
              font-black
              text-white
            "
          >
            One session. One clear outcome.
          </h3>

          <div
            className="
              mt-5
              grid
              gap-3
              sm:grid-cols-2
            "
          >
            {[
              "Close unrelated tabs",
              "Choose one small task",
              "Work without switching tools",
              "Write the next action before stopping",
            ].map((item, index) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-black/15
                  p-4
                "
              >
                <div
                  className="
                    text-xs
                    font-black
                    text-gray-600
                  "
                >
                  0{index + 1}
                </div>

                <p
                  className="
                    mt-2
                    text-sm
                    font-bold
                    text-gray-300
                  "
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-cyan-300/10
              bg-cyan-300/[0.04]
              p-4
            "
          >
            <span
              className="
                text-2xl
                font-black
                text-white
              "
            >
              {sessions}
            </span>

            <span
              className="
                ml-2
                text-sm
                text-gray-500
              "
            >
              focus sessions completed on this browser
            </span>
          </div>
        </div>
      </div>
    </MegaSectionFrame>
  );
}

function MegaWorkflowBlueprints() {
  return (
    <MegaSectionFrame
      id="workflow-blueprints"
      scene="mh-scene-workflow"
    >
      <MegaSectionHeader
        eyebrow="🧭 Workflow Blueprints"
        title="Repeatable systems beat random tool-hopping."
        description="Use these compact workflows when you want a reliable sequence for research, study, content creation, coding or automation."
      />

      <div
        className="
          grid
          gap-4
          lg:grid-cols-2
          xl:grid-cols-3
        "
      >
        {MEGA_WORKFLOW_BLUEPRINTS.map((item, index) => (
          <article
            key={item.title}
            className="
              mh-card
              mh-reveal
              rounded-[28px]
              border
              border-orange-300/10
              bg-black/20
              p-6
              hover:border-orange-300/25
            "
            style={{
              transitionDelay: `${index * 45}ms`,
            }}
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  mh-icon-float
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-orange-300/15
                  bg-orange-300/[0.06]
                  text-2xl
                "
              >
                {item.icon}
              </div>

              <div>
                <h3
                  className="
                    text-lg
                    font-black
                    text-white
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-orange-200/70
                  "
                >
                  {item.description}
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                space-y-3
              "
            >
              {item.steps.map((step, stepIndex) => (
                <div
                  key={step}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.05]
                    bg-white/[0.02]
                    px-3
                    py-3
                  "
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-orange-300/[0.08]
                      text-[10px]
                      font-black
                      text-orange-200
                    "
                  >
                    {stepIndex + 1}
                  </span>

                  <span
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </MegaSectionFrame>
  );
}

function MegaStackFinder() {
  const personas = {
    Student: [
      "NotebookLM",
      "ChatGPT",
      "Perplexity",
      "Canva AI",
    ],
    Creator: [
      "ChatGPT",
      "Canva AI",
      "Runway",
      "ElevenLabs",
    ],
    Developer: [
      "Cursor",
      "Claude",
      "ChatGPT",
      "n8n",
    ],
    Freelancer: [
      "ChatGPT",
      "Perplexity",
      "Canva AI",
      "n8n",
    ],
    Business: [
      "ChatGPT",
      "Claude",
      "Perplexity",
      "n8n",
    ],
    Beginner: [
      "ChatGPT",
      "Gemini",
      "Canva AI",
      "NotebookLM",
    ],
  };

  const [persona, setPersona] = useState("Beginner");
  const stack = personas[persona];

  return (
    <MegaSectionFrame
      id="stack-finder"
      scene="mh-scene-stack"
    >
      <MegaSectionHeader
        eyebrow="🧩 AI Stack Finder"
        title="Pick fewer tools — but pick the right ones."
        description="Choose the type of work you do and get a small starter stack. This keeps subscriptions and tool switching under control."
      />

      <div
        className="
          mh-reveal
          rounded-[30px]
          border
          border-purple-300/10
          bg-black/20
          p-6
        "
      >
        <div
          className="
            flex
            flex-wrap
            gap-2
          "
        >
          {Object.keys(personas).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPersona(item)}
              className={`
                rounded-xl
                border
                px-4
                py-2.5
                text-sm
                font-black
                transition
                ${
                  persona === item
                    ? "border-purple-300/30 bg-purple-300/[0.10] text-purple-100"
                    : "border-white/[0.07] bg-white/[0.03] text-gray-500 hover:text-white"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        <div
          className="
            mt-6
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {stack.map((tool, index) => (
            <div
              key={tool}
              className="
                mh-card
                rounded-2xl
                border
                border-purple-300/10
                bg-purple-300/[0.035]
                p-5
              "
            >
              <div
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-purple-300
                "
              >
                Tool {index + 1}
              </div>

              <h3
                className="
                  mt-3
                  text-xl
                  font-black
                  text-white
                "
              >
                {tool}
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                Part of the recommended {persona.toLowerCase()} starter stack.
              </p>
            </div>
          ))}
        </div>
      </div>
    </MegaSectionFrame>
  );
}

function MegaCompareMatrix() {
  return (
    <MegaSectionFrame
      id="compare-by-task"
      scene="mh-scene-compare"
    >
      <MegaSectionHeader
        eyebrow="⚖️ Compare by Task"
        title="Choose tools based on the job, not the hype."
        description="A quick decision matrix for common workflows. Treat this as a starting point and test the tools with your own real tasks."
      />

      <div
        className="
          mh-reveal
          overflow-hidden
          rounded-[30px]
          border
          border-green-300/10
          bg-black/20
        "
      >
        <div
          className="
            hidden
            grid-cols-[1.15fr_.75fr_.75fr_1.5fr]
            gap-4
            border-b
            border-white/[0.06]
            bg-white/[0.03]
            px-5
            py-4
            text-xs
            font-black
            uppercase
            tracking-[0.14em]
            text-green-200
            lg:grid
          "
        >
          <div>Task</div>
          <div>First Try</div>
          <div>Alternative</div>
          <div>Practical Note</div>
        </div>

        <div>
          {MEGA_COMPARE_ROWS.map((row, index) => (
            <div
              key={row.task}
              className={`
                grid
                gap-3
                px-5
                py-5
                lg:grid-cols-[1.15fr_.75fr_.75fr_1.5fr]
                lg:items-center
                ${
                  index < MEGA_COMPARE_ROWS.length - 1
                    ? "border-b border-white/[0.05]"
                    : ""
                }
              `}
            >
              <div
                className="
                  font-black
                  text-white
                "
              >
                {row.task}
              </div>

              <div
                className="
                  text-sm
                  font-bold
                  text-green-300
                "
              >
                {row.first}
              </div>

              <div
                className="
                  text-sm
                  font-bold
                  text-cyan-300
                "
              >
                {row.second}
              </div>

              <div
                className="
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                {row.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MegaSectionFrame>
  );
}

function MegaGrowthHub() {
  return (
    <MegaSectionFrame
      id="growth-hub"
      scene="mh-scene-growth"
    >
      <MegaSectionHeader
        eyebrow="🌱 Platform Growth Hub"
        title="Learn, connect, showcase and level up."
        description="Use these platform areas when you are ready to move beyond learning into community, visibility, support and premium resources."
      />

      <MegaResourceGrid
        items={MEGA_GROWTH_LINKS}
        badge="Next Step"
      />
    </MegaSectionFrame>
  );
}

function MegaPowerSkills() {
  return (
    <MegaSectionFrame
      id="power-skills"
      scene="mh-scene-skills"
    >
      <MegaSectionHeader
        eyebrow="🧠 AI Power Skills"
        title="The habits that make every AI tool more useful."
        description="Tools change quickly. These durable habits help you get better results even when the app, model or interface changes."
      />

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {MEGA_POWER_SKILLS.map((item, index) => (
          <article
            key={item.title}
            className="
              mh-card
              mh-reveal
              rounded-[24px]
              border
              border-pink-300/10
              bg-black/20
              p-5
              hover:border-pink-300/25
            "
            style={{
              transitionDelay: `${index * 40}ms`,
            }}
          >
            <div
              className="
                mh-icon-float
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-pink-300/15
                bg-pink-300/[0.06]
                text-2xl
              "
            >
              {item.icon}
            </div>

            <h3
              className="
                mt-4
                text-lg
                font-black
                text-white
              "
            >
              {item.title}
            </h3>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-gray-500
              "
            >
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </MegaSectionFrame>
  );
}

function MegaHomeExperience() {
  return (
    <>
      <MegaGoalNavigator />
      <MegaTrendingAISection />
      <MegaUtilityStudio />
      <MegaPromptBuilder />
      <MegaCreatorLaunchpad />
      <MegaTechnologyNavigator />
      <MegaProductVault />
      <MegaAIPlayground />
      <MegaIdeaLab />
      <MegaFocusTimer />
      <MegaWorkflowBlueprints />
      <MegaStackFinder />
      <MegaCompareMatrix />
      <MegaGrowthHub />
      <MegaPowerSkills />
    </>
  );
}


/* =========================================================
   HOME
========================================================= */

function Home() {
  const [
    userName,
    setUserName,
  ] = useState("");

  const [
    loggedIn,
    setLoggedIn,
  ] = useState(false);

  const [
    favorites,
    setFavorites,
  ] = useState([]);

  const [
    recentTools,
    setRecentTools,
  ] = useState([]);

  const [
    savedPrompts,
    setSavedPrompts,
  ] = useState([]);

  const [
    readNews,
    setReadNews,
  ] = useState([]);

  const [
    completedCourses,
    setCompletedCourses,
  ] = useState([]);

  const [
    toolsExplored,
    setToolsExplored,
  ] = useState(0);

  const [
    courseProgressData,
    setCourseProgressData,
  ] = useState({});

  const [
    quizData,
    setQuizData,
  ] = useState({});

  const [
    streak,
    setStreak,
  ] = useState(1);

  /* =========================================================
     LOAD USER
  ========================================================= */

  const loadUser =
    useCallback(async () => {
      try {
        const {
          data,
        } =
          await supabase.auth
            .getUser();

        const user =
          data?.user;

        if (!user) {
          setLoggedIn(false);
          setUserName("");

          return;
        }

        setLoggedIn(true);

        let name =
          user.user_metadata
            ?.name ||
          user.user_metadata
            ?.full_name ||
          "";

        try {
          const {
            data: profile,
          } =
            await supabase
              .from(
                "profiles"
              )
              .select(
                "name"
              )
              .eq(
                "id",
                user.id
              )
              .maybeSingle();

          if (
            profile?.name
          ) {
            name =
              profile.name;
          }
        } catch {
          // Profile is optional.
        }

        if (!name) {
          name =
            user.email
              ?.split("@")[0] ||
            "Explorer";
        }

        setUserName(name);

      } catch {
        setLoggedIn(false);
      }
    }, []);

  /* =========================================================
     LOAD PERSONAL DATA
  ========================================================= */

  const loadPersonalData =
    useCallback(() => {
      try {
        const favoriteIds =
          getFavoriteTools() ||
          [];

        const favoriteItems =
          favoriteIds
            .map(
              (id) =>
                toolLibrary.find(
                  (tool) =>
                    String(
                      tool.id
                    ) ===
                    String(id)
                )
            )
            .filter(Boolean);

        setFavorites(
          favoriteItems
        );

        const rawRecent =
          getRecentlyVisitedTools() ||
          [];

        const normalizedRecent =
          rawRecent
            .map(
              normalizeRecentTool
            )
            .filter(Boolean)
            .filter(
              (
                item,
                index,
                array
              ) =>
                array.findIndex(
                  (other) =>
                    String(
                      other.id
                    ) ===
                    String(
                      item.id
                    )
                ) === index
            );

        setRecentTools(
          normalizedRecent
        );

        const promptIds =
          getSavedPrompts() ||
          [];

        setSavedPrompts(
          promptIds
        );

        const newsIds =
          getNewsRead() ||
          [];

        setReadNews(
          newsIds
        );

        const courses =
          getCompletedCourses() ||
          [];

        setCompletedCourses(
          courses
        );

        setToolsExplored(
          Number(
            getToolsExploredCount()
          ) || 0
        );

        setCourseProgressData(
          readObject(
            "aiCourseProgress"
          )
        );

        setQuizData(
          readObject(
            "aiCourseQuizResults"
          )
        );

        const gameData =
          readObject(
            "aft_gamification",
            {
              streak: 1,
            }
          );

        setStreak(
          Number(
            gameData.streak
          ) || 1
        );

      } catch (
        error
      ) {
        console.error(
          "Home personalization error:",
          error
        );
      }
    }, []);

  /* =========================================================
     EFFECT
  ========================================================= */

  useEffect(() => {
    loadUser();
    loadPersonalData();

    const handleUpdate =
      () => {
        loadPersonalData();
      };

    window.addEventListener(
      "dashboard-data-updated",
      handleUpdate
    );

    window.addEventListener(
      "ai-future-data-change",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    window.addEventListener(
      "focus",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "dashboard-data-updated",
        handleUpdate
      );

      window.removeEventListener(
        "ai-future-data-change",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );

      window.removeEventListener(
        "focus",
        handleUpdate
      );
    };
  }, [
    loadUser,
    loadPersonalData,
  ]);

  /* =========================================================
     COURSE PROGRESS
  ========================================================= */

  const courseProgress =
    useMemo(() => {
      return courseLibrary.map(
        (course) => {
          const completedLessons =
            Array.isArray(
              courseProgressData?.[
                course.id
              ]?.completedLessons
            )
              ? courseProgressData[
                  course.id
                ]
                  .completedLessons
              : [];

          const percentage =
            Math.round(
              (
                Math.min(
                  completedLessons.length,
                  course.lessons
                ) /
                course.lessons
              ) *
                100
            );

          const quiz =
            quizData?.[
              course.id
            ];

          const quizPassed =
            quiz?.passed === true;

          const completed =
            completedCourses.some(
              (id) =>
                String(id) ===
                String(
                  course.id
                )
            ) ||
            (
              percentage ===
                100 &&
              quizPassed
            );

          return {
            ...course,

            completedLessons:
              completedLessons.length,

            percentage,
            quizPassed,
            completed,
          };
        }
      );
    }, [
      courseProgressData,
      quizData,
      completedCourses,
    ]);

  /* =========================================================
     ACTIVE COURSES
  ========================================================= */

  const activeCourses =
    useMemo(() => {
      const started =
        courseProgress.filter(
          (course) =>
            course.percentage >
              0 &&
            !course.completed
        );

      if (
        started.length > 0
      ) {
        return started.slice(
          0,
          3
        );
      }

      return courseProgress
        .filter(
          (course) =>
            !course.completed
        )
        .slice(
          0,
          3
        );
    }, [courseProgress]);

  /* =========================================================
     TOTAL LESSONS
  ========================================================= */

  const totalCompletedLessons =
    useMemo(() => {
      return courseProgress.reduce(
        (
          total,
          course
        ) =>
          total +
          course.completedLessons,
        0
      );
    }, [courseProgress]);

  /* =========================================================
     XP
  ========================================================= */

  const totalXP =
    useMemo(() => {
      return (
        toolsExplored *
          20 +
        favorites.length *
          10 +
        savedPrompts.length *
          25 +
        readNews.length *
          15 +
        totalCompletedLessons *
          40 +
        completedCourses.length *
          200 +
        streak * 10
      );
    }, [
      toolsExplored,
      favorites,
      savedPrompts,
      readNews,
      totalCompletedLessons,
      completedCourses,
      streak,
    ]);

  const levelInfo =
    useMemo(
      () =>
        getLevelInfo(
          totalXP
        ),
      [totalXP]
    );

  /* =========================================================
     SAVED PROMPT DETAILS
  ========================================================= */

  const savedPromptItems =
    useMemo(() => {
      return savedPrompts
        .map(
          (id) =>
            promptLibrary.find(
              (prompt) =>
                String(
                  prompt.id
                ) ===
                String(id)
            )
        )
        .filter(Boolean)
        .slice(
          0,
          3
        );
    }, [savedPrompts]);

  /* =========================================================
     READ NEWS DETAILS
  ========================================================= */

  const readNewsItems =
    useMemo(() => {
      return readNews
        .map(
          (id) =>
            newsLibrary.find(
              (news) =>
                String(
                  news.id
                ) ===
                String(id)
            )
        )
        .filter(Boolean)
        .slice(
          0,
          3
        );
    }, [readNews]);

  /* =========================================================
     RECOMMENDATIONS
  ========================================================= */

  const recommendations =
    useMemo(() => {
      const usedIds =
        new Set([
          ...favorites.map(
            (item) =>
              String(
                item.id
              )
          ),

          ...recentTools.map(
            (item) =>
              String(
                item.id
              )
          ),
        ]);

      const freshTools =
        toolLibrary.filter(
          (tool) =>
            !usedIds.has(
              String(
                tool.id
              )
            )
        );

      if (
        freshTools.length >= 3
      ) {
        return freshTools.slice(
          0,
          3
        );
      }

      return toolLibrary.slice(
        0,
        3
      );
    }, [
      favorites,
      recentTools,
    ]);

  /* =========================================================
     HAS PERSONAL ACTIVITY
  ========================================================= */

  const hasPersonalActivity =
    favorites.length > 0 ||
    recentTools.length > 0 ||
    savedPrompts.length > 0 ||
    readNews.length > 0 ||
    totalCompletedLessons > 0;

  return (
    <main className="home-page">

      <MegaHomeMotionLayer />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-section home-hero-section mh-scene-hero">
        <Hero />
      </section>

      {/* =====================================================
          VISUAL LEARNING LIBRARY
      ===================================================== */}

      <div className="mh-scene-visual">
        <VisualLibrarySection />
      </div>

      {/* =====================================================
          PERSONALIZED HOME
      ===================================================== */}

      <section className="mh-scene-personal relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute left-[10%] top-0 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[100px]" />

        <div className="pointer-events-none absolute right-[10%] top-[30%] h-72 w-72 rounded-full bg-purple-500/[0.06] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl">

          {/* =================================================
              PERSONALIZED WELCOME
          ================================================= */}

          <div className="relative mb-10 overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#080b16]/80 p-6 shadow-[0_25px_80px_rgba(0,0,0,.25)] backdrop-blur-xl sm:p-8">

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/[0.08] blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-24 left-[20%] h-64 w-64 rounded-full bg-cyan-500/[0.06] blur-[80px]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-center">

              <div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/[0.07] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
                  ✨ For You
                </div>

                <h2 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl">

                  {loggedIn
                    ? `Welcome back, ${
                        userName ||
                        "Explorer"
                      } 👋`
                    : hasPersonalActivity
                      ? "Continue Your AI Journey 🚀"
                      : "Start Your AI Journey 🚀"}

                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">

                  {hasPersonalActivity
                    ? "Your recent tools, saved prompts, learning progress and AI activity are waiting for you."
                    : "Explore AI tools, save useful prompts, learn new skills and build your personalized AI workspace."}

                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <Link
                    to="/dashboard"
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
                  >
                    📊 Open Dashboard
                  </Link>

                  <Link
                    to="/ai-tools"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
                  >
                    🤖 Explore AI Tools
                  </Link>

                  <Link
                    to="/next-gen"
                    className="group relative overflow-hidden rounded-xl border border-purple-400/30 bg-gradient-to-r from-purple-500/15 via-violet-500/15 to-cyan-500/15 px-5 py-3 text-sm font-black text-white shadow-[0_0_25px_rgba(168,85,247,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚀 Next Gen Hub

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>

                  <Link
                    to="/visual-library"
                    className="group rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-5 py-3 text-sm font-black text-cyan-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/[0.10]"
                  >
                    <span className="flex items-center gap-2">
                      📚 Visual Library

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>

                </div>

              </div>

              {/* JOURNEY CARD */}

              <div className="rounded-3xl border border-purple-400/15 bg-black/25 p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Your AI Journey
                    </p>

                    <h3 className="mt-1 text-xl font-black text-white">
                      {levelInfo.icon}{" "}
                      {levelInfo.rank}
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/[0.08] text-xl font-black text-purple-300">
                    L{levelInfo.level}
                  </div>

                </div>

                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between text-xs">

                    <span className="text-gray-500">
                      {
                        levelInfo.currentXP
                      }{" "}
                      /{" "}
                      {
                        levelInfo.xpPerLevel
                      }{" "}
                      XP
                    </span>

                    <span className="font-bold text-cyan-300">
                      {
                        levelInfo.progress
                      }
                      %
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-700"
                      style={{
                        width: `${levelInfo.progress}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-orange-400/15 bg-orange-400/[0.05] p-3">

                    <p className="text-lg">
                      🔥
                    </p>

                    <p className="mt-1 text-xl font-black text-orange-300">
                      {streak}
                    </p>

                    <p className="text-[11px] text-gray-600">
                      Day Streak
                    </p>

                  </div>

                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-3">

                    <p className="text-lg">
                      ⚡
                    </p>

                    <p className="mt-1 text-xl font-black text-cyan-300">
                      {totalXP}
                    </p>

                    <p className="text-[11px] text-gray-600">
                      Total XP
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              MINI STATS
          ================================================= */}

          <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4">

            <div className="rounded-2xl border border-pink-400/15 bg-pink-400/[0.04] p-4 sm:p-5">

              <div className="text-2xl">
                ❤️
              </div>

              <p className="mt-3 text-2xl font-black text-white">
                {favorites.length}
              </p>

              <p className="text-xs text-gray-500">
                Favorite Tools
              </p>

            </div>

            <div className="rounded-2xl border border-purple-400/15 bg-purple-400/[0.04] p-4 sm:p-5">

              <div className="text-2xl">
                ✨
              </div>

              <p className="mt-3 text-2xl font-black text-white">
                {
                  savedPrompts.length
                }
              </p>

              <p className="text-xs text-gray-500">
                Saved Prompts
              </p>

            </div>

            <div className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.04] p-4 sm:p-5">

              <div className="text-2xl">
                📰
              </div>

              <p className="mt-3 text-2xl font-black text-white">
                {readNews.length}
              </p>

              <p className="text-xs text-gray-500">
                News Read
              </p>

            </div>

            <div className="rounded-2xl border border-green-400/15 bg-green-400/[0.04] p-4 sm:p-5">

              <div className="text-2xl">
                🎓
              </div>

              <p className="mt-3 text-2xl font-black text-white">
                {
                  completedCourses.length
                }
              </p>

              <p className="text-xs text-gray-500">
                Courses Done
              </p>

            </div>

          </div>

          {/* =================================================
              RECENTLY VISITED
          ================================================= */}

          <div className="mb-14">

            <SectionTitle
              eyebrow="🕘 Continue Exploring"
              title="Recently Visited AI Tools"
              description="Jump back into the AI tools you explored recently."
              action={
                <Link
                  to="/ai-tools"
                  className="text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
                >
                  View all tools →
                </Link>
              }
            />

            {recentTools.length ===
            0 ? (
              <EmptyCard
                icon="🤖"
                title="No recently visited tools"
                description="Explore AI tools and they will automatically appear here."
                link="/ai-tools"
                button="Explore AI Tools →"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {recentTools
                  .slice(
                    0,
                    3
                  )
                  .map(
                    (tool) => (
                      <Link
                        key={
                          tool.id
                        }
                        to={
                          tool.path
                        }
                        className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-cyan-400/[0.04]"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-black/20 text-3xl">
                            {
                              tool.icon
                            }
                          </div>

                          <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] px-3 py-1 text-[10px] font-bold text-cyan-300">
                            {
                              tool.category
                            }
                          </span>

                        </div>

                        <h3 className="mt-5 text-lg font-black text-white">
                          {
                            tool.name
                          }
                        </h3>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                          {
                            tool.description
                          }
                        </p>

                        <div className="mt-5 text-sm font-bold text-cyan-300">
                          Continue →
                        </div>

                      </Link>
                    )
                  )}

              </div>
            )}

          </div>

          {/* =================================================
              CONTINUE LEARNING
          ================================================= */}

          <div className="mb-14">

            <SectionTitle
              eyebrow="🎓 Learning"
              title="Continue Learning"
              description="Continue your AI courses exactly where you stopped."
              action={
                <Link
                  to="/courses"
                  className="text-sm font-bold text-green-300 transition hover:text-green-200"
                >
                  View all courses →
                </Link>
              }
            />

            <div className="grid gap-4 lg:grid-cols-3">

              {activeCourses.map(
                (course) => (
                  <Link
                    key={
                      course.id
                    }
                    to={`/courses/${course.id}`}
                    className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-400/25 hover:bg-green-400/[0.035]"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/15 bg-green-400/[0.05] text-3xl">
                        {
                          course.icon
                        }
                      </div>

                      <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[10px] font-bold text-gray-500">
                        {
                          course.level
                        }
                      </span>

                    </div>

                    <h3 className="mt-5 font-black text-white">
                      {
                        course.title
                      }
                    </h3>

                    <p className="mt-2 text-xs text-gray-600">
                      {
                        course.completedLessons
                      }{" "}
                      /{" "}
                      {
                        course.lessons
                      }{" "}
                      lessons ·{" "}
                      {
                        course.duration
                      }
                    </p>

                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between text-xs">

                        <span className="text-gray-600">
                          Progress
                        </span>

                        <span className="font-bold text-green-300">
                          {
                            course.percentage
                          }
                          %
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-700"
                          style={{
                            width: `${course.percentage}%`,
                          }}
                        />
                      </div>

                    </div>

                    <div className="mt-5 text-sm font-bold text-green-300">
                      {
                        course.percentage >
                        0
                          ? "Continue Course →"
                          : "Start Course →"
                      }
                    </div>

                  </Link>
                )
              )}

            </div>

          </div>

          {/* =================================================
              SAVED PROMPTS + NEWS
          ================================================= */}

          <div className="mb-14 grid gap-6 xl:grid-cols-2">

            {/* SAVED PROMPTS */}

            <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    ✨ My Library
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Saved Prompts
                  </h3>
                </div>

                <Link
                  to="/prompts"
                  className="text-xs font-bold text-purple-300"
                >
                  View all →
                </Link>

              </div>

              {savedPromptItems.length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-7 text-center">

                  <div className="text-3xl">
                    ✨
                  </div>

                  <p className="mt-3 font-bold">
                    No saved prompts
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    Save useful prompts from our AI Prompt Library.
                  </p>

                  <Link
                    to="/prompts"
                    className="mt-4 inline-block text-sm font-bold text-purple-300"
                  >
                    Explore Prompts →
                  </Link>

                </div>
              ) : (
                <div className="space-y-3">

                  {savedPromptItems.map(
                    (prompt) => (
                      <Link
                        to="/prompts"
                        key={
                          prompt.id
                        }
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/15 p-4 transition hover:border-purple-400/20 hover:bg-purple-400/[0.04]"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/[0.05] text-xl">
                          {
                            prompt.icon
                          }
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate font-bold">
                            {
                              prompt.title
                            }
                          </p>

                          <p className="mt-1 truncate text-xs text-gray-600">
                            {
                              prompt.description
                            }
                          </p>

                        </div>

                        <span className="text-purple-300">
                          →
                        </span>

                      </Link>
                    )
                  )}

                </div>
              )}

            </div>

            {/* NEWS HISTORY */}

            <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    📰 Reading History
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    Recently Read News
                  </h3>
                </div>

                <Link
                  to="/ai-news"
                  className="text-xs font-bold text-blue-300"
                >
                  View news →
                </Link>

              </div>

              {readNewsItems.length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-7 text-center">

                  <div className="text-3xl">
                    📰
                  </div>

                  <p className="mt-3 font-bold">
                    No news history
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    Read AI news articles and they will appear here.
                  </p>

                  <Link
                    to="/ai-news"
                    className="mt-4 inline-block text-sm font-bold text-blue-300"
                  >
                    Read AI News →
                  </Link>

                </div>
              ) : (
                <div className="space-y-3">

                  {readNewsItems.map(
                    (news) => (
                      <Link
                        to={`/ai-news/${news.id}`}
                        key={
                          news.id
                        }
                        className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/15 p-4 transition hover:border-blue-400/20 hover:bg-blue-400/[0.04]"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.05] text-xl">
                          {
                            news.icon
                          }
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate font-bold">
                            {
                              news.title
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            {
                              news.category
                            }
                          </p>

                        </div>

                        <span className="text-blue-300">
                          →
                        </span>

                      </Link>
                    )
                  )}

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              FAVORITE TOOLS
          ================================================= */}

          {favorites.length >
            0 && (
            <div className="mb-14">

              <SectionTitle
                eyebrow="❤️ Favorites"
                title="Your Favorite AI Tools"
                description="Quick access to the tools you saved."
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {favorites
                  .slice(
                    0,
                    6
                  )
                  .map(
                    (tool) => (
                      <Link
                        key={
                          tool.id
                        }
                        to={
                          tool.path
                        }
                        className="group flex items-center gap-4 rounded-2xl border border-pink-400/10 bg-pink-400/[0.025] p-4 transition hover:-translate-y-1 hover:border-pink-400/25 hover:bg-pink-400/[0.05]"
                      >

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-400/15 bg-pink-400/[0.05] text-2xl">
                          {
                            tool.icon
                          }
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="font-black text-white">
                            {
                              tool.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            ❤️ Favorite Tool
                          </p>

                        </div>

                        <span className="text-pink-300 transition group-hover:translate-x-1">
                          →
                        </span>

                      </Link>
                    )
                  )}

              </div>

            </div>
          )}

          {/* =================================================
              RECOMMENDED FOR YOU
          ================================================= */}

          <div className="mb-6">

            <SectionTitle
              eyebrow="🧠 Smart Picks"
              title="Recommended For You"
              description="Discover more AI tools based on your exploration."
              action={
                <Link
                  to="/ai-tools"
                  className="text-sm font-bold text-cyan-300"
                >
                  Explore more →
                </Link>
              }
            />

            <div className="grid gap-4 md:grid-cols-3">

              {recommendations.map(
                (tool) => (
                  <Link
                    to={
                      tool.path
                    }
                    key={
                      tool.id
                    }
                    className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-white/[0.035] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25"
                  >

                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/[0.05] blur-2xl" />

                    <div className="relative">

                      <div className="flex items-start justify-between">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] text-3xl">
                          {
                            tool.icon
                          }
                        </div>

                        <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] px-3 py-1 text-[10px] font-bold text-cyan-300">
                          Recommended
                        </span>

                      </div>

                      <h3 className="mt-5 text-lg font-black text-white">
                        {
                          tool.name
                        }
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {
                          tool.description
                        }
                      </p>

                      <div className="mt-5 text-sm font-bold text-cyan-300">
                        Explore Tool →
                      </div>

                    </div>

                  </Link>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ADVANCED HOME EXPERIENCE
      ===================================================== */}

      <MegaHomeExperience />

      {/* =====================================================
          EXISTING AI TOOLS
      ===================================================== */}

      <section className="mh-scene-directory home-section home-tools-section">
        <Tools />
      </section>

      {/* =====================================================
          EXISTING FEATURES
      ===================================================== */}

      <section className="mh-scene-features home-section home-features-section">
        <Features />
      </section>

      {/* =====================================================
          EXISTING AI NEWS
      ===================================================== */}

      <section className="mh-scene-news home-section home-news-section">
        <AINews />
      </section>

    </main>
  );
}

export default Home;