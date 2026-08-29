import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { completeCourse } from "../utils/dashboardStorage";
/*
|--------------------------------------------------------------------------
| COURSE DATA
|--------------------------------------------------------------------------
| Everything is frontend/localStorage for now.
| No backend is required.
*/

const COURSES = {
  "ai-tools-for-beginners": {
    id: "ai-tools-for-beginners",
    title: "AI Tools for Beginners",
    icon: "🤖",
    level: "Beginner",
    duration: "3 Hours",
    description:
      "Learn the basics of popular AI tools and understand how to use them for work, learning and creativity.",
    learn: [
      "Understand the basics of modern AI tools",
      "Choose the right AI tool for different tasks",
      "Use AI for work, learning and creativity",
      "Write simple and effective AI instructions",
      "Build a productive AI workflow",
    ],
    lessons: [
      {
        id: "ai-tools-01",
        title: "Introduction to AI Tools",
        description:
          "Understand what modern AI tools can do and how they are changing the way we work and learn.",
        duration: "25 min",
        content: [
          "What AI tools are",
          "How AI assistants work",
          "Common AI use cases",
          "Choosing the right AI tool",
        ],
      },
      {
        id: "ai-tools-02",
        title: "AI Assistants & Chat Tools",
        description:
          "Learn how AI assistants can help with writing, research, brainstorming and everyday tasks.",
        duration: "35 min",
        content: [
          "AI chat assistants",
          "Asking better questions",
          "Getting useful answers",
          "Working with follow-up questions",
        ],
      },
      {
        id: "ai-tools-03",
        title: "AI for Creativity",
        description:
          "Explore how AI can help with images, ideas, content and creative workflows.",
        duration: "35 min",
        content: [
          "AI image generation",
          "Creative brainstorming",
          "Content creation",
          "Idea development",
        ],
      },
      {
        id: "ai-tools-04",
        title: "AI for Productivity",
        description:
          "Discover practical ways to use AI for planning, writing, research and daily work.",
        duration: "40 min",
        content: [
          "Planning with AI",
          "Writing assistance",
          "Research workflows",
          "Daily productivity",
        ],
      },
      {
        id: "ai-tools-05",
        title: "Build Your AI Workflow",
        description:
          "Bring everything together and create a simple personal AI workflow.",
        duration: "45 min",
        content: [
          "Choosing your tools",
          "Combining multiple AI tools",
          "Creating repeatable workflows",
          "Final practical challenge",
        ],
      },
    ],
  },

  "prompt-engineering-masterclass": {
    id: "prompt-engineering-masterclass",
    title: "Prompt Engineering Masterclass",
    icon: "✨",
    level: "Beginner",
    duration: "4 Hours",
    description:
      "Learn how to write powerful prompts and get better results from AI assistants and creative AI tools.",
    learn: [
      "Understand how AI prompts work",
      "Write clear and structured instructions",
      "Use roles, context and constraints",
      "Improve weak prompts",
      "Build reusable prompt templates",
    ],
    lessons: [
      {
        id: "prompt-01",
        title: "Introduction to Prompting",
        description:
          "Understand why the way you communicate with AI affects the quality of the result.",
        duration: "30 min",
        content: [
          "What is a prompt?",
          "Why context matters",
          "Clear instructions",
          "Understanding AI limitations",
        ],
      },
      {
        id: "prompt-02",
        title: "Prompt Structure",
        description:
          "Learn the core structure behind a strong and reliable prompt.",
        duration: "40 min",
        content: [
          "Role",
          "Context",
          "Task",
          "Constraints",
          "Expected output",
        ],
      },
      {
        id: "prompt-03",
        title: "Context & Role Prompting",
        description:
          "Make AI responses more focused by giving the model useful context and a clear role.",
        duration: "45 min",
        content: [
          "System-style instructions",
          "Role prompting",
          "Adding useful context",
          "Controlling response style",
        ],
      },
      {
        id: "prompt-04",
        title: "Advanced Prompt Techniques",
        description:
          "Improve complex AI workflows with structured prompting techniques.",
        duration: "55 min",
        content: [
          "Step-by-step tasks",
          "Examples",
          "Output formatting",
          "Iterative prompting",
        ],
      },
      {
        id: "prompt-05",
        title: "Final Prompt Challenge",
        description:
          "Create and improve a real-world prompt using everything learned in the course.",
        duration: "70 min",
        content: [
          "Analyze the task",
          "Build the prompt",
          "Test the result",
          "Improve the prompt",
        ],
      },
    ],
  },

  "ai-image-generation": {
    id: "ai-image-generation",
    title: "AI Image Generation",
    icon: "🎨",
    level: "Intermediate",
    duration: "4.5 Hours",
    description:
      "Explore AI image generation, prompting techniques, creative workflows and professional image creation.",
    learn: [
      "Understand AI image generation",
      "Write effective image prompts",
      "Control style and composition",
      "Improve generated images",
      "Build creative image workflows",
    ],
    lessons: [
      {
        id: "image-01",
        title: "Introduction to AI Images",
        description:
          "Understand how AI image generators create visual content from text.",
        duration: "35 min",
        content: [
          "Text-to-image generation",
          "Prompt interpretation",
          "Styles",
          "Common workflows",
        ],
      },
      {
        id: "image-02",
        title: "Writing Image Prompts",
        description:
          "Learn how to describe subjects, environments, styles and composition.",
        duration: "45 min",
        content: [
          "Subject",
          "Environment",
          "Lighting",
          "Camera and composition",
        ],
      },
      {
        id: "image-03",
        title: "Style & Composition",
        description:
          "Control the visual direction of AI-generated images.",
        duration: "50 min",
        content: [
          "Art styles",
          "Color direction",
          "Composition",
          "Visual mood",
        ],
      },
      {
        id: "image-04",
        title: "Improving AI Images",
        description:
          "Learn how to refine weak generations and create more consistent results.",
        duration: "55 min",
        content: [
          "Prompt refinement",
          "Negative instructions",
          "Iteration",
          "Consistency",
        ],
      },
      {
        id: "image-05",
        title: "Creative Image Project",
        description:
          "Create a complete AI image concept using the techniques from this course.",
        duration: "55 min",
        content: [
          "Choose a concept",
          "Write the prompt",
          "Generate",
          "Refine the final result",
        ],
      },
    ],
  },

  "ai-video-creation": {
    id: "ai-video-creation",
    title: "AI Video Creation",
    icon: "🎬",
    level: "Intermediate",
    duration: "5 Hours",
    description:
      "Learn how to create engaging videos using AI-powered image, video, voice and editing tools.",
    learn: [
      "Understand AI video workflows",
      "Create video concepts",
      "Use AI for visuals and voice",
      "Plan short-form content",
      "Build an AI video workflow",
    ],
    lessons: [
      {
        id: "video-01",
        title: "AI Video Fundamentals",
        description:
          "Understand the modern AI video creation workflow.",
        duration: "35 min",
        content: [
          "AI video tools",
          "Text-to-video",
          "Image-to-video",
          "Video workflows",
        ],
      },
      {
        id: "video-02",
        title: "Story & Script Creation",
        description:
          "Use AI to develop video ideas, scripts and scenes.",
        duration: "45 min",
        content: [
          "Video ideas",
          "Story structure",
          "Scene planning",
          "Script generation",
        ],
      },
      {
        id: "video-03",
        title: "AI Visuals & Voice",
        description:
          "Combine AI visuals, voice and creative elements.",
        duration: "55 min",
        content: [
          "Visual generation",
          "Voice generation",
          "Background music",
          "Scene consistency",
        ],
      },
      {
        id: "video-04",
        title: "Editing AI Videos",
        description:
          "Learn the basics of turning generated assets into a finished video.",
        duration: "60 min",
        content: [
          "Timeline",
          "Transitions",
          "Captions",
          "Audio balancing",
        ],
      },
      {
        id: "video-05",
        title: "Final Video Project",
        description:
          "Plan and create a complete short AI-powered video.",
        duration: "85 min",
        content: [
          "Concept",
          "Script",
          "Visuals",
          "Final edit",
        ],
      },
    ],
  },

  "ai-automation": {
    id: "ai-automation",
    title: "AI Automation",
    icon: "⚡",
    level: "Advanced",
    duration: "5 Hours",
    description:
      "Understand AI automation workflows and learn how AI can simplify repetitive tasks and improve productivity.",
    learn: [
      "Understand AI automation",
      "Identify repetitive tasks",
      "Design simple workflows",
      "Connect AI with productivity tools",
      "Build practical automation ideas",
    ],
    lessons: [
      {
        id: "automation-01",
        title: "Automation Fundamentals",
        description:
          "Learn what AI automation is and where it can provide value.",
        duration: "40 min",
        content: [
          "Automation basics",
          "AI-powered workflows",
          "Triggers",
          "Actions",
        ],
      },
      {
        id: "automation-02",
        title: "Finding Automation Opportunities",
        description:
          "Learn how to identify repetitive tasks that can be improved.",
        duration: "45 min",
        content: [
          "Task mapping",
          "Repetitive work",
          "Time saving",
          "Workflow analysis",
        ],
      },
      {
        id: "automation-03",
        title: "AI Workflow Design",
        description:
          "Design a simple AI-powered workflow from start to finish.",
        duration: "60 min",
        content: [
          "Inputs",
          "Processing",
          "AI steps",
          "Outputs",
        ],
      },
      {
        id: "automation-04",
        title: "Practical AI Automation",
        description:
          "Explore practical examples of AI automation.",
        duration: "65 min",
        content: [
          "Content workflows",
          "Research workflows",
          "Email workflows",
          "Data workflows",
        ],
      },
      {
        id: "automation-05",
        title: "Automation Project",
        description:
          "Design your own useful AI automation workflow.",
        duration: "70 min",
        content: [
          "Choose a problem",
          "Design the workflow",
          "Add AI",
          "Test the workflow",
        ],
      },
    ],
  },

  "ai-productivity": {
    id: "ai-productivity",
    title: "AI Productivity",
    icon: "📈",
    level: "Beginner",
    duration: "3.5 Hours",
    description:
      "Discover practical ways to use AI for planning, writing, research, learning, communication and daily work.",
    learn: [
      "Plan your day with AI",
      "Use AI for writing",
      "Research faster",
      "Improve learning",
      "Build a personal AI productivity system",
    ],
    lessons: [
      {
        id: "productivity-01",
        title: "AI for Daily Planning",
        description:
          "Use AI to organize tasks, priorities and daily plans.",
        duration: "30 min",
        content: [
          "Task planning",
          "Priorities",
          "Daily schedules",
          "Time management",
        ],
      },
      {
        id: "productivity-02",
        title: "AI Writing Assistant",
        description:
          "Improve emails, documents and everyday writing with AI.",
        duration: "35 min",
        content: [
          "Drafting",
          "Rewriting",
          "Summarizing",
          "Tone control",
        ],
      },
      {
        id: "productivity-03",
        title: "AI Research",
        description:
          "Learn how to use AI to explore topics and organize information.",
        duration: "40 min",
        content: [
          "Research questions",
          "Information gathering",
          "Summaries",
          "Fact checking",
        ],
      },
      {
        id: "productivity-04",
        title: "AI for Learning",
        description:
          "Turn AI into a personal learning assistant.",
        duration: "35 min",
        content: [
          "Learning plans",
          "Explanations",
          "Practice questions",
          "Revision",
        ],
      },
      {
        id: "productivity-05",
        title: "Build Your Productivity System",
        description:
          "Create a simple personal system that combines multiple AI use cases.",
        duration: "40 min",
        content: [
          "Daily workflow",
          "Writing workflow",
          "Research workflow",
          "Personal AI system",
        ],
      },
    ],
  },
};

const STORAGE_PREFIX = "aft_course_progress_";

function getStorageKey(courseId) {
  return `${STORAGE_PREFIX}${courseId}`;
}

function loadProgress(courseId) {
  try {
    const saved = localStorage.getItem(
      getStorageKey(courseId)
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProgress(courseId, completedLessons) {
  localStorage.setItem(
    getStorageKey(courseId),
    JSON.stringify(completedLessons)
  );
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = COURSES[courseId];

  const [completedLessons, setCompletedLessons] =
    useState(() => {
      if (!course) return [];

      return loadProgress(course.id);
    });

  const [activeLesson, setActiveLesson] =
    useState(null);

  const [showCompleteAnimation, setShowCompleteAnimation] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | COURSE NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!course) {
    return (
      <div className="min-h-screen bg-transparent px-6 py-32 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 text-6xl">🔍</div>

          <h1 className="text-3xl font-bold">
            Course Not Found
          </h1>

          <p className="mt-3 text-zinc-400">
            The course you are looking for doesn't exist.
          </p>

          <Link
            to="/courses"
            className="mt-8 inline-flex rounded-xl border border-blue-500/40 bg-blue-500/10 px-6 py-3 font-semibold text-blue-300 transition hover:bg-blue-500/20"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CALCULATE PROGRESS
  |--------------------------------------------------------------------------
  */

  const totalLessons = course.lessons.length;

  const completedCount = completedLessons.filter(
    (id) =>
      course.lessons.some(
        (lesson) => lesson.id === id
      )
  ).length;

  const progress = Math.round(
    (completedCount / totalLessons) * 100
  );

  const isCompleted =
    completedCount === totalLessons;

  /*
  |--------------------------------------------------------------------------
  | NEXT LESSON
  |--------------------------------------------------------------------------
  */

  const nextLessonIndex = course.lessons.findIndex(
    (lesson) =>
      !completedLessons.includes(lesson.id)
  );

  const nextLesson =
    nextLessonIndex === -1
      ? null
      : course.lessons[nextLessonIndex];

  /*
  |--------------------------------------------------------------------------
  | SAVE PROGRESS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    saveProgress(
      course.id,
      completedLessons
    );
  }, [course.id, completedLessons]);

  /*
  |--------------------------------------------------------------------------
  | COMPLETE LESSON
  |--------------------------------------------------------------------------
  */

const completeLesson = (lessonId) => {
  // Already completed?
  if (completedLessons.includes(lessonId)) {
    return;
  }

  // Add completed lesson
  const updated = [
    ...completedLessons,
    lessonId,
  ];

  // Update React state
  setCompletedLessons(updated);

  // ==========================================
  // CHECK ALL LESSONS
  // ==========================================

  const allLessonsCompleted =
    course.lessons.every((lesson) =>
      updated.includes(lesson.id)
    );

  // ==========================================
  // COURSE FINISHED 🎉
  // ==========================================

  if (allLessonsCompleted) {
    // Save course completion
    completeCourse(course);

    // Show celebration
    setShowCompleteAnimation(true);

    setTimeout(() => {
      setShowCompleteAnimation(false);
    }, 3500);
  }
};

  /*
  |--------------------------------------------------------------------------
  | OPEN LESSON
  |--------------------------------------------------------------------------
  */

  const openLesson = (lesson, index) => {
    /*
     * Sequential unlocking.
     *
     * Lesson 1 is always available.
     * Lesson 2 becomes available after Lesson 1.
     */
    if (index > 0) {
      const previousLesson =
        course.lessons[index - 1];

      if (
        !completedLessons.includes(
          previousLesson.id
        )
      ) {
        return;
      }
    }

    setActiveLesson(lesson);
  };

  /*
  |--------------------------------------------------------------------------
  | LESSON STATUS
  |--------------------------------------------------------------------------
  */

  const isLessonUnlocked = (index) => {
    if (index === 0) {
      return true;
    }

    return completedLessons.includes(
      course.lessons[index - 1].id
    );
  };

  const isLessonCompleted = (lessonId) => {
    return completedLessons.includes(lessonId);
  };

  /*
  |--------------------------------------------------------------------------
  | CURRENT LESSON INDEX
  |--------------------------------------------------------------------------
  */

  const activeLessonIndex = useMemo(() => {
    if (!activeLesson) return -1;

    return course.lessons.findIndex(
      (lesson) =>
        lesson.id === activeLesson.id
    );
  }, [activeLesson, course.lessons]);

  /*
  |--------------------------------------------------------------------------
  | NEXT / PREVIOUS LESSON
  |--------------------------------------------------------------------------
  */

  const goToNextLesson = () => {
    if (activeLessonIndex === -1) return;

    const current =
      course.lessons[activeLessonIndex];

    completeLesson(current.id);

    const next =
      course.lessons[activeLessonIndex + 1];

    if (next) {
      setTimeout(() => {
        setActiveLesson(next);
      }, 250);
    } else {
      setActiveLesson(null);
    }
  };

  const goToPreviousLesson = () => {
    if (activeLessonIndex <= 0) return;

    setActiveLesson(
      course.lessons[activeLessonIndex - 1]
    );
  };

  return (
    <div className="min-h-screen bg-transparent px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8">

      {/* =====================================================
          BACK TO COURSES
      ====================================================== */}

      <div className="mx-auto mb-8 max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="
            group
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-blue-400
            transition-all
            duration-300
            hover:text-fuchsia-300
          "
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>

          Back to Courses
        </button>
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          mx-auto
          max-w-6xl
          overflow-hidden
          rounded-3xl
          border
          border-zinc-800
          bg-zinc-900/80
          shadow-2xl
          shadow-blue-500/5
        "
      >
        <div className="relative p-6 sm:p-10 lg:p-12">

          {/* Decorative glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-72
              w-72
              rounded-full
              bg-fuchsia-500/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -left-32
              bottom-0
              h-72
              w-72
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
          />

          {/* Course icon */}
          <div
            className="
              relative
              mb-7
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-2xl
              border
              border-zinc-700
              bg-zinc-950
              text-5xl
              shadow-lg
              transition-all
              duration-500
              hover:scale-105
              hover:border-fuchsia-500/50
              hover:shadow-fuchsia-500/20
            "
          >
            {course.icon}
          </div>

          {/* Tags */}
          <div className="relative mb-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300">
              {course.level}
            </span>

            <span className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-sm text-zinc-300">
              ⏱ {course.duration}
            </span>

            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              {totalLessons} Lessons
            </span>
          </div>

          <h1
            className="
              relative
              max-w-4xl
              text-3xl
              font-bold
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
          >
            {course.title}
          </h1>

          <p
            className="
              relative
              mt-5
              max-w-4xl
              text-base
              leading-8
              text-zinc-400
              sm:text-lg
            "
          >
            {course.description}
          </p>

          {/* =================================================
              PROGRESS
          ================================================== */}

          <div className="relative mt-10">

            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">
                Course Progress
              </span>

              <span className="font-bold text-blue-400">
                {progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-blue-500
                  via-purple-500
                  to-fuchsia-500
                  shadow-[0_0_18px_rgba(168,85,247,0.5)]
                  transition-all
                  duration-700
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-3 text-sm text-zinc-500">
              {completedCount} of {totalLessons} lessons completed
            </div>
          </div>

          {/* Continue */}
          {!isCompleted && nextLesson && (
            <button
              type="button"
              onClick={() => setActiveLesson(nextLesson)}
              className="
                group
                relative
                mt-8
                inline-flex
                items-center
                gap-3
                overflow-hidden
                rounded-xl
                bg-blue-500
                px-6
                py-3.5
                font-semibold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-blue-400
                hover:shadow-blue-500/40
                active:scale-95
              "
            >
              <span>
                {completedCount === 0
                  ? "Start Course"
                  : "Continue Course"}
              </span>

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          )}

          {isCompleted && (
            <div
              className="
                mt-8
                rounded-2xl
                border
                border-emerald-500/30
                bg-emerald-500/10
                p-5
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>

                <div>
                  <p className="font-bold text-emerald-300">
                    Course Completed!
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Great job! You've completed all lessons.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          WHAT YOU'LL LEARN
      ====================================================== */}

      <section className="mx-auto mt-10 max-w-6xl">

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Your Learning Journey
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            What you'll learn
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {course.learn.map((item, index) => (
            <div
              key={item}
              className="
                group
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/60
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/30
                hover:bg-zinc-900
              "
            >
              <div className="flex items-start gap-4">
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-500/10
                    text-sm
                    text-blue-400
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                >
                  ✓
                </span>

                <div>
                  <span className="text-xs text-zinc-600">
                    0{index + 1}
                  </span>

                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {item}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          MODULES
      ====================================================== */}

      <section className="mx-auto mt-14 max-w-6xl">

        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-widest text-fuchsia-400">
            Course Content
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Course Modules
          </h2>

          <p className="mt-2 text-zinc-500">
            Complete each lesson to unlock the next one.
          </p>
        </div>

        <div className="space-y-4">
          {course.lessons.map((lesson, index) => {
            const unlocked =
              isLessonUnlocked(index);

            const completed =
              isLessonCompleted(lesson.id);

            return (
              <button
                key={lesson.id}
                type="button"
                disabled={!unlocked}
                onClick={() =>
                  openLesson(lesson, index)
                }
                className={`
                  group
                  w-full
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition-all
                  duration-300

                  ${
                    completed
                      ? `
                        border-emerald-500/30
                        bg-emerald-500/[0.06]
                        hover:border-emerald-500/50
                      `
                      : unlocked
                      ? `
                        border-zinc-800
                        bg-zinc-900/60
                        hover:-translate-y-1
                        hover:border-blue-500/40
                        hover:bg-zinc-900
                        hover:shadow-lg
                        hover:shadow-blue-500/5
                      `
                      : `
                        cursor-not-allowed
                        border-zinc-900
                        bg-zinc-950/60
                        opacity-50
                      `
                  }
                `}
              >
                <div className="flex items-center gap-4">

                  {/* Number */}
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
                      text-sm
                      font-bold
                      transition-all
                      duration-300

                      ${
                        completed
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : unlocked
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-400 group-hover:scale-110"
                          : "border-zinc-800 bg-zinc-900 text-zinc-600"
                      }
                    `}
                  >
                    {completed
                      ? "✓"
                      : unlocked
                      ? String(index + 1).padStart(2, "0")
                      : "🔒"}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`
                          font-semibold
                          ${
                            completed
                              ? "text-emerald-300"
                              : "text-white"
                          }
                        `}
                      >
                        {lesson.title}
                      </h3>

                      {completed && (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                          Completed
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                      {lesson.description}
                    </p>

                    <p className="mt-2 text-xs text-zinc-600">
                      ⏱ {lesson.duration}
                    </p>
                  </div>

                  {/* Action */}
                  <div
                    className={`
                      hidden
                      shrink-0
                      sm:block
                      text-sm
                      font-semibold
                      ${
                        completed
                          ? "text-emerald-400"
                          : unlocked
                          ? "text-blue-400 transition-transform duration-300 group-hover:translate-x-1"
                          : "text-zinc-700"
                      }
                    `}
                  >
                    {completed
                      ? "Review →"
                      : unlocked
                      ? "Start →"
                      : "Locked"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FINAL COMPLETION
      ====================================================== */}

      {isCompleted && (
        <section
          className="
            mx-auto
            mt-12
            max-w-6xl
            overflow-hidden
            rounded-3xl
            border
            border-fuchsia-500/20
            bg-gradient-to-br
            from-blue-500/10
            via-purple-500/10
            to-fuchsia-500/10
            p-8
            text-center
            sm:p-12
          "
        >
          <div className="text-6xl">
            🏆
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            You've completed the course!
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Excellent work. You completed all {totalLessons} lessons in{" "}
            {course.title}.
          </p>

          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="
              mt-7
              rounded-xl
              border
              border-fuchsia-500/30
              bg-fuchsia-500/10
              px-6
              py-3
              font-semibold
              text-fuchsia-300
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-fuchsia-500/20
              hover:shadow-lg
              hover:shadow-fuchsia-500/10
            "
          >
            Back to Courses →
          </button>
        </section>
      )}

      {/* =====================================================
          LESSON MODAL
      ====================================================== */}

      {activeLesson && (
        <div
          className="
            fixed
            inset-0
            z-[10000]
            flex
            items-center
            justify-center
            bg-black/80
            px-4
            py-8
            backdrop-blur-md
          "
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveLesson(null);
            }
          }}
        >
          <div
            className="
              lesson-modal
              max-h-[90vh]
              w-full
              max-w-3xl
              overflow-y-auto
              rounded-3xl
              border
              border-zinc-700
              bg-zinc-950
              shadow-2xl
              shadow-blue-500/10
            "
          >

            {/* Modal header */}
            <div
              className="
                sticky
                top-0
                z-10
                border-b
                border-zinc-800
                bg-zinc-950/95
                p-6
                backdrop-blur-xl
                sm:p-8
              "
            >
              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-sm font-medium text-blue-400">
                    Lesson {activeLessonIndex + 1} of{" "}
                    {totalLessons}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    {activeLesson.title}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    ⏱ {activeLesson.duration}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveLesson(null)
                  }
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-zinc-800
                    text-zinc-400
                    transition-all
                    duration-200
                    hover:border-zinc-600
                    hover:bg-zinc-900
                    hover:text-white
                  "
                  aria-label="Close lesson"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-6 sm:p-8">

              <p className="text-base leading-8 text-zinc-400">
                {activeLesson.description}
              </p>

              <div className="mt-8">
                <h3 className="text-lg font-semibold">
                  In this lesson
                </h3>

                <div className="mt-4 space-y-3">
                  {activeLesson.content.map(
                    (point, index) => (
                      <div
                        key={point}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-zinc-800
                          bg-zinc-900/60
                          p-4
                          transition-all
                          duration-300
                          hover:border-blue-500/30
                          hover:bg-zinc-900
                        "
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs text-blue-400">
                          {index + 1}
                        </span>

                        <span className="text-sm text-zinc-300">
                          {point}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Lesson action */}
              <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
                <p className="text-sm leading-6 text-zinc-400">
                  Read through the lesson topics above, then mark
                  this lesson complete to unlock the next lesson.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div
              className="
                sticky
                bottom-0
                border-t
                border-zinc-800
                bg-zinc-950/95
                p-5
                backdrop-blur-xl
                sm:p-6
              "
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <button
                  type="button"
                  disabled={activeLessonIndex <= 0}
                  onClick={goToPreviousLesson}
                  className="
                    rounded-xl
                    border
                    border-zinc-800
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-zinc-300
                    transition-all
                    duration-200
                    hover:bg-zinc-900
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  ← Previous
                </button>

                {isLessonCompleted(
                  activeLesson.id
                ) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next =
                        course.lessons[
                          activeLessonIndex + 1
                        ];

                      if (next) {
                        setActiveLesson(next);
                      } else {
                        setActiveLesson(null);
                      }
                    }}
                    className="
                      rounded-xl
                      bg-blue-500
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-blue-500/20
                      transition-all
                      duration-300
                      hover:bg-blue-400
                      hover:shadow-blue-500/40
                    "
                  >
                    {activeLessonIndex ===
                    totalLessons - 1
                      ? "Finish Course 🎉"
                      : "Next Lesson →"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={goToNextLesson}
                    className="
                      group
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-500
                      to-purple-500
                      px-6
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-purple-500/20
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:shadow-purple-500/40
                      active:scale-95
                    "
                  >
                    <span>
                      Mark Complete
                    </span>

                    <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          COURSE COMPLETION CELEBRATION
      ====================================================== */}

      {showCompleteAnimation && (
        <div
          className="
            fixed
            inset-0
            z-[20000]
            pointer-events-none
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
          "
        >
          <div className="course-celebration text-center">
            <div className="text-7xl sm:text-8xl">
              🎉
            </div>

            <h2 className="mt-5 text-3xl font-black text-white sm:text-5xl">
              Course Completed!
            </h2>

            <p className="mt-3 text-zinc-300">
              Amazing work. You did it! 🚀
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        .lesson-modal {
          animation: lessonModalIn 320ms
            cubic-bezier(.2,.8,.2,1);
        }

        @keyframes lessonModalIn {
          0% {
            opacity: 0;
            transform:
              translateY(30px)
              scale(0.96);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .course-celebration {
          animation:
            celebrationIn 500ms
            cubic-bezier(.2,.8,.2,1),
            celebrationGlow 1.2s
            ease-in-out
            infinite
            alternate;
        }

        @keyframes celebrationIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }

          70% {
            opacity: 1;
            transform: scale(1.08);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes celebrationGlow {
          from {
            filter:
              drop-shadow(
                0 0 10px
                rgba(168,85,247,0.25)
              );
          }

          to {
            filter:
              drop-shadow(
                0 0 35px
                rgba(236,72,153,0.55)
              );
          }
        }
      `}</style>
    </div>
  );
}