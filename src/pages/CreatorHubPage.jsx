import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   PAGE DATA
========================================================= */

const creatorPages = {
  "/creators/youtube": {
    icon: "▶️",
    title: "YouTube Resources",
    subtitle:
      "Plan, create, optimize and grow your YouTube channel with useful creator tools and resources.",
  },

  "/creators/instagram": {
    icon: "📸",
    title: "Instagram Resources",
    subtitle:
      "Explore Instagram growth tools, reel ideas, captions, hooks and creator resources.",
  },

  "/creators/video-editing": {
    icon: "🎞️",
    title: "Video Editing",
    subtitle:
      "Find useful video editing tools, apps, templates and creative resources.",
  },

  "/creators/thumbnails": {
    icon: "🖼️",
    title: "Thumbnail Packs",
    subtitle:
      "Explore ready-made thumbnail packs and design resources for creators.",
  },

  "/creators/music-sfx": {
    icon: "🎵",
    title: "Music & Sound Effects",
    subtitle:
      "Discover background music, sound effects and audio resources for your content.",
  },

  "/creators/capcut": {
    icon: "✂️",
    title: "CapCut Templates",
    subtitle:
      "Explore CapCut templates, editing ideas and creator-ready video resources.",
  },

  "/creators/premiere": {
    icon: "🎬",
    title: "Premiere Pro Resources",
    subtitle:
      "Discover Premiere Pro templates, presets and professional editing resources.",
  },

  "/creators/canva": {
    icon: "🎨",
    title: "Canva Templates",
    subtitle:
      "Find Canva templates for social posts, thumbnails, reels and digital content.",
  },

  "/creators/motion-graphics": {
    icon: "💫",
    title: "Motion Graphics",
    subtitle:
      "Explore motion graphics, animated elements and visual effects for creators.",
  },

  "/creators/green-screen": {
    icon: "🟢",
    title: "Green Screen Videos",
    subtitle:
      "Discover reusable green screen assets and creative video elements.",
  },

  "/creators/png-packs": {
    icon: "🧷",
    title: "PNG Packs",
    subtitle:
      "Explore transparent PNG assets, stickers and creative visual packs.",
  },

  "/creators/intro-outro": {
    icon: "🚀",
    title: "Intro & Outro Videos",
    subtitle:
      "Find intro and outro templates for YouTube, reels and social videos.",
  },
};

const quickLinks = [
  [
    "▶️",
    "YouTube",
    "/creators/youtube",
  ],
  [
    "📸",
    "Instagram",
    "/creators/instagram",
  ],
  [
    "🎞️",
    "Video Editing",
    "/creators/video-editing",
  ],
  [
    "🖼️",
    "Thumbnails",
    "/creators/thumbnails",
  ],
  [
    "🎵",
    "Music & SFX",
    "/creators/music-sfx",
  ],
  [
    "✂️",
    "CapCut",
    "/creators/capcut",
  ],
];

/* =========================================================
   RESOURCE LIBRARY
========================================================= */

const resourceGroups = [
  {
    id: "trending",
    icon: "🔥",
    title: "Trending Resources",
    description:
      "Popular creator formats, workflows and resources worth exploring.",
    items: [
      {
        icon: "⚡",
        title: "Shorts Hook Formula Pack",
        category: "Hooks",
        type: "Free",
        description:
          "Hook structures for educational, story, curiosity and problem-solution Shorts.",
      },
      {
        icon: "🖼️",
        title:
          "High-CTR Thumbnail Checklist",
        category: "Thumbnail",
        type: "Free",
        description:
          "Check text length, contrast, focus, curiosity and mobile readability.",
      },
      {
        icon: "🎥",
        title:
          "Faceless Video Workflow",
        category: "Workflow",
        type: "Free",
        description:
          "Plan script, voice-over, visuals, editing and publishing for faceless videos.",
      },
      {
        icon: "📱",
        title:
          "Long Video to Shorts System",
        category: "Repurpose",
        type: "Free",
        description:
          "Turn one long video into multiple Shorts and community posts.",
      },
      {
        icon: "🧠",
        title:
          "Storytelling Framework",
        category: "Script",
        type: "Free",
        description:
          "Problem, tension, discovery, solution and payoff structure.",
      },
      {
        icon: "🎯",
        title:
          "Content Gap Worksheet",
        category: "Research",
        type: "Free",
        description:
          "Find missing angles and unanswered questions inside your niche.",
      },
    ],
  },

  {
    id: "latest",
    icon: "🆕",
    title: "Latest Uploads",
    description:
      "Recently added creator templates and planning resources.",
    items: [
      {
        icon: "📅",
        title:
          "30-Day Content Calendar",
        category: "Planning",
        type: "New",
        description:
          "Plan long videos, Shorts, community posts and publishing dates.",
      },
      {
        icon: "📝",
        title:
          "YouTube Script Structure",
        category: "Script",
        type: "New",
        description:
          "Hook, intro, value sections, examples, CTA and outro structure.",
      },
      {
        icon: "📧",
        title:
          "Brand Collaboration Email",
        category: "Business",
        type: "New",
        description:
          "Professional outreach structure for sponsorship opportunities.",
      },
      {
        icon: "📊",
        title:
          "Channel Analytics Tracker",
        category: "Analytics",
        type: "New",
        description:
          "Track views, CTR, watch time, subscribers and upload performance.",
      },
      {
        icon: "🎙️",
        title:
          "Voice-over Script Checklist",
        category: "Audio",
        type: "New",
        description:
          "Improve sentence length, pauses, emphasis and spoken clarity.",
      },
      {
        icon: "✅",
        title:
          "Complete Upload Checklist",
        category: "Publishing",
        type: "New",
        description:
          "Title, thumbnail, description, chapters, cards, end screen and comments.",
      },
    ],
  },

  {
    id: "free",
    icon: "🎁",
    title: "Free Resources",
    description:
      "Useful creator templates and checklists available inside the website.",
    items: [
      {
        icon: "🎬",
        title:
          "Video Planning Sheet",
        category: "Planning",
        type: "Free",
        description:
          "Organize topic, audience, goal, hook, structure and publishing plan.",
      },
      {
        icon: "🔍",
        title:
          "SEO Keyword Worksheet",
        category: "SEO",
        type: "Free",
        description:
          "Map primary keyword, supporting phrases and viewer search intent.",
      },
      {
        icon: "✍️",
        title:
          "Title Formula Cheat Sheet",
        category: "Title",
        type: "Free",
        description:
          "Simple title frameworks for curiosity, education, list and transformation videos.",
      },
      {
        icon: "📌",
        title:
          "Pinned Comment Template",
        category: "Engagement",
        type: "Free",
        description:
          "Encourage replies, subscriptions and related-video clicks.",
      },
      {
        icon: "📋",
        title:
          "Storyboard Template",
        category: "Production",
        type: "Free",
        description:
          "Plan narration, visuals, shots, text and sound for each scene.",
      },
      {
        icon: "💼",
        title:
          "Creator Media Kit Checklist",
        category: "Business",
        type: "Free",
        description:
          "What to include when preparing channel information for brands.",
      },
    ],
  },

  {
    id: "premium",
    icon: "💎",
    title: "Premium Packs",
    description:
      "Premium-ready creator pack concepts for future product expansion.",
    items: [
      {
        icon: "🚀",
        title:
          "YouTuber Pro Bundle",
        category: "Complete Pack",
        type: "Premium",
        description:
          "Creator planning, scripts, SEO, thumbnails and growth templates.",
      },
      {
        icon: "🖼️",
        title:
          "Thumbnail Mega Pack",
        category: "Design",
        type: "Premium",
        description:
          "Premium thumbnail layouts, text formulas and design systems.",
      },
      {
        icon: "🎥",
        title:
          "Faceless Channel Pack",
        category: "Workflow",
        type: "Premium",
        description:
          "Complete workflow templates for creating faceless channel content.",
      },
      {
        icon: "📈",
        title:
          "Channel Growth System",
        category: "Growth",
        type: "Premium",
        description:
          "90-day strategy, analytics tracking and content planning system.",
      },
      {
        icon: "🤝",
        title:
          "Sponsorship Business Kit",
        category: "Business",
        type: "Premium",
        description:
          "Media kit, outreach, follow-up, pricing and campaign templates.",
      },
      {
        icon: "🎞️",
        title:
          "Editing Creator Pack",
        category: "Editing",
        type: "Premium",
        description:
          "Editing workflow, transitions, captions, B-roll and project organization templates.",
      },
    ],
  },
];

/* =========================================================
   TOOL DEFINITIONS
========================================================= */

const toolCategories = [
  "All",
  "Ideas",
  "Writing",
  "SEO",
  "Thumbnail",
  "Shorts",
  "Planning",
  "Analytics",
  "Business",
  "Publishing",
];

const creatorTools = [
  {
    id: "video-ideas",
    icon: "💡",
    title:
      "Video Idea Generator",
    category: "Ideas",
    description:
      "Generate multiple YouTube video ideas from one niche or topic.",
  },
  {
    id: "title-generator",
    icon: "🧠",
    title:
      "Title Generator",
    category: "Writing",
    description:
      "Create different title styles for the same video topic.",
  },
  {
    id: "hook-generator",
    icon: "⚡",
    title:
      "Hook Generator",
    category: "Writing",
    description:
      "Create strong opening hooks for the first seconds of your video.",
  },
  {
    id: "script-generator",
    icon: "✍️",
    title:
      "Script Generator",
    category: "Writing",
    description:
      "Create a structured YouTube video script.",
  },
  {
    id: "description-generator",
    icon: "📝",
    title:
      "Description Generator",
    category: "SEO",
    description:
      "Create a clean YouTube video description.",
  },
  {
    id: "tags-generator",
    icon: "#️⃣",
    title:
      "Tags & Hashtags",
    category: "SEO",
    description:
      "Generate keyword-based tags and hashtags.",
  },
  {
    id: "seo-checker",
    icon: "🔍",
    title:
      "SEO Checklist",
    category: "SEO",
    description:
      "Score your basic YouTube SEO setup.",
  },
  {
    id: "thumbnail-text",
    icon: "🖼️",
    title:
      "Thumbnail Text Lab",
    category: "Thumbnail",
    description:
      "Create short thumbnail text variations.",
  },
  {
    id: "shorts-generator",
    icon: "📱",
    title:
      "Shorts Generator",
    category: "Shorts",
    description:
      "Turn a topic into a short-form video structure.",
  },
  {
    id: "community-post",
    icon: "💬",
    title:
      "Community Post Generator",
    category: "Writing",
    description:
      "Create questions, polls and video announcements.",
  },
  {
    id: "pinned-comment",
    icon: "📌",
    title:
      "Pinned Comment Generator",
    category: "Publishing",
    description:
      "Create useful pinned comments with calls to action.",
  },
  {
    id: "cta-generator",
    icon: "📣",
    title:
      "CTA Generator",
    category: "Writing",
    description:
      "Generate subscribe, comment and next-video CTAs.",
  },
  {
    id: "playlist-planner",
    icon: "📚",
    title:
      "Playlist Planner",
    category: "Planning",
    description:
      "Create a multi-video series or playlist plan.",
  },
  {
    id: "channel-name",
    icon: "🏷️",
    title:
      "Channel Name Ideas",
    category: "Ideas",
    description:
      "Generate simple YouTube channel-name ideas.",
  },
  {
    id: "content-calendar",
    icon: "📅",
    title:
      "7-Day Content Calendar",
    category: "Planning",
    description:
      "Build a one-week YouTube publishing plan.",
  },
  {
    id: "upload-checklist",
    icon: "✅",
    title:
      "Upload Checklist",
    category: "Publishing",
    description:
      "Track important steps before publishing a video.",
  },
  {
    id: "ctr-calculator",
    icon: "🖱️",
    title:
      "CTR Calculator",
    category: "Analytics",
    description:
      "Calculate thumbnail/title click-through rate.",
  },
  {
    id: "watchtime-calculator",
    icon: "⏱️",
    title:
      "Watch Time Calculator",
    category: "Analytics",
    description:
      "Estimate total watch hours from views and average view duration.",
  },
  {
    id: "engagement-calculator",
    icon: "❤️",
    title:
      "Engagement Rate",
    category: "Analytics",
    description:
      "Calculate engagement from likes, comments and views.",
  },
  {
    id: "revenue-estimator",
    icon: "💰",
    title:
      "Revenue Estimator",
    category: "Business",
    description:
      "Estimate revenue using views and RPM.",
  },
  {
    id: "sponsor-calculator",
    icon: "🤝",
    title:
      "Sponsorship Estimator",
    category: "Business",
    description:
      "Create a simple sponsorship pricing estimate.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function cleanTopic(
  value
) {
  return (
    value
      ?.trim()
      .replace(
        /\s+/g,
        " "
      ) || ""
  );
}

function titleCase(
  text
) {
  return text
    .split(" ")
    .map(
      (word) =>
        word
          ? word[0].toUpperCase() +
            word
              .slice(1)
              .toLowerCase()
          : word
    )
    .join(" ");
}

function slugWords(
  value
) {
  return cleanTopic(
    value
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9\s]/g,
      ""
    )
    .split(/\s+/)
    .filter(Boolean);
}

function unique(
  array
) {
  return [
    ...new Set(array),
  ];
}

/* =========================================================
   COPY BUTTON
========================================================= */

function CopyButton({
  text,
}) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  }

  return (
    <button
      type="button"
      onClick={
        handleCopy
      }
      className="
        rounded-xl
        border
        border-white/10
        bg-white/[0.035]
        px-4
        py-2.5
        text-xs
        font-bold
        text-gray-300
        transition
        hover:border-cyan-400/30
        hover:text-white
      "
    >
      {copied
        ? "✓ Copied"
        : "📋 Copy"}
    </button>
  );
}

/* =========================================================
   CREATOR TOOL
========================================================= */

function CreatorTool({
  tool,
  onClose,
}) {
  const [topic, setTopic] =
    useState("");

  const [
    secondary,
    setSecondary,
  ] = useState("");

  const [result, setResult] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    checklist,
    setChecklist,
  ] = useState(() => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "aft_youtube_upload_checklist"
          ) || "null"
        );

      if (
        Array.isArray(
          saved
        )
      ) {
        return saved;
      }
    } catch {
      // ignore
    }

    return [
      {
        id: 1,
        label:
          "Final video exported correctly",
        done: false,
      },
      {
        id: 2,
        label:
          "Title finalized",
        done: false,
      },
      {
        id: 3,
        label:
          "Thumbnail checked on mobile size",
        done: false,
      },
      {
        id: 4,
        label:
          "Description added",
        done: false,
      },
      {
        id: 5,
        label:
          "Relevant keywords included naturally",
        done: false,
      },
      {
        id: 6,
        label:
          "Chapters added when useful",
        done: false,
      },
      {
        id: 7,
        label:
          "Subtitles checked",
        done: false,
      },
      {
        id: 8,
        label:
          "Cards added",
        done: false,
      },
      {
        id: 9,
        label:
          "End screen added",
        done: false,
      },
      {
        id: 10,
        label:
          "Pinned comment prepared",
        done: false,
      },
      {
        id: 11,
        label:
          "Playlist selected",
        done: false,
      },
      {
        id: 12,
        label:
          "Visibility and publish time checked",
        done: false,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "aft_youtube_upload_checklist",
        JSON.stringify(
          checklist
        )
      );
    } catch {
      // ignore
    }
  }, [checklist]);

  function setTextResult(
    value
  ) {
    setResult(value);
    setError("");
  }

  function requireTopic() {
    const clean =
      cleanTopic(topic);

    if (!clean) {
      setError(
        "Please enter a topic or value first."
      );

      setResult("");

      return null;
    }

    return clean;
  }

  function generate() {
    setError("");

    const clean =
      cleanTopic(topic);

    switch (
      tool.id
    ) {
      case "video-ideas": {
        if (!clean) {
          return requireTopic();
        }

        const ideas = [
          `Beginner's Guide to ${clean}`,
          `10 Things You Should Know About ${clean}`,
          `${clean}: Common Mistakes Beginners Make`,
          `I Tried ${clean} for 7 Days — Here's What I Learned`,
          `${clean} Explained in Simple Words`,
          `The Complete ${clean} Checklist`,
          `5 Powerful ${clean} Tips You Can Use Today`,
          `Before You Start ${clean}, Watch This`,
          `${clean}: Myth vs Reality`,
          `How to Improve Your ${clean} Skills Step by Step`,
          `${clean} for Busy People`,
          `What Nobody Tells You About ${clean}`,
        ];

        return setTextResult(
          ideas
            .map(
              (
                item,
                index
              ) =>
                `${index + 1}. ${item}`
            )
            .join("\n")
        );
      }

      case "title-generator": {
        if (!clean) {
          return requireTopic();
        }

        const t =
          titleCase(clean);

        return setTextResult(
          [
            `${t}: The Complete Beginner Guide`,
            `I Tried ${t} — Here's What Happened`,
            `7 ${t} Tips You Need to Know`,
            `Stop Doing This With ${t}`,
            `The Truth About ${t}`,
            `How to Master ${t} Step by Step`,
            `${t} Explained in 10 Minutes`,
            `Before You Start ${t}, Watch This`,
            `5 Mistakes People Make With ${t}`,
            `Is ${t} Really Worth It?`,
          ].join("\n")
        );
      }

      case "hook-generator": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          [
            `Curiosity Hook:\nMost people misunderstand ${clean} — and in this video I'll show you what actually matters.`,
            `Problem Hook:\nIf you're struggling with ${clean}, these next few minutes could save you a lot of time.`,
            `Result Hook:\nBy the end of this video, you'll know exactly how to get started with ${clean}.`,
            `Question Hook:\nWhat if learning ${clean} was much easier than you think?`,
            `Story Hook:\nWhen I first started learning ${clean}, I made one mistake again and again.`,
            `Challenge Hook:\nGive me a few minutes and I'll make ${clean} simple enough for any beginner to understand.`,
          ].join(
            "\n\n"
          )
        );
      }

      case "script-generator": {
        if (!clean) {
          return requireTopic();
        }

        const audience =
          secondary.trim() ||
          "beginners";

        return setTextResult(
          `VIDEO TITLE IDEA
${titleCase(clean)} – Simple Guide for ${titleCase(
            audience
          )}

HOOK
Have you ever wanted to understand ${clean}, but didn't know where to start? In this video, we're going to make it simple.

INTRO
Welcome back! Today we're talking about ${clean}. This video is designed especially for ${audience}, so we'll keep everything clear and practical.

SECTION 1 – WHAT IS IT?
Start by explaining what ${clean} means in simple words. Avoid complicated terms and connect the topic to something viewers already understand.

SECTION 2 – WHY DOES IT MATTER?
Explain why ${clean} is useful, important or interesting. Give the viewer a reason to continue watching.

SECTION 3 – HOW DOES IT WORK?
Break ${clean} into 3 simple steps or ideas:
1. The basic concept.
2. A practical example.
3. A common real-world use.

SECTION 4 – COMMON MISTAKES
Mention 2 or 3 mistakes beginners often make when learning or using ${clean}. Explain how to avoid them.

SECTION 5 – ACTION STEP
Give viewers one small thing they can try immediately after watching the video.

CTA
If this video helped you understand ${clean}, share your biggest takeaway in the comments and subscribe for more simple videos like this.

OUTRO
Thanks for watching. Keep learning, keep creating, and I'll see you in the next video.`
        );
      }

      case "description-generator": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          `${titleCase(clean)} explained in a simple and practical way.

In this video, you'll learn:
✅ What ${clean} is
✅ Why it matters
✅ Important beginner concepts
✅ Common mistakes to avoid
✅ Practical tips you can use

If you found this video useful, like the video and subscribe for more creator-friendly learning content.

📌 Watch next:
Add your related video link here.

📚 Resources:
Add useful links here.

💬 Question:
What would you like to learn next about ${clean}?

#YouTube #Creator #Learning`
        );
      }

      case "tags-generator": {
        if (!clean) {
          return requireTopic();
        }

        const words =
          slugWords(clean);

        const base =
          words.join(" ");

        const tags = unique(
          [
            base,
            `${base} tutorial`,
            `${base} for beginners`,
            `${base} guide`,
            `${base} tips`,
            `how to ${base}`,
            `learn ${base}`,
            `${base} explained`,
            `${base} step by step`,
            `${base} basics`,
            ...words,
          ].filter(Boolean)
        );

        const hashtags =
          unique(
            words
              .slice(0, 5)
              .map(
                (word) =>
                  `#${word.replace(
                    /[^a-z0-9]/g,
                    ""
                  )}`
              )
          );

        return setTextResult(
          `TAGS\n${tags.join(
            ", "
          )}\n\nHASHTAGS\n${hashtags.join(
            " "
          )}`
        );
      }

      case "thumbnail-text": {
        if (!clean) {
          return requireTopic();
        }

        const important =
          titleCase(clean);

        return setTextResult(
          [
            `1. ${important}`,
            `2. DON'T MISS THIS`,
            `3. START HERE`,
            `4. EASY METHOD`,
            `5. BIG MISTAKE`,
            `6. THE TRUTH`,
            `7. DO THIS FIRST`,
            `8. BEGINNER GUIDE`,
            `9. WORTH IT?`,
            `10. SIMPLE STEPS`,
          ].join("\n")
        );
      }

      case "shorts-generator": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          `SHORTS SCRIPT – ${titleCase(
            clean
          )}

0–3 sec – HOOK
Here's one thing most beginners don't know about ${clean}.

3–15 sec – VALUE
Explain one useful point about ${clean} in one or two simple sentences.

15–25 sec – EXAMPLE
Show a quick example, comparison or visual proof.

25–35 sec – PAYOFF
Explain why this tip matters and what viewers should remember.

CTA
Follow or subscribe for more simple ${clean} tips.

ON-SCREEN TEXT
"${titleCase(
            clean
          )} – Quick Tip"

CAPTION
A quick ${clean} tip you can use today.`
        );
      }

      case "community-post": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          `QUESTION POST
What's the biggest challenge you have with ${clean} right now? 👇

POLL
Which ${clean} video should I make next?
A) Beginner Guide
B) Common Mistakes
C) Advanced Tips
D) Step-by-Step Tutorial

VIDEO ANNOUNCEMENT
🚀 New video coming soon!
I'm working on a simple video about ${clean}. What question should I answer in the video?

ENGAGEMENT POST
Rate your current knowledge of ${clean}:
1️⃣ Beginner
2️⃣ Learning
3️⃣ Intermediate
4️⃣ Advanced`
        );
      }

      case "pinned-comment": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          `📌 Thanks for watching!

What was the most useful thing you learned about ${clean}?

👇 Share your answer in the comments.

If you want to continue learning, watch the next related video here:
[ADD NEXT VIDEO LINK]

👍 Like the video if it helped you.
🔔 Subscribe for more useful content.`
        );
      }

      case "cta-generator": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          `SUBSCRIBE CTA
If you want more simple videos about ${clean}, subscribe so you don't miss the next one.

COMMENT CTA
What's your biggest question about ${clean}? Drop it in the comments — it might become my next video.

LIKE CTA
If this explanation made ${clean} easier to understand, hit the like button.

NEXT VIDEO CTA
Now that you understand ${clean}, watch the next video on screen to continue learning.

SHARE CTA
Know someone who's trying to learn ${clean}? Send this video to them.`
        );
      }

      case "playlist-planner": {
        if (!clean) {
          return requireTopic();
        }

        return setTextResult(
          `PLAYLIST: ${titleCase(
            clean
          )} Complete Series

Video 1 – ${titleCase(
            clean
          )} for Absolute Beginners

Video 2 – Important ${titleCase(
            clean
          )} Basics

Video 3 – Step-by-Step ${titleCase(
            clean
          )} Tutorial

Video 4 – Common ${titleCase(
            clean
          )} Mistakes

Video 5 – Useful ${titleCase(
            clean
          )} Tips

Video 6 – Real Examples of ${titleCase(
            clean
          )}

Video 7 – Intermediate ${titleCase(
            clean
          )} Guide

Video 8 – Best Tools and Resources for ${titleCase(
            clean
          )}

Video 9 – ${titleCase(
            clean
          )} Questions Answered

Video 10 – Complete ${titleCase(
            clean
          )} Review & Next Steps`
        );
      }

      case "channel-name": {
        if (!clean) {
          return requireTopic();
        }

        const main =
          titleCase(clean)
            .replace(
              /\s+/g,
              ""
            );

        return setTextResult(
          [
            `${main} Hub`,
            `${main} Lab`,
            `${main} Academy`,
            `${main} Daily`,
            `${main} Studio`,
            `${main} Simplified`,
            `Learn ${titleCase(
              clean
            )}`,
            `${main} Guide`,
            `${main} Central`,
            `${main} World`,
            `${main} Insider`,
            `${main} Tamil`,
          ].join("\n")
        );
      }

      case "content-calendar": {
        if (!clean) {
          return requireTopic();
        }

        const formatted =
          titleCase(clean);

        return setTextResult(
          `7-DAY YOUTUBE CONTENT PLAN – ${formatted}

DAY 1
Long Video:
${formatted} – Beginner Guide

DAY 2
Short:
One quick ${formatted} tip

Community Post:
Ask viewers their biggest ${formatted} question

DAY 3
Short:
Common ${formatted} mistake

DAY 4
Long Video:
5 ${formatted} Tips You Should Know

DAY 5
Short:
${formatted} myth vs reality

DAY 6
Community Poll:
Which ${formatted} topic should be next?

DAY 7
Short / Recap:
3 things viewers learned this week about ${formatted}`
        );
      }

      case "seo-checker": {
        if (!clean) {
          return requireTopic();
        }

        const title =
          clean;

        const description =
          secondary.trim();

        let score = 0;

        const checks = [];

        if (
          title.length >=
            25 &&
          title.length <=
            70
        ) {
          score += 25;
          checks.push(
            "✅ Title length looks reasonable."
          );
        } else {
          checks.push(
            "⚠️ Consider keeping the title clear and reasonably concise."
          );
        }

        if (
          title.split(" ")
            .length >= 4
        ) {
          score += 20;
          checks.push(
            "✅ Title contains enough context."
          );
        } else {
          checks.push(
            "⚠️ Title may be too vague."
          );
        }

        if (
          description.length >=
          80
        ) {
          score += 25;
          checks.push(
            "✅ Description has useful context."
          );
        } else {
          checks.push(
            "⚠️ Add a useful description for viewers."
          );
        }

        if (
          /how|guide|tips|best|why|what|beginner|tutorial/i.test(
            title
          )
        ) {
          score += 15;
          checks.push(
            "✅ Title communicates a clear viewer intent."
          );
        } else {
          checks.push(
            "💡 Consider making the viewer benefit clearer."
          );
        }

        if (
          secondary
            .toLowerCase()
            .includes(
              title
                .split(
                  " "
                )[0]
                .toLowerCase()
            )
        ) {
          score += 15;
          checks.push(
            "✅ Title and description appear related."
          );
        }

        return setTextResult(
          `BASIC SEO SCORE: ${score}/100

${checks.join(
  "\n"
)}

NOTE:
This is a simple content checklist, not an official YouTube ranking score.`
        );
      }

      case "ctr-calculator": {
        const impressions =
          Number(topic);

        const clicks =
          Number(
            secondary
          );

        if (
          !Number.isFinite(
            impressions
          ) ||
          !Number.isFinite(
            clicks
          ) ||
          impressions <= 0 ||
          clicks < 0
        ) {
          setError(
            "Enter valid impressions and clicks."
          );
          return;
        }

        const ctr =
          (clicks /
            impressions) *
          100;

        return setTextResult(
          `CTR = ${ctr.toFixed(
            2
          )}%

Formula:
Clicks ÷ Impressions × 100

${clicks.toLocaleString()} clicks from ${impressions.toLocaleString()} impressions.`
        );
      }

      case "watchtime-calculator": {
        const views =
          Number(topic);

        const minutes =
          Number(
            secondary
          );

        if (
          !Number.isFinite(
            views
          ) ||
          !Number.isFinite(
            minutes
          ) ||
          views < 0 ||
          minutes < 0
        ) {
          setError(
            "Enter valid views and average view duration."
          );
          return;
        }

        const totalMinutes =
          views *
          minutes;

        const hours =
          totalMinutes /
          60;

        return setTextResult(
          `Estimated Watch Time

${hours.toFixed(
  2
)} hours

Total Minutes:
${totalMinutes.toFixed(
  0
)} minutes

Based on:
${views.toLocaleString()} views
× ${minutes} minutes average view duration.`
        );
      }

      case "engagement-calculator": {
        const views =
          Number(topic);

        const interactions =
          Number(
            secondary
          );

        if (
          !Number.isFinite(
            views
          ) ||
          !Number.isFinite(
            interactions
          ) ||
          views <= 0 ||
          interactions < 0
        ) {
          setError(
            "Enter valid views and total interactions."
          );
          return;
        }

        const rate =
          (interactions /
            views) *
          100;

        return setTextResult(
          `Engagement Rate

${rate.toFixed(
  2
)}%

Formula:
(Likes + Comments + Other Interactions) ÷ Views × 100`
        );
      }

      case "revenue-estimator": {
        const views =
          Number(topic);

        const rpm =
          Number(
            secondary
          );

        if (
          !Number.isFinite(
            views
          ) ||
          !Number.isFinite(
            rpm
          ) ||
          views < 0 ||
          rpm < 0
        ) {
          setError(
            "Enter valid views and RPM."
          );
          return;
        }

        const revenue =
          (views / 1000) *
          rpm;

        return setTextResult(
          `Estimated Revenue

₹ / $ ${revenue.toFixed(
  2
)}

Formula:
Views ÷ 1,000 × RPM

This is only a mathematical estimate. Actual YouTube revenue can vary significantly.`
        );
      }

      case "sponsor-calculator": {
        const averageViews =
          Number(topic);

        const cpm =
          Number(
            secondary ||
              20
          );

        if (
          !Number.isFinite(
            averageViews
          ) ||
          !Number.isFinite(
            cpm
          ) ||
          averageViews < 0 ||
          cpm < 0
        ) {
          setError(
            "Enter valid average views and sponsor CPM."
          );
          return;
        }

        const estimate =
          (averageViews /
            1000) *
          cpm;

        return setTextResult(
          `Simple Sponsorship Estimate

${estimate.toFixed(
  2
)} currency units

Formula:
Average Views ÷ 1,000 × Sponsor CPM

Important:
Actual sponsorship pricing depends on niche, audience location, engagement, deliverables, usage rights and negotiation.`
        );
      }

      default:
        return;
    }
  }

  function secondaryLabel() {
    switch (
      tool.id
    ) {
      case "script-generator":
        return "Target Audience";

      case "seo-checker":
        return "Video Description";

      case "ctr-calculator":
        return "Clicks";

      case "watchtime-calculator":
        return "Average View Duration (minutes)";

      case "engagement-calculator":
        return "Likes + Comments + Interactions";

      case "revenue-estimator":
        return "RPM";

      case "sponsor-calculator":
        return "Sponsor CPM";

      default:
        return null;
    }
  }

  function topicLabel() {
    switch (
      tool.id
    ) {
      case "ctr-calculator":
        return "Impressions";

      case "watchtime-calculator":
        return "Views";

      case "engagement-calculator":
        return "Views";

      case "revenue-estimator":
        return "Views";

      case "sponsor-calculator":
        return "Average Views";

      case "seo-checker":
        return "Video Title";

      default:
        return "Topic / Niche";
    }
  }

  if (
    tool.id ===
    "upload-checklist"
  ) {
    const completed =
      checklist.filter(
        (item) =>
          item.done
      ).length;

    return (
      <section
        className="
          rounded-[30px]
          border
          border-cyan-400/20
          bg-[#090b12]/95
          p-6
          sm:p-8
        "
      >
        <ToolTop
          tool={tool}
          onClose={
            onClose
          }
        />

        <div
          className="
            mt-7
            rounded-2xl
            border
            border-white/[0.08]
            bg-black/30
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
            <p className="font-black">
              Upload Progress
            </p>

            <p className="text-sm text-cyan-300">
              {completed}/
              {
                checklist.length
              }
            </p>
          </div>

          <div
            className="
              mt-3
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
                width: `${
                  (completed /
                    checklist.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {checklist.map(
            (item) => (
              <label
                key={
                  item.id
                }
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                "
              >
                <input
                  type="checkbox"
                  checked={
                    item.done
                  }
                  onChange={() =>
                    setChecklist(
                      (
                        current
                      ) =>
                        current.map(
                          (
                            entry
                          ) =>
                            entry.id ===
                            item.id
                              ? {
                                  ...entry,
                                  done: !entry.done,
                                }
                              : entry
                        )
                    )
                  }
                  className="h-5 w-5"
                />

                <span
                  className={
                    item.done
                      ? "text-gray-500 line-through"
                      : "text-gray-200"
                  }
                >
                  {
                    item.label
                  }
                </span>
              </label>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setChecklist(
              (
                current
              ) =>
                current.map(
                  (
                    item
                  ) => ({
                    ...item,
                    done: false,
                  })
                )
            )
          }
          className="
            mt-5
            rounded-xl
            border
            border-white/10
            px-5
            py-3
            text-sm
            font-bold
            text-gray-300
          "
        >
          Reset Checklist
        </button>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-[30px]
        border
        border-cyan-400/20
        bg-[#090b12]/95
        p-6
        sm:p-8
      "
    >
      <ToolTop
        tool={tool}
        onClose={
          onClose
        }
      />

      <div className="mt-7">
        <label
          className="
            mb-2
            block
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-gray-500
          "
        >
          {topicLabel()}
        </label>

        <textarea
          value={topic}
          onChange={(
            event
          ) =>
            setTopic(
              event.target.value
            )
          }
          rows={
            tool.id ===
            "seo-checker"
              ? 2
              : 4
          }
          placeholder={
            tool.id.includes(
              "calculator"
            ) ||
            tool.id ===
              "revenue-estimator" ||
            tool.id ===
              "sponsor-calculator"
              ? "Enter a number..."
              : "Example: Artificial Intelligence for Beginners"
          }
          className="
            w-full
            resize-none
            rounded-2xl
            border
            border-white/[0.09]
            bg-black/30
            px-5
            py-4
            text-white
            outline-none
            placeholder:text-gray-600
            focus:border-cyan-400/35
          "
        />

        {secondaryLabel() && (
          <div className="mt-4">
            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-500
              "
            >
              {secondaryLabel()}
            </label>

            {tool.id ===
            "seo-checker" ? (
              <textarea
                value={
                  secondary
                }
                onChange={(
                  event
                ) =>
                  setSecondary(
                    event
                      .target
                      .value
                  )
                }
                rows={4}
                placeholder="Paste your video description..."
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-white/[0.09]
                  bg-black/30
                  px-5
                  py-4
                  text-white
                  outline-none
                "
              />
            ) : (
              <input
                value={
                  secondary
                }
                onChange={(
                  event
                ) =>
                  setSecondary(
                    event
                      .target
                      .value
                  )
                }
                placeholder={
                  tool.id ===
                  "script-generator"
                    ? "Example: beginners"
                    : "Enter value..."
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/[0.09]
                  bg-black/30
                  px-5
                  py-4
                  text-white
                  outline-none
                "
              />
            )}
          </div>
        )}

        <div
          className="
            mt-5
            flex
            flex-wrap
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={() => {
              setTopic("");
              setSecondary(
                ""
              );
              setResult("");
              setError("");
            }}
            className="
              rounded-xl
              border
              border-white/10
              px-5
              py-3
              text-sm
              font-bold
              text-gray-300
            "
          >
            🗑 Clear
          </button>

          <button
            type="button"
            onClick={
              generate
            }
            className="
              rounded-xl
              bg-gradient-to-r
              from-cyan-400
              via-purple-500
              to-pink-500
              px-6
              py-3
              text-sm
              font-black
              text-white
            "
          >
            ✨ Generate
          </button>
        </div>
      </div>

      {error && (
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-500/25
            bg-red-500/[0.06]
            p-4
            text-sm
            text-red-300
          "
        >
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-cyan-400/20
            bg-cyan-400/[0.035]
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              border-b
              border-white/[0.07]
              px-5
              py-4
            "
          >
            <div>
              <p className="font-black">
                ✨ Result
              </p>

              <p className="text-xs text-gray-500">
                Ready to use
              </p>
            </div>

            <CopyButton
              text={
                result
              }
            />
          </div>

          <div
            className="
              whitespace-pre-wrap
              break-words
              p-5
              text-[15px]
              leading-8
              text-gray-200
            "
          >
            {result}
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   TOOL HEADER
========================================================= */

function ToolTop({
  tool,
  onClose,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-5
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
            bg-cyan-400/[0.06]
            text-3xl
          "
        >
          {tool.icon}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {
              tool.category
            }
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-black
              sm:text-2xl
            "
          >
            {tool.title}
          </h2>
        </div>
      </div>

      <button
        type="button"
        onClick={
          onClose
        }
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          text-gray-400
          hover:text-white
        "
      >
        ✕
      </button>
    </div>
  );
}

/* =========================================================
   RESOURCE CARD
========================================================= */

function ResourceCard({
  item,
}) {
  const text = `${item.title}

${item.description}`;

  return (
    <article
      className="
        rounded-[24px]
        border
        border-white/[0.08]
        bg-[#101219]/90
        p-5
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div className="text-3xl">
          {item.icon}
        </div>

        <span
          className="
            rounded-full
            border
            border-white/10
            bg-white/[0.03]
            px-3
            py-1
            text-[10px]
            font-bold
            text-gray-400
          "
        >
          {item.type}
        </span>
      </div>

      <p
        className="
          mt-5
          text-xs
          font-bold
          uppercase
          text-pink-400
        "
      >
        {item.category}
      </p>

      <h3
        className="
          mt-2
          text-lg
          font-black
        "
      >
        {item.title}
      </h3>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-gray-500
        "
      >
        {item.description}
      </p>

      <div className="mt-5">
        <CopyButton
          text={text}
        />
      </div>
    </article>
  );
}

/* =========================================================
   YOUTUBE PAGE
========================================================= */

function YouTubeResources() {
  const [
    activeTool,
    setActiveTool,
  ] = useState(null);

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    resourceSearch,
    setResourceSearch,
  ] = useState("");

  const filteredTools =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return creatorTools.filter(
        (tool) => {
          const categoryOK =
            activeCategory ===
              "All" ||
            tool.category ===
              activeCategory;

          const searchOK =
            !q ||
            tool.title
              .toLowerCase()
              .includes(q) ||
            tool.description
              .toLowerCase()
              .includes(q) ||
            tool.category
              .toLowerCase()
              .includes(q);

          return (
            categoryOK &&
            searchOK
          );
        }
      );
    }, [
      search,
      activeCategory,
    ]);

  const allResources =
    useMemo(
      () =>
        resourceGroups.flatMap(
          (group) =>
            group.items.map(
              (item) => ({
                ...item,
                group:
                  group.title,
              })
            )
        ),
      []
    );

  const resourceResults =
    useMemo(() => {
      const q =
        resourceSearch
          .trim()
          .toLowerCase();

      if (!q) {
        return [];
      }

      return allResources.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(q) ||
          item.category
            .toLowerCase()
            .includes(q) ||
          item.description
            .toLowerCase()
            .includes(q) ||
          item.group
            .toLowerCase()
            .includes(q)
      );
    }, [
      resourceSearch,
      allResources,
    ]);

  return (
    <>
      {/* CREATOR STUDIO SUMMARY */}

      <section
        className="
          mx-auto
          mt-8
          max-w-7xl
        "
      >
        <div
          className="
            grid
            grid-cols-2
            gap-4
            lg:grid-cols-4
          "
        >
          {[
            [
              "🧰",
              "21",
              "Creator Tools",
            ],
            [
              "🎁",
              "24+",
              "Resources",
            ],
            [
              "📊",
              "5",
              "Calculators",
            ],
            [
              "💾",
              "Local",
              "Checklist Save",
            ],
          ].map(
            ([
              icon,
              value,
              label,
            ]) => (
              <div
                key={
                  label
                }
                className="
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-black/25
                  p-5
                "
              >
                <div className="text-2xl">
                  {icon}
                </div>

                <p
                  className="
                    mt-3
                    text-2xl
                    font-black
                  "
                >
                  {value}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  {label}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* RESOURCE SEARCH */}

      <section className="mx-auto mt-8 max-w-7xl">
        <div
          className="
            rounded-[26px]
            border
            border-white/[0.08]
            bg-black/25
            p-5
          "
        >
          <h2 className="text-xl font-black">
            🔎 Search YouTube Resources
          </h2>

          <input
            value={
              resourceSearch
            }
            onChange={(
              event
            ) =>
              setResourceSearch(
                event.target
                  .value
              )
            }
            placeholder="Search thumbnail, SEO, script, planning, business..."
            className="
              mt-4
              w-full
              rounded-xl
              border
              border-white/[0.08]
              bg-[#090b11]
              px-5
              py-4
              text-white
              outline-none
              placeholder:text-gray-600
            "
          />

          {resourceSearch && (
            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {resourceResults.length >
              0 ? (
                resourceResults.map(
                  (
                    item,
                    index
                  ) => (
                    <ResourceCard
                      key={`${item.title}-${index}`}
                      item={
                        item
                      }
                    />
                  )
                )
              ) : (
                <div className="text-sm text-gray-500">
                  No matching resources found.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4 MAIN RESOURCE GROUPS */}

      {resourceGroups.map(
        (group) => (
          <section
            key={
              group.id
            }
            className="
              mx-auto
              mt-10
              max-w-7xl
            "
          >
            <div
              className="
                mb-5
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p className="text-sm font-bold text-pink-400">
                  {
                    group.icon
                  }{" "}
                  CREATOR LIBRARY
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-black
                    sm:text-3xl
                  "
                >
                  {
                    group.title
                  }
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-gray-500
                  "
                >
                  {
                    group.description
                  }
                </p>
              </div>

              <span
                className="
                  text-xs
                  text-gray-600
                "
              >
                {
                  group.items
                    .length
                }{" "}
                resources
              </span>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {group.items.map(
                (
                  item
                ) => (
                  <ResourceCard
                    key={
                      item.title
                    }
                    item={
                      item
                    }
                  />
                )
              )}
            </div>
          </section>
        )
      )}

      {/* TOOLKIT */}

      <section
        className="
          mx-auto
          mt-12
          max-w-7xl
        "
      >
        <div
          className="
            rounded-[30px]
            border
            border-cyan-400/20
            bg-gradient-to-br
            from-cyan-500/[0.04]
            via-purple-500/[0.04]
            to-pink-500/[0.04]
            p-6
            sm:p-8
          "
        >
          <p
            className="
              text-sm
              font-bold
              text-cyan-400
            "
          >
            🧰 YOUTUBE CREATOR TOOLKIT
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-black
              sm:text-4xl
            "
          >
            Plan. Create.
            Publish. Grow.
          </h2>

          <p
            className="
              mt-3
              max-w-3xl
              text-gray-400
            "
          >
            Browser-based
            creator utilities.
            These tools work
            without depending
            on an external AI
            API.
          </p>

          <input
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="🔍 Search creator tools..."
            className="
              mt-6
              w-full
              rounded-2xl
              border
              border-white/[0.08]
              bg-black/30
              px-5
              py-4
              text-white
              outline-none
            "
          />

          <div
            className="
              mt-4
              flex
              gap-2
              overflow-x-auto
              pb-2
            "
          >
            {toolCategories.map(
              (
                category
              ) => (
                <button
                  key={
                    category
                  }
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                  className={`
                    min-w-max
                    rounded-full
                    border
                    px-4
                    py-2
                    text-xs
                    font-bold
                    ${
                      activeCategory ===
                      category
                        ? "border-cyan-400/40 bg-cyan-400/[0.08] text-cyan-300"
                        : "border-white/10 bg-white/[0.025] text-gray-500"
                    }
                  `}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {activeTool && (
          <div className="mt-6">
            <CreatorTool
              tool={
                activeTool
              }
              onClose={() =>
                setActiveTool(
                  null
                )
              }
            />
          </div>
        )}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredTools.map(
            (tool) => (
              <button
                key={
                  tool.id
                }
                type="button"
                onClick={() => {
                  setActiveTool(
                    tool
                  );

                  setTimeout(
                    () => {
                      window.scrollBy(
                        {
                          top: 350,
                          behavior:
                            "smooth",
                        }
                      );
                    },
                    50
                  );
                }}
                className="
                  rounded-[24px]
                  border
                  border-white/[0.08]
                  bg-[#101219]/90
                  p-5
                  text-left
                  transition
                  hover:border-cyan-400/30
                  hover:bg-cyan-400/[0.035]
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
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      text-2xl
                    "
                  >
                    {
                      tool.icon
                    }
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-white/10
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      text-gray-500
                    "
                  >
                    {
                      tool.category
                    }
                  </span>
                </div>

                <h3
                  className="
                    mt-5
                    text-lg
                    font-black
                  "
                >
                  {
                    tool.title
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
                    tool.description
                  }
                </p>

                <p
                  className="
                    mt-5
                    text-sm
                    font-bold
                    text-cyan-300
                  "
                >
                  Open Tool →
                </p>
              </button>
            )
          )}
        </div>

        {filteredTools.length ===
          0 && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-dashed
              border-white/10
              py-14
              text-center
              text-gray-500
            "
          >
            No creator tools
            found.
          </div>
        )}
      </section>

      {/* CREATOR GUIDES */}

      <section
        className="
          mx-auto
          mt-12
          max-w-7xl
          pb-20
        "
      >
        <div
          className="
            mb-6
          "
        >
          <p className="text-sm font-bold text-purple-400">
            📚 CREATOR LEARNING
          </p>

          <h2 className="mt-1 text-3xl font-black">
            YouTube Learning
            Center
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {[
            [
              "🎬",
              "Channel Setup",
              "Plan niche, audience, branding, channel description and upload style.",
            ],
            [
              "✍️",
              "Scripting",
              "Learn hook, structure, pacing, examples, CTA and outro planning.",
            ],
            [
              "🖼️",
              "Thumbnail Basics",
              "Focus on clarity, contrast, curiosity and mobile readability.",
            ],
            [
              "🔍",
              "SEO Basics",
              "Understand viewer intent, titles, descriptions and relevant keywords.",
            ],
            [
              "🎙️",
              "Audio & Voice",
              "Improve recording clarity, room noise, levels and voice-over delivery.",
            ],
            [
              "🎞️",
              "Editing Workflow",
              "Organize footage, remove unnecessary parts, add supporting visuals and polish.",
            ],
            [
              "📱",
              "YouTube Shorts",
              "Use fast hooks, one main idea, visual pacing and a clear payoff.",
            ],
            [
              "📊",
              "Analytics",
              "Review impressions, CTR, retention, watch time and returning viewers.",
            ],
            [
              "©️",
              "Copyright Basics",
              "Check licenses and permissions before using music, video, images or third-party assets.",
            ],
            [
              "💰",
              "Monetization",
              "Explore advertising, sponsorships, affiliates, memberships and digital products.",
            ],
            [
              "🤝",
              "Brand Deals",
              "Prepare audience information, media kit, deliverables and professional communication.",
            ],
            [
              "✅",
              "Publishing System",
              "Use repeatable planning, production, upload and post-publish checklists.",
            ],
          ].map(
            ([
              icon,
              title,
              text,
            ]) => (
              <article
                key={
                  title
                }
                className="
                  rounded-[24px]
                  border
                  border-white/[0.08]
                  bg-black/25
                  p-6
                "
              >
                <div className="text-3xl">
                  {icon}
                </div>

                <h3
                  className="
                    mt-4
                    text-lg
                    font-black
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  {text}
                </p>
              </article>
            )
          )}
        </div>
      </section>
    </>
  );
}

/* =========================================================
   GENERIC CREATOR PAGE
========================================================= */

function GenericCreatorContent({
  page,
}) {
  const cards = [
    {
      icon: "🔥",
      title:
        "Trending Resources",
      text:
        "Popular creator resources and useful ideas for this category.",
    },
    {
      icon: "🆕",
      title:
        "Latest Uploads",
      text:
        "New creator templates and assets will appear here.",
    },
    {
      icon: "🎁",
      title:
        "Free Resources",
      text:
        "Useful free assets and creator tools.",
    },
    {
      icon: "💎",
      title:
        "Premium Packs",
      text:
        "Premium templates and creator packs.",
    },
  ];

  return (
    <section
      className="
        mx-auto
        mt-8
        grid
        max-w-7xl
        grid-cols-1
        gap-5
        pb-20
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {cards.map(
        (card) => (
          <div
            key={
              card.title
            }
            className="
              rounded-3xl
              border
              border-white/[0.08]
              bg-black/30
              p-6
            "
          >
            <div className="text-3xl">
              {card.icon}
            </div>

            <h2 className="mt-5 text-xl font-bold">
              {card.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {card.text}
            </p>

            <p className="mt-5 text-xs text-pink-400">
              {page.title}
            </p>
          </div>
        )
      )}
    </section>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function CreatorHubPage() {
  const location =
    useLocation();

  const page =
    creatorPages[
      location.pathname
    ] || {
      icon: "🎬",
      title:
        "Creator Hub",
      subtitle:
        "Everything creators need for video, social media and digital content.",
    };

  const isYouTube =
    location.pathname ===
    "/creators/youtube";

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        px-5
        py-12
        text-white
        sm:px-6
      "
    >
      {/* HERO */}

      <section className="mx-auto max-w-7xl">
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-pink-400/20
            bg-black/30
            px-6
            py-12
            backdrop-blur-xl
            sm:px-10
            sm:py-16
          "
        >
          <div
            className="
              absolute
              -right-20
              -top-32
              h-80
              w-80
              rounded-full
              bg-pink-500/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-20
              h-80
              w-80
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div className="relative z-10 max-w-4xl">
            <span
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-pink-400/20
                bg-pink-400/[0.06]
                px-4
                py-2
                text-sm
                font-semibold
                text-pink-300
              "
            >
              🎬 Creator Hub
            </span>

            <div className="mb-6 text-6xl sm:text-7xl">
              {page.icon}
            </div>

            <h1
              className="
                bg-gradient-to-r
                from-white
                via-pink-200
                to-purple-400
                bg-clip-text
                text-4xl
                font-black
                text-transparent
                sm:text-5xl
                md:text-6xl
              "
            >
              {page.title}
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-lg
                leading-8
                text-gray-400
                sm:text-xl
              "
            >
              {page.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/creators/youtube"
                className="
                  rounded-xl
                  bg-white
                  px-6
                  py-3
                  font-bold
                  text-black
                  transition
                  hover:bg-gray-200
                "
              >
                Explore Creator
                Resources →
              </Link>

              <Link
                to="/"
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-6
                  py-3
                  font-semibold
                  text-gray-300
                "
              >
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {quickLinks.map(
            ([
              icon,
              label,
              path,
            ]) => (
              <Link
                key={path}
                to={path}
                className={`
                  min-w-max
                  rounded-xl
                  border
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  ${
                    location.pathname ===
                    path
                      ? "border-pink-400 bg-pink-400/10 text-pink-300"
                      : "border-white/10 bg-black/30 text-gray-400 hover:text-white"
                  }
                `}
              >
                {icon}{" "}
                {label}
              </Link>
            )
          )}
        </div>
      </section>

      {/* CONTENT */}

      {isYouTube ? (
        <YouTubeResources />
      ) : (
        <GenericCreatorContent
          page={page}
        />
      )}
    </main>
  );
}

export default CreatorHubPage;