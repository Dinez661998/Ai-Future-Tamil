import { useNavigate } from "react-router-dom";

const actions = [
  {
    label: "AI Tools",
    icon: "🤖",
    path: "/ai-tools",
  },
  {
    label: "Prompts",
    icon: "✨",
    path: "/prompts",
  },
  {
    label: "Courses",
    icon: "🎓",
    path: "/courses",
  },
  {
    label: "AI News",
    icon: "📰",
    path: "/ai-news",
  },
  {
    label: "Dashboard",
    icon: "📊",
    path: "/dashboard",
  },
];

function QuickActionsDock() {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed
        left-1/2
        bottom-5
        z-[8500]

        -translate-x-1/2

        w-[calc(100%-2rem)]
        max-w-3xl

        rounded-3xl

        border
        border-white/10

        bg-black/70
        backdrop-blur-2xl

        px-3
        py-3

        shadow-[0_0_50px_rgba(0,234,255,.12)]
      "
    >
      <div
        className="
          flex
          items-center
          gap-2

          overflow-x-auto
          scrollbar-hide
        "
      >
        {actions.map((action) => (
          <button
            key={action.path}
            type="button"
            onClick={() => navigate(action.path)}
            className="
              group

              flex
              min-w-max
              items-center
              gap-2

              rounded-2xl

              border
              border-white/[0.08]

              bg-white/[0.035]

              px-4
              py-3

              text-sm
              font-semibold
              text-gray-300

              transition-all
              duration-300

              hover:-translate-y-1
              hover:border-cyan-400/40
              hover:bg-cyan-400/[0.08]
              hover:text-cyan-300
              hover:shadow-[0_0_20px_rgba(0,234,255,.12)]
            "
          >
            <span
              className="
                text-lg
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              {action.icon}
            </span>

            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActionsDock;