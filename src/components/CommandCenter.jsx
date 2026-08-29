import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

/* =========================================================
   STORAGE
========================================================= */

const RECENT_PATHS_KEY =
  "commandCenterRecent";

const RECENT_SEARCHES_KEY =
  "commandCenterRecentSearches";

/* =========================================================
   STATIC PAGE DATA
========================================================= */

const pageItems = [
  {
    id: "home",
    title: "Home",
    subtitle:
      "AI Future Tamil home page",
    icon: "🏠",
    category: "Main",
    type: "Page",
    path: "/",
    keywords: [
      "home",
      "main",
      "ai future tamil",
    ],
  },

  {
    id: "dashboard",
    title: "Dashboard",
    subtitle:
      "Your favorites, saved content, XP, level and activity",
    icon: "📊",
    category: "Account",
    type: "Page",
    path: "/dashboard",
    keywords: [
      "dashboard",
      "profile",
      "favorites",
      "activity",
      "saved",
      "xp",
      "level",
      "streak",
      "achievements",
    ],
  },

  {
    id: "ai-tools",
    title: "AI Tools",
    subtitle:
      "Discover useful AI tools for chat, image, video and music",
    icon: "🤖",
    category: "AI",
    type: "Page",
    path: "/ai-tools",
    keywords: [
      "ai",
      "tools",
      "chat",
      "image",
      "video",
      "music",
    ],
  },

  {
    id: "ai-news",
    title: "AI News",
    subtitle:
      "Latest artificial intelligence news and updates",
    icon: "📰",
    category: "AI",
    type: "Page",
    path: "/ai-news",
    keywords: [
      "ai news",
      "latest",
      "updates",
      "technology",
      "news",
    ],
  },

  {
    id: "prompts",
    title: "AI Prompts",
    subtitle:
      "Useful prompts for AI tools",
    icon: "✨",
    category: "AI",
    type: "Page",
    path: "/prompts",
    keywords: [
      "prompt",
      "prompts",
      "chatgpt prompts",
      "ai prompts",
    ],
  },

  {
    id: "courses",
    title: "AI Courses",
    subtitle:
      "Learn artificial intelligence step by step",
    icon: "🎓",
    category: "Learning",
    type: "Page",
    path: "/courses",
    keywords: [
      "courses",
      "learn",
      "learning",
      "training",
    ],
  },

  {
    id: "ai-apps",
    title: "AI Apps",
    subtitle:
      "Explore useful AI-powered applications",
    icon: "📱",
    category: "AI",
    type: "Page",
    path: "/ai-apps",
    keywords: [
      "apps",
      "ai apps",
      "applications",
    ],
  },

  {
    id: "ai-images",
    title: "AI Images",
    subtitle:
      "AI image generators and creative resources",
    icon: "🎨",
    category: "AI",
    type: "Page",
    path: "/ai-images",
    keywords: [
      "images",
      "ai image",
      "image generator",
      "art",
    ],
  },

  {
    id: "ai-videos",
    title: "AI Videos",
    subtitle:
      "AI video tools and generation resources",
    icon: "🎬",
    category: "AI",
    type: "Page",
    path: "/ai-videos",
    keywords: [
      "video",
      "ai video",
      "video generator",
    ],
  },

  {
    id: "ai-models",
    title: "AI Models",
    subtitle:
      "Explore artificial intelligence models",
    icon: "🧠",
    category: "AI",
    type: "Page",
    path: "/ai-models",
    keywords: [
      "models",
      "llm",
      "ai models",
    ],
  },

  {
    id: "ai-datasets",
    title: "AI Datasets",
    subtitle:
      "Datasets for AI learning and development",
    icon: "📊",
    category: "AI",
    type: "Page",
    path: "/ai-datasets",
    keywords: [
      "datasets",
      "data",
      "machine learning",
    ],
  },

  {
    id: "source-code",
    title: "AI Source Code",
    subtitle:
      "AI projects and reusable source code",
    icon: "💻",
    category: "AI",
    type: "Page",
    path: "/source-code",
    keywords: [
      "source code",
      "coding",
      "projects",
    ],
  },

  {
    id: "ai-templates",
    title: "AI Templates",
    subtitle:
      "Ready-to-use AI templates",
    icon: "🧩",
    category: "AI",
    type: "Page",
    path: "/ai-templates",
    keywords: [
      "templates",
      "ai templates",
    ],
  },

  {
    id: "wallpapers",
    title: "AI Wallpapers",
    subtitle:
      "Explore AI-generated wallpapers",
    icon: "🌌",
    category: "AI",
    type: "Page",
    path: "/wallpapers",
    keywords: [
      "wallpapers",
      "background",
      "images",
    ],
  },

  /* CREATORS */

  {
    id: "youtube",
    title: "YouTube Resources",
    subtitle:
      "Resources for YouTube creators",
    icon: "▶️",
    category: "Creators",
    type: "Page",
    path: "/creators/youtube",
    keywords: [
      "youtube",
      "creator",
      "channel",
    ],
  },

  {
    id: "instagram",
    title: "Instagram Resources",
    subtitle:
      "Tools and resources for Instagram creators",
    icon: "📸",
    category: "Creators",
    type: "Page",
    path: "/creators/instagram",
    keywords: [
      "instagram",
      "reels",
      "social media",
    ],
  },

  {
    id: "video-editing",
    title: "Video Editing",
    subtitle:
      "Video editing tools, templates and resources",
    icon: "🎞️",
    category: "Creators",
    type: "Page",
    path: "/creators/video-editing",
    keywords: [
      "video editing",
      "editor",
      "editing",
    ],
  },

  {
    id: "thumbnails",
    title: "Thumbnail Packs",
    subtitle:
      "Thumbnail design resources",
    icon: "🖼️",
    category: "Creators",
    type: "Page",
    path: "/creators/thumbnails",
    keywords: [
      "thumbnail",
      "youtube thumbnail",
      "design",
    ],
  },

  {
    id: "music-sfx",
    title: "Music & Sound Effects",
    subtitle:
      "Music and SFX resources for creators",
    icon: "🎵",
    category: "Creators",
    type: "Page",
    path: "/creators/music-sfx",
    keywords: [
      "music",
      "sound effects",
      "sfx",
    ],
  },

  {
    id: "capcut",
    title: "CapCut Templates",
    subtitle:
      "CapCut creator templates and editing resources",
    icon: "✂️",
    category: "Creators",
    type: "Page",
    path: "/creators/capcut",
    keywords: [
      "capcut",
      "template",
      "editing",
    ],
  },

  {
    id: "premiere",
    title: "Premiere Pro",
    subtitle:
      "Premiere Pro templates and editing resources",
    icon: "🎬",
    category: "Creators",
    type: "Page",
    path: "/creators/premiere",
    keywords: [
      "premiere",
      "adobe",
      "video editing",
    ],
  },

  {
    id: "canva",
    title: "Canva Templates",
    subtitle:
      "Canva design templates for creators",
    icon: "🎨",
    category: "Creators",
    type: "Page",
    path: "/creators/canva",
    keywords: [
      "canva",
      "design",
      "templates",
    ],
  },

  {
    id: "motion-graphics",
    title: "Motion Graphics",
    subtitle:
      "Motion graphics resources and assets",
    icon: "💫",
    category: "Creators",
    type: "Page",
    path: "/creators/motion-graphics",
    keywords: [
      "motion graphics",
      "animation",
      "effects",
    ],
  },

  {
    id: "green-screen",
    title: "Green Screen",
    subtitle:
      "Green screen video resources",
    icon: "🟢",
    category: "Creators",
    type: "Page",
    path: "/creators/green-screen",
    keywords: [
      "green screen",
      "video effects",
    ],
  },

  {
    id: "png-packs",
    title: "PNG Packs",
    subtitle:
      "Transparent PNG creator assets",
    icon: "🧷",
    category: "Creators",
    type: "Page",
    path: "/creators/png-packs",
    keywords: [
      "png",
      "assets",
      "graphics",
    ],
  },

  {
    id: "intro-outro",
    title: "Intro & Outro",
    subtitle:
      "Intro and outro video resources",
    icon: "🚀",
    category: "Creators",
    type: "Page",
    path: "/creators/intro-outro",
    keywords: [
      "intro",
      "outro",
      "youtube intro",
    ],
  },

  /* TECHNOLOGY */

  {
    id: "android",
    title: "Android Apps",
    subtitle:
      "Useful Android applications",
    icon: "📱",
    category: "Technology",
    type: "Page",
    path: "/technology/android",
    keywords: [
      "android",
      "apps",
      "mobile",
    ],
  },

  {
    id: "windows",
    title: "Windows Software",
    subtitle:
      "Useful Windows software",
    icon: "🖥️",
    category: "Technology",
    type: "Page",
    path: "/technology/windows",
    keywords: [
      "windows",
      "software",
      "pc",
    ],
  },

  {
    id: "ai-software",
    title: "AI Software",
    subtitle:
      "Artificial intelligence software",
    icon: "🤖",
    category: "Technology",
    type: "Page",
    path: "/technology/ai-software",
    keywords: [
      "ai software",
      "software",
    ],
  },

  {
    id: "mobile-tips",
    title: "Mobile Tips",
    subtitle:
      "Useful smartphone tips and tricks",
    icon: "📲",
    category: "Technology",
    type: "Page",
    path: "/technology/mobile-tips",
    keywords: [
      "mobile",
      "tips",
      "phone",
      "tricks",
    ],
  },

  {
    id: "tech-news",
    title: "Technology News",
    subtitle:
      "Latest technology updates",
    icon: "📰",
    category: "Technology",
    type: "Page",
    path: "/technology/news",
    keywords: [
      "tech news",
      "technology news",
      "latest",
    ],
  },

  {
    id: "chrome",
    title: "Chrome Extensions",
    subtitle:
      "Useful browser extensions",
    icon: "🧩",
    category: "Technology",
    type: "Page",
    path: "/technology/chrome",
    keywords: [
      "chrome",
      "extensions",
      "browser",
    ],
  },

  {
    id: "laptop-tips",
    title: "Laptop Tips",
    subtitle:
      "Laptop productivity and performance tips",
    icon: "💻",
    category: "Technology",
    type: "Page",
    path: "/technology/laptop-tips",
    keywords: [
      "laptop",
      "tips",
      "performance",
    ],
  },

  {
    id: "cyber-security",
    title: "Cyber Security",
    subtitle:
      "Online safety and cyber security resources",
    icon: "🛡️",
    category: "Technology",
    type: "Page",
    path: "/technology/cyber-security",
    keywords: [
      "cyber",
      "security",
      "privacy",
      "online safety",
    ],
  },

  {
    id: "programming",
    title: "Programming",
    subtitle:
      "Programming learning resources",
    icon: "👨‍💻",
    category: "Technology",
    type: "Page",
    path: "/technology/programming",
    keywords: [
      "programming",
      "coding",
      "developer",
    ],
  },

  {
    id: "coding-resources",
    title: "Coding Resources",
    subtitle:
      "Useful resources for developers",
    icon: "⚙️",
    category: "Technology",
    type: "Page",
    path: "/technology/coding-resources",
    keywords: [
      "coding",
      "resources",
      "development",
    ],
  },

  /* PRODUCTS */

  {
    id: "free-products",
    title: "Free Products",
    subtitle:
      "Free digital resources and downloads",
    icon: "🎁",
    category: "Products",
    type: "Page",
    path: "/products/free",
    keywords: [
      "free",
      "products",
      "downloads",
    ],
  },

  {
    id: "premium-products",
    title: "Premium Products",
    subtitle:
      "Premium digital products and resources",
    icon: "💎",
    category: "Products",
    type: "Page",
    path: "/products/premium",
    keywords: [
      "premium",
      "paid",
      "products",
    ],
  },

  {
    id: "product-prompts",
    title: "AI Prompt Packs",
    subtitle:
      "Downloadable AI prompt collections",
    icon: "✨",
    category: "Products",
    type: "Page",
    path: "/products/prompts",
    keywords: [
      "prompt packs",
      "prompts",
    ],
  },

  {
    id: "ebooks",
    title: "eBooks & PDFs",
    subtitle:
      "Digital books, guides and PDFs",
    icon: "📚",
    category: "Products",
    type: "Page",
    path: "/products/ebooks",
    keywords: [
      "ebooks",
      "pdf",
      "guides",
      "books",
    ],
  },

  {
    id: "product-templates",
    title: "Templates",
    subtitle:
      "Digital templates and resources",
    icon: "📦",
    category: "Products",
    type: "Page",
    path: "/products/templates",
    keywords: [
      "templates",
      "digital products",
    ],
  },

  {
    id: "icons-fonts",
    title: "Icons & Fonts",
    subtitle:
      "Design icons and font resources",
    icon: "🔤",
    category: "Products",
    type: "Page",
    path: "/products/icons-fonts",
    keywords: [
      "icons",
      "fonts",
      "design",
    ],
  },

  {
    id: "ui-kits",
    title: "UI Kits",
    subtitle:
      "Interface design resources",
    icon: "🖌️",
    category: "Products",
    type: "Page",
    path: "/products/ui-kits",
    keywords: [
      "ui",
      "ui kit",
      "figma",
    ],
  },

  {
    id: "product-source-code",
    title: "Source Code",
    subtitle:
      "Reusable code and development projects",
    icon: "💻",
    category: "Products",
    type: "Page",
    path: "/products/source-code",
    keywords: [
      "source code",
      "coding",
      "projects",
    ],
  },

  {
    id: "photoshop",
    title: "Photoshop Files",
    subtitle:
      "PSD and Photoshop resources",
    icon: "🖼️",
    category: "Products",
    type: "Page",
    path: "/products/photoshop",
    keywords: [
      "photoshop",
      "psd",
      "design",
    ],
  },

  {
    id: "product-capcut",
    title: "CapCut Templates",
    subtitle:
      "CapCut editing templates",
    icon: "✂️",
    category: "Products",
    type: "Page",
    path: "/products/capcut",
    keywords: [
      "capcut",
      "templates",
      "editing",
    ],
  },

  {
    id: "luts",
    title: "LUTs & Presets",
    subtitle:
      "Color grading LUTs and presets",
    icon: "🎛️",
    category: "Products",
    type: "Page",
    path: "/products/luts",
    keywords: [
      "luts",
      "presets",
      "color grading",
    ],
  },

  {
    id: "animations",
    title: "Animation Packs",
    subtitle:
      "Animation and motion asset packs",
    icon: "🎞️",
    category: "Products",
    type: "Page",
    path: "/products/animations",
    keywords: [
      "animation",
      "packs",
      "motion",
    ],
  },

  /* PLATFORM */

  {
    id: "community",
    title: "Community",
    subtitle:
      "Learn, share and grow with the community",
    icon: "👥",
    category: "Platform",
    type: "Page",
    path: "/community",
    keywords: [
      "community",
      "share",
      "posts",
    ],
  },

  {
    id: "promotion",
    title: "Promotion Hub",
    subtitle:
      "Promotion packages for creators and brands",
    icon: "📣",
    category: "Platform",
    type: "Page",
    path: "/promotion",
    keywords: [
      "promotion",
      "youtube promotion",
      "instagram promotion",
    ],
  },

  {
    id: "premium",
    title: "Premium",
    subtitle:
      "Explore AI Future Tamil premium benefits",
    icon: "💎",
    category: "Platform",
    type: "Page",
    path: "/premium",
    keywords: [
      "premium",
      "membership",
      "exclusive",
    ],
  },

  {
    id: "pricing",
    title: "Pricing",
    subtitle:
      "Explore platform pricing and plans",
    icon: "💰",
    category: "Platform",
    type: "Page",
    path: "/pricing",
    keywords: [
      "pricing",
      "plans",
      "price",
    ],
  },

  /* INFORMATION */

  {
    id: "about",
    title: "About Us",
    subtitle:
      "Learn more about AI Future Tamil",
    icon: "ℹ️",
    category: "Information",
    type: "Page",
    path: "/about",
    keywords: [
      "about",
      "mission",
      "vision",
    ],
  },

  {
    id: "contact",
    title: "Contact",
    subtitle:
      "Contact AI Future Tamil",
    icon: "📩",
    category: "Information",
    type: "Page",
    path: "/contact",
    keywords: [
      "contact",
      "support",
      "help",
    ],
  },

  {
    id: "privacy",
    title: "Privacy Policy",
    subtitle:
      "Read our privacy policy",
    icon: "🔒",
    category: "Information",
    type: "Page",
    path: "/privacy",
    keywords: [
      "privacy",
      "policy",
      "data",
    ],
  },

  {
    id: "terms",
    title: "Terms & Conditions",
    subtitle:
      "Read our website terms",
    icon: "📜",
    category: "Information",
    type: "Page",
    path: "/terms",
    keywords: [
      "terms",
      "conditions",
      "legal",
    ],
  },
];

/* =========================================================
   AI TOOL CONTENT
========================================================= */

const aiToolItems = [
  {
    id: "tool-chatgpt",
    title: "ChatGPT",
    subtitle:
      "AI assistant for writing, coding, learning and productivity",
    icon: "🤖",
    category: "AI Tools",
    type: "AI Tool",
    path: "/ai-tools/chatgpt",
    keywords: [
      "chatgpt",
      "openai",
      "writing",
      "coding",
      "assistant",
      "chatbot",
      "learning",
    ],
  },

  {
    id: "tool-gemini",
    title: "Gemini",
    subtitle:
      "Google AI assistant for research and productivity",
    icon: "💎",
    category: "AI Tools",
    type: "AI Tool",
    path: "/ai-tools/gemini",
    keywords: [
      "gemini",
      "google",
      "research",
      "assistant",
      "productivity",
    ],
  },

  {
    id: "tool-claude",
    title: "Claude",
    subtitle:
      "AI assistant for writing, coding and analysis",
    icon: "🧠",
    category: "AI Tools",
    type: "AI Tool",
    path: "/ai-tools/claude",
    keywords: [
      "claude",
      "anthropic",
      "analysis",
      "writing",
      "coding",
    ],
  },

  {
    id: "tool-midjourney",
    title: "Midjourney",
    subtitle:
      "AI image generation platform for creative visuals",
    icon: "🎨",
    category: "AI Tools",
    type: "AI Tool",
    path: "/ai-tools/midjourney",
    keywords: [
      "midjourney",
      "image",
      "art",
      "generator",
      "design",
    ],
  },

  {
    id: "tool-runway",
    title: "Runway",
    subtitle:
      "AI video generation and editing platform",
    icon: "🎬",
    category: "AI Tools",
    type: "AI Tool",
    path: "/ai-tools/runway",
    keywords: [
      "runway",
      "video",
      "editing",
      "generator",
      "animation",
    ],
  },

  {
    id: "tool-suno",
    title: "Suno AI",
    subtitle:
      "Generate AI songs, music and audio",
    icon: "🎵",
    category: "AI Tools",
    type: "AI Tool",
    path: "/ai-tools/suno",
    keywords: [
      "suno",
      "music",
      "song",
      "audio",
      "ai music",
    ],
  },
];

/* =========================================================
   PROMPT CONTENT
========================================================= */

const promptItems = [
  {
    id: "prompt-1",
    title: "YouTube Video Script",
    subtitle:
      "Create engaging YouTube scripts with hook, storytelling and CTA",
    icon: "🎬",
    category: "Prompts",
    type: "Prompt",
    path: "/prompts",
    keywords: [
      "youtube",
      "video script",
      "hook",
      "storytelling",
      "cta",
      "content creator",
    ],
  },

  {
    id: "prompt-2",
    title: "AI Image Prompt",
    subtitle:
      "Create cinematic and professional AI image generation prompts",
    icon: "🎨",
    category: "Prompts",
    type: "Prompt",
    path: "/prompts",
    keywords: [
      "image prompt",
      "ai image",
      "cinematic",
      "midjourney",
      "design",
    ],
  },

  {
    id: "prompt-3",
    title: "Coding Assistant",
    subtitle:
      "Analyze, explain, debug and improve code with AI",
    icon: "💻",
    category: "Prompts",
    type: "Prompt",
    path: "/prompts",
    keywords: [
      "coding",
      "developer",
      "debug",
      "code",
      "programming",
      "assistant",
    ],
  },

  {
    id: "prompt-4",
    title: "Study Assistant",
    subtitle:
      "Turn difficult topics into simple study notes and questions",
    icon: "📚",
    category: "Prompts",
    type: "Prompt",
    path: "/prompts",
    keywords: [
      "study",
      "education",
      "notes",
      "questions",
      "learning",
    ],
  },

  {
    id: "prompt-5",
    title: "Marketing Content",
    subtitle:
      "Generate social media and marketing content with AI",
    icon: "📢",
    category: "Prompts",
    type: "Prompt",
    path: "/prompts",
    keywords: [
      "marketing",
      "social media",
      "content",
      "posts",
      "hashtags",
    ],
  },

  {
    id: "prompt-6",
    title: "Business Ideas",
    subtitle:
      "Generate practical online business ideas using AI",
    icon: "💡",
    category: "Prompts",
    type: "Prompt",
    path: "/prompts",
    keywords: [
      "business",
      "ideas",
      "earning",
      "online business",
      "startup",
    ],
  },
];

/* =========================================================
   COURSE CONTENT
========================================================= */

const courseItems = [
  {
    id: "course-ai-tools",
    title: "AI Tools for Beginners",
    subtitle:
      "Learn popular AI tools for work, learning and creativity",
    icon: "🤖",
    category: "Courses",
    type: "Course",
    path:
      "/courses/ai-tools-for-beginners",
    keywords: [
      "ai tools",
      "beginner",
      "chatgpt",
      "gemini",
      "learning",
    ],
  },

  {
    id: "course-prompts",
    title:
      "Prompt Engineering Masterclass",
    subtitle:
      "Learn how to write powerful prompts and get better AI results",
    icon: "✨",
    category: "Courses",
    type: "Course",
    path:
      "/courses/prompt-engineering-masterclass",
    keywords: [
      "prompt engineering",
      "prompts",
      "masterclass",
      "chatgpt",
    ],
  },

  {
    id: "course-images",
    title: "AI Image Generation",
    subtitle:
      "Learn AI image generation and creative prompting workflows",
    icon: "🎨",
    category: "Courses",
    type: "Course",
    path:
      "/courses/ai-image-generation",
    keywords: [
      "ai image",
      "image generation",
      "midjourney",
      "design",
    ],
  },

  {
    id: "course-video",
    title: "AI Video Creation",
    subtitle:
      "Create videos using AI visuals, voice and editing tools",
    icon: "🎬",
    category: "Courses",
    type: "Course",
    path:
      "/courses/ai-video-creation",
    keywords: [
      "ai video",
      "video creation",
      "runway",
      "editing",
    ],
  },

  {
    id: "course-automation",
    title: "AI Automation",
    subtitle:
      "Learn AI automation workflows and productivity systems",
    icon: "⚡",
    category: "Courses",
    type: "Course",
    path:
      "/courses/ai-automation",
    keywords: [
      "automation",
      "workflow",
      "productivity",
      "advanced",
    ],
  },

  {
    id: "course-productivity",
    title: "AI Productivity",
    subtitle:
      "Use AI for planning, research, writing and daily work",
    icon: "📈",
    category: "Courses",
    type: "Course",
    path:
      "/courses/ai-productivity",
    keywords: [
      "productivity",
      "planning",
      "research",
      "writing",
    ],
  },
];

/* =========================================================
   NEWS CONTENT
========================================================= */

const newsItems = [
  {
    id: "news-1",
    title:
      "AI is changing the future",
    subtitle:
      "Artificial Intelligence is becoming more powerful and useful in everyday life",
    icon: "🚀",
    category: "AI News",
    type: "News",
    path: "/ai-news/1",
    keywords: [
      "ai trends",
      "future",
      "artificial intelligence",
      "daily life",
    ],
  },

  {
    id: "news-2",
    title:
      "AI Agents are growing fast",
    subtitle:
      "AI agents can help with research, coding, automation and productivity",
    icon: "🤖",
    category: "AI News",
    type: "News",
    path: "/ai-news/2",
    keywords: [
      "ai agents",
      "agent",
      "research",
      "coding",
      "automation",
    ],
  },

  {
    id: "news-3",
    title:
      "AI Image Generation is evolving",
    subtitle:
      "New AI image tools make high-quality visual creation easier",
    icon: "🎨",
    category: "AI News",
    type: "News",
    path: "/ai-news/3",
    keywords: [
      "ai image",
      "image generation",
      "visuals",
      "design",
    ],
  },

  {
    id: "news-4",
    title:
      "AI Video Creation is becoming easier",
    subtitle:
      "AI video tools help creators generate videos and animations",
    icon: "🎬",
    category: "AI News",
    type: "News",
    path: "/ai-news/4",
    keywords: [
      "ai video",
      "video creation",
      "animation",
      "creators",
    ],
  },

  {
    id: "news-5",
    title:
      "AI Coding Tools are improving",
    subtitle:
      "AI coding assistants help developers write, explain and debug code faster",
    icon: "💻",
    category: "AI News",
    type: "News",
    path: "/ai-news/5",
    keywords: [
      "ai coding",
      "coding tools",
      "developer",
      "debug",
    ],
  },

  {
    id: "news-6",
    title:
      "AI is becoming part of daily life",
    subtitle:
      "AI is becoming important in education, business and everyday workflows",
    icon: "🧠",
    category: "AI News",
    type: "News",
    path: "/ai-news/6",
    keywords: [
      "future ai",
      "daily life",
      "education",
      "business",
    ],
  },
];

/* =========================================================
   ALL SEARCH DATA
========================================================= */

const searchItems = [
  ...pageItems,
  ...aiToolItems,
  ...promptItems,
  ...courseItems,
  ...newsItems,
];

/* =========================================================
   CATEGORY FILTERS
========================================================= */

const filters = [
  {
    id: "all",
    label: "All",
    icon: "⚡",
  },
  {
    id: "AI Tools",
    label: "Tools",
    icon: "🤖",
  },
  {
    id: "Prompts",
    label: "Prompts",
    icon: "✨",
  },
  {
    id: "Courses",
    label: "Courses",
    icon: "🎓",
  },
  {
    id: "AI News",
    label: "News",
    icon: "📰",
  },
  {
    id: "Creators",
    label: "Creators",
    icon: "🎬",
  },
  {
    id: "Technology",
    label: "Tech",
    icon: "💻",
  },
  {
    id: "Products",
    label: "Products",
    icon: "🛍️",
  },
];

/* =========================================================
   TYPE COLORS
========================================================= */

const typeStyles = {
  "AI Tool": {
    badge:
      "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300",
  },

  Prompt: {
    badge:
      "border-pink-400/20 bg-pink-400/[0.07] text-pink-300",
  },

  Course: {
    badge:
      "border-green-400/20 bg-green-400/[0.07] text-green-300",
  },

  News: {
    badge:
      "border-purple-400/20 bg-purple-400/[0.07] text-purple-300",
  },

  Page: {
    badge:
      "border-white/10 bg-white/[0.04] text-gray-400",
  },
};

/* =========================================================
   SAFE STORAGE
========================================================= */

function readStoredArray(key) {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed =
      JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

/* =========================================================
   HIGHLIGHT TEXT
========================================================= */

function HighlightText({
  text,
  query,
}) {
  if (!query.trim()) {
    return text;
  }

  const clean =
    query
      .trim()
      .replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

  if (!clean) {
    return text;
  }

  const regex =
    new RegExp(
      `(${clean})`,
      "ig"
    );

  const parts =
    String(text).split(regex);

  return (
    <>
      {parts.map(
        (part, index) => {
          const isMatch =
            part.toLowerCase() ===
            query
              .trim()
              .toLowerCase();

          return isMatch ? (
            <mark
              key={`${part}-${index}`}
              className="rounded bg-cyan-400/15 px-0.5 text-cyan-200"
            >
              {part}
            </mark>
          ) : (
            <span
              key={`${part}-${index}`}
            >
              {part}
            </span>
          );
        }
      )}
    </>
  );
}

/* =========================================================
   SCORE SEARCH ITEM
========================================================= */

function scoreSearchItem(
  item,
  cleanQuery
) {
  const title =
    item.title.toLowerCase();

  const subtitle =
    item.subtitle.toLowerCase();

  const category =
    item.category.toLowerCase();

  const type =
    item.type.toLowerCase();

  const keywords =
    item.keywords
      .join(" ")
      .toLowerCase();

  const searchable =
    `${title} ${subtitle} ${category} ${type} ${keywords}`;

  let score = 0;

  if (
    title === cleanQuery
  ) {
    score += 150;
  }

  if (
    title.startsWith(
      cleanQuery
    )
  ) {
    score += 80;
  }

  if (
    title.includes(
      cleanQuery
    )
  ) {
    score += 55;
  }

  if (
    category.includes(
      cleanQuery
    )
  ) {
    score += 30;
  }

  if (
    type.includes(
      cleanQuery
    )
  ) {
    score += 25;
  }

  if (
    subtitle.includes(
      cleanQuery
    )
  ) {
    score += 25;
  }

  const words =
    cleanQuery
      .split(/\s+/)
      .filter(Boolean);

  words.forEach(
    (word) => {
      if (
        title.includes(word)
      ) {
        score += 20;
      }

      if (
        keywords.includes(
          word
        )
      ) {
        score += 15;
      }

      if (
        searchable.includes(
          word
        )
      ) {
        score += 8;
      }
    }
  );

  return score;
}

/* =========================================================
   COMMAND CENTER
========================================================= */

function CommandCenter() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const inputRef =
    useRef(null);

  const resultRefs =
    useRef([]);

  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  const [
    recentPaths,
    setRecentPaths,
  ] = useState(() =>
    readStoredArray(
      RECENT_PATHS_KEY
    )
  );

  const [
    recentSearches,
    setRecentSearches,
  ] = useState(() =>
    readStoredArray(
      RECENT_SEARCHES_KEY
    )
  );

  /* =========================================================
     SHORTCUTS
  ========================================================= */

  useEffect(() => {
    const handleKeyboard =
      (event) => {
        if (
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() ===
            "k"
        ) {
          event.preventDefault();

          setOpen(
            (current) =>
              !current
          );
        }

        if (
          event.key === "/" &&
          !open &&
          ![
            "INPUT",
            "TEXTAREA",
          ].includes(
            document.activeElement
              ?.tagName
          )
        ) {
          event.preventDefault();

          setOpen(true);
        }

        if (
          event.key ===
          "Escape"
        ) {
          setOpen(false);
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, [open]);

  /* =========================================================
     OPEN RESET
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setActiveFilter("all");
    setSelectedIndex(0);

    const timer =
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);

    return () =>
      clearTimeout(timer);
  }, [open]);

  /* =========================================================
     CLOSE AFTER NAVIGATION
  ========================================================= */

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* =========================================================
     FILTERED RESULTS
  ========================================================= */

  const results =
    useMemo(() => {
      const cleanQuery =
        query
          .trim()
          .toLowerCase();

      let source =
        searchItems;

      if (
        activeFilter !==
        "all"
      ) {
        source =
          source.filter(
            (item) =>
              item.category ===
                activeFilter ||
              item.type ===
                activeFilter
          );
      }

      if (!cleanQuery) {
        const recentItems =
          recentPaths
            .map((path) =>
              searchItems.find(
                (item) =>
                  item.path ===
                  path
              )
            )
            .filter(Boolean);

        const recentIds =
          new Set(
            recentItems.map(
              (item) =>
                item.id
            )
          );

        const suggestions =
          source.filter(
            (item) =>
              [
                "ai-tools",
                "prompts",
                "courses",
                "ai-news",
                "community",
                "premium",
                "tool-chatgpt",
                "course-ai-tools",
              ].includes(
                item.id
              ) &&
              !recentIds.has(
                item.id
              )
          );

        const combined =
          [
            ...recentItems,
            ...suggestions,
          ];

        const unique =
          [];

        const usedPaths =
          new Set();

        combined.forEach(
          (item) => {
            if (
              !usedPaths.has(
                item.path
              )
            ) {
              usedPaths.add(
                item.path
              );

              unique.push(
                item
              );
            }
          }
        );

        return unique.slice(
          0,
          10
        );
      }

      return source
        .map((item) => ({
          ...item,
          score:
            scoreSearchItem(
              item,
              cleanQuery
            ),
        }))
        .filter(
          (item) =>
            item.score > 0
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        )
        .slice(0, 16);
    }, [
      query,
      activeFilter,
      recentPaths,
    ]);

  /* =========================================================
     SELECTED INDEX SAFETY
  ========================================================= */

  useEffect(() => {
    if (
      results.length === 0
    ) {
      setSelectedIndex(0);
      return;
    }

    if (
      selectedIndex >
      results.length - 1
    ) {
      setSelectedIndex(
        results.length - 1
      );
    }
  }, [
    results,
    selectedIndex,
  ]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    resultRefs.current[
      selectedIndex
    ]?.scrollIntoView({
      block: "nearest",
    });
  }, [selectedIndex]);

  /* =========================================================
     SAVE SEARCH
  ========================================================= */

  const saveRecentSearch =
    (value) => {
      const clean =
        value.trim();

      if (!clean) {
        return;
      }

      const updated =
        [
          clean,
          ...recentSearches.filter(
            (item) =>
              item.toLowerCase() !==
              clean.toLowerCase()
          ),
        ].slice(0, 6);

      setRecentSearches(
        updated
      );

      localStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updated)
      );
    };

  /* =========================================================
     OPEN ITEM
  ========================================================= */

  const openItem = (item) => {
    if (!item) {
      return;
    }

    const updatedPaths =
      [
        item.path,
        ...recentPaths.filter(
          (path) =>
            path !== item.path
        ),
      ].slice(0, 6);

    setRecentPaths(
      updatedPaths
    );

    localStorage.setItem(
      RECENT_PATHS_KEY,
      JSON.stringify(
        updatedPaths
      )
    );

    saveRecentSearch(query);

    setOpen(false);
    setQuery("");
    setSelectedIndex(0);

    navigate(item.path);
  };

  /* =========================================================
     KEYBOARD NAVIGATION
  ========================================================= */

  const handleInputKeyDown =
    (event) => {
      if (
        event.key ===
        "ArrowDown"
      ) {
        event.preventDefault();

        if (
          !results.length
        ) {
          return;
        }

        setSelectedIndex(
          (current) =>
            current >=
            results.length - 1
              ? 0
              : current + 1
        );
      }

      if (
        event.key ===
        "ArrowUp"
      ) {
        event.preventDefault();

        if (
          !results.length
        ) {
          return;
        }

        setSelectedIndex(
          (current) =>
            current <= 0
              ? results.length -
                1
              : current - 1
        );
      }

      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();

        openItem(
          results[
            selectedIndex
          ]
        );
      }
    };

  /* =========================================================
     CLEAR RECENTS
  ========================================================= */

  const clearRecentSearches =
    () => {
      setRecentSearches([]);

      localStorage.removeItem(
        RECENT_SEARCHES_KEY
      );
    };

  /* =========================================================
     TOP LABEL
  ========================================================= */

  const topLabel =
    query.trim()
      ? `${results.length} result${
          results.length === 1
            ? ""
            : "s"
        } found`
      : recentPaths.length
      ? "Recent & Suggested"
      : "Quick Navigation";

  return (
    <>

      {/* =====================================================
          FLOATING BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        aria-label="Open AI Command Center"
        className="
          group

          fixed
          bottom-6
          right-6

          z-[9400]

          flex
          items-center
          gap-3

          rounded-2xl

          border
          border-cyan-400/25

          bg-[#070914]/90

          px-4
          py-3

          text-white

          shadow-[0_10px_40px_rgba(0,0,0,.35)]

          backdrop-blur-2xl

          transition-all
          duration-300

          hover:-translate-y-1
          hover:border-cyan-300/50
          hover:shadow-[0_0_35px_rgba(34,211,238,.14)]
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-xl

            border
            border-cyan-400/20

            bg-cyan-400/[0.06]

            text-xl

            transition-transform
            duration-300

            group-hover:scale-110
          "
        >
          ⚡
        </div>

        <div className="hidden text-left sm:block">
          <p className="text-sm font-black">
            AI Command
          </p>

          <p className="text-[10px] text-gray-600">
            Global Search 2.0
          </p>
        </div>

        <div className="hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-bold text-gray-500 md:block">
          Ctrl K
        </div>
      </button>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[99999]

            flex
            items-start
            justify-center

            bg-black/75

            px-3
            pt-[5vh]

            backdrop-blur-md

            sm:px-4
            sm:pt-[8vh]
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setOpen(false);
            }
          }}
        >
          <div
            className="
              flex
              max-h-[88vh]
              w-full
              max-w-4xl
              flex-col

              overflow-hidden

              rounded-[30px]

              border
              border-white/[0.10]

              bg-[#070914]/[0.98]

              shadow-[0_30px_100px_rgba(0,0,0,.65)]

              backdrop-blur-2xl
            "
          >

            {/* =================================================
                BRAND BAR
            ================================================= */}

            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] text-xl">
                  ⚡
                </div>

                <div>
                  <p className="text-sm font-black text-white">
                    AI Future Tamil
                  </p>

                  <p className="text-[11px] text-gray-600">
                    Global Search 2.0
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-bold text-gray-500 transition hover:border-red-400/20 hover:text-red-300"
              >
                ESC
              </button>

            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="border-b border-white/[0.07] p-4 sm:p-5">

              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.09] bg-black/30 px-5 py-4 transition-all focus-within:border-cyan-400/35 focus-within:shadow-[0_0_25px_rgba(34,211,238,.06)]">

                <span className="shrink-0 text-xl">
                  🔍
                </span>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(
                    event
                  ) => {
                    setQuery(
                      event.target.value
                    );

                    setSelectedIndex(
                      0
                    );
                  }}
                  onKeyDown={
                    handleInputKeyDown
                  }
                  placeholder="Search ChatGPT, prompts, AI video, courses, news, products..."
                  className="
                    min-w-0
                    flex-1

                    bg-transparent

                    text-base
                    text-white

                    outline-none

                    placeholder:text-gray-600

                    sm:text-lg
                  "
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedIndex(
                        0
                      );

                      inputRef.current?.focus();
                    }}
                    className="shrink-0 text-sm text-gray-600 transition hover:text-white"
                  >
                    ✕
                  </button>
                )}

              </div>

              {/* FILTERS */}

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

                {filters.map(
                  (filter) => {
                    const active =
                      activeFilter ===
                      filter.id;

                    return (
                      <button
                        key={
                          filter.id
                        }
                        type="button"
                        onClick={() => {
                          setActiveFilter(
                            filter.id
                          );

                          setSelectedIndex(
                            0
                          );

                          inputRef.current?.focus();
                        }}
                        className={`
                          min-w-max

                          rounded-xl

                          border

                          px-3
                          py-2

                          text-xs
                          font-bold

                          transition

                          ${
                            active
                              ? "border-cyan-400/35 bg-cyan-400/[0.09] text-cyan-300"
                              : "border-white/[0.07] bg-white/[0.025] text-gray-500 hover:border-white/20 hover:text-gray-300"
                          }
                        `}
                      >
                        {filter.icon}{" "}
                        {filter.label}
                      </button>
                    );
                  }
                )}

              </div>

              {/* RECENT SEARCHES */}

              {!query &&
                recentSearches.length >
                  0 && (
                  <div className="mt-4">

                    <div className="mb-2 flex items-center justify-between">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                        Recent Searches
                      </p>

                      <button
                        type="button"
                        onClick={
                          clearRecentSearches
                        }
                        className="text-[10px] font-semibold text-gray-700 transition hover:text-red-300"
                      >
                        Clear
                      </button>

                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1">

                      {recentSearches.map(
                        (
                          search
                        ) => (
                          <button
                            key={search}
                            type="button"
                            onClick={() => {
                              setQuery(
                                search
                              );

                              setSelectedIndex(
                                0
                              );

                              inputRef.current?.focus();
                            }}
                            className="min-w-max rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs text-gray-500 transition hover:border-purple-400/20 hover:text-purple-300"
                          >
                            🕘{" "}
                            {search}
                          </button>
                        )
                      )}

                    </div>

                  </div>
                )}

            </div>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center justify-between px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-600 sm:px-6">

              <span>
                {topLabel}
              </span>

              <span className="hidden sm:block">
                ↑ ↓ Navigate · Enter Open
              </span>

            </div>

            {/* =================================================
                RESULTS
            ================================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">

              {results.length ===
              0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-3xl">
                    🔍
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Nothing found
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                    Try ChatGPT, YouTube
                    Script, AI Image,
                    Automation, AI News,
                    Android or Premium.
                  </p>

                </div>
              ) : (
                <div className="space-y-1">

                  {results.map(
                    (
                      item,
                      index
                    ) => {
                      const selected =
                        selectedIndex ===
                        index;

                      const styles =
                        typeStyles[
                          item.type
                        ] ||
                        typeStyles.Page;

                      return (
                        <button
                          key={
                            item.id
                          }
                          ref={(
                            element
                          ) => {
                            resultRefs.current[
                              index
                            ] = element;
                          }}
                          type="button"
                          onClick={() =>
                            openItem(
                              item
                            )
                          }
                          onMouseEnter={() =>
                            setSelectedIndex(
                              index
                            )
                          }
                          className={`
                            group

                            flex
                            w-full
                            items-center
                            gap-4

                            rounded-2xl

                            border

                            px-4
                            py-4

                            text-left

                            transition-all
                            duration-200

                            ${
                              selected
                                ? "border-cyan-400/25 bg-cyan-400/[0.07] shadow-[0_0_20px_rgba(34,211,238,.04)]"
                                : "border-transparent hover:bg-white/[0.025]"
                            }
                          `}
                        >

                          {/* ICON */}

                          <div
                            className={`
                              flex
                              h-12
                              w-12
                              shrink-0
                              items-center
                              justify-center

                              rounded-xl

                              border

                              text-2xl

                              transition-all

                              ${
                                selected
                                  ? "border-cyan-400/25 bg-cyan-400/[0.06]"
                                  : "border-white/[0.07] bg-white/[0.025]"
                              }
                            `}
                          >
                            {
                              item.icon
                            }
                          </div>

                          {/* TEXT */}

                          <div className="min-w-0 flex-1">

                            <div className="flex min-w-0 items-center gap-2">

                              <h3 className="truncate font-black text-white">
                                <HighlightText
                                  text={
                                    item.title
                                  }
                                  query={
                                    query
                                  }
                                />
                              </h3>

                              <span
                                className={`
                                  hidden
                                  shrink-0
                                  rounded-full
                                  border
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  sm:inline-block
                                  ${styles.badge}
                                `}
                              >
                                {
                                  item.type
                                }
                              </span>

                            </div>

                            <p className="mt-1 truncate text-sm text-gray-600">
                              <HighlightText
                                text={
                                  item.subtitle
                                }
                                query={
                                  query
                                }
                              />
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                              <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[9px] font-semibold text-gray-700">
                                {
                                  item.category
                                }
                              </span>

                              {recentPaths.includes(
                                item.path
                              ) && (
                                <span className="text-[9px] font-semibold text-purple-400">
                                  🕘 Recent
                                </span>
                              )}

                            </div>

                          </div>

                          {/* ARROW */}

                          <div
                            className={`
                              shrink-0
                              text-lg
                              transition-all

                              ${
                                selected
                                  ? "translate-x-0 text-cyan-300 opacity-100"
                                  : "-translate-x-1 text-gray-700 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                              }
                            `}
                          >
                            →
                          </div>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-black/20 px-5 py-4 text-[11px] text-gray-600 sm:px-6">

              <div className="flex flex-wrap items-center gap-4">

                <span>
                  ↵ Open
                </span>

                <span>
                  ↑↓ Navigate
                </span>

                <span>
                  ESC Close
                </span>

                <span>
                  Ctrl K Search
                </span>

              </div>

              <span>
                ⚡ AI Future Tamil
              </span>

            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default CommandCenter;