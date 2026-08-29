import { useState } from "react";
import { Link } from "react-router-dom";

const premiumFeatures = [
  {
    icon: "⬇️",
    title: "Unlimited Downloads",
    description: "Download premium resources without normal user limits.",
  },
  {
    icon: "💎",
    title: "Premium Files",
    description: "Access exclusive templates, assets and downloadable files.",
  },
  {
    icon: "🚫",
    title: "No Ads",
    description: "Enjoy a cleaner premium browsing experience.",
  },
  {
    icon: "🎓",
    title: "Exclusive Courses",
    description: "Access premium AI and creator learning content.",
  },
  {
    icon: "👥",
    title: "Private Community",
    description: "Join members-only discussions and premium community areas.",
  },
  {
    icon: "✨",
    title: "Premium Prompt Library",
    description: "Unlock advanced AI prompt collections and prompt packs.",
  },
  {
    icon: "⚡",
    title: "Priority Support",
    description: "Get priority assistance for premium features and resources.",
  },
  {
    icon: "🎁",
    title: "Exclusive Resources",
    description: "Get premium templates, code, creator packs and special releases.",
  },
];

const plans = [
  {
    id: "free",
    name: "Free",
    icon: "🌱",
    price: "₹0",
    period: "Forever",
    description: "Perfect for exploring AI Future Tamil.",
    features: [
      "AI Tools",
      "AI News",
      "Basic Prompts",
      "Community Access",
      "Free Downloads",
    ],
  },

  {
    id: "pro",
    name: "Premium",
    icon: "💎",
    price: "Coming Soon",
    period: "Premium Membership",
    description: "Unlock the complete AI Future Tamil experience.",
    recommended: true,
    features: [
      "Unlimited Downloads",
      "Premium Files",
      "Premium AI Prompts",
      "Exclusive Courses",
      "Private Community",
      "No Ads",
      "Priority Support",
    ],
  },
];

function PremiumHub() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <main className="min-h-screen bg-transparent text-white px-5 sm:px-6 py-12">

      {/* HERO */}
      <section className="max-w-7xl mx-auto mb-14">

        <div
          className="
            relative
            overflow-hidden
            rounded-[36px]
            border
            border-purple-400/25
            bg-black/30
            backdrop-blur-xl
            px-6
            md:px-12
            py-14
            md:py-20
          "
        >
          <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl">

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-purple-400/30
                bg-purple-400/[0.08]
                px-4
                py-2
                text-sm
                font-semibold
                text-purple-300
                mb-7
              "
            >
              💎 AI Future Tamil Premium
            </span>

            <div className="text-7xl md:text-8xl mb-7">
              💎
            </div>

            <h1
              className="
                text-4xl
                sm:text-5xl
                md:text-7xl
                font-black
                leading-tight
                bg-gradient-to-r
                from-white
                via-purple-200
                to-pink-400
                bg-clip-text
                text-transparent
              "
            >
              Unlock The Full
              <br />
              AI Experience
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-3xl leading-8 mt-6">
              Premium resources, exclusive courses, advanced AI prompts,
              unlimited downloads and members-only features in one place.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">

              <button
                type="button"
                onClick={() => setSelectedPlan(plans[1])}
                className="
                  rounded-2xl
                  bg-white
                  text-black
                  px-7
                  py-4
                  font-black
                  transition
                  hover:bg-gray-200
                  hover:-translate-y-1
                "
              >
                💎 Explore Premium
              </button>

              <Link
                to="/products/premium"
                className="
                  rounded-2xl
                  border
                  border-purple-400/30
                  bg-purple-400/[0.06]
                  px-7
                  py-4
                  font-bold
                  text-purple-300
                  transition
                  hover:bg-purple-400/10
                "
              >
                Premium Products →
              </Link>

            </div>
          </div>
        </div>

      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto mb-16">

        <div className="mb-8">
          <p className="text-purple-400 font-semibold mb-2">
            ⚡ Premium Benefits
          </p>

          <h2 className="text-3xl md:text-4xl font-black">
            Everything Premium Unlocks
          </h2>
        </div>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
          "
        >
          {premiumFeatures.map((feature) => (
            <div
              key={feature.title}
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
                hover:shadow-[0_0_40px_rgba(168,85,247,.08)]
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  border
                  border-purple-400/20
                  bg-purple-400/[0.06]
                  flex
                  items-center
                  justify-center
                  text-3xl
                  mb-5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-6 mt-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* PLANS */}
      <section className="max-w-5xl mx-auto pb-20">

        <div className="text-center mb-10">
          <p className="text-pink-400 font-semibold mb-2">
            🚀 Membership
          </p>

          <h2 className="text-3xl md:text-5xl font-black">
            Choose Your Experience
          </h2>

          <p className="text-gray-500 mt-4">
            Start free. Upgrade when premium memberships launch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative
                overflow-hidden
                rounded-[32px]
                border
                p-7
                md:p-9
                transition-all
                duration-300

                ${
                  plan.recommended
                    ? `
                      border-purple-400/40
                      bg-purple-400/[0.06]
                      shadow-[0_0_50px_rgba(168,85,247,.10)]
                    `
                    : `
                      border-white/10
                      bg-black/30
                    `
                }
              `}
            >

              {plan.recommended && (
                <div
                  className="
                    absolute
                    right-5
                    top-5
                    rounded-full
                    border
                    border-purple-400/30
                    bg-purple-400/10
                    px-3
                    py-1
                    text-xs
                    font-bold
                    text-purple-300
                  "
                >
                  ⭐ Recommended
                </div>
              )}

              <div className="text-5xl mb-6">
                {plan.icon}
              </div>

              <h3 className="text-3xl font-black">
                {plan.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {plan.description}
              </p>

              <div className="mt-7">
                <p className="text-4xl font-black">
                  {plan.price}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {plan.period}
                </p>
              </div>

              <div className="border-t border-white/10 mt-7 pt-7 space-y-4">

                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`
                        w-7
                        h-7
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-xs

                        ${
                          plan.recommended
                            ? "bg-purple-400/10 text-purple-300"
                            : "bg-green-400/10 text-green-300"
                        }
                      `}
                    >
                      ✓
                    </div>

                    <p className="text-gray-300">
                      {feature}
                    </p>
                  </div>
                ))}

              </div>

              {plan.id === "free" ? (
                <Link
                  to="/ai-tools"
                  className="
                    block
                    w-full
                    mt-8
                    rounded-xl
                    border
                    border-white/10
                    py-4
                    text-center
                    font-bold
                    text-gray-300
                    transition
                    hover:border-cyan-400/30
                    hover:text-cyan-300
                  "
                >
                  Continue Free →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className="
                    w-full
                    mt-8
                    rounded-xl
                    bg-white
                    py-4
                    font-black
                    text-black
                    transition
                    hover:bg-gray-200
                  "
                >
                  💎 Unlock Premium
                </button>
              )}

            </div>
          ))}

        </div>
      </section>

      {/* PREMIUM MODAL */}
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
              rounded-[32px]
              border
              border-purple-400/30
              bg-[#090b15]
              p-8
              text-center
              shadow-[0_0_80px_rgba(168,85,247,.15)]
            "
          >

            <div className="text-7xl mb-5">
              💎
            </div>

            <p className="text-purple-400 text-sm font-bold mb-2">
              AI FUTURE TAMIL
            </p>

            <h2 className="text-3xl font-black">
              Premium Coming Soon
            </h2>

            <p className="text-gray-400 leading-7 mt-4">
              Premium membership UI is ready. Payment and automatic premium
              account activation will be connected later using our payment
              system.
            </p>

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-purple-400/20
                bg-purple-400/[0.05]
                p-5
              "
            >
              <p className="text-sm text-gray-500">
                Premium will unlock
              </p>

              <p className="text-purple-300 font-bold mt-2">
                Downloads · Courses · Prompts · Community · Premium Files
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className="
                w-full
                mt-7
                rounded-xl
                bg-white
                text-black
                py-4
                font-black
                hover:bg-gray-200
                transition
              "
            >
              Got it 🚀
            </button>

          </div>
        </div>
      )}

    </main>
  );
}

export default PremiumHub;