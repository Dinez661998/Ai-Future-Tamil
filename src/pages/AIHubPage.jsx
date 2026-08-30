import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

/* =========================================================
   PAGE CONFIG
========================================================= */

const PAGE_CONFIG = {
  "/ai-apps": {
    icon: "📱",
    title: "AI Apps",
    subtitle:
      "Discover useful AI applications for writing, productivity, creativity and daily work.",
    type: "apps",
  },

  "/ai-images": {
    icon: "🎨",
    title: "AI Images",
    subtitle:
      "Create professional AI image prompts and discover image generation tools.",
    type: "images",
  },

  "/ai-videos": {
    icon: "🎬",
    title: "AI Videos",
    subtitle:
      "Create detailed video generation prompts for AI video tools.",
    type: "videos",
  },

  "/ai-models": {
    icon: "🧠",
    title: "AI Models",
    subtitle:
      "Compare popular AI models and find a suitable model for your task.",
    type: "models",
  },

  "/ai-datasets": {
    icon: "📊",
    title: "AI Datasets",
    subtitle:
      "Discover useful datasets for AI, machine learning and research.",
    type: "datasets",
  },

  "/source-code": {
    icon: "💻",
    title: "AI Source Code",
    subtitle:
      "Generate starter code using the AI Future Tamil Gemini backend.",
    type: "code",
  },

  "/ai-templates": {
    icon: "🧩",
    title: "AI Templates",
    subtitle:
      "Use ready-made AI prompts and templates for work and content creation.",
    type: "templates",
  },

  "/wallpapers": {
    icon: "🌌",
    title: "AI Wallpapers",
    subtitle:
      "Create high-quality wallpaper prompts for mobile and desktop.",
    type: "wallpapers",
  },
};

/* =========================================================
   STATIC RESOURCE DATA
========================================================= */

const AI_APPS = [
  {
    icon: "🤖",
    title: "ChatGPT",
    category: "Assistant",
    description:
      "AI assistant for writing, coding, learning and productivity.",
    url: "https://chatgpt.com/",
  },
  {
    icon: "💎",
    title: "Gemini",
    category: "Assistant",
    description:
      "Google AI assistant for research, writing and everyday tasks.",
    url: "https://gemini.google.com/",
  },
  {
    icon: "🧠",
    title: "Claude",
    category: "Assistant",
    description:
      "AI assistant for writing, reasoning and analysis.",
    url: "https://claude.ai/",
  },
  {
    icon: "🔎",
    title: "Perplexity",
    category: "Research",
    description:
      "AI-powered search and research assistant.",
    url: "https://www.perplexity.ai/",
  },
  {
    icon: "🎨",
    title: "Canva",
    category: "Design",
    description:
      "Design platform with multiple AI-powered creative features.",
    url: "https://www.canva.com/",
  },
  {
    icon: "🎵",
    title: "Suno",
    category: "Music",
    description:
      "Create songs and music using artificial intelligence.",
    url: "https://suno.com/",
  },
];

const IMAGE_TOOLS = [
  {
    icon: "🎨",
    title: "Midjourney",
    category: "Image",
    description:
      "AI image generation platform.",
    url: "https://www.midjourney.com/",
  },
  {
    icon: "🔥",
    title: "Adobe Firefly",
    category: "Image",
    description:
      "Adobe generative AI tools for creative images.",
    url: "https://firefly.adobe.com/",
  },
  {
    icon: "🖌️",
    title: "Ideogram",
    category: "Image",
    description:
      "AI image generation platform with text rendering capabilities.",
    url: "https://ideogram.ai/",
  },
  {
    icon: "🦁",
    title: "Leonardo AI",
    category: "Image",
    description:
      "AI-powered image creation platform.",
    url: "https://leonardo.ai/",
  },
];

const VIDEO_TOOLS = [
  {
    icon: "🎬",
    title: "Runway",
    category: "Video",
    description:
      "AI video generation and editing platform.",
    url: "https://runwayml.com/",
  },
  {
    icon: "⚡",
    title: "Pika",
    category: "Video",
    description:
      "Create and transform videos with AI.",
    url: "https://pika.art/",
  },
  {
    icon: "🌟",
    title: "Luma AI",
    category: "Video",
    description:
      "AI-powered visual and video creation.",
    url: "https://lumalabs.ai/",
  },
  {
    icon: "✂️",
    title: "CapCut",
    category: "Editing",
    description:
      "Video editing platform with AI tools.",
    url: "https://www.capcut.com/",
  },
];

const DATASETS = [
  {
    icon: "🤗",
    title: "Hugging Face Datasets",
    category: "Machine Learning",
    description:
      "Datasets for machine learning and AI projects.",
    url: "https://huggingface.co/datasets",
  },
  {
    icon: "📊",
    title: "Kaggle Datasets",
    category: "Data Science",
    description:
      "Public datasets for analytics and machine learning.",
    url: "https://www.kaggle.com/datasets",
  },
  {
    icon: "🔍",
    title: "Google Dataset Search",
    category: "Research",
    description:
      "Search engine for discovering datasets.",
    url: "https://datasetsearch.research.google.com/",
  },
];

const MODELS = [
  {
    icon: "💎",
    name: "Gemini",
    company: "Google",
    bestFor:
      "General AI, writing, coding and multimodal tasks",
  },
  {
    icon: "🤖",
    name: "GPT",
    company: "OpenAI",
    bestFor:
      "Writing, coding, reasoning and general AI",
  },
  {
    icon: "🧠",
    name: "Claude",
    company: "Anthropic",
    bestFor:
      "Writing, long documents and analysis",
  },
  {
    icon: "🦙",
    name: "Llama",
    company: "Meta",
    bestFor:
      "Open model development and experimentation",
  },
];

const TEMPLATES = [
  {
    icon: "🎥",
    title: "YouTube Script",
    category: "Creator",
    prompt:
      "Create a complete YouTube video script about [TOPIC]. Include hook, intro, main content, examples, CTA and outro.",
  },
  {
    icon: "📧",
    title: "Professional Email",
    category: "Work",
    prompt:
      "Write a professional email about [SUBJECT]. Include a suitable subject line and clear professional message.",
  },
  {
    icon: "📱",
    title: "Social Caption",
    category: "Creator",
    prompt:
      "Create an engaging social media caption about [TOPIC]. Include hook, CTA and relevant hashtags.",
  },
  {
    icon: "📝",
    title: "Blog Article",
    category: "Writing",
    prompt:
      "Write a structured blog article about [TOPIC] with title, introduction, headings, examples and conclusion.",
  },
];

/* =========================================================
   SAFE AI REQUEST
========================================================= */

async function callAI(message) {
  const response = await fetch("/api/chat", {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      message,
    }),
  });

  const rawText =
    await response.text();

  let data = null;

  if (rawText) {
    try {
      data =
        JSON.parse(rawText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (
      data?.error
    ) {
      throw new Error(
        data.error
      );
    }

    if (rawText) {
      throw new Error(
        rawText.slice(
          0,
          250
        )
      );
    }

    throw new Error(
      `AI request failed. Server status: ${response.status}`
    );
  }

  if (!data) {
    throw new Error(
      "AI server returned an empty or invalid response."
    );
  }

  if (!data.reply) {
    throw new Error(
      data.error ||
        "No AI response received."
    );
  }

  return data.reply;
}

/* =========================================================
   COPY BUTTON
========================================================= */

function CopyButton({
  text,
}) {
  const [copied, setCopied] =
    useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Copy error:",
        error
      );
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="
        rounded-xl
        border
        border-white/10
        bg-white/[0.03]
        px-4
        py-2
        text-xs
        font-bold
        text-gray-300
      "
    >
      {copied
        ? "✓ Copied"
        : "📋 Copy"}
    </button>
  );
}

/* =========================================================
   RESOURCE CARD
========================================================= */

function ResourceCard({
  item,
}) {
  return (
    <article
      className="
        rounded-[24px]
        border
        border-white/[0.08]
        bg-[#11131a]/90
        p-5
      "
    >
      <div className="text-4xl">
        {item.icon}
      </div>

      <p
        className="
          mt-5
          text-xs
          font-bold
          uppercase
          text-cyan-400
        "
      >
        {item.category}
      </p>

      <h3
        className="
          mt-2
          text-xl
          font-black
        "
      >
        {item.title}
      </h3>

      <p
        className="
          mt-3
          min-h-[70px]
          text-sm
          leading-6
          text-gray-400
        "
      >
        {item.description}
      </p>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-5
          block
          rounded-xl
          bg-white
          px-5
          py-3
          text-center
          text-sm
          font-black
          text-black
        "
      >
        Open Resource →
      </a>
    </article>
  );
}

/* =========================================================
   SEARCHABLE RESOURCES
========================================================= */

function SearchableResources({
  items,
}) {
  const [search, setSearch] =
    useState("");

  const results =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return items;
      }

      return items.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(query) ||
          item.category
            .toLowerCase()
            .includes(query) ||
          item.description
            .toLowerCase()
            .includes(query)
      );
    }, [
      search,
      items,
    ]);

  return (
    <>
      <div
        className="
          mt-7
          rounded-2xl
          border
          border-white/[0.08]
          bg-black/25
          p-4
        "
      >
        <input
          value={search}
          onChange={(
            event
          ) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="🔍 Search resources..."
          className="
            w-full
            rounded-xl
            border
            border-white/[0.08]
            bg-[#090b11]
            px-5
            py-4
            text-white
            outline-none
          "
        />
      </div>

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {results.map(
          (item) => (
            <ResourceCard
              key={
                item.title
              }
              item={item}
            />
          )
        )}
      </div>
    </>
  );
}

/* =========================================================
   GENERIC AI GENERATOR
========================================================= */

function AIGenerator({
  title,
  icon,
  placeholder,
  buttonText,
  options = [],
  buildPrompt,
}) {
  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState("");

  const [error, setError] =
    useState("");

  const [settings, setSettings] =
    useState(
      Object.fromEntries(
        options.map(
          (option) => [
            option.key,
            option.values[0],
          ]
        )
      )
    );

  async function generate() {
    if (
      !input.trim()
    ) {
      setError(
        "Please enter your request first."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult("");

      const finalPrompt =
        buildPrompt(
          input.trim(),
          settings
        );

      const aiReply =
        await callAI(
          finalPrompt
        );

      setResult(
        aiReply
      );
    } catch (error) {
      console.error(
        "AI generator error:",
        error
      );

      setError(
        error?.message ||
          "AI request failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setInput("");
    setResult("");
    setError("");
  }

  return (
    <section
      className="
        mt-7
        rounded-[28px]
        border
        border-purple-400/20
        bg-[#080a12]/90
        p-5
        sm:p-7
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
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            border-purple-400/20
            bg-purple-400/[0.06]
            text-2xl
          "
        >
          {icon}
        </div>

        <div>
          <h2
            className="
              text-xl
              font-black
              sm:text-2xl
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
            "
          >
            Powered by Gemini AI
          </p>
        </div>
      </div>

      <textarea
        value={input}
        onChange={(
          event
        ) =>
          setInput(
            event.target.value
          )
        }
        rows={5}
        placeholder={
          placeholder
        }
        className="
          mt-6
          min-h-[140px]
          w-full
          resize-none
          rounded-2xl
          border
          border-white/[0.09]
          bg-black/30
          px-5
          py-4
          leading-7
          text-white
          outline-none
          placeholder:text-gray-600
          focus:border-purple-400/40
        "
      />

      {options.length >
        0 && (
        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {options.map(
            (option) => (
              <div
                key={
                  option.key
                }
              >
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    text-gray-500
                  "
                >
                  {option.label}
                </label>

                <select
                  value={
                    settings[
                      option.key
                    ]
                  }
                  onChange={(
                    event
                  ) =>
                    setSettings(
                      (
                        old
                      ) => ({
                        ...old,

                        [option.key]:
                          event
                            .target
                            .value,
                      })
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-[#11131c]
                    px-4
                    py-3.5
                    text-white
                    outline-none
                  "
                >
                  {option.values.map(
                    (value) => (
                      <option
                        key={
                          value
                        }
                      >
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>
            )
          )}
        </div>
      )}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:justify-end
        "
      >
        <button
          type="button"
          onClick={clear}
          disabled={loading}
          className="
            rounded-xl
            border
            border-white/10
            px-5
            py-3
            font-bold
            text-gray-300
          "
        >
          🗑 Clear
        </button>

        <button
          type="button"
          onClick={generate}
          disabled={
            loading ||
            !input.trim()
          }
          className="
            rounded-xl
            bg-gradient-to-r
            from-purple-500
            via-pink-500
            to-cyan-400
            px-6
            py-3
            font-black
            text-white
            disabled:opacity-40
          "
        >
          {loading
            ? "✨ Generating..."
            : buttonText}
        </button>
      </div>

      {error && (
        <div
          className="
            mt-5
            rounded-xl
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

      {result &&
        !loading && (
        <div
          className="
            mt-6
            overflow-hidden
            rounded-[24px]
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
              border-b
              border-white/[0.07]
              px-5
              py-4
            "
          >
            <div>
              <p className="font-black">
                ✨ AI Result
              </p>

              <p className="text-xs text-gray-500">
                Generated successfully
              </p>
            </div>

            <CopyButton
              text={result}
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
              sm:p-6
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
   IMAGE PAGE
========================================================= */

function ImagesPage() {
  return (
    <>
      <AIGenerator
        title="AI Image Prompt Generator"
        icon="🎨"
        placeholder="Example: Hyper realistic image of a beautiful plant..."
        buttonText="✨ Generate Image Prompt"
        options={[
          {
            key: "style",
            label: "🎨 Style",
            values: [
              "Photorealistic",
              "Cinematic",
              "3D Render",
              "Anime",
              "Fantasy",
            ],
          },
          {
            key: "ratio",
            label:
              "📐 Aspect Ratio",
            values: [
              "16:9",
              "1:1",
              "9:16",
              "4:5",
            ],
          },
          {
            key: "quality",
            label: "✨ Quality",
            values: [
              "Simple",
              "High Detail",
              "Ultra Detailed",
            ],
          },
        ]}
        buildPrompt={(
          idea,
          settings
        ) => `
Act as a professional AI image prompt engineer.

Create ONE final image generation prompt.

User idea:
${idea}

Style:
${settings.style}

Aspect ratio:
${settings.ratio}

Quality:
${settings.quality}

Include:
subject,
environment,
lighting,
camera,
composition,
colors,
mood,
textures,
depth,
details.

Make it usable in Midjourney, Leonardo, Ideogram or other AI image tools.

Return ONLY the final prompt.
        `.trim()}
      />

      <SearchableResources
        items={
          IMAGE_TOOLS
        }
      />
    </>
  );
}

/* =========================================================
   VIDEO PAGE
========================================================= */

function VideosPage() {
  return (
    <>
      <AIGenerator
        title="AI Video Prompt Generator"
        icon="🎬"
        placeholder="Example: Hyper realistic video of a plant growing..."
        buttonText="🎬 Generate Video Prompt"
        options={[
          {
            key: "duration",
            label: "⏱ Duration",
            values: [
              "5 Seconds",
              "10 Seconds",
              "15 Seconds",
              "30 Seconds",
            ],
          },
          {
            key: "camera",
            label: "📹 Camera",
            values: [
              "Cinematic",
              "Drone",
              "Tracking Shot",
              "Close-up",
              "Wide Shot",
            ],
          },
          {
            key: "style",
            label: "🎭 Style",
            values: [
              "Realistic",
              "Cinematic",
              "Animation",
              "Fantasy",
            ],
          },
        ]}
        buildPrompt={(
          idea,
          settings
        ) => `
Act as a professional AI video prompt engineer.

Create ONE final text-to-video prompt.

Idea:
${idea}

Duration:
${settings.duration}

Camera:
${settings.camera}

Style:
${settings.style}

Include:
subject,
action,
environment,
camera movement,
lighting,
motion,
atmosphere,
visual quality,
ending shot.

Return ONLY the final video prompt.
        `.trim()}
      />

      <SearchableResources
        items={
          VIDEO_TOOLS
        }
      />
    </>
  );
}

/* =========================================================
   CODE PAGE
========================================================= */

function CodePage() {
  return (
    <AIGenerator
      title="AI Code Generator"
      icon="💻"
      placeholder="Example: Responsive login page for my website..."
      buttonText="💻 Generate Code"
      options={[
        {
          key: "language",
          label: "💻 Language",
          values: [
            "HTML/CSS/JavaScript",
            "JavaScript",
            "React",
            "Python",
            "PHP",
            "SQL",
          ],
        },
        {
          key: "level",
          label: "🎓 Level",
          values: [
            "Beginner",
            "Intermediate",
            "Advanced",
          ],
        },
      ]}
      buildPrompt={(
        idea,
        settings
      ) => `
You are a professional software developer.

Create COMPLETE WORKING CODE for this request:

${idea}

Technology:
${settings.language}

Difficulty:
${settings.level}

Requirements:
- complete code
- no missing sections
- clean formatting
- useful comments
- responsive if it is UI
- beginner-friendly structure
- explain how to run it after the code

Do not give incomplete snippets.
        `.trim()}
    />
  );
}

/* =========================================================
   WALLPAPER PAGE
========================================================= */

function WallpapersPage() {
  return (
    <AIGenerator
      title="AI Wallpaper Prompt Generator"
      icon="🌌"
      placeholder="Example: Futuristic cyberpunk city wallpaper..."
      buttonText="🌌 Generate Wallpaper Prompt"
      options={[
        {
          key: "device",
          label: "📱 Device",
          values: [
            "Mobile",
            "Desktop",
            "Tablet",
          ],
        },
        {
          key: "style",
          label: "🎨 Style",
          values: [
            "Cinematic",
            "Minimal",
            "Nature",
            "Fantasy",
            "Cyberpunk",
            "Anime",
          ],
        },
      ]}
      buildPrompt={(
        idea,
        settings
      ) => `
Create ONE premium AI wallpaper prompt.

Main idea:
${idea}

Device:
${settings.device}

Style:
${settings.style}

Include:
composition,
background,
lighting,
colors,
depth,
details,
clean icon space,
high resolution,
premium wallpaper aesthetics.

Return ONLY the final wallpaper prompt.
        `.trim()}
    />
  );
}

/* =========================================================
   MODELS PAGE
========================================================= */

function ModelsPage() {
  const [task, setTask] =
    useState(
      "General AI"
    );

  const recommendation =
    useMemo(() => {
      const map = {
        "General AI":
          "Gemini / GPT",
        Writing:
          "Claude / GPT",
        Coding:
          "Gemini / GPT",
        Research:
          "Gemini / Claude",
        "Open Source":
          "Llama",
      };

      return map[task];
    }, [task]);

  return (
    <>
      <section
        className="
          mt-7
          rounded-[28px]
          border
          border-cyan-400/20
          bg-black/25
          p-6
        "
      >
        <p className="text-sm font-bold text-cyan-400">
          🎯 Model Finder
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Choose your task
        </h2>

        <div
          className="
            mt-5
            grid
            gap-4
            md:grid-cols-2
          "
        >
          <select
            value={task}
            onChange={(
              event
            ) =>
              setTask(
                event.target.value
              )
            }
            className="
              rounded-xl
              border
              border-white/10
              bg-[#101219]
              px-5
              py-4
              text-white
            "
          >
            <option>
              General AI
            </option>

            <option>
              Writing
            </option>

            <option>
              Coding
            </option>

            <option>
              Research
            </option>

            <option>
              Open Source
            </option>
          </select>

          <div
            className="
              rounded-xl
              border
              border-green-400/20
              bg-green-400/[0.05]
              px-5
              py-4
            "
          >
            <p className="text-xs text-gray-500">
              Recommended
            </p>

            <p className="mt-1 font-black text-green-300">
              {recommendation}
            </p>
          </div>
        </div>
      </section>

      <div
        className="
          mt-6
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
        "
      >
        {MODELS.map(
          (model) => (
            <article
              key={
                model.name
              }
              className="
                rounded-[24px]
                border
                border-white/[0.08]
                bg-[#11131a]/90
                p-6
              "
            >
              <div className="text-4xl">
                {model.icon}
              </div>

              <h3
                className="
                  mt-4
                  text-xl
                  font-black
                "
              >
                {model.name}
              </h3>

              <p className="text-sm text-cyan-400">
                {model.company}
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  leading-6
                  text-gray-400
                "
              >
                Best for:{" "}
                {model.bestFor}
              </p>
            </article>
          )
        )}
      </div>
    </>
  );
}

/* =========================================================
   TEMPLATE PAGE
========================================================= */

function TemplatesPage() {
  return (
    <div
      className="
        mt-7
        grid
        grid-cols-1
        gap-5
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {TEMPLATES.map(
        (template) => (
          <article
            key={
              template.title
            }
            className="
              rounded-[24px]
              border
              border-white/[0.08]
              bg-[#11131a]/90
              p-5
            "
          >
            <div className="text-4xl">
              {template.icon}
            </div>

            <p className="mt-4 text-xs font-bold text-purple-400">
              {template.category}
            </p>

            <h3 className="mt-2 text-xl font-black">
              {template.title}
            </h3>

            <div
              className="
                mt-4
                rounded-xl
                bg-black/25
                p-4
                text-sm
                leading-6
                text-gray-400
              "
            >
              {template.prompt}
            </div>

            <div className="mt-4">
              <CopyButton
                text={
                  template.prompt
                }
              />
            </div>
          </article>
        )
      )}
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

function AIHubPage() {
  const location =
    useLocation();

  const config =
    PAGE_CONFIG[
      location.pathname
    ] ||
    PAGE_CONFIG[
      "/ai-apps"
    ];

  function renderContent() {
    switch (
      config.type
    ) {
      case "apps":
        return (
          <SearchableResources
            items={
              AI_APPS
            }
          />
        );

      case "images":
        return (
          <ImagesPage />
        );

      case "videos":
        return (
          <VideosPage />
        );

      case "models":
        return (
          <ModelsPage />
        );

      case "datasets":
        return (
          <SearchableResources
            items={
              DATASETS
            }
          />
        );

      case "code":
        return (
          <CodePage />
        );

      case "templates":
        return (
          <TemplatesPage />
        );

      case "wallpapers":
        return (
          <WallpapersPage />
        );

      default:
        return null;
    }
  }

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        px-5
        py-9
        text-white
        sm:px-7
        lg:px-9
      "
    >
      <div
        className="
          mx-auto
          max-w-[1450px]
        "
      >
        <section
          className="
            rounded-[32px]
            border
            border-white/[0.08]
            bg-black/25
            p-7
            backdrop-blur-xl
            sm:p-9
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-400/[0.05]
              text-4xl
            "
          >
            {config.icon}
          </div>

          <p
            className="
              mt-6
              text-sm
              font-bold
              text-cyan-400
            "
          >
            AI FUTURE TAMIL
          </p>

          <h1
            className="
              mt-2
              text-4xl
              font-black
              sm:text-5xl
            "
          >
            {config.title}
          </h1>

          <p
            className="
              mt-4
              max-w-3xl
              text-lg
              leading-8
              text-gray-400
            "
          >
            {config.subtitle}
          </p>
        </section>

        {renderContent()}
      </div>
    </main>
  );
}

export default AIHubPage;