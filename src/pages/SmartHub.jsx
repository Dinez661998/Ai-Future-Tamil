import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getFavoriteTools,
  getSavedPrompts,
  getNewsRead,
  getCompletedCourses,
  getRecentlyVisitedTools,
  addRecentActivity,
} from "../utils/dashboardStorage";

/* =========================================================
   STORAGE
========================================================= */

const MISSION_KEY =
  "aft_mission_center_v1";

const BONUS_XP_KEY =
  "aft_bonus_xp";

/* =========================================================
   TOOLS
========================================================= */

const tools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    category: "AI Chat",
    description:
      "Writing, coding, learning and productivity.",
    path: "/ai-tools/chatgpt",
    skills: [
      "writing",
      "coding",
      "study",
      "research",
      "productivity",
    ],
  },

  {
    id: "gemini",
    name: "Gemini",
    icon: "💎",
    category: "AI Chat",
    description:
      "Research, learning and everyday AI tasks.",
    path: "/ai-tools/gemini",
    skills: [
      "writing",
      "study",
      "research",
      "productivity",
    ],
  },

  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
    category: "AI Chat",
    description:
      "Writing, analysis and coding.",
    path: "/ai-tools/claude",
    skills: [
      "writing",
      "coding",
      "research",
      "analysis",
    ],
  },

  {
    id: "midjourney",
    name: "Midjourney",
    icon: "🎨",
    category: "AI Image",
    description:
      "Professional AI image generation.",
    path: "/ai-tools/midjourney",
    skills: [
      "image",
      "design",
      "thumbnail",
      "creator",
    ],
  },

  {
    id: "runway",
    name: "Runway",
    icon: "🎬",
    category: "AI Video",
    description:
      "AI video generation and editing.",
    path: "/ai-tools/runway",
    skills: [
      "video",
      "editing",
      "animation",
      "creator",
    ],
  },

  {
    id: "suno",
    name: "Suno AI",
    icon: "🎵",
    category: "AI Music",
    description:
      "Generate music and songs using AI.",
    path: "/ai-tools/suno",
    skills: [
      "music",
      "audio",
      "song",
      "creator",
    ],
  },
];

/* =========================================================
   PROMPT TYPES
========================================================= */

const promptTypes = [
  {
    id: "youtube",
    icon: "🎬",
    label: "YouTube Script",
  },

  {
    id: "image",
    icon: "🎨",
    label: "AI Image",
  },

  {
    id: "coding",
    icon: "💻",
    label: "Coding",
  },

  {
    id: "study",
    icon: "📚",
    label: "Study",
  },

  {
    id: "marketing",
    icon: "📢",
    label: "Marketing",
  },

  {
    id: "business",
    icon: "💡",
    label: "Business",
  },
];

/* =========================================================
   COURSES
========================================================= */

const courseNames = {
  "ai-tools-for-beginners":
    "AI Tools for Beginners",

  "prompt-engineering-masterclass":
    "Prompt Engineering Masterclass",

  "ai-image-generation":
    "AI Image Generation",

  "ai-video-creation":
    "AI Video Creation",

  "ai-automation":
    "AI Automation",

  "ai-productivity":
    "AI Productivity",
};

/* =========================================================
   DAILY MISSIONS
========================================================= */

const dailyMissions = [
  {
    id: "chatgpt-titles",
    icon: "🤖",
    title:
      "Create 5 YouTube Titles with AI",
    tamil:
      "AI பயன்படுத்தி 5 YouTube title உருவாக்குங்கள்",
    description:
      "Open an AI chat tool and create five engaging YouTube video titles.",
    xp: 100,
    time: "10 min",
    path: "/ai-tools/chatgpt",
    button: "Open ChatGPT",
  },

  {
    id: "prompt-explorer",
    icon: "✨",
    title:
      "Try One Professional Prompt",
    tamil:
      "ஒரு professional AI prompt முயற்சி செய்யுங்கள்",
    description:
      "Explore the prompt library and try one useful prompt.",
    xp: 80,
    time: "8 min",
    path: "/prompts",
    button: "Explore Prompts",
  },

  {
    id: "image-mission",
    icon: "🎨",
    title:
      "Create an AI Image Idea",
    tamil:
      "ஒரு AI image idea உருவாக்குங்கள்",
    description:
      "Explore an AI image tool and create one creative image concept.",
    xp: 120,
    time: "12 min",
    path: "/ai-images",
    button: "Explore AI Images",
  },

  {
    id: "course-mission",
    icon: "🎓",
    title:
      "Learn One AI Lesson",
    tamil:
      "ஒரு AI lesson கற்றுக்கொள்ளுங்கள்",
    description:
      "Open any AI course and complete or study one lesson.",
    xp: 120,
    time: "15 min",
    path: "/courses",
    button: "Open Courses",
  },

  {
    id: "video-mission",
    icon: "🎬",
    title:
      "Discover an AI Video Tool",
    tamil:
      "ஒரு AI video tool-ஐ கண்டுபிடியுங்கள்",
    description:
      "Explore AI video creation and learn what one tool can do.",
    xp: 100,
    time: "10 min",
    path: "/ai-videos",
    button: "Explore AI Video",
  },

  {
    id: "news-mission",
    icon: "📰",
    title:
      "Read One AI Update",
    tamil:
      "ஒரு AI செய்தியை படியுங்கள்",
    description:
      "Read one AI news article and learn something new.",
    xp: 70,
    time: "5 min",
    path: "/ai-news",
    button: "Read AI News",
  },

  {
    id: "creator-mission",
    icon: "🚀",
    title:
      "Build One Creator Idea",
    tamil:
      "ஒரு content creator idea உருவாக்குங்கள்",
    description:
      "Use an AI tool or prompt to create one new content idea.",
    xp: 130,
    time: "15 min",
    path: "/prompts",
    button: "Start Creating",
  },
];

/* =========================================================
   MYSTERY MISSIONS
========================================================= */

const mysteryMissions = [
  {
    id: "mystery-suno",
    icon: "🎵",
    title:
      "Create a Song Concept",
    tamil:
      "ஒரு song concept உருவாக்குங்கள்",
    description:
      "Think of a song title, mood and theme. Then explore Suno AI.",
    xp: 150,
    time: "12 min",
    path: "/ai-tools/suno",
  },

  {
    id: "mystery-code",
    icon: "💻",
    title:
      "Ask AI to Improve Code",
    tamil:
      "AI மூலம் code improve செய்யுங்கள்",
    description:
      "Take a small piece of code and ask an AI coding assistant to improve it.",
    xp: 160,
    time: "15 min",
    path: "/prompts",
  },

  {
    id: "mystery-thumbnail",
    icon: "🖼️",
    title:
      "Design a Thumbnail Idea",
    tamil:
      "ஒரு thumbnail idea உருவாக்குங்கள்",
    description:
      "Create one clickable thumbnail concept using an AI image idea.",
    xp: 150,
    time: "12 min",
    path: "/creators/thumbnails",
  },

  {
    id: "mystery-productivity",
    icon: "⚡",
    title:
      "Save 15 Minutes with AI",
    tamil:
      "AI மூலம் 15 நிமிடம் நேரம் சேமியுங்கள்",
    description:
      "Find one repetitive task and use AI to make it faster.",
    xp: 180,
    time: "15 min",
    path: "/ai-tools",
  },
];

/* =========================================================
   7 DAY CHALLENGE
========================================================= */

const sevenDayChallenge = [
  {
    day: 1,
    icon: "🤖",
    title: "Explore an AI Tool",
    path: "/ai-tools",
  },

  {
    day: 2,
    icon: "✨",
    title: "Try an AI Prompt",
    path: "/prompts",
  },

  {
    day: 3,
    icon: "🎨",
    title: "Explore AI Images",
    path: "/ai-images",
  },

  {
    day: 4,
    icon: "🎬",
    title: "Explore AI Videos",
    path: "/ai-videos",
  },

  {
    day: 5,
    icon: "📚",
    title: "Study an AI Lesson",
    path: "/courses",
  },

  {
    day: 6,
    icon: "📰",
    title: "Read AI News",
    path: "/ai-news",
  },

  {
    day: 7,
    icon: "🏆",
    title: "Build Something with AI",
    path: "/smart-hub",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function readJSON(
  key,
  fallback
) {
  try {
    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(
  key,
  value
) {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}

function getDateKey(
  date = new Date()
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getYesterdayKey() {
  const date =
    new Date();

  date.setDate(
    date.getDate() - 1
  );

  return getDateKey(date);
}

function getDayNumber() {
  const now =
    new Date();

  const start =
    new Date(
      now.getFullYear(),
      0,
      0
    );

  const difference =
    now - start;

  return Math.floor(
    difference /
      (1000 *
        60 *
        60 *
        24)
  );
}

function defaultMissionState() {
  return {
    totalXP: 0,

    streak: 0,

    bestStreak: 0,

    lastMissionDate: "",

    completedMissionIds: [],

    completedDates: [],

    mysteryCompletedIds: [],

    mysteryRevealDate: "",

    mysteryRevealed: false,

    sevenDayStartDate: "",

    sevenDayCompleted:
      [],

    badges: [],
  };
}

/* =========================================================
   JOURNEY
========================================================= */

function getJourney(
  xp
) {
  if (xp >= 2500) {
    return {
      level: 4,
      icon: "👑",
      title: "AI Pro",
      next: "Master",
      minimum: 2500,
      maximum: 4000,
    };
  }

  if (xp >= 1200) {
    return {
      level: 3,
      icon: "⚡",
      title: "AI Creator",
      next: "AI Pro",
      minimum: 1200,
      maximum: 2500,
    };
  }

  if (xp >= 500) {
    return {
      level: 2,
      icon: "🚀",
      title: "AI Explorer",
      next: "AI Creator",
      minimum: 500,
      maximum: 1200,
    };
  }

  return {
    level: 1,
    icon: "🌱",
    title: "AI Beginner",
    next: "AI Explorer",
    minimum: 0,
    maximum: 500,
  };
}

/* =========================================================
   MAIN
========================================================= */

function SmartHub() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState("missions");

  const [
    missionState,
    setMissionState,
  ] =
    useState(
      defaultMissionState()
    );

  const [
    celebration,
    setCelebration,
  ] =
    useState("");

  /* =======================================================
     TOOL FINDER
  ======================================================= */

  const [
    toolGoal,
    setToolGoal,
  ] =
    useState("writing");

  /* =======================================================
     PROMPT
  ======================================================= */

  const [
    promptType,
    setPromptType,
  ] =
    useState("youtube");

  const [
    topic,
    setTopic,
  ] =
    useState("");

  const [
    tone,
    setTone,
  ] =
    useState("professional");

  const [
    generatedPrompt,
    setGeneratedPrompt,
  ] =
    useState("");

  /* =======================================================
     LIBRARY
  ======================================================= */

  const [
    favorites,
    setFavorites,
  ] =
    useState([]);

  const [
    savedPrompts,
    setSavedPrompts,
  ] =
    useState([]);

  const [
    readNews,
    setReadNews,
  ] =
    useState([]);

  const [
    completedCourses,
    setCompletedCourses,
  ] =
    useState([]);

  const [
    recentTools,
    setRecentTools,
  ] =
    useState([]);

  /* =======================================================
     TODAY
  ======================================================= */

  const today =
    getDateKey();

  const dayNumber =
    getDayNumber();

  const dailyMission =
    dailyMissions[
      dayNumber %
        dailyMissions.length
    ];

  const mysteryMission =
    mysteryMissions[
      dayNumber %
        mysteryMissions.length
    ];

  /* =======================================================
     LOAD
  ======================================================= */

  const loadData = () => {
    try {
      const stored =
        readJSON(
          MISSION_KEY,
          defaultMissionState()
        );

      setMissionState({
        ...defaultMissionState(),
        ...stored,
      });

      setFavorites(
        getFavoriteTools() ||
          []
      );

      setSavedPrompts(
        getSavedPrompts() ||
          []
      );

      setReadNews(
        getNewsRead() ||
          []
      );

      setCompletedCourses(
        getCompletedCourses() ||
          []
      );

      setRecentTools(
        getRecentlyVisitedTools() ||
          []
      );
    } catch (error) {
      console.error(
        "Smart Hub load error:",
        error
      );
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate =
      () => {
        loadData();
      };

    window.addEventListener(
      "dashboard-data-updated",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "dashboard-data-updated",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  /* =======================================================
     SAVE MISSION
  ======================================================= */

  const saveMissionState = (
    state
  ) => {
    saveJSON(
      MISSION_KEY,
      state
    );

    localStorage.setItem(
      BONUS_XP_KEY,
      String(
        state.totalXP ||
          0
      )
    );

    setMissionState(
      state
    );

    window.dispatchEvent(
      new Event(
        "dashboard-data-updated"
      )
    );
  };

  /* =======================================================
     CELEBRATION
  ======================================================= */

  const showCelebration = (
    message
  ) => {
    setCelebration(message);

    setTimeout(() => {
      setCelebration("");
    }, 3000);
  };

  /* =======================================================
     DAILY MISSION COMPLETE
  ======================================================= */

  const dailyCompleted =
    missionState
      .completedDates
      ?.includes(today);

  const completeDailyMission =
    () => {
      if (dailyCompleted) {
        return;
      }

      const yesterday =
        getYesterdayKey();

      let nextStreak = 1;

      if (
        missionState
          .lastMissionDate ===
        yesterday
      ) {
        nextStreak =
          (missionState.streak ||
            0) + 1;
      }

      if (
        missionState
          .lastMissionDate ===
        today
      ) {
        nextStreak =
          missionState.streak ||
          1;
      }

      const nextXP =
        (missionState.totalXP ||
          0) +
        dailyMission.xp;

      const nextState = {
        ...missionState,

        totalXP:
          nextXP,

        streak:
          nextStreak,

        bestStreak:
          Math.max(
            nextStreak,
            missionState.bestStreak ||
              0
          ),

        lastMissionDate:
          today,

        completedMissionIds:
          Array.from(
            new Set([
              ...(
                missionState
                  .completedMissionIds ||
                []
              ),

              dailyMission.id,
            ])
          ),

        completedDates:
          Array.from(
            new Set([
              ...(
                missionState
                  .completedDates ||
                []
              ),

              today,
            ])
          ),
      };

      saveMissionState(
        nextState
      );

      try {
        addRecentActivity({
          icon: "⚡",
          title:
            "Daily AI Mission Completed",
          description:
            `${dailyMission.title} • +${dailyMission.xp} XP`,
          type: "mission",
        });
      } catch {
        // Keep mission working
      }

      showCelebration(
        `🎉 Mission Complete! +${dailyMission.xp} XP`
      );
    };

  /* =======================================================
     MYSTERY REVEAL
  ======================================================= */

  const mysteryRevealed =
    missionState
      .mysteryRevealDate ===
      today &&
    missionState
      .mysteryRevealed ===
      true;

  const mysteryCompleted =
    missionState
      .mysteryCompletedIds
      ?.includes(
        `${today}-${mysteryMission.id}`
      );

  const revealMystery =
    () => {
      const nextState = {
        ...missionState,

        mysteryRevealDate:
          today,

        mysteryRevealed:
          true,
      };

      saveMissionState(
        nextState
      );
    };

  const completeMystery =
    () => {
      if (
        !mysteryRevealed ||
        mysteryCompleted
      ) {
        return;
      }

      const mysteryKey =
        `${today}-${mysteryMission.id}`;

      const nextState = {
        ...missionState,

        totalXP:
          (missionState.totalXP ||
            0) +
          mysteryMission.xp,

        mysteryCompletedIds:
          Array.from(
            new Set([
              ...(
                missionState
                  .mysteryCompletedIds ||
                []
              ),

              mysteryKey,
            ])
          ),
      };

      saveMissionState(
        nextState
      );

      showCelebration(
        `🎁 Mystery Mission Complete! +${mysteryMission.xp} XP`
      );
    };

  /* =======================================================
     7 DAY CHALLENGE
  ======================================================= */

  const sevenCompleted =
    missionState
      .sevenDayCompleted ||
    [];

  const sevenProgress =
    sevenCompleted.length;

  const startSevenDay =
    () => {
      if (
        missionState
          .sevenDayStartDate
      ) {
        return;
      }

      saveMissionState({
        ...missionState,

        sevenDayStartDate:
          today,

        sevenDayCompleted:
          [],
      });

      showCelebration(
        "🔥 7-Day AI Challenge Started!"
      );
    };

  const completeSevenDay =
    (day) => {
      if (
        !missionState
          .sevenDayStartDate
      ) {
        return;
      }

      if (
        sevenCompleted.includes(
          day
        )
      ) {
        return;
      }

      const expectedDay =
        sevenCompleted.length +
        1;

      if (
        day !== expectedDay
      ) {
        showCelebration(
          `🔒 Complete Day ${expectedDay} first`
        );

        return;
      }

      const reward =
        day === 7
          ? 300
          : 75;

      const updatedDays =
        [
          ...sevenCompleted,
          day,
        ];

      saveMissionState({
        ...missionState,

        totalXP:
          (missionState.totalXP ||
            0) +
          reward,

        sevenDayCompleted:
          updatedDays,
      });

      showCelebration(
        day === 7
          ? "🏆 7-Day Challenge Complete! +300 XP"
          : `🔥 Day ${day} Complete! +75 XP`
      );
    };

  /* =======================================================
     TOOL RECOMMENDATIONS
  ======================================================= */

  const recommendedTools =
    useMemo(() => {
      return tools
        .map((tool) => {
          let score = 0;

          if (
            tool.skills.includes(
              toolGoal
            )
          ) {
            score += 100;
          }

          if (
            toolGoal ===
              "creator" &&
            [
              "midjourney",
              "runway",
              "suno",
            ].includes(
              tool.id
            )
          ) {
            score += 80;
          }

          return {
            ...tool,
            score,
          };
        })
        .filter(
          (tool) =>
            tool.score > 0
        )
        .sort(
          (a, b) =>
            b.score -
            a.score
        );
    }, [
      toolGoal,
    ]);

  /* =======================================================
     PROMPT GENERATOR
  ======================================================= */

  const generatePrompt =
    () => {
      const subject =
        topic.trim() ||
        "[YOUR TOPIC]";

      const templates = {
        youtube:
          `Act as a professional YouTube script writer. Create an engaging YouTube video script about "${subject}". Tone: ${tone}. Include a powerful hook, introduction, main content, curiosity points, examples, conclusion and CTA.`,

        image:
          `Create a highly detailed cinematic AI image prompt for "${subject}". Include subject, environment, lighting, camera angle, composition, colors, mood and realistic details. Style: ${tone}.`,

        coding:
          `Act as an expert software developer. Solve the following coding task: "${subject}". Explain the solution simply, then provide clean final code with error handling and best practices.`,

        study:
          `Explain "${subject}" in very simple beginner-friendly language. Include key points, examples, important terms, a short summary and 5 practice questions.`,

        marketing:
          `Create engaging marketing content for "${subject}". Include 10 hooks, short captions, CTA, content ideas and suitable hashtags. Tone: ${tone}.`,

        business:
          `Generate practical online business ideas based on "${subject}". Explain the target audience, earning model, startup cost, tools needed and first 7 steps.`,
      };

      setGeneratedPrompt(
        templates[promptType]
      );
    };

  const copyPrompt =
    async () => {
      if (!generatedPrompt) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          generatedPrompt
        );

        showCelebration(
          "📋 Prompt Copied!"
        );
      } catch {
        alert(
          "Unable to copy prompt."
        );
      }
    };

  /* =======================================================
     JOURNEY
  ======================================================= */

  const journey =
    getJourney(
      missionState.totalXP ||
        0
    );

  const journeyRange =
    journey.maximum -
    journey.minimum;

  const journeyCurrent =
    Math.max(
      0,
      (missionState.totalXP ||
        0) -
        journey.minimum
    );

  const journeyProgress =
    journey.level >= 4
      ? 100
      : Math.min(
          100,
          Math.round(
            (journeyCurrent /
              journeyRange) *
              100
          )
        );

  /* =======================================================
     BADGES
  ======================================================= */

  const missionCount =
    missionState
      .completedDates
      ?.length || 0;

  const badges = [
    {
      icon: "🌱",
      title:
        "First Mission",
      description:
        "Complete your first mission",
      unlocked:
        missionCount >= 1,
    },

    {
      icon: "⚡",
      title:
        "AI Adventurer",
      description:
        "Complete 3 missions",
      unlocked:
        missionCount >= 3,
    },

    {
      icon: "🔥",
      title:
        "Mission Streak",
      description:
        "Reach a 3-day streak",
      unlocked:
        missionState.streak >=
        3,
    },

    {
      icon: "🎁",
      title:
        "Mystery Hunter",
      description:
        "Complete a mystery mission",
      unlocked:
        (
          missionState
            .mysteryCompletedIds ||
          []
        ).length >= 1,
    },

    {
      icon: "🏆",
      title:
        "7-Day Hero",
      description:
        "Complete the 7-Day AI Challenge",
      unlocked:
        sevenProgress >= 7,
    },

    {
      icon: "👑",
      title:
        "AI Pro",
      description:
        "Earn 2500 Mission XP",
      unlocked:
        missionState.totalXP >=
        2500,
    },
  ];

  const unlockedBadges =
    badges.filter(
      (badge) =>
        badge.unlocked
    ).length;

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "missions",
      icon: "⚡",
      label:
        "Mission Center",
    },

    {
      id: "finder",
      icon: "🎯",
      label:
        "Tool Finder",
    },

    {
      id: "prompt",
      icon: "✨",
      label:
        "Prompt Generator",
    },

    {
      id: "library",
      icon: "❤️",
      label:
        "My Library",
    },

    {
      id: "certificates",
      icon: "🏆",
      label:
        "Certificates",
    },
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        px-4
        py-10
        text-white
        sm:px-6
        lg:px-8
      "
    >
      {/* ===================================================
          CELEBRATION
      =================================================== */}

      {celebration && (
        <div
          className="
            fixed
            left-1/2
            top-24
            z-[9999]
            -translate-x-1/2
            rounded-2xl
            border
            border-pink-400/40
            bg-[#090711]/95
            px-6
            py-4
            text-center
            text-sm
            font-black
            text-white
            shadow-[0_0_40px_rgba(236,72,153,.28)]
            backdrop-blur-xl
          "
        >
          {celebration}
        </div>
      )}

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.08]
            bg-black/25
            p-6
            backdrop-blur-xl
            sm:p-8
            lg:p-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-80
              w-80
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-20
              h-72
              w-72
              rounded-full
              bg-cyan-500/[0.07]
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
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/[0.07]
                px-4
                py-2
                text-xs
                font-black
                text-cyan-300
              "
            >
              ⚡ AI FUTURE TAMIL
              SMART HUB
            </div>

            <h1
              className="
                mt-5
                max-w-4xl
                text-3xl
                font-black
                leading-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              Learn AI like a
              game.
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
                {" "}
                Complete Missions.
                Earn XP.
              </span>
            </h1>

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
              தினமும் ஒரு simple
              AI mission complete
              பண்ணு, XP earn பண்ணு,
              streak build பண்ணு,
              Beginner-லிருந்து AI
              Pro வரை grow ஆகு.
            </p>

            {/* STATS */}

            <div
              className="
                mt-7
                grid
                max-w-4xl
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-yellow-400/15
                  bg-yellow-400/[0.04]
                  p-4
                "
              >
                <p
                  className="
                    text-2xl
                    font-black
                    text-yellow-300
                  "
                >
                  {
                    missionState.totalXP ||
                    0
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Mission XP
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-orange-400/15
                  bg-orange-400/[0.04]
                  p-4
                "
              >
                <p
                  className="
                    text-2xl
                    font-black
                    text-orange-300
                  "
                >
                  🔥{" "}
                  {
                    missionState.streak ||
                    0
                  }
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Mission Streak
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.04]
                  p-4
                "
              >
                <p
                  className="
                    text-2xl
                    font-black
                    text-cyan-300
                  "
                >
                  {missionCount}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Missions Done
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-purple-400/15
                  bg-purple-400/[0.04]
                  p-4
                "
              >
                <p
                  className="
                    text-2xl
                    font-black
                    text-purple-300
                  "
                >
                  {unlockedBadges}/
                  {badges.length}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Badges
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            TABS
        ================================================= */}

        <div
          className="
            mt-6
            flex
            gap-2
            overflow-x-auto
            rounded-2xl
            border
            border-white/[0.07]
            bg-black/25
            p-2
            backdrop-blur-xl
          "
        >
          {tabs.map(
            (tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id
                  )
                }
                className={`
                  min-h-[46px]
                  shrink-0
                  rounded-xl
                  px-4
                  text-sm
                  font-bold
                  transition

                  ${
                    activeTab ===
                    tab.id
                      ? `
                        bg-gradient-to-r
                        from-cyan-400
                        to-blue-500
                        text-black
                      `
                      : `
                        text-gray-400
                        hover:bg-white/[0.05]
                        hover:text-white
                      `
                  }
                `}
              >
                {tab.icon}{" "}
                {tab.label}
              </button>
            )
          )}
        </div>

        {/* =================================================
            MISSIONS
        ================================================= */}

        {activeTab ===
          "missions" && (
          <div
            className="
              mt-6
              space-y-6
            "
          >
            {/* =============================================
                TODAY'S MISSION
            ============================================= */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-cyan-400/20
                bg-gradient-to-br
                from-cyan-500/[0.07]
                via-black/25
                to-purple-500/[0.07]
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                <div
                  className="
                    max-w-3xl
                  "
                >
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-3
                    "
                  >
                    <span
                      className="
                        rounded-full
                        border
                        border-cyan-400/25
                        bg-cyan-400/[0.08]
                        px-3
                        py-1.5
                        text-xs
                        font-black
                        text-cyan-300
                      "
                    >
                      🎯 TODAY'S AI
                      MISSION
                    </span>

                    <span
                      className="
                        rounded-full
                        border
                        border-yellow-400/20
                        bg-yellow-400/[0.06]
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-yellow-300
                      "
                    >
                      +{dailyMission.xp}
                      XP
                    </span>

                    <span
                      className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-gray-400
                      "
                    >
                      ⏱{" "}
                      {
                        dailyMission.time
                      }
                    </span>
                  </div>

                  <div
                    className="
                      mt-6
                      flex
                      items-start
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        h-16
                        w-16
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-cyan-400/20
                        bg-black/25
                        text-3xl
                      "
                    >
                      {
                        dailyMission.icon
                      }
                    </div>

                    <div>
                      <h2
                        className="
                          text-2xl
                          font-black
                          sm:text-3xl
                        "
                      >
                        {
                          dailyMission.title
                        }
                      </h2>

                      <p
                        className="
                          mt-2
                          text-sm
                          font-semibold
                          text-purple-300
                        "
                      >
                        {
                          dailyMission.tamil
                        }
                      </p>
                    </div>
                  </div>

                  <p
                    className="
                      mt-5
                      max-w-2xl
                      text-sm
                      leading-7
                      text-gray-400
                    "
                  >
                    {
                      dailyMission.description
                    }
                  </p>
                </div>

                <div
                  className="
                    flex
                    min-w-[230px]
                    flex-col
                    gap-3
                  "
                >
                  <Link
                    to={
                      dailyMission.path
                    }
                    className="
                      flex
                      min-h-[50px]
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      px-5
                      text-sm
                      font-black
                      text-black
                      transition
                      hover:-translate-y-0.5
                    "
                  >
                    🚀{" "}
                    {
                      dailyMission.button
                    }
                  </Link>

                  <button
                    type="button"
                    disabled={
                      dailyCompleted
                    }
                    onClick={
                      completeDailyMission
                    }
                    className={`
                      min-h-[50px]
                      rounded-xl
                      px-5
                      text-sm
                      font-black
                      transition

                      ${
                        dailyCompleted
                          ? `
                            cursor-not-allowed
                            border
                            border-green-400/25
                            bg-green-400/[0.07]
                            text-green-300
                          `
                          : `
                            bg-gradient-to-r
                            from-cyan-400
                            to-purple-500
                            text-black
                            hover:-translate-y-0.5
                          `
                      }
                    `}
                  >
                    {dailyCompleted
                      ? "✅ Mission Completed"
                      : `Complete +${dailyMission.xp} XP`}
                  </button>
                </div>
              </div>
            </section>

            {/* =============================================
                JOURNEY
            ============================================= */}

            <section
              className="
                rounded-[28px]
                border
                border-white/[0.08]
                bg-black/25
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      font-black
                      text-purple-300
                    "
                  >
                    🚀 YOUR AI JOURNEY
                  </p>

                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-black
                    "
                  >
                    {journey.icon}{" "}
                    {journey.title}
                    <span
                      className="
                        ml-2
                        text-sm
                        font-semibold
                        text-gray-600
                      "
                    >
                      Level{" "}
                      {
                        journey.level
                      }
                    </span>
                  </h2>
                </div>

                <div
                  className="
                    text-sm
                    font-bold
                    text-gray-500
                  "
                >
                  {
                    missionState.totalXP ||
                    0
                  }{" "}
                  XP
                </div>
              </div>

              <div
                className="
                  mt-6
                  h-3
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
                    via-purple-500
                    to-pink-500
                    transition-all
                    duration-700
                  "
                  style={{
                    width:
                      `${journeyProgress}%`,
                  }}
                />
              </div>

              <div
                className="
                  mt-3
                  flex
                  justify-between
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                <span>
                  {journey.title}
                </span>

                <span>
                  {journey.level >= 4
                    ? "AI Pro 👑"
                    : `Next: ${journey.next}`}
                </span>
              </div>

              <div
                className="
                  mt-7
                  grid
                  gap-3
                  sm:grid-cols-4
                "
              >
                {[
                  [
                    "🌱",
                    "AI Beginner",
                    1,
                  ],

                  [
                    "🚀",
                    "AI Explorer",
                    2,
                  ],

                  [
                    "⚡",
                    "AI Creator",
                    3,
                  ],

                  [
                    "👑",
                    "AI Pro",
                    4,
                  ],
                ].map(
                  ([
                    icon,
                    title,
                    level,
                  ]) => (
                    <div
                      key={title}
                      className={`
                        rounded-2xl
                        border
                        p-4
                        text-center

                        ${
                          journey.level >=
                          level
                            ? `
                              border-cyan-400/25
                              bg-cyan-400/[0.05]
                            `
                            : `
                              border-white/[0.06]
                              bg-white/[0.02]
                              opacity-45
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          text-2xl
                        "
                      >
                        {icon}
                      </div>

                      <p
                        className="
                          mt-2
                          text-xs
                          font-black
                        "
                      >
                        {title}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* =============================================
                MYSTERY MISSION
            ============================================= */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-pink-400/20
                bg-gradient-to-br
                from-pink-500/[0.07]
                via-black/25
                to-purple-500/[0.08]
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                {!mysteryRevealed ? (
                  <>
                    <div>
                      <p
                        className="
                          text-sm
                          font-black
                          text-pink-300
                        "
                      >
                        🎁 MYSTERY
                        MISSION
                      </p>

                      <h2
                        className="
                          mt-3
                          text-3xl
                          font-black
                        "
                      >
                        Ready for a
                        surprise?
                      </h2>

                      <p
                        className="
                          mt-3
                          max-w-xl
                          text-sm
                          leading-7
                          text-gray-500
                        "
                      >
                        Every day you
                        get one secret AI
                        challenge with
                        extra XP.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        revealMystery
                      }
                      className="
                        min-h-[52px]
                        rounded-xl
                        bg-gradient-to-r
                        from-pink-500
                        to-purple-500
                        px-6
                        font-black
                        text-white
                        transition
                        hover:-translate-y-0.5
                        hover:shadow-[0_0_30px_rgba(236,72,153,.22)]
                      "
                    >
                      🎁 Reveal Mystery
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="
                        max-w-3xl
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-black
                          text-pink-300
                        "
                      >
                        🎁 MYSTERY
                        REVEALED • +
                        {
                          mysteryMission.xp
                        }{" "}
                        XP
                      </p>

                      <h2
                        className="
                          mt-3
                          text-2xl
                          font-black
                          sm:text-3xl
                        "
                      >
                        {
                          mysteryMission.icon
                        }{" "}
                        {
                          mysteryMission.title
                        }
                      </h2>

                      <p
                        className="
                          mt-2
                          text-sm
                          font-semibold
                          text-purple-300
                        "
                      >
                        {
                          mysteryMission.tamil
                        }
                      </p>

                      <p
                        className="
                          mt-4
                          text-sm
                          leading-7
                          text-gray-500
                        "
                      >
                        {
                          mysteryMission.description
                        }
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        min-w-[220px]
                        flex-col
                        gap-3
                      "
                    >
                      <Link
                        to={
                          mysteryMission.path
                        }
                        className="
                          flex
                          min-h-[48px]
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-pink-400/25
                          bg-pink-400/[0.07]
                          px-5
                          text-sm
                          font-bold
                          text-pink-300
                        "
                      >
                        Start Mission →
                      </Link>

                      <button
                        type="button"
                        disabled={
                          mysteryCompleted
                        }
                        onClick={
                          completeMystery
                        }
                        className={`
                          min-h-[48px]
                          rounded-xl
                          px-5
                          text-sm
                          font-black

                          ${
                            mysteryCompleted
                              ? `
                                cursor-not-allowed
                                bg-green-400/[0.07]
                                text-green-300
                              `
                              : `
                                bg-white
                                text-black
                              `
                          }
                        `}
                      >
                        {mysteryCompleted
                          ? "✅ Completed"
                          : `Complete +${mysteryMission.xp} XP`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* =============================================
                7 DAY CHALLENGE
            ============================================= */}

            <section
              className="
                rounded-[28px]
                border
                border-orange-400/15
                bg-black/25
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-sm
                      font-black
                      text-orange-300
                    "
                  >
                    🔥 7-DAY AI
                    CHALLENGE
                  </p>

                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-black
                      sm:text-3xl
                    "
                  >
                    Build an AI habit
                    in 7 days
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-gray-500
                    "
                  >
                    Complete one simple
                    AI action every day.
                  </p>
                </div>

                {!missionState
                  .sevenDayStartDate && (
                  <button
                    type="button"
                    onClick={
                      startSevenDay
                    }
                    className="
                      min-h-[48px]
                      rounded-xl
                      bg-gradient-to-r
                      from-orange-400
                      to-pink-500
                      px-6
                      font-black
                      text-black
                    "
                  >
                    🔥 Start Challenge
                  </button>
                )}
              </div>

              <div
                className="
                  mt-7
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-7
                "
              >
                {sevenDayChallenge.map(
                  (item) => {
                    const done =
                      sevenCompleted.includes(
                        item.day
                      );

                    const current =
                      !done &&
                      item.day ===
                        sevenCompleted.length +
                          1;

                    const locked =
                      !done &&
                      !current;

                    return (
                      <div
                        key={
                          item.day
                        }
                        className={`
                          flex
                          min-h-[185px]
                          flex-col
                          rounded-2xl
                          border
                          p-4
                          transition

                          ${
                            done
                              ? `
                                border-green-400/25
                                bg-green-400/[0.05]
                              `
                              : current
                                ? `
                                  border-orange-400/35
                                  bg-orange-400/[0.06]
                                `
                                : `
                                  border-white/[0.06]
                                  bg-white/[0.02]
                                  opacity-45
                                `
                          }
                        `}
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                          "
                        >
                          <span
                            className="
                              text-xs
                              font-black
                              text-gray-500
                            "
                          >
                            DAY{" "}
                            {
                              item.day
                            }
                          </span>

                          <span>
                            {done
                              ? "✅"
                              : locked
                                ? "🔒"
                                : "🔥"}
                          </span>
                        </div>

                        <div
                          className="
                            mt-4
                            text-2xl
                          "
                        >
                          {
                            item.icon
                          }
                        </div>

                        <p
                          className="
                            mt-3
                            flex-1
                            text-xs
                            font-bold
                            leading-5
                          "
                        >
                          {
                            item.title
                          }
                        </p>

                        {missionState
                          .sevenDayStartDate &&
                          current && (
                            <>
                              <Link
                                to={
                                  item.path
                                }
                                className="
                                  mt-3
                                  text-[10px]
                                  font-bold
                                  text-cyan-300
                                "
                              >
                                Start →
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  completeSevenDay(
                                    item.day
                                  )
                                }
                                className="
                                  mt-2
                                  rounded-lg
                                  bg-white
                                  px-2
                                  py-2
                                  text-[10px]
                                  font-black
                                  text-black
                                "
                              >
                                Complete
                              </button>
                            </>
                          )}
                      </div>
                    );
                  }
                )}
              </div>

              {missionState
                .sevenDayStartDate && (
                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      h-2
                      flex-1
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
                        from-orange-400
                        to-pink-500
                        transition-all
                        duration-700
                      "
                      style={{
                        width:
                          `${
                            (sevenProgress /
                              7) *
                            100
                          }%`,
                      }}
                    />
                  </div>

                  <span
                    className="
                      text-xs
                      font-black
                      text-orange-300
                    "
                  >
                    {sevenProgress}/7
                  </span>
                </div>
              )}
            </section>

            {/* =============================================
                BADGES
            ============================================= */}

            <section
              className="
                rounded-[28px]
                border
                border-white/[0.08]
                bg-black/25
                p-6
                sm:p-8
              "
            >
              <p
                className="
                  text-sm
                  font-black
                  text-yellow-300
                "
              >
                🏆 MISSION BADGES
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-black
                "
              >
                Your Achievements
              </h2>

              <div
                className="
                  mt-6
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {badges.map(
                  (badge) => (
                    <div
                      key={
                        badge.title
                      }
                      className={`
                        rounded-2xl
                        border
                        p-5

                        ${
                          badge.unlocked
                            ? `
                              border-yellow-400/20
                              bg-yellow-400/[0.04]
                            `
                            : `
                              border-white/[0.06]
                              bg-white/[0.02]
                              opacity-40
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          text-3xl
                        "
                      >
                        {badge.unlocked
                          ? badge.icon
                          : "🔒"}
                      </div>

                      <h3
                        className="
                          mt-4
                          font-black
                        "
                      >
                        {
                          badge.title
                        }
                      </h3>

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-5
                          text-gray-600
                        "
                      >
                        {
                          badge.description
                        }
                      </p>

                      {badge.unlocked && (
                        <p
                          className="
                            mt-3
                            text-xs
                            font-bold
                            text-green-300
                          "
                        >
                          ✓ Unlocked
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        )}

        {/* =================================================
            TOOL FINDER
        ================================================= */}

        {activeTab ===
          "finder" && (
          <section
            className="
              mt-6
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/25
              p-5
              sm:p-8
            "
          >
            <p
              className="
                text-sm
                font-black
                text-cyan-300
              "
            >
              🎯 AI TOOL FINDER
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              What do you want to
              create?
            </h2>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {[
                [
                  "writing",
                  "✍️",
                  "Writing",
                ],

                [
                  "coding",
                  "💻",
                  "Coding",
                ],

                [
                  "image",
                  "🎨",
                  "Images",
                ],

                [
                  "video",
                  "🎬",
                  "Videos",
                ],

                [
                  "music",
                  "🎵",
                  "Music",
                ],

                [
                  "study",
                  "📚",
                  "Study",
                ],

                [
                  "research",
                  "🔎",
                  "Research",
                ],

                [
                  "creator",
                  "🚀",
                  "Creator",
                ],
              ].map(
                ([
                  id,
                  icon,
                  label,
                ]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setToolGoal(
                        id
                      )
                    }
                    className={`
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition

                      ${
                        toolGoal ===
                        id
                          ? `
                            border-cyan-400/40
                            bg-cyan-400/[0.09]
                            text-cyan-300
                          `
                          : `
                            border-white/[0.07]
                            bg-white/[0.025]
                            text-gray-400
                            hover:text-white
                          `
                      }
                    `}
                  >
                    <span
                      className="
                        text-2xl
                      "
                    >
                      {icon}
                    </span>

                    <p
                      className="
                        mt-3
                        font-black
                      "
                    >
                      {label}
                    </p>
                  </button>
                )
              )}
            </div>

            <div
              className="
                mt-8
                grid
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {recommendedTools.map(
                (tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="
                      group
                      rounded-3xl
                      border
                      border-white/[0.08]
                      bg-white/[0.025]
                      p-5
                      transition
                      hover:-translate-y-1
                      hover:border-cyan-400/30
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-white/10
                          bg-black/20
                          text-2xl
                        "
                      >
                        {tool.icon}
                      </div>

                      <div>
                        <h3
                          className="
                            text-lg
                            font-black
                          "
                        >
                          {
                            tool.name
                          }
                        </h3>

                        <p
                          className="
                            text-xs
                            text-cyan-400
                          "
                        >
                          {
                            tool.category
                          }
                        </p>
                      </div>
                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        leading-6
                        text-gray-500
                      "
                    >
                      {
                        tool.description
                      }
                    </p>

                    <p
                      className="
                        mt-4
                        text-sm
                        font-bold
                        text-cyan-300
                      "
                    >
                      Explore Tool →
                    </p>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {/* =================================================
            PROMPT GENERATOR
        ================================================= */}

        {activeTab ===
          "prompt" && (
          <section
            className="
              mt-6
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/25
              p-5
              sm:p-8
            "
          >
            <p
              className="
                text-sm
                font-black
                text-purple-300
              "
            >
              ✨ SMART PROMPT
              GENERATOR
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              Create a professional
              prompt
            </h2>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {promptTypes.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setPromptType(
                        item.id
                      )
                    }
                    className={`
                      rounded-2xl
                      border
                      p-4
                      text-left
                      font-bold

                      ${
                        promptType ===
                        item.id
                          ? `
                            border-purple-400/40
                            bg-purple-400/[0.10]
                            text-purple-300
                          `
                          : `
                            border-white/[0.07]
                            bg-white/[0.025]
                            text-gray-400
                          `
                      }
                    `}
                  >
                    {item.icon}{" "}
                    {item.label}
                  </button>
                )
              )}
            </div>

            <div
              className="
                mt-6
                grid
                gap-4
                lg:grid-cols-2
              "
            >
              <textarea
                value={topic}
                onChange={(event) =>
                  setTopic(
                    event.target.value
                  )
                }
                placeholder="Example: AI tools for students"
                className="
                  min-h-[170px]
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/30
                  p-4
                  text-white
                  outline-none
                  placeholder:text-gray-700
                  focus:border-cyan-400/40
                "
              />

              <div>
                <select
                  value={tone}
                  onChange={(event) =>
                    setTone(
                      event.target.value
                    )
                  }
                  className="
                    h-[52px]
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#080a13]
                    px-4
                    text-white
                    outline-none
                  "
                >
                  <option
                    value="professional"
                  >
                    Professional
                  </option>

                  <option
                    value="simple"
                  >
                    Simple
                  </option>

                  <option
                    value="creative"
                  >
                    Creative
                  </option>

                  <option
                    value="friendly"
                  >
                    Friendly
                  </option>

                  <option
                    value="cinematic"
                  >
                    Cinematic
                  </option>
                </select>

                <button
                  type="button"
                  onClick={
                    generatePrompt
                  }
                  className="
                    mt-4
                    h-[52px]
                    w-full
                    rounded-xl
                    bg-gradient-to-r
                    from-purple-500
                    to-pink-500
                    font-black
                  "
                >
                  ✨ Generate Prompt
                </button>
              </div>
            </div>

            {generatedPrompt && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/[0.04]
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      font-black
                      text-cyan-300
                    "
                  >
                    Generated Prompt
                  </p>

                  <button
                    type="button"
                    onClick={
                      copyPrompt
                    }
                    className="
                      rounded-lg
                      border
                      border-white/10
                      px-3
                      py-2
                      text-xs
                      font-bold
                    "
                  >
                    📋 Copy
                  </button>
                </div>

                <p
                  className="
                    mt-4
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-gray-300
                  "
                >
                  {
                    generatedPrompt
                  }
                </p>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            LIBRARY
        ================================================= */}

        {activeTab ===
          "library" && (
          <section
            className="
              mt-6
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/25
              p-5
              sm:p-8
            "
          >
            <p
              className="
                text-sm
                font-black
                text-pink-300
              "
            >
              ❤️ MY LIBRARY
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
              "
            >
              Everything you saved
            </h2>

            <div
              className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-5
              "
            >
              {[
                [
                  "❤️",
                  "Favorite Tools",
                  favorites.length,
                  "/ai-tools",
                ],

                [
                  "✨",
                  "Saved Prompts",
                  savedPrompts.length,
                  "/prompts",
                ],

                [
                  "📰",
                  "News Read",
                  readNews.length,
                  "/ai-news",
                ],

                [
                  "🎓",
                  "Courses",
                  completedCourses.length,
                  "/courses",
                ],

                [
                  "🕘",
                  "Recent Tools",
                  recentTools.length,
                  "/ai-tools",
                ],
              ].map(
                ([
                  icon,
                  title,
                  count,
                  path,
                ]) => (
                  <Link
                    key={title}
                    to={path}
                    className="
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-5
                      transition
                      hover:border-cyan-400/25
                    "
                  >
                    <div
                      className="
                        text-2xl
                      "
                    >
                      {icon}
                    </div>

                    <p
                      className="
                        mt-4
                        text-3xl
                        font-black
                      "
                    >
                      {count}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                      "
                    >
                      {title}
                    </p>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {/* =================================================
            CERTIFICATES
        ================================================= */}

        {activeTab ===
          "certificates" && (
          <section
            className="
              mt-6
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/25
              p-5
              sm:p-8
            "
          >
            <p
              className="
                text-sm
                font-black
                text-yellow-300
              "
            >
              🏆 COURSE
              CERTIFICATES
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
              "
            >
              Your completed courses
            </h2>

            {completedCourses.length ===
            0 ? (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-dashed
                  border-white/10
                  p-8
                  text-center
                "
              >
                <div
                  className="
                    text-4xl
                  "
                >
                  🎓
                </div>

                <h3
                  className="
                    mt-4
                    font-black
                  "
                >
                  No certificates yet
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-gray-500
                  "
                >
                  Complete all lessons
                  and pass the final
                  quiz.
                </p>

                <Link
                  to="/courses"
                  className="
                    mt-5
                    inline-flex
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    font-black
                    text-black
                  "
                >
                  Explore Courses →
                </Link>
              </div>
            ) : (
              <div
                className="
                  mt-6
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                {completedCourses.map(
                  (
                    courseId
                  ) => (
                    <div
                      key={
                        courseId
                      }
                      className="
                        rounded-2xl
                        border
                        border-yellow-400/15
                        bg-yellow-400/[0.035]
                        p-5
                      "
                    >
                      <div
                        className="
                          text-3xl
                        "
                      >
                        🏆
                      </div>

                      <h3
                        className="
                          mt-4
                          text-lg
                          font-black
                        "
                      >
                        {courseNames[
                          courseId
                        ] ||
                          courseId}
                      </h3>

                      <p
                        className="
                          mt-2
                          text-sm
                          text-green-400
                        "
                      >
                        ✓ Course
                        Completed
                      </p>

                      <p
                        className="
                          mt-3
                          text-xs
                          text-gray-600
                        "
                      >
                        Certificate
                        unlocked
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default SmartHub;