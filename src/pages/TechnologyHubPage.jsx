import { Link, useLocation } from "react-router-dom";

const technologyPages = {
  "/technology/android": {
    icon: "📱",
    title: "Android Apps",
    subtitle:
      "Discover useful Android apps, productivity tools and smart mobile utilities.",
  },

  "/technology/windows": {
    icon: "🖥️",
    title: "Windows Software",
    subtitle:
      "Explore useful Windows software for work, creativity and productivity.",
  },

  "/technology/ai-software": {
    icon: "🤖",
    title: "AI Software",
    subtitle:
      "Discover AI-powered software for creators, professionals and developers.",
  },

  "/technology/mobile-tips": {
    icon: "📲",
    title: "Mobile Tips",
    subtitle:
      "Learn useful mobile tips, settings, tricks and productivity ideas.",
  },

  "/technology/news": {
    icon: "📰",
    title: "Technology News",
    subtitle:
      "Stay updated with the latest technology news and product updates.",
  },

  "/technology/chrome": {
    icon: "🧩",
    title: "Chrome Extensions",
    subtitle:
      "Explore useful Chrome extensions for browsing, productivity and creators.",
  },

  "/technology/laptop-tips": {
    icon: "💻",
    title: "Laptop Tips",
    subtitle:
      "Discover laptop performance, productivity and maintenance tips.",
  },

  "/technology/cyber-security": {
    icon: "🛡️",
    title: "Cyber Security",
    subtitle:
      "Learn practical online safety, privacy and cyber security basics.",
  },

  "/technology/programming": {
    icon: "👨‍💻",
    title: "Programming",
    subtitle:
      "Learn programming concepts, languages and development resources.",
  },

  "/technology/coding-resources": {
    icon: "⚙️",
    title: "Coding Resources",
    subtitle:
      "Explore coding tools, references, starter resources and developer utilities.",
  },
};

const quickLinks = [
  ["📱", "Android", "/technology/android"],
  ["🖥️", "Windows", "/technology/windows"],
  ["🤖", "AI Software", "/technology/ai-software"],
  ["📰", "Tech News", "/technology/news"],
  ["🛡️", "Cyber Security", "/technology/cyber-security"],
  ["👨‍💻", "Programming", "/technology/programming"],
];

function TechnologyHubPage() {
  const location = useLocation();

  const page = technologyPages[location.pathname] || {
    icon: "💻",
    title: "Technology Hub",
    subtitle:
      "Explore apps, software, tech news, tips and developer resources.",
  };

  const cards = [
    {
      icon: "🔥",
      title: "Trending Tech",
      text: "Popular technology updates and resources will appear here.",
    },
    {
      icon: "🆕",
      title: "Latest Updates",
      text: "New apps, software and technology updates will appear here.",
    },
    {
      icon: "🎁",
      title: "Free Resources",
      text: "Useful free technology resources for everyone.",
    },
    {
      icon: "💎",
      title: "Premium Resources",
      text: "Premium software, guides and downloads will be available here.",
    },
  ];

  return (
    <main className="min-h-screen bg-transparent text-white px-5 sm:px-6 py-12">
      <section className="max-w-7xl mx-auto">
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-blue-400/20
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
              bg-blue-500/10
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
                border-blue-400/20
                bg-blue-400/[0.06]
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-300
                mb-6
              "
            >
              💻 Technology Hub
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
                via-blue-200
                to-cyan-400
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
                to="/technology/news"
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
                Explore Technology →
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
                  hover:border-blue-400/30
                  hover:text-blue-300
                "
              >
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {quickLinks.map(([icon, label, path]) => (
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
                    ? "border-blue-400 bg-blue-400/10 text-blue-300"
                    : "border-white/10 bg-black/30 text-gray-400 hover:border-blue-400/30 hover:text-white"
                }
              `}
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </section>

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
              hover:border-blue-400/30
              hover:bg-blue-400/[0.04]
              hover:shadow-[0_0_35px_rgba(59,130,246,.08)]
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

export default TechnologyHubPage;