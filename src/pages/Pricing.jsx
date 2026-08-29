import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Perfect for exploring AI tools and prompts.",
    features: [
      "Access AI Tools",
      "Browse AI News",
      "Access Prompt Library",
      "Save Prompts",
    ],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹299",
    period: "/month",
    description: "For creators and professionals who use AI daily.",
    features: [
      "Everything in Free",
      "Unlimited Prompt Access",
      "Premium Prompt Collection",
      "Advanced AI Resources",
      "Priority Features",
    ],
    button: "Choose Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "₹599",
    period: "/month",
    description: "For serious creators and AI power users.",
    features: [
      "Everything in Pro",
      "Exclusive AI Resources",
      "Premium Tutorials",
      "Advanced Workflows",
      "Early Access to New Features",
      "Priority Support",
    ],
    button: "Choose Premium",
    popular: false,
  },
];

function Pricing() {
  return (
    <main className="min-h-screen bg-transparent text-white px-6 py-20">

      {/* Header */}
      <section className="max-w-4xl mx-auto text-center">

        <p className="text-blue-400 text-lg mb-4">
          💎 Simple Pricing
        </p>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Choose Your AI Plan
        </h1>

        <p className="text-gray-400 text-lg leading-8">
          Start for free and upgrade when you need more powerful
          AI resources and features.
        </p>

      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-8">

        {plans.map((plan) => (

          <div
            key={plan.name}
            className={`relative rounded-3xl p-8 border transition-all duration-300 ${
              plan.popular
                ? "bg-zinc-900 border-blue-500 shadow-lg shadow-blue-500/10 scale-105"
                : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
            }`}
          >

            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">

                <span className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>

              </div>
            )}

            {/* Plan Name */}
            <h2 className="text-2xl font-bold mb-3">
              {plan.name}
            </h2>

            {/* Description */}
            <p className="text-gray-400 min-h-[56px] leading-6">
              {plan.description}
            </p>

            {/* Price */}
            <div className="mt-8 mb-8">

              <span className="text-5xl font-bold">
                {plan.price}
              </span>

              <span className="text-gray-500 ml-2">
                {plan.period}
              </span>

            </div>

            {/* Button */}
            <Link
              to="/ai-tools"
              className={`block w-full text-center py-3 rounded-xl font-semibold transition ${
                plan.popular
                  ? "bg-white text-black hover:bg-gray-200"
                  : "border border-zinc-700 hover:border-white"
              }`}
            >
              {plan.button}
            </Link>

            {/* Divider */}
            <div className="border-t border-zinc-800 my-8" />

            {/* Features */}
            <div>

              <p className="font-semibold mb-5">
                What's included
              </p>

              <ul className="space-y-4">

                {plan.features.map((feature) => (

                  <li
                    key={feature}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="text-green-400">
                      ✓
                    </span>

                    <span>
                      {feature}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

          </div>

        ))}

      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto text-center mt-24">

        <h2 className="text-3xl font-bold mb-4">
          Start exploring AI today 🚀
        </h2>

        <p className="text-gray-400 mb-8">
          Discover AI tools, prompts and the latest AI trends.
        </p>

        <Link
          to="/ai-tools"
          className="inline-block bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Explore AI Tools →
        </Link>

      </section>

    </main>
  );
}

export default Pricing;