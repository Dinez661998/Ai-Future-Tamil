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

const GROWTH_KEY =
  "aft_ai_growth_system_v2";

const BONUS_XP_KEY =
  "aft_bonus_xp";

/* =========================================================
   DEFAULT DATA
========================================================= */

function defaultGrowthData() {
  return {
    xp: 0,

    coins: 0,

    streak: 0,

    bestStreak: 0,

    lastMissionDate: "",

    completedMissionDates: [],

    spinDate: "",

    rewardDate: "",

    rewardDay: 0,

    battleDate: "",

    battleBest: 0,

    knowledgeDate: "",

    roadmapStarted: false,

    roadmapCompleted: [],

    goals: [],

    purchasedRewards: [],

    mysteryDate: "",

    mysteryCompletedDate: "",

    sevenDayStarted: false,

    sevenDayCompleted: [],
  };
}

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

function writeJSON(
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

function getDayOfYear() {
  const now =
    new Date();

  const start =
    new Date(
      now.getFullYear(),
      0,
      0
    );

  return Math.floor(
    (now - start) /
      86400000
  );
}

/* =========================================================
   AI TOOLS
========================================================= */

const tools = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    category: "AI Chat",
    description:
      "Writing, learning, coding and productivity.",
    path: "/ai-tools/chatgpt",
    skills: [
      "student",
      "creator",
      "developer",
      "business",
      "writing",
      "coding",
      "study",
    ],
  },

  {
    id: "gemini",
    name: "Gemini",
    icon: "💎",
    category: "AI Chat",
    description:
      "Research, learning and everyday AI work.",
    path: "/ai-tools/gemini",
    skills: [
      "student",
      "research",
      "business",
      "study",
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
      "developer",
      "writing",
      "coding",
      "research",
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
      "creator",
      "image",
      "design",
    ],
  },

  {
    id: "runway",
    name: "Runway",
    icon: "🎬",
    category: "AI Video",
    description:
      "AI video creation and editing.",
    path: "/ai-tools/runway",
    skills: [
      "creator",
      "video",
      "editing",
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
      "creator",
      "music",
      "audio",
    ],
  },
];

/* =========================================================
   DAILY MISSIONS
========================================================= */

const dailyMissions = [
  {
    id: "titles",
    icon: "🤖",
    title:
      "Create 5 YouTube Titles",
    tamil:
      "AI மூலம் 5 YouTube title உருவாக்குங்கள்",
    description:
      "Use an AI chat tool to create five engaging YouTube video titles.",
    xp: 100,
    coins: 20,
    time: "10 min",
    path: "/ai-tools/chatgpt",
  },

  {
    id: "prompt",
    icon: "✨",
    title:
      "Try One AI Prompt",
    tamil:
      "ஒரு AI prompt முயற்சி செய்யுங்கள்",
    description:
      "Explore the prompt library and test one useful professional prompt.",
    xp: 80,
    coins: 15,
    time: "8 min",
    path: "/prompts",
  },

  {
    id: "image",
    icon: "🎨",
    title:
      "Create an AI Image Idea",
    tamil:
      "ஒரு AI image idea உருவாக்குங்கள்",
    description:
      "Explore an image AI tool and create one creative image idea.",
    xp: 120,
    coins: 25,
    time: "12 min",
    path: "/ai-images",
  },

  {
    id: "course",
    icon: "🎓",
    title:
      "Learn One AI Lesson",
    tamil:
      "ஒரு AI lesson கற்றுக்கொள்ளுங்கள்",
    description:
      "Open an AI course and study at least one lesson.",
    xp: 120,
    coins: 25,
    time: "15 min",
    path: "/courses",
  },

  {
    id: "video",
    icon: "🎬",
    title:
      "Explore an AI Video Tool",
    tamil:
      "ஒரு AI video tool-ஐ பாருங்கள்",
    description:
      "Explore AI video creation and learn what one video AI tool can do.",
    xp: 100,
    coins: 20,
    time: "10 min",
    path: "/ai-videos",
  },

  {
    id: "news",
    icon: "📰",
    title:
      "Read One AI Update",
    tamil:
      "ஒரு AI செய்தியை படியுங்கள்",
    description:
      "Read one AI news article and learn something new.",
    xp: 70,
    coins: 15,
    time: "5 min",
    path: "/ai-news",
  },

  {
    id: "creator",
    icon: "🚀",
    title:
      "Build One Creator Idea",
    tamil:
      "ஒரு content idea உருவாக்குங்கள்",
    description:
      "Use an AI prompt or tool to create one useful content idea.",
    xp: 130,
    coins: 30,
    time: "15 min",
    path: "/prompts",
  },
];

/* =========================================================
   MYSTERY MISSIONS
========================================================= */

const mysteryMissions = [
  {
    icon: "🎵",
    title:
      "Create a Song Concept",
    description:
      "Create a song title, mood and theme, then explore Suno AI.",
    xp: 150,
    coins: 35,
    path: "/ai-tools/suno",
  },

  {
    icon: "💻",
    title:
      "Improve Code with AI",
    description:
      "Take a small code example and ask AI to improve it.",
    xp: 160,
    coins: 35,
    path: "/prompts",
  },

  {
    icon: "🖼️",
    title:
      "Create a Thumbnail Idea",
    description:
      "Build one clickable thumbnail concept using AI.",
    xp: 150,
    coins: 35,
    path: "/creators/thumbnails",
  },

  {
    icon: "⚡",
    title:
      "Save 15 Minutes with AI",
    description:
      "Choose a repetitive task and find a way to make it faster with AI.",
    xp: 180,
    coins: 40,
    path: "/ai-tools",
  },
];

/* =========================================================
   SKILL BATTLE QUESTIONS
========================================================= */

const battleQuestions = [
  {
    question:
      "Which AI tool is mainly known for AI image generation?",
    options: [
      "ChatGPT",
      "Midjourney",
      "Suno AI",
      "Google Sheets",
    ],
    answer: 1,
  },

  {
    question:
      "What makes an AI prompt more useful?",
    options: [
      "No context",
      "Only one word",
      "Clear goal and details",
      "Random symbols",
    ],
    answer: 2,
  },

  {
    question:
      "Which tool is useful for AI music generation?",
    options: [
      "Suno AI",
      "Runway",
      "Photoshop",
      "Chrome",
    ],
    answer: 0,
  },

  {
    question:
      "What is Runway commonly used for?",
    options: [
      "Banking",
      "AI video",
      "Email hosting",
      "Spreadsheet formulas",
    ],
    answer: 1,
  },

  {
    question:
      "A good learning habit is:",
    options: [
      "Practice regularly",
      "Never test anything",
      "Skip every lesson",
      "Avoid feedback",
    ],
    answer: 0,
  },
];

/* =========================================================
   KNOWLEDGE QUESTIONS
========================================================= */

const knowledgeQuestions = [
  {
    question:
      "What does generative AI do?",
    options: [
      "Only stores files",
      "Creates new content",
      "Only deletes data",
      "Only prints pages",
    ],
    answer: 1,
    topic: "AI Basics",
  },

  {
    question:
      "Why should prompts include context?",
    options: [
      "To confuse AI",
      "To improve relevance",
      "To slow AI",
      "To remove answers",
    ],
    answer: 1,
    topic: "Prompt Engineering",
  },

  {
    question:
      "Which is an example of responsible AI use?",
    options: [
      "Verify important information",
      "Trust every answer blindly",
      "Share private passwords",
      "Ignore copyright",
    ],
    answer: 0,
    topic: "Responsible AI",
  },
];

/* =========================================================
   SKILL TREE
========================================================= */

const skillTree = [
  {
    id: "ai-basics",
    icon: "🌱",
    title: "AI Basics",
    xp: 0,
    path: "/courses",
  },

  {
    id: "prompting",
    icon: "✨",
    title: "Prompting",
    xp: 300,
    path: "/prompts",
  },

  {
    id: "images",
    icon: "🎨",
    title: "AI Images",
    xp: 650,
    path: "/ai-images",
  },

  {
    id: "video",
    icon: "🎬",
    title: "AI Video",
    xp: 1000,
    path: "/ai-videos",
  },

  {
    id: "automation",
    icon: "⚡",
    title: "Automation",
    xp: 1500,
    path: "/courses",
  },

  {
    id: "master",
    icon: "👑",
    title: "AI Mastery",
    xp: 2500,
    path: "/courses",
  },
];

/* =========================================================
   30 DAY ROADMAP
========================================================= */

const roadmap = Array.from(
  {
    length: 30,
  },
  (_, index) => {
    const day =
      index + 1;

    const stages = [
      {
        icon: "🌱",
        title:
          "AI Fundamentals",
        path: "/courses",
      },

      {
        icon: "✨",
        title:
          "Prompt Practice",
        path: "/prompts",
      },

      {
        icon: "🤖",
        title:
          "Explore AI Tools",
        path: "/ai-tools",
      },

      {
        icon: "🎨",
        title:
          "AI Creative Skills",
        path: "/ai-images",
      },

      {
        icon: "🎬",
        title:
          "AI Creator Skills",
        path: "/ai-videos",
      },
    ];

    const stage =
      stages[
        Math.min(
          stages.length - 1,
          Math.floor(
            index / 6
          )
        )
      ];

    return {
      day,
      icon: stage.icon,
      title:
        `${stage.title} • Task ${((index % 6) + 1)}`,
      path: stage.path,
      xp:
        day === 30
          ? 300
          : 50,
      coins:
        day === 30
          ? 100
          : 10,
    };
  }
);

/* =========================================================
   XP SHOP
========================================================= */

const shopRewards = [
  {
    id: "badge-cyan",
    icon: "💠",
    title:
      "Cyber Explorer Badge",
    description:
      "Unlock a special profile reward.",
    price: 100,
  },

  {
    id: "badge-purple",
    icon: "🔮",
    title:
      "Prompt Wizard Badge",
    description:
      "A special reward for prompt learners.",
    price: 180,
  },

  {
    id: "badge-fire",
    icon: "🔥",
    title:
      "AI Streak Badge",
    description:
      "Show your consistency.",
    price: 250,
  },

  {
    id: "theme-neon",
    icon: "🌌",
    title:
      "Neon Galaxy Reward",
    description:
      "Unlock a collectible theme reward.",
    price: 400,
  },

  {
    id: "crown",
    icon: "👑",
    title:
      "AI Champion Crown",
    description:
      "Premium virtual achievement reward.",
    price: 750,
  },
];

/* =========================================================
   LEVEL
========================================================= */

function getLevel(
  xp
) {
  if (xp >= 2500) {
    return {
      level: 4,
      icon: "👑",
      title: "AI Pro",
      min: 2500,
      max: 4000,
    };
  }

  if (xp >= 1200) {
    return {
      level: 3,
      icon: "⚡",
      title: "AI Creator",
      min: 1200,
      max: 2500,
    };
  }

  if (xp >= 500) {
    return {
      level: 2,
      icon: "🚀",
      title: "AI Explorer",
      min: 500,
      max: 1200,
    };
  }

  return {
    level: 1,
    icon: "🌱",
    title: "AI Beginner",
    min: 0,
    max: 500,
  };
}

/* =========================================================
   MAIN
========================================================= */

function SmartHub() {
  const today =
    getDateKey();

  const [
    activeTab,
    setActiveTab,
  ] =
    useState("missions");

  const [
    growth,
    setGrowth,
  ] =
    useState(
      defaultGrowthData()
    );

  const [
    toast,
    setToast,
  ] =
    useState("");

  /* =======================================================
     TOOL FINDER
  ======================================================= */

  const [
    toolGoal,
    setToolGoal,
  ] =
    useState("student");

  /* =======================================================
     LEARNING COACH
  ======================================================= */

  const [
    coachRole,
    setCoachRole,
  ] =
    useState("student");

  /* =======================================================
     SPIN
  ======================================================= */

  const [
    spinResult,
    setSpinResult,
  ] =
    useState(null);

  const [
    spinning,
    setSpinning,
  ] =
    useState(false);

  /* =======================================================
     BATTLE
  ======================================================= */

  const [
    battleStarted,
    setBattleStarted,
  ] =
    useState(false);

  const [
    battleIndex,
    setBattleIndex,
  ] =
    useState(0);

  const [
    battleScore,
    setBattleScore,
  ] =
    useState(0);

  const [
    battleFinished,
    setBattleFinished,
  ] =
    useState(false);

  /* =======================================================
     KNOWLEDGE
  ======================================================= */

  const [
    knowledgeIndex,
    setKnowledgeIndex,
  ] =
    useState(0);

  const [
    knowledgeScore,
    setKnowledgeScore,
  ] =
    useState(0);

  const [
    knowledgeStarted,
    setKnowledgeStarted,
  ] =
    useState(false);

  const [
    knowledgeFinished,
    setKnowledgeFinished,
  ] =
    useState(false);

  /* =======================================================
     GOALS
  ======================================================= */

  const [
    goalText,
    setGoalText,
  ] =
    useState("");

  /* =======================================================
     PROMPT
  ======================================================= */

  const [
    promptType,
    setPromptType,
  ] =
    useState("youtube");

  const [
    promptTopic,
    setPromptTopic,
  ] =
    useState("");

  const [
    generatedPrompt,
    setGeneratedPrompt,
  ] =
    useState("");

  /* =======================================================
     LIBRARY
  ======================================================= */

  const [
    library,
    setLibrary,
  ] =
    useState({
      favorites: [],
      prompts: [],
      news: [],
      courses: [],
      recent: [],
    });

  /* =======================================================
     LOAD
  ======================================================= */

  const loadData =
    () => {
      const stored =
        readJSON(
          GROWTH_KEY,
          defaultGrowthData()
        );

      setGrowth({
        ...defaultGrowthData(),
        ...stored,
      });

      try {
        setLibrary({
          favorites:
            getFavoriteTools() ||
            [],

          prompts:
            getSavedPrompts() ||
            [],

          news:
            getNewsRead() ||
            [],

          courses:
            getCompletedCourses() ||
            [],

          recent:
            getRecentlyVisitedTools() ||
            [],
        });
      } catch {
        // Keep Smart Hub working
      }
    };

  useEffect(() => {
    loadData();

    const update =
      () =>
        loadData();

    window.addEventListener(
      "dashboard-data-updated",
      update
    );

    window.addEventListener(
      "storage",
      update
    );

    return () => {
      window.removeEventListener(
        "dashboard-data-updated",
        update
      );

      window.removeEventListener(
        "storage",
        update
      );
    };
  }, []);

  /* =======================================================
     SAVE
  ======================================================= */

  const saveGrowth =
    (next) => {
      writeJSON(
        GROWTH_KEY,
        next
      );

      localStorage.setItem(
        BONUS_XP_KEY,
        String(
          next.xp || 0
        )
      );

      setGrowth(next);

      window.dispatchEvent(
        new Event(
          "dashboard-data-updated"
        )
      );
    };

  const rewardUser = (
    xp,
    coins,
    extra = {}
  ) => {
    const next = {
      ...growth,

      xp:
        (growth.xp || 0) +
        xp,

      coins:
        (growth.coins ||
          0) + coins,

      ...extra,
    };

    saveGrowth(next);

    return next;
  };

  const showToast =
    (message) => {
      setToast(message);

      setTimeout(() => {
        setToast("");
      }, 2800);
    };

  /* =======================================================
     TODAY'S MISSION
  ======================================================= */

  const dailyMission =
    dailyMissions[
      getDayOfYear() %
        dailyMissions.length
    ];

  const missionDone =
    growth
      .completedMissionDates
      .includes(today);

  const completeMission =
    () => {
      if (missionDone) {
        return;
      }

      const yesterday =
        getYesterdayKey();

      const nextStreak =
        growth.lastMissionDate ===
        yesterday
          ? growth.streak + 1
          : 1;

      rewardUser(
        dailyMission.xp,
        dailyMission.coins,
        {
          streak:
            nextStreak,

          bestStreak:
            Math.max(
              growth.bestStreak,
              nextStreak
            ),

          lastMissionDate:
            today,

          completedMissionDates:
            [
              ...growth.completedMissionDates,
              today,
            ],
        }
      );

      try {
        addRecentActivity({
          icon: "⚡",
          title:
            "AI Mission Completed",
          description:
            `${dailyMission.title} • +${dailyMission.xp} XP`,
          type: "mission",
          link: "/smart-hub",
        });
      } catch {
        // Ignore
      }

      showToast(
        `🎉 Mission Complete! +${dailyMission.xp} XP`
      );
    };

  /* =======================================================
     MYSTERY MISSION
  ======================================================= */

  const mystery =
    mysteryMissions[
      getDayOfYear() %
        mysteryMissions.length
    ];

  const mysteryRevealed =
    growth.mysteryDate ===
    today;

  const mysteryDone =
    growth
      .mysteryCompletedDate ===
    today;

  const revealMystery =
    () => {
      saveGrowth({
        ...growth,
        mysteryDate:
          today,
      });
    };

  const completeMystery =
    () => {
      if (
        !mysteryRevealed ||
        mysteryDone
      ) {
        return;
      }

      rewardUser(
        mystery.xp,
        mystery.coins,
        {
          mysteryCompletedDate:
            today,
        }
      );

      showToast(
        `🎁 Mystery Complete! +${mystery.xp} XP`
      );
    };

  /* =======================================================
     SPIN & WIN
  ======================================================= */

  const spinRewards = [
    {
      text: "+25 XP",
      xp: 25,
      coins: 5,
      icon: "⚡",
    },

    {
      text: "+50 XP",
      xp: 50,
      coins: 10,
      icon: "🔥",
    },

    {
      text: "+25 Coins",
      xp: 20,
      coins: 25,
      icon: "🪙",
    },

    {
      text: "Mega +100 XP",
      xp: 100,
      coins: 20,
      icon: "💎",
    },

    {
      text: "Mystery +75 XP",
      xp: 75,
      coins: 15,
      icon: "🎁",
    },
  ];

  const spinDone =
    growth.spinDate ===
    today;

  const spinWheel =
    () => {
      if (
        spinDone ||
        spinning
      ) {
        return;
      }

      setSpinning(true);

      setTimeout(() => {
        const reward =
          spinRewards[
            Math.floor(
              Math.random() *
                spinRewards.length
            )
          ];

        setSpinResult(
          reward
        );

        rewardUser(
          reward.xp,
          reward.coins,
          {
            spinDate:
              today,
          }
        );

        setSpinning(false);

        showToast(
          `🎡 You won ${reward.text}!`
        );
      }, 1200);
    };

  /* =======================================================
     DAILY REWARD CHEST
  ======================================================= */

  const chestDone =
    growth.rewardDate ===
    today;

  const claimChest =
    () => {
      if (chestDone) {
        return;
      }

      const yesterday =
        getYesterdayKey();

      const nextDay =
        growth.rewardDate ===
        yesterday
          ? Math.min(
              7,
              growth.rewardDay +
                1
            )
          : 1;

      const xp =
        nextDay === 7
          ? 200
          : nextDay * 20;

      const coins =
        nextDay === 7
          ? 75
          : nextDay * 5;

      rewardUser(
        xp,
        coins,
        {
          rewardDate:
            today,

          rewardDay:
            nextDay,
        }
      );

      showToast(
        nextDay === 7
          ? "🎁 Day 7 Mega Chest! +200 XP"
          : `🎁 Daily Chest Day ${nextDay}! +${xp} XP`
      );
    };

  /* =======================================================
     BATTLE
  ======================================================= */

  const answerBattle =
    (optionIndex) => {
      const question =
        battleQuestions[
          battleIndex
        ];

      const correct =
        optionIndex ===
        question.answer;

      const nextScore =
        battleScore +
        (correct ? 1 : 0);

      if (
        battleIndex ===
        battleQuestions.length -
          1
      ) {
        setBattleScore(
          nextScore
        );

        setBattleFinished(
          true
        );

        if (
          growth.battleDate !==
          today
        ) {
          const xp =
            nextScore * 30;

          const coins =
            nextScore * 5;

          rewardUser(
            xp,
            coins,
            {
              battleDate:
                today,

              battleBest:
                Math.max(
                  growth.battleBest,
                  nextScore
                ),
            }
          );

          showToast(
            `⚔️ Battle Complete! ${nextScore}/5 • +${xp} XP`
          );
        }

        return;
      }

      setBattleScore(
        nextScore
      );

      setBattleIndex(
        battleIndex + 1
      );
    };

  const resetBattle =
    () => {
      setBattleStarted(
        true
      );

      setBattleFinished(
        false
      );

      setBattleIndex(0);

      setBattleScore(0);
    };

  /* =======================================================
     KNOWLEDGE CHECK
  ======================================================= */

  const answerKnowledge =
    (index) => {
      const question =
        knowledgeQuestions[
          knowledgeIndex
        ];

      const correct =
        index ===
        question.answer;

      const nextScore =
        knowledgeScore +
        (correct ? 1 : 0);

      if (
        knowledgeIndex ===
        knowledgeQuestions.length -
          1
      ) {
        setKnowledgeScore(
          nextScore
        );

        setKnowledgeFinished(
          true
        );

        if (
          growth.knowledgeDate !==
          today
        ) {
          const xp =
            nextScore * 40;

          rewardUser(
            xp,
            nextScore * 5,
            {
              knowledgeDate:
                today,
            }
          );

          showToast(
            `🧠 Knowledge Check ${nextScore}/3 • +${xp} XP`
          );
        }

        return;
      }

      setKnowledgeScore(
        nextScore
      );

      setKnowledgeIndex(
        knowledgeIndex + 1
      );
    };

  const startKnowledge =
    () => {
      setKnowledgeStarted(
        true
      );

      setKnowledgeFinished(
        false
      );

      setKnowledgeIndex(0);

      setKnowledgeScore(0);
    };

  /* =======================================================
     ROADMAP
  ======================================================= */

  const startRoadmap =
    () => {
      saveGrowth({
        ...growth,

        roadmapStarted:
          true,
      });

      showToast(
        "📅 30-Day AI Roadmap Started!"
      );
    };

  const completeRoadmapDay =
    (item) => {
      if (
        growth
          .roadmapCompleted
          .includes(item.day)
      ) {
        return;
      }

      const expected =
        growth
          .roadmapCompleted
          .length + 1;

      if (
        item.day !==
        expected
      ) {
        showToast(
          `🔒 Complete Day ${expected} first`
        );

        return;
      }

      rewardUser(
        item.xp,
        item.coins,
        {
          roadmapCompleted:
            [
              ...growth.roadmapCompleted,
              item.day,
            ],
        }
      );

      showToast(
        `📅 Day ${item.day} Complete! +${item.xp} XP`
      );
    };

  /* =======================================================
     SHOP
  ======================================================= */

  const buyReward =
    (item) => {
      if (
        growth
          .purchasedRewards
          .includes(item.id)
      ) {
        return;
      }

      if (
        growth.coins <
        item.price
      ) {
        showToast(
          "🪙 Not enough AI Coins"
        );

        return;
      }

      saveGrowth({
        ...growth,

        coins:
          growth.coins -
          item.price,

        purchasedRewards:
          [
            ...growth.purchasedRewards,
            item.id,
          ],
      });

      showToast(
        `🎁 ${item.title} unlocked!`
      );
    };

  /* =======================================================
     GOALS
  ======================================================= */

  const addGoal =
    () => {
      const text =
        goalText.trim();

      if (!text) {
        return;
      }

      const newGoal = {
        id:
          `${Date.now()}-${Math.random()}`,

        text,

        completed:
          false,

        progress: 0,
      };

      saveGrowth({
        ...growth,

        goals: [
          ...growth.goals,
          newGoal,
        ],
      });

      setGoalText("");

      showToast(
        "🎯 New goal added!"
      );
    };

  const updateGoalProgress = (
    goal,
    amount
  ) => {
    const progress =
      Math.min(
        100,
        Math.max(
          0,
          goal.progress +
            amount
        )
      );

    const wasComplete =
      goal.completed;

    const nowComplete =
      progress >= 100;

    const goals =
      growth.goals.map(
        (item) =>
          item.id ===
          goal.id
            ? {
                ...item,

                progress,

                completed:
                  nowComplete,
              }
            : item
      );

    const bonus =
      !wasComplete &&
      nowComplete
        ? 150
        : 0;

    saveGrowth({
      ...growth,

      xp:
        growth.xp +
        bonus,

      coins:
        growth.coins +
        (bonus ? 30 : 0),

      goals,
    });

    if (bonus) {
      showToast(
        "🎯 Goal Complete! +150 XP"
      );
    }
  };

  const removeGoal =
    (id) => {
      saveGrowth({
        ...growth,

        goals:
          growth.goals.filter(
            (item) =>
              item.id !== id
          ),
      });
    };

  /* =======================================================
     7 DAY CHALLENGE
  ======================================================= */

  const startSevenDay =
    () => {
      saveGrowth({
        ...growth,

        sevenDayStarted:
          true,

        sevenDayCompleted:
          [],
      });

      showToast(
        "🔥 7-Day Challenge Started!"
      );
    };

  const sevenTasks = [
    {
      day: 1,
      icon: "🤖",
      title:
        "Explore an AI Tool",
      path: "/ai-tools",
    },

    {
      day: 2,
      icon: "✨",
      title:
        "Try an AI Prompt",
      path: "/prompts",
    },

    {
      day: 3,
      icon: "🎨",
      title:
        "Explore AI Images",
      path: "/ai-images",
    },

    {
      day: 4,
      icon: "🎬",
      title:
        "Explore AI Videos",
      path: "/ai-videos",
    },

    {
      day: 5,
      icon: "🎓",
      title:
        "Study a Lesson",
      path: "/courses",
    },

    {
      day: 6,
      icon: "📰",
      title:
        "Read AI News",
      path: "/ai-news",
    },

    {
      day: 7,
      icon: "🏆",
      title:
        "Build with AI",
      path: "/smart-hub",
    },
  ];

  const completeSevenDay =
    (day) => {
      if (
        growth
          .sevenDayCompleted
          .includes(day)
      ) {
        return;
      }

      const expected =
        growth
          .sevenDayCompleted
          .length + 1;

      if (
        day !== expected
      ) {
        showToast(
          `🔒 Complete Day ${expected} first`
        );

        return;
      }

      const xp =
        day === 7
          ? 300
          : 75;

      const coins =
        day === 7
          ? 100
          : 15;

      rewardUser(
        xp,
        coins,
        {
          sevenDayCompleted:
            [
              ...growth.sevenDayCompleted,
              day,
            ],
        }
      );

      showToast(
        day === 7
          ? "🏆 7-Day Challenge Complete!"
          : `🔥 Day ${day} Complete!`
      );
    };

  /* =======================================================
     PROMPT GENERATOR
  ======================================================= */

  const generatePrompt =
    () => {
      const topic =
        promptTopic.trim() ||
        "[YOUR TOPIC]";

      const templates = {
        youtube:
          `Act as a professional YouTube script writer. Create an engaging video about "${topic}". Include hook, intro, main points, examples, curiosity, CTA and conclusion.`,

        image:
          `Create a highly detailed cinematic AI image prompt about "${topic}". Include subject, environment, lighting, camera angle, composition, colors, mood and realistic details.`,

        coding:
          `Act as an expert software developer. Solve "${topic}". Explain simply and provide clean final code with best practices.`,

        study:
          `Teach "${topic}" to a beginner. Include simple explanation, examples, key points, summary and 5 practice questions.`,

        marketing:
          `Create marketing content for "${topic}". Include 10 hooks, captions, CTA, content ideas and hashtags.`,

        business:
          `Generate practical online business ideas about "${topic}". Include target audience, earning model, startup cost, tools and first steps.`,
      };

      setGeneratedPrompt(
        templates[
          promptType
        ]
      );
    };

  /* =======================================================
     COACH
  ======================================================= */

  const coachPlans = {
    student: {
      icon: "📚",
      title:
        "Student AI Path",
      items: [
        "Learn AI basics",
        "Practice prompt writing",
        "Use AI for study notes",
        "Try research tools",
        "Complete AI Productivity course",
      ],
    },

    creator: {
      icon: "🎬",
      title:
        "Creator AI Path",
      items: [
        "Learn prompt engineering",
        "Explore AI images",
        "Explore AI video",
        "Create content ideas",
        "Build a repeatable creator workflow",
      ],
    },

    developer: {
      icon: "💻",
      title:
        "Developer AI Path",
      items: [
        "Use AI coding assistants",
        "Practice code prompts",
        "Learn debugging with AI",
        "Explore automation",
        "Build one AI-powered project",
      ],
    },

    business: {
      icon: "📈",
      title:
        "Business AI Path",
      items: [
        "Identify repetitive tasks",
        "Use AI for marketing",
        "Create content systems",
        "Learn AI productivity",
        "Build an automation workflow",
      ],
    },
  };

  const coachPlan =
    coachPlans[
      coachRole
    ];

  /* =======================================================
     FINDER
  ======================================================= */

  const finderTools =
    useMemo(() => {
      return tools.filter(
        (tool) =>
          tool.skills.includes(
            toolGoal
          )
      );
    }, [
      toolGoal,
    ]);

  /* =======================================================
     WEEKLY REPORT
  ======================================================= */

  const weeklyStats = {
    missions:
      Math.min(
        7,
        growth
          .completedMissionDates
          .length
      ),

    roadmap:
      growth
        .roadmapCompleted
        .length,

    goals:
      growth.goals.filter(
        (item) =>
          item.completed
      ).length,

    tools:
      library.recent.length,

    courses:
      library.courses.length,
  };

  /* =======================================================
     LEVEL
  ======================================================= */

  const level =
    getLevel(
      growth.xp
    );

  const levelProgress =
    level.level === 4
      ? 100
      : Math.min(
          100,
          Math.round(
            ((growth.xp -
              level.min) /
              (level.max -
                level.min)) *
              100
          )
        );

  /* =======================================================
     CERTIFICATE
  ======================================================= */

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

  const openCertificate =
    (courseId) => {
      const title =
        courseNames[
          courseId
        ] ||
        courseId;

      const popup =
        window.open(
          "",
          "_blank",
          "width=1050,height=750"
        );

      if (!popup) {
        alert(
          "Please allow popups."
        );

        return;
      }

      popup.document.write(`
        <!DOCTYPE html>

        <html>

        <head>
          <title>AI Future Tamil Certificate</title>

          <style>
            body {
              margin: 0;
              padding: 40px;
              background: #070914;
              color: white;
              font-family: Arial, sans-serif;
            }

            .certificate {
              min-height: 620px;
              padding: 60px;
              text-align: center;
              border: 4px solid #22d3ee;
              background:
                radial-gradient(
                  circle at top left,
                  rgba(34,211,238,.16),
                  transparent 35%
                ),
                radial-gradient(
                  circle at bottom right,
                  rgba(168,85,247,.18),
                  transparent 35%
                ),
                #090b18;
            }

            .brand {
              color: #67e8f9;
              font-size: 24px;
              font-weight: 900;
            }

            h1 {
              margin-top: 60px;
              font-size: 48px;
            }

            .course {
              margin: 40px 0;
              color: #c084fc;
              font-size: 34px;
              font-weight: 900;
            }

            p {
              color: #9ca3af;
              font-size: 18px;
            }

            button {
              margin-top: 35px;
              border: 0;
              border-radius: 12px;
              padding: 14px 25px;
              font-weight: 900;
              cursor: pointer;
            }

            @media print {
              button {
                display: none;
              }

              body {
                padding: 0;
              }
            }
          </style>
        </head>

        <body>

          <div class="certificate">

            <div class="brand">
              ⚡ AI Future Tamil
            </div>

            <h1>
              Certificate of Completion
            </h1>

            <p>
              Successfully completed
            </p>

            <div class="course">
              ${title}
            </div>

            <p>
              AI Future Tamil Learning Platform
            </p>

            <button onclick="window.print()">
              Print / Save PDF
            </button>

          </div>

        </body>

        </html>
      `);

      popup.document.close();
    };

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "missions",
      icon: "⚡",
      label: "Missions",
    },

    {
      id: "growth",
      icon: "🚀",
      label: "AI Growth",
    },

    {
      id: "finder",
      icon: "🎯",
      label: "Tool Finder",
    },

    {
      id: "prompt",
      icon: "✨",
      label: "Prompt",
    },

    {
      id: "library",
      icon: "❤️",
      label: "Library",
    },

    {
      id: "certificates",
      icon: "🏆",
      label: "Certificates",
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
      {/* TOAST */}

      {toast && (
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
            bg-[#080711]/95
            px-6
            py-4
            text-center
            text-sm
            font-black
            shadow-[0_0_40px_rgba(236,72,153,.25)]
            backdrop-blur-xl
          "
        >
          {toast}
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
              relative
              z-10
            "
          >
            <div
              className="
                inline-flex
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
              ⚡ AI FUTURE TAMIL •
              AI GROWTH SYSTEM
            </div>

            <h1
              className="
                mt-5
                max-w-5xl
                text-3xl
                font-black
                leading-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              Learn AI.
              Complete Challenges.
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
                Level Up.
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
              Missions, daily rewards,
              quizzes, skill tree,
              roadmap, goals and AI
              rewards — all in one
              place.
            </p>

            <div
              className="
                mt-7
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >
              <StatCard
                icon="⚡"
                value={
                  growth.xp
                }
                label="Growth XP"
                className="text-yellow-300"
              />

              <StatCard
                icon="🪙"
                value={
                  growth.coins
                }
                label="AI Coins"
                className="text-orange-300"
              />

              <StatCard
                icon="🔥"
                value={
                  growth.streak
                }
                label="Mission Streak"
                className="text-pink-300"
              />

              <StatCard
                icon={
                  level.icon
                }
                value={`L${level.level}`}
                label={
                  level.title
                }
                className="text-cyan-300"
              />
            </div>

            <div
              className="
                mt-5
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
                  via-purple-500
                  to-pink-500
                  transition-all
                  duration-700
                "
                style={{
                  width:
                    `${levelProgress}%`,
                }}
              />
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
                  font-black
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
            MISSIONS TAB
        ================================================= */}

        {activeTab ===
          "missions" && (
          <div
            className="
              mt-6
              space-y-6
            "
          >
            {/* TODAY */}

            <Panel>
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
                      gap-2
                    "
                  >
                    <Badge>
                      🎯 TODAY'S MISSION
                    </Badge>

                    <Badge>
                      +{dailyMission.xp} XP
                    </Badge>

                    <Badge>
                      🪙 {dailyMission.coins}
                    </Badge>

                    <Badge>
                      ⏱ {dailyMission.time}
                    </Badge>
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
                        bg-cyan-400/[0.05]
                        text-3xl
                      "
                    >
                      {dailyMission.icon}
                    </div>

                    <div>
                      <h2
                        className="
                          text-2xl
                          font-black
                          sm:text-3xl
                        "
                      >
                        {dailyMission.title}
                      </h2>

                      <p
                        className="
                          mt-2
                          text-sm
                          font-bold
                          text-purple-300
                        "
                      >
                        {dailyMission.tamil}
                      </p>
                    </div>
                  </div>

                  <p
                    className="
                      mt-4
                      text-sm
                      leading-7
                      text-gray-500
                    "
                  >
                    {dailyMission.description}
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
                      dailyMission.path
                    }
                    className="
                      flex
                      min-h-[48px]
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-cyan-400/25
                      bg-cyan-400/[0.06]
                      px-5
                      text-sm
                      font-black
                      text-cyan-300
                    "
                  >
                    Start Mission →
                  </Link>

                  <button
                    type="button"
                    onClick={
                      completeMission
                    }
                    disabled={
                      missionDone
                    }
                    className={`
                      min-h-[48px]
                      rounded-xl
                      px-5
                      text-sm
                      font-black

                      ${
                        missionDone
                          ? `
                            cursor-not-allowed
                            border
                            border-green-400/25
                            bg-green-400/[0.06]
                            text-green-300
                          `
                          : `
                            bg-gradient-to-r
                            from-cyan-400
                            to-purple-500
                            text-black
                          `
                      }
                    `}
                  >
                    {missionDone
                      ? "✅ Completed Today"
                      : `Complete +${dailyMission.xp} XP`}
                  </button>
                </div>
              </div>
            </Panel>

            {/* MYSTERY */}

            <Panel>
              {!mysteryRevealed ? (
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
                        text-pink-300
                      "
                    >
                      🎁 MYSTERY MISSION
                    </p>

                    <h2
                      className="
                        mt-2
                        text-2xl
                        font-black
                      "
                    >
                      Ready for today's
                      secret challenge?
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={
                      revealMystery
                    }
                    className="
                      rounded-xl
                      bg-gradient-to-r
                      from-pink-500
                      to-purple-500
                      px-6
                      py-3
                      font-black
                    "
                  >
                    🎁 Reveal Mission
                  </button>
                </div>
              ) : (
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
                  <div>
                    <p
                      className="
                        text-sm
                        font-black
                        text-pink-300
                      "
                    >
                      🎁 MYSTERY REVEALED
                    </p>

                    <h2
                      className="
                        mt-3
                        text-2xl
                        font-black
                      "
                    >
                      {mystery.icon}{" "}
                      {mystery.title}
                    </h2>

                    <p
                      className="
                        mt-3
                        max-w-2xl
                        text-sm
                        leading-7
                        text-gray-500
                      "
                    >
                      {mystery.description}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                    "
                  >
                    <Link
                      to={
                        mystery.path
                      }
                      className="
                        rounded-xl
                        border
                        border-pink-400/25
                        bg-pink-400/[0.06]
                        px-5
                        py-3
                        text-center
                        font-black
                        text-pink-300
                      "
                    >
                      Start →
                    </Link>

                    <button
                      type="button"
                      disabled={
                        mysteryDone
                      }
                      onClick={
                        completeMystery
                      }
                      className="
                        rounded-xl
                        bg-white
                        px-5
                        py-3
                        font-black
                        text-black
                        disabled:cursor-not-allowed
                        disabled:bg-green-400/10
                        disabled:text-green-300
                      "
                    >
                      {mysteryDone
                        ? "✅ Completed"
                        : `Complete +${mystery.xp} XP`}
                    </button>
                  </div>
                </div>
              )}
            </Panel>

            {/* 7 DAY */}

            <Panel>
              <SectionTitle
                eyebrow="🔥 7-DAY AI CHALLENGE"
                title="Build an AI habit in 7 days"
                description="Complete the tasks in order and unlock the final reward."
              />

              {!growth.sevenDayStarted && (
                <button
                  type="button"
                  onClick={
                    startSevenDay
                  }
                  className="
                    mt-5
                    rounded-xl
                    bg-gradient-to-r
                    from-orange-400
                    to-pink-500
                    px-6
                    py-3
                    font-black
                    text-black
                  "
                >
                  🔥 Start 7-Day Challenge
                </button>
              )}

              <div
                className="
                  mt-6
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-7
                "
              >
                {sevenTasks.map(
                  (item) => {
                    const done =
                      growth
                        .sevenDayCompleted
                        .includes(
                          item.day
                        );

                    const current =
                      growth.sevenDayStarted &&
                      !done &&
                      item.day ===
                        growth
                          .sevenDayCompleted
                          .length +
                          1;

                    return (
                      <div
                        key={
                          item.day
                        }
                        className={`
                          rounded-2xl
                          border
                          p-4

                          ${
                            done
                              ? "border-green-400/25 bg-green-400/[0.05]"
                              : current
                                ? "border-orange-400/30 bg-orange-400/[0.05]"
                                : "border-white/[0.06] bg-white/[0.02] opacity-50"
                          }
                        `}
                      >
                        <p
                          className="
                            text-xs
                            font-black
                            text-gray-600
                          "
                        >
                          DAY {item.day}
                        </p>

                        <div
                          className="
                            mt-3
                            text-2xl
                          "
                        >
                          {item.icon}
                        </div>

                        <p
                          className="
                            mt-3
                            min-h-[40px]
                            text-xs
                            font-black
                          "
                        >
                          {item.title}
                        </p>

                        {current && (
                          <>
                            <Link
                              to={
                                item.path
                              }
                              className="
                                mt-3
                                block
                                text-xs
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
                                w-full
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

                        {done && (
                          <p
                            className="
                              mt-3
                              text-xs
                              font-black
                              text-green-300
                            "
                          >
                            ✓ Done
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </Panel>
          </div>
        )}

        {/* =================================================
            AI GROWTH TAB - ALL 10 FEATURES
        ================================================= */}

        {activeTab ===
          "growth" && (
          <div
            className="
              mt-6
              space-y-6
            "
          >
            {/* 1 LEARNING COACH */}

            <Panel>
              <SectionTitle
                eyebrow="🤖 01 • AI LEARNING COACH"
                title="What is your goal?"
                description="Choose your role and get a simple AI learning path."
              />

              <div
                className="
                  mt-6
                  grid
                  gap-3
                  sm:grid-cols-4
                "
              >
                {[
                  [
                    "student",
                    "📚",
                    "Student",
                  ],

                  [
                    "creator",
                    "🎬",
                    "Creator",
                  ],

                  [
                    "developer",
                    "💻",
                    "Developer",
                  ],

                  [
                    "business",
                    "📈",
                    "Business",
                  ],
                ].map(
                  ([
                    id,
                    icon,
                    label,
                  ]) => (
                    <ChoiceButton
                      key={id}
                      active={
                        coachRole ===
                        id
                      }
                      onClick={() =>
                        setCoachRole(
                          id
                        )
                      }
                    >
                      {icon} {label}
                    </ChoiceButton>
                  )
                )}
              </div>

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
                <h3
                  className="
                    text-xl
                    font-black
                  "
                >
                  {coachPlan.icon}{" "}
                  {coachPlan.title}
                </h3>

                <div
                  className="
                    mt-4
                    grid
                    gap-3
                    md:grid-cols-5
                  "
                >
                  {coachPlan.items.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={item}
                        className="
                          rounded-xl
                          border
                          border-white/[0.07]
                          bg-black/20
                          p-4
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-black
                            text-cyan-300
                          "
                        >
                          STEP{" "}
                          {index + 1}
                        </p>

                        <p
                          className="
                            mt-2
                            text-sm
                            font-bold
                          "
                        >
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Panel>

            {/* 2 SPIN + 10 CHEST */}

            <div
              className="
                grid
                gap-6
                lg:grid-cols-2
              "
            >
              <Panel>
                <SectionTitle
                  eyebrow="🎡 02 • SPIN & WIN"
                  title="Daily AI Spin"
                  description="One free spin every day."
                />

                <div
                  className="
                    mt-6
                    text-center
                  "
                >
                  <div
                    className={`
                      mx-auto
                      flex
                      h-40
                      w-40
                      items-center
                      justify-center
                      rounded-full
                      border-4
                      border-purple-400/30
                      bg-gradient-to-br
                      from-cyan-400/10
                      via-purple-500/10
                      to-pink-500/10
                      text-5xl
                      shadow-[0_0_50px_rgba(168,85,247,.12)]

                      ${
                        spinning
                          ? "animate-spin"
                          : ""
                      }
                    `}
                  >
                    {spinResult
                      ? spinResult.icon
                      : "🎡"}
                  </div>

                  <p
                    className="
                      mt-5
                      font-black
                    "
                  >
                    {spinResult
                      ? spinResult.text
                      : spinDone
                        ? "Today's spin completed"
                        : "Your reward is waiting"}
                  </p>

                  <button
                    type="button"
                    disabled={
                      spinDone ||
                      spinning
                    }
                    onClick={
                      spinWheel
                    }
                    className="
                      mt-5
                      rounded-xl
                      bg-gradient-to-r
                      from-purple-500
                      to-pink-500
                      px-7
                      py-3
                      font-black
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    {spinning
                      ? "Spinning..."
                      : spinDone
                        ? "✅ Come Back Tomorrow"
                        : "🎡 Spin Now"}
                  </button>
                </div>
              </Panel>

              <Panel>
                <SectionTitle
                  eyebrow="🎁 10 • DAILY REWARD CHEST"
                  title={`Reward Day ${growth.rewardDay || 1}`}
                  description="Visit daily and grow your reward streak."
                />

                <div
                  className="
                    mt-8
                    text-center
                  "
                >
                  <div
                    className="
                      text-7xl
                    "
                  >
                    {chestDone
                      ? "✅"
                      : "🎁"}
                  </div>

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-7
                      gap-2
                    "
                  >
                    {Array.from({
                      length: 7,
                    }).map(
                      (
                        _,
                        index
                      ) => {
                        const day =
                          index + 1;

                        return (
                          <div
                            key={day}
                            className={`
                              rounded-xl
                              border
                              py-3
                              text-xs
                              font-black

                              ${
                                growth.rewardDay >=
                                day
                                  ? "border-green-400/25 bg-green-400/[0.05] text-green-300"
                                  : "border-white/[0.06] text-gray-600"
                              }
                            `}
                          >
                            D{day}
                          </div>
                        );
                      }
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={
                      chestDone
                    }
                    onClick={
                      claimChest
                    }
                    className="
                      mt-6
                      rounded-xl
                      bg-gradient-to-r
                      from-yellow-400
                      to-orange-500
                      px-7
                      py-3
                      font-black
                      text-black
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    {chestDone
                      ? "✅ Reward Claimed"
                      : "🎁 Open Today's Chest"}
                  </button>
                </div>
              </Panel>
            </div>

            {/* 3 SKILL BATTLE */}

            <Panel>
              <SectionTitle
                eyebrow="⚔️ 03 • AI SKILL BATTLE"
                title="5 Question Quick Battle"
                description="Test your AI knowledge and earn XP."
              />

              {!battleStarted ||
              battleFinished ? (
                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.02]
                    p-6
                    text-center
                  "
                >
                  <div
                    className="
                      text-5xl
                    "
                  >
                    {battleFinished
                      ? "🏆"
                      : "⚔️"}
                  </div>

                  {battleFinished && (
                    <p
                      className="
                        mt-4
                        text-3xl
                        font-black
                      "
                    >
                      {battleScore}/5
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={
                      resetBattle
                    }
                    className="
                      mt-5
                      rounded-xl
                      bg-white
                      px-7
                      py-3
                      font-black
                      text-black
                    "
                  >
                    {battleFinished
                      ? "Play Again"
                      : "Start Battle"}
                  </button>

                  {growth.battleDate ===
                    today && (
                    <p
                      className="
                        mt-3
                        text-xs
                        text-gray-600
                      "
                    >
                      XP reward already
                      claimed today.
                    </p>
                  )}
                </div>
              ) : (
                <QuizCard
                  number={
                    battleIndex + 1
                  }
                  total={
                    battleQuestions.length
                  }
                  question={
                    battleQuestions[
                      battleIndex
                    ]
                  }
                  onAnswer={
                    answerBattle
                  }
                />
              )}
            </Panel>

            {/* 4 SKILL TREE */}

            <Panel>
              <SectionTitle
                eyebrow="🧩 04 • AI SKILL TREE"
                title="Unlock Your AI Skills"
                description="Earn Growth XP to unlock the next skill."
              />

              <div
                className="
                  mt-6
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-6
                "
              >
                {skillTree.map(
                  (
                    skill,
                    index
                  ) => {
                    const unlocked =
                      growth.xp >=
                      skill.xp;

                    return (
                      <div
                        key={
                          skill.id
                        }
                        className={`
                          relative
                          rounded-2xl
                          border
                          p-5
                          text-center

                          ${
                            unlocked
                              ? "border-cyan-400/25 bg-cyan-400/[0.05]"
                              : "border-white/[0.06] bg-white/[0.02] opacity-40"
                          }
                        `}
                      >
                        <div
                          className="
                            text-3xl
                          "
                        >
                          {unlocked
                            ? skill.icon
                            : "🔒"}
                        </div>

                        <h3
                          className="
                            mt-3
                            text-sm
                            font-black
                          "
                        >
                          {skill.title}
                        </h3>

                        <p
                          className="
                            mt-2
                            text-xs
                            text-gray-600
                          "
                        >
                          {skill.xp} XP
                        </p>

                        {unlocked && (
                          <Link
                            to={
                              skill.path
                            }
                            className="
                              mt-3
                              inline-block
                              text-xs
                              font-bold
                              text-cyan-300
                            "
                          >
                            Learn →
                          </Link>
                        )}

                        {index <
                          skillTree.length -
                            1 && (
                          <div
                            className="
                              absolute
                              -right-3
                              top-1/2
                              hidden
                              text-gray-700
                              lg:block
                            "
                          >
                            →
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </Panel>

            {/* 5 ROADMAP */}

            <Panel>
              <SectionTitle
                eyebrow="📅 05 • 30-DAY AI ROADMAP"
                title="30 Days to Better AI Skills"
                description={`${growth.roadmapCompleted.length}/30 days completed`}
              />

              {!growth.roadmapStarted && (
                <button
                  type="button"
                  onClick={
                    startRoadmap
                  }
                  className="
                    mt-5
                    rounded-xl
                    bg-gradient-to-r
                    from-cyan-400
                    to-blue-500
                    px-6
                    py-3
                    font-black
                    text-black
                  "
                >
                  🚀 Start 30-Day Roadmap
                </button>
              )}

              <div
                className="
                  mt-6
                  grid
                  gap-3
                  sm:grid-cols-2
                  lg:grid-cols-5
                "
              >
                {roadmap.map(
                  (item) => {
                    const done =
                      growth
                        .roadmapCompleted
                        .includes(
                          item.day
                        );

                    const current =
                      growth.roadmapStarted &&
                      !done &&
                      item.day ===
                        growth
                          .roadmapCompleted
                          .length +
                          1;

                    return (
                      <div
                        key={
                          item.day
                        }
                        className={`
                          rounded-2xl
                          border
                          p-4

                          ${
                            done
                              ? "border-green-400/20 bg-green-400/[0.04]"
                              : current
                                ? "border-cyan-400/30 bg-cyan-400/[0.05]"
                                : "border-white/[0.06] bg-white/[0.02] opacity-45"
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
                              text-gray-600
                            "
                          >
                            DAY {item.day}
                          </span>

                          <span>
                            {done
                              ? "✅"
                              : current
                                ? item.icon
                                : "🔒"}
                          </span>
                        </div>

                        <p
                          className="
                            mt-3
                            min-h-[40px]
                            text-xs
                            font-bold
                          "
                        >
                          {item.title}
                        </p>

                        {current && (
                          <>
                            <Link
                              to={
                                item.path
                              }
                              className="
                                mt-3
                                block
                                text-xs
                                font-bold
                                text-cyan-300
                              "
                            >
                              Start →
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                completeRoadmapDay(
                                  item
                                )
                              }
                              className="
                                mt-2
                                w-full
                                rounded-lg
                                bg-white
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
            </Panel>

            {/* 6 KNOWLEDGE */}

            <Panel>
              <SectionTitle
                eyebrow="🧠 06 • KNOWLEDGE CHECK"
                title="Test What You Learned"
                description="A quick mini quiz that checks your AI fundamentals."
              />

              {!knowledgeStarted ||
              knowledgeFinished ? (
                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.02]
                    p-6
                    text-center
                  "
                >
                  <div
                    className="
                      text-5xl
                    "
                  >
                    🧠
                  </div>

                  {knowledgeFinished && (
                    <>
                      <p
                        className="
                          mt-4
                          text-3xl
                          font-black
                        "
                      >
                        {knowledgeScore}/3
                      </p>

                      <p
                        className="
                          mt-2
                          text-sm
                          text-gray-500
                        "
                      >
                        {knowledgeScore < 2
                          ? "Recommended: review AI Basics and Prompt Engineering."
                          : "Great! Your AI fundamentals are strong."}
                      </p>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={
                      startKnowledge
                    }
                    className="
                      mt-5
                      rounded-xl
                      bg-purple-500
                      px-7
                      py-3
                      font-black
                    "
                  >
                    Start Check
                  </button>
                </div>
              ) : (
                <QuizCard
                  number={
                    knowledgeIndex +
                    1
                  }
                  total={
                    knowledgeQuestions.length
                  }
                  question={
                    knowledgeQuestions[
                      knowledgeIndex
                    ]
                  }
                  onAnswer={
                    answerKnowledge
                  }
                />
              )}
            </Panel>

            {/* 7 SHOP */}

            <Panel>
              <SectionTitle
                eyebrow="🏅 07 • AI REWARD SHOP"
                title={`Your Balance: 🪙 ${growth.coins}`}
                description="Use AI Coins earned from learning activities to unlock virtual rewards."
              />

              <div
                className="
                  mt-6
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-5
                "
              >
                {shopRewards.map(
                  (item) => {
                    const owned =
                      growth
                        .purchasedRewards
                        .includes(
                          item.id
                        );

                    return (
                      <div
                        key={
                          item.id
                        }
                        className="
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-white/[0.025]
                          p-5
                        "
                      >
                        <div
                          className="
                            text-3xl
                          "
                        >
                          {item.icon}
                        </div>

                        <h3
                          className="
                            mt-4
                            font-black
                          "
                        >
                          {item.title}
                        </h3>

                        <p
                          className="
                            mt-2
                            min-h-[45px]
                            text-xs
                            leading-5
                            text-gray-600
                          "
                        >
                          {item.description}
                        </p>

                        <button
                          type="button"
                          disabled={
                            owned
                          }
                          onClick={() =>
                            buyReward(
                              item
                            )
                          }
                          className="
                            mt-4
                            w-full
                            rounded-xl
                            border
                            border-yellow-400/20
                            bg-yellow-400/[0.05]
                            px-3
                            py-3
                            text-xs
                            font-black
                            text-yellow-300
                            disabled:border-green-400/20
                            disabled:text-green-300
                          "
                        >
                          {owned
                            ? "✓ Owned"
                            : `🪙 ${item.price}`}
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </Panel>

            {/* 8 WEEKLY */}

            <Panel>
              <SectionTitle
                eyebrow="📊 08 • WEEKLY AI REPORT"
                title="Your Progress Snapshot"
                description="A quick view of your recent AI learning activity."
              />

              <div
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-4
                  lg:grid-cols-5
                "
              >
                <ReportCard
                  icon="⚡"
                  value={
                    weeklyStats.missions
                  }
                  label="Missions"
                />

                <ReportCard
                  icon="📅"
                  value={
                    weeklyStats.roadmap
                  }
                  label="Roadmap Days"
                />

                <ReportCard
                  icon="🎯"
                  value={
                    weeklyStats.goals
                  }
                  label="Goals Done"
                />

                <ReportCard
                  icon="🤖"
                  value={
                    weeklyStats.tools
                  }
                  label="Recent Tools"
                />

                <ReportCard
                  icon="🎓"
                  value={
                    weeklyStats.courses
                  }
                  label="Courses Done"
                />
              </div>

              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.03]
                  p-5
                "
              >
                <p
                  className="
                    text-sm
                    font-black
                    text-cyan-300
                  "
                >
                  💡 Smart Suggestion
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-7
                    text-gray-500
                  "
                >
                  {growth.streak >= 3
                    ? "Great consistency. Continue your mission streak and focus on the next locked skill."
                    : "Complete one small AI mission each day. Consistency will unlock your skill tree faster."}
                </p>
              </div>
            </Panel>

            {/* 9 GOALS */}

            <Panel>
              <SectionTitle
                eyebrow="🎯 09 • PERSONAL GOAL TRACKER"
                title="Set Your AI Goals"
                description="Create a goal and update its progress as you learn."
              />

              <div
                className="
                  mt-6
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <input
                  value={
                    goalText
                  }
                  onChange={(event) =>
                    setGoalText(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      addGoal();
                    }
                  }}
                  placeholder="Example: Create my first AI video"
                  className="
                    min-h-[50px]
                    flex-1
                    rounded-xl
                    border
                    border-white/10
                    bg-black/30
                    px-4
                    text-white
                    outline-none
                    placeholder:text-gray-700
                    focus:border-cyan-400/40
                  "
                />

                <button
                  type="button"
                  onClick={
                    addGoal
                  }
                  className="
                    rounded-xl
                    bg-white
                    px-6
                    py-3
                    font-black
                    text-black
                  "
                >
                  + Add Goal
                </button>
              </div>

              <div
                className="
                  mt-6
                  space-y-3
                "
              >
                {growth.goals.length ===
                0 ? (
                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-white/10
                      p-8
                      text-center
                      text-sm
                      text-gray-600
                    "
                  >
                    No goals yet.
                  </div>
                ) : (
                  growth.goals.map(
                    (goal) => (
                      <div
                        key={
                          goal.id
                        }
                        className="
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-white/[0.02]
                          p-5
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >
                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                font-black
                              "
                            >
                              {goal.completed
                                ? "✅ "
                                : "🎯 "}
                              {goal.text}
                            </p>

                            <div
                              className="
                                mt-4
                                h-2
                                overflow-hidden
                                rounded-full
                                bg-white/[0.06]
                              "
                            >
                              <div
                                className="
                                  h-full
                                  bg-gradient-to-r
                                  from-cyan-400
                                  to-purple-500
                                "
                                style={{
                                  width:
                                    `${goal.progress}%`,
                                }}
                              />
                            </div>

                            <div
                              className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                              "
                            >
                              {!goal.completed && (
                                <>
                                  <SmallButton
                                    onClick={() =>
                                      updateGoalProgress(
                                        goal,
                                        10
                                      )
                                    }
                                  >
                                    +10%
                                  </SmallButton>

                                  <SmallButton
                                    onClick={() =>
                                      updateGoalProgress(
                                        goal,
                                        25
                                      )
                                    }
                                  >
                                    +25%
                                  </SmallButton>

                                  <SmallButton
                                    onClick={() =>
                                      updateGoalProgress(
                                        goal,
                                        100
                                      )
                                    }
                                  >
                                    Complete
                                  </SmallButton>
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeGoal(
                                goal.id
                              )
                            }
                            className="
                              text-sm
                              text-gray-700
                              hover:text-red-300
                            "
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </Panel>
          </div>
        )}

        {/* =================================================
            TOOL FINDER
        ================================================= */}

        {activeTab ===
          "finder" && (
          <Panel
            className="mt-6"
          >
            <SectionTitle
              eyebrow="🎯 SMART AI TOOL FINDER"
              title="What do you need?"
              description="Choose your goal and get matching AI tools."
            />

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
                  "student",
                  "📚",
                  "Student",
                ],

                [
                  "creator",
                  "🎬",
                  "Creator",
                ],

                [
                  "developer",
                  "💻",
                  "Developer",
                ],

                [
                  "business",
                  "📈",
                  "Business",
                ],

                [
                  "writing",
                  "✍️",
                  "Writing",
                ],

                [
                  "coding",
                  "⚙️",
                  "Coding",
                ],

                [
                  "image",
                  "🎨",
                  "Images",
                ],

                [
                  "video",
                  "🎞️",
                  "Video",
                ],
              ].map(
                ([
                  id,
                  icon,
                  label,
                ]) => (
                  <ChoiceButton
                    key={id}
                    active={
                      toolGoal ===
                      id
                    }
                    onClick={() =>
                      setToolGoal(
                        id
                      )
                    }
                  >
                    {icon} {label}
                  </ChoiceButton>
                )
              )}
            </div>

            <div
              className="
                mt-7
                grid
                gap-4
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              {finderTools.length >
              0 ? (
                finderTools.map(
                  (tool) => (
                    <Link
                      key={
                        tool.id
                      }
                      to={
                        tool.path
                      }
                      className="
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        p-5
                        transition
                        hover:-translate-y-1
                        hover:border-cyan-400/30
                      "
                    >
                      <div
                        className="
                          text-3xl
                        "
                      >
                        {tool.icon}
                      </div>

                      <h3
                        className="
                          mt-4
                          text-lg
                          font-black
                        "
                      >
                        {tool.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-cyan-400
                        "
                      >
                        {tool.category}
                      </p>

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-6
                          text-gray-500
                        "
                      >
                        {tool.description}
                      </p>

                      <p
                        className="
                          mt-4
                          text-sm
                          font-bold
                          text-cyan-300
                        "
                      >
                        Explore →
                      </p>
                    </Link>
                  )
                )
              ) : (
                <p
                  className="
                    text-gray-500
                  "
                >
                  Try another goal.
                </p>
              )}
            </div>
          </Panel>
        )}

        {/* =================================================
            PROMPT GENERATOR
        ================================================= */}

        {activeTab ===
          "prompt" && (
          <Panel
            className="mt-6"
          >
            <SectionTitle
              eyebrow="✨ SMART PROMPT GENERATOR"
              title="Create a Professional AI Prompt"
              description="Choose a type, enter your topic and generate."
            />

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-6
              "
            >
              {[
                [
                  "youtube",
                  "🎬",
                  "YouTube",
                ],

                [
                  "image",
                  "🎨",
                  "Image",
                ],

                [
                  "coding",
                  "💻",
                  "Coding",
                ],

                [
                  "study",
                  "📚",
                  "Study",
                ],

                [
                  "marketing",
                  "📢",
                  "Marketing",
                ],

                [
                  "business",
                  "💡",
                  "Business",
                ],
              ].map(
                ([
                  id,
                  icon,
                  label,
                ]) => (
                  <ChoiceButton
                    key={id}
                    active={
                      promptType ===
                      id
                    }
                    onClick={() =>
                      setPromptType(
                        id
                      )
                    }
                  >
                    {icon} {label}
                  </ChoiceButton>
                )
              )}
            </div>

            <textarea
              value={
                promptTopic
              }
              onChange={(event) =>
                setPromptTopic(
                  event.target.value
                )
              }
              placeholder="Example: AI tools for students"
              className="
                mt-6
                min-h-[150px]
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/30
                p-4
                text-white
                outline-none
                placeholder:text-gray-700
                focus:border-purple-400/40
              "
            />

            <button
              type="button"
              onClick={
                generatePrompt
              }
              className="
                mt-4
                rounded-xl
                bg-gradient-to-r
                from-purple-500
                to-pink-500
                px-7
                py-3
                font-black
              "
            >
              ✨ Generate Prompt
            </button>

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
                    justify-between
                    gap-4
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
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          generatedPrompt
                        );

                        showToast(
                          "📋 Prompt copied!"
                        );
                      } catch {
                        alert(
                          "Unable to copy."
                        );
                      }
                    }}
                    className="
                      rounded-lg
                      border
                      border-white/10
                      px-3
                      py-2
                      text-xs
                      font-black
                    "
                  >
                    Copy
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
                  {generatedPrompt}
                </p>
              </div>
            )}
          </Panel>
        )}

        {/* =================================================
            LIBRARY
        ================================================= */}

        {activeTab ===
          "library" && (
          <Panel
            className="mt-6"
          >
            <SectionTitle
              eyebrow="❤️ MY LIBRARY"
              title="Your Saved AI Activity"
              description="Quick access to your saved and completed resources."
            />

            <div
              className="
                mt-6
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-5
              "
            >
              <ReportCard
                icon="❤️"
                value={
                  library
                    .favorites
                    .length
                }
                label="Favorite Tools"
              />

              <ReportCard
                icon="✨"
                value={
                  library
                    .prompts
                    .length
                }
                label="Saved Prompts"
              />

              <ReportCard
                icon="📰"
                value={
                  library.news
                    .length
                }
                label="News Read"
              />

              <ReportCard
                icon="🎓"
                value={
                  library
                    .courses
                    .length
                }
                label="Courses Done"
              />

              <ReportCard
                icon="🕘"
                value={
                  library
                    .recent
                    .length
                }
                label="Recent Tools"
              />
            </div>
          </Panel>
        )}

        {/* =================================================
            CERTIFICATES
        ================================================= */}

        {activeTab ===
          "certificates" && (
          <Panel
            className="mt-6"
          >
            <SectionTitle
              eyebrow="🏆 COURSE CERTIFICATES"
              title="Your Certificates"
              description="Complete a course to unlock its certificate."
            />

            {library.courses
              .length === 0 ? (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-dashed
                  border-white/10
                  p-10
                  text-center
                "
              >
                <div
                  className="
                    text-5xl
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
                  No certificate yet
                </h3>

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
                {library.courses.map(
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
                          text-green-300
                        "
                      >
                        ✓ Course Completed
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          openCertificate(
                            courseId
                          )
                        }
                        className="
                          mt-5
                          rounded-xl
                          border
                          border-yellow-400/25
                          bg-yellow-400/[0.06]
                          px-4
                          py-3
                          text-sm
                          font-black
                          text-yellow-300
                        "
                      >
                        🖨️ Open Certificate
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </Panel>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Panel({
  children,
  className = "",
}) {
  return (
    <section
      className={`
        rounded-[28px]
        border
        border-white/[0.08]
        bg-black/25
        p-5
        backdrop-blur-xl
        sm:p-8
        ${className}
      `}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <p
        className="
          text-sm
          font-black
          text-cyan-300
        "
      >
        {eyebrow}
      </p>

      <h2
        className="
          mt-2
          text-2xl
          font-black
          sm:text-3xl
        "
      >
        {title}
      </h2>

      {description && (
        <p
          className="
            mt-2
            max-w-3xl
            text-sm
            leading-6
            text-gray-500
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}

function Badge({
  children,
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-white/10
        bg-white/[0.035]
        px-3
        py-1.5
        text-xs
        font-black
        text-gray-300
      "
    >
      {children}
    </span>
  );
}

function StatCard({
  icon,
  value,
  label,
  className = "",
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-4
      "
    >
      <p
        className={`
          text-2xl
          font-black
          ${className}
        `}
      >
        {icon} {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-gray-600
        "
      >
        {label}
      </p>
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        rounded-2xl
        border
        p-4
        text-left
        text-sm
        font-black
        transition

        ${
          active
            ? `
              border-cyan-400/35
              bg-cyan-400/[0.08]
              text-cyan-300
            `
            : `
              border-white/[0.07]
              bg-white/[0.025]
              text-gray-400
              hover:border-white/20
              hover:text-white
            `
        }
      `}
    >
      {children}
    </button>
  );
}

function QuizCard({
  number,
  total,
  question,
  onAnswer,
}) {
  return (
    <div
      className="
        mt-6
        rounded-2xl
        border
        border-purple-400/15
        bg-purple-400/[0.035]
        p-6
      "
    >
      <p
        className="
          text-xs
          font-black
          text-purple-300
        "
      >
        QUESTION {number}/{total}
      </p>

      <h3
        className="
          mt-3
          text-xl
          font-black
        "
      >
        {question.question}
      </h3>

      <div
        className="
          mt-5
          grid
          gap-3
          sm:grid-cols-2
        "
      >
        {question.options.map(
          (
            option,
            index
          ) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                onAnswer(
                  index
                )
              }
              className="
                rounded-xl
                border
                border-white/[0.08]
                bg-black/20
                p-4
                text-left
                text-sm
                font-bold
                text-gray-300
                transition
                hover:border-purple-400/30
                hover:bg-purple-400/[0.06]
                hover:text-white
              "
            >
              {String.fromCharCode(
                65 + index
              )}
              . {option}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function ReportCard({
  icon,
  value,
  label,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-5
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
          mt-3
          text-3xl
          font-black
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-gray-600
        "
      >
        {label}
      </p>
    </div>
  );
}

function SmallButton({
  children,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="
        rounded-lg
        border
        border-cyan-400/20
        bg-cyan-400/[0.05]
        px-3
        py-2
        text-xs
        font-black
        text-cyan-300
      "
    >
      {children}
    </button>
  );
}

export default SmartHub;