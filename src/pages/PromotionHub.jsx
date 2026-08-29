import { useState } from "react";

const plans = [
  {
    id: "instagram",
    icon: "📸",
    title: "Instagram Promotion",
    price: 99,
    description:
      "Promote your Instagram profile, reel or creator page inside AI Future Tamil.",
  },
  {
    id: "youtube",
    icon: "▶️",
    title: "YouTube Promotion",
    price: 199,
    description:
      "Promote your YouTube channel, video or creator content to our audience.",
  },
  {
    id: "website",
    icon: "🌐",
    title: "Website Promotion",
    price: 299,
    description:
      "Feature your website, product or online service inside our platform.",
  },
  {
    id: "telegram",
    icon: "✈️",
    title: "Telegram Promotion",
    price: 499,
    description:
      "Promote your Telegram channel, group or community.",
  },
  {
    id: "social",
    icon: "🚀",
    title: "Full Social Media Promotion",
    price: 999,
    description:
      "Multi-platform promotion package for creators, businesses and brands.",
  },
  {
    id: "featured",
    icon: "⭐",
    title: "Featured Homepage",
    price: 1999,
    description:
      "Get premium homepage visibility with a highlighted featured placement.",
  },
  {
    id: "article",
    icon: "📰",
    title: "Sponsored Article",
    price: 2999,
    description:
      "Publish a sponsored article or promotional feature on AI Future Tamil.",
  },
];

function PromotionHub() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <main className="min-h-screen bg-transparent text-white px-5 sm:px-6 py-12">

      {/* HERO */}
      <section className="max-w-7xl mx-auto mb-12">
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-orange-400/20
            bg-black/30
            backdrop-blur-xl
            px-6
            sm:px-10
            py-12
            sm:py-16
          "
        >
          <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-orange-400/20
                bg-orange-400/[0.06]
                px-4
                py-2
                text-sm
                font-semibold
                text-orange-300
                mb-6
              "
            >
              📣 Promotion Hub
            </span>

            <div className="text-7xl mb-6">
              🚀
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
                via-orange-200
                to-pink-400
                bg-clip-text
                text-transparent
              "
            >
              Grow Your Brand
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl leading-8">
              Promote your YouTube channel, Instagram page, website, Telegram
              community or digital brand through AI Future Tamil.
            </p>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="max-w-7xl mx-auto">

        <div className="mb-8">
          <p className="text-orange-400 font-semibold mb-2">
            💰 Promotion Packages
          </p>

          <h2 className="text-3xl sm:text-4xl font-black">
            Choose Your Promotion Plan
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.08]
                bg-black/30
                backdrop-blur-xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-orange-400/30
                hover:shadow-[0_0_40px_rgba(249,115,22,.08)]
              "
            >
              <div className="text-5xl mb-6">
                {plan.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {plan.title}
              </h3>

              <p className="text-gray-500 leading-7 min-h-[84px]">
                {plan.description}
              </p>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-gray-500 text-lg">
                  ₹
                </span>

                <span className="text-4xl font-black text-white">
                  {plan.price}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className="
                  w-full
                  mt-7
                  rounded-xl
                  border
                  border-orange-400/30
                  bg-orange-400/[0.07]
                  py-4
                  font-bold
                  text-orange-300
                  transition
                  hover:bg-orange-400/15
                  hover:border-orange-300
                "
              >
                Select Plan →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* WHY PROMOTE */}
      <section className="max-w-7xl mx-auto mt-14 pb-20">

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
          "
        >
          {[
            ["🎯", "Targeted Audience", "Reach users interested in AI, creators and technology."],
            ["⚡", "Fast Exposure", "Showcase your content through dedicated promotion placements."],
            ["📈", "Brand Growth", "Increase visibility for your creator profile, website or business."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="
                rounded-3xl
                border
                border-white/[0.08]
                bg-black/30
                p-6
              "
            >
              <div className="text-4xl mb-4">
                {icon}
              </div>

              <h3 className="text-xl font-bold">
                {title}
              </h3>

              <p className="text-gray-500 text-sm leading-6 mt-2">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SELECT PLAN MODAL */}
      {selectedPlan && (
        <div
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            bg-black/80
            backdrop-blur-md
            px-4
          "
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPlan(null);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              border
              border-orange-400/25
              bg-[#090b15]
              p-8
              shadow-[0_0_70px_rgba(249,115,22,.12)]
            "
          >
            <div className="flex items-start justify-between gap-4 mb-7">

              <div>
                <div className="text-5xl mb-4">
                  {selectedPlan.icon}
                </div>

                <h2 className="text-2xl font-black">
                  {selectedPlan.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="
                  w-11
                  h-11
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

            <p className="text-gray-400 leading-7">
              {selectedPlan.description}
            </p>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-orange-400/20
                bg-orange-400/[0.05]
                p-5
              "
            >
              <p className="text-sm text-gray-500">
                Package Price
              </p>

              <p className="text-4xl font-black mt-1">
                ₹{selectedPlan.price}
              </p>
            </div>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-5
              "
            >
              <p className="text-sm text-gray-400 leading-6">
                Payment and promotion request system will be connected later.
                For now, this is the interactive package-selection UI.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className="
                w-full
                mt-6
                rounded-xl
                bg-white
                py-4
                font-bold
                text-black
                hover:bg-gray-200
                transition
              "
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

export default PromotionHub;