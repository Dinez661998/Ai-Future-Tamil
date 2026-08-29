import { Link, useLocation } from "react-router-dom";

const pageData = {
  "/ai-apps": {
    icon: "📱",
    title: "AI Apps",
    subtitle: "Discover useful AI-powered apps for everyday work and creativity.",
  },

  "/ai-images": {
    icon: "🎨",
    title: "AI Images",
    subtitle: "Explore AI image generators, design tools and creative resources.",
  },

  "/ai-videos": {
    icon: "🎬",
    title: "AI Videos",
    subtitle: "Discover AI video generators, editing tools and animation platforms.",
  },

  "/ai-models": {
    icon: "🧠",
    title: "AI Models",
    subtitle: "Explore popular AI models for text, image, video and more.",
  },

  "/ai-datasets": {
    icon: "📊",
    title: "AI Datasets",
    subtitle: "Find useful datasets for AI learning, experiments and development.",
  },

  "/source-code": {
    icon: "💻",
    title: "AI Source Code",
    subtitle: "Explore useful AI projects, starter code and development resources.",
  },

  "/ai-templates": {
    icon: "🧩",
    title: "AI Templates",
    subtitle: "Ready-to-use AI templates for creators, developers and businesses.",
  },

  "/wallpapers": {
    icon: "🌌",
    title: "AI Wallpapers",
    subtitle: "Discover creative AI-generated wallpapers and visual collections.",
  },
};

function AIHubPage() {
  const location = useLocation();

  const page = pageData[location.pathname] || {
    icon: "🤖",
    title: "AI Hub",
    subtitle: "Explore the future of artificial intelligence.",
  };

  const cards = [
    {
      icon: "🔥",
      title: "Trending",
      text: "Popular resources will appear here.",
    },
    {
      icon: "🆕",
      title: "Latest",
      text: "New content and updates will appear here.",
    },
    {
      icon: "🎁",
      title: "Free Resources",
      text: "Useful free resources for everyone.",
    },
    {
      icon: "💎",
      title: "Premium",
      text: "Premium resources will be available soon.",
    },
  ];

  return (
    <main className="min-h-screen bg-transparent text-white px-5 sm:px-6 py-12">

      {/* HERO */}
      <section className="max-w-7xl mx-auto">

        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-cyan-400/20
            bg-black/30
            backdrop-blur-xl
            px-6
            sm:px-10
            py-12
            sm:py-16
          "
        >
          <div
            className="
              absolute
              -top-32
              -right-20
              w-80
              h-80
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-20
              w-80
              h-80
              rounded-full
              bg-cyan-500/10
              blur-3xl
            "
          />

          <div className="relative z-10 max-w-3xl">

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/[0.06]
                px-4
                py-2
                text-sm
                font-semibold
                text-cyan-300
                mb-6
              "
            >
              ⚡ AI Future Tamil
            </span>

            <div className="text-7xl sm:text-8xl mb-6">
              {page.icon}
            </div>

            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                font-black
                mb-5
                bg-gradient-to-r
                from-white
                via-cyan-200
                to-purple-400
                bg-clip-text
                text-transparent
              "
            >
              {page.title}
            </h1>

            <p
              className="
                text-gray-400
                text-lg
                sm:text-xl
                leading-8
                max-w-2xl
              "
            >
              {page.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">

              <Link
                to="/ai-tools"
                className="
                  rounded-xl
                  bg-white
                  text-black
                  px-6
                  py-3
                  font-bold
                  transition
                  hover:bg-gray-200
                "
              >
                Explore AI Tools →
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
                  transition
                  hover:border-cyan-400/30
                  hover:text-cyan-300
                "
              >
                ← Home
              </Link>

            </div>

          </div>
        </div>

      </section>

      {/* QUICK TABS */}
      <section className="max-w-7xl mx-auto mt-10">

        <div
          className="
            flex
            gap-3
            overflow-x-auto
            pb-2
          "
        >
          {[
            ["🤖", "AI Tools", "/ai-tools"],
            ["📰", "AI News", "/ai-news"],
            ["✨", "Prompts", "/prompts"],
            ["🎓", "Courses", "/courses"],
            ["📱", "AI Apps", "/ai-apps"],
            ["🎨", "AI Images", "/ai-images"],
            ["🎬", "AI Videos", "/ai-videos"],
          ].map(([icon, label, path]) => (
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
                transition-all
                ${
                  location.pathname === path
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-black/30 text-gray-400 hover:border-cyan-400/30 hover:text-white"
                }
              `}
            >
              {icon} {label}
            </Link>
          ))}
        </div>

      </section>

      {/* CONTENT */}
      <section
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          mt-8
          pb-20
        "
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="
              group
              rounded-3xl
              border
              border-white/[0.08]
              bg-black/30
              backdrop-blur-xl
              p-6
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-cyan-400/30
              hover:bg-cyan-400/[0.04]
              hover:shadow-[0_0_35px_rgba(0,234,255,.08)]
            "
          >
            <div
              className="
                w-14
                h-14
                rounded-2xl
                border
                border-white/10
                bg-white/[0.04]
                flex
                items-center
                justify-center
                text-3xl
                mb-6
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              {card.icon}
            </div>

            <h2 className="text-xl font-bold mb-2">
              {card.title}
            </h2>

            <p className="text-gray-500 text-sm leading-6">
              {card.text}
            </p>
          </div>
        ))}
      </section>

    </main>
  );
}

export default AIHubPage;