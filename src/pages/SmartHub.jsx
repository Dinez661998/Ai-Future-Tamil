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
} from "../utils/dashboardStorage";

import {
  useLanguage,
} from "../context/LanguageContext.jsx";

/* =========================================================
   STORAGE
========================================================= */

const CHALLENGE_KEY =
  "aft_daily_challenge";

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
    category: "Chat",
    description:
      "Writing, coding, learning and productivity.",
    path: "/ai-tools/chatgpt",
    skills: [
      "writing",
      "coding",
      "study",
      "research",
      "productivity",
      "chat",
    ],
  },

  {
    id: "gemini",
    name: "Gemini",
    icon: "💎",
    category: "Chat",
    description:
      "Research, writing and everyday AI tasks.",
    path: "/ai-tools/gemini",
    skills: [
      "writing",
      "study",
      "research",
      "productivity",
      "chat",
    ],
  },

  {
    id: "claude",
    name: "Claude",
    icon: "🧠",
    category: "Chat",
    description:
      "Writing, analysis and coding.",
    path: "/ai-tools/claude",
    skills: [
      "writing",
      "coding",
      "research",
      "analysis",
      "chat",
    ],
  },

  {
    id: "midjourney",
    name: "Midjourney",
    icon: "🎨",
    category: "Image",
    description:
      "Professional AI image generation.",
    path: "/ai-tools/midjourney",
    skills: [
      "image",
      "design",
      "thumbnail",
      "art",
    ],
  },

  {
    id: "runway",
    name: "Runway",
    icon: "🎬",
    category: "Video",
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
    category: "Music",
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
    en: "YouTube Script",
    ta: "YouTube ஸ்கிரிப்ட்",
  },

  {
    id: "image",
    icon: "🎨",
    en: "AI Image",
    ta: "AI படம்",
  },

  {
    id: "coding",
    icon: "💻",
    en: "Coding",
    ta: "கோடிங்",
  },

  {
    id: "study",
    icon: "📚",
    en: "Study",
    ta: "படிப்பு",
  },

  {
    id: "marketing",
    icon: "📢",
    en: "Marketing",
    ta: "மார்க்கெட்டிங்",
  },

  {
    id: "business",
    icon: "💡",
    en: "Business",
    ta: "பிஸினஸ்",
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

function todayKey() {
  const date =
    new Date();

  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1
    ).padStart(2, "0"),
    String(
      date.getDate()
    ).padStart(2, "0"),
  ].join("-");
}

/* =========================================================
   MAIN
========================================================= */

function SmartHub() {
  const {
    language,
  } = useLanguage();

  const tamil =
    language === "ta";

  const t = (
    en,
    ta
  ) =>
    tamil ? ta : en;

  const [
    activeTab,
    setActiveTab,
  ] = useState("finder");

  /* =======================================================
     TOOL FINDER
  ======================================================= */

  const [
    toolGoal,
    setToolGoal,
  ] = useState("writing");

  const [
    pricing,
    setPricing,
  ] = useState("any");

  /* =======================================================
     PROMPT
  ======================================================= */

  const [
    promptType,
    setPromptType,
  ] = useState("youtube");

  const [
    topic,
    setTopic,
  ] = useState("");

  const [
    tone,
    setTone,
  ] = useState("professional");

  const [
    generatedPrompt,
    setGeneratedPrompt,
  ] = useState("");

  /* =======================================================
     LIBRARY
  ======================================================= */

  const [
    favorites,
    setFavorites,
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
    recentTools,
    setRecentTools,
  ] = useState([]);

  /* =======================================================
     CHALLENGE
  ======================================================= */

  const [
    challengeData,
    setChallengeData,
  ] = useState({});

  const [
    bonusXP,
    setBonusXP,
  ] = useState(0);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadData = () => {
    try {
      setFavorites(
        getFavoriteTools() || []
      );

      setSavedPrompts(
        getSavedPrompts() || []
      );

      setReadNews(
        getNewsRead() || []
      );

      setCompletedCourses(
        getCompletedCourses() || []
      );

      setRecentTools(
        getRecentlyVisitedTools() ||
          []
      );

      setChallengeData(
        readJSON(
          CHALLENGE_KEY,
          {}
        )
      );

      setBonusXP(
        Number(
          localStorage.getItem(
            BONUS_XP_KEY
          )
        ) || 0
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

    const update = () =>
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
            toolGoal === "creator" &&
            [
              "midjourney",
              "runway",
              "suno",
            ].includes(tool.id)
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
            b.score - a.score
        );
    }, [
      toolGoal,
      pricing,
    ]);

  /* =======================================================
     GENERATE PROMPT
  ======================================================= */

  const generatePrompt = () => {
    const subject =
      topic.trim() ||
      (tamil
        ? "[உங்கள் தலைப்பு]"
        : "[YOUR TOPIC]");

    const templates = {
      youtube: tamil
        ? `நீங்கள் ஒரு professional YouTube script writer ஆக செயல்படுங்கள். "${subject}" பற்றி ஒரு engaging YouTube video script உருவாக்குங்கள். Tone: ${tone}. Powerful hook, introduction, main content, curiosity points, examples, conclusion மற்றும் CTA சேர்க்கவும்.`
        : `Act as a professional YouTube script writer. Create an engaging YouTube video script about "${subject}". Tone: ${tone}. Include a powerful hook, introduction, main content, curiosity points, examples, conclusion and CTA.`,

      image: tamil
        ? `"${subject}" க்கான highly detailed cinematic AI image prompt உருவாக்குங்கள். Subject, environment, lighting, camera angle, composition, colors, mood மற்றும் realistic details சேர்க்கவும். Tone/style: ${tone}.`
        : `Create a highly detailed cinematic AI image prompt for "${subject}". Include subject, environment, lighting, camera angle, composition, colors, mood and realistic details. Style: ${tone}.`,

      coding: tamil
        ? `நீங்கள் ஒரு expert software developer ஆக செயல்படுங்கள். "${subject}" தொடர்பான coding task-ஐ analyze செய்து, solution-ஐ simple step-by-step explanation உடன் கொடுக்கவும். Clean code, error handling, best practices மற்றும் improved final code சேர்க்கவும்.`
        : `Act as an expert software developer. Solve the following coding task: "${subject}". Explain the solution simply, then provide clean final code with error handling and best practices.`,

      study: tamil
        ? `"${subject}" என்னும் topic-ஐ ஒரு beginner student-க்கு மிகவும் simple-ஆ explain செய்யுங்கள். Key points, examples, important terms, short summary மற்றும் 5 practice questions கொடுக்கவும்.`
        : `Explain "${subject}" in very simple beginner-friendly language. Include key points, examples, important terms, a short summary and 5 practice questions.`,

      marketing: tamil
        ? `"${subject}" க்காக engaging marketing content உருவாக்குங்கள். 10 hooks, short captions, CTA, content ideas மற்றும் suitable hashtags கொடுக்கவும். Tone: ${tone}.`
        : `Create engaging marketing content for "${subject}". Include 10 hooks, short captions, CTA, content ideas and suitable hashtags. Tone: ${tone}.`,

      business: tamil
        ? `"${subject}" அடிப்படையில் practical online business ideas உருவாக்குங்கள். Target audience, earning model, startup cost, tools needed மற்றும் first 7 steps-ஐ கொடுக்கவும்.`
        : `Generate practical online business ideas based on "${subject}". Explain the target audience, earning model, startup cost, tools needed and first 7 steps.`,
    };

    setGeneratedPrompt(
      templates[promptType]
    );
  };

  const copyPrompt = async () => {
    if (!generatedPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        generatedPrompt
      );

      alert(
        t(
          "Prompt copied! ✅",
          "Prompt copy ஆனது! ✅"
        )
      );
    } catch {
      alert(
        t(
          "Unable to copy.",
          "Copy செய்ய முடியவில்லை."
        )
      );
    }
  };

  /* =======================================================
     DAILY CHALLENGE
  ======================================================= */

  const today =
    todayKey();

  const completedToday =
    challengeData?.date ===
      today &&
    challengeData?.completed ===
      true;

  const completeChallenge =
    () => {
      if (completedToday) {
        return;
      }

      const newData = {
        date: today,
        completed: true,
        xp: 50,
      };

      const nextXP =
        bonusXP + 50;

      localStorage.setItem(
        CHALLENGE_KEY,
        JSON.stringify(newData)
      );

      localStorage.setItem(
        BONUS_XP_KEY,
        String(nextXP)
      );

      setChallengeData(
        newData
      );

      setBonusXP(nextXP);

      window.dispatchEvent(
        new Event(
          "dashboard-data-updated"
        )
      );
    };

  /* =======================================================
     CERTIFICATE
  ======================================================= */

  const openCertificate =
    (courseId) => {
      const courseTitle =
        courseNames[courseId] ||
        courseId;

      const certificateDate =
        new Date().toLocaleDateString();

      const popup =
        window.open(
          "",
          "_blank",
          "width=1100,height=750"
        );

      if (!popup) {
        alert(
          t(
            "Please allow popups.",
            "Popup-ஐ allow செய்யவும்."
          )
        );

        return;
      }

      popup.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <title>
            AI Future Tamil Certificate
          </title>

          <style>

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              background: #070914;
              color: white;
              font-family:
                Arial,
                sans-serif;
            }

            .certificate {
              min-height: 650px;
              border: 4px solid #22d3ee;
              padding: 60px;
              text-align: center;
              background:
                radial-gradient(
                  circle at top left,
                  rgba(34,211,238,.18),
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
              font-size: 24px;
              font-weight: 900;
              color: #67e8f9;
            }

            h1 {
              margin-top: 60px;
              font-size: 50px;
            }

            .subtitle {
              color: #9ca3af;
              font-size: 20px;
            }

            .course {
              margin: 40px 0;
              color: #c084fc;
              font-size: 34px;
              font-weight: 900;
            }

            .date {
              margin-top: 45px;
              color: #94a3b8;
            }

            button {
              margin-top: 35px;
              border: 0;
              border-radius: 12px;
              padding: 14px 24px;
              font-weight: 800;
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

            <p class="subtitle">
              This certificate confirms successful completion of
            </p>

            <div class="course">
              ${courseTitle}
            </div>

            <p class="subtitle">
              Course lessons and final quiz completed successfully.
            </p>

            <p class="date">
              Completed: ${certificateDate}
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
      id: "finder",
      icon: "🎯",
      en: "Tool Finder",
      ta: "Tool Finder",
    },

    {
      id: "prompt",
      icon: "✨",
      en: "Prompt Generator",
      ta: "Prompt Generator",
    },

    {
      id: "library",
      icon: "❤️",
      en: "My Library",
      ta: "என் Library",
    },

    {
      id: "challenge",
      icon: "🔥",
      en: "Daily Challenge",
      ta: "Daily Challenge",
    },

    {
      id: "certificates",
      icon: "🏆",
      en: "Certificates",
      ta: "சான்றிதழ்கள்",
    },
  ];

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
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        {/* ===============================================
            HERO
        =============================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
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
              h-72
              w-72
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div className="relative">
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
              ⚡ SMART AI CENTER
            </div>

            <h1
              className="
                mt-5
                max-w-4xl
                text-3xl
                font-black
                sm:text-4xl
                lg:text-6xl
              "
            >
              {t(
                "Everything you need to grow with AI.",
                "AI மூலம் வளர தேவையான அனைத்தும் ஒரே இடத்தில்."
              )}
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
              {t(
                "Find the right AI tool, generate professional prompts, manage saved resources, complete challenges and download course certificates.",
                "சரியான AI tool-ஐ கண்டுபிடிக்கவும், professional prompts உருவாக்கவும், saved resources-ஐ நிர்வகிக்கவும், challenges complete செய்து certificates பெறவும்."
              )}
            </p>

            <div
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-yellow-400/20
                bg-yellow-400/[0.06]
                px-4
                py-2
                text-sm
                font-bold
                text-yellow-300
              "
            >
              ⚡ Bonus XP: {bonusXP}
            </div>
          </div>
        </section>

        {/* ===============================================
            TAB NAV
        =============================================== */}

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
                        bg-cyan-400
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
                {t(
                  tab.en,
                  tab.ta
                )}
              </button>
            )
          )}
        </div>

        {/* ===============================================
            TOOL FINDER
        =============================================== */}

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
              {t(
                "What do you want to do?",
                "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?"
              )}
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
                  "எழுதுதல்",
                ],

                [
                  "coding",
                  "💻",
                  "Coding",
                  "கோடிங்",
                ],

                [
                  "image",
                  "🎨",
                  "Images",
                  "படங்கள்",
                ],

                [
                  "video",
                  "🎬",
                  "Videos",
                  "வீடியோக்கள்",
                ],

                [
                  "music",
                  "🎵",
                  "Music",
                  "இசை",
                ],

                [
                  "study",
                  "📚",
                  "Study",
                  "படிப்பு",
                ],

                [
                  "research",
                  "🔎",
                  "Research",
                  "ஆராய்ச்சி",
                ],

                [
                  "creator",
                  "🚀",
                  "Creator",
                  "Creator",
                ],
              ].map(
                ([
                  id,
                  icon,
                  en,
                  ta,
                ]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setToolGoal(id)
                    }
                    className={`
                      rounded-2xl
                      border
                      p-4
                      text-left
                      transition

                      ${
                        toolGoal === id
                          ? `
                            border-cyan-400/40
                            bg-cyan-400/[0.09]
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
                    <span className="text-2xl">
                      {icon}
                    </span>

                    <p
                      className="
                        mt-3
                        font-black
                      "
                    >
                      {t(en, ta)}
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
                          {tool.name}
                        </h3>

                        <p
                          className="
                            text-xs
                            text-cyan-400
                          "
                        >
                          {tool.category}
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
                      {t(
                        "Explore Tool →",
                        "Tool-ஐ பார்க்க →"
                      )}
                    </p>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {/* ===============================================
            PROMPT GENERATOR
        =============================================== */}

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
              ✨ SMART PROMPT GENERATOR
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              {t(
                "Create a professional prompt",
                "Professional prompt உருவாக்குங்கள்"
              )}
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
                      transition

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
                    {t(
                      item.en,
                      item.ta
                    )}
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
              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    text-gray-500
                  "
                >
                  {t(
                    "YOUR TOPIC",
                    "உங்கள் தலைப்பு"
                  )}
                </label>

                <textarea
                  value={topic}
                  onChange={(event) =>
                    setTopic(
                      event.target.value
                    )
                  }
                  placeholder={t(
                    "Example: AI tools for students",
                    "Example: மாணவர்களுக்கான AI tools"
                  )}
                  className="
                    min-h-[160px]
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/30
                    p-4
                    text-white
                    outline-none
                    transition
                    placeholder:text-gray-700
                    focus:border-cyan-400/40
                  "
                />
              </div>

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    text-gray-500
                  "
                >
                  {t(
                    "TONE / STYLE",
                    "TONE / STYLE"
                  )}
                </label>

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
                  <option value="professional">
                    Professional
                  </option>

                  <option value="simple">
                    Simple
                  </option>

                  <option value="creative">
                    Creative
                  </option>

                  <option value="friendly">
                    Friendly
                  </option>

                  <option value="cinematic">
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
                    text-white
                    transition
                    hover:-translate-y-0.5
                  "
                >
                  ✨{" "}
                  {t(
                    "Generate Prompt",
                    "Prompt உருவாக்கு"
                  )}
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
                  {generatedPrompt}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ===============================================
            LIBRARY
        =============================================== */}

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
                sm:text-3xl
              "
            >
              {t(
                "Everything you saved",
                "நீங்கள் save செய்த அனைத்தும்"
              )}
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
                  t(
                    "Favorite Tools",
                    "Favorite Tools"
                  ),
                  favorites.length,
                  "/ai-tools",
                ],

                [
                  "✨",
                  t(
                    "Saved Prompts",
                    "Saved Prompts"
                  ),
                  savedPrompts.length,
                  "/prompts",
                ],

                [
                  "📰",
                  t(
                    "News Read",
                    "படித்த செய்திகள்"
                  ),
                  readNews.length,
                  "/ai-news",
                ],

                [
                  "🎓",
                  t(
                    "Courses",
                    "Courses"
                  ),
                  completedCourses.length,
                  "/courses",
                ],

                [
                  "🕘",
                  t(
                    "Recent Tools",
                    "Recent Tools"
                  ),
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
                    <div className="text-2xl">
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

        {/* ===============================================
            DAILY CHALLENGE
        =============================================== */}

        {activeTab ===
          "challenge" && (
          <section
            className="
              mt-6
              rounded-[28px]
              border
              border-orange-400/15
              bg-gradient-to-br
              from-orange-500/[0.07]
              to-purple-500/[0.05]
              p-5
              sm:p-8
            "
          >
            <p
              className="
                text-sm
                font-black
                text-orange-300
              "
            >
              🔥 DAILY AI CHALLENGE
            </p>

            <h2
              className="
                mt-3
                text-2xl
                font-black
                sm:text-4xl
              "
            >
              {t(
                "Explore one AI tool today",
                "இன்று ஒரு AI tool-ஐ explore செய்யுங்கள்"
              )}
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-7
                text-gray-400
              "
            >
              {t(
                "Complete today's challenge and earn +50 Bonus XP.",
                "இன்றைய challenge-ஐ complete செய்து +50 Bonus XP பெறுங்கள்."
              )}
            </p>

            <div
              className="
                mt-6
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <Link
                to="/ai-tools"
                className="
                  inline-flex
                  min-h-[50px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/30
                  bg-cyan-400/[0.07]
                  px-6
                  font-bold
                  text-cyan-300
                "
              >
                🤖{" "}
                {t(
                  "Explore AI Tools",
                  "AI Tools பார்க்க"
                )}
              </Link>

              <button
                type="button"
                disabled={
                  completedToday
                }
                onClick={
                  completeChallenge
                }
                className={`
                  min-h-[50px]
                  rounded-xl
                  px-6
                  font-black
                  transition

                  ${
                    completedToday
                      ? `
                        cursor-not-allowed
                        bg-green-500/15
                        text-green-300
                      `
                      : `
                        bg-gradient-to-r
                        from-orange-400
                        to-pink-500
                        text-black
                        hover:-translate-y-0.5
                      `
                  }
                `}
              >
                {completedToday
                  ? t(
                      "✅ Completed Today",
                      "✅ இன்று முடிந்தது"
                    )
                  : t(
                      "Complete +50 XP",
                      "Complete +50 XP"
                    )}
              </button>
            </div>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-white/[0.07]
                bg-black/20
                p-5
              "
            >
              <p className="text-sm text-gray-500">
                Total Bonus XP
              </p>

              <p
                className="
                  mt-1
                  text-4xl
                  font-black
                  text-yellow-300
                "
              >
                {bonusXP} XP
              </p>
            </div>
          </section>
        )}

        {/* ===============================================
            CERTIFICATES
        =============================================== */}

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
              🏆 COURSE CERTIFICATES
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                sm:text-3xl
              "
            >
              {t(
                "Your completed courses",
                "நீங்கள் முடித்த Courses"
              )}
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
                <div className="text-4xl">
                  🎓
                </div>

                <h3
                  className="
                    mt-4
                    font-black
                  "
                >
                  {t(
                    "No certificates yet",
                    "இன்னும் certificate இல்லை"
                  )}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-gray-500
                  "
                >
                  {t(
                    "Complete all lessons and pass the final quiz.",
                    "அனைத்து lessons-ஐ complete செய்து final quiz pass செய்யுங்கள்."
                  )}
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
                  (courseId) => (
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
                      <div className="text-3xl">
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
                          border-yellow-400/30
                          bg-yellow-400/[0.08]
                          px-4
                          py-3
                          text-sm
                          font-black
                          text-yellow-300
                        "
                      >
                        🖨️{" "}
                        {t(
                          "Open Certificate",
                          "Certificate பார்க்க"
                        )}
                      </button>
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