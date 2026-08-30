import { Link } from "react-router-dom";

const tools = [
  {
    id: "resume-builder",
    icon: "📄",
    number: "01",
    title: "Resume & Portfolio Builder",
    description:
      "Create professional resumes, portfolio bios, skill summaries and project descriptions.",
    tag: "Career",
    color: "#14d8f4",
    accent: "#0891b2",
    bg: "linear-gradient(145deg, rgba(6,78,95,.52), rgba(3,17,28,.98) 62%)",
  },
  {
    id: "youtube-studio",
    icon: "🎥",
    number: "02",
    title: "YouTube Content Studio",
    description:
      "Plan titles, hooks, scripts, descriptions, tags, CTAs and complete video ideas.",
    tag: "Creator",
    color: "#a855f7",
    accent: "#6d28d9",
    bg: "linear-gradient(145deg, rgba(67,27,102,.58), rgba(20,10,35,.98) 62%)",
  },
  {
    id: "thumbnail-lab",
    icon: "🖼️",
    number: "03",
    title: "Thumbnail Preview Lab",
    description:
      "Preview thumbnails, check readability and test layouts before publishing.",
    tag: "YouTube",
    color: "#f94f87",
    accent: "#be185d",
    bg: "linear-gradient(145deg, rgba(104,19,52,.58), rgba(35,7,20,.98) 62%)",
  },
  {
    id: "link-hub",
    icon: "🔗",
    number: "04",
    title: "Creator Link Hub",
    description:
      "Build your own creator profile with social links, portfolio and contact buttons.",
    tag: "Brand",
    color: "#2f80ff",
    accent: "#1d4ed8",
    bg: "linear-gradient(145deg, rgba(16,56,120,.60), rgba(5,19,46,.98) 62%)",
  },
  {
    id: "file-utility",
    icon: "🛠️",
    number: "05",
    title: "File Utility Center",
    description:
      "Resize images, inspect files, rename assets and prepare content for publishing.",
    tag: "Utility",
    color: "#8bdc3c",
    accent: "#4d7c0f",
    bg: "linear-gradient(145deg, rgba(32,83,28,.58), rgba(6,29,14,.98) 62%)",
  },
  {
    id: "brand-kit",
    icon: "🎨",
    number: "06",
    title: "Brand Kit Generator",
    description:
      "Build color palettes, typography combinations and visual brand styles.",
    tag: "Design",
    color: "#ff8a1f",
    accent: "#c2410c",
    bg: "linear-gradient(145deg, rgba(118,49,8,.60), rgba(40,17,5,.98) 62%)",
  },
  {
    id: "social-preview",
    icon: "📱",
    number: "07",
    title: "Social Post Preview",
    description:
      "Preview how your content can look across popular social media layouts.",
    tag: "Social",
    color: "#ec4f9b",
    accent: "#a21caf",
    bg: "linear-gradient(145deg, rgba(107,23,73,.60), rgba(37,8,26,.98) 62%)",
  },
  {
    id: "freelancer-calculator",
    icon: "💰",
    number: "08",
    title: "Freelancer Price Calculator",
    description:
      "Calculate estimated freelance pricing based on hours, complexity and revisions.",
    tag: "Business",
    color: "#f4c414",
    accent: "#a16207",
    bg: "linear-gradient(145deg, rgba(112,78,3,.58), rgba(35,26,2,.98) 62%)",
  },
  {
    id: "project-brief",
    icon: "📋",
    number: "09",
    title: "Project Brief Generator",
    description:
      "Create clear project requirements, deliverables, timelines and client questions.",
    tag: "Productivity",
    color: "#20bdf2",
    accent: "#0369a1",
    bg: "linear-gradient(145deg, rgba(8,72,105,.60), rgba(4,25,40,.98) 62%)",
  },
  {
    id: "website-playground",
    icon: "💻",
    number: "10",
    title: "Website Playground",
    description:
      "Experiment with HTML, CSS and JavaScript and instantly preview your result.",
    tag: "Coding",
    color: "#ff4b45",
    accent: "#b91c1c",
    bg: "linear-gradient(145deg, rgba(102,22,26,.60), rgba(35,7,10,.98) 62%)",
  },
];

function UtilityHub() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02060d] px-4 py-12 sm:px-6 lg:px-8">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[180px] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
        <div className="absolute right-[-100px] top-[100px] h-[420px] w-[420px] rounded-full bg-purple-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1550px]">
        {/* HEADER */}
        <div className="mx-auto max-w-[850px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            🧰 AI Future Tamil Utility Hub
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Create.
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {" "}
              Design.
            </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              Build.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[720px] text-sm leading-7 text-gray-400 sm:text-base">
            Powerful creator, career, design, freelance and development utilities
            — all inside one AI Future Tamil workspace.
          </p>
        </div>

        {/* STATS */}
        <div className="mx-auto mt-10 grid max-w-[900px] grid-cols-2 overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.025] md:grid-cols-4">
          <MiniStat value="10" label="Utilities" />
          <MiniStat value="5+" label="Categories" />
          <MiniStat value="24/7" label="Access" />
          <MiniStat value="∞" label="Ideas" />
        </div>

        {/* CARDS */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={`/utility-hub/${tool.id}`}
              className="
                relative
                overflow-hidden
                rounded-[26px]
                border
                p-5
                transition-colors
                duration-200
              "
              style={{
                borderColor: `${tool.color}55`,
                background: tool.bg,
              }}
            >
              {/* NUMBER */}
              <div
                className="text-[28px] font-black"
                style={{ color: tool.color }}
              >
                {tool.number}
              </div>

              {/* DECOR DOTS */}
              <div className="absolute right-5 top-5 grid grid-cols-3 gap-1.5 opacity-70">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: tool.color }}
                  />
                ))}
              </div>

              {/* ICON */}
              <div
                className="
                  mx-auto
                  mt-4
                  flex
                  h-[96px]
                  w-[96px]
                  items-center
                  justify-center
                  rounded-[28px]
                  border
                  text-[46px]
                "
                style={{
                  borderColor: `${tool.color}55`,
                  background: `linear-gradient(145deg, ${tool.color}45, ${tool.accent}45)`,
                }}
              >
                {tool.icon}
              </div>

              {/* TITLE */}
              <h2 className="mt-5 min-h-[58px] text-center text-[19px] font-black leading-tight text-white">
                {tool.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-4 min-h-[100px] text-center text-sm leading-6 text-gray-300">
                {tool.description}
              </p>

              {/* TAG */}
              <div className="mt-4 flex justify-center">
                <span
                  className="
                    rounded-full
                    border
                    px-4
                    py-1.5
                    text-xs
                    font-bold
                  "
                  style={{
                    color: tool.color,
                    borderColor: `${tool.color}66`,
                    backgroundColor: `${tool.color}18`,
                  }}
                >
                  {tool.tag}
                </span>
              </div>

              {/* DIVIDER */}
              <div
                className="mt-5 h-px w-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tool.color}55, transparent)`,
                }}
              />

              {/* OPEN TOOL */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <span
                  className="text-sm font-black"
                  style={{ color: tool.color }}
                >
                  Open Tool
                </span>

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-sm
                    font-black
                  "
                  style={{
                    color: tool.color,
                    borderColor: `${tool.color}66`,
                    backgroundColor: `${tool.color}10`,
                  }}
                >
                  →
                </span>
              </div>

              {/* CORNER SHAPE */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  right-0
                  h-[95px]
                  w-[95px]
                  opacity-40
                "
                style={{
                  background: `linear-gradient(135deg, transparent 45%, ${tool.color}35)`,
                }}
              />
            </Link>
          ))}
        </div>

        {/* BOTTOM TEXT */}
        <div className="mt-14 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-7 text-center">
          <p className="text-xl font-black text-white">
            One Hub. Multiple Possibilities.
          </p>

          <p className="mx-auto mt-2 max-w-[650px] text-sm leading-6 text-gray-400">
            Use these utilities to create, design, calculate, plan and build
            everything from one place.
          </p>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center border-r border-white/[0.07] p-4 text-center last:border-r-0">
      <p className="text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

export default UtilityHub;