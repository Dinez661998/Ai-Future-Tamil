import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   AI FUTURE TAMIL
   EXPERIENCE ZONE
   10 INTERACTIVE EXPERIENCES
========================================================= */

const STORAGE_KEY = "aft_experience_zone_v1";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_DATA = {
  challengeCompleted: 0,
  challengeStreak: 0,
  lastChallengeDate: "",
  adventureUnlocked: 1,
  adventureCompleted: [],
  puzzleLevel: 0,
  puzzleSolved: [],
  battleWins: 0,
  battlePlayed: 0,
  bestCareer: null,
  ideaTrees: [],
  storyScenes: [],
  launchBestScore: 0,
};

/* =========================================================
   HELPERS
========================================================= */

function safeLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return DEFAULT_DATA;
    }

    return {
      ...DEFAULT_DATA,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function saveData(data) {
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

function todayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* =========================================================
   CHALLENGES
========================================================= */

const CHALLENGES = [
  {
    icon: "🎬",
    title: "Viral Hook Mission",
    text: "Create 3 powerful hooks for a YouTube video about AI.",
    xp: 40,
  },
  {
    icon: "🎨",
    title: "Thumbnail Mission",
    text: "Create a thumbnail idea with one subject, one emotion and maximum 4 words.",
    xp: 35,
  },
  {
    icon: "💻",
    title: "Coding Mission",
    text: "Build a simple feature idea that uses HTML, CSS or React.",
    xp: 50,
  },
  {
    icon: "📚",
    title: "Study Mission",
    text: "Explain one difficult topic using a simple real-life example.",
    xp: 30,
  },
  {
    icon: "🤖",
    title: "Prompt Mission",
    text: "Create one professional AI prompt with role, task, context and output format.",
    xp: 45,
  },
  {
    icon: "🚀",
    title: "Product Mission",
    text: "Think of one AI product that solves a small everyday problem.",
    xp: 60,
  },
];

/* =========================================================
   ADVENTURE MAP
========================================================= */

const ADVENTURE_LEVELS = [
  {
    id: 1,
    icon: "🌱",
    title: "AI Beginner",
    subtitle: "Understand the basics",
    mission: "Name 3 ways AI can help you.",
  },
  {
    id: 2,
    icon: "🧭",
    title: "AI Explorer",
    subtitle: "Explore useful tools",
    mission: "Choose 3 AI tools for 3 different tasks.",
  },
  {
    id: 3,
    icon: "✨",
    title: "Prompt Creator",
    subtitle: "Control AI better",
    mission: "Create one prompt with Role + Task + Context.",
  },
  {
    id: 4,
    icon: "⚡",
    title: "AI Builder",
    subtitle: "Build workflows",
    mission: "Create one 4-step AI workflow.",
  },
  {
    id: 5,
    icon: "👑",
    title: "AI Master",
    subtitle: "Create your own system",
    mission: "Design one complete AI-powered project.",
  },
];

/* =========================================================
   PUZZLES
========================================================= */

const PUZZLES = [
  {
    question:
      "I can write, summarize and brainstorm. I understand natural language. Who am I?",
    options: [
      "AI Chat Assistant",
      "Photo Editor",
      "Calculator",
      "Cloud Storage",
    ],
    answer: 0,
    hint: "You talk to this AI using text.",
  },
  {
    question:
      "Which prompt usually gives a better result?",
    options: [
      "Make something",
      "Write",
      "Act as a YouTube strategist and create 5 Tamil tech video ideas with hooks",
      "Do AI",
    ],
    answer: 2,
    hint: "More context and clear instructions usually help.",
  },
  {
    question:
      "Which item should you avoid sharing carelessly with AI tools?",
    options: [
      "Movie title",
      "Public blog topic",
      "Password",
      "Study subject",
    ],
    answer: 2,
    hint: "Think about sensitive information.",
  },
  {
    question:
      "Research → Script → Image → Video → Publish is an example of what?",
    options: [
      "AI Workflow",
      "Password",
      "Browser Cache",
      "Database Table",
    ],
    answer: 0,
    hint: "It is a sequence of connected tasks.",
  },
  {
    question:
      "You want better output from AI. What should you improve first?",
    options: [
      "Monitor brightness",
      "Prompt clarity",
      "Keyboard size",
      "Wi-Fi name",
    ],
    answer: 1,
    hint: "Clear instructions matter.",
  },
];

/* =========================================================
   CAREERS
========================================================= */

const CAREERS = [
  {
    name: "AI Creator",
    icon: "🎬",
    weights: {
      creativity: 35,
      communication: 25,
      technical: 10,
      business: 15,
      consistency: 15,
    },
  },
  {
    name: "Prompt Engineer",
    icon: "✨",
    weights: {
      creativity: 20,
      communication: 30,
      technical: 25,
      business: 10,
      consistency: 15,
    },
  },
  {
    name: "AI Developer",
    icon: "💻",
    weights: {
      creativity: 10,
      communication: 10,
      technical: 50,
      business: 10,
      consistency: 20,
    },
  },
  {
    name: "AI Designer",
    icon: "🎨",
    weights: {
      creativity: 45,
      communication: 15,
      technical: 15,
      business: 10,
      consistency: 15,
    },
  },
  {
    name: "AI Automation Specialist",
    icon: "⚙️",
    weights: {
      creativity: 10,
      communication: 15,
      technical: 35,
      business: 25,
      consistency: 15,
    },
  },
];

/* =========================================================
   MAIN
========================================================= */

export default function ExperienceZone() {
  const [data, setData] = useState(DEFAULT_DATA);

  const [activeTab, setActiveTab] =
    useState("personality");

  const [toast, setToast] = useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    setData(safeLoad());
  }, []);

  function updateData(next) {
    setData(next);
    saveData(next);
  }

  function notify(message) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2200);
  }

  /* =======================================================
     1 PERSONALITY SIMULATOR
  ======================================================= */

  const [personality, setPersonality] =
    useState("Teacher");

  const [personalityQuestion, setPersonalityQuestion] =
    useState("Explain artificial intelligence");

  const personalityResult = useMemo(() => {
    const question =
      personalityQuestion.trim() ||
      "Artificial Intelligence";

    const results = {
      Teacher:
        `Imagine I am teaching this to a beginner. ${question} can be understood step by step. First, understand the basic idea, then see a simple example, and finally try it yourself.`,

      CEO:
        `${question} should be evaluated based on business value, efficiency, cost, scalability and measurable results. Focus on where it saves time, improves decisions or creates revenue.`,

      Developer:
        `From a developer perspective, "${question}" should be broken into inputs, logic, APIs or models, data flow, output and error handling. Start with a small prototype before scaling.`,

      Creator:
        `Turn "${question}" into something people want to watch. Start with a strong hook, create curiosity, simplify the information and finish with a memorable takeaway.`,

      Coach:
        `For "${question}", do not try to master everything today. Choose one small action, practice it consistently, measure your improvement and build confidence step by step.`,
    };

    return results[personality];
  }, [
    personality,
    personalityQuestion,
  ]);

  /* =======================================================
     2 ROULETTE
  ======================================================= */

  const [wheelRotation, setWheelRotation] =
    useState(0);

  const [wheelSpinning, setWheelSpinning] =
    useState(false);

  const [selectedChallenge, setSelectedChallenge] =
    useState(null);

  function spinChallenge() {
    if (wheelSpinning) {
      return;
    }

    const index = Math.floor(
      Math.random() * CHALLENGES.length
    );

    const segment =
      360 / CHALLENGES.length;

    const stopAngle =
      360 - index * segment - segment / 2;

    const extraTurns =
      1440 + Math.floor(Math.random() * 360);

    const final =
      wheelRotation +
      extraTurns +
      stopAngle;

    setWheelSpinning(true);
    setSelectedChallenge(null);
    setWheelRotation(final);

    window.setTimeout(() => {
      setSelectedChallenge(
        CHALLENGES[index]
      );

      setWheelSpinning(false);

      notify("🎯 New challenge unlocked!");
    }, 1700);
  }

  function completeChallenge() {
    if (!selectedChallenge) {
      return;
    }

    const today = todayKey();

    let streak =
      Number(data.challengeStreak || 0);

    if (
      data.lastChallengeDate !== today
    ) {
      streak += 1;
    }

    updateData({
      ...data,
      challengeCompleted:
        Number(
          data.challengeCompleted || 0
        ) + 1,
      challengeStreak: streak,
      lastChallengeDate: today,
    });

    notify(
      `🏆 Mission complete! +${selectedChallenge.xp} XP`
    );

    setSelectedChallenge(null);
  }

  /* =======================================================
     3 ADVENTURE MAP
  ======================================================= */

  function completeAdventure(level) {
    if (
      data.adventureCompleted.includes(
        level.id
      )
    ) {
      return;
    }

    const completed = [
      ...data.adventureCompleted,
      level.id,
    ];

    updateData({
      ...data,
      adventureCompleted: completed,
      adventureUnlocked: Math.min(
        ADVENTURE_LEVELS.length,
        Math.max(
          data.adventureUnlocked,
          level.id + 1
        )
      ),
    });

    notify(
      `${level.icon} ${level.title} completed!`
    );
  }

  /* =======================================================
     4 HUMAN VS AI
  ======================================================= */

  const [battleTopic, setBattleTopic] =
    useState("Give one idea to use AI for studying");

  const [humanAnswer, setHumanAnswer] =
    useState("");

  const [battleResult, setBattleResult] =
    useState(null);

  function runBattle() {
    if (!humanAnswer.trim()) {
      notify(
        "⚔️ Type your answer first"
      );
      return;
    }

    const words =
      humanAnswer.trim().split(/\s+/).length;

    const humanClarity = clamp(
      45 + words * 3,
      40,
      95
    );

    const humanCreativity = clamp(
      50 +
        (humanAnswer.includes("example")
          ? 12
          : 0) +
        (humanAnswer.length > 80
          ? 10
          : 0),
      45,
      96
    );

    const aiClarity = 88;
    const aiCreativity = 82;

    const humanTotal = Math.round(
      (humanClarity + humanCreativity) /
        2
    );

    const aiTotal = Math.round(
      (aiClarity + aiCreativity) / 2
    );

    const winner =
      humanTotal > aiTotal
        ? "Human"
        : humanTotal === aiTotal
          ? "Draw"
          : "AI";

    const aiAnswer =
      `Use AI as a personal study coach: ask it to explain the topic simply, generate a short quiz, check your answers and create a revision plan based on your weak areas.`;

    const won =
      winner === "Human";

    updateData({
      ...data,
      battlePlayed:
        Number(data.battlePlayed || 0) +
        1,
      battleWins:
        Number(data.battleWins || 0) +
        (won ? 1 : 0),
    });

    setBattleResult({
      humanClarity,
      humanCreativity,
      humanTotal,
      aiClarity,
      aiCreativity,
      aiTotal,
      winner,
      aiAnswer,
    });
  }

  /* =======================================================
     5 MOOD TRANSFORMER
  ======================================================= */

  const [moodText, setMoodText] =
    useState(
      "Our new AI course will help beginners learn faster."
    );

  const [mood, setMood] =
    useState("Cinematic");

  const transformedMood = useMemo(() => {
    const text =
      moodText.trim() ||
      "Your content";

    const moodMap = {
      Funny:
        `😂 Plot twist: ${text} And yes, your brain can finally stop pretending it understood everything on the first try.`,

      Professional:
        `💼 ${text} The experience is designed to provide clear, structured and practical learning outcomes for users.`,

      Emotional:
        `❤️ ${text} Every small lesson can become the moment someone finally believes they are capable of learning something new.`,

      Cinematic:
        `🎬 The future is moving fast. The question is—will you watch it happen, or build with it? ${text}`,

      Luxury:
        `💎 A premium learning experience crafted for ambitious beginners. ${text} Simple. Refined. Powerful.`,

      "Gen-Z":
        `⚡ POV: you finally found a way to learn AI without getting bored 😭🔥 ${text} Let's cook.`,
    };

    return moodMap[mood];
  }, [
    mood,
    moodText,
  ]);

  /* =======================================================
     6 PUZZLE ROOM
  ======================================================= */

  const currentPuzzle =
    PUZZLES[
      Math.min(
        data.puzzleLevel,
        PUZZLES.length - 1
      )
    ];

  const [puzzleChoice, setPuzzleChoice] =
    useState(null);

  const [showHint, setShowHint] =
    useState(false);

  const [puzzleFeedback, setPuzzleFeedback] =
    useState("");

  function answerPuzzle(index) {
    setPuzzleChoice(index);

    if (
      index === currentPuzzle.answer
    ) {
      setPuzzleFeedback(
        "✅ Correct! Room unlocked."
      );

      const solvedIndex =
        data.puzzleLevel;

      if (
        !data.puzzleSolved.includes(
          solvedIndex
        )
      ) {
        const nextLevel = Math.min(
          PUZZLES.length,
          data.puzzleLevel + 1
        );

        updateData({
          ...data,
          puzzleSolved: [
            ...data.puzzleSolved,
            solvedIndex,
          ],
          puzzleLevel: nextLevel,
        });
      }

      window.setTimeout(() => {
        setPuzzleChoice(null);
        setShowHint(false);
        setPuzzleFeedback("");
      }, 1200);
    } else {
      setPuzzleFeedback(
        "❌ Not correct. Try again or use the hint."
      );
    }
  }

  /* =======================================================
     7 CAREER SIMULATOR
  ======================================================= */

  const [careerSkills, setCareerSkills] =
    useState({
      creativity: 60,
      communication: 60,
      technical: 50,
      business: 45,
      consistency: 70,
    });

  const careerMatches = useMemo(() => {
    return CAREERS.map((career) => {
      const total = Object.entries(
        career.weights
      ).reduce(
        (
          sum,
          [skill, weight]
        ) =>
          sum +
          (careerSkills[skill] *
            weight) /
            100,
        0
      );

      return {
        ...career,
        score: Math.round(total),
      };
    }).sort(
      (a, b) => b.score - a.score
    );
  }, [careerSkills]);

  function saveBestCareer() {
    const best =
      careerMatches[0];

    updateData({
      ...data,
      bestCareer: {
        name: best.name,
        icon: best.icon,
        score: best.score,
      },
    });

    notify(
      `${best.icon} ${best.name} saved as your best match`
    );
  }

  /* =======================================================
     8 IDEA EVOLUTION TREE
  ======================================================= */

  const [ideaSeed, setIdeaSeed] =
    useState("Tamil AI Learning");

  const [ideaTree, setIdeaTree] =
    useState([]);

  function growIdeaTree() {
    const seed =
      ideaSeed.trim();

    if (!seed) {
      notify("🌱 Enter an idea first");
      return;
    }

    const tree = [
      {
        id: uid(),
        icon: "📱",
        title: `${seed} App`,
        child:
          `Build a simple mobile-first tool around ${seed}.`,
      },
      {
        id: uid(),
        icon: "🎬",
        title: `${seed} Content Channel`,
        child:
          `Create short-form and long-form educational content about ${seed}.`,
      },
      {
        id: uid(),
        icon: "💼",
        title: `${seed} Business`,
        child:
          `Turn ${seed} into a paid service, membership or digital product.`,
      },
      {
        id: uid(),
        icon: "🎓",
        title: `${seed} Course`,
        child:
          `Create a structured beginner-to-advanced learning path for ${seed}.`,
      },
      {
        id: uid(),
        icon: "🤖",
        title: `${seed} AI Assistant`,
        child:
          `Create a focused AI helper that answers questions about ${seed}.`,
      },
    ];

    setIdeaTree(tree);
  }

  function expandIdea(branch) {
    const variants = [
      `${branch.title} Lite`,
      `${branch.title} Pro`,
      `${branch.title} for Beginners`,
    ];

    setIdeaTree((current) =>
      current.map((item) =>
        item.id === branch.id
          ? {
              ...item,
              expanded: true,
              variants,
            }
          : item
      )
    );
  }

  function saveIdeaTree() {
    if (ideaTree.length === 0) {
      return;
    }

    updateData({
      ...data,
      ideaTrees: [
        {
          id: uid(),
          seed: ideaSeed,
          branches: ideaTree,
          createdAt:
            new Date().toISOString(),
        },
        ...data.ideaTrees,
      ].slice(0, 8),
    });

    notify(
      "🌳 Idea Evolution Tree saved!"
    );
  }

  /* =======================================================
     9 STORY BUILDER
  ======================================================= */

  const [storySettings, setStorySettings] =
    useState({
      character: "Young Inventor",
      place: "Floating City",
      mood: "Magical",
      genre: "Adventure",
    });

  const [storyScenes, setStoryScenes] =
    useState([]);

  function createStoryScene() {
    const sceneNumber =
      storyScenes.length + 1;

    const templates = [
      `${storySettings.character} arrives at ${storySettings.place} and discovers a mysterious AI device glowing in the distance.`,

      `A hidden message appears. It warns ${storySettings.character} that the city will lose its power unless a forgotten machine is activated before midnight.`,

      `${storySettings.character} enters an abandoned laboratory where every door responds only to clever questions and creative thinking.`,

      `A tiny robot becomes an unexpected companion and reveals a secret path beneath ${storySettings.place}.`,

      `The final machine awakens, filling the sky with light as ${storySettings.character} realizes the real key was courage, curiosity and teamwork.`,
    ];

    const text =
      templates[
        Math.min(
          sceneNumber - 1,
          templates.length - 1
        )
      ];

    const newScene = {
      id: uid(),
      number: sceneNumber,
      title: `Scene ${sceneNumber}`,
      text,
      mood: storySettings.mood,
      genre: storySettings.genre,
    };

    setStoryScenes([
      ...storyScenes,
      newScene,
    ]);
  }

  function saveStory() {
    if (storyScenes.length === 0) {
      return;
    }

    updateData({
      ...data,
      storyScenes:
        storyScenes,
    });

    notify(
      "🎬 Story saved!"
    );
  }

  /* =======================================================
     10 LAUNCH SIMULATOR
  ======================================================= */

  const [launchChecks, setLaunchChecks] =
    useState({
      idea: true,
      audience: false,
      design: false,
      content: false,
      testing: false,
      marketing: false,
    });

  const launchScore = useMemo(() => {
    const completed =
      Object.values(
        launchChecks
      ).filter(Boolean).length;

    return Math.round(
      (completed /
        Object.keys(launchChecks).length) *
        100
    );
  }, [launchChecks]);

  const launchStatus =
    launchScore >= 85
      ? {
          label: "READY TO LAUNCH",
          icon: "🚀",
          text: "Your project has a strong launch foundation.",
        }
      : launchScore >= 55
        ? {
            label: "ALMOST READY",
            icon: "⚡",
            text: "Good progress. Finish the missing launch areas.",
          }
        : {
            label: "BUILD MODE",
            icon: "🛠️",
            text: "Keep preparing before launching.",
          };

  function saveLaunchScore() {
    updateData({
      ...data,
      launchBestScore: Math.max(
        Number(
          data.launchBestScore || 0
        ),
        launchScore
      ),
    });

    notify(
      `🚀 Launch score ${launchScore}/100 saved`
    );
  }

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "personality",
      icon: "🧠",
      name: "Personality",
    },
    {
      id: "roulette",
      icon: "🎯",
      name: "Roulette",
    },
    {
      id: "adventure",
      icon: "🗺️",
      name: "Adventure",
    },
    {
      id: "battle",
      icon: "⚔️",
      name: "Battle",
    },
    {
      id: "mood",
      icon: "🎭",
      name: "Mood Lab",
    },
    {
      id: "puzzle",
      icon: "🧩",
      name: "Puzzle Room",
    },
    {
      id: "career",
      icon: "🔮",
      name: "Career",
    },
    {
      id: "tree",
      icon: "🌱",
      name: "Idea Tree",
    },
    {
      id: "story",
      icon: "🎬",
      name: "Story",
    },
    {
      id: "launch",
      icon: "🚀",
      name: "Launch",
    },
  ];

  return (
    <main
      className="
        experience-zone
        relative
        min-h-screen
        overflow-hidden
        bg-[#03040a]
        px-4
        py-8
        text-white
        sm:px-6
        lg:px-8
      "
    >
      {/* =====================================================
          CUSTOM ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes ezFloat {
          0%,100% { transform: translate3d(0,0,0) rotate(0deg); }
          50% { transform: translate3d(0,-18px,0) rotate(3deg); }
        }

        @keyframes ezPulse {
          0%,100% { opacity:.35; transform:scale(1); }
          50% { opacity:.75; transform:scale(1.08); }
        }

        @keyframes ezGlow {
          0%,100% {
            box-shadow:
              0 0 18px rgba(34,211,238,.08),
              inset 0 0 15px rgba(255,255,255,.02);
          }
          50% {
            box-shadow:
              0 0 38px rgba(168,85,247,.16),
              0 0 70px rgba(34,211,238,.08),
              inset 0 0 25px rgba(255,255,255,.03);
          }
        }

        @keyframes ezShine {
          0% { transform: translateX(-160%) skewX(-22deg); }
          70%,100% { transform: translateX(260%) skewX(-22deg); }
        }

        @keyframes ezStar {
          0%,100% { opacity:.15; transform:scale(.8); }
          50% { opacity:.8; transform:scale(1.25); }
        }

        @keyframes ezOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ezRadar {
          0% { transform:scale(.4); opacity:.7; }
          100% { transform:scale(1.5); opacity:0; }
        }

        @keyframes ezSlideUp {
          from {
            opacity:0;
            transform:translateY(18px);
          }
          to {
            opacity:1;
            transform:translateY(0);
          }
        }

        @keyframes ezGradient {
          0% { background-position:0% 50%; }
          50% { background-position:100% 50%; }
          100% { background-position:0% 50%; }
        }

        @keyframes ezBounceSoft {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-7px); }
        }

        @keyframes ezLineMove {
          0% { background-position:0 0; }
          100% { background-position:0 40px; }
        }

        .ez-panel {
          animation: ezSlideUp .45s ease both;
        }

        .ez-glow-card {
          animation: ezGlow 4s ease-in-out infinite;
        }

        .ez-floating {
          animation: ezFloat 7s ease-in-out infinite;
        }

        .ez-soft-bounce {
          animation: ezBounceSoft 2.4s ease-in-out infinite;
        }

        .ez-gradient-text {
          background:
            linear-gradient(
              90deg,
              #67e8f9,
              #a78bfa,
              #f472b6,
              #fde047,
              #67e8f9
            );
          background-size:300% 300%;
          animation: ezGradient 8s ease infinite;
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .ez-shine {
          position:relative;
          overflow:hidden;
        }

        .ez-shine::after {
          content:"";
          position:absolute;
          top:-30%;
          bottom:-30%;
          width:35%;
          left:-50%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.13),
              transparent
            );
          animation: ezShine 4s ease-in-out infinite;
          pointer-events:none;
        }

        .ez-space-grid {
          background-image:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size:42px 42px;
          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 92%
            );
        }

        .ez-scan {
          background-image:
            linear-gradient(
              to bottom,
              transparent 0%,
              rgba(34,211,238,.025) 50%,
              transparent 100%
            );
          background-size:100% 40px;
          animation:ezLineMove 2s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ez-glow-card,
          .ez-floating,
          .ez-soft-bounce,
          .ez-gradient-text,
          .ez-shine::after,
          .ez-scan {
            animation:none !important;
          }
        }
      `}</style>

      {/* SPACE BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="ez-space-grid absolute inset-0" />

        <div
          className="
            ez-floating
            absolute
            -left-28
            top-16
            h-[360px]
            w-[360px]
            rounded-full
            bg-cyan-500/[0.08]
            blur-[90px]
          "
        />

        <div
          className="
            ez-floating
            absolute
            right-[-120px]
            top-[260px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-purple-500/[0.10]
            blur-[110px]
          "
          style={{
            animationDelay: "-3s",
          }}
        />

        <div
          className="
            ez-floating
            absolute
            bottom-[-120px]
            left-[35%]
            h-[360px]
            w-[360px]
            rounded-full
            bg-pink-500/[0.07]
            blur-[100px]
          "
          style={{
            animationDelay: "-5s",
          }}
        />

        {Array.from({
          length: 26,
        }).map((_, index) => (
          <span
            key={index}
            className="
              absolute
              h-1
              w-1
              rounded-full
              bg-white
            "
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 61) % 95}%`,
              opacity:
                0.15 +
                (index % 5) * 0.1,
              animation:
                "ezStar 3s ease-in-out infinite",
              animationDelay: `${-(index % 8)}s`,
            }}
          />
        ))}
      </div>

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
            shadow-[0_0_50px_rgba(34,211,238,.22)]
            backdrop-blur-2xl
          "
        >
          {toast}
        </div>
      )}

      <div
        className="
          mx-auto
          w-full
          max-w-[1520px]
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            ez-glow-card
            ez-shine
            relative
            overflow-hidden
            rounded-[38px]
            border
            border-white/[0.09]
            bg-gradient-to-br
            from-white/[0.055]
            via-white/[0.018]
            to-purple-500/[0.045]
            p-6
            backdrop-blur-2xl
            sm:p-9
            lg:p-12
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-[300px]
              w-[300px]
              rounded-full
              border
              border-cyan-400/10
            "
            style={{
              animation:
                "ezOrbit 22s linear infinite",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              right-8
              top-10
              hidden
              h-44
              w-44
              rounded-full
              border
              border-purple-400/20
              lg:block
            "
          >
            <div
              className="
                absolute
                inset-5
                rounded-full
                border
                border-cyan-400/15
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-3
                w-3
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-cyan-300
                shadow-[0_0_20px_rgba(103,232,249,.8)]
              "
            />

            <div
              className="
                absolute
                inset-8
                rounded-full
                border
                border-cyan-300/20
              "
              style={{
                animation:
                  "ezRadar 2.2s ease-out infinite",
              }}
            />
          </div>

          <div className="relative z-10">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-purple-400/25
                bg-purple-400/[0.07]
                px-4
                py-2
                text-xs
                font-black
                tracking-[0.18em]
                text-purple-200
              "
            >
              <span className="ez-soft-bounce">
                🌌
              </span>

              AI EXPERIENCE ZONE
            </div>

            <h1
              className="
                mt-6
                max-w-5xl
                text-4xl
                font-black
                leading-[1.05]
                sm:text-5xl
                lg:text-7xl
              "
            >
              Enter the
              <span className="ez-gradient-text">
                {" "}
                Interactive AI Universe.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-3xl
                text-sm
                leading-7
                text-gray-400
                sm:text-base
              "
            >
              Play challenges, battle AI,
              explore careers, solve puzzles,
              evolve ideas, build stories and
              simulate your next big launch.
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
              <HeroMetric
                icon="🎯"
                value={
                  data.challengeCompleted
                }
                label="Challenges"
              />

              <HeroMetric
                icon="⚔️"
                value={
                  data.battleWins
                }
                label="Human Wins"
              />

              <HeroMetric
                icon="🧩"
                value={`${Math.min(
                  data.puzzleLevel,
                  PUZZLES.length
                )}/${PUZZLES.length}`}
                label="Puzzle Rooms"
              />

              <HeroMetric
                icon="🚀"
                value={`${data.launchBestScore}%`}
                label="Best Launch"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            EXPERIENCE SWITCHER
        ================================================= */}

        <section
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            md:grid-cols-5
            xl:grid-cols-10
          "
        >
          {tabs.map(
            (tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
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
                    activeTab ===
                    tab.id
                      ? `
                        -translate-y-1
                        border-cyan-400/40
                        bg-gradient-to-br
                        from-cyan-400/[0.10]
                        to-purple-500/[0.08]
                        shadow-[0_0_30px_rgba(34,211,238,.12)]
                      `
                      : `
                        border-white/[0.07]
                        bg-white/[0.02]
                        hover:-translate-y-1
                        hover:border-white/20
                        hover:bg-white/[0.04]
                      `
                  }
                `}
              >
                <span
                  className="
                    text-2xl
                    transition
                    duration-300
                    group-hover:scale-110
                  "
                >
                  {tab.icon}
                </span>

                <p
                  className="
                    mt-2
                    text-xs
                    font-black
                  "
                >
                  {tab.name}
                </p>

                <span
                  className="
                    absolute
                    right-2
                    top-2
                    text-[9px]
                    font-black
                    text-white/15
                  "
                >
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>
              </button>
            )
          )}
        </section>

        {/* =================================================
            1 PERSONALITY
        ================================================= */}

        {activeTab ===
          "personality" && (
          <ExperiencePanel
            eyebrow="🧠 EXPERIENCE 01"
            title="AI Personality Simulator"
            description="Same question. Completely different way of thinking."
            accent="cyan"
          >
            <div
              className="
                mt-7
                grid
                gap-3
                sm:grid-cols-5
              "
            >
              {[
                "Teacher",
                "CEO",
                "Developer",
                "Creator",
                "Coach",
              ].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setPersonality(
                        item
                      )
                    }
                    className={`
                      rounded-2xl
                      border
                      px-4
                      py-4
                      font-black
                      transition
                      duration-300

                      ${
                        personality ===
                        item
                          ? `
                            border-cyan-400/40
                            bg-cyan-400/[0.09]
                            text-cyan-200
                            shadow-[0_0_24px_rgba(34,211,238,.1)]
                          `
                          : `
                            border-white/[0.07]
                            bg-black/20
                            text-gray-400
                            hover:border-white/20
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {item ===
                    "Teacher"
                      ? "👨‍🏫"
                      : item ===
                          "CEO"
                        ? "👔"
                        : item ===
                            "Developer"
                          ? "💻"
                          : item ===
                              "Creator"
                            ? "🎬"
                            : "🏆"}{" "}
                    {item}
                  </button>
                )
              )}
            </div>

            <textarea
              value={
                personalityQuestion
              }
              onChange={(event) =>
                setPersonalityQuestion(
                  event.target.value
                )
              }
              className="
                mt-6
                min-h-[110px]
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/30
                p-5
                outline-none
                transition
                placeholder:text-gray-700
                focus:border-cyan-400/40
              "
            />

            <div
              className="
                ez-scan
                mt-6
                rounded-[28px]
                border
                border-cyan-400/20
                bg-cyan-400/[0.035]
                p-6
                sm:p-8
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
                    border-cyan-400/20
                    bg-black/30
                    text-2xl
                  "
                >
                  🧠
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      tracking-wider
                      text-cyan-300
                    "
                  >
                    ACTIVE MINDSET
                  </p>

                  <h3
                    className="
                      text-xl
                      font-black
                    "
                  >
                    {personality}
                  </h3>
                </div>
              </div>

              <p
                className="
                  mt-6
                  text-sm
                  leading-8
                  text-gray-300
                  sm:text-base
                "
              >
                {personalityResult}
              </p>
            </div>
          </ExperiencePanel>
        )}

        {/* =================================================
            2 ROULETTE
        ================================================= */}

        {activeTab ===
          "roulette" && (
          <ExperiencePanel
            eyebrow="🎯 EXPERIENCE 02"
            title="AI Challenge Roulette"
            description="Spin the wheel. Accept whatever mission the universe gives you."
            accent="pink"
          >
            <div
              className="
                mt-8
                grid
                items-center
                gap-10
                lg:grid-cols-2
              "
            >
              <div
                className="
                  relative
                  mx-auto
                  flex
                  h-[290px]
                  w-[290px]
                  items-center
                  justify-center
                  sm:h-[360px]
                  sm:w-[360px]
                "
              >
                <div
                  className="
                    absolute
                    -top-4
                    left-1/2
                    z-20
                    -translate-x-1/2
                    text-4xl
                    drop-shadow-[0_0_14px_rgba(255,255,255,.5)]
                  "
                >
                  ▼
                </div>

                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    border
                    border-purple-400/25
                    bg-black/30
                    shadow-[0_0_70px_rgba(168,85,247,.13)]
                  "
                />

                <div
                  className="
                    absolute
                    inset-4
                    rounded-full
                    border-[8px]
                    border-white/[0.06]
                  "
                />

                <div
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition:
                      wheelSpinning
                        ? "transform 1.65s cubic-bezier(.12,.8,.18,1)"
                        : "none",
                    background:
                      "conic-gradient(#06b6d4 0deg 60deg,#8b5cf6 60deg 120deg,#ec4899 120deg 180deg,#f59e0b 180deg 240deg,#22c55e 240deg 300deg,#3b82f6 300deg 360deg)",
                  }}
                  className="
                    absolute
                    inset-7
                    rounded-full
                    shadow-[inset_0_0_40px_rgba(0,0,0,.45)]
                  "
                />

                {CHALLENGES.map(
                  (item, index) => {
                    const angle =
                      index *
                        (360 /
                          CHALLENGES.length) +
                      30;

                    return (
                      <div
                        key={
                          item.title
                        }
                        className="
                          pointer-events-none
                          absolute
                          left-1/2
                          top-1/2
                          z-10
                        "
                        style={{
                          transform: `rotate(${angle}deg) translateY(-112px) rotate(${-angle}deg)`,
                          transformOrigin:
                            "0 0",
                        }}
                      >
                        <span className="text-2xl">
                          {
                            item.icon
                          }
                        </span>
                      </div>
                    );
                  }
                )}

                <button
                  type="button"
                  onClick={
                    spinChallenge
                  }
                  disabled={
                    wheelSpinning
                  }
                  className="
                    relative
                    z-30
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/30
                    bg-[#060712]
                    text-sm
                    font-black
                    shadow-[0_0_35px_rgba(255,255,255,.12)]
                    transition
                    hover:scale-105
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {wheelSpinning
                    ? "SPINNING"
                    : "SPIN"}
                </button>
              </div>

              <div>
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <Metric
                    icon="🏆"
                    value={
                      data.challengeCompleted
                    }
                    label="Completed"
                  />

                  <Metric
                    icon="🔥"
                    value={
                      data.challengeStreak
                    }
                    label="Streak"
                  />
                </div>

                {selectedChallenge ? (
                  <div
                    className="
                      ez-panel
                      mt-5
                      rounded-[28px]
                      border
                      border-pink-400/25
                      bg-pink-400/[0.045]
                      p-6
                    "
                  >
                    <div className="text-4xl">
                      {
                        selectedChallenge.icon
                      }
                    </div>

                    <p
                      className="
                        mt-4
                        text-xs
                        font-black
                        tracking-wider
                        text-pink-300
                      "
                    >
                      YOUR MISSION
                    </p>

                    <h3
                      className="
                        mt-2
                        text-2xl
                        font-black
                      "
                    >
                      {
                        selectedChallenge.title
                      }
                    </h3>

                    <p
                      className="
                        mt-3
                        leading-7
                        text-gray-400
                      "
                    >
                      {
                        selectedChallenge.text
                      }
                    </p>

                    <button
                      type="button"
                      onClick={
                        completeChallenge
                      }
                      className="
                        mt-5
                        rounded-xl
                        bg-gradient-to-r
                        from-pink-500
                        to-purple-500
                        px-6
                        py-3
                        font-black
                      "
                    >
                      ✅ Complete Mission
                    </button>
                  </div>
                ) : (
                  <div
                    className="
                      mt-5
                      rounded-[28px]
                      border
                      border-dashed
                      border-white/10
                      p-8
                      text-center
                      text-gray-600
                    "
                  >
                    🎯 Spin the wheel to
                    unlock your mission.
                  </div>
                )}
              </div>
            </div>
          </ExperiencePanel>
        )}

        {/* =================================================
            3 ADVENTURE MAP
        ================================================= */}

        {activeTab ===
          "adventure" && (
          <ExperiencePanel
            eyebrow="🗺️ EXPERIENCE 03"
            title="AI Adventure Map"
            description="Travel from AI Beginner to AI Master."
            accent="green"
          >
            <div
              className="
                relative
                mt-9
                space-y-7
              "
            >
              <div
                className="
                  absolute
                  bottom-10
                  left-[27px]
                  top-10
                  w-[3px]
                  rounded-full
                  bg-gradient-to-b
                  from-green-400
                  via-cyan-400
                  to-purple-500
                  opacity-25
                "
              />

              {ADVENTURE_LEVELS.map(
                (level, index) => {
                  const unlocked =
                    level.id <=
                    data.adventureUnlocked;

                  const completed =
                    data.adventureCompleted.includes(
                      level.id
                    );

                  return (
                    <div
                      key={
                        level.id
                      }
                      className={`
                        relative
                        ml-16
                        rounded-[28px]
                        border
                        p-5
                        transition
                        duration-300
                        sm:p-6

                        ${
                          completed
                            ? `
                              border-green-400/25
                              bg-green-400/[0.045]
                            `
                            : unlocked
                              ? `
                                border-cyan-400/20
                                bg-white/[0.025]
                                hover:-translate-y-1
                                hover:border-cyan-400/35
                              `
                              : `
                                border-white/[0.05]
                                bg-black/25
                                opacity-45
                              `
                        }
                      `}
                    >
                      <div
                        className={`
                          absolute
                          -left-[64px]
                          top-5
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-2xl

                          ${
                            completed
                              ? `
                                border-green-400/40
                                bg-green-400/[0.12]
                                shadow-[0_0_28px_rgba(74,222,128,.2)]
                              `
                              : unlocked
                                ? `
                                  border-cyan-400/30
                                  bg-[#080a10]
                                `
                                : `
                                  border-white/10
                                  bg-black
                                `
                          }
                        `}
                      >
                        {completed
                          ? "✅"
                          : unlocked
                            ? level.icon
                            : "🔒"}
                      </div>

                      <p
                        className="
                          text-xs
                          font-black
                          text-gray-600
                        "
                      >
                        LEVEL{" "}
                        {index + 1}
                      </p>

                      <h3
                        className="
                          mt-1
                          text-xl
                          font-black
                        "
                      >
                        {level.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-gray-500
                        "
                      >
                        {level.subtitle}
                      </p>

                      {unlocked && (
                        <div
                          className="
                            mt-5
                            rounded-2xl
                            border
                            border-white/[0.06]
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
                            MISSION
                          </p>

                          <p
                            className="
                              mt-2
                              text-sm
                              text-gray-400
                            "
                          >
                            {
                              level.mission
                            }
                          </p>
                        </div>
                      )}

                      {unlocked &&
                        !completed && (
                          <button
                            type="button"
                            onClick={() =>
                              completeAdventure(
                                level
                              )
                            }
                            className="
                              mt-5
                              rounded-xl
                              border
                              border-green-400/25
                              bg-green-400/[0.07]
                              px-5
                              py-2.5
                              text-sm
                              font-black
                              text-green-300
                            "
                          >
                            Complete Level →
                          </button>
                        )}
                    </div>
                  );
                }
              )}
            </div>
          </ExperiencePanel>
        )}

        {/* =================================================
            4 BATTLE
        ================================================= */}

        {activeTab ===
          "battle" && (
          <ExperiencePanel
            eyebrow="⚔️ EXPERIENCE 04"
            title="Human vs AI Battle Arena"
            description="Write your answer first. Then enter the arena."
            accent="red"
          >
            <input
              value={
                battleTopic
              }
              onChange={(event) =>
                setBattleTopic(
                  event.target.value
                )
              }
              className="
                mt-7
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/25
                px-5
                py-4
                font-bold
                outline-none
              "
            />

            <div
              className="
                mt-5
                grid
                gap-5
                lg:grid-cols-[1fr_auto_1fr]
                lg:items-stretch
              "
            >
              <div
                className="
                  rounded-[28px]
                  border
                  border-blue-400/20
                  bg-blue-400/[0.035]
                  p-6
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    text-blue-300
                  "
                >
                  🧑 HUMAN
                </p>

                <textarea
                  value={
                    humanAnswer
                  }
                  onChange={(event) =>
                    setHumanAnswer(
                      event.target.value
                    )
                  }
                  placeholder="Type your answer..."
                  className="
                    mt-4
                    min-h-[190px]
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-black/30
                    p-4
                    outline-none
                    placeholder:text-gray-700
                  "
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    ez-soft-bounce
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-red-400/25
                    bg-red-400/[0.07]
                    text-xl
                    font-black
                    text-red-300
                    shadow-[0_0_30px_rgba(248,113,113,.12)]
                  "
                >
                  VS
                </div>
              </div>

              <div
                className="
                  rounded-[28px]
                  border
                  border-purple-400/20
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
                  🤖 AI
                </p>

                <div
                  className="
                    mt-4
                    flex
                    min-h-[190px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-black/30
                    p-5
                    text-sm
                    leading-7
                    text-gray-500
                  "
                >
                  {battleResult
                    ? battleResult.aiAnswer
                    : "AI answer is hidden until the battle begins."}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={
                  runBattle
                }
                className="
                  rounded-2xl
                  bg-gradient-to-r
                  from-red-500
                  via-purple-500
                  to-blue-500
                  px-8
                  py-4
                  font-black
                  shadow-[0_0_35px_rgba(168,85,247,.14)]
                  transition
                  hover:scale-105
                "
              >
                ⚔️ START BATTLE
              </button>
            </div>

            {battleResult && (
              <div
                className="
                  ez-panel
                  mt-8
                  rounded-[30px]
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  p-6
                  sm:p-8
                "
              >
                <div className="text-center">
                  <p
                    className="
                      text-xs
                      font-black
                      tracking-wider
                      text-gray-500
                    "
                  >
                    WINNER
                  </p>

                  <h3
                    className="
                      mt-2
                      text-4xl
                      font-black
                    "
                  >
                    {battleResult.winner ===
                    "Human"
                      ? "🧑 HUMAN WINS!"
                      : battleResult.winner ===
                          "Draw"
                        ? "🤝 DRAW!"
                        : "🤖 AI WINS!"}
                  </h3>
                </div>

                <div
                  className="
                    mt-7
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <BattleScore
                    title="Human Score"
                    total={
                      battleResult.humanTotal
                    }
                    clarity={
                      battleResult.humanClarity
                    }
                    creativity={
                      battleResult.humanCreativity
                    }
                  />

                  <BattleScore
                    title="AI Score"
                    total={
                      battleResult.aiTotal
                    }
                    clarity={
                      battleResult.aiClarity
                    }
                    creativity={
                      battleResult.aiCreativity
                    }
                  />
                </div>
              </div>
            )}
          </ExperiencePanel>
        )}

        {/* =================================================
            5 MOOD
        ================================================= */}

        {activeTab ===
          "mood" && (
          <ExperiencePanel
            eyebrow="🎭 EXPERIENCE 05"
            title="Prompt Mood Transformer"
            description="Change the emotional personality of the same content instantly."
            accent="purple"
          >
            <textarea
              value={moodText}
              onChange={(event) =>
                setMoodText(
                  event.target.value
                )
              }
              className="
                mt-7
                min-h-[130px]
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/25
                p-5
                outline-none
              "
            />

            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
              {[
                "Funny",
                "Professional",
                "Emotional",
                "Cinematic",
                "Luxury",
                "Gen-Z",
              ].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setMood(item)
                    }
                    className={`
                      rounded-xl
                      border
                      px-3
                      py-3
                      text-sm
                      font-black
                      transition

                      ${
                        mood ===
                        item
                          ? `
                            border-purple-400/40
                            bg-purple-400/[0.10]
                            text-purple-200
                          `
                          : `
                            border-white/[0.07]
                            bg-white/[0.02]
                            text-gray-500
                          `
                      }
                    `}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div
              className="
                ez-panel
                mt-6
                rounded-[30px]
                border
                border-purple-400/25
                bg-gradient-to-br
                from-purple-500/[0.08]
                to-pink-500/[0.04]
                p-7
              "
            >
              <p
                className="
                  text-xs
                  font-black
                  tracking-widest
                  text-purple-300
                "
              >
                {mood.toUpperCase()} MODE
              </p>

              <p
                className="
                  mt-4
                  text-lg
                  font-semibold
                  leading-8
                  text-gray-200
                "
              >
                {transformedMood}
              </p>
            </div>
          </ExperiencePanel>
        )}

        {/* =================================================
            6 PUZZLE
        ================================================= */}

        {activeTab ===
          "puzzle" && (
          <ExperiencePanel
            eyebrow="🧩 EXPERIENCE 06"
            title="AI Puzzle Room"
            description="Solve each room to unlock the next chamber."
            accent="yellow"
          >
            {data.puzzleLevel >=
            PUZZLES.length ? (
              <div
                className="
                  mt-8
                  rounded-[32px]
                  border
                  border-green-400/30
                  bg-green-400/[0.05]
                  p-10
                  text-center
                "
              >
                <div className="text-6xl">
                  🏆
                </div>

                <h3
                  className="
                    mt-5
                    text-3xl
                    font-black
                  "
                >
                  Puzzle Master!
                </h3>

                <p
                  className="
                    mt-3
                    text-gray-500
                  "
                >
                  You escaped every AI
                  puzzle room.
                </p>
              </div>
            ) : (
              <div
                className="
                  mt-8
                  grid
                  gap-6
                  lg:grid-cols-[260px_1fr]
                "
              >
                <div
                  className="
                    rounded-[28px]
                    border
                    border-yellow-400/20
                    bg-yellow-400/[0.035]
                    p-6
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-28
                      w-28
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-yellow-400/25
                      bg-black/25
                      text-5xl
                      shadow-[0_0_45px_rgba(250,204,21,.1)]
                    "
                  >
                    🧩
                  </div>

                  <p
                    className="
                      mt-5
                      text-xs
                      font-black
                      text-yellow-300
                    "
                  >
                    ROOM
                  </p>

                  <p
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {data.puzzleLevel +
                      1}
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-gray-600
                    "
                  >
                    {data.puzzleSolved
                      .length}{" "}
                    solved
                  </p>
                </div>

                <div
                  className="
                    rounded-[28px]
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    p-6
                    sm:p-8
                  "
                >
                  <h3
                    className="
                      text-xl
                      font-black
                      leading-8
                    "
                  >
                    {
                      currentPuzzle.question
                    }
                  </h3>

                  <div
                    className="
                      mt-6
                      grid
                      gap-3
                    "
                  >
                    {currentPuzzle.options.map(
                      (
                        option,
                        index
                      ) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            answerPuzzle(
                              index
                            )
                          }
                          className={`
                            rounded-2xl
                            border
                            px-5
                            py-4
                            text-left
                            font-semibold
                            transition

                            ${
                              puzzleChoice ===
                              index
                                ? index ===
                                  currentPuzzle.answer
                                  ? `
                                    border-green-400/40
                                    bg-green-400/[0.08]
                                    text-green-200
                                  `
                                  : `
                                    border-red-400/40
                                    bg-red-400/[0.07]
                                    text-red-200
                                  `
                                : `
                                  border-white/[0.07]
                                  bg-black/20
                                  text-gray-300
                                  hover:border-yellow-400/25
                                `
                            }
                          `}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                          . {option}
                        </button>
                      )
                    )}
                  </div>

                  {puzzleFeedback && (
                    <p
                      className="
                        mt-5
                        font-black
                      "
                    >
                      {puzzleFeedback}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setShowHint(
                        !showHint
                      )
                    }
                    className="
                      mt-5
                      text-sm
                      font-black
                      text-yellow-300
                    "
                  >
                    💡{" "}
                    {showHint
                      ? "Hide Hint"
                      : "Show Hint"}
                  </button>

                  {showHint && (
                    <p
                      className="
                        mt-3
                        rounded-xl
                        border
                        border-yellow-400/15
                        bg-yellow-400/[0.04]
                        p-4
                        text-sm
                        text-gray-400
                      "
                    >
                      {
                        currentPuzzle.hint
                      }
                    </p>
                  )}
                </div>
              </div>
            )}
          </ExperiencePanel>
        )}

        {/* =================================================
            7 CAREER
        ================================================= */}

        {activeTab ===
          "career" && (
          <ExperiencePanel
            eyebrow="🔮 EXPERIENCE 07"
            title="Future Career Simulator"
            description="Adjust your current strengths and discover which AI career fits you best."
            accent="cyan"
          >
            <div
              className="
                mt-8
                grid
                gap-6
                lg:grid-cols-[1fr_420px]
              "
            >
              <div className="space-y-4">
                {Object.entries(
                  careerSkills
                ).map(
                  ([
                    skill,
                    value,
                  ]) => (
                    <div
                      key={skill}
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
                          {skill}
                        </p>

                        <span
                          className="
                            font-black
                            text-cyan-300
                          "
                        >
                          {value}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(event) =>
                          setCareerSkills({
                            ...careerSkills,
                            [skill]:
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
                  rounded-[30px]
                  border
                  border-cyan-400/20
                  bg-gradient-to-br
                  from-cyan-400/[0.05]
                  to-purple-500/[0.05]
                  p-6
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
                  TOP CAREER MATCHES
                </p>

                <div
                  className="
                    mt-5
                    space-y-3
                  "
                >
                  {careerMatches.map(
                    (
                      career,
                      index
                    ) => (
                      <div
                        key={
                          career.name
                        }
                        className="
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-black/20
                          p-4
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
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <span className="text-2xl">
                              {
                                career.icon
                              }
                            </span>

                            <div>
                              <p className="font-black">
                                {
                                  career.name
                                }
                              </p>

                              <p
                                className="
                                  text-xs
                                  text-gray-600
                                "
                              >
                                Rank #
                                {index +
                                  1}
                              </p>
                            </div>
                          </div>

                          <span
                            className="
                              text-xl
                              font-black
                              text-cyan-300
                            "
                          >
                            {
                              career.score
                            }
                            %
                          </span>
                        </div>

                        <div
                          className="
                            mt-3
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-white/[0.05]
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
                              width: `${career.score}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    saveBestCareer
                  }
                  className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    font-black
                    text-black
                  "
                >
                  Save Best Career
                </button>
              </div>
            </div>
          </ExperiencePanel>
        )}

        {/* =================================================
            8 IDEA TREE
        ================================================= */}

        {activeTab ===
          "tree" && (
          <ExperiencePanel
            eyebrow="🌱 EXPERIENCE 08"
            title="Idea Evolution Tree"
            description="Plant one simple idea and watch it evolve into multiple directions."
            accent="green"
          >
            <div
              className="
                mt-7
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <input
                value={ideaSeed}
                onChange={(event) =>
                  setIdeaSeed(
                    event.target.value
                  )
                }
                placeholder="Plant your idea..."
                className="
                  min-h-[54px]
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-black/25
                  px-5
                  outline-none
                "
              />

              <button
                type="button"
                onClick={
                  growIdeaTree
                }
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-green-400
                  to-cyan-400
                  px-7
                  py-3
                  font-black
                  text-black
                "
              >
                🌱 Grow Idea
              </button>
            </div>

            {ideaTree.length >
              0 && (
              <div className="mt-10">
                <div
                  className="
                    mx-auto
                    max-w-md
                    rounded-[26px]
                    border
                    border-green-400/30
                    bg-green-400/[0.06]
                    p-6
                    text-center
                    shadow-[0_0_35px_rgba(74,222,128,.08)]
                  "
                >
                  <div className="text-4xl">
                    🌱
                  </div>

                  <p
                    className="
                      mt-3
                      text-xs
                      font-black
                      text-green-300
                    "
                  >
                    ROOT IDEA
                  </p>

                  <h3
                    className="
                      mt-1
                      text-xl
                      font-black
                    "
                  >
                    {ideaSeed}
                  </h3>
                </div>

                <div
                  className="
                    mx-auto
                    h-12
                    w-px
                    bg-gradient-to-b
                    from-green-400/50
                    to-transparent
                  "
                />

                <div
                  className="
                    grid
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-5
                  "
                >
                  {ideaTree.map(
                    (branch) => (
                      <div
                        key={
                          branch.id
                        }
                        className="
                          rounded-[26px]
                          border
                          border-white/[0.08]
                          bg-white/[0.025]
                          p-5
                          transition
                          duration-300
                          hover:-translate-y-2
                          hover:border-green-400/25
                        "
                      >
                        <div className="text-3xl">
                          {
                            branch.icon
                          }
                        </div>

                        <h3
                          className="
                            mt-3
                            font-black
                          "
                        >
                          {
                            branch.title
                          }
                        </h3>

                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-gray-500
                          "
                        >
                          {
                            branch.child
                          }
                        </p>

                        {!branch.expanded ? (
                          <button
                            type="button"
                            onClick={() =>
                              expandIdea(
                                branch
                              )
                            }
                            className="
                              mt-4
                              text-xs
                              font-black
                              text-green-300
                            "
                          >
                            + Expand Branch
                          </button>
                        ) : (
                          <div
                            className="
                              mt-4
                              space-y-2
                            "
                          >
                            {branch.variants.map(
                              (
                                variant
                              ) => (
                                <div
                                  key={
                                    variant
                                  }
                                  className="
                                    rounded-lg
                                    border
                                    border-white/[0.06]
                                    bg-black/20
                                    px-3
                                    py-2
                                    text-xs
                                    text-gray-400
                                  "
                                >
                                  🌿{" "}
                                  {
                                    variant
                                  }
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={
                      saveIdeaTree
                    }
                    className="
                      rounded-xl
                      border
                      border-green-400/25
                      bg-green-400/[0.06]
                      px-6
                      py-3
                      font-black
                      text-green-300
                    "
                  >
                    💾 Save Tree
                  </button>
                </div>
              </div>
            )}
          </ExperiencePanel>
        )}

        {/* =================================================
            9 STORY
        ================================================= */}

        {activeTab ===
          "story" && (
          <ExperiencePanel
            eyebrow="🎬 EXPERIENCE 09"
            title="Interactive Story Scene Builder"
            description="Choose your world and generate the story one scene at a time."
            accent="pink"
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
              <SelectBox
                label="Character"
                value={
                  storySettings.character
                }
                options={[
                  "Young Inventor",
                  "School Student",
                  "Robot Hero",
                  "Space Explorer",
                ]}
                onChange={(value) =>
                  setStorySettings({
                    ...storySettings,
                    character:
                      value,
                  })
                }
              />

              <SelectBox
                label="Place"
                value={
                  storySettings.place
                }
                options={[
                  "Floating City",
                  "Magic Forest",
                  "Future Chennai",
                  "Mars Colony",
                ]}
                onChange={(value) =>
                  setStorySettings({
                    ...storySettings,
                    place: value,
                  })
                }
              />

              <SelectBox
                label="Mood"
                value={
                  storySettings.mood
                }
                options={[
                  "Magical",
                  "Funny",
                  "Mysterious",
                  "Emotional",
                ]}
                onChange={(value) =>
                  setStorySettings({
                    ...storySettings,
                    mood: value,
                  })
                }
              />

              <SelectBox
                label="Genre"
                value={
                  storySettings.genre
                }
                options={[
                  "Adventure",
                  "Fantasy",
                  "Sci-Fi",
                  "Kids Story",
                ]}
                onChange={(value) =>
                  setStorySettings({
                    ...storySettings,
                    genre: value,
                  })
                }
              />
            </div>

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >
              <button
                type="button"
                onClick={
                  createStoryScene
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
                🎬{" "}
                {storyScenes.length ===
                0
                  ? "Create First Scene"
                  : "Next Scene"}
              </button>

              {storyScenes.length >
                0 && (
                <>
                  <button
                    type="button"
                    onClick={saveStory}
                    className="
                      rounded-xl
                      border
                      border-white/10
                      px-6
                      py-3
                      font-black
                    "
                  >
                    💾 Save Story
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStoryScenes([])
                    }
                    className="
                      rounded-xl
                      border
                      border-red-400/20
                      px-6
                      py-3
                      font-black
                      text-red-300
                    "
                  >
                    Restart
                  </button>
                </>
              )}
            </div>

            <div
              className="
                mt-8
                grid
                gap-5
                lg:grid-cols-2
              "
            >
              {storyScenes.map(
                (scene) => (
                  <div
                    key={scene.id}
                    className="
                      ez-panel
                      relative
                      overflow-hidden
                      rounded-[30px]
                      border
                      border-pink-400/20
                      bg-gradient-to-br
                      from-pink-500/[0.055]
                      to-purple-500/[0.04]
                      p-6
                    "
                  >
                    <div
                      className="
                        absolute
                        right-5
                        top-4
                        text-6xl
                        font-black
                        text-white/[0.025]
                      "
                    >
                      {scene.number}
                    </div>

                    <p
                      className="
                        text-xs
                        font-black
                        text-pink-300
                      "
                    >
                      SCENE{" "}
                      {scene.number}
                    </p>

                    <h3
                      className="
                        mt-2
                        text-xl
                        font-black
                      "
                    >
                      {scene.title}
                    </h3>

                    <p
                      className="
                        mt-4
                        text-sm
                        leading-7
                        text-gray-400
                      "
                    >
                      {scene.text}
                    </p>

                    <div
                      className="
                        mt-5
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      <Tag>
                        🎭{" "}
                        {scene.mood}
                      </Tag>

                      <Tag>
                        🎞️{" "}
                        {scene.genre}
                      </Tag>
                    </div>
                  </div>
                )
              )}
            </div>
          </ExperiencePanel>
        )}

        {/* =================================================
            10 LAUNCH
        ================================================= */}

        {activeTab ===
          "launch" && (
          <ExperiencePanel
            eyebrow="🚀 EXPERIENCE 10"
            title="Launch Readiness Simulator"
            description="Check how close your idea is to becoming a real launch."
            accent="orange"
          >
            <div
              className="
                mt-8
                grid
                gap-7
                lg:grid-cols-[1fr_360px]
              "
            >
              <div
                className="
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                {Object.entries(
                  launchChecks
                ).map(
                  ([
                    key,
                    checked,
                  ]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setLaunchChecks({
                          ...launchChecks,
                          [key]:
                            !checked,
                        })
                      }
                      className={`
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-5
                        text-left
                        transition
                        duration-300

                        ${
                          checked
                            ? `
                              border-green-400/25
                              bg-green-400/[0.055]
                            `
                            : `
                              border-white/[0.07]
                              bg-white/[0.02]
                              hover:border-white/20
                            `
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border

                          ${
                            checked
                              ? `
                                border-green-400/30
                                bg-green-400/[0.1]
                                text-green-300
                              `
                              : `
                                border-white/10
                                bg-black/30
                                text-gray-600
                              `
                          }
                        `}
                      >
                        {checked
                          ? "✓"
                          : "○"}
                      </div>

                      <div>
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
                            mt-1
                            text-xs
                            text-gray-600
                          "
                        >
                          {checked
                            ? "Ready"
                            : "Needs work"}
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>

              <div
                className="
                  rounded-[32px]
                  border
                  border-orange-400/20
                  bg-gradient-to-br
                  from-orange-500/[0.06]
                  to-purple-500/[0.04]
                  p-7
                  text-center
                "
              >
                <div
                  className="
                    relative
                    mx-auto
                    flex
                    h-52
                    w-52
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background: `conic-gradient(#22d3ee ${launchScore * 3.6}deg, rgba(255,255,255,.06) 0deg)`,
                  }}
                >
                  <div
                    className="
                      flex
                      h-[168px]
                      w-[168px]
                      flex-col
                      items-center
                      justify-center
                      rounded-full
                      bg-[#060812]
                    "
                  >
                    <p
                      className="
                        text-5xl
                        font-black
                      "
                    >
                      {launchScore}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-600
                      "
                    >
                      /100
                    </p>
                  </div>
                </div>

                <div
                  className="
                    ez-soft-bounce
                    mt-6
                    text-4xl
                  "
                >
                  {
                    launchStatus.icon
                  }
                </div>

                <h3
                  className="
                    mt-3
                    text-xl
                    font-black
                  "
                >
                  {
                    launchStatus.label
                  }
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  {
                    launchStatus.text
                  }
                </p>

                <button
                  type="button"
                  onClick={
                    saveLaunchScore
                  }
                  className="
                    mt-6
                    w-full
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    font-black
                    text-black
                  "
                >
                  Save Launch Score
                </button>

                <p
                  className="
                    mt-4
                    text-xs
                    text-gray-700
                  "
                >
                  Best:{" "}
                  {
                    data.launchBestScore
                  }
                  %
                </p>
              </div>
            </div>
          </ExperiencePanel>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function ExperiencePanel({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section
      className="
        ez-panel
        relative
        mt-6
        overflow-hidden
        rounded-[34px]
        border
        border-white/[0.08]
        bg-[#070914]/70
        p-5
        shadow-[0_20px_80px_rgba(0,0,0,.3)]
        backdrop-blur-2xl
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-40
          w-40
          rounded-full
          bg-purple-500/[0.04]
          blur-3xl
        "
      />

      <div className="relative z-10">
        <p
          className="
            text-xs
            font-black
            tracking-[0.16em]
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
            lg:text-4xl
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-3
            max-w-3xl
            text-sm
            leading-7
            text-gray-500
          "
        >
          {description}
        </p>

        {children}
      </div>
    </section>
  );
}

function HeroMetric({
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
        bg-black/20
        p-4
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span className="text-lg">
          {icon}
        </span>

        <span
          className="
            text-xl
            font-black
            sm:text-2xl
          "
        >
          {value}
        </span>
      </div>

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

function Metric({
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
      <span className="text-2xl">
        {icon}
      </span>

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

function BattleScore({
  title,
  total,
  clarity,
  creativity,
}) {
  return (
    <div
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
          items-center
          justify-between
        "
      >
        <p className="font-black">
          {title}
        </p>

        <span
          className="
            text-2xl
            font-black
            text-cyan-300
          "
        >
          {total}
        </span>
      </div>

      <ScoreBar
        label="Clarity"
        value={clarity}
      />

      <ScoreBar
        label="Creativity"
        value={creativity}
      />
    </div>
  );
}

function ScoreBar({
  label,
  value,
}) {
  return (
    <div className="mt-4">
      <div
        className="
          flex
          justify-between
          text-xs
          text-gray-500
        "
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div
        className="
          mt-2
          h-2
          overflow-hidden
          rounded-full
          bg-white/[0.05]
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
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.02]
        p-4
      "
    >
      <span
        className="
          text-xs
          font-black
          text-gray-600
        "
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          mt-3
          w-full
          rounded-xl
          border
          border-white/10
          bg-[#080a12]
          px-3
          py-3
          font-semibold
          text-white
          outline-none
        "
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function Tag({
  children,
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-white/[0.08]
        bg-black/20
        px-3
        py-1.5
        text-xs
        font-bold
        text-gray-400
      "
    >
      {children}
    </span>
  );
}