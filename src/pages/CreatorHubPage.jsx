import { Link, useLocation } from "react-router-dom";

const creatorPages = {
  "/creators/youtube": {
    icon: "▶️",
    title: "YouTube Resources",
    subtitle:
      "Discover tools, templates, ideas and resources for growing your YouTube channel.",
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
  ["▶️", "YouTube", "/creators/youtube"],
  ["📸", "Instagram", "/creators/instagram"],
  ["🎞️", "Video Editing", "/creators/video-editing"],
  ["🖼️", "Thumbnails", "/creators/thumbnails"],
  ["🎵", "Music & SFX", "/creators/music-sfx"],
  ["✂️", "CapCut", "/creators/capcut"],
];

function CreatorHubPage() {
  const location = useLocation();

  const page = creatorPages[location.pathname] || {
    icon: "🎬",
    title: "Creator Hub",
    subtitle:
      "Everything creators need for video, social media and digital content.",
  };

  const cards = [
    {
      icon: "🔥",
      title: "Trending Resources",
      text: "Popular creator resources and tools will appear here.",
    },
    {
      icon: "🆕",
      title: "Latest Uploads",
      text: "New creator templates and assets will appear here.",
    },
    {
      icon: "🎁",
      title: "Free Resources",
      text: "Useful free assets and creator tools for everyone.",
    },
    {
      icon: "💎",
      title: "Premium Packs",
      text: "Premium templates, assets and creator packs will be available here.",
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
            border-pink-400/20
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
              bg-pink-500/10
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
              bg-purple-500/10
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
                border-pink-400/20
                bg-pink-400/[0.06]
                px-4
                py-2
                text-sm
                font-semibold
                text-pink-300
                mb-6
              "
            >
              🎬 Creator Hub
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
                via-pink-200
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
                to="/creators/youtube"
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
                Explore Creator Resources →
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
                  hover:border-pink-400/30
                  hover:text-pink-300
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
                    ? "border-pink-400 bg-pink-400/10 text-pink-300"
                    : "border-white/10 bg-black/30 text-gray-400 hover:border-pink-400/30 hover:text-white"
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
              hover:border-pink-400/30
              hover:bg-pink-400/[0.04]
              hover:shadow-[0_0_35px_rgba(236,72,153,.08)]
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

export default CreatorHubPage;