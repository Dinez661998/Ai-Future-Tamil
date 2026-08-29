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
  getCompletedCourseCount,
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
    Math.max(0, Number(xp) || 0);

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
        (currentXP /
          xpPerLevel) *
          100
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
        String(tool.id) === id
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
          await supabase.auth.getUser();

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
              .from("profiles")
              .select("name")
              .eq("id", user.id)
              .maybeSingle();

          if (
            profile?.name
          ) {
            name =
              profile.name;
          }
        } catch {
          // profile optional
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
          getFavoriteTools() || [];

        const favoriteItems =
          favoriteIds
            .map((id) =>
              toolLibrary.find(
                (tool) =>
                  String(tool.id) ===
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
          getNewsRead() || [];

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
              (Math.min(
                completedLessons.length,
                course.lessons
              ) /
                course.lessons) *
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
                String(course.id)
            ) ||
            (percentage ===
              100 &&
              quizPassed);

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
            course.percentage > 0 &&
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
        .slice(0, 3);
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
        toolsExplored * 20 +
        favorites.length * 10 +
        savedPrompts.length * 25 +
        readNews.length * 15 +
        totalCompletedLessons * 40 +
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
        .map((id) =>
          promptLibrary.find(
            (prompt) =>
              String(
                prompt.id
              ) ===
              String(id)
          )
        )
        .filter(Boolean)
        .slice(0, 3);
    }, [savedPrompts]);

  /* =========================================================
     READ NEWS DETAILS
  ========================================================= */

  const readNewsItems =
    useMemo(() => {
      return readNews
        .map((id) =>
          newsLibrary.find(
            (news) =>
              String(news.id) ===
              String(id)
          )
        )
        .filter(Boolean)
        .slice(0, 3);
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
              String(item.id)
          ),

          ...recentTools.map(
            (item) =>
              String(item.id)
          ),
        ]);

      const freshTools =
        toolLibrary.filter(
          (tool) =>
            !usedIds.has(
              String(tool.id)
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

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-section home-hero-section">
        <Hero />
      </section>

      {/* =====================================================
          PERSONALIZED HOME
      ===================================================== */}

      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">

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
                    ? `Welcome back, ${userName || "Explorer"} 👋`
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
                      {levelInfo.currentXP} /{" "}
                      {levelInfo.xpPerLevel} XP
                    </span>

                    <span className="font-bold text-cyan-300">
                      {levelInfo.progress}%
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
                {savedPrompts.length}
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
                {completedCourses.length}
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
                  .slice(0, 3)
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
                      {course.completedLessons} /{" "}
                      {course.lessons} lessons ·{" "}
                      {course.duration}
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
                      {course.percentage >
                      0
                        ? "Continue Course →"
                        : "Start Course →"}
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

          {favorites.length > 0 && (
            <div className="mb-14">

              <SectionTitle
                eyebrow="❤️ Favorites"
                title="Your Favorite AI Tools"
                description="Quick access to the tools you saved."
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {favorites
                  .slice(0, 6)
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
          EXISTING AI TOOLS
      ===================================================== */}

      <section className="home-section home-tools-section">
        <Tools />
      </section>

      {/* =====================================================
          EXISTING FEATURES
      ===================================================== */}

      <section className="home-section home-features-section">
        <Features />
      </section>

      {/* =====================================================
          EXISTING AI NEWS
      ===================================================== */}

      <section className="home-section home-news-section">
        <AINews />
      </section>

    </main>
  );
}

export default Home;