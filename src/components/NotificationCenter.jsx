import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getFavoriteTools,
  getRecentActivity,
  getSavedPrompts,
  getCompletedCourseCount,
  getCompletedCourses,
  getNewsRead,
  getToolsExploredCount,
} from "../utils/dashboardStorage";

/* =========================================================
   STORAGE KEYS
========================================================= */

const NOTIFICATION_KEY =
  "aft_smart_notifications";

const GAMIFICATION_KEY =
  "aft_gamification";

/* =========================================================
   AI TOOL DATA
========================================================= */

const toolLibrary = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: "💎",
  },
  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "🎨",
  },
  {
    id: "runway",
    name: "Runway",
    icon: "🎬",
  },
  {
    id: "suno",
    name: "Suno AI",
    icon: "🎵",
  },
];

/* =========================================================
   NEWS DATA
========================================================= */

const newsLibrary = [
  {
    id: "1",
    title: "AI is changing the future",
    icon: "🚀",
  },
  {
    id: "2",
    title: "AI Agents are growing fast",
    icon: "🤖",
  },
  {
    id: "3",
    title:
      "AI Image Generation is evolving",
    icon: "🎨",
  },
  {
    id: "4",
    title:
      "AI Video Creation is becoming easier",
    icon: "🎬",
  },
  {
    id: "5",
    title:
      "AI Coding Tools are improving",
    icon: "💻",
  },
  {
    id: "6",
    title:
      "AI is becoming part of daily life",
    icon: "🧠",
  },
];

/* =========================================================
   COURSES
========================================================= */

const courseLibrary = [
  {
    id: "ai-tools-for-beginners",
    title: "AI Tools for Beginners",
    icon: "🤖",
    lessonCount: 5,
  },
  {
    id:
      "prompt-engineering-masterclass",
    title:
      "Prompt Engineering Masterclass",
    icon: "✨",
    lessonCount: 5,
  },
  {
    id: "ai-image-generation",
    title: "AI Image Generation",
    icon: "🎨",
    lessonCount: 5,
  },
  {
    id: "ai-video-creation",
    title: "AI Video Creation",
    icon: "🎬",
    lessonCount: 5,
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    icon: "⚡",
    lessonCount: 5,
  },
  {
    id: "ai-productivity",
    title: "AI Productivity",
    icon: "📈",
    lessonCount: 5,
  },
];

/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

function readArray(key) {
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

function writeNotifications(
  notifications
) {
  localStorage.setItem(
    NOTIFICATION_KEY,
    JSON.stringify(notifications)
  );
}

/* =========================================================
   DATE
========================================================= */

function getDateKey(
  date = new Date()
) {
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
   TIME FORMAT
========================================================= */

function formatTime(dateValue) {
  if (!dateValue) {
    return "Just now";
  }

  const created =
    new Date(dateValue);

  const now =
    new Date();

  const diff =
    now.getTime() -
    created.getTime();

  const seconds =
    Math.floor(diff / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return created.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
}

/* =========================================================
   LEVEL SYSTEM
========================================================= */

function getLevelInfo(xp) {
  const xpPerLevel = 500;

  const level =
    Math.floor(
      Math.max(0, xp) /
        xpPerLevel
    ) + 1;

  let rank =
    "AI Rookie";

  if (level >= 3) {
    rank = "AI Explorer";
  }

  if (level >= 5) {
    rank = "AI Builder";
  }

  if (level >= 8) {
    rank = "AI Pro";
  }

  if (level >= 12) {
    rank = "AI Master";
  }

  return {
    level,
    rank,
  };
}

/* =========================================================
   COLOR SYSTEM
========================================================= */

const notificationStyles = {
  achievement: {
    border:
      "border-yellow-400/20",
    bg:
      "bg-yellow-400/[0.06]",
    iconBg:
      "bg-yellow-400/10",
    text:
      "text-yellow-300",
  },

  level: {
    border:
      "border-purple-400/20",
    bg:
      "bg-purple-400/[0.06]",
    iconBg:
      "bg-purple-400/10",
    text:
      "text-purple-300",
  },

  streak: {
    border:
      "border-orange-400/20",
    bg:
      "bg-orange-400/[0.06]",
    iconBg:
      "bg-orange-400/10",
    text:
      "text-orange-300",
  },

  course: {
    border:
      "border-green-400/20",
    bg:
      "bg-green-400/[0.06]",
    iconBg:
      "bg-green-400/10",
    text:
      "text-green-300",
  },

  news: {
    border:
      "border-blue-400/20",
    bg:
      "bg-blue-400/[0.06]",
    iconBg:
      "bg-blue-400/10",
    text:
      "text-blue-300",
  },

  favorite: {
    border:
      "border-pink-400/20",
    bg:
      "bg-pink-400/[0.06]",
    iconBg:
      "bg-pink-400/10",
    text:
      "text-pink-300",
  },

  activity: {
    border:
      "border-cyan-400/20",
    bg:
      "bg-cyan-400/[0.05]",
    iconBg:
      "bg-cyan-400/10",
    text:
      "text-cyan-300",
  },
};

/* =========================================================
   MAIN
========================================================= */

function NotificationCenter() {
  const navigate =
    useNavigate();

  const [open, setOpen] =
    useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    quickStats,
    setQuickStats,
  ] = useState({
    favorites: 0,
    prompts: 0,
    activities: 0,
    courses: 0,
    xp: 0,
    level: 1,
    streak: 1,
  });

  /* =========================================================
     ADD NOTIFICATION
  ========================================================= */

  const addNotification =
    useCallback(
      (
        current,
        notification
      ) => {
        const exists =
          current.some(
            (item) =>
              item.key ===
              notification.key
          );

        if (exists) {
          return current;
        }

        const newItem = {
          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,

          createdAt:
            new Date().toISOString(),

          read: false,

          ...notification,
        };

        return [
          newItem,
          ...current,
        ].slice(0, 50);
      },
      []
    );

  /* =========================================================
     GENERATE SMART NOTIFICATIONS
  ========================================================= */

  const generateSmartNotifications =
    useCallback(() => {
      try {
        let current =
          readArray(
            NOTIFICATION_KEY
          );

        const favorites =
          getFavoriteTools() || [];

        const prompts =
          getSavedPrompts() || [];

        const activities =
          getRecentActivity() || [];

        const completedCourses =
          getCompletedCourses() || [];

        const courseCount =
          getCompletedCourseCount() ||
          0;

        const newsRead =
          getNewsRead() || [];

        const toolsExplored =
          getToolsExploredCount() ||
          0;

        const progressData =
          readObject(
            "aiCourseProgress"
          );

        const quizData =
          readObject(
            "aiCourseQuizResults"
          );

        const gameData =
          readObject(
            GAMIFICATION_KEY,
            {
              streak: 1,
            }
          );

        const streak =
          Number(
            gameData.streak
          ) || 1;

        /* ===============================================
           COMPLETED LESSONS
        =============================================== */

        let totalLessons = 0;

        courseLibrary.forEach(
          (course) => {
            const lessons =
              Array.isArray(
                progressData?.[
                  course.id
                ]?.completedLessons
              )
                ? progressData[
                    course.id
                  ]
                    .completedLessons
                : [];

            totalLessons +=
              lessons.length;
          }
        );

        /* ===============================================
           XP
        =============================================== */

        const xp =
          toolsExplored * 20 +
          favorites.length * 10 +
          prompts.length * 25 +
          newsRead.length * 15 +
          totalLessons * 40 +
          courseCount * 200 +
          streak * 10;

        const levelInfo =
          getLevelInfo(xp);

        /* ===============================================
           LEVEL UP
        =============================================== */

        if (
          levelInfo.level >= 2
        ) {
          current =
            addNotification(
              current,
              {
                key:
                  `level-${levelInfo.level}`,

                type: "level",

                icon: "⚡",

                title:
                  `Level ${levelInfo.level} Reached!`,

                message:
                  `You are now ${levelInfo.rank}. Keep exploring AI and earning XP.`,

                link:
                  "/dashboard",
              }
            );
        }

        /* ===============================================
           STREAK
        =============================================== */

        [
          3,
          7,
          14,
          30,
        ].forEach(
          (target) => {
            if (
              streak >= target
            ) {
              current =
                addNotification(
                  current,
                  {
                    key:
                      `streak-${target}`,

                    type:
                      "streak",

                    icon: "🔥",

                    title:
                      `${target}-Day Streak!`,

                    message:
                      `Amazing! You have maintained your AI learning streak for ${target} consecutive days.`,

                    link:
                      "/dashboard",
                  }
                );
            }
          }
        );

        /* ===============================================
           ACHIEVEMENTS
        =============================================== */

        const achievements =
          [
            {
              key:
                "achievement-ai-explorer",

              unlocked:
                toolsExplored >= 1,

              icon: "🤖",

              title:
                "Achievement Unlocked",

              message:
                "AI Explorer — You explored your first AI tool.",
            },

            {
              key:
                "achievement-prompt-collector",

              unlocked:
                prompts.length >= 3,

              icon: "✨",

              title:
                "Achievement Unlocked",

              message:
                "Prompt Collector — You saved 3 AI prompts.",
            },

            {
              key:
                "achievement-ai-reader",

              unlocked:
                newsRead.length >= 3,

              icon: "📰",

              title:
                "Achievement Unlocked",

              message:
                "AI Reader — You read 3 AI news articles.",
            },

            {
              key:
                "achievement-learner",

              unlocked:
                totalLessons >= 1,

              icon: "🎓",

              title:
                "Achievement Unlocked",

              message:
                "Learner — You completed your first course lesson.",
            },

            {
              key:
                "achievement-course-master",

              unlocked:
                courseCount >= 1,

              icon: "🏆",

              title:
                "Achievement Unlocked",

              message:
                "Course Master — You completed your first AI course.",
            },

            {
              key:
                "achievement-seven-day",

              unlocked:
                streak >= 7,

              icon: "🔥",

              title:
                "Achievement Unlocked",

              message:
                "7 Day Streak — You stayed consistent for one full week.",
            },
          ];

        achievements.forEach(
          (achievement) => {
            if (
              achievement.unlocked
            ) {
              current =
                addNotification(
                  current,
                  {
                    key:
                      achievement.key,

                    type:
                      "achievement",

                    icon:
                      achievement.icon,

                    title:
                      achievement.title,

                    message:
                      achievement.message,

                    link:
                      "/dashboard",
                  }
                );
            }
          }
        );

        /* ===============================================
           COURSE PROGRESS
        =============================================== */

        courseLibrary.forEach(
          (course) => {
            const lessons =
              Array.isArray(
                progressData?.[
                  course.id
                ]?.completedLessons
              )
                ? progressData[
                    course.id
                  ]
                    .completedLessons
                : [];

            const percentage =
              Math.round(
                (Math.min(
                  lessons.length,
                  course.lessonCount
                ) /
                  course.lessonCount) *
                  100
              );

            [
              40,
              60,
              80,
              100,
            ].forEach(
              (milestone) => {
                if (
                  percentage >=
                  milestone
                ) {
                  current =
                    addNotification(
                      current,
                      {
                        key:
                          `course-${course.id}-${milestone}`,

                        type:
                          "course",

                        icon:
                          course.icon,

                        title:
                          milestone ===
                          100
                            ? "Lessons Completed!"
                            : "Course Progress",

                        message:
                          milestone ===
                          100
                            ? `${course.title} lessons are 100% complete. Finish the quiz to complete the course.`
                            : `${course.title} is now ${milestone}% complete.`,

                        link:
                          `/courses/${course.id}`,
                      }
                    );
                }
              }
            );

            const quiz =
              quizData?.[
                course.id
              ];

            if (
              quiz?.passed ===
              true
            ) {
              current =
                addNotification(
                  current,
                  {
                    key:
                      `quiz-passed-${course.id}`,

                    type:
                      "course",

                    icon: "🏆",

                    title:
                      "Course Completed!",

                    message:
                      `Congratulations! You passed ${course.title} and completed the course.`,

                    link:
                      `/courses/${course.id}`,
                  }
                );
            }
          }
        );

        /* ===============================================
           COMPLETED COURSES
        =============================================== */

        completedCourses.forEach(
          (courseId) => {
            const course =
              courseLibrary.find(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(
                    courseId
                  )
              );

            if (!course) {
              return;
            }

            current =
              addNotification(
                current,
                {
                  key:
                    `completed-${course.id}`,

                  type:
                    "course",

                  icon: "🏆",

                  title:
                    "Course Completed",

                  message:
                    `${course.title} has been added to your completed courses.`,

                  link:
                    `/courses/${course.id}`,
                }
              );
          }
        );

        /* ===============================================
           NEWS HISTORY
        =============================================== */

        newsRead.forEach(
          (newsId) => {
            const item =
              newsLibrary.find(
                (news) =>
                  String(
                    news.id
                  ) ===
                  String(newsId)
              );

            if (!item) {
              return;
            }

            current =
              addNotification(
                current,
                {
                  key:
                    `news-read-${item.id}`,

                  type: "news",

                  icon:
                    item.icon,

                  title:
                    "AI News Read",

                  message:
                    `${item.title} was added to your reading history.`,

                  link:
                    `/ai-news/${item.id}`,
                }
              );
          }
        );

        /* ===============================================
           FAVORITES
        =============================================== */

        favorites.forEach(
          (toolId) => {
            const tool =
              toolLibrary.find(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(
                    toolId
                  )
              );

            if (!tool) {
              return;
            }

            current =
              addNotification(
                current,
                {
                  key:
                    `favorite-${tool.id}`,

                  type:
                    "favorite",

                  icon:
                    tool.icon,

                  title:
                    "Tool Saved",

                  message:
                    `${tool.name} is now in your favorite AI tools.`,

                  link:
                    `/ai-tools/${tool.id}`,
                }
              );
          }
        );

        /* ===============================================
           QUICK STATS
        =============================================== */

        setQuickStats({
          favorites:
            favorites.length,

          prompts:
            prompts.length,

          activities:
            activities.length,

          courses:
            courseCount,

          xp,

          level:
            levelInfo.level,

          streak,
        });

        writeNotifications(
          current
        );

        setNotifications(
          current
        );
      } catch (error) {
        console.error(
          "Smart Notification Error:",
          error
        );
      }
    }, [
      addNotification,
    ]);

  /* =========================================================
     INITIAL LOAD + LIVE UPDATE
  ========================================================= */

  useEffect(() => {
    generateSmartNotifications();

    const handleUpdate = () => {
      generateSmartNotifications();
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
    generateSmartNotifications,
  ]);

  /* =========================================================
     UNREAD
  ========================================================= */

  const unreadCount =
    useMemo(() => {
      return notifications.filter(
        (item) =>
          !item.read
      ).length;
    }, [notifications]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredNotifications =
    useMemo(() => {
      if (
        activeFilter === "all"
      ) {
        return notifications;
      }

      if (
        activeFilter ===
        "unread"
      ) {
        return notifications.filter(
          (item) =>
            !item.read
        );
      }

      return notifications.filter(
        (item) =>
          item.type ===
          activeFilter
      );
    }, [
      notifications,
      activeFilter,
    ]);

  /* =========================================================
     OPEN
  ========================================================= */

  const handleOpen = () => {
    generateSmartNotifications();
    setOpen(true);
  };

  /* =========================================================
     READ ONE
  ========================================================= */

  const markAsRead = (
    id
  ) => {
    const updated =
      notifications.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                read: true,
              }
            : item
      );

    setNotifications(
      updated
    );

    writeNotifications(
      updated
    );
  };

  /* =========================================================
     OPEN NOTIFICATION
  ========================================================= */

  const handleNotificationClick =
    (notification) => {
      markAsRead(
        notification.id
      );

      setOpen(false);

      if (
        notification.link
      ) {
        navigate(
          notification.link
        );
      }
    };

  /* =========================================================
     MARK ALL READ
  ========================================================= */

  const markAllRead = () => {
    const updated =
      notifications.map(
        (item) => ({
          ...item,
          read: true,
        })
      );

    setNotifications(
      updated
    );

    writeNotifications(
      updated
    );
  };

  /* =========================================================
     DELETE ONE
  ========================================================= */

  const deleteNotification =
    (
      event,
      notificationId
    ) => {
      event.stopPropagation();

      const updated =
        notifications.filter(
          (item) =>
            item.id !==
            notificationId
        );

      setNotifications(
        updated
      );

      writeNotifications(
        updated
      );
    };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const clearNotifications =
    () => {
      setNotifications([]);

      writeNotifications([]);
    };

  /* =========================================================
     FILTER BUTTONS
  ========================================================= */

  const filters = [
    {
      id: "all",
      label: "All",
      icon: "🔔",
    },
    {
      id: "unread",
      label: "Unread",
      icon: "🔴",
    },
    {
      id: "achievement",
      label: "Badges",
      icon: "🏆",
    },
    {
      id: "course",
      label: "Courses",
      icon: "🎓",
    },
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>

      {/* =====================================================
          FLOATING BELL
      ===================================================== */}

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open notification center"
        className="
          fixed
          right-6
          top-[115px]
          z-[9000]

          group

          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          border
          border-purple-400/40

          bg-black/80
          backdrop-blur-xl

          text-2xl

          shadow-[0_0_30px_rgba(168,85,247,.18)]

          transition-all
          duration-300

          hover:-translate-y-1
          hover:border-purple-300
          hover:shadow-[0_0_40px_rgba(168,85,247,.35)]
        "
      >

        <span className="transition-transform duration-300 group-hover:rotate-12">
          🔔
        </span>

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1

              flex
              h-[23px]
              min-w-[23px]
              items-center
              justify-center

              rounded-full

              border-2
              border-black

              bg-pink-500

              px-1

              text-[10px]
              font-black
              text-white

              shadow-[0_0_15px_rgba(236,72,153,.45)]

              animate-pulse
            "
          >
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}

      </button>

      {/* =====================================================
          BACKDROP
      ===================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[99990]

            bg-black/70
            backdrop-blur-sm
          "
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* =====================================================
          DRAWER
      ===================================================== */}

      <aside
        className={`
          fixed
          right-0
          top-0

          z-[99999]

          h-full

          w-full
          sm:w-[450px]

          border-l
          border-white/10

          bg-[#070914]/95
          backdrop-blur-2xl

          shadow-[-30px_0_80px_rgba(0,0,0,.55)]

          transition-transform
          duration-500
          ease-out

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-white/10 px-5 py-5 sm:px-6">

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-bold text-purple-300">
                ⚡ AI FUTURE TAMIL
              </div>

              <h2 className="text-2xl font-black">
                Smart Notifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your AI journey updates
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-white/10

                bg-white/[0.04]

                text-xl
                text-gray-400

                transition

                hover:border-red-400/40
                hover:bg-red-500/10
                hover:text-red-300
              "
            >
              ✕
            </button>

          </div>

          {/* HEADER ACTIONS */}

          <div className="mt-5 flex flex-wrap items-center gap-3">

            <div className="rounded-full border border-pink-400/20 bg-pink-400/10 px-3 py-1.5 text-xs font-bold text-pink-300">
              {unreadCount} unread
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                ✓ Mark all as read
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            SCROLL CONTENT
        ================================================= */}

        <div className="h-[calc(100%-151px)] overflow-y-auto px-5 py-6">

          {/* =================================================
              JOURNEY STATS
          ================================================= */}

          <div className="mb-7 grid grid-cols-2 gap-3">

            <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.06] p-4">

              <p className="text-2xl">
                ⚡
              </p>

              <p className="mt-3 text-2xl font-black text-purple-300">
                {quickStats.xp}
              </p>

              <p className="text-xs text-gray-500">
                Total XP
              </p>

            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">

              <p className="text-2xl">
                🚀
              </p>

              <p className="mt-3 text-2xl font-black text-cyan-300">
                Level{" "}
                {quickStats.level}
              </p>

              <p className="text-xs text-gray-500">
                Current Level
              </p>

            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.06] p-4">

              <p className="text-2xl">
                🔥
              </p>

              <p className="mt-3 text-2xl font-black text-orange-300">
                {
                  quickStats.streak
                }
              </p>

              <p className="text-xs text-gray-500">
                Day Streak
              </p>

            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.06] p-4">

              <p className="text-2xl">
                🎓
              </p>

              <p className="mt-3 text-2xl font-black text-green-300">
                {
                  quickStats.courses
                }
              </p>

              <p className="text-xs text-gray-500">
                Courses Done
              </p>

            </div>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-6">

            <div className="flex gap-2 overflow-x-auto pb-2">

              {filters.map(
                (filter) => (
                  <button
                    key={
                      filter.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveFilter(
                        filter.id
                      )
                    }
                    className={`
                      whitespace-nowrap
                      rounded-full
                      border
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      transition

                      ${
                        activeFilter ===
                        filter.id
                          ? "border-purple-400/50 bg-purple-400/15 text-purple-300"
                          : "border-white/10 bg-white/[0.03] text-gray-500 hover:border-white/20 hover:text-gray-300"
                      }
                    `}
                  >
                    {filter.icon}{" "}
                    {filter.label}
                  </button>
                )
              )}

            </div>

          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="mb-4 flex items-center justify-between gap-3">

            <h3 className="font-bold">
              🔔 Notifications
            </h3>

            {notifications.length >
              0 && (
              <button
                type="button"
                onClick={
                  clearNotifications
                }
                className="text-xs font-semibold text-red-300 transition hover:text-red-200"
              >
                Clear all
              </button>
            )}

          </div>

          {/* =================================================
              NOTIFICATION LIST
          ================================================= */}

          {filteredNotifications.length ===
          0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">

              <div className="text-5xl">
                🔕
              </div>

              <h3 className="mt-4 font-bold">
                No notifications
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore tools, learn courses
                and keep building your AI
                journey.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {filteredNotifications.map(
                (
                  notification
                ) => {
                  const style =
                    notificationStyles[
                      notification.type
                    ] ||
                    notificationStyles.activity;

                  return (
                    <button
                      key={
                        notification.id
                      }
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className={`
                        group
                        relative

                        w-full

                        rounded-2xl
                        border

                        p-4

                        text-left

                        transition-all
                        duration-300

                        hover:translate-x-1

                        ${style.border}
                        ${style.bg}

                        ${
                          notification.read
                            ? "opacity-55"
                            : "opacity-100"
                        }
                      `}
                    >

                      {/* UNREAD DOT */}

                      {!notification.read && (
                        <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,.8)]" />
                      )}

                      <div className="flex items-start gap-4">

                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center

                            rounded-xl

                            text-2xl

                            ${style.iconBg}
                          `}
                        >
                          {notification.icon ||
                            "🔔"}
                        </div>

                        <div className="min-w-0 flex-1 pr-5">

                          <p
                            className={`text-xs font-bold uppercase tracking-wide ${style.text}`}
                          >
                            {notification.type ||
                              "Update"}
                          </p>

                          <h4 className="mt-1 font-bold text-white">
                            {
                              notification.title
                            }
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-gray-500">
                            {
                              notification.message
                            }
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">

                            <span className="text-[11px] text-gray-700">
                              {formatTime(
                                notification.createdAt
                              )}
                            </span>

                            {notification.link && (
                              <span
                                className={`text-xs font-semibold ${style.text}`}
                              >
                                View →
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* DELETE */}

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(
                          event
                        ) =>
                          deleteNotification(
                            event,
                            notification.id
                          )
                        }
                        onKeyDown={(
                          event
                        ) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            deleteNotification(
                              event,
                              notification.id
                            );
                          }
                        }}
                        className="
                          absolute
                          bottom-3
                          right-3

                          flex
                          h-8
                          w-8
                          items-center
                          justify-center

                          rounded-lg

                          text-xs
                          text-gray-700

                          opacity-0

                          transition

                          hover:bg-red-400/10
                          hover:text-red-300

                          group-hover:opacity-100
                        "
                      >
                        ✕
                      </span>

                    </button>
                  );
                }
              )}

            </div>
          )}

          {/* =================================================
              QUICK STATS
          ================================================= */}

          <div className="mt-8">

            <h3 className="mb-4 font-bold">
              📊 Your Activity
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-pink-400/15 bg-pink-400/[0.05] p-4">

                <p className="text-2xl">
                  ❤️
                </p>

                <p className="mt-2 text-xl font-black">
                  {
                    quickStats.favorites
                  }
                </p>

                <p className="text-xs text-gray-500">
                  Favorite Tools
                </p>

              </div>

              <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4">

                <p className="text-2xl">
                  ✨
                </p>

                <p className="mt-2 text-xl font-black">
                  {
                    quickStats.prompts
                  }
                </p>

                <p className="text-xs text-gray-500">
                  Saved Prompts
                </p>

              </div>

              <div className="rounded-2xl border border-purple-400/15 bg-purple-400/[0.05] p-4">

                <p className="text-2xl">
                  📊
                </p>

                <p className="mt-2 text-xl font-black">
                  {
                    quickStats.activities
                  }
                </p>

                <p className="text-xs text-gray-500">
                  Recent Activities
                </p>

              </div>

              <div className="rounded-2xl border border-green-400/15 bg-green-400/[0.05] p-4">

                <p className="text-2xl">
                  🎓
                </p>

                <p className="mt-2 text-xl font-black">
                  {
                    quickStats.courses
                  }
                </p>

                <p className="text-xs text-gray-500">
                  Courses Done
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              FOOTER CARD
          ================================================= */}

          <div className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.08] via-purple-500/[0.05] to-pink-500/[0.08] p-6">

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/10 blur-2xl" />

            <div className="relative">

              <div className="text-3xl">
                🚀
              </div>

              <h3 className="mt-3 text-xl font-bold">
                Keep Exploring
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Explore AI tools, save
                useful prompts, read AI
                news and continue your
                courses to unlock more
                achievements.
              </p>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);

                  navigate(
                    "/dashboard"
                  );
                }}
                className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/15"
              >
                Open Dashboard →
              </button>

            </div>

          </div>

          <div className="h-10" />

        </div>

      </aside>

    </>
  );
}

export default NotificationCenter;