import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   AI FUTURE TAMIL
   INNOVATION LAB
   10 FUNCTION SYSTEM
========================================================= */

const STORAGE_KEY =
  "aft_innovation_lab_v1";

/* =========================================================
   DEFAULT STORAGE
========================================================= */

const defaultData = {
  workflows: [],
  favoritePromptDNA: "",
  experiments: [],
  creatorScore: null,
  timeSavedMinutes: 0,
  goalsBuilt: 0,
};

/* =========================================================
   HELPERS
========================================================= */

function loadStorage() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return defaultData;
    }

    return {
      ...defaultData,
      ...JSON.parse(raw),
    };
  } catch {
    return defaultData;
  }
}

function saveStorage(data) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

function uid() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

/* =========================================================
   AI TOOL DATABASE
========================================================= */

const aiTools = [
  {
    name: "ChatGPT",
    icon: "🤖",
    strengths: [
      "writing",
      "coding",
      "study",
      "business",
      "ideas",
    ],
    scores: {
      writing: 96,
      coding: 92,
      image: 72,
      video: 45,
      study: 95,
      business: 91,
    },
  },

  {
    name: "Gemini",
    icon: "💎",
    strengths: [
      "research",
      "study",
      "writing",
      "business",
    ],
    scores: {
      writing: 90,
      coding: 88,
      image: 79,
      video: 58,
      study: 94,
      business: 89,
    },
  },

  {
    name: "Claude",
    icon: "🧠",
    strengths: [
      "writing",
      "analysis",
      "coding",
    ],
    scores: {
      writing: 95,
      coding: 93,
      image: 35,
      video: 25,
      study: 91,
      business: 92,
    },
  },

  {
    name: "Midjourney",
    icon: "🎨",
    strengths: [
      "image",
      "design",
      "creative",
    ],
    scores: {
      writing: 25,
      coding: 15,
      image: 98,
      video: 40,
      study: 20,
      business: 35,
    },
  },

  {
    name: "Runway",
    icon: "🎬",
    strengths: [
      "video",
      "editing",
      "creative",
    ],
    scores: {
      writing: 30,
      coding: 20,
      image: 78,
      video: 97,
      study: 25,
      business: 45,
    },
  },

  {
    name: "Suno AI",
    icon: "🎵",
    strengths: [
      "music",
      "audio",
      "creative",
    ],
    scores: {
      writing: 35,
      coding: 10,
      image: 10,
      video: 35,
      study: 15,
      business: 35,
    },
  },
];

/* =========================================================
   PROJECT IDEAS
========================================================= */

const projectIdeas = [
  {
    icon: "📚",
    title:
      "Tamil AI Study Planner",
    difficulty: "Beginner",
    time: "2–3 Days",
    tools:
      "ChatGPT + React",
    description:
      "Students enter subjects and get a smart daily study plan.",
  },

  {
    icon: "🎬",
    title:
      "AI YouTube Content Machine",
    difficulty: "Intermediate",
    time: "4–7 Days",
    tools:
      "ChatGPT + Canva + Runway",
    description:
      "Generate titles, scripts, thumbnail ideas and video plans.",
  },

  {
    icon: "🧒",
    title:
      "Tamil Kids Story Generator",
    difficulty: "Beginner",
    time: "2–4 Days",
    tools:
      "ChatGPT + Image AI",
    description:
      "Generate short Tamil kids stories with characters and scenes.",
  },

  {
    icon: "💼",
    title:
      "AI Resume Assistant",
    difficulty: "Intermediate",
    time: "3–5 Days",
    tools:
      "Claude + React",
    description:
      "Improve resumes, skills and job descriptions using AI.",
  },

  {
    icon: "🎨",
    title:
      "Thumbnail Idea Generator",
    difficulty: "Beginner",
    time: "1–2 Days",
    tools:
      "ChatGPT + Midjourney",
    description:
      "Generate clickable YouTube thumbnail concepts.",
  },

  {
    icon: "🛍️",
    title:
      "AI Product Description Tool",
    difficulty: "Beginner",
    time: "2 Days",
    tools:
      "ChatGPT",
    description:
      "Create ecommerce product titles, benefits and descriptions.",
  },

  {
    icon: "📰",
    title:
      "AI News Simplifier",
    difficulty: "Intermediate",
    time: "5 Days",
    tools:
      "Gemini + React",
    description:
      "Turn complex AI news into beginner-friendly summaries.",
  },

  {
    icon: "📱",
    title:
      "Social Media Idea Engine",
    difficulty: "Beginner",
    time: "2–3 Days",
    tools:
      "ChatGPT + Canva",
    description:
      "Create Instagram, YouTube and Facebook content ideas.",
  },

  {
    icon: "🧠",
    title:
      "AI Quiz Generator",
    difficulty: "Intermediate",
    time: "4 Days",
    tools:
      "Claude + React",
    description:
      "Create topic-based quizzes with score tracking.",
  },

  {
    icon: "⚡",
    title:
      "Personal AI Productivity Hub",
    difficulty: "Advanced",
    time: "7–14 Days",
    tools:
      "React + Supabase + AI",
    description:
      "Combine goals, tasks, prompts and AI workflows.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function InnovationLab() {
  const [
    data,
    setData,
  ] =
    useState(
      defaultData
    );

  const [
    activeTool,
    setActiveTool,
  ] =
    useState(
      "decision"
    );

  const [
    toast,
    setToast,
  ] =
    useState("");

  /* =======================================================
     LOAD STORAGE
  ======================================================= */

  useEffect(() => {
    setData(
      loadStorage()
    );
  }, []);

  function updateData(next) {
    setData(next);

    saveStorage(next);
  }

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  /* =======================================================
     1. DECISION ARENA
  ======================================================= */

  const [
    decisionType,
    setDecisionType,
  ] =
    useState("writing");

  const decisionResults =
    useMemo(() => {
      return aiTools
        .map((tool) => ({
          ...tool,
          score:
            tool.scores[
              decisionType
            ] || 20,
        }))
        .sort(
          (a, b) =>
            b.score -
            a.score
        );
    }, [
      decisionType,
    ]);

  /* =======================================================
     2. WORKFLOW BUILDER
  ======================================================= */

  const [
    workflowName,
    setWorkflowName,
  ] =
    useState("");

  const [
    workflowSteps,
    setWorkflowSteps,
  ] =
    useState([
      "Research",
      "Write Script",
    ]);

  const [
    newStep,
    setNewStep,
  ] =
    useState("");

  function addWorkflowStep() {
    const step =
      newStep.trim();

    if (!step) {
      return;
    }

    setWorkflowSteps([
      ...workflowSteps,
      step,
    ]);

    setNewStep("");
  }

  function removeWorkflowStep(
    index
  ) {
    setWorkflowSteps(
      workflowSteps.filter(
        (_, i) =>
          i !== index
      )
    );
  }

  function moveWorkflowStep(
    index,
    direction
  ) {
    const newIndex =
      index +
      direction;

    if (
      newIndex < 0 ||
      newIndex >=
        workflowSteps.length
    ) {
      return;
    }

    const copy = [
      ...workflowSteps,
    ];

    const temp =
      copy[index];

    copy[index] =
      copy[newIndex];

    copy[newIndex] =
      temp;

    setWorkflowSteps(
      copy
    );
  }

  function saveWorkflow() {
    if (
      !workflowName.trim() ||
      workflowSteps.length ===
        0
    ) {
      showToast(
        "⚠️ Add workflow name and steps"
      );

      return;
    }

    const workflow = {
      id: uid(),
      name:
        workflowName.trim(),
      steps:
        workflowSteps,
      createdAt:
        new Date().toISOString(),
    };

    updateData({
      ...data,

      workflows: [
        workflow,
        ...data.workflows,
      ],
    });

    setWorkflowName("");

    setWorkflowSteps([
      "Research",
      "Write Script",
    ]);

    showToast(
      "🔗 Workflow saved!"
    );
  }

  function deleteWorkflow(id) {
    updateData({
      ...data,

      workflows:
        data.workflows.filter(
          (item) =>
            item.id !== id
        ),
    });
  }

  /* =======================================================
     3. PROMPT DNA LAB
  ======================================================= */

  const [
    dnaTopic,
    setDnaTopic,
  ] =
    useState("");

  const [
    dnaResults,
    setDnaResults,
  ] =
    useState([]);

  function generateDNA() {
    const topic =
      dnaTopic.trim();

    if (!topic) {
      showToast(
        "✨ Enter a topic first"
      );

      return;
    }

    const results = [
      {
        type: "Simple",
        icon: "🌱",
        text:
          `Explain "${topic}" in very simple language for a complete beginner. Give clear examples and a short summary.`,
      },

      {
        type:
          "Professional",
        icon: "💼",
        text:
          `Act as a professional expert in "${topic}". Provide a structured, accurate and practical explanation with key concepts, examples, best practices and actionable recommendations.`,
      },

      {
        type: "Creative",
        icon: "🎨",
        text:
          `Explore "${topic}" creatively. Use interesting analogies, unique examples, surprising ideas and an engaging storytelling style.`,
      },

      {
        type: "Viral",
        icon: "🔥",
        text:
          `Turn "${topic}" into highly engaging social media content. Include a strong hook, curiosity gap, short powerful points, emotional triggers and a clear CTA.`,
      },
    ];

    setDnaResults(
      results
    );
  }

  function favoriteDNA(text) {
    updateData({
      ...data,
      favoritePromptDNA:
        text,
    });

    showToast(
      "❤️ Prompt saved!"
    );
  }

  /* =======================================================
     4. TIME SAVER
  ======================================================= */

  const [
    manualMinutes,
    setManualMinutes,
  ] =
    useState(60);

  const [
    aiMinutes,
    setAiMinutes,
  ] =
    useState(15);

  const [
    weeklyTasks,
    setWeeklyTasks,
  ] =
    useState(5);

  const timeSaved =
    Math.max(
      0,
      Number(
        manualMinutes
      ) -
        Number(
          aiMinutes
        )
    );

  const weeklySaved =
    timeSaved *
    Number(
      weeklyTasks || 0
    );

  const monthlySaved =
    weeklySaved * 4;

  function saveTimeResult() {
    updateData({
      ...data,

      timeSavedMinutes:
        monthlySaved,
    });

    showToast(
      "⏱️ Time-saving result saved!"
    );
  }

  /* =======================================================
     5. IDEA FUSION
  ======================================================= */

  const [
    fusionA,
    setFusionA,
  ] =
    useState("");

  const [
    fusionB,
    setFusionB,
  ] =
    useState("");

  const [
    fusionResults,
    setFusionResults,
  ] =
    useState([]);

  function fuseIdeas() {
    const a =
      fusionA.trim();

    const b =
      fusionB.trim();

    if (!a || !b) {
      showToast(
        "💡 Enter two ideas"
      );

      return;
    }

    setFusionResults([
      {
        icon: "🚀",
        title:
          `${a} + ${b} Smart Platform`,
        text:
          `Create a digital platform combining ${a} with ${b} using AI-powered recommendations.`,
      },

      {
        icon: "🎮",
        title:
          `Gamified ${a} Experience`,
        text:
          `Use ${b} concepts to turn ${a} into an interactive challenge, reward or learning experience.`,
      },

      {
        icon: "🤖",
        title:
          `AI ${a} Assistant`,
        text:
          `Create an AI assistant that helps users with ${a} while using ${b} as the unique differentiator.`,
      },

      {
        icon: "📱",
        title:
          `${a} Content Engine`,
        text:
          `Build a content generator focused on ${a} and use ${b} to make the content more engaging.`,
      },
    ]);
  }

  /* =======================================================
     6. CREATOR SCORE
  ======================================================= */

  const [
    creatorSkills,
    setCreatorSkills,
  ] =
    useState({
      content: 50,
      design: 50,
      ai: 50,
      consistency: 50,
      technical: 50,
    });

  const creatorScore =
    Math.round(
      Object.values(
        creatorSkills
      ).reduce(
        (sum, value) =>
          sum +
          Number(value),
        0
      ) / 5
    );

  function saveCreatorScore() {
    updateData({
      ...data,

      creatorScore,
    });

    showToast(
      "📊 Creator Score saved!"
    );
  }

  /* =======================================================
     7. PRIVACY CHECKER
  ======================================================= */

  const [
    privacyText,
    setPrivacyText,
  ] =
    useState("");

  const privacyWarnings =
    useMemo(() => {
      const warnings = [];

      if (
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(
          privacyText
        )
      ) {
        warnings.push(
          "Email address detected"
        );
      }

      if (
        /(?:\+91[\s-]?)?[6-9]\d{9}/.test(
          privacyText
        )
      ) {
        warnings.push(
          "Indian phone number detected"
        );
      }

      if (
        /(password|passwd|pwd)\s*[:=]\s*\S+/i.test(
          privacyText
        )
      ) {
        warnings.push(
          "Possible password detected"
        );
      }

      if (
        /(api[_ -]?key|secret[_ -]?key|access[_ -]?token)\s*[:=]\s*\S+/i.test(
          privacyText
        )
      ) {
        warnings.push(
          "Possible API key or token detected"
        );
      }

      if (
        /\b\d{12,19}\b/.test(
          privacyText.replace(
            /\s/g,
            ""
          )
        )
      ) {
        warnings.push(
          "Long number detected — verify it is not financial/private data"
        );
      }

      return warnings;
    }, [
      privacyText,
    ]);

  /* =======================================================
     8. EXPERIMENT TRACKER
  ======================================================= */

  const [
    experimentName,
    setExperimentName,
  ] =
    useState("");

  function addExperiment() {
    const name =
      experimentName.trim();

    if (!name) {
      return;
    }

    const item = {
      id: uid(),
      name,
      status: "Idea",
      createdAt:
        new Date().toISOString(),
    };

    updateData({
      ...data,

      experiments: [
        item,
        ...data.experiments,
      ],
    });

    setExperimentName("");

    showToast(
      "🧪 Experiment added!"
    );
  }

  function changeExperimentStatus(
    id,
    status
  ) {
    updateData({
      ...data,

      experiments:
        data.experiments.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                }
              : item
        ),
    });
  }

  function deleteExperiment(
    id
  ) {
    updateData({
      ...data,

      experiments:
        data.experiments.filter(
          (item) =>
            item.id !== id
        ),
    });
  }

  /* =======================================================
     9. RANDOM PROJECT
  ======================================================= */

  const [
    randomProject,
    setRandomProject,
  ] =
    useState(null);

  function generateProject() {
    const project =
      projectIdeas[
        Math.floor(
          Math.random() *
            projectIdeas.length
        )
      ];

    setRandomProject(
      project
    );

    updateData({
      ...data,

      goalsBuilt:
        Number(
          data.goalsBuilt || 0
        ) + 1,
    });
  }

  /* =======================================================
     10. AI OS
  ======================================================= */

  const successfulExperiments =
    data.experiments.filter(
      (item) =>
        item.status ===
        "Success"
    ).length;

  const activeExperiments =
    data.experiments.filter(
      (item) =>
        item.status ===
        "Testing"
    ).length;

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const labs = [
    {
      id: "decision",
      icon: "⚖️",
      title:
        "Decision Arena",
    },

    {
      id: "workflow",
      icon: "🔗",
      title:
        "Workflow Builder",
    },

    {
      id: "dna",
      icon: "🧬",
      title:
        "Prompt DNA",
    },

    {
      id: "time",
      icon: "⏱️",
      title:
        "Time Saver",
    },

    {
      id: "fusion",
      icon: "💡",
      title:
        "Idea Fusion",
    },

    {
      id: "creator",
      icon: "📊",
      title:
        "Creator Score",
    },

    {
      id: "privacy",
      icon: "🛡️",
      title:
        "Privacy Checker",
    },

    {
      id: "experiments",
      icon: "🧪",
      title:
        "Experiments",
    },

    {
      id: "project",
      icon: "🎲",
      title:
        "Build Generator",
    },

    {
      id: "os",
      icon: "🧠",
      title:
        "My AI OS",
    },
  ];

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        px-4
        py-8
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
            border-cyan-400/30
            bg-[#080a12]/95
            px-6
            py-4
            text-center
            text-sm
            font-black
            shadow-[0_0_40px_rgba(34,211,238,.18)]
            backdrop-blur-xl
          "
        >
          {toast}
        </div>
      )}

      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[34px]
            border
            border-white/[0.08]
            bg-black/30
            p-6
            backdrop-blur-xl
            sm:p-9
            lg:p-11
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-[340px]
              w-[340px]
              rounded-full
              bg-fuchsia-500/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-20
              h-[300px]
              w-[300px]
              rounded-full
              bg-cyan-500/10
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
                border-fuchsia-400/20
                bg-fuchsia-400/[0.06]
                px-4
                py-2
                text-xs
                font-black
                tracking-wider
                text-fuchsia-300
              "
            >
              🧪 AI FUTURE TAMIL •
              INNOVATION LAB
            </div>

            <h1
              className="
                mt-6
                max-w-5xl
                text-4xl
                font-black
                leading-tight
                sm:text-5xl
                lg:text-7xl
              "
            >
              Don't Just Use AI.
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
                Experiment With It.
              </span>
            </h1>

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
              Compare AI tools,
              build workflows,
              transform prompts,
              calculate time savings,
              test ideas and manage
              your personal AI
              innovation system.
            </p>

            <div
              className="
                mt-8
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >
              <HeroStat
                icon="🧪"
                value={
                  data.experiments
                    .length
                }
                label="Experiments"
              />

              <HeroStat
                icon="🔗"
                value={
                  data.workflows
                    .length
                }
                label="Workflows"
              />

              <HeroStat
                icon="⏱️"
                value={`${Math.round(
                  data.timeSavedMinutes /
                    60
                )}h`}
                label="Monthly Saved"
              />

              <HeroStat
                icon="📊"
                value={
                  data.creatorScore ??
                  "--"
                }
                label="Creator Score"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            LAB NAVIGATION
        ================================================= */}

        <section
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            lg:grid-cols-5
          "
        >
          {labs.map(
            (lab, index) => (
              <button
                key={lab.id}
                type="button"
                onClick={() =>
                  setActiveTool(
                    lab.id
                  )
                }
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  p-4
                  text-left
                  transition
                  duration-300

                  ${
                    activeTool ===
                    lab.id
                      ? `
                        border-cyan-400/35
                        bg-cyan-400/[0.07]
                        shadow-[0_0_25px_rgba(34,211,238,.08)]
                      `
                      : `
                        border-white/[0.07]
                        bg-black/25
                        hover:-translate-y-1
                        hover:border-white/20
                      `
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <span
                    className="
                      text-2xl
                    "
                  >
                    {lab.icon}
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-black
                      text-gray-700
                    "
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    font-black
                  "
                >
                  {lab.title}
                </p>
              </button>
            )
          )}
        </section>

        {/* =================================================
            1 DECISION ARENA
        ================================================= */}

        {activeTool ===
          "decision" && (
          <LabPanel
            eyebrow="⚖️ 01 • AI DECISION ARENA"
            title="Which AI Tool Should You Use?"
            description="Select your task. Innovation Lab compares available tools and ranks the best choices."
          >
            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
              {[
                [
                  "writing",
                  "✍️ Writing",
                ],

                [
                  "coding",
                  "💻 Coding",
                ],

                [
                  "image",
                  "🎨 Image",
                ],

                [
                  "video",
                  "🎬 Video",
                ],

                [
                  "study",
                  "📚 Study",
                ],

                [
                  "business",
                  "📈 Business",
                ],
              ].map(
                ([
                  id,
                  label,
                ]) => (
                  <SelectCard
                    key={id}
                    active={
                      decisionType ===
                      id
                    }
                    onClick={() =>
                      setDecisionType(
                        id
                      )
                    }
                  >
                    {label}
                  </SelectCard>
                )
              )}
            </div>

            <div
              className="
                mt-7
                grid
                gap-4
                lg:grid-cols-3
              "
            >
              {decisionResults
                .slice(0, 3)
                .map(
                  (
                    tool,
                    index
                  ) => (
                    <div
                      key={
                        tool.name
                      }
                      className={`
                        relative
                        rounded-3xl
                        border
                        p-6

                        ${
                          index ===
                          0
                            ? `
                              border-green-400/30
                              bg-green-400/[0.05]
                            `
                            : `
                              border-white/[0.07]
                              bg-white/[0.025]
                            `
                        }
                      `}
                    >
                      {index ===
                        0 && (
                        <span
                          className="
                            absolute
                            right-4
                            top-4
                            rounded-full
                            bg-green-400
                            px-3
                            py-1
                            text-[10px]
                            font-black
                            text-black
                          "
                        >
                          BEST CHOICE
                        </span>
                      )}

                      <div
                        className="
                          text-4xl
                        "
                      >
                        {tool.icon}
                      </div>

                      <h3
                        className="
                          mt-4
                          text-xl
                          font-black
                        "
                      >
                        {tool.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-gray-500
                        "
                      >
                        Rank #{index + 1}
                      </p>

                      <div
                        className="
                          mt-5
                          flex
                          items-end
                          gap-2
                        "
                      >
                        <span
                          className="
                            text-4xl
                            font-black
                            text-cyan-300
                          "
                        >
                          {tool.score}
                        </span>

                        <span
                          className="
                            pb-1
                            text-sm
                            text-gray-600
                          "
                        >
                          /100
                        </span>
                      </div>

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
                            rounded-full
                            bg-gradient-to-r
                            from-cyan-400
                            to-purple-500
                          "
                          style={{
                            width:
                              `${tool.score}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
            </div>
          </LabPanel>
        )}

        {/* =================================================
            2 WORKFLOW BUILDER
        ================================================= */}

        {activeTool ===
          "workflow" && (
          <LabPanel
            eyebrow="🔗 02 • AI WORKFLOW BUILDER"
            title="Build Your Own AI Workflow"
            description="Create repeatable AI processes and save them inside your browser."
          >
            <input
              value={
                workflowName
              }
              onChange={(event) =>
                setWorkflowName(
                  event.target.value
                )
              }
              placeholder="Workflow name — Example: YouTube Content System"
              className="
                mt-6
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/30
                px-5
                py-4
                outline-none
                placeholder:text-gray-700
                focus:border-cyan-400/40
              "
            />

            <div
              className="
                mt-4
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <input
                value={
                  newStep
                }
                onChange={(event) =>
                  setNewStep(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addWorkflowStep();
                  }
                }}
                placeholder="Add workflow step"
                className="
                  min-h-[50px]
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-4
                  outline-none
                  placeholder:text-gray-700
                "
              />

              <button
                type="button"
                onClick={
                  addWorkflowStep
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
                + Add Step
              </button>
            </div>

            <div
              className="
                mt-6
                space-y-3
              "
            >
              {workflowSteps.map(
                (
                  step,
                  index
                ) => (
                  <div
                    key={`${step}-${index}`}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      p-4
                    "
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-cyan-400/[0.08]
                        text-xs
                        font-black
                        text-cyan-300
                      "
                    >
                      {index + 1}
                    </span>

                    <p
                      className="
                        min-w-0
                        flex-1
                        font-bold
                      "
                    >
                      {step}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        moveWorkflowStep(
                          index,
                          -1
                        )
                      }
                      className="text-gray-500 hover:text-white"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveWorkflowStep(
                          index,
                          1
                        )
                      }
                      className="text-gray-500 hover:text-white"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeWorkflowStep(
                          index
                        )
                      }
                      className="text-gray-600 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              onClick={
                saveWorkflow
              }
              className="
                mt-6
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-purple-500
                px-7
                py-3
                font-black
                text-black
              "
            >
              💾 Save Workflow
            </button>

            {data.workflows.length >
              0 && (
              <div
                className="
                  mt-8
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                {data.workflows.map(
                  (workflow) => (
                    <div
                      key={
                        workflow.id
                      }
                      className="
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-black/20
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
                        <h3
                          className="
                            font-black
                          "
                        >
                          🔗{" "}
                          {workflow.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            deleteWorkflow(
                              workflow.id
                            )
                          }
                          className="
                            text-gray-700
                            hover:text-red-300
                          "
                        >
                          ✕
                        </button>
                      </div>

                      <div
                        className="
                          mt-4
                          space-y-2
                        "
                      >
                        {workflow.steps.map(
                          (
                            step,
                            index
                          ) => (
                            <p
                              key={`${workflow.id}-${index}`}
                              className="
                                text-sm
                                text-gray-400
                              "
                            >
                              {index +
                                1}
                              . {step}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </LabPanel>
        )}

        {/* =================================================
            3 PROMPT DNA
        ================================================= */}

        {activeTool ===
          "dna" && (
          <LabPanel
            eyebrow="🧬 03 • PROMPT DNA LAB"
            title="One Topic. Four Prompt Personalities."
            description="Transform the same idea into Simple, Professional, Creative and Viral prompts."
          >
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
                  dnaTopic
                }
                onChange={(event) =>
                  setDnaTopic(
                    event.target.value
                  )
                }
                placeholder="Example: Artificial Intelligence"
                className="
                  min-h-[52px]
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  outline-none
                  placeholder:text-gray-700
                "
              />

              <button
                type="button"
                onClick={
                  generateDNA
                }
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-purple-500
                  to-pink-500
                  px-7
                  py-3
                  font-black
                "
              >
                🧬 Generate DNA
              </button>
            </div>

            <div
              className="
                mt-7
                grid
                gap-4
                md:grid-cols-2
              "
            >
              {dnaResults.map(
                (item) => (
                  <div
                    key={
                      item.type
                    }
                    className="
                      rounded-3xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
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
                      <h3
                        className="
                          text-lg
                          font-black
                        "
                      >
                        {item.icon}{" "}
                        {item.type}
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          favoriteDNA(
                            item.text
                          )
                        }
                        className="
                          text-xl
                        "
                      >
                        {data.favoritePromptDNA ===
                        item.text
                          ? "❤️"
                          : "🤍"}
                      </button>
                    </div>

                    <p
                      className="
                        mt-4
                        text-sm
                        leading-7
                        text-gray-400
                      "
                    >
                      {item.text}
                    </p>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            item.text
                          );

                          showToast(
                            "📋 Prompt copied!"
                          );
                        } catch {
                          showToast(
                            "Unable to copy"
                          );
                        }
                      }}
                      className="
                        mt-5
                        rounded-xl
                        border
                        border-white/10
                        px-4
                        py-2
                        text-xs
                        font-black
                      "
                    >
                      Copy Prompt
                    </button>
                  </div>
                )
              )}
            </div>
          </LabPanel>
        )}

        {/* =================================================
            4 TIME SAVER
        ================================================= */}

        {activeTool ===
          "time" && (
          <LabPanel
            eyebrow="⏱️ 04 • AI TIME SAVER"
            title="How Much Time Does AI Save You?"
            description="Compare your normal task time with your AI-assisted task time."
          >
            <div
              className="
                mt-6
                grid
                gap-4
                md:grid-cols-3
              "
            >
              <NumberInput
                label="Manual Minutes"
                value={
                  manualMinutes
                }
                onChange={
                  setManualMinutes
                }
              />

              <NumberInput
                label="AI Minutes"
                value={
                  aiMinutes
                }
                onChange={
                  setAiMinutes
                }
              />

              <NumberInput
                label="Tasks Per Week"
                value={
                  weeklyTasks
                }
                onChange={
                  setWeeklyTasks
                }
              />
            </div>

            <div
              className="
                mt-7
                grid
                gap-4
                sm:grid-cols-3
              "
            >
              <MetricCard
                icon="⚡"
                value={`${timeSaved} min`}
                label="Saved Per Task"
              />

              <MetricCard
                icon="📅"
                value={`${(
                  weeklySaved /
                  60
                ).toFixed(
                  1
                )} hrs`}
                label="Saved Per Week"
              />

              <MetricCard
                icon="🚀"
                value={`${(
                  monthlySaved /
                  60
                ).toFixed(
                  1
                )} hrs`}
                label="Saved Per Month"
              />
            </div>

            <button
              type="button"
              onClick={
                saveTimeResult
              }
              className="
                mt-6
                rounded-xl
                bg-white
                px-6
                py-3
                font-black
                text-black
              "
            >
              💾 Save Result
            </button>
          </LabPanel>
        )}

        {/* =================================================
            5 IDEA FUSION
        ================================================= */}

        {activeTool ===
          "fusion" && (
          <LabPanel
            eyebrow="💡 05 • IDEA FUSION MACHINE"
            title="Combine Two Ideas Into Something New"
            description="Enter two topics and Innovation Lab will create hybrid project concepts."
          >
            <div
              className="
                mt-6
                grid
                gap-3
                md:grid-cols-[1fr_auto_1fr]
                md:items-center
              "
            >
              <input
                value={
                  fusionA
                }
                onChange={(event) =>
                  setFusionA(
                    event.target.value
                  )
                }
                placeholder="Idea 1 — Education"
                className="
                  min-h-[54px]
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  outline-none
                "
              />

              <div
                className="
                  text-center
                  text-2xl
                "
              >
                +
              </div>

              <input
                value={
                  fusionB
                }
                onChange={(event) =>
                  setFusionB(
                    event.target.value
                  )
                }
                placeholder="Idea 2 — Gaming"
                className="
                  min-h-[54px]
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  outline-none
                "
              />
            </div>

            <button
              type="button"
              onClick={
                fuseIdeas
              }
              className="
                mt-5
                rounded-xl
                bg-gradient-to-r
                from-yellow-400
                to-orange-500
                px-7
                py-3
                font-black
                text-black
              "
            >
              💥 Fuse Ideas
            </button>

            <div
              className="
                mt-7
                grid
                gap-4
                md:grid-cols-2
              "
            >
              {fusionResults.map(
                (item) => (
                  <div
                    key={
                      item.title
                    }
                    className="
                      rounded-3xl
                      border
                      border-yellow-400/15
                      bg-yellow-400/[0.035]
                      p-6
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
                        mt-3
                        text-sm
                        leading-7
                        text-gray-500
                      "
                    >
                      {item.text}
                    </p>
                  </div>
                )
              )}
            </div>
          </LabPanel>
        )}

        {/* =================================================
            6 CREATOR SCORE
        ================================================= */}

        {activeTool ===
          "creator" && (
          <LabPanel
            eyebrow="📊 06 • CREATOR POTENTIAL SCORE"
            title="Measure Your AI Creator Strength"
            description="Adjust the five skill areas and discover your current creator score."
          >
            <div
              className="
                mt-6
                grid
                gap-5
                lg:grid-cols-[1fr_300px]
              "
            >
              <div
                className="
                  space-y-5
                "
              >
                {Object.entries(
                  creatorSkills
                ).map(
                  ([
                    key,
                    value,
                  ]) => (
                    <div
                      key={key}
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
                          justify-between
                          gap-4
                        "
                      >
                        <p
                          className="
                            capitalize
                            font-black
                          "
                        >
                          {key}
                        </p>

                        <p
                          className="
                            font-black
                            text-cyan-300
                          "
                        >
                          {value}
                        </p>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={
                          value
                        }
                        onChange={(event) =>
                          setCreatorSkills({
                            ...creatorSkills,

                            [key]:
                              Number(
                                event
                                  .target
                                  .value
                              ),
                          })
                        }
                        className="
                          mt-4
                          w-full
                        "
                      />
                    </div>
                  )
                )}
              </div>

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/[0.04]
                  p-8
                  text-center
                "
              >
                <p
                  className="
                    text-sm
                    font-black
                    text-cyan-300
                  "
                >
                  CREATOR SCORE
                </p>

                <div
                  className="
                    mt-5
                    flex
                    h-40
                    w-40
                    items-center
                    justify-center
                    rounded-full
                    border-8
                    border-cyan-400/25
                    text-5xl
                    font-black
                  "
                >
                  {creatorScore}
                </div>

                <p
                  className="
                    mt-5
                    text-sm
                    text-gray-500
                  "
                >
                  {creatorScore >=
                  80
                    ? "🔥 Excellent creator potential"
                    : creatorScore >=
                        60
                      ? "🚀 Strong foundation"
                      : creatorScore >=
                          40
                        ? "🌱 Growing creator"
                        : "💡 Start building your skills"}
                </p>

                <button
                  type="button"
                  onClick={
                    saveCreatorScore
                  }
                  className="
                    mt-6
                    rounded-xl
                    bg-white
                    px-6
                    py-3
                    font-black
                    text-black
                  "
                >
                  Save Score
                </button>
              </div>
            </div>
          </LabPanel>
        )}

        {/* =================================================
            7 PRIVACY
        ================================================= */}

        {activeTool ===
          "privacy" && (
          <LabPanel
            eyebrow="🛡️ 07 • AI PRIVACY CHECKER"
            title="Check Before You Paste Into AI"
            description="This basic checker runs inside your browser and looks for common sensitive patterns."
          >
            <textarea
              value={
                privacyText
              }
              onChange={(event) =>
                setPrivacyText(
                  event.target.value
                )
              }
              placeholder="Paste or type your prompt here..."
              className="
                mt-6
                min-h-[220px]
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/30
                p-5
                leading-7
                outline-none
                placeholder:text-gray-700
                focus:border-green-400/40
              "
            />

            <div
              className={`
                mt-5
                rounded-2xl
                border
                p-5

                ${
                  privacyText &&
                  privacyWarnings.length ===
                    0
                    ? `
                      border-green-400/25
                      bg-green-400/[0.04]
                    `
                    : privacyWarnings.length >
                        0
                      ? `
                        border-red-400/25
                        bg-red-400/[0.04]
                      `
                      : `
                        border-white/[0.07]
                        bg-white/[0.02]
                      `
                }
              `}
            >
              {!privacyText && (
                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  🛡️ Enter some text
                  to begin checking.
                </p>
              )}

              {privacyText &&
                privacyWarnings.length ===
                  0 && (
                  <p
                    className="
                      font-black
                      text-green-300
                    "
                  >
                    ✅ No common
                    sensitive patterns
                    detected.
                  </p>
                )}

              {privacyWarnings.length >
                0 && (
                <>
                  <p
                    className="
                      font-black
                      text-red-300
                    "
                  >
                    ⚠️ Check this
                    prompt before
                    sharing:
                  </p>

                  <div
                    className="
                      mt-4
                      space-y-2
                    "
                  >
                    {privacyWarnings.map(
                      (warning) => (
                        <p
                          key={
                            warning
                          }
                          className="
                            text-sm
                            text-red-200
                          "
                        >
                          • {warning}
                        </p>
                      )
                    )}
                  </div>
                </>
              )}
            </div>

            <p
              className="
                mt-4
                text-xs
                leading-6
                text-gray-600
              "
            >
              Note: This is a basic
              pattern checker, not a
              guarantee that text is
              safe or free of all
              sensitive information.
            </p>
          </LabPanel>
        )}

        {/* =================================================
            8 EXPERIMENTS
        ================================================= */}

        {activeTool ===
          "experiments" && (
          <LabPanel
            eyebrow="🧪 08 • AI EXPERIMENT TRACKER"
            title="Turn Ideas Into Experiments"
            description="Track your AI experiments from idea to testing, success or failure."
          >
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
                  experimentName
                }
                onChange={(event) =>
                  setExperimentName(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addExperiment();
                  }
                }}
                placeholder="Example: Test AI-generated YouTube titles"
                className="
                  min-h-[52px]
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  outline-none
                "
              />

              <button
                type="button"
                onClick={
                  addExperiment
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
                + New Experiment
              </button>
            </div>

            <div
              className="
                mt-6
                space-y-3
              "
            >
              {data.experiments
                .length === 0 ? (
                <EmptyState
                  icon="🧪"
                  text="No experiments yet. Create your first AI experiment."
                />
              ) : (
                data.experiments.map(
                  (experiment) => (
                    <div
                      key={
                        experiment.id
                      }
                      className="
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        p-5
                        lg:flex-row
                        lg:items-center
                      "
                    >
                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <h3
                          className="
                            font-black
                          "
                        >
                          🧪{" "}
                          {experiment.name}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-600
                          "
                        >
                          Status:{" "}
                          {experiment.status}
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {[
                          "Idea",
                          "Testing",
                          "Success",
                          "Failed",
                        ].map(
                          (status) => (
                            <button
                              key={
                                status
                              }
                              type="button"
                              onClick={() =>
                                changeExperimentStatus(
                                  experiment.id,
                                  status
                                )
                              }
                              className={`
                                rounded-lg
                                border
                                px-3
                                py-2
                                text-xs
                                font-black

                                ${
                                  experiment.status ===
                                  status
                                    ? `
                                      border-cyan-400/30
                                      bg-cyan-400/[0.08]
                                      text-cyan-300
                                    `
                                    : `
                                      border-white/10
                                      text-gray-500
                                    `
                                }
                              `}
                            >
                              {status}
                            </button>
                          )
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteExperiment(
                              experiment.id
                            )
                          }
                          className="
                            rounded-lg
                            border
                            border-red-400/15
                            px-3
                            py-2
                            text-xs
                            font-black
                            text-red-300
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </LabPanel>
        )}

        {/* =================================================
            9 BUILD GENERATOR
        ================================================= */}

        {activeTool ===
          "project" && (
          <LabPanel
            eyebrow="🎲 09 • WHAT SHOULD I BUILD?"
            title="One Click. One New AI Project."
            description="Use this when you want to build something but don't know what to create."
          >
            <div
              className="
                mt-8
                text-center
              "
            >
              <button
                type="button"
                onClick={
                  generateProject
                }
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-400
                  via-purple-500
                  to-pink-500
                  px-8
                  py-4
                  text-lg
                  font-black
                  shadow-[0_0_35px_rgba(168,85,247,.15)]
                  transition
                  hover:scale-[1.03]
                "
              >
                🎲 Surprise Me
              </button>
            </div>

            {randomProject && (
              <div
                className="
                  mx-auto
                  mt-8
                  max-w-3xl
                  rounded-[30px]
                  border
                  border-purple-400/25
                  bg-purple-400/[0.045]
                  p-7
                  sm:p-9
                "
              >
                <div
                  className="
                    text-5xl
                  "
                >
                  {randomProject.icon}
                </div>

                <p
                  className="
                    mt-5
                    text-xs
                    font-black
                    tracking-wider
                    text-purple-300
                  "
                >
                  YOUR NEXT PROJECT
                </p>

                <h3
                  className="
                    mt-2
                    text-2xl
                    font-black
                    sm:text-3xl
                  "
                >
                  {randomProject.title}
                </h3>

                <p
                  className="
                    mt-4
                    leading-7
                    text-gray-400
                  "
                >
                  {
                    randomProject.description
                  }
                </p>

                <div
                  className="
                    mt-6
                    grid
                    gap-3
                    sm:grid-cols-3
                  "
                >
                  <MiniInfo
                    label="Difficulty"
                    value={
                      randomProject.difficulty
                    }
                  />

                  <MiniInfo
                    label="Estimated Time"
                    value={
                      randomProject.time
                    }
                  />

                  <MiniInfo
                    label="Suggested Tools"
                    value={
                      randomProject.tools
                    }
                  />
                </div>
              </div>
            )}
          </LabPanel>
        )}

        {/* =================================================
            10 AI OPERATING SYSTEM
        ================================================= */}

        {activeTool ===
          "os" && (
          <LabPanel
            eyebrow="🧠 10 • MY AI OPERATING SYSTEM"
            title="Your Personal Innovation Dashboard"
            description="Everything created inside Innovation Lab summarized in one place."
          >
            <div
              className="
                mt-7
                grid
                gap-4
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              <MetricCard
                icon="🔗"
                value={
                  data.workflows
                    .length
                }
                label="Saved Workflows"
              />

              <MetricCard
                icon="🧪"
                value={
                  data.experiments
                    .length
                }
                label="Experiments"
              />

              <MetricCard
                icon="✅"
                value={
                  successfulExperiments
                }
                label="Successful Tests"
              />

              <MetricCard
                icon="⚡"
                value={
                  activeExperiments
                }
                label="Currently Testing"
              />

              <MetricCard
                icon="⏱️"
                value={`${(
                  data.timeSavedMinutes /
                  60
                ).toFixed(
                  1
                )}h`}
                label="Monthly Time Saved"
              />

              <MetricCard
                icon="📊"
                value={
                  data.creatorScore ??
                  "--"
                }
                label="Creator Score"
              />

              <MetricCard
                icon="🎲"
                value={
                  data.goalsBuilt
                }
                label="Ideas Generated"
              />

              <MetricCard
                icon="🧬"
                value={
                  data.favoritePromptDNA
                    ? "1"
                    : "0"
                }
                label="Favorite DNA Prompt"
              />
            </div>

            <div
              className="
                mt-7
                grid
                gap-5
                lg:grid-cols-2
              "
            >
              <div
                className="
                  rounded-3xl
                  border
                  border-cyan-400/15
                  bg-cyan-400/[0.035]
                  p-6
                "
              >
                <p
                  className="
                    text-sm
                    font-black
                    text-cyan-300
                  "
                >
                  🧠 AI OS INSIGHT
                </p>

                <h3
                  className="
                    mt-3
                    text-xl
                    font-black
                  "
                >
                  Your Innovation Status
                </h3>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-gray-500
                  "
                >
                  {data.experiments
                    .length === 0
                    ? "Start your first experiment. Small tests are the fastest way to understand what AI can really do."
                    : successfulExperiments >
                        0
                      ? `You already have ${successfulExperiments} successful experiment(s). Turn the best one into a repeatable workflow.`
                      : "You are experimenting. Keep testing ideas and mark the useful ones as Success."}
                </p>
              </div>

              <div
                className="
                  rounded-3xl
                  border
                  border-purple-400/15
                  bg-purple-400/[0.035]
                  p-6
                "
              >
                <p
                  className="
                    text-sm
                    font-black
                    text-purple-300
                  "
                >
                  🚀 NEXT ACTION
                </p>

                <h3
                  className="
                    mt-3
                    text-xl
                    font-black
                  "
                >
                  Build → Test →
                  Improve
                </h3>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-gray-500
                  "
                >
                  Use Decision Arena
                  to choose a tool,
                  Workflow Builder to
                  organize the process,
                  and Experiment
                  Tracker to measure
                  your result.
                </p>
              </div>
            </div>

            {data.favoritePromptDNA && (
              <div
                className="
                  mt-6
                  rounded-3xl
                  border
                  border-pink-400/15
                  bg-pink-400/[0.035]
                  p-6
                "
              >
                <p
                  className="
                    text-sm
                    font-black
                    text-pink-300
                  "
                >
                  ❤️ FAVORITE PROMPT DNA
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-gray-400
                  "
                >
                  {
                    data.favoritePromptDNA
                  }
                </p>
              </div>
            )}
          </LabPanel>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function LabPanel({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section
      className="
        mt-6
        rounded-[30px]
        border
        border-white/[0.08]
        bg-black/25
        p-5
        backdrop-blur-xl
        sm:p-8
        lg:p-9
      "
    >
      <p
        className="
          text-xs
          font-black
          tracking-wider
          text-cyan-300
        "
      >
        {eyebrow}
      </p>

      <h2
        className="
          mt-3
          text-2xl
          font-black
          sm:text-3xl
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-2
          max-w-3xl
          text-sm
          leading-7
          text-gray-500
        "
      >
        {description}
      </p>

      {children}
    </section>
  );
}

function HeroStat({
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
        p-4
      "
    >
      <p
        className="
          text-xl
          font-black
          sm:text-2xl
        "
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

function SelectCard({
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
              bg-white/[0.02]
              text-gray-500
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

function NumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <label
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-5
      "
    >
      <span
        className="
          text-xs
          font-black
          text-gray-500
        "
      >
        {label}
      </span>

      <input
        type="number"
        min="0"
        value={
          value
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          mt-3
          w-full
          bg-transparent
          text-3xl
          font-black
          outline-none
        "
      />
    </label>
  );
}

function MetricCard({
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

function MiniInfo({
  label,
  value,
}) {
  return (
    <div
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
          text-[10px]
          font-black
          text-gray-600
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-sm
          font-black
        "
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  text,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-dashed
        border-white/10
        p-10
        text-center
      "
    >
      <div
        className="
          text-4xl
        "
      >
        {icon}
      </div>

      <p
        className="
          mt-4
          text-sm
          text-gray-600
        "
      >
        {text}
      </p>
    </div>
  );
}