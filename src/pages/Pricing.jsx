import { useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   PRICING DATA
========================================================= */

const plans = [
  {
    name: "Free",
    icon: "🌱",
    monthly: 0,
    yearly: 0,
    description:
      "Start exploring AI Future Tamil for free.",
    badge: null,
    accent: "gray",

    features: [
      "Access Basic AI Tools",
      "Browse AI News",
      "Basic Prompt Library",
      "Save Prompts",
      "Basic Creator Resources",
      "Basic YouTube Tools",
      "Community Access",
    ],
  },

  {
    name: "Starter",
    icon: "⚡",
    monthly: 5,
    yearly: 50,
    description:
      "Low-cost access for students and beginners.",
    badge: "START HERE",
    accent: "cyan",

    features: [
      "Everything in Free",
      "More AI Tool Access",
      "More Prompt Access",
      "Starter Prompt Packs",
      "More Saved Resources",
      "Creator Starter Tools",
      "Starter Templates",
      "Basic Download Resources",
    ],
  },

  {
    name: "Creator",
    icon: "🎬",
    monthly: 10,
    yearly: 100,
    description:
      "Built for YouTubers and digital creators.",
    badge: "MOST POPULAR",
    accent: "pink",

    features: [
      "Everything in Starter",
      "Full YouTube Creator Toolkit",
      "Creator Prompt Collection",
      "Video Idea Tools",
      "Title & Hook Tools",
      "Script Tools",
      "Thumbnail Resources",
      "SEO Creator Tools",
      "Shorts Tools",
      "Content Calendar",
      "Creator Checklists",
      "Premium Creator Resources",
    ],
  },

  {
    name: "Pro",
    icon: "🚀",
    monthly: 25,
    yearly: 250,
    description:
      "Advanced tools for regular AI and creator users.",
    badge: "PRO",
    accent: "blue",

    features: [
      "Everything in Creator",
      "Advanced AI Resources",
      "Advanced Prompt Packs",
      "Advanced Creator Tools",
      "Premium Templates",
      "Advanced Workflows",
      "More Saved Content",
      "Professional Resources",
      "Early Feature Access",
    ],
  },

  {
    name: "Premium",
    icon: "💎",
    monthly: 50,
    yearly: 500,
    description:
      "Maximum access to available premium resources.",
    badge: "BEST VALUE",
    accent: "purple",

    features: [
      "Everything in Pro",
      "Full Premium Resource Library",
      "Exclusive Creator Packs",
      "Premium AI Resources",
      "Premium Tutorials",
      "Premium Workflows",
      "Premium Template Packs",
      "Early Access to New Features",
      "Priority Feature Access",
      "Priority Support",
    ],
  },
];

/* =========================================================
   ONE-TIME PACKS
========================================================= */

const oneTimePacks = [
  {
    icon: "🧠",
    name: "Prompt Pack",
    price: "₹5",
    description:
      "Useful prompt templates for AI and creator workflows.",
  },

  {
    icon: "🖼️",
    name: "Thumbnail Starter Pack",
    price: "₹10",
    description:
      "Thumbnail planning resources and creator templates.",
  },

  {
    icon: "▶️",
    name: "YouTube Starter Pack",
    price: "₹15",
    description:
      "YouTube planning, title, hook and script resources.",
  },

  {
    icon: "🎬",
    name: "Creator Bundle",
    price: "₹25",
    description:
      "A larger collection of useful creator resources.",
  },
];

/* =========================================================
   RAZORPAY SCRIPT
========================================================= */

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      existingScript.onload = () => resolve(true);
      existingScript.onerror = () => resolve(false);
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/* =========================================================
   HELPERS
========================================================= */

function getAccentClasses(accent) {
  const styles = {
    gray: {
      border: "border-white/10",
      glow: "",
      icon:
        "bg-white/[0.05] border-white/10",
      button:
        "border border-white/15 bg-white/[0.03] hover:bg-white/[0.07]",
      badge:
        "border-white/10 bg-white/[0.05] text-gray-300",
    },

    cyan: {
      border: "border-cyan-400/30",
      glow:
        "shadow-[0_0_35px_rgba(34,211,238,0.08)]",
      icon:
        "bg-cyan-400/[0.07] border-cyan-400/20",
      button:
        "border border-cyan-400/25 bg-cyan-400/[0.07] text-cyan-200 hover:bg-cyan-400/[0.12]",
      badge:
        "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300",
    },

    pink: {
      border: "border-pink-400/40",
      glow:
        "shadow-[0_0_45px_rgba(236,72,153,0.12)]",
      icon:
        "bg-pink-400/[0.08] border-pink-400/25",
      button:
        "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-white",
      badge:
        "border-pink-400/30 bg-pink-400/[0.10] text-pink-300",
    },

    blue: {
      border: "border-blue-400/30",
      glow:
        "shadow-[0_0_35px_rgba(59,130,246,0.08)]",
      icon:
        "bg-blue-400/[0.07] border-blue-400/20",
      button:
        "border border-blue-400/25 bg-blue-400/[0.07] text-blue-200 hover:bg-blue-400/[0.12]",
      badge:
        "border-blue-400/25 bg-blue-400/[0.08] text-blue-300",
    },

    purple: {
      border: "border-purple-400/40",
      glow:
        "shadow-[0_0_45px_rgba(168,85,247,0.12)]",
      icon:
        "bg-purple-400/[0.08] border-purple-400/25",
      button:
        "border border-purple-400/30 bg-purple-400/[0.08] text-purple-200 hover:bg-purple-400/[0.14]",
      badge:
        "border-purple-400/30 bg-purple-400/[0.10] text-purple-300",
    },
  };

  return styles[accent] || styles.gray;
}

/* =========================================================
   PRICING
========================================================= */

function Pricing() {
  const [billing, setBilling] =
    useState("monthly");

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [loadingPlan, setLoadingPlan] =
    useState("");

  /* =======================================================
     MESSAGE
  ======================================================= */

  function showMessage(text, type = "info") {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      document
        .getElementById("pricing-message")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  }

  /* =======================================================
     RAZORPAY PAYMENT
  ======================================================= */

  async function handlePaidPlan(plan) {
    if (loadingPlan) {
      return;
    }

    try {
      setMessage("");
      setMessageType("");
      setLoadingPlan(plan.name);

      /* -----------------------------------------------
         LOAD RAZORPAY
      ------------------------------------------------ */

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay Checkout. Please check your internet connection."
        );
      }

      /* -----------------------------------------------
         CREATE ORDER
      ------------------------------------------------ */

      const orderResponse = await fetch(
        "/api/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            plan: plan.name,
            billing,
          }),
        }
      );

      const orderData =
        await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData?.error ||
            "Unable to create payment order."
        );
      }

      if (
        !orderData?.orderId ||
        !orderData?.amount ||
        !orderData?.keyId
      ) {
        throw new Error(
          "Invalid order response received."
        );
      }

      /* -----------------------------------------------
         RAZORPAY CHECKOUT OPTIONS
      ------------------------------------------------ */

      const options = {
        key: orderData.keyId,

        amount: orderData.amount,

        currency:
          orderData.currency || "INR",

        name: "AI Future Tamil",

        description:
          `${plan.name} Plan - ${
            billing === "monthly"
              ? "Monthly"
              : "Yearly"
          }`,

        order_id: orderData.orderId,

        /* ---------------------------------------------
           PAYMENT SUCCESS
        ---------------------------------------------- */

        handler: async function (
          razorpayResponse
        ) {
          try {
            showMessage(
              "🔐 Payment received. Verifying payment...",
              "info"
            );

            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      razorpayResponse
                        .razorpay_order_id,

                    razorpay_payment_id:
                      razorpayResponse
                        .razorpay_payment_id,

                    razorpay_signature:
                      razorpayResponse
                        .razorpay_signature,

                    plan:
                      plan.name,

                    billing,
                  }),
                }
              );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData?.success
            ) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification failed."
              );
            }

            showMessage(
              `✅ Payment verified successfully! ${plan.name} ${billing} payment completed.`,
              "success"
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            showMessage(
              `❌ ${
                error?.message ||
                "Payment verification failed."
              }`,
              "error"
            );
          } finally {
            setLoadingPlan("");
          }
        },

        /* ---------------------------------------------
           CHECKOUT UI
        ---------------------------------------------- */

        theme: {
          color: "#8b5cf6",
        },

        modal: {
          ondismiss: function () {
            setLoadingPlan("");

            showMessage(
              "Payment checkout closed. No payment was completed.",
              "info"
            );
          },

          escape: true,

          backdropclose: false,
        },

        notes: {
          plan: plan.name,
          billing,
          website:
            "AI Future Tamil",
        },

        retry: {
          enabled: true,
        },
      };

      /* -----------------------------------------------
         OPEN CHECKOUT
      ------------------------------------------------ */

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay payment failed:",
            response?.error
          );

          setLoadingPlan("");

          showMessage(
            `❌ ${
              response?.error?.description ||
              "Payment failed. Please try again."
            }`,
            "error"
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay checkout error:",
        error
      );

      setLoadingPlan("");

      showMessage(
        `❌ ${
          error?.message ||
          "Unable to start payment."
        }`,
        "error"
      );
    }
  }

  /* =======================================================
     MESSAGE STYLES
  ======================================================= */

  function getMessageStyle() {
    if (messageType === "success") {
      return `
        border-green-400/30
        bg-green-400/[0.07]
        text-green-200
      `;
    }

    if (messageType === "error") {
      return `
        border-red-400/30
        bg-red-400/[0.07]
        text-red-200
      `;
    }

    return `
      border-cyan-400/20
      bg-cyan-400/[0.05]
      text-cyan-200
    `;
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-transparent px-5 py-16 text-white sm:px-6 sm:py-20">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="mx-auto max-w-5xl text-center">

        <div
          className="
            mx-auto
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
            font-bold
            text-purple-300
          "
        >
          💎 Simple & Affordable Pricing
        </div>

        <h1
          className="
            mt-6
            bg-gradient-to-r
            from-white
            via-cyan-200
            to-purple-300
            bg-clip-text
            text-4xl
            font-black
            text-transparent
            sm:text-5xl
            md:text-6xl
          "
        >
          Choose Your Plan
        </h1>

        <p
          className="
            mx-auto
            mt-5
            max-w-3xl
            text-base
            leading-8
            text-gray-400
            sm:text-lg
          "
        >
          Start free and upgrade only when you
          need more creator tools, premium
          resources and advanced features.
        </p>

        {/* BILLING TOGGLE */}

        <div
          className="
            mx-auto
            mt-8
            inline-flex
            rounded-2xl
            border
            border-white/10
            bg-black/30
            p-1.5
          "
        >
          <button
            type="button"
            onClick={() =>
              setBilling("monthly")
            }
            className={`
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-bold
              transition
              ${
                billing === "monthly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() =>
              setBilling("yearly")
            }
            className={`
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-bold
              transition
              ${
                billing === "yearly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            Yearly

            <span className="ml-2 text-[10px] text-green-500">
              SAVE
            </span>

          </button>
        </div>

      </section>

      {/* =====================================================
          PAYMENT MESSAGE
      ====================================================== */}

      {message && (
        <section
          id="pricing-message"
          className={`
            mx-auto
            mt-8
            max-w-4xl
            rounded-2xl
            border
            p-5
            text-center
            ${getMessageStyle()}
          `}
        >
          <p className="font-semibold">
            {message}
          </p>

          {messageType !== "success" && (
            <p className="mt-2 text-xs text-gray-500">
              Your plan is activated only after
              successful payment verification.
            </p>
          )}

        </section>
      )}

      {/* =====================================================
          PRICING CARDS
      ====================================================== */}

      <section
        className="
          mx-auto
          mt-14
          grid
          max-w-[1500px]
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-5
        "
      >
        {plans.map((plan) => {
          const accent =
            getAccentClasses(plan.accent);

          const price =
            billing === "monthly"
              ? plan.monthly
              : plan.yearly;

          const period =
            billing === "monthly"
              ? "/month"
              : "/year";

          const isLoading =
            loadingPlan === plan.name;

          return (
            <article
              key={plan.name}
              className={`
                relative
                flex
                h-full
                flex-col
                rounded-[28px]
                border
                bg-[#08090d]/90
                p-6
                backdrop-blur-xl
                transition
                ${accent.border}
                ${accent.glow}
                ${
                  plan.name === "Creator"
                    ? "xl:-translate-y-3"
                    : ""
                }
              `}
            >

              {/* BADGE */}

              {plan.badge && (
                <div className="mb-5">

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-[10px]
                      font-black
                      tracking-wider
                      ${accent.badge}
                    `}
                  >
                    {plan.badge}
                  </span>

                </div>
              )}

              {/* ICON */}

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  text-2xl
                  ${accent.icon}
                `}
              >
                {plan.icon}
              </div>

              {/* PLAN */}

              <h2 className="mt-5 text-2xl font-black">
                {plan.name}
              </h2>

              <p className="mt-2 min-h-[72px] text-sm leading-6 text-gray-500">
                {plan.description}
              </p>

              {/* PRICE */}

              <div className="mt-6">

                <div className="flex items-end gap-2">

                  <span className="text-4xl font-black">
                    ₹{price}
                  </span>

                  <span className="pb-1 text-sm text-gray-600">
                    {period}
                  </span>

                </div>

                {billing === "yearly" &&
                  plan.monthly > 0 && (
                    <p className="mt-2 text-xs text-green-400">
                      Save ₹
                      {plan.monthly * 12 -
                        plan.yearly}{" "}
                      per year
                    </p>
                  )}

                {plan.monthly === 0 && (
                  <p className="mt-2 text-xs text-gray-600">
                    No payment required
                  </p>
                )}

              </div>

              {/* BUTTON */}

              <div className="mt-7">

                {plan.name === "Free" ? (

                  <Link
                    to="/ai-tools"
                    className="
                      block
                      w-full
                      rounded-xl
                      border
                      border-white/15
                      bg-white/[0.04]
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-black
                      transition
                      hover:bg-white/[0.08]
                    "
                  >
                    Continue Free →
                  </Link>

                ) : (

                  <button
                    type="button"
                    disabled={Boolean(
                      loadingPlan
                    )}
                    onClick={() =>
                      handlePaidPlan(plan)
                    }
                    className={`
                      w-full
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-black
                      transition
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      ${accent.button}
                    `}
                  >
                    {isLoading
                      ? "Opening Payment..."
                      : `Choose ${plan.name} →`}
                  </button>

                )}

              </div>

              {/* DIVIDER */}

              <div className="my-7 border-t border-white/[0.07]" />

              {/* FEATURES */}

              <div className="flex-1">

                <p className="mb-5 text-sm font-black">
                  What's included
                </p>

                <ul className="space-y-4">

                  {plan.features.map(
                    (feature) => (
                      <li
                        key={feature}
                        className="
                          flex
                          items-start
                          gap-3
                          text-sm
                          leading-5
                          text-gray-400
                        "
                      >
                        <span className="mt-[1px] text-green-400">
                          ✓
                        </span>

                        <span>
                          {feature}
                        </span>

                      </li>
                    )
                  )}

                </ul>

              </div>

            </article>
          );
        })}
      </section>

      {/* =====================================================
          SECURE PAYMENTS
      ====================================================== */}

      <section className="mx-auto mt-20 max-w-5xl">

        <div
          className="
            grid
            grid-cols-1
            gap-4
            rounded-[28px]
            border
            border-green-400/15
            bg-green-400/[0.03]
            p-6
            sm:grid-cols-3
            sm:p-8
          "
        >

          <div className="text-center">
            <div className="text-2xl">
              🔐
            </div>

            <p className="mt-2 font-black">
              Secure Checkout
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Payments handled through Razorpay.
            </p>
          </div>

          <div className="text-center">
            <div className="text-2xl">
              📱
            </div>

            <p className="mt-2 font-black">
              Multiple Methods
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Available methods are shown by
              Razorpay Checkout.
            </p>
          </div>

          <div className="text-center">
            <div className="text-2xl">
              ✅
            </div>

            <p className="mt-2 font-black">
              Server Verified
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Successful payments are verified
              by our backend.
            </p>
          </div>

        </div>

      </section>

      {/* =====================================================
          WHY UPGRADE
      ====================================================== */}

      <section className="mx-auto mt-24 max-w-7xl">

        <div className="text-center">

          <p className="text-sm font-black text-cyan-400">
            ✨ WHY UPGRADE?
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            More tools. More resources.
            More possibilities.
          </h2>

        </div>

        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {[
            [
              "🤖",
              "AI Resources",
              "Explore additional AI resources and useful workflows.",
            ],

            [
              "🎬",
              "Creator Tools",
              "Unlock more tools designed for YouTube and digital creators.",
            ],

            [
              "📚",
              "Premium Library",
              "Access additional templates, prompts and creator resources.",
            ],

            [
              "🚀",
              "Future Features",
              "Higher plans can receive access to selected new features earlier.",
            ],
          ].map(
            ([icon, title, text]) => (
              <article
                key={title}
                className="
                  rounded-3xl
                  border
                  border-white/[0.08]
                  bg-black/25
                  p-6
                "
              >

                <div className="text-3xl">
                  {icon}
                </div>

                <h3 className="mt-4 text-lg font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {text}
                </p>

              </article>
            )
          )}
        </div>

      </section>

      {/* =====================================================
          ONE TIME PACKS
      ====================================================== */}

      <section className="mx-auto mt-24 max-w-7xl">

        <div className="text-center">

          <p className="text-sm font-black text-pink-400">
            🛍️ NO SUBSCRIPTION?
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            One-Time Creator Packs
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            One-time packs will be connected
            separately after subscription
            payments are completed.
          </p>

        </div>

        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {oneTimePacks.map((pack) => (
            <article
              key={pack.name}
              className="
                rounded-[26px]
                border
                border-white/[0.08]
                bg-[#090a0f]/85
                p-6
              "
            >

              <div className="text-3xl">
                {pack.icon}
              </div>

              <h3 className="mt-5 text-lg font-black">
                {pack.name}
              </h3>

              <p className="mt-2 min-h-[72px] text-sm leading-6 text-gray-500">
                {pack.description}
              </p>

              <p className="mt-5 text-3xl font-black">
                {pack.price}
              </p>

              <button
                type="button"
                onClick={() =>
                  showMessage(
                    `${pack.icon} ${pack.name} payment integration will be added after plan payments are tested.`,
                    "info"
                  )
                }
                className="
                  mt-5
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-4
                  py-3
                  text-sm
                  font-bold
                  transition
                  hover:border-pink-400/30
                  hover:text-pink-300
                "
              >
                Coming Soon
              </button>

            </article>
          ))}
        </div>

      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <section className="mx-auto mt-24 max-w-4xl">

        <div className="text-center">

          <p className="text-sm font-black text-purple-400">
            ❓ PRICING FAQ
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Simple Questions
          </h2>

        </div>

        <div className="mt-8 space-y-4">

          {[
            [
              "Can I use AI Future Tamil for free?",
              "Yes. The Free plan is available at ₹0 and provides access to selected basic features.",
            ],

            [
              "Can I upgrade later?",
              "Yes. You can choose one of the available paid plans when payments are enabled.",
            ],

            [
              "How is a payment confirmed?",
              "After checkout completes, AI Future Tamil sends the payment details to the backend for Razorpay signature verification.",
            ],

            [
              "Does payment immediately unlock premium features?",
              "Not yet. Subscription storage and premium feature locking will be connected with Supabase in the next stage.",
            ],
          ].map(
            ([question, answer]) => (
              <details
                key={question}
                className="
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-black/25
                  p-5
                "
              >

                <summary className="cursor-pointer font-bold">
                  {question}
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-500">
                  {answer}
                </p>

              </details>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section
        className="
          mx-auto
          mt-24
          max-w-5xl
          rounded-[32px]
          border
          border-purple-400/20
          bg-gradient-to-r
          from-cyan-500/[0.05]
          via-purple-500/[0.07]
          to-pink-500/[0.05]
          px-6
          py-12
          text-center
          sm:px-10
        "
      >

        <div className="text-4xl">
          🚀
        </div>

        <h2 className="mt-4 text-3xl font-black">
          Start with Free
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-gray-400">
          Explore AI Future Tamil first.
          Upgrade later when you need additional
          tools and resources.
        </p>

        <Link
          to="/ai-tools"
          className="
            mt-7
            inline-block
            rounded-xl
            bg-white
            px-8
            py-4
            font-black
            text-black
            transition
            hover:bg-gray-200
          "
        >
          Start Exploring →
        </Link>

      </section>

    </main>
  );
}

export default Pricing;