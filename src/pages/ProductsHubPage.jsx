import { Link, useLocation } from "react-router-dom";

const productPages = {
  "/products/free": {
    icon: "🎁",
    title: "Free Products",
    subtitle:
      "Download useful free AI, creator and technology resources.",
  },

  "/products/premium": {
    icon: "💎",
    title: "Premium Products",
    subtitle:
      "Unlock premium templates, source code, creator packs and digital assets.",
  },

  "/products/prompts": {
    icon: "✨",
    title: "AI Prompt Packs",
    subtitle:
      "Explore ready-to-use prompt collections for ChatGPT and other AI tools.",
  },

  "/products/ebooks": {
    icon: "📚",
    title: "eBooks & PDFs",
    subtitle:
      "Learn from useful guides, eBooks, cheat sheets and downloadable PDFs.",
  },

  "/products/templates": {
    icon: "📦",
    title: "Templates",
    subtitle:
      "Discover ready-made templates for creators, businesses and productivity.",
  },

  "/products/icons-fonts": {
    icon: "🔤",
    title: "Icons & Fonts",
    subtitle:
      "Explore icon collections, font resources and useful design assets.",
  },

  "/products/ui-kits": {
    icon: "🖌️",
    title: "UI Kits",
    subtitle:
      "Download UI kits and interface resources for web and app design.",
  },

  "/products/source-code": {
    icon: "💻",
    title: "Source Code",
    subtitle:
      "Explore reusable source code, starter projects and development resources.",
  },

  "/products/photoshop": {
    icon: "🖼️",
    title: "Photoshop Files",
    subtitle:
      "Discover editable Photoshop files, PSD templates and design resources.",
  },

  "/products/capcut": {
    icon: "✂️",
    title: "CapCut Templates",
    subtitle:
      "Explore ready-made CapCut templates and video editing resources.",
  },

  "/products/luts": {
    icon: "🎛️",
    title: "LUTs & Presets",
    subtitle:
      "Download LUTs, presets and color grading resources for video creators.",
  },

  "/products/animations": {
    icon: "🎞️",
    title: "Animation Packs",
    subtitle:
      "Explore animation packs, motion elements and reusable visual assets.",
  },
};

const quickLinks = [
  ["🎁", "Free", "/products/free"],
  ["💎", "Premium", "/products/premium"],
  ["✨", "Prompts", "/products/prompts"],
  ["📚", "eBooks", "/products/ebooks"],
  ["📦", "Templates", "/products/templates"],
  ["💻", "Source Code", "/products/source-code"],
];

function ProductsHubPage() {
  const location = useLocation();

  const page = productPages[location.pathname] || {
    icon: "🛍️",
    title: "Digital Products",
    subtitle:
      "Discover free and premium digital products for AI users, creators and developers.",
  };

  const cards = [
    {
      icon: "🔥",
      title: "Popular Products",
      text: "Trending digital products and downloads will appear here.",
    },
    {
      icon: "🆕",
      title: "New Releases",
      text: "Latest templates, packs and digital resources will appear here.",
    },
    {
      icon: "🎁",
      title: "Free Downloads",
      text: "Useful free resources available for all users.",
    },
    {
      icon: "💎",
      title: "Premium Collection",
      text: "Exclusive premium products for paid members.",
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
            border-purple-400/20
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
              bg-pink-500/10
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
                border-purple-400/20
                bg-purple-400/[0.06]
                px-4
                py-2
                text-sm
                font-semibold
                text-purple-300
                mb-6
              "
            >
              🛍️ Digital Products
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
                via-purple-200
                to-pink-400
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
                to="/products/free"
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
                Browse Products →
              </Link>

              <Link
                to="/products/premium"
                className="
                  rounded-xl
                  border
                  border-purple-400/30
                  bg-purple-400/[0.08]
                  px-6
                  py-3
                  font-semibold
                  text-purple-300
                  transition
                  hover:bg-purple-400/15
                "
              >
                💎 Premium
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
                    ? "border-purple-400 bg-purple-400/10 text-purple-300"
                    : "border-white/10 bg-black/30 text-gray-400 hover:border-purple-400/30 hover:text-white"
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
              hover:border-purple-400/30
              hover:bg-purple-400/[0.04]
              hover:shadow-[0_0_35px_rgba(168,85,247,.08)]
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

export default ProductsHubPage;