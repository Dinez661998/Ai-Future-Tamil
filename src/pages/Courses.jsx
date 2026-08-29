import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/* =========================================================
   COURSE DATA
========================================================= */

const courses = [
  {
    id: "ai-tools-for-beginners",
    icon: "🤖",
    title: "AI Tools for Beginners",
    description:
      "Learn the basics of popular AI tools and understand how to use them for work, learning and creativity.",
    level: "Beginner",
    duration: "3 Hours",
    accent: "blue",
    lessons: [
      {
        id: "introduction-to-ai",
        title: "Introduction to Artificial Intelligence",
        duration: "20 min",
        content:
          "Artificial Intelligence is technology that allows computers to perform tasks that normally require human intelligence. AI can understand language, analyze information, generate content and help users solve problems.",
        points: [
          "What AI actually means",
          "How modern AI systems work",
          "Examples of AI in everyday life",
          "Why AI is becoming important",
        ],
      },
      {
        id: "ai-chat-tools",
        title: "Understanding AI Chat Tools",
        duration: "30 min",
        content:
          "AI chat tools can understand natural language and generate useful responses. They can help with writing, brainstorming, learning, coding, research and many other tasks.",
        points: [
          "AI chat assistants",
          "Common use cases",
          "Asking better questions",
          "Checking AI-generated information",
        ],
      },
      {
        id: "ai-image-tools",
        title: "Exploring AI Image Tools",
        duration: "30 min",
        content:
          "AI image generators can create visuals from text instructions. Learning how to describe subjects, styles, lighting and composition helps you get better results.",
        points: [
          "Text-to-image generation",
          "Writing image prompts",
          "Style and composition",
          "Practical creative workflows",
        ],
      },
      {
        id: "ai-for-work",
        title: "Using AI for Work and Productivity",
        duration: "35 min",
        content:
          "AI can reduce repetitive work and help users organize information, draft documents, summarize content and brainstorm ideas.",
        points: [
          "Writing emails",
          "Summarizing documents",
          "Research assistance",
          "Planning and organization",
        ],
      },
      {
        id: "ai-best-practices",
        title: "AI Best Practices",
        duration: "35 min",
        content:
          "Using AI effectively requires clear instructions, critical thinking and responsible use. Always review important AI-generated information before using it.",
        points: [
          "Verify important information",
          "Protect private information",
          "Give clear instructions",
          "Use AI as an assistant",
        ],
      },
    ],
    quiz: [
      {
        question: "What does AI mainly allow computers to do?",
        options: [
          "Only store files",
          "Perform tasks that normally require human intelligence",
          "Only browse websites",
          "Only play videos",
        ],
        answer: 1,
      },
      {
        question: "Which is a common use of AI chat tools?",
        options: [
          "Writing and brainstorming",
          "Charging a phone",
          "Printing paper",
          "Changing a monitor",
        ],
        answer: 0,
      },
      {
        question: "What can AI image tools create?",
        options: [
          "Only spreadsheets",
          "Only audio",
          "Visual content from instructions",
          "Internet connections",
        ],
        answer: 2,
      },
      {
        question: "Why should important AI information be checked?",
        options: [
          "AI can make mistakes",
          "AI cannot type",
          "AI cannot generate text",
          "AI only works offline",
        ],
        answer: 0,
      },
      {
        question: "What is one good AI practice?",
        options: [
          "Share private information",
          "Ignore all results",
          "Give clear instructions",
          "Never review output",
        ],
        answer: 2,
      },
    ],
  },

  {
    id: "prompt-engineering-masterclass",
    icon: "✨",
    title: "Prompt Engineering Masterclass",
    description:
      "Learn how to write powerful prompts and get better results from AI assistants and creative AI tools.",
    level: "Beginner",
    duration: "4 Hours",
    accent: "purple",
    lessons: [
      {
        id: "prompt-basics",
        title: "Prompt Engineering Basics",
        duration: "25 min",
        content:
          "Prompt engineering is the process of giving AI clear and useful instructions. A good prompt provides enough context for the AI to understand what you want.",
        points: [
          "What is a prompt?",
          "Why context matters",
          "Clear instructions",
          "Simple prompt structures",
        ],
      },
      {
        id: "role-context",
        title: "Role and Context",
        duration: "30 min",
        content:
          "Giving an AI system a role and useful context can make responses more focused. Explain the situation, target audience and desired outcome.",
        points: [
          "Defining a role",
          "Providing background",
          "Setting the audience",
          "Defining the goal",
        ],
      },
      {
        id: "output-format",
        title: "Controlling Output Format",
        duration: "35 min",
        content:
          "You can guide AI responses by specifying the exact format you want, such as tables, bullet points, JSON, summaries or step-by-step instructions.",
        points: [
          "Bullet point outputs",
          "Tables",
          "Structured responses",
          "Length and tone control",
        ],
      },
      {
        id: "advanced-prompting",
        title: "Advanced Prompting Techniques",
        duration: "45 min",
        content:
          "Advanced prompting combines context, examples, constraints and structured instructions to produce more consistent results.",
        points: [
          "Few-shot prompting",
          "Examples",
          "Constraints",
          "Multi-step instructions",
        ],
      },
      {
        id: "real-world-prompts",
        title: "Real-World Prompt Workflows",
        duration: "45 min",
        content:
          "The best way to learn prompting is by applying it to real tasks. Build reusable prompts for writing, research, learning and business workflows.",
        points: [
          "Writing prompts",
          "Research prompts",
          "Learning prompts",
          "Business prompts",
        ],
      },
    ],
    quiz: [
      {
        question: "What is prompt engineering?",
        options: [
          "Designing computer hardware",
          "Giving AI clear and useful instructions",
          "Building a monitor",
          "Installing Windows",
        ],
        answer: 1,
      },
      {
        question: "Why is context useful in a prompt?",
        options: [
          "It helps AI understand the situation",
          "It turns off the AI",
          "It removes the question",
          "It deletes the response",
        ],
        answer: 0,
      },
      {
        question: "Which can control the structure of an AI response?",
        options: [
          "Output format instructions",
          "Screen brightness",
          "Mouse speed",
          "Keyboard layout",
        ],
        answer: 0,
      },
      {
        question: "What can examples provide in a prompt?",
        options: [
          "A model for the expected result",
          "Internet access",
          "More storage",
          "A new computer",
        ],
        answer: 0,
      },
      {
        question: "Which is a useful prompting technique?",
        options: [
          "Clear constraints",
          "No instructions",
          "Random words only",
          "Removing all context",
        ],
        answer: 0,
      },
    ],
  },

  {
    id: "ai-image-generation",
    icon: "🎨",
    title: "AI Image Generation",
    description:
      "Explore AI image generation, prompting techniques, creative workflows and professional image creation.",
    level: "Intermediate",
    duration: "4.5 Hours",
    accent: "pink",
    lessons: [
      {
        id: "image-ai-basics",
        title: "AI Image Generation Basics",
        duration: "30 min",
        content:
          "AI image generation transforms written descriptions into visual content. Understanding how image prompts work is the foundation for creating better visuals.",
        points: [
          "Text-to-image",
          "Image models",
          "Prompt structure",
          "Creative possibilities",
        ],
      },
      {
        id: "visual-description",
        title: "Writing Visual Descriptions",
        duration: "35 min",
        content:
          "Describe the subject, environment, camera angle, lighting, mood and visual style to give the image model a clear creative direction.",
        points: [
          "Subject description",
          "Environment",
          "Lighting",
          "Camera perspective",
        ],
      },
      {
        id: "style-composition",
        title: "Style and Composition",
        duration: "40 min",
        content:
          "Composition and visual style strongly influence the final result. Learn how to combine artistic direction with clear subject descriptions.",
        points: [
          "Photography styles",
          "Illustration styles",
          "Composition",
          "Color and mood",
        ],
      },
      {
        id: "creative-workflows",
        title: "Professional Creative Workflows",
        duration: "45 min",
        content:
          "AI images can be used as part of larger creative workflows for marketing, social media, presentations and visual storytelling.",
        points: [
          "Marketing visuals",
          "Social media content",
          "Presentation graphics",
          "Storytelling",
        ],
      },
      {
        id: "image-project",
        title: "Build Your First AI Image Project",
        duration: "50 min",
        content:
          "Combine everything you learned and create a complete visual project using structured prompts and multiple iterations.",
        points: [
          "Project planning",
          "Prompt iteration",
          "Quality checking",
          "Final visual selection",
        ],
      },
    ],
    quiz: [
      {
        question: "What is text-to-image generation?",
        options: [
          "Turning written instructions into images",
          "Turning images into keyboards",
          "Turning audio into monitors",
          "Turning code into electricity",
        ],
        answer: 0,
      },
      {
        question: "Which detail can improve an image prompt?",
        options: [
          "Lighting",
          "Battery percentage",
          "Wi-Fi password",
          "Keyboard size",
        ],
        answer: 0,
      },
      {
        question: "What does composition influence?",
        options: [
          "How visual elements are arranged",
          "Internet speed",
          "Computer storage",
          "Password strength",
        ],
        answer: 0,
      },
      {
        question: "What can AI visuals be used for?",
        options: [
          "Marketing and presentations",
          "Only calculators",
          "Only printers",
          "Only databases",
        ],
        answer: 0,
      },
      {
        question: "Why iterate image prompts?",
        options: [
          "To improve the final visual result",
          "To break the browser",
          "To remove all details",
          "To stop image generation",
        ],
        answer: 0,
      },
    ],
  },

  {
    id: "ai-video-creation",
    icon: "🎬",
    title: "AI Video Creation",
    description:
      "Learn how to create engaging videos using AI-powered image, video, voice and editing tools.",
    level: "Intermediate",
    duration: "5 Hours",
    accent: "red",
    lessons: [
      {
        id: "video-ai-basics",
        title: "Introduction to AI Video",
        duration: "30 min",
        content:
          "AI video tools can help generate scenes, animations, voiceovers and other parts of the production process.",
        points: [
          "AI video generation",
          "Video workflows",
          "Creative planning",
          "Production stages",
        ],
      },
      {
        id: "script-generation",
        title: "Creating Video Scripts with AI",
        duration: "40 min",
        content:
          "AI can help transform ideas into structured video scripts with hooks, scenes, dialogue and calls to action.",
        points: [
          "Video hooks",
          "Scene planning",
          "Dialogue",
          "Calls to action",
        ],
      },
      {
        id: "ai-voice",
        title: "AI Voice and Narration",
        duration: "35 min",
        content:
          "Voice generation tools can create narration for videos. Learn how to write natural scripts and structure voiceovers.",
        points: [
          "Voice generation",
          "Narration scripts",
          "Tone",
          "Timing",
        ],
      },
      {
        id: "video-editing",
        title: "AI-Assisted Video Editing",
        duration: "45 min",
        content:
          "AI editing tools can simplify repetitive editing tasks and help creators organize and improve their videos.",
        points: [
          "Automatic editing",
          "Captions",
          "Scene organization",
          "Content enhancement",
        ],
      },
      {
        id: "video-project",
        title: "Create Your First AI Video",
        duration: "60 min",
        content:
          "Build a complete short-form AI video from idea to script, visuals, narration and final editing.",
        points: [
          "Choose an idea",
          "Write the script",
          "Generate visuals",
          "Create the final video",
        ],
      },
    ],
    quiz: [
      {
        question: "What can AI video tools help generate?",
        options: [
          "Scenes and animations",
          "Only spreadsheets",
          "Only passwords",
          "Only emails",
        ],
        answer: 0,
      },
      {
        question: "What is an important part of a video script?",
        options: [
          "Scenes",
          "Mouse settings",
          "Battery level",
          "File extension",
        ],
        answer: 0,
      },
      {
        question: "What can AI voice tools create?",
        options: [
          "Narration",
          "Hard drives",
          "Monitors",
          "Keyboards",
        ],
        answer: 0,
      },
      {
        question: "What can AI-assisted editing help with?",
        options: [
          "Captions and repetitive editing",
          "Changing electricity",
          "Increasing RAM physically",
          "Repairing hardware",
        ],
        answer: 0,
      },
      {
        question: "What is a good AI video workflow?",
        options: [
          "Idea → Script → Visuals → Narration → Editing",
          "Editing → Delete → Stop",
          "Random clips only",
          "Upload nothing",
        ],
        answer: 0,
      },
    ],
  },

  {
    id: "ai-automation",
    icon: "⚡",
    title: "AI Automation",
    description:
      "Understand AI automation workflows and learn how AI can simplify repetitive tasks and improve productivity.",
    level: "Advanced",
    duration: "5 Hours",
    accent: "yellow",
    lessons: [
      {
        id: "automation-basics",
        title: "Automation Fundamentals",
        duration: "30 min",
        content:
          "Automation connects tasks together so repetitive work can happen with less manual effort.",
        points: [
          "What automation means",
          "Triggers",
          "Actions",
          "Workflow thinking",
        ],
      },
      {
        id: "ai-workflows",
        title: "AI-Powered Workflows",
        duration: "45 min",
        content:
          "AI can be added to automation workflows to classify information, generate content and make decisions based on defined rules.",
        points: [
          "AI actions",
          "Data processing",
          "Content generation",
          "Decision workflows",
        ],
      },
      {
        id: "business-automation",
        title: "Business Automation",
        duration: "50 min",
        content:
          "Businesses can automate repetitive communication, reporting, lead processing and information management.",
        points: [
          "Lead workflows",
          "Email automation",
          "Reports",
          "Customer workflows",
        ],
      },
      {
        id: "automation-design",
        title: "Designing Reliable Automations",
        duration: "45 min",
        content:
          "Good automation requires clear inputs, predictable steps, error handling and testing.",
        points: [
          "Input validation",
          "Error handling",
          "Testing",
          "Monitoring",
        ],
      },
      {
        id: "automation-project",
        title: "Build an AI Automation Workflow",
        duration: "60 min",
        content:
          "Design a complete AI-powered workflow by combining triggers, AI processing and automated actions.",
        points: [
          "Define the problem",
          "Design the workflow",
          "Add AI",
          "Test the automation",
        ],
      },
    ],
    quiz: [
      {
        question: "What is automation mainly used for?",
        options: [
          "Reducing repetitive manual work",
          "Making screens brighter",
          "Changing keyboards",
          "Increasing monitor size",
        ],
        answer: 0,
      },
      {
        question: "What usually starts an automated workflow?",
        options: [
          "A trigger",
          "A monitor",
          "A keyboard",
          "A speaker",
        ],
        answer: 0,
      },
      {
        question: "How can AI be used inside an automation?",
        options: [
          "Classify or generate information",
          "Physically repair hardware",
          "Increase electricity",
          "Change RAM",
        ],
        answer: 0,
      },
      {
        question: "Why is testing important?",
        options: [
          "To make workflows reliable",
          "To delete workflows",
          "To stop all automation",
          "To remove inputs",
        ],
        answer: 0,
      },
      {
        question: "What should a good workflow have?",
        options: [
          "Clear inputs and error handling",
          "No rules",
          "No testing",
          "Random actions",
        ],
        answer: 0,
      },
    ],
  },

  {
    id: "ai-productivity",
    icon: "📈",
    title: "AI Productivity",
    description:
      "Discover practical ways to use AI for planning, writing, research, learning, communication and daily work.",
    level: "Beginner",
    duration: "3.5 Hours",
    accent: "green",
    lessons: [
      {
        id: "ai-planning",
        title: "AI for Planning",
        duration: "25 min",
        content:
          "AI can help break large goals into smaller tasks and organize plans into manageable steps.",
        points: [
          "Goal planning",
          "Task breakdown",
          "Prioritization",
          "Daily planning",
        ],
      },
      {
        id: "ai-writing",
        title: "AI for Writing",
        duration: "30 min",
        content:
          "AI can support drafting, rewriting, summarizing and improving written communication.",
        points: [
          "Drafting",
          "Rewriting",
          "Summarization",
          "Tone improvement",
        ],
      },
      {
        id: "ai-research",
        title: "AI for Research",
        duration: "35 min",
        content:
          "AI can help organize research questions and summarize information, but important facts should always be verified.",
        points: [
          "Research questions",
          "Information organization",
          "Summaries",
          "Fact verification",
        ],
      },
      {
        id: "ai-learning",
        title: "AI for Learning",
        duration: "30 min",
        content:
          "AI can act as a learning assistant by explaining difficult concepts, generating examples and creating practice questions.",
        points: [
          "Personalized explanations",
          "Examples",
          "Quizzes",
          "Study plans",
        ],
      },
      {
        id: "productivity-system",
        title: "Build Your AI Productivity System",
        duration: "40 min",
        content:
          "Combine planning, writing, research and learning workflows into a simple personal AI productivity system.",
        points: [
          "Daily workflow",
          "Reusable prompts",
          "Task organization",
          "Continuous improvement",
        ],
      },
    ],
    quiz: [
      {
        question: "How can AI help with planning?",
        options: [
          "Break goals into smaller tasks",
          "Change a laptop battery",
          "Repair a screen",
          "Increase internet speed",
        ],
        answer: 0,
      },
      {
        question: "What can AI help with in writing?",
        options: [
          "Drafting and rewriting",
          "Changing keyboards",
          "Installing RAM",
          "Repairing speakers",
        ],
        answer: 0,
      },
      {
        question: "Why should important research facts be verified?",
        options: [
          "AI-generated information can contain mistakes",
          "AI cannot write",
          "AI cannot summarize",
          "AI only works with images",
        ],
        answer: 0,
      },
      {
        question: "How can AI support learning?",
        options: [
          "Explanations and practice questions",
          "Replacing a teacher completely",
          "Repairing computers",
          "Changing Wi-Fi",
        ],
        answer: 0,
      },
      {
        question: "What is a useful productivity system?",
        options: [
          "Combining planning, writing, research and learning workflows",
          "Doing everything randomly",
          "Never organizing tasks",
          "Ignoring AI completely",
        ],
        answer: 0,
      },
    ],
  },
];

/* =========================================================
   STORAGE
========================================================= */

const COURSE_PROGRESS_KEY = "aiCourseProgress";
const COURSE_QUIZ_KEY = "aiCourseQuizResults";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCourseProgress(course, progressData) {
  const completed =
    progressData?.[course.id]?.completedLessons || [];

  if (!course.lessons.length) return 0;

  return Math.round(
    (completed.length / course.lessons.length) * 100
  );
}

function isQuizPassed(course, quizData) {
  return quizData?.[course.id]?.passed === true;
}

function isCourseFullyCompleted(course, progressData, quizData) {
  return (
    getCourseProgress(course, progressData) === 100 &&
    isQuizPassed(course, quizData)
  );
}

function syncCompletedCourses(progressData, quizData) {
  const completedCourseIds = courses
    .filter((course) =>
      isCourseFullyCompleted(
        course,
        progressData,
        quizData
      )
    )
    .map((course) => course.id);

  localStorage.setItem(
    "aft_completed_courses",
    JSON.stringify(completedCourseIds)
  );

  window.dispatchEvent(
    new Event("dashboard-data-updated")
  );

  return completedCourseIds.length;
}
/* =========================================================
   COLOR SYSTEM
========================================================= */

const accentStyles = {
  blue: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    solid: "bg-blue-500",
    glow: "shadow-[0_0_35px_rgba(59,130,246,0.22)]",
    button:
      "hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.28)]",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    solid: "bg-purple-500",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.22)]",
    button:
      "hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.28)]",
  },
  pink: {
    border: "border-pink-500/30",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    solid: "bg-pink-500",
    glow: "shadow-[0_0_35px_rgba(236,72,153,0.22)]",
    button:
      "hover:border-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.28)]",
  },
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-400",
    solid: "bg-red-500",
    glow: "shadow-[0_0_35px_rgba(239,68,68,0.22)]",
    button:
      "hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.28)]",
  },
  yellow: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    solid: "bg-yellow-500",
    glow: "shadow-[0_0_35px_rgba(234,179,8,0.22)]",
    button:
      "hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.28)]",
  },
  green: {
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    text: "text-green-400",
    solid: "bg-green-500",
    glow: "shadow-[0_0_35px_rgba(34,197,94,0.22)]",
    button:
      "hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.28)]",
  },
};

/* =========================================================
   MAIN
========================================================= */

function Courses() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState(() =>
    readJSON(COURSE_PROGRESS_KEY, {})
  );

  const [quizData, setQuizData] = useState(() =>
    readJSON(COURSE_QUIZ_KEY, {})
  );

  const [selectedLessonId, setSelectedLessonId] =
    useState(null);

  const [mode, setMode] = useState("lessons");

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] =
    useState(false);

  const [quizAnimating, setQuizAnimating] =
    useState(false);

  const [showCelebration, setShowCelebration] =
    useState(false);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId),
    [courseId]
  );

  useEffect(() => {
    setProgressData(
      readJSON(COURSE_PROGRESS_KEY, {})
    );

    setQuizData(
      readJSON(COURSE_QUIZ_KEY, {})
    );

    setSelectedLessonId(null);
    setMode("lessons");
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [courseId]);

  /* =======================================================
     INVALID COURSE
  ======================================================= */

  if (courseId && !selectedCourse) {
    return (
      <div className="min-h-screen bg-transparent px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/30 bg-red-500/10 text-4xl">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold">
            Course Not Found
          </h1>

          <button
            onClick={() => navigate("/courses")}
            className="mt-8 rounded-xl border border-blue-500/40 bg-blue-500/10 px-6 py-3 text-blue-400 transition hover:bg-blue-500 hover:text-white"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     COURSE LIST
  ======================================================= */

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-transparent text-white">
        <section className="relative overflow-hidden border-b border-zinc-800 bg-black">
          <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute right-1/4 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                🎓 AI Learning Hub
              </div>

              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Learn AI.
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Build Your Future.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-400">
                Learn AI tools, prompting, automation,
                creativity and productivity through practical
                step-by-step courses.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-blue-400">
                START LEARNING
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Explore Courses
              </h2>

              <p className="mt-2 text-gray-500">
                Learn → Practice → Quiz → Complete
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm text-gray-400">
              {courses.length} Courses Available
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const styles =
                accentStyles[course.accent];

              const progress = getCourseProgress(
                course,
                progressData
              );

              const completed =
                progressData?.[course.id]
                  ?.completedLessons?.length || 0;

              const quizPassed = isQuizPassed(
                course,
                quizData
              );

              const fullyCompleted =
                isCourseFullyCompleted(
                  course,
                  progressData,
                  quizData
                );

              return (
                <div
                  key={course.id}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition-all duration-500 hover:-translate-y-2 ${styles.button}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full ${styles.bg} blur-3xl opacity-0 transition duration-500 group-hover:opacity-100`}
                  />

                  <div
                    className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-3xl transition duration-500 group-hover:rotate-6 group-hover:scale-110 ${styles.glow}`}
                  >
                    {course.icon}
                  </div>

                  <div className="relative flex-1">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full border ${styles.border} ${styles.bg} px-3 py-1 text-xs ${styles.text}`}
                      >
                        {course.level}
                      </span>

                      {fullyCompleted && (
                        <span className="animate-pulse text-xs font-bold text-green-400">
                          ✓ COMPLETED
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      {course.description}
                    </p>

                    <div className="mt-6 flex gap-2">
                      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-gray-400">
                        ⏱ {course.duration}
                      </span>

                      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-gray-400">
                        🧠 {course.quiz.length} Quiz
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-7">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-gray-600">
                        {completed}/{course.lessons.length} lessons
                      </span>

                      <span
                        className={`font-semibold ${
                          progress === 100
                            ? "text-green-400"
                            : styles.text
                        }`}
                      >
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          progress === 100
                            ? "bg-green-500"
                            : styles.solid
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {quizPassed && progress === 100 && (
                    <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2 text-center text-xs text-green-400">
                      🏆 Quiz Passed
                    </div>
                  )}

                  <Link
                    to={`/courses/${course.id}`}
                    className={`relative mt-6 flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold transition duration-300 ${styles.button}`}
                  >
                    {fullyCompleted
                      ? "Review Course"
                      : progress > 0
                      ? "Continue Learning"
                      : "Start Course"}

                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  /* =======================================================
     COURSE DETAIL DATA
  ======================================================= */

  const styles =
    accentStyles[selectedCourse.accent];

  const completedLessons =
    progressData?.[selectedCourse.id]
      ?.completedLessons || [];

  const progress = getCourseProgress(
    selectedCourse,
    progressData
  );

  const quizPassed = isQuizPassed(
    selectedCourse,
    quizData
  );

  const fullyCompleted =
    isCourseFullyCompleted(
      selectedCourse,
      progressData,
      quizData
    );

  const firstIncomplete =
    selectedCourse.lessons.find(
      (lesson) =>
        !completedLessons.includes(lesson.id)
    ) || selectedCourse.lessons[0];

  const activeLesson =
    selectedCourse.lessons.find(
      (lesson) =>
        lesson.id === selectedLessonId
    ) || firstIncomplete;

  const activeIndex =
    selectedCourse.lessons.findIndex(
      (lesson) =>
        lesson.id === activeLesson.id
    );

  const lessonCompleted =
    completedLessons.includes(activeLesson.id);

  const currentQuestion =
    selectedCourse.quiz[quizIndex];

  const quizPercent = Math.round(
    ((quizIndex +
      (selectedAnswer !== null ? 1 : 0)) /
      selectedCourse.quiz.length) *
      100
  );

  /* =======================================================
     LESSON COMPLETE
  ======================================================= */

  const toggleLessonComplete = () => {
    const current = readJSON(
      COURSE_PROGRESS_KEY,
      {}
    );

    const currentCompleted =
      current?.[selectedCourse.id]
        ?.completedLessons || [];

    const updatedCompleted =
      currentCompleted.includes(
        activeLesson.id
      )
        ? currentCompleted.filter(
            (id) => id !== activeLesson.id
          )
        : [
            ...currentCompleted,
            activeLesson.id,
          ];

    const updated = {
      ...current,
      [selectedCourse.id]: {
        completedLessons: updatedCompleted,
      },
    };

    saveJSON(
      COURSE_PROGRESS_KEY,
      updated
    );

    setProgressData(updated);

    syncCompletedCourses(
      updated,
      quizData
    );
  };

  /* =======================================================
     OPEN LESSON
  ======================================================= */

  const openLesson = (lessonId) => {
    setMode("lessons");
    setSelectedLessonId(lessonId);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goPrevious = () => {
    if (activeIndex > 0) {
      openLesson(
        selectedCourse.lessons[
          activeIndex - 1
        ].id
      );
    }
  };

  const goNext = () => {
    if (
      activeIndex <
      selectedCourse.lessons.length - 1
    ) {
      openLesson(
        selectedCourse.lessons[
          activeIndex + 1
        ].id
      );
    }
  };

  /* =======================================================
     START QUIZ
  ======================================================= */

  const startQuiz = () => {
    setMode("quiz");
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SELECT QUIZ ANSWER
  ======================================================= */

  const selectAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setQuizAnimating(true);

    const correct =
      index === currentQuestion.answer;

    if (correct) {
      setQuizScore((score) => score + 1);
    }

    setTimeout(() => {
      setQuizAnimating(false);
    }, 450);
  };

  /* =======================================================
     NEXT QUIZ QUESTION
  ======================================================= */

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    if (
      quizIndex <
      selectedCourse.quiz.length - 1
    ) {
      setQuizIndex((index) => index + 1);
      setSelectedAnswer(null);
      return;
    }

    const finalScore =
      quizScore +
      (selectedAnswer ===
      currentQuestion.answer
        ? 1
        : 0);

    const percentage = Math.round(
      (finalScore /
        selectedCourse.quiz.length) *
        100
    );

    const passed = percentage >= 80;

    const current = readJSON(
      COURSE_QUIZ_KEY,
      {}
    );

    const updated = {
      ...current,
      [selectedCourse.id]: {
        score: finalScore,
        total:
          selectedCourse.quiz.length,
        percentage,
        passed,
        completedAt: new Date().toISOString(),
      },
    };

    saveJSON(
      COURSE_QUIZ_KEY,
      updated
    );

    setQuizData(updated);
    setQuizFinished(true);

    if (passed) {
      setShowCelebration(true);

      setTimeout(() => {
        setShowCelebration(false);
      }, 4200);
    }

    syncCompletedCourses(
      progressData,
      updated
    );
  };

  /* =======================================================
     RETRY QUIZ
  ======================================================= */

  const retryQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  /* =======================================================
     QUIZ RESULT
  ======================================================= */

  const storedQuizResult =
    quizData?.[selectedCourse.id];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bbg-transparent text-white">
      {/* ===================================================
          FLOATING BACK
      =================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10"></main>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* =================================================
              SIDEBAR
          ================================================== */}

          <aside className="h-fit rounded-3xl border border-zinc-800 bg-zinc-950 p-5 lg:sticky lg:top-6">
            <div className="mb-6">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border ${styles.border} ${styles.bg} text-3xl ${styles.glow}`}
              >
                {selectedCourse.icon}
              </div>

              <h2 className="text-xl font-bold">
                {selectedCourse.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {completedLessons.length}/
                {selectedCourse.lessons.length} lessons
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-gray-500">
                  Course Progress
                </span>

                <span
                  className={
                    progress === 100
                      ? "text-green-400"
                      : styles.text
                  }
                >
                  {progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    progress === 100
                      ? "bg-green-500"
                      : styles.solid
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Lessons */}
            <div className="space-y-2">
              {selectedCourse.lessons.map(
                (lesson, index) => {
                  const completed =
                    completedLessons.includes(
                      lesson.id
                    );

                  const active =
                    lesson.id === activeLesson.id &&
                    mode === "lessons";

                  return (
                    <button
                      key={lesson.id}
                      onClick={() =>
                        openLesson(
                          lesson.id
                        )
                      }
                      className={`w-full rounded-2xl border p-4 text-left transition duration-300 ${
                        active
                          ? `${styles.border} ${styles.bg} ${styles.glow}`
                          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            completed
                              ? "bg-green-500 text-black"
                              : active
                              ? `${styles.solid} text-white`
                              : "bg-zinc-800 text-gray-400"
                          }`}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200">
                            {lesson.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-600">
                            {lesson.duration}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Quiz Sidebar Button */}
            <button
              onClick={startQuiz}
              disabled={progress < 100}
              className={`mt-5 w-full rounded-2xl border p-4 text-left transition duration-300 ${
                progress === 100
                  ? quizPassed
                    ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    : `${styles.border} ${styles.bg} ${styles.text} hover:scale-[1.02]`
                  : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {quizPassed
                    ? "🏆"
                    : "🧠"}
                </div>

                <div>
                  <p className="font-semibold">
                    {quizPassed
                      ? "Quiz Passed"
                      : "Final Quiz"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {progress < 100
                      ? "Complete all lessons first"
                      : quizPassed
                      ? "Review your result"
                      : "80% required to pass"}
                  </p>
                </div>
              </div>
            </button>
          </aside>

          {/* =================================================
              RIGHT CONTENT
          ================================================== */}

          <section>
            {/* =================================================
                LESSON MODE
            ================================================== */}

            {mode === "lessons" && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-10">
                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border ${styles.border} ${styles.bg} px-4 py-2 text-xs ${styles.text}`}
                  >
                    Lesson {activeIndex + 1} of{" "}
                    {selectedCourse.lessons.length}
                  </span>

                  <span className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-gray-500">
                    ⏱ {activeLesson.duration}
                  </span>

                  {lessonCompleted && (
                    <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs text-green-400">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <h1 className="mt-7 text-3xl font-black leading-tight md:text-5xl">
                  {activeLesson.title}
                </h1>

                <p className="mt-3 text-sm text-gray-600">
                  {selectedCourse.title}
                </p>

                <div className="my-8 h-px bg-zinc-800" />

                <div className="max-w-4xl">
                  <h2 className="text-xl font-bold">
                    What you will learn
                  </h2>

                  <p className="mt-4 text-base leading-8 text-gray-400">
                    {activeLesson.content}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {activeLesson.points.map(
                      (point, index) => (
                        <div
                          key={point}
                          className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40"
                          style={{
                            animationDelay: `${
                              index * 100
                            }ms`,
                          }}
                        >
                          <div className="flex gap-3">
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${styles.bg} ${styles.text}`}
                            >
                              ✓
                            </span>

                            <span className="text-sm leading-6 text-gray-300">
                              {point}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-10 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 p-6">
                    <div className="flex gap-4">
                      <div className="text-3xl">
                        💡
                      </div>

                      <div>
                        <h3 className="font-bold">
                          Pro Learning Tip
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          Don't just read this lesson.
                          Open an AI tool and actually
                          practice the concept.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={
                      toggleLessonComplete
                    }
                    className={`mt-10 w-full rounded-2xl px-6 py-4 text-base font-bold transition duration-300 ${
                      lessonCompleted
                        ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500 hover:text-black"
                        : "bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-1 hover:bg-green-400 hover:shadow-[0_0_45px_rgba(34,197,94,0.35)]"
                    }`}
                  >
                    {lessonCompleted
                      ? "✓ Lesson Completed — Mark Incomplete"
                      : "✓ Mark Lesson Complete"}
                  </button>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={goPrevious}
                      disabled={
                        activeIndex === 0
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-left transition hover:border-zinc-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <span className="text-xs text-gray-600">
                        PREVIOUS
                      </span>

                      <div className="mt-1 font-semibold">
                        ← Previous Lesson
                      </div>
                    </button>

                    <button
                      onClick={goNext}
                      disabled={
                        activeIndex ===
                        selectedCourse.lessons
                          .length -
                          1
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-right transition hover:border-blue-500/40 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <span className="text-xs text-gray-600">
                        NEXT
                      </span>

                      <div className="mt-1 font-semibold">
                        Next Lesson →
                      </div>
                    </button>
                  </div>

                  {/* Quiz CTA */}
                  {progress === 100 && (
                    <div className="mt-10 overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-7">
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-3xl">
                            🧠
                          </div>

                          <h3 className="mt-3 text-2xl font-bold">
                            Ready for the Final Quiz?
                          </h3>

                          <p className="mt-2 text-sm text-gray-500">
                            Answer 5 questions and score at
                            least 80% to complete this course.
                          </p>
                        </div>

                        <button
                          onClick={startQuiz}
                          className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-7 py-4 font-bold text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(236,72,153,0.35)]"
                        >
                          Start Final Quiz →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                QUIZ MODE
            ================================================== */}

            {mode === "quiz" && (
              <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-10">
                {/* Background glow */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

                {!quizFinished ? (
                  <>
                    <div className="relative">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="mb-2 text-sm font-semibold text-purple-400">
                            🧠 FINAL KNOWLEDGE CHECK
                          </div>

                          <h1 className="text-3xl font-black md:text-4xl">
                            {selectedCourse.title}
                          </h1>
                        </div>

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-center shadow-[0_0_30px_rgba(168,85,247,0.18)]">
                          <div>
                            <div className="text-lg font-black text-purple-400">
                              {quizIndex + 1}
                            </div>

                            <div className="text-[10px] text-gray-600">
                              /{" "}
                              {
                                selectedCourse
                                  .quiz.length
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quiz progress */}
                      <div className="mt-8">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-gray-600">
                            Quiz Progress
                          </span>

                          <span className="text-purple-400">
                            {quizPercent}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500"
                            style={{
                              width: `${quizPercent}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Question */}
                      <div
                        className={`mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 ${
                          quizAnimating
                            ? selectedAnswer ===
                              currentQuestion.answer
                              ? "animate-pulse border-green-500/60"
                              : "animate-[shake_0.4s_ease-in-out]"
                            : ""
                        }`}
                      >
                        <div className="text-sm text-gray-600">
                          Question{" "}
                          {quizIndex + 1}
                        </div>

                        <h2 className="mt-3 text-2xl font-bold leading-relaxed md:text-3xl">
                          {currentQuestion.question}
                        </h2>

                        <div className="mt-8 space-y-3">
                          {currentQuestion.options.map(
                            (option, index) => {
                              const isSelected =
                                selectedAnswer ===
                                index;

                              const isCorrect =
                                index ===
                                currentQuestion.answer;

                              let stateClass =
                                "border-zinc-800 bg-zinc-950 hover:-translate-y-0.5 hover:border-purple-500/50 hover:bg-purple-500/5";

                              if (
                                selectedAnswer !==
                                null
                              ) {
                                if (isCorrect) {
                                  stateClass =
                                    "border-green-500/60 bg-green-500/10 shadow-[0_0_25px_rgba(34,197,94,0.15)]";
                                } else if (
                                  isSelected
                                ) {
                                  stateClass =
                                    "border-red-500/60 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.12)]";
                                } else {
                                  stateClass =
                                    "border-zinc-800 bg-zinc-950 opacity-50";
                                }
                              }

                              return (
                                <button
                                  key={option}
                                  onClick={() =>
                                    selectAnswer(
                                      index
                                    )
                                  }
                                  disabled={
                                    selectedAnswer !==
                                    null
                                  }
                                  className={`group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${stateClass}`}
                                >
                                  <span
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition ${
                                      isSelected
                                        ? "border-purple-500 bg-purple-500 text-white"
                                        : "border-zinc-800 bg-zinc-900 text-gray-500 group-hover:border-purple-500/50 group-hover:text-purple-400"
                                    }`}
                                  >
                                    {String.fromCharCode(
                                      65 + index
                                    )}
                                  </span>

                                  <span className="flex-1 text-sm font-medium text-gray-300 md:text-base">
                                    {option}
                                  </span>

                                  {selectedAnswer !==
                                    null &&
                                    isCorrect && (
                                      <span className="text-xl text-green-400">
                                        ✓
                                      </span>
                                    )}

                                  {selectedAnswer !==
                                    null &&
                                    isSelected &&
                                    !isCorrect && (
                                      <span className="text-xl text-red-400">
                                        ✕
                                      </span>
                                    )}
                                </button>
                              );
                            }
                          )}
                        </div>

                        {/* Feedback */}
                        {selectedAnswer !==
                          null && (
                          <div
                            className={`mt-6 rounded-2xl border p-4 ${
                              selectedAnswer ===
                              currentQuestion.answer
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : "border-red-500/20 bg-red-500/10 text-red-400"
                            }`}
                          >
                            {selectedAnswer ===
                            currentQuestion.answer
                              ? "🎯 Correct! Great job."
                              : "💡 Not quite. The correct answer is highlighted above."}
                          </div>
                        )}

                        <button
                          onClick={
                            nextQuestion
                          }
                          disabled={
                            selectedAnswer ===
                            null
                          }
                          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-4 font-bold text-white shadow-[0_0_25px_rgba(168,85,247,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                        >
                          {quizIndex ===
                          selectedCourse.quiz
                            .length -
                            1
                            ? "Finish Quiz 🎯"
                            : "Next Question →"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* =================================================
                     QUIZ RESULT
                  ================================================== */

                  <div className="relative py-6 text-center md:py-12">
                    {showCelebration && (
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {Array.from({
                          length: 24,
                        }).map((_, index) => (
                          <span
                            key={index}
                            className="absolute animate-[confetti_2.8s_ease-out_forwards] text-xl"
                            style={{
                              left: `${(
                                index * 37
                              ) % 100}%`,
                              top: "-10%",
                              animationDelay: `${
                                (index % 8) *
                                0.12
                              }s`,
                            }}
                          >
                            {
                              [
                                "✨",
                                "🎉",
                                "💜",
                                "💙",
                                "⭐",
                                "🎊",
                              ][
                                index % 6
                              ]
                            }
                          </span>
                        ))}
                      </div>
                    )}

                    {(() => {
                      const result =
                        quizData?.[
                          selectedCourse.id
                        ];

                      const passed =
                        result?.passed;

                      const percentage =
                        result?.percentage ||
                        0;

                      return (
                        <>
                          <div
                            className={`mx-auto flex h-44 w-44 items-center justify-center rounded-full border-8 ${
                              passed
                                ? "border-green-500/30 bg-green-500/10 shadow-[0_0_60px_rgba(34,197,94,0.25)]"
                                : "border-red-500/30 bg-red-500/10 shadow-[0_0_60px_rgba(239,68,68,0.2)]"
                            }`}
                          >
                            <div>
                              <div
                                className={`text-5xl font-black ${
                                  passed
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {percentage}%
                              </div>

                              <div className="mt-1 text-xs text-gray-600">
                                FINAL SCORE
                              </div>
                            </div>
                          </div>

                          <div className="mt-8">
                            <div className="text-5xl">
                              {passed
                                ? "🏆"
                                : "🔄"}
                            </div>

                            <h1 className="mt-4 text-3xl font-black md:text-5xl">
                              {passed
                                ? "Quiz Passed!"
                                : "Almost There!"}
                            </h1>

                            <p className="mx-auto mt-4 max-w-xl text-gray-500">
                              {passed
                                ? "Excellent work! You passed the final quiz. This course is now officially completed."
                                : "You need at least 80% to pass. Don't worry — review the lessons and try again."}
                            </p>
                          </div>

                          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Correct Answers
                              </span>

                              <span className="font-bold text-white">
                                {result?.score || 0}/
                                {
                                  selectedCourse
                                    .quiz
                                    .length
                                }
                              </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  passed
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                              onClick={
                                retryQuiz
                              }
                              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold transition hover:border-purple-500 hover:bg-purple-500/10"
                            >
                              🔄 Retry Quiz
                            </button>

                            <button
                              onClick={() =>
                                setMode(
                                  "lessons"
                                )
                              }
                              className={`rounded-2xl px-6 py-4 font-bold ${
                                passed
                                  ? "bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:bg-green-400"
                                  : "bg-blue-500 text-white hover:bg-blue-400"
                              }`}
                            >
                              {passed
                                ? "✓ View Completed Course"
                                : "← Review Lessons"}
                            </button>
                          </div>

                          {passed && (
                            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-green-500/20 bg-green-500/5 p-5 text-sm text-green-400">
                              🎉 Course completed successfully!
                              Your Dashboard's Courses Completed
                              count will now include this course.
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                COMPLETED BANNER
            ================================================== */}

            {fullyCompleted && mode === "lessons" && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-blue-500/10 p-6 shadow-[0_0_35px_rgba(34,197,94,0.1)]">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500 text-2xl text-black shadow-[0_0_25px_rgba(34,197,94,0.35)]">
                      ✓
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-green-400">
                        Course Completed
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Lessons complete + quiz passed.
                      </p>
                    </div>
                  </div>

                  <div className="text-3xl">
                    🏆
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* =====================================================
          EXTRA ANIMATION CSS
      ====================================================== */}

      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-8px);
          }
          40% {
            transform: translateX(8px);
          }
          60% {
            transform: translateX(-6px);
          }
          80% {
            transform: translateX(6px);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }

          100% {
            transform: translateY(720px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Courses;