import { Link } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../supabase/supabaseClient";

import {
  getFavoriteTools,
  getRecentlyVisitedTools,
  getRecentActivity,
  getToolsExploredCount,
  getPromptsSavedCount,
  getNewsReadCount,
  formatActivityTime,
  getCompletedCourseCount,
  clearDashboardStorage,
  getSavedPrompts,
  removeSavedPrompt,
  getNewsRead,
  getCompletedCourses,
  removeFavoriteTool,
} from "../utils/dashboardStorage";

/* =========================================================
   STORAGE KEYS
========================================================= */

const GAMIFICATION_KEY =
  "aft_gamification";

/* =========================================================
   AI TOOLS
========================================================= */

const allTools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "AI Chat",
    icon: "🤖",
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "AI Chat",
    icon: "💎",
  },
  {
    id: "claude",
    name: "Claude",
    category: "AI Chat",
    icon: "🧠",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "AI Image",
    icon: "🎨",
  },
  {
    id: "runway",
    name: "Runway",
    category: "AI Video",
    icon: "🎬",
  },
  {
    id: "suno",
    name: "Suno AI",
    category: "AI Music",
    icon: "🎵",
  },
];

/* =========================================================
   TRENDING TOOLS
========================================================= */

const trendingTools = [
  {
    id: "chatgpt",
    icon: "🤖",
    name: "ChatGPT",
    category: "AI Chat",
    badge: "Popular",
  },
  {
    id: "midjourney",
    icon: "🎨",
    name: "Midjourney",
    category: "AI Image",
    badge: "Trending",
  },
  {
    id: "runway",
    icon: "🎬",
    name: "Runway",
    category: "AI Video",
    badge: "Trending",
  },
];

/* =========================================================
   PROMPTS
========================================================= */

const promptLibrary = [
  {
    id: "1",
    title: "YouTube Video Script",
    category: "YouTube",
    icon: "🎬",
    description:
      "Create engaging YouTube video scripts with hooks, storytelling and CTA.",
    prompt:
      "Create a 5-minute YouTube video script about [TOPIC]. Include a powerful hook, introduction, main content, curiosity points, examples, conclusion and CTA.",
  },
  {
    id: "2",
    title: "AI Image Prompt",
    category: "Image",
    icon: "🎨",
    description:
      "Generate professional prompts for AI image generation.",
    prompt:
      "Create a highly detailed cinematic AI image prompt for [TOPIC]. Include subject, environment, lighting, camera angle, composition, colors and realistic details.",
  },
  {
    id: "3",
    title: "Coding Assistant",
    category: "Coding",
    icon: "💻",
    description:
      "Use AI to generate, explain and improve your code.",
    prompt:
      "Act as an expert software developer. Analyze the following code, identify problems, explain them simply and provide an improved version.",
  },
  {
    id: "4",
    title: "Study Assistant",
    category: "Education",
    icon: "📚",
    description:
      "Turn difficult topics into simple study notes.",
    prompt:
      "Explain [TOPIC] in simple language. Include key points, examples, important terms, a short summary and 5 practice questions.",
  },
  {
    id: "5",
    title: "Marketing Content",
    category: "Marketing",
    icon: "📢",
    description:
      "Create social media and marketing content using AI.",
    prompt:
      "Create 10 engaging social media posts about [PRODUCT/SERVICE]. Include hooks, short captions, CTA and suitable hashtags.",
  },
  {
    id: "6",
    title: "Business Ideas",
    category: "Business",
    icon: "💡",
    description:
      "Generate practical business ideas using AI.",
    prompt:
      "Generate 10 practical online business ideas based on my skills, budget and available time. Explain the target audience, earning model and first steps.",
  },
];

/* =========================================================
   NEWS
========================================================= */

const newsLibrary = [
  {
    id: "1",
    category: "AI Trends",
    title: "AI is changing the future",
    description:
      "Artificial Intelligence is becoming more powerful and useful in everyday life.",
    icon: "🚀",
    date: "Today",
  },
  {
    id: "2",
    category: "AI Agents",
    title: "AI Agents are growing fast",
    description:
      "AI agents can help users with research, coding, automation and productivity.",
    icon: "🤖",
    date: "Today",
  },
  {
    id: "3",
    category: "AI Images",
    title: "AI Image Generation is evolving",
    description:
      "New AI image tools are making it easier to create high-quality visuals and designs.",
    icon: "🎨",
    date: "Latest",
  },
  {
    id: "4",
    category: "AI Videos",
    title: "AI Video Creation is becoming easier",
    description:
      "AI video tools are helping creators generate videos, animations and creative content.",
    icon: "🎬",
    date: "Latest",
  },
  {
    id: "5",
    category: "AI Coding",
    title: "AI Coding Tools are improving",
    description:
      "Developers can use AI coding assistants to write, explain and debug code faster.",
    icon: "💻",
    date: "Trending",
  },
  {
    id: "6",
    category: "Future AI",
    title: "AI is becoming part of daily life",
    description:
      "From education to business, AI is becoming an important part of everyday workflows.",
    icon: "🧠",
    date: "Trending",
  },
];

/* =========================================================
   COURSES
========================================================= */

const courseLibrary = [
  {
    id: "ai-tools-for-beginners",
    icon: "🤖",
    title: "AI Tools for Beginners",
    description:
      "Learn popular AI tools for work, learning and creativity.",
    level: "Beginner",
    duration: "3 Hours",
    lessonCount: 5,
    accent: "blue",
  },
  {
    id: "prompt-engineering-masterclass",
    icon: "✨",
    title: "Prompt Engineering Masterclass",
    description:
      "Learn how to write powerful prompts and get better AI results.",
    level: "Beginner",
    duration: "4 Hours",
    lessonCount: 5,
    accent: "purple",
  },
  {
    id: "ai-image-generation",
    icon: "🎨",
    title: "AI Image Generation",
    description:
      "Explore AI image generation and professional creative workflows.",
    level: "Intermediate",
    duration: "4.5 Hours",
    lessonCount: 5,
    accent: "pink",
  },
  {
    id: "ai-video-creation",
    icon: "🎬",
    title: "AI Video Creation",
    description:
      "Create videos using AI visuals, voice and editing tools.",
    level: "Intermediate",
    duration: "5 Hours",
    lessonCount: 5,
    accent: "red",
  },
  {
    id: "ai-automation",
    icon: "⚡",
    title: "AI Automation",
    description:
      "Understand AI automation workflows and improve productivity.",
    level: "Advanced",
    duration: "5 Hours",
    lessonCount: 5,
    accent: "yellow",
  },
  {
    id: "ai-productivity",
    icon: "📈",
    title: "AI Productivity",
    description:
      "Use AI for planning, writing, research, learning and everyday work.",
    level: "Beginner",
    duration: "3.5 Hours",
    lessonCount: 5,
    accent: "green",
  },
];

/* =========================================================
   COURSE COLORS
========================================================= */

const courseAccent = {
  blue: {
    text: "text-blue-300",
    border: "border-blue-400/20",
    bg: "bg-blue-400/[0.07]",
    progress: "bg-blue-400",
  },
  purple: {
    text: "text-purple-300",
    border: "border-purple-400/20",
    bg: "bg-purple-400/[0.07]",
    progress: "bg-purple-400",
  },
  pink: {
    text: "text-pink-300",
    border: "border-pink-400/20",
    bg: "bg-pink-400/[0.07]",
    progress: "bg-pink-400",
  },
  red: {
    text: "text-red-300",
    border: "border-red-400/20",
    bg: "bg-red-400/[0.07]",
    progress: "bg-red-400",
  },
  yellow: {
    text: "text-yellow-300",
    border: "border-yellow-400/20",
    bg: "bg-yellow-400/[0.07]",
    progress: "bg-yellow-400",
  },
  green: {
    text: "text-green-300",
    border: "border-green-400/20",
    bg: "bg-green-400/[0.07]",
    progress: "bg-green-400",
  },
};

/* =========================================================
   LOCAL STORAGE HELPERS
========================================================= */

function readStoredObject(
  key,
  fallback = {}
) {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) return fallback;

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
   DATE HELPER
========================================================= */

function getDateKey(date = new Date()) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   DAILY STREAK
========================================================= */

function updateDailyStreak() {
  const today =
    getDateKey();

  const current =
    readStoredObject(
      GAMIFICATION_KEY,
      {}
    );

  if (
    current.lastActiveDate ===
    today
  ) {
    return {
      streak:
        Number(
          current.streak
        ) || 1,
      bestStreak:
        Number(
          current.bestStreak
        ) || 1,
      lastActiveDate:
        today,
    };
  }

  let streak = 1;

  if (
    current.lastActiveDate
  ) {
    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    if (
      current.lastActiveDate ===
      getDateKey(yesterday)
    ) {
      streak =
        (Number(
          current.streak
        ) || 0) + 1;
    }
  }

  const bestStreak =
    Math.max(
      streak,
      Number(
        current.bestStreak
      ) || 0
    );

  const updated = {
    streak,
    bestStreak,
    lastActiveDate:
      today,
  };

  localStorage.setItem(
    GAMIFICATION_KEY,
    JSON.stringify(updated)
  );

  return updated;
}

/* =========================================================
   LEVEL INFO
========================================================= */

function getLevelInfo(xp) {
  const xpPerLevel = 500;

  const safeXP =
    Math.max(0, xp);

  const level =
    Math.floor(
      safeXP / xpPerLevel
    ) + 1;

  const currentLevelXP =
    safeXP % xpPerLevel;

  const progress =
    Math.round(
      (currentLevelXP /
        xpPerLevel) *
        100
    );

  let rank = "AI Rookie";
  let icon = "🌱";

  if (level >= 3) {
    rank = "AI Explorer";
    icon = "🚀";
  }

  if (level >= 5) {
    rank = "AI Builder";
    icon = "⚡";
  }

  if (level >= 8) {
    rank = "AI Pro";
    icon = "🔥";
  }

  if (level >= 12) {
    rank = "AI Master";
    icon = "👑";
  }

  return {
    level,
    currentLevelXP,
    xpPerLevel,
    progress,
    rank,
    icon,
  };
}

/* =========================================================
   GLOW CARD
========================================================= */

function GlowCard({
  children,
  className = "",
  glow = "cyan",
}) {
  const styles = {
    cyan:
      "border-cyan-400/15 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(34,211,238,.10)]",
    pink:
      "border-pink-400/15 hover:border-pink-400/40 hover:shadow-[0_0_40px_rgba(244,114,182,.10)]",
    purple:
      "border-purple-400/15 hover:border-purple-400/40 hover:shadow-[0_0_40px_rgba(192,132,252,.10)]",
    green:
      "border-green-400/15 hover:border-green-400/40 hover:shadow-[0_0_40px_rgba(74,222,128,.10)]",
    orange:
      "border-orange-400/15 hover:border-orange-400/40 hover:shadow-[0_0_40px_rgba(251,146,60,.10)]",
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl border
        bg-[linear-gradient(145deg,rgba(12,15,35,.88),rgba(5,7,20,.74))]
        backdrop-blur-xl transition-all duration-500
        ${styles[glow] || styles.cyan}
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  text,
  link,
  linkText,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {text}
      </p>

      {link && (
        <Link
          to={link}
          className="mt-5 inline-flex rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300"
        >
          {linkText}
        </Link>
      )}

    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [
    userName,
    setUserName,
  ] = useState("User");

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    stats,
    setStats,
  ] = useState({
    tools: 0,
    prompts: 0,
    news: 0,
    courses: 0,
  });

  const [
    recentActivity,
    setRecentActivity,
  ] = useState([]);

  const [
    favoriteTools,
    setFavoriteTools,
  ] = useState([]);

  const [
    recentlyVisited,
    setRecentlyVisited,
  ] = useState([]);

  const [
    savedPromptIds,
    setSavedPromptIds,
  ] = useState([]);

  const [
    readNewsIds,
    setReadNewsIds,
  ] = useState([]);

  const [
    completedCourseIds,
    setCompletedCourseIds,
  ] = useState([]);

  const [
    courseProgressData,
    setCourseProgressData,
  ] = useState({});

  const [
    courseQuizData,
    setCourseQuizData,
  ] = useState({});

  const [
    streakData,
    setStreakData,
  ] = useState({
    streak: 1,
    bestStreak: 1,
    lastActiveDate: "",
  });

  const [
    libraryTab,
    setLibraryTab,
  ] = useState("tools");

  const [
    librarySearch,
    setLibrarySearch,
  ] = useState("");

  const [
    copiedPromptId,
    setCopiedPromptId,
  ] = useState(null);

  const [
    showClearConfirm,
    setShowClearConfirm,
  ] = useState(false);

  const [
    isClearing,
    setIsClearing,
  ] = useState(false);

  /* =========================================================
     PROFILE
  ========================================================= */

  const loadProfile =
    useCallback(async () => {
      try {
        const {
          data: { user },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (
          userError ||
          !user
        ) {
          return;
        }

        const fallbackName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";

        setUserName(
          fallbackName
        );

        const {
          data,
          error,
        } =
          await supabase
            .from("profiles")
            .select(
              "id, name, email, created_at"
            )
            .eq("id", user.id)
            .maybeSingle();

        if (error) {
          setProfile({
            id: user.id,
            name: fallbackName,
            email: user.email,
            created_at:
              user.created_at,
          });

          return;
        }

        const finalProfile =
          data || {
            id: user.id,
            name: fallbackName,
            email: user.email,
            created_at:
              user.created_at,
          };

        setProfile(
          finalProfile
        );

        if (
          finalProfile.name
        ) {
          setUserName(
            finalProfile.name
          );
        }
      } catch (error) {
        console.error(
          error
        );
      }
    }, []);

  /* =========================================================
     LOAD DASHBOARD
  ========================================================= */

  const loadDashboardData =
    useCallback(() => {
      const savedName =
        localStorage.getItem(
          "userName"
        );

      if (savedName) {
        setUserName(
          savedName
        );
      }

      setStats({
        tools:
          getToolsExploredCount(),
        prompts:
          getPromptsSavedCount(),
        news:
          getNewsReadCount(),
        courses:
          getCompletedCourseCount(),
      });

      setRecentActivity(
        getRecentActivity()
      );

      const favoriteIds =
        getFavoriteTools().map(
          String
        );

      setFavoriteTools(
        allTools.filter(
          (tool) =>
            favoriteIds.includes(
              String(tool.id)
            )
        )
      );

      setRecentlyVisited(
        getRecentlyVisitedTools()
      );

      setSavedPromptIds(
        getSavedPrompts().map(
          String
        )
      );

      setReadNewsIds(
        getNewsRead().map(
          String
        )
      );

      setCompletedCourseIds(
        getCompletedCourses().map(
          String
        )
      );

      setCourseProgressData(
        readStoredObject(
          "aiCourseProgress"
        )
      );

      setCourseQuizData(
        readStoredObject(
          "aiCourseQuizResults"
        )
      );
    }, []);

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    setStreakData(
      updateDailyStreak()
    );

    loadDashboardData();
    loadProfile();

    const handleUpdate =
      () => {
        loadDashboardData();
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
    loadDashboardData,
    loadProfile,
  ]);

  /* =========================================================
     PROMPTS
  ========================================================= */

  const savedPrompts =
    useMemo(
      () =>
        promptLibrary.filter(
          (item) =>
            savedPromptIds.includes(
              String(item.id)
            )
        ),
      [savedPromptIds]
    );

  /* =========================================================
     NEWS
  ========================================================= */

  const readNews =
    useMemo(
      () =>
        newsLibrary.filter(
          (item) =>
            readNewsIds.includes(
              String(item.id)
            )
        ),
      [readNewsIds]
    );

  /* =========================================================
     COURSE PROGRESS
  ========================================================= */

  const coursesWithProgress =
    useMemo(() => {
      return courseLibrary.map(
        (course) => {
          const lessons =
            Array.isArray(
              courseProgressData?.[
                course.id
              ]?.completedLessons
            )
              ? courseProgressData[
                  course.id
                ].completedLessons
              : [];

          const completedLessons =
            Math.min(
              lessons.length,
              course.lessonCount
            );

          const progress =
            Math.round(
              (completedLessons /
                course.lessonCount) *
                100
            );

          const quiz =
            courseQuizData?.[
              course.id
            ] || null;

          const quizPassed =
            quiz?.passed === true;

          const quizPercentage =
            quiz?.percentage ??
            null;

          const fullyCompleted =
            completedCourseIds.includes(
              course.id
            ) ||
            (progress === 100 &&
              quizPassed);

          const started =
            completedLessons > 0 ||
            Boolean(quiz) ||
            fullyCompleted;

          let status =
            "Not Started";

          if (
            fullyCompleted
          ) {
            status = "Completed";
          } else if (
            progress === 100
          ) {
            status =
              "Quiz Pending";
          } else if (
            progress > 0
          ) {
            status =
              "In Progress";
          }

          return {
            ...course,
            completedLessons,
            progress,
            quizPassed,
            quizPercentage,
            fullyCompleted,
            started,
            status,
          };
        }
      );
    }, [
      courseProgressData,
      courseQuizData,
      completedCourseIds,
    ]);

  const startedCourses =
    useMemo(
      () =>
        coursesWithProgress
          .filter(
            (course) =>
              course.started
          )
          .sort(
            (a, b) => {
              if (
                a.fullyCompleted &&
                !b.fullyCompleted
              ) {
                return 1;
              }

              if (
                !a.fullyCompleted &&
                b.fullyCompleted
              ) {
                return -1;
              }

              return (
                b.progress -
                a.progress
              );
            }
          ),
      [coursesWithProgress]
    );

  /* =========================================================
     COMPLETED LESSON COUNT
  ========================================================= */

  const totalCompletedLessons =
    useMemo(() => {
      return coursesWithProgress.reduce(
        (total, course) =>
          total +
          course.completedLessons,
        0
      );
    }, [coursesWithProgress]);

  /* =========================================================
     XP SYSTEM
  ========================================================= */

  const totalXP =
    stats.tools * 20 +
    favoriteTools.length * 10 +
    savedPrompts.length * 25 +
    readNews.length * 15 +
    totalCompletedLessons * 40 +
    stats.courses * 200 +
    streakData.streak * 10;

  const levelInfo =
    getLevelInfo(totalXP);

  /* =========================================================
     ACHIEVEMENTS
  ========================================================= */

  const achievements = [
    {
      id: "first-tool",
      icon: "🤖",
      title: "AI Explorer",
      description:
        "Explore your first AI tool",
      unlocked:
        stats.tools >= 1,
    },
    {
      id: "prompt-collector",
      icon: "✨",
      title: "Prompt Collector",
      description:
        "Save 3 AI prompts",
      unlocked:
        savedPrompts.length >= 3,
    },
    {
      id: "news-reader",
      icon: "📰",
      title: "AI Reader",
      description:
        "Read 3 AI news articles",
      unlocked:
        readNews.length >= 3,
    },
    {
      id: "course-starter",
      icon: "🎓",
      title: "Learner",
      description:
        "Start your first course",
      unlocked:
        startedCourses.length >= 1,
    },
    {
      id: "course-master",
      icon: "🏆",
      title: "Course Master",
      description:
        "Complete a full course",
      unlocked:
        stats.courses >= 1,
    },
    {
      id: "week-streak",
      icon: "🔥",
      title: "7 Day Streak",
      description:
        "Visit for 7 days in a row",
      unlocked:
        streakData.streak >= 7,
    },
  ];

  const unlockedAchievements =
    achievements.filter(
      (item) =>
        item.unlocked
    ).length;

  /* =========================================================
     LIBRARY
  ========================================================= */

  const libraryCount =
    favoriteTools.length +
    savedPrompts.length +
    readNews.length +
    startedCourses.length;

  const query =
    librarySearch
      .trim()
      .toLowerCase();

  const filteredTools =
    favoriteTools.filter(
      (item) =>
        `${item.name} ${item.category}`
          .toLowerCase()
          .includes(query)
    );

  const filteredPrompts =
    savedPrompts.filter(
      (item) =>
        `${item.title} ${item.category}`
          .toLowerCase()
          .includes(query)
    );

  const filteredNews =
    readNews.filter(
      (item) =>
        `${item.title} ${item.category}`
          .toLowerCase()
          .includes(query)
    );

  const filteredCourses =
    startedCourses.filter(
      (item) =>
        `${item.title} ${item.level} ${item.status}`
          .toLowerCase()
          .includes(query)
    );

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleRemoveTool = (
    event,
    tool
  ) => {
    event.preventDefault();
    event.stopPropagation();

    removeFavoriteTool(
      tool.id
    );

    loadDashboardData();
  };

  const handleRemovePrompt =
    (id) => {
      removeSavedPrompt(id);
      loadDashboardData();
    };

  const handleCopyPrompt =
    async (item) => {
      try {
        await navigator.clipboard.writeText(
          item.prompt
        );

        setCopiedPromptId(
          item.id
        );

        setTimeout(
          () =>
            setCopiedPromptId(
              null
            ),
          1500
        );
      } catch {
        alert(
          "Unable to copy prompt."
        );
      }
    };

  const handleClearMemory =
    () => {
      setIsClearing(true);

      setTimeout(() => {
        clearDashboardStorage();

        localStorage.removeItem(
          GAMIFICATION_KEY
        );

        setStreakData({
          streak: 1,
          bestStreak: 1,
          lastActiveDate:
            getDateKey(),
        });

        localStorage.setItem(
          GAMIFICATION_KEY,
          JSON.stringify({
            streak: 1,
            bestStreak: 1,
            lastActiveDate:
              getDateKey(),
          })
        );

        loadDashboardData();

        setIsClearing(false);
        setShowClearConfirm(
          false
        );
      }, 600);
    };

  /* =========================================================
     TABS
  ========================================================= */

  const tabs = [
    {
      id: "tools",
      icon: "❤️",
      label: "AI Tools",
      count:
        favoriteTools.length,
    },
    {
      id: "prompts",
      icon: "✨",
      label: "Prompts",
      count:
        savedPrompts.length,
    },
    {
      id: "news",
      icon: "📰",
      label: "News",
      count:
        readNews.length,
    },
    {
      id: "courses",
      icon: "🎓",
      label: "Courses",
      count:
        startedCourses.length,
    },
  ];

  /* =========================================================
     STAT CARDS
  ========================================================= */

  const statCards = [
    {
      icon: "🤖",
      title: "Tools Explored",
      value: stats.tools,
      link: "/ai-tools",
      glow: "cyan",
    },
    {
      icon: "❤️",
      title: "Prompts Saved",
      value: stats.prompts,
      link: "/prompts",
      glow: "pink",
    },
    {
      icon: "📰",
      title: "News Read",
      value: stats.news,
      link: "/ai-news",
      glow: "purple",
    },
    {
      icon: "🎓",
      title:
        "Courses Completed",
      value: stats.courses,
      link: "/courses",
      glow: "green",
    },
  ];

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-white sm:px-6 sm:py-10">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto mb-10 max-w-7xl">

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              👋 Welcome back, {userName}
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Your AI

              <span className="block bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Learn, explore, save and
              build your AI journey.
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              to="/ai-tools"
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-bold text-black transition hover:-translate-y-1"
            >
              🤖 Explore AI
            </Link>

            <button
              onClick={() =>
                setShowClearConfirm(
                  true
                )
              }
              className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-400/20"
            >
              🗑️ Clear Memory
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          PROFILE
      ===================================================== */}

      {profile && (
        <section className="mx-auto mb-10 max-w-7xl">

          <GlowCard
            glow="cyan"
            className="p-6"
          >

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-gray-600">
                  NAME
                </p>

                <p className="mt-2 font-semibold">
                  {profile.name ||
                    userName}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-gray-600">
                  EMAIL
                </p>

                <p className="mt-2 break-all font-semibold">
                  {profile.email}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-gray-600">
                  USER ID
                </p>

                <p className="mt-2 truncate font-mono text-sm">
                  {profile.id}
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <p className="text-xs text-gray-600">
                  MEMBER SINCE
                </p>

                <p className="mt-2 font-semibold">
                  {profile.created_at
                    ? new Date(
                        profile.created_at
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </p>
              </div>

            </div>

          </GlowCard>

        </section>
      )}

      {/* =====================================================
          MAIN STATS
      ===================================================== */}

      <section className="mx-auto mb-12 grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {statCards.map(
          (item) => (
            <Link
              key={item.title}
              to={item.link}
            >

              <GlowCard
                glow={item.glow}
                className="group h-full p-6"
              >

                <div className="text-4xl">
                  {item.icon}
                </div>

                <p className="mt-6 text-gray-500">
                  {item.title}
                </p>

                <p className="mt-2 text-5xl font-black">
                  {item.value}
                </p>

                <p className="mt-6 text-sm text-cyan-300">
                  View Details →
                </p>

              </GlowCard>

            </Link>
          )
        )}

      </section>

      {/* =====================================================
          GAMIFICATION / AI JOURNEY
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <div className="mb-7">

          <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-300">
            🔥 YOUR AI JOURNEY
          </div>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            XP, Level & Streak
          </h2>

          <p className="mt-2 text-gray-500">
            Explore more. Learn more.
            Level up.
          </p>

        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr_.8fr]">

          {/* LEVEL */}

          <GlowCard
            glow="purple"
            className="p-6 sm:p-8"
          >

            <div className="flex flex-col gap-7 sm:flex-row sm:items-center">

              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-400/10 shadow-[0_0_50px_rgba(168,85,247,.13)]">

                <div className="text-center">

                  <div className="text-3xl">
                    {levelInfo.icon}
                  </div>

                  <div className="mt-1 text-3xl font-black">
                    {levelInfo.level}
                  </div>

                  <div className="text-[10px] font-bold text-purple-300">
                    LEVEL
                  </div>

                </div>

              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-bold text-purple-300">
                  {levelInfo.rank}
                </p>

                <div className="mt-2 flex items-end gap-2">

                  <span className="text-4xl font-black">
                    {totalXP}
                  </span>

                  <span className="pb-1 text-sm text-gray-500">
                    XP
                  </span>

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-xs">

                    <span className="text-gray-500">
                      Level{" "}
                      {levelInfo.level}
                    </span>

                    <span className="font-semibold text-purple-300">
                      {
                        levelInfo.currentLevelXP
                      }
                      /
                      {
                        levelInfo.xpPerLevel
                      }{" "}
                      XP
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-1000"
                      style={{
                        width: `${levelInfo.progress}%`,
                      }}
                    />

                  </div>

                </div>

                <p className="mt-3 text-xs text-gray-600">
                  {
                    levelInfo.xpPerLevel -
                    levelInfo.currentLevelXP
                  }{" "}
                  XP needed for Level{" "}
                  {levelInfo.level +
                    1}
                </p>

              </div>

            </div>

          </GlowCard>

          {/* STREAK */}

          <GlowCard
            glow="orange"
            className="p-6"
          >

            <div className="flex h-full flex-col justify-between">

              <div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-4xl">
                  🔥
                </div>

                <p className="mt-6 text-sm text-gray-500">
                  Daily Streak
                </p>

                <p className="mt-1 text-5xl font-black text-orange-300">
                  {streakData.streak}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  consecutive days
                </p>

              </div>

              <div className="mt-6 rounded-xl border border-orange-400/10 bg-orange-400/[0.05] px-4 py-3 text-sm text-orange-300">
                +10 XP daily
              </div>

            </div>

          </GlowCard>

          {/* BEST */}

          <GlowCard
            glow="green"
            className="p-6"
          >

            <div className="flex h-full flex-col justify-between">

              <div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-400/20 bg-green-400/10 text-4xl">
                  🏆
                </div>

                <p className="mt-6 text-sm text-gray-500">
                  Best Streak
                </p>

                <p className="mt-1 text-5xl font-black text-green-300">
                  {
                    streakData.bestStreak
                  }
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  personal record
                </p>

              </div>

              <div className="mt-6 rounded-xl border border-green-400/10 bg-green-400/[0.05] px-4 py-3 text-sm text-green-300">
                Keep going 🚀
              </div>

            </div>

          </GlowCard>

        </div>

      </section>

      {/* =====================================================
          XP BREAKDOWN
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <GlowCard
          glow="cyan"
          className="p-6 sm:p-8"
        >

          <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold text-cyan-300">
                ⚡ XP BREAKDOWN
              </p>

              <h2 className="mt-2 text-2xl font-black">
                How You Earn XP
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-black text-white">
                {totalXP} XP
              </span>
            </p>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {[
              {
                icon: "🤖",
                title: "Tool",
                points: "+20",
                value: stats.tools,
              },
              {
                icon: "❤️",
                title: "Favorite",
                points: "+10",
                value:
                  favoriteTools.length,
              },
              {
                icon: "✨",
                title: "Prompt",
                points: "+25",
                value:
                  savedPrompts.length,
              },
              {
                icon: "📰",
                title: "News",
                points: "+15",
                value:
                  readNews.length,
              },
              {
                icon: "📚",
                title: "Lesson",
                points: "+40",
                value:
                  totalCompletedLessons,
              },
              {
                icon: "🎓",
                title: "Course",
                points: "+200",
                value:
                  stats.courses,
              },
            ].map(
              (item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-center"
                >

                  <div className="text-3xl">
                    {item.icon}
                  </div>

                  <p className="mt-3 text-sm font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-cyan-300">
                    {item.points} XP
                  </p>

                  <p className="mt-3 text-xs text-gray-600">
                    Completed:{" "}
                    {item.value}
                  </p>

                </div>
              )
            )}

          </div>

        </GlowCard>

      </section>

      {/* =====================================================
          ACHIEVEMENTS
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <div className="mb-7 flex items-end justify-between gap-4">

          <div>

            <p className="text-sm font-semibold text-yellow-300">
              🏆 ACHIEVEMENTS
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Your Badges
            </h2>

          </div>

          <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
            {unlockedAchievements}/
            {achievements.length} Unlocked
          </div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {achievements.map(
            (achievement) => (
              <div
                key={
                  achievement.id
                }
                className={`
                  rounded-3xl border p-6 transition-all duration-500
                  ${
                    achievement.unlocked
                      ? "border-yellow-400/20 bg-yellow-400/[0.05] hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-[0_0_35px_rgba(250,204,21,.08)]"
                      : "border-white/[0.06] bg-white/[0.02] opacity-45"
                  }
                `}
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`
                      flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl
                      ${
                        achievement.unlocked
                          ? "border-yellow-400/20 bg-yellow-400/10"
                          : "border-white/[0.08] bg-white/[0.03] grayscale"
                      }
                    `}
                  >
                    {
                      achievement.icon
                    }
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      achievement.unlocked
                        ? "bg-green-400/10 text-green-300"
                        : "bg-white/[0.04] text-gray-600"
                    }`}
                  >
                    {achievement.unlocked
                      ? "✓ UNLOCKED"
                      : "🔒 LOCKED"}
                  </span>

                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {
                    achievement.title
                  }
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {
                    achievement.description
                  }
                </p>

              </div>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          CONTINUE LEARNING
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <div className="mb-7 flex items-end justify-between">

          <div>

            <p className="text-sm font-bold text-green-300">
              🎓 LEARNING
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Continue Learning
            </h2>

          </div>

          <Link
            to="/courses"
            className="text-sm font-semibold text-green-300"
          >
            All Courses →
          </Link>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {coursesWithProgress.map(
            (course) => {
              const styles =
                courseAccent[
                  course.accent
                ];

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group rounded-3xl border border-white/[0.08] bg-[linear-gradient(145deg,rgba(12,15,35,.85),rgba(5,7,20,.8))] p-6 transition duration-500 hover:-translate-y-2 hover:border-white/20"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl ${styles.border} ${styles.bg}`}
                    >
                      {course.icon}
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        course.fullyCompleted
                          ? "border-green-400/20 bg-green-400/10 text-green-300"
                          : `${styles.border} ${styles.bg} ${styles.text}`
                      }`}
                    >
                      {course.fullyCompleted
                        ? "🏆 COMPLETE"
                        : course.status ===
                          "Quiz Pending"
                        ? "🧠 QUIZ"
                        : course.started
                        ? "▶ ACTIVE"
                        : "NEW"}
                    </span>

                  </div>

                  <p
                    className={`mt-5 text-xs font-semibold ${styles.text}`}
                  >
                    {course.level}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    {course.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                    {
                      course.description
                    }
                  </p>

                  <div className="mt-5">

                    <div className="mb-2 flex justify-between text-xs">

                      <span className="text-gray-600">
                        {
                          course.completedLessons
                        }
                        /
                        {
                          course.lessonCount
                        }{" "}
                        lessons
                      </span>

                      <span
                        className={`font-bold ${
                          course.fullyCompleted
                            ? "text-green-300"
                            : styles.text
                        }`}
                      >
                        {
                          course.progress
                        }
                        %
                      </span>

                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">

                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          course.fullyCompleted
                            ? "bg-green-400"
                            : styles.progress
                        }`}
                        style={{
                          width: `${course.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div
                    className={`mt-6 flex items-center justify-between rounded-xl border px-4 py-3 ${styles.border} ${styles.bg}`}
                  >

                    <span
                      className={`text-sm font-bold ${styles.text}`}
                    >
                      {course.fullyCompleted
                        ? "Review Course"
                        : course.status ===
                          "Quiz Pending"
                        ? "Take Final Quiz"
                        : course.started
                        ? "Continue Course"
                        : "Start Course"}
                    </span>

                    <span
                      className={
                        styles.text
                      }
                    >
                      →
                    </span>

                  </div>

                </Link>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          MY LIBRARY
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <GlowCard
          glow="purple"
          className="p-5 sm:p-8"
        >

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-bold text-purple-300">
                📚 SMART DASHBOARD
              </p>

              <h2 className="mt-2 text-3xl font-black">
                My Library
              </h2>

              <p className="mt-2 text-gray-500">
                Everything you saved,
                read and started.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">

              <p className="text-xs text-gray-600">
                TOTAL ITEMS
              </p>

              <p className="text-2xl font-black text-purple-300">
                {libraryCount}
              </p>

            </div>

          </div>

          <div className="relative mt-7">

            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              🔍
            </span>

            <input
              value={librarySearch}
              onChange={(event) =>
                setLibrarySearch(
                  event.target.value
                )
              }
              placeholder="Search inside your library..."
              className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-12 pr-4 outline-none focus:border-purple-400/40"
            />

          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setLibraryTab(
                    tab.id
                  )
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  libraryTab ===
                  tab.id
                    ? "border-purple-400/50 bg-purple-400/10"
                    : "border-white/[0.07] bg-white/[0.02]"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <div className="text-2xl">
                      {tab.icon}
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      {tab.label}
                    </p>

                  </div>

                  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs">
                    {tab.count}
                  </span>

                </div>

              </button>
            ))}

          </div>

          {/* TOOLS */}

          {libraryTab ===
            "tools" && (
            <div className="mt-7">

              {filteredTools.length ===
              0 ? (
                <EmptyState
                  icon="🤍"
                  title="No Favorite Tools"
                  text="Favorite AI tools and they will appear here."
                  link="/ai-tools"
                  linkText="Explore Tools →"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {filteredTools.map(
                    (tool) => (
                      <Link
                        key={tool.id}
                        to={`/ai-tools/${tool.id}`}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-pink-400/30"
                      >

                        <div className="flex justify-between gap-4">

                          <div className="flex items-center gap-4">

                            <div className="text-4xl">
                              {
                                tool.icon
                              }
                            </div>

                            <div>

                              <h3 className="font-bold">
                                {
                                  tool.name
                                }
                              </h3>

                              <p className="text-sm text-gray-500">
                                {
                                  tool.category
                                }
                              </p>

                            </div>

                          </div>

                          <button
                            onClick={(
                              event
                            ) =>
                              handleRemoveTool(
                                event,
                                tool
                              )
                            }
                          >
                            ❤️
                          </button>

                        </div>

                      </Link>
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* PROMPTS */}

          {libraryTab ===
            "prompts" && (
            <div className="mt-7">

              {filteredPrompts.length ===
              0 ? (
                <EmptyState
                  icon="✨"
                  title="No Saved Prompts"
                  text="Save prompts from the Prompt Library."
                  link="/prompts"
                  linkText="Explore Prompts →"
                />
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">

                  {filteredPrompts.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                      >

                        <div className="flex justify-between gap-4">

                          <div>

                            <p className="text-sm text-pink-300">
                              {
                                item.category
                              }
                            </p>

                            <h3 className="mt-1 text-xl font-bold">
                              {
                                item.title
                              }
                            </h3>

                          </div>

                          <button
                            onClick={() =>
                              handleRemovePrompt(
                                item.id
                              )
                            }
                          >
                            ❤️
                          </button>

                        </div>

                        <p className="mt-3 text-sm text-gray-500">
                          {
                            item.description
                          }
                        </p>

                        <div className="mt-4 rounded-xl bg-black/30 p-4">

                          <p className="line-clamp-3 text-sm text-gray-400">
                            {item.prompt}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            handleCopyPrompt(
                              item
                            )
                          }
                          className="mt-4 w-full rounded-xl bg-white py-3 font-bold text-black"
                        >
                          {copiedPromptId ===
                          item.id
                            ? "✅ Copied"
                            : "📋 Copy Prompt"}
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* NEWS */}

          {libraryTab ===
            "news" && (
            <div className="mt-7">

              {filteredNews.length ===
              0 ? (
                <EmptyState
                  icon="📰"
                  title="No News Read Yet"
                  text="Read AI news and it will appear here."
                  link="/ai-news"
                  linkText="Read News →"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">

                  {filteredNews.map(
                    (item) => (
                      <Link
                        key={item.id}
                        to={`/ai-news/${item.id}`}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                      >

                        <div className="flex gap-4">

                          <div className="text-4xl">
                            {
                              item.icon
                            }
                          </div>

                          <div>

                            <p className="text-sm text-purple-300">
                              {
                                item.category
                              }
                            </p>

                            <h3 className="mt-1 font-bold">
                              {
                                item.title
                              }
                            </h3>

                          </div>

                        </div>

                        <p className="mt-4 text-sm text-gray-500">
                          {
                            item.description
                          }
                        </p>

                        <p className="mt-5 text-sm font-semibold text-green-300">
                          ✓ Read Again →
                        </p>

                      </Link>
                    )
                  )}

                </div>
              )}

            </div>
          )}

          {/* COURSES */}

          {libraryTab ===
            "courses" && (
            <div className="mt-7">

              {filteredCourses.length ===
              0 ? (
                <EmptyState
                  icon="🎓"
                  title="No Course Started"
                  text="Start learning and your progress will appear here."
                  link="/courses"
                  linkText="Start Learning →"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {filteredCourses.map(
                    (course) => {
                      const styles =
                        courseAccent[
                          course.accent
                        ];

                      return (
                        <Link
                          key={
                            course.id
                          }
                          to={`/courses/${course.id}`}
                          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
                        >

                          <div className="text-4xl">
                            {
                              course.icon
                            }
                          </div>

                          <h3 className="mt-4 font-bold">
                            {
                              course.title
                            }
                          </h3>

                          <div className="mt-5">

                            <div className="mb-2 flex justify-between text-xs">

                              <span className="text-gray-600">
                                {
                                  course.completedLessons
                                }
                                /
                                {
                                  course.lessonCount
                                }
                              </span>

                              <span
                                className={
                                  styles.text
                                }
                              >
                                {
                                  course.progress
                                }
                                %
                              </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">

                              <div
                                className={`h-full rounded-full ${
                                  course.fullyCompleted
                                    ? "bg-green-400"
                                    : styles.progress
                                }`}
                                style={{
                                  width: `${course.progress}%`,
                                }}
                              />

                            </div>

                          </div>

                          <p
                            className={`mt-5 text-sm font-semibold ${styles.text}`}
                          >
                            {course.fullyCompleted
                              ? "🏆 Review →"
                              : course.status ===
                                "Quiz Pending"
                              ? "🧠 Take Quiz →"
                              : "Continue →"}
                          </p>

                        </Link>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          )}

        </GlowCard>

      </section>

      {/* =====================================================
          ACTIVITY + FAVORITES
      ===================================================== */}

      <section className="mx-auto mb-12 grid max-w-7xl gap-6 lg:grid-cols-2">

        <GlowCard
          glow="purple"
          className="p-6"
        >

          <h2 className="text-2xl font-bold">
            📊 Recent Activity
          </h2>

          {recentActivity.length ===
          0 ? (
            <div className="mt-6">
              <EmptyState
                icon="📊"
                title="No Activity Yet"
                text="Start exploring the website."
              />
            </div>
          ) : (
            <div className="mt-6 space-y-3">

              {recentActivity
                .slice(0, 5)
                .map(
                  (
                    item,
                    index
                  ) => (
                    <Link
                      key={
                        item.id ||
                        index
                      }
                      to={
                        item.link ||
                        "/dashboard"
                      }
                      className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <span className="text-2xl">
                          {item.icon ||
                            "⚡"}
                        </span>

                        <div className="min-w-0">

                          <p className="truncate font-semibold">
                            {item.title ||
                              "Activity"}
                          </p>

                          <p className="truncate text-sm text-gray-600">
                            {item.description ||
                              "Recent activity"}
                          </p>

                        </div>

                      </div>

                      <span className="hidden text-xs text-gray-600 sm:block">
                        {formatActivityTime(
                          item.createdAt
                        )}
                      </span>

                    </Link>
                  )
                )}

            </div>
          )}

        </GlowCard>

        <GlowCard
          glow="pink"
          className="p-6"
        >

          <h2 className="text-2xl font-bold">
            ⭐ Favorite AI Tools
          </h2>

          {favoriteTools.length ===
          0 ? (
            <div className="mt-6">
              <EmptyState
                icon="🤍"
                title="No Favorites"
                text="Save your favorite AI tools."
                link="/ai-tools"
                linkText="Explore Tools →"
              />
            </div>
          ) : (
            <div className="mt-6 space-y-3">

              {favoriteTools.map(
                (tool) => (
                  <Link
                    key={tool.id}
                    to={`/ai-tools/${tool.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                  >

                    <span className="text-3xl">
                      {tool.icon}
                    </span>

                    <div>

                      <p className="font-semibold">
                        {tool.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        {
                          tool.category
                        }
                      </p>

                    </div>

                  </Link>
                )
              )}

            </div>
          )}

        </GlowCard>

      </section>

      {/* =====================================================
          TRENDING
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <h2 className="text-3xl font-black">
          🔥 Trending AI Tools
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">

          {trendingTools.map(
            (tool) => (
              <Link
                key={tool.id}
                to={`/ai-tools/${tool.id}`}
              >

                <GlowCard
                  glow="cyan"
                  className="group p-6"
                >

                  <div className="text-5xl transition group-hover:scale-110">
                    {tool.icon}
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {tool.name}
                  </h3>

                  <p className="mt-2 text-gray-500">
                    {
                      tool.category
                    }
                  </p>

                  <p className="mt-5 text-sm font-semibold text-cyan-300">
                    Explore →
                  </p>

                </GlowCard>

              </Link>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          RECENTLY VISITED
      ===================================================== */}

      <section className="mx-auto mb-12 max-w-7xl">

        <h2 className="text-3xl font-black">
          🕒 Recently Visited
        </h2>

        {recentlyVisited.length ===
        0 ? (
          <div className="mt-6">
            <EmptyState
              icon="🕒"
              title="No Recent Tools"
              text="Open AI tools and they will appear here."
              link="/ai-tools"
              linkText="Explore Tools →"
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {recentlyVisited
              .slice(0, 3)
              .map((tool) => (
                <Link
                  key={tool.id}
                  to={`/ai-tools/${tool.id}`}
                >

                  <GlowCard
                    glow="cyan"
                    className="p-6"
                  >

                    <div className="text-4xl">
                      {tool.icon ||
                        "🤖"}
                    </div>

                    <h3 className="mt-4 text-xl font-bold">
                      {tool.name ||
                        "AI Tool"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {tool.category ||
                        "AI Tool"}
                    </p>

                  </GlowCard>

                </Link>
              ))}

          </div>
        )}

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="mx-auto max-w-7xl pb-8">

        <h2 className="text-3xl font-black">
          ⚡ Quick Actions
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {[
            {
              icon: "🤖",
              title:
                "Explore AI Tools",
              link: "/ai-tools",
              glow: "cyan",
            },
            {
              icon: "✨",
              title:
                "Prompt Library",
              link: "/prompts",
              glow: "pink",
            },
            {
              icon: "🎓",
              title:
                "Continue Learning",
              link: "/courses",
              glow: "green",
            },
            {
              icon: "📰",
              title:
                "Latest AI News",
              link: "/ai-news",
              glow: "purple",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.link}
            >

              <GlowCard
                glow={item.glow}
                className="p-6"
              >

                <div className="text-4xl">
                  {item.icon}
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm text-cyan-300">
                  Open →
                </p>

              </GlowCard>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================================
          CLEAR MODAL
      ===================================================== */}

      {showClearConfirm && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl"
          onClick={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !isClearing
            ) {
              setShowClearConfirm(
                false
              );
            }
          }}
        >

          <div className="w-full max-w-md rounded-3xl border border-red-400/30 bg-[#090913] p-8 text-center">

            <div className="text-5xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Clear Dashboard Memory?
            </h2>

            <p className="mt-3 leading-7 text-gray-500">
              Favorites, prompts,
              news, course progress,
              XP and streak data will
              be reset.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              <button
                disabled={isClearing}
                onClick={() =>
                  setShowClearConfirm(
                    false
                  )
                }
                className="rounded-xl border border-white/10 bg-white/[0.04] py-3"
              >
                Cancel
              </button>

              <button
                disabled={isClearing}
                onClick={
                  handleClearMemory
                }
                className="rounded-xl border border-red-400/30 bg-red-400/10 py-3 font-bold text-red-300"
              >
                {isClearing
                  ? "Clearing..."
                  : "Clear All"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Dashboard;