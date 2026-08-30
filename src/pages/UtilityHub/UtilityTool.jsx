import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

/* =========================================================
   TOOL DATA
========================================================= */

const toolInfo = {
  "resume-builder": {
    icon: "📄",
    title: "Resume & Portfolio Builder",
    subtitle:
      "Create professional resume summaries and portfolio content.",
    type: "resume",
  },

  "youtube-studio": {
    icon: "🎥",
    title: "YouTube Content Studio",
    subtitle:
      "Turn one topic into a complete YouTube content plan.",
    type: "youtube",
  },

  "thumbnail-lab": {
    icon: "🖼️",
    title: "Thumbnail Preview Lab",
    subtitle:
      "Upload an image and preview thumbnail text instantly.",
    type: "thumbnail",
  },

  "link-hub": {
    icon: "🔗",
    title: "Creator Link Hub",
    subtitle:
      "Build a simple creator profile and social link page.",
    type: "links",
  },

  "file-utility": {
    icon: "🛠️",
    title: "File Utility Center",
    subtitle:
      "Inspect your files and automatically create clean filenames.",
    type: "file",
  },

  "brand-kit": {
    icon: "🎨",
    title: "Brand Kit Generator",
    subtitle:
      "Create your own brand colors and visual identity preview.",
    type: "brand",
  },

  "social-preview": {
    icon: "📱",
    title: "Social Post Preview",
    subtitle:
      "Preview your social media content before publishing.",
    type: "social",
  },

  "freelancer-calculator": {
    icon: "💰",
    title: "Freelancer Price Calculator",
    subtitle:
      "Calculate a suggested project price for freelance work.",
    type: "calculator",
  },

  "project-brief": {
    icon: "📋",
    title: "Project Brief Generator",
    subtitle:
      "Create a structured client project brief.",
    type: "brief",
  },

  "website-playground": {
    icon: "💻",
    title: "Website Playground",
    subtitle:
      "Write HTML, CSS and JavaScript with live preview.",
    type: "playground",
  },
};

/* =========================================================
   MAIN PAGE
========================================================= */

function UtilityTool() {
  const { toolId } = useParams();

  const currentTool = toolInfo[toolId];

  if (!currentTool) {
    return (
      <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-5">
        <div className="pointer-events-none absolute inset-0 bg-[#020711]" />

        <div className="relative z-10 text-center">
          <div className="text-6xl">
            🧰
          </div>

          <h1 className="mt-5 text-4xl font-black text-white">
            Tool Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            This utility is not available.
          </p>

          <Link
            to="/utility-hub"
            className="
              mt-7
              inline-flex
              items-center
              rounded-xl
              border
              border-cyan-400/40
              bg-cyan-400/[0.08]
              px-5
              py-3
              text-sm
              font-black
              text-cyan-300
              transition
              hover:bg-cyan-400/[0.14]
            "
          >
            ← Back to Utility Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        px-4
        py-10
        sm:px-6
        lg:px-8
      "
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 bg-[#020711]" />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-24
          h-[450px]
          w-[450px]
          rounded-full
          bg-cyan-500/[0.08]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-32
          h-[520px]
          w-[520px]
          rounded-full
          bg-purple-500/[0.09]
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-250px]
          left-1/2
          h-[500px]
          w-[800px]
          -translate-x-1/2
          rounded-full
          bg-blue-500/[0.06]
          blur-[150px]
        "
      />

      {/* CONTENT */}

      <div className="relative z-10 mx-auto max-w-[1350px]">

        {/* BACK BUTTON */}

        <Link
          to="/utility-hub"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/[0.035]
            px-4
            py-2.5
            text-xs
            font-black
            text-gray-300
            transition
            hover:border-cyan-400/40
            hover:text-white
          "
        >
          ← Utility Hub
        </Link>

        {/* HEADER */}

        <div className="mt-8 flex items-start gap-4">

          <div
            className="
              flex
              h-16
              w-16
              shrink-0
              items-center
              justify-center
              rounded-[20px]
              border
              border-cyan-400/25
              bg-gradient-to-br
              from-cyan-400/[0.16]
              to-purple-500/[0.12]
              text-3xl
              shadow-[0_0_35px_rgba(34,211,238,.08)]
            "
          >
            {currentTool.icon}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
              AI Future Tamil Utility Hub
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              {currentTool.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
              {currentTool.subtitle}
            </p>
          </div>

        </div>

        {/* TOOL */}

        <div className="mt-10">
          <ToolRenderer type={currentTool.type} />
        </div>

      </div>
    </main>
  );
}

/* =========================================================
   TOOL RENDERER
========================================================= */

function ToolRenderer({ type }) {
  switch (type) {
    case "resume":
      return <ResumeBuilder />;

    case "youtube":
      return <YouTubeStudio />;

    case "thumbnail":
      return <ThumbnailLab />;

    case "links":
      return <LinkHub />;

    case "file":
      return <FileUtility />;

    case "brand":
      return <BrandKit />;

    case "social":
      return <SocialPreview />;

    case "calculator":
      return <FreelancerCalculator />;

    case "brief":
      return <ProjectBrief />;

    case "playground":
      return <WebsitePlayground />;

    default:
      return null;
  }
}

/* =========================================================
   COMMON PANEL
========================================================= */

function Panel({ title, subtitle, children }) {
  return (
    <section
      className="
        rounded-[26px]
        border
        border-white/[0.09]
        bg-[#07101d]/82
        p-5
        shadow-[0_25px_70px_rgba(0,0,0,.25)]
        backdrop-blur-xl
        sm:p-6
      "
    >
      {title && (
        <div className="mb-6">

          <h2 className="text-xl font-black text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-gray-500">
              {subtitle}
            </p>
          )}

        </div>
      )}

      {children}
    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-bold text-gray-400">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-black/25
          px-4
          py-3
          text-sm
          text-white
          outline-none
          transition
          placeholder:text-gray-600
          focus:border-cyan-400/50
          focus:shadow-[0_0_20px_rgba(34,211,238,.05)]
        "
      />

    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 5,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-bold text-gray-400">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-white/10
          bg-black/25
          px-4
          py-3
          text-sm
          leading-6
          text-white
          outline-none
          transition
          placeholder:text-gray-600
          focus:border-cyan-400/50
        "
      />

    </label>
  );
}

/* =========================================================
   COPY BUTTON
========================================================= */

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="
        rounded-xl
        border
        border-cyan-400/30
        bg-cyan-400/[0.08]
        px-5
        py-2.5
        text-xs
        font-black
        text-cyan-300
        transition
        hover:border-cyan-300/60
        hover:bg-cyan-400/[0.14]
      "
    >
      {copied ? "✅ Copied" : "📋 Copy"}
    </button>
  );
}

/* =========================================================
   1. RESUME BUILDER
========================================================= */

function ResumeBuilder() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");

  const summary = useMemo(() => {
    const n = name || "Your Name";

    const r =
      role ||
      "Professional";

    const e =
      experience ||
      "professional";

    const s =
      skills ||
      "relevant professional skills";

    return `${n} is a ${r} with ${e} experience. Skilled in ${s}.${about ? ` ${about}` : ""}`;
  }, [
    name,
    role,
    experience,
    skills,
    about,
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <Panel
        title="Your Information"
        subtitle="Fill your details to create a professional summary."
      >
        <div className="space-y-4">

          <Input
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Example: Dinesh Kumar.N"
          />

          <Input
            label="Professional Role"
            value={role}
            onChange={setRole}
            placeholder="Example: E-learning Developer"
          />

          <Input
            label="Experience"
            value={experience}
            onChange={setExperience}
            placeholder="Example: 3.5 years"
          />

          <Input
            label="Skills"
            value={skills}
            onChange={setSkills}
            placeholder="Storyline 360, Photoshop, HTML, CSS..."
          />

          <TextArea
            label="Achievements / Extra Information"
            value={about}
            onChange={setAbout}
            placeholder="Write your strengths and achievements..."
          />

        </div>
      </Panel>

      <Panel
        title="Resume Preview"
        subtitle="Your professional summary updates automatically."
      >

        <div
          className="
            rounded-[22px]
            border
            border-cyan-400/20
            bg-gradient-to-br
            from-cyan-500/[0.06]
            to-purple-500/[0.07]
            p-6
          "
        >

          <h3 className="text-2xl font-black text-white">
            {name || "Your Name"}
          </h3>

          <p className="mt-1 font-bold text-cyan-300">
            {role || "Professional Role"}
          </p>

          <div className="my-5 h-px bg-white/10" />

          <p className="text-sm leading-7 text-gray-300">
            {summary}
          </p>

          {skills && (
            <>
              <p className="mt-6 text-xs font-black uppercase tracking-wider text-purple-300">
                Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.04]
                        px-3
                        py-1.5
                        text-xs
                        text-gray-300
                      "
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </>
          )}

          <div className="mt-6">
            <CopyButton text={summary} />
          </div>

        </div>

      </Panel>

    </div>
  );
}

/* =========================================================
   2. YOUTUBE CONTENT STUDIO
========================================================= */

function YouTubeStudio() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginners");

  const subject =
    topic.trim() ||
    "Your Video Topic";

  const result = useMemo(() => {
    return {
      title:
        `${subject} - Complete Beginner Guide`,

      thumbnail:
        `${subject.toUpperCase()} MADE EASY!`,

      hook:
        `Do you want to understand ${subject} without confusion? In this video, I'll explain it in the easiest and most practical way.`,

      intro:
        `Welcome to AI Future Tamil. Today we are going to learn about ${subject} step by step.`,

      description:
        `Learn ${subject} step by step. This video is designed for ${audience.toLowerCase()} and covers important practical concepts in a simple way.`,

      tags:
        `${subject}, ${subject} Tamil, ${subject} tutorial, beginner guide, AI Future Tamil`,

      cta:
        "If this video helped you, like the video, subscribe to the channel and share it with your friends.",
    };
  }, [
    subject,
    audience,
  ]);

  const copyText = `
SEO TITLE:
${result.title}

THUMBNAIL TEXT:
${result.thumbnail}

HOOK:
${result.hook}

INTRO:
${result.intro}

DESCRIPTION:
${result.description}

TAGS:
${result.tags}

CTA:
${result.cta}
`.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">

      <Panel
        title="Video Idea"
        subtitle="Enter a topic and select your target audience."
      >

        <div className="space-y-4">

          <Input
            label="Video Topic"
            value={topic}
            onChange={setTopic}
            placeholder="Example: ChatGPT for Beginners"
          />

          <label className="block">

            <span className="mb-2 block text-xs font-bold text-gray-400">
              Target Audience
            </span>

            <select
              value={audience}
              onChange={(event) =>
                setAudience(
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#050b15]
                px-4
                py-3
                text-sm
                text-white
                outline-none
                focus:border-cyan-400/50
              "
            >
              <option>
                Beginners
              </option>

              <option>
                Students
              </option>

              <option>
                Content Creators
              </option>

              <option>
                Professionals
              </option>

              <option>
                Freelancers
              </option>
            </select>

          </label>

        </div>

      </Panel>

      <Panel
        title="Generated Content Plan"
        subtitle="Ready-made structure for your next YouTube video."
      >

        <div className="space-y-4">

          <ResultCard
            title="SEO Title"
            value={result.title}
          />

          <ResultCard
            title="Thumbnail Text"
            value={result.thumbnail}
          />

          <ResultCard
            title="Opening Hook"
            value={result.hook}
          />

          <ResultCard
            title="Intro"
            value={result.intro}
          />

          <ResultCard
            title="Description"
            value={result.description}
          />

          <ResultCard
            title="Tags"
            value={result.tags}
          />

          <ResultCard
            title="CTA"
            value={result.cta}
          />

          <div className="pt-2">
            <CopyButton text={copyText} />
          </div>

        </div>

      </Panel>

    </div>
  );
}

function ResultCard({
  title,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.08]
        bg-black/20
        p-4
      "
    >

      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-300">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-300">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   3. THUMBNAIL LAB
========================================================= */

function ThumbnailLab() {
  const [image, setImage] =
    useState("");

  const [headline, setHeadline] =
    useState(
      "YOUR BIG IDEA"
    );

  function handleFile(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setImage(
        reader.result
      );
    };

    reader.readAsDataURL(
      file
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">

      <Panel
        title="Thumbnail Settings"
        subtitle="Upload your thumbnail and test text readability."
      >

        <div className="space-y-5">

          <Input
            label="Thumbnail Text"
            value={headline}
            onChange={setHeadline}
            placeholder="YOUR BIG IDEA"
          />

          <label className="block">

            <span className="mb-2 block text-xs font-bold text-gray-400">
              Upload Image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="
                block
                w-full
                rounded-xl
                border
                border-dashed
                border-cyan-400/30
                bg-cyan-400/[0.04]
                p-5
                text-xs
                text-gray-400
              "
            />

          </label>

          <div
            className="
              rounded-xl
              border
              border-yellow-400/20
              bg-yellow-400/[0.05]
              p-4
              text-xs
              leading-6
              text-gray-400
            "
          >
            💡 Keep thumbnail text short.
            Use strong contrast and one clear
            visual subject.
          </div>

        </div>

      </Panel>

      <Panel
        title="YouTube Thumbnail Preview"
        subtitle="16:9 YouTube thumbnail preview."
      >

        <div
          className="
            relative
            aspect-video
            overflow-hidden
            rounded-[22px]
            border
            border-white/10
            bg-gradient-to-br
            from-blue-950
            via-purple-950
            to-black
          "
        >

          {image && (
            <img
              src={image}
              alt="Thumbnail"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
            />
          )}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/80
              via-black/25
              to-transparent
            "
          />

          <div
            className="
              absolute
              bottom-[10%]
              left-[5%]
              right-[5%]
            "
          >
            <h3
              className="
                max-w-[80%]
                text-3xl
                font-black
                leading-[0.95]
                text-white
                drop-shadow-[0_5px_12px_rgba(0,0,0,.95)]
                sm:text-5xl
                lg:text-6xl
              "
            >
              {headline ||
                "YOUR BIG IDEA"}
            </h3>
          </div>

          <span
            className="
              absolute
              bottom-3
              right-3
              rounded-md
              bg-black/85
              px-2
              py-1
              text-xs
              font-black
              text-white
            "
          >
            08:42
          </span>

        </div>

      </Panel>

    </div>
  );
}

/* =========================================================
   4. CREATOR LINK HUB
========================================================= */

function LinkHub() {
  const [name, setName] =
    useState("Your Name");

  const [bio, setBio] =
    useState(
      "Creator • Designer • AI Learner"
    );

  const [youtube, setYoutube] =
    useState("");

  const [instagram, setInstagram] =
    useState("");

  const [portfolio, setPortfolio] =
    useState("");

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <Panel
        title="Profile Details"
        subtitle="Build your creator profile."
      >

        <div className="space-y-4">

          <Input
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Your Name"
          />

          <Input
            label="Bio"
            value={bio}
            onChange={setBio}
            placeholder="Creator • Designer"
          />

          <Input
            label="YouTube URL"
            value={youtube}
            onChange={setYoutube}
            placeholder="https://youtube.com/@..."
          />

          <Input
            label="Instagram URL"
            value={instagram}
            onChange={setInstagram}
            placeholder="https://instagram.com/..."
          />

          <Input
            label="Portfolio URL"
            value={portfolio}
            onChange={setPortfolio}
            placeholder="https://yourwebsite.com"
          />

        </div>

      </Panel>

      <Panel
        title="Live Creator Page"
        subtitle="Preview your mini link profile."
      >

        <div
          className="
            mx-auto
            max-w-[380px]
            rounded-[34px]
            border
            border-purple-400/25
            bg-gradient-to-b
            from-purple-500/[0.13]
            via-blue-500/[0.06]
            to-black/20
            p-7
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              border
              border-cyan-400/50
              bg-cyan-400/[0.10]
              text-4xl
              shadow-[0_0_30px_rgba(34,211,238,.12)]
            "
          >
            👤
          </div>

          <h3 className="mt-5 text-2xl font-black text-white">
            {name ||
              "Your Name"}
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            {bio}
          </p>

          <div className="mt-7 space-y-3">

            {youtube && (
              <PreviewLink
                icon="▶️"
                label="YouTube"
                url={youtube}
              />
            )}

            {instagram && (
              <PreviewLink
                icon="📸"
                label="Instagram"
                url={instagram}
              />
            )}

            {portfolio && (
              <PreviewLink
                icon="🌐"
                label="Portfolio"
                url={portfolio}
              />
            )}

            {!youtube &&
              !instagram &&
              !portfolio && (
                <p className="py-5 text-xs text-gray-600">
                  Add your links to
                  preview buttons.
                </p>
              )}

          </div>

        </div>

      </Panel>

    </div>
  );
}

function PreviewLink({
  icon,
  label,
  url,
}) {
  return (
    <a
      href={
        url.startsWith("http")
          ? url
          : `https://${url}`
      }
      target="_blank"
      rel="noreferrer"
      className="
        block
        rounded-xl
        border
        border-white/10
        bg-white/[0.05]
        px-4
        py-3
        text-sm
        font-black
        text-white
        transition
        hover:border-cyan-400/40
        hover:bg-cyan-400/[0.07]
      "
    >
      {icon} {label}
    </a>
  );
}

/* =========================================================
   5. FILE UTILITY
========================================================= */

function FileUtility() {
  const [info, setInfo] =
    useState(null);

  function handleFile(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setInfo(null);
      return;
    }

    const cleanName =
      file.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(
          /[^a-z0-9._-]/g,
          ""
        );

    setInfo({
      originalName:
        file.name,

      type:
        file.type ||
        "Unknown",

      sizeKB:
        (
          file.size /
          1024
        ).toFixed(2),

      sizeMB:
        (
          file.size /
          1024 /
          1024
        ).toFixed(2),

      cleanName,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <Panel
        title="Select File"
        subtitle="The file stays inside your browser."
      >

        <input
          type="file"
          onChange={handleFile}
          className="
            block
            w-full
            cursor-pointer
            rounded-[20px]
            border
            border-dashed
            border-cyan-400/30
            bg-cyan-400/[0.04]
            p-10
            text-sm
            text-gray-400
          "
        />

        <p className="mt-4 text-xs leading-6 text-gray-500">
          Select any file to view basic
          information and generate a clean
          filename.
        </p>

      </Panel>

      <Panel
        title="File Information"
        subtitle="Instant file inspection."
      >

        {info ? (
          <div className="space-y-3">

            <FileRow
              label="Original Name"
              value={info.originalName}
            />

            <FileRow
              label="File Type"
              value={info.type}
            />

            <FileRow
              label="Size"
              value={`${info.sizeKB} KB / ${info.sizeMB} MB`}
            />

            <FileRow
              label="Clean Filename"
              value={info.cleanName}
            />

            <div className="pt-3">
              <CopyButton
                text={info.cleanName}
              />
            </div>

          </div>
        ) : (
          <div className="flex min-h-[250px] items-center justify-center text-center">

            <div>
              <p className="text-5xl">
                📁
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Select a file to view details.
              </p>
            </div>

          </div>
        )}

      </Panel>

    </div>
  );
}

function FileRow({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.08]
        bg-black/20
        p-4
      "
    >

      <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   6. BRAND KIT
========================================================= */

function BrandKit() {
  const [brand, setBrand] =
    useState(
      "AI Future Tamil"
    );

  const [primary, setPrimary] =
    useState("#22d3ee");

  const [secondary, setSecondary] =
    useState("#a855f7");

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <Panel
        title="Brand Settings"
        subtitle="Choose your brand name and colors."
      >

        <div className="space-y-5">

          <Input
            label="Brand Name"
            value={brand}
            onChange={setBrand}
            placeholder="Your Brand"
          />

          <ColorPicker
            label="Primary Color"
            value={primary}
            onChange={setPrimary}
          />

          <ColorPicker
            label="Secondary Color"
            value={secondary}
            onChange={setSecondary}
          />

        </div>

      </Panel>

      <Panel
        title="Brand Preview"
        subtitle="Live visual identity preview."
      >

        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-white/10
            p-7
          "
          style={{
            background:
              `radial-gradient(circle at top right, ${secondary}38, transparent 42%), radial-gradient(circle at bottom left, ${primary}20, transparent 42%), #050914`,
          }}
        >

          <p
            className="text-4xl font-black tracking-tight"
            style={{
              background:
                `linear-gradient(90deg, ${primary}, ${secondary})`,

              WebkitBackgroundClip:
                "text",

              color:
                "transparent",
            }}
          >
            {brand ||
              "Your Brand"}
          </p>

          <p className="mt-3 text-sm text-gray-400">
            Create • Learn • Build • Grow
          </p>

          <button
            type="button"
            className="mt-8 rounded-xl px-6 py-3 text-sm font-black text-black"
            style={{
              background:
                `linear-gradient(90deg, ${primary}, ${secondary})`,
            }}
          >
            Explore Now →
          </button>

          <div className="mt-8 grid grid-cols-4 gap-3">

            <ColorBox
              color={primary}
            />

            <ColorBox
              color={secondary}
            />

            <ColorBox
              color="#050914"
            />

            <ColorBox
              color="#ffffff"
            />

          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-[10px] text-gray-500">

            <span>
              {primary}
            </span>

            <span>
              {secondary}
            </span>

          </div>

        </div>

      </Panel>

    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}) {
  return (
    <label
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-white/10
        bg-black/20
        p-4
      "
    >

      <div>
        <p className="text-sm font-bold text-gray-300">
          {label}
        </p>

        <p className="mt-1 text-xs text-gray-600">
          {value}
        </p>
      </div>

      <input
        type="color"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
      />

    </label>
  );
}

function ColorBox({
  color,
}) {
  return (
    <div
      className="
        h-16
        rounded-xl
        border
        border-white/10
      "
      style={{
        backgroundColor:
          color,
      }}
    />
  );
}

/* =========================================================
   7. SOCIAL POST PREVIEW
========================================================= */

function SocialPreview() {
  const [name, setName] =
    useState(
      "AI Future Tamil"
    );

  const [caption, setCaption] =
    useState(
      "Learn something new today 🚀"
    );

  const [image, setImage] =
    useState("");

  function handleImage(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setImage(
        reader.result
      );
    };

    reader.readAsDataURL(
      file
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">

      <Panel
        title="Post Content"
        subtitle="Prepare your social media content."
      >

        <div className="space-y-4">

          <Input
            label="Profile Name"
            value={name}
            onChange={setName}
          />

          <TextArea
            label="Caption"
            value={caption}
            onChange={setCaption}
          />

          <label className="block">

            <span className="mb-2 block text-xs font-bold text-gray-400">
              Post Image
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="
                block
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/20
                p-3
                text-xs
                text-gray-400
              "
            />

          </label>

          <div
            className="
              rounded-xl
              border
              border-white/[0.08]
              bg-black/20
              p-4
              text-xs
              text-gray-500
            "
          >
            Character count:{" "}
            <strong className="text-cyan-300">
              {caption.length}
            </strong>
          </div>

        </div>

      </Panel>

      <Panel
        title="Social Preview"
        subtitle="See how your post may appear."
      >

        <div
          className="
            mx-auto
            max-w-[500px]
            overflow-hidden
            rounded-[26px]
            border
            border-white/10
            bg-black/30
          "
        >

          <div className="flex items-center gap-3 p-4">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-cyan-400
                to-purple-500
                font-black
                text-black
              "
            >
              {name
                ?.charAt(0)
                ?.toUpperCase() ||
                "A"}
            </div>

            <div>
              <p className="text-sm font-black text-white">
                {name}
              </p>

              <p className="text-[10px] text-gray-500">
                Just now • Public
              </p>
            </div>

          </div>

          <div
            className="
              relative
              flex
              aspect-square
              items-center
              justify-center
              overflow-hidden
              bg-gradient-to-br
              from-[#081b31]
              via-[#151050]
              to-[#38105b]
            "
          >

            {image ? (
              <img
                src={image}
                alt="Social preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <p
                className="
                  bg-gradient-to-r
                  from-cyan-300
                  to-purple-400
                  bg-clip-text
                  text-center
                  text-4xl
                  font-black
                  text-transparent
                "
              >
                CREATE
                <br />
                SOMETHING
                <br />
                AMAZING.
              </p>
            )}

          </div>

          <div className="p-4">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex gap-5 text-xl">
                <span>
                  ♡
                </span>

                <span>
                  💬
                </span>

                <span>
                  ✈️
                </span>
              </div>

              <span className="text-xl">
                🔖
              </span>

            </div>

            <p className="text-sm leading-6 text-gray-300">

              <strong className="text-white">
                {name}{" "}
              </strong>

              {caption}

            </p>

          </div>

        </div>

      </Panel>

    </div>
  );
}

/* =========================================================
   8. FREELANCER CALCULATOR
========================================================= */

function FreelancerCalculator() {
  const [hours, setHours] =
    useState(10);

  const [rate, setRate] =
    useState(500);

  const [revisions, setRevisions] =
    useState(1);

  const [urgency, setUrgency] =
    useState(false);

  const [complexity, setComplexity] =
    useState("normal");

  const result = useMemo(() => {
    const workCost =
      Number(hours || 0) *
      Number(rate || 0);

    const revisionCost =
      Number(revisions || 0) *
      Number(rate || 0);

    let multiplier = 1;

    if (
      complexity ===
      "medium"
    ) {
      multiplier =
        1.15;
    }

    if (
      complexity ===
      "high"
    ) {
      multiplier =
        1.35;
    }

    const complexityCost =
      (
        workCost +
        revisionCost
      ) *
      (multiplier - 1);

    const beforeUrgency =
      workCost +
      revisionCost +
      complexityCost;

    const urgencyCost =
      urgency
        ? beforeUrgency *
          0.25
        : 0;

    const total =
      beforeUrgency +
      urgencyCost;

    return {
      workCost,
      revisionCost,
      complexityCost,
      urgencyCost,
      total,
    };
  }, [
    hours,
    rate,
    revisions,
    urgency,
    complexity,
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <Panel
        title="Project Details"
        subtitle="Enter your estimated freelance project information."
      >

        <div className="space-y-4">

          <NumberInput
            label="Estimated Hours"
            value={hours}
            onChange={setHours}
          />

          <NumberInput
            label="Hourly Rate ₹"
            value={rate}
            onChange={setRate}
          />

          <NumberInput
            label="Extra Revisions"
            value={revisions}
            onChange={setRevisions}
          />

          <label className="block">

            <span className="mb-2 block text-xs font-bold text-gray-400">
              Project Complexity
            </span>

            <select
              value={complexity}
              onChange={(event) =>
                setComplexity(
                  event.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#050b15]
                px-4
                py-3
                text-sm
                text-white
                outline-none
                focus:border-cyan-400/50
              "
            >
              <option value="normal">
                Normal
              </option>

              <option value="medium">
                Medium (+15%)
              </option>

              <option value="high">
                High (+35%)
              </option>
            </select>

          </label>

          <label
            className="
              flex
              cursor-pointer
              items-center
              justify-between
              rounded-xl
              border
              border-white/10
              bg-black/20
              p-4
            "
          >
            <span className="text-sm font-bold text-gray-300">
              ⚡ Urgent Delivery
              (+25%)
            </span>

            <input
              type="checkbox"
              checked={urgency}
              onChange={(event) =>
                setUrgency(
                  event.target.checked
                )
              }
              className="h-5 w-5"
            />

          </label>

        </div>

      </Panel>

      <Panel
        title="Estimated Quote"
        subtitle="Suggested calculation based on your inputs."
      >

        <div
          className="
            rounded-[22px]
            border
            border-cyan-400/20
            bg-cyan-400/[0.04]
            p-6
          "
        >

          <PriceRow
            label="Work Cost"
            value={result.workCost}
          />

          <PriceRow
            label="Revision Cost"
            value={result.revisionCost}
          />

          <PriceRow
            label="Complexity Fee"
            value={result.complexityCost}
          />

          <PriceRow
            label="Urgency Fee"
            value={result.urgencyCost}
          />

          <div className="my-5 h-px bg-white/10" />

          <div className="flex items-end justify-between gap-5">

            <div>
              <p className="text-xs font-bold text-gray-500">
                SUGGESTED TOTAL
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Estimated quote
              </p>
            </div>

            <p
              className="
                bg-gradient-to-r
                from-cyan-300
                to-purple-400
                bg-clip-text
                text-3xl
                font-black
                text-transparent
                sm:text-4xl
              "
            >
              ₹
              {Math.round(
                result.total
              ).toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

        </div>

      </Panel>

    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">

      <span className="mb-2 block text-xs font-bold text-gray-400">
        {label}
      </span>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-black/25
          px-4
          py-3
          text-sm
          text-white
          outline-none
          focus:border-cyan-400/50
        "
      />

    </label>
  );
}

function PriceRow({
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/[0.07]
        py-3
      "
    >

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <strong className="text-white">
        ₹
        {Math.round(
          value
        ).toLocaleString(
          "en-IN"
        )}
      </strong>

    </div>
  );
}

/* =========================================================
   9. PROJECT BRIEF
========================================================= */

function ProjectBrief() {
  const [project, setProject] =
    useState("");

  const [client, setClient] =
    useState("");

  const [goal, setGoal] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const [deliverables, setDeliverables] =
    useState("");

  const brief = `
PROJECT BRIEF

PROJECT NAME
${project || "Not specified"}

CLIENT
${client || "Not specified"}

MAIN GOAL
${goal || "Not specified"}

DEADLINE
${deadline || "Not specified"}

DELIVERABLES
${deliverables || "Not specified"}

IMPORTANT CLIENT QUESTIONS

1. Who is the target audience?
2. What is the main business goal?
3. Do you already have brand guidelines?
4. What content and assets will be provided?
5. Are there any reference websites or designs?
6. How many revision rounds are required?
7. What is the final delivery format?
8. Who gives final project approval?
`.trim();

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <Panel
        title="Project Information"
        subtitle="Enter basic project requirements."
      >

        <div className="space-y-4">

          <Input
            label="Project Name"
            value={project}
            onChange={setProject}
            placeholder="Example: Company Website"
          />

          <Input
            label="Client Name"
            value={client}
            onChange={setClient}
            placeholder="Client / Company"
          />

          <TextArea
            label="Main Goal"
            value={goal}
            onChange={setGoal}
            placeholder="What should this project achieve?"
          />

          <Input
            label="Deadline"
            value={deadline}
            onChange={setDeadline}
            placeholder="Example: 15 September 2026"
          />

          <TextArea
            label="Deliverables"
            value={deliverables}
            onChange={setDeliverables}
            placeholder="Website, source files, logo..."
          />

        </div>

      </Panel>

      <Panel
        title="Generated Project Brief"
        subtitle="Copy and send this brief to your client or team."
      >

        <pre
          className="
            whitespace-pre-wrap
            rounded-[20px]
            border
            border-white/[0.08]
            bg-black/25
            p-5
            font-sans
            text-sm
            leading-7
            text-gray-300
          "
        >
          {brief}
        </pre>

        <div className="mt-4">
          <CopyButton
            text={brief}
          />
        </div>

      </Panel>

    </div>
  );
}

/* =========================================================
   10. WEBSITE PLAYGROUND
========================================================= */

function WebsitePlayground() {
  const [html, setHtml] =
    useState(
`<div class="card">
  <h1>Hello 👋</h1>
  <p>Welcome to AI Future Tamil.</p>
  <button id="btn">Explore</button>
</div>`
    );

  const [css, setCss] =
    useState(
`body {
  margin: 0;
  padding: 40px;
  font-family: Arial, sans-serif;
  background: #050914;
  color: white;
}

.card {
  max-width: 420px;
  padding: 30px;
  border: 1px solid #22d3ee;
  border-radius: 20px;
  background: #08111f;
  box-shadow: 0 0 30px rgba(34, 211, 238, 0.15);
}

h1 {
  color: #22d3ee;
}

button {
  padding: 12px 20px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #22d3ee, #a855f7);
  color: #020617;
  font-weight: bold;
  cursor: pointer;
}`
    );

  const [js, setJs] =
    useState(
`const button = document.getElementById("btn");

button?.addEventListener("click", () => {
  alert("Welcome to AI Future Tamil 🚀");
});`
    );

  const preview =
    useMemo(() => {
      return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

${css}

</style>

</head>

<body>

${html}

<script>

try {

${js}

} catch (error) {

console.error(error);

}

</script>

</body>

</html>
`;
    }, [
      html,
      css,
      js,
    ]);

  return (
    <div className="space-y-6">

      <div className="grid gap-4 xl:grid-cols-3">

        <CodeEditor
          label="HTML"
          value={html}
          onChange={setHtml}
        />

        <CodeEditor
          label="CSS"
          value={css}
          onChange={setCss}
        />

        <CodeEditor
          label="JavaScript"
          value={js}
          onChange={setJs}
        />

      </div>

      <Panel
        title="Live Preview"
        subtitle="Your code appears here instantly."
      >

        <iframe
          title="Website Playground Preview"
          srcDoc={preview}
          sandbox="allow-scripts allow-modals"
          className="
            h-[520px]
            w-full
            rounded-[20px]
            border
            border-white/10
            bg-white
          "
        />

      </Panel>

    </div>
  );
}

function CodeEditor({
  label,
  value,
  onChange,
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.09]
        bg-[#07101d]
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/[0.07]
          px-4
          py-3
        "
      >

        <span className="text-xs font-black text-cyan-300">
          {label}
        </span>

        <span className="text-[10px] text-gray-600">
          CODE
        </span>

      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        spellCheck="false"
        className="
          h-[330px]
          w-full
          resize-none
          bg-black/20
          p-4
          font-mono
          text-xs
          leading-6
          text-gray-300
          outline-none
        "
      />

    </div>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default UtilityTool;