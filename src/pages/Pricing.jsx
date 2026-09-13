import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { supabase } from "../supabase/client";

/* =========================================================
   RAZORPAY
========================================================= */

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const oldScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (oldScript) {
      oldScript.onload = () =>
        resolve(true);

      oldScript.onerror = () =>
        resolve(false);

      return;
    }

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () =>
      resolve(true);

    script.onerror = () =>
      resolve(false);

    document.body.appendChild(
      script
    );
  });
}

/* =========================================================
   HELPERS
========================================================= */

function parsePrice(value) {
  const parsed =
    parseFloat(
      String(value ?? "0").replace(
        /[^0-9.]/g,
        ""
      )
    );

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

/* =========================================================
   STYLE
========================================================= */

function getAccentClasses(
  accent
) {
  const styles = {
    gray: {
      border:
        "border-white/10",

      glow: "",

      icon:
        "bg-white/[0.05] border-white/10",

      button:
        "border border-white/15 bg-white/[0.03] hover:bg-white/[0.07]",

      badge:
        "border-white/10 bg-white/[0.05] text-gray-300",
    },

    cyan: {
      border:
        "border-cyan-400/30",

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
      border:
        "border-pink-400/40",

      glow:
        "shadow-[0_0_45px_rgba(236,72,153,0.12)]",

      icon:
        "bg-pink-400/[0.08] border-pink-400/25",

      button:
        "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400",

      badge:
        "border-pink-400/30 bg-pink-400/[0.10] text-pink-300",
    },

    blue: {
      border:
        "border-blue-400/30",

      glow:
        "shadow-[0_0_35px_rgba(59,130,246,0.08)]",

      icon:
        "bg-blue-400/[0.07] border-blue-400/20",

      button:
        "border border-blue-400/25 bg-blue-400/[0.07] text-blue-200",

      badge:
        "border-blue-400/25 bg-blue-400/[0.08] text-blue-300",
    },

    purple: {
      border:
        "border-purple-400/40",

      glow:
        "shadow-[0_0_45px_rgba(168,85,247,0.12)]",

      icon:
        "bg-purple-400/[0.08] border-purple-400/25",

      button:
        "border border-purple-400/30 bg-purple-400/[0.08] text-purple-200",

      badge:
        "border-purple-400/30 bg-purple-400/[0.10] text-purple-300",
    },
  };

  return (
    styles[accent] ||
    styles.gray
  );
}

/* =========================================================
   PRICING
========================================================= */

function Pricing() {
  const [
    plans,
    setPlans,
  ] = useState([]);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    billing,
    setBilling,
  ] = useState("monthly");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState("");

  const [
    loadingPlan,
    setLoadingPlan,
  ] = useState("");

  /* =========================================================
     LOAD CMS PRICING
  ========================================================= */

  const loadPlans =
    useCallback(async () => {
      try {
        setPageLoading(true);

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "pricing_plans"
            )
            .select("*")
            .eq(
              "active",
              true
            )
            .order(
              "sort_order",
              {
                ascending:
                  true,
              }
            );

        if (error) {
          throw error;
        }

        const formattedPlans =
          (data || []).map(
            (plan) => {
              const monthly =
                Number(
                  plan.monthly_price ??
                    parsePrice(
                      plan.price
                    )
                );

              const yearly =
                Number(
                  plan.yearly_price ??
                    0
                );

              return {
                ...plan,

                features:
                  Array.isArray(
                    plan.features
                  )
                    ? plan.features
                    : [],

                icon:
                  plan.icon ||
                  (
                    plan.name ===
                    "Free"
                      ? "🌱"
                      : "💎"
                  ),

                accent:
                  plan.accent ||
                  (
                    plan.popular
                      ? "pink"
                      : "purple"
                  ),

                monthly:
                  Number.isFinite(
                    monthly
                  )
                    ? monthly
                    : 0,

                yearly:
                  Number.isFinite(
                    yearly
                  )
                    ? yearly
                    : 0,
              };
            }
          );

        setPlans(
          formattedPlans
        );

      } catch (error) {
        console.error(
          "Pricing load error:",
          error
        );

        setMessage(
          `❌ ${
            error?.message ||
            "Unable to load pricing plans."
          }`
        );

        setMessageType(
          "error"
        );

      } finally {
        setPageLoading(
          false
        );
      }
    }, []);

  /* =========================================================
     REALTIME CMS
  ========================================================= */

  useEffect(() => {
    loadPlans();

    const channel =
      supabase
        .channel(
          "pricing-cms-public"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "pricing_plans",
          },
          () => {
            loadPlans();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadPlans]);

  /* =========================================================
     MESSAGE
  ========================================================= */

  function showMessage(
    text,
    type = "info"
  ) {
    setMessage(text);

    setMessageType(
      type
    );

    setTimeout(() => {
      document
        .getElementById(
          "pricing-message"
        )
        ?.scrollIntoView({
          behavior:
            "smooth",
          block:
            "center",
        });
    }, 100);
  }

  /* =========================================================
     SESSION
  ========================================================= */

  async function getLoggedInSession() {
    const {
      data,
      error,
    } =
      await supabase.auth
        .getSession();

    if (error) {
      console.error(
        error
      );

      return null;
    }

    return (
      data?.session ||
      null
    );
  }

  /* =========================================================
     PAYMENT
  ========================================================= */

  async function handlePaidPlan(
    plan
  ) {
    if (loadingPlan) {
      return;
    }

    try {
      setMessage("");

      setMessageType("");

      setLoadingPlan(
        plan.name
      );

      const session =
        await getLoggedInSession();

      if (
        !session ||
        !session.access_token
      ) {
        setLoadingPlan("");

        showMessage(
          "🔐 Please login before purchasing a plan.",
          "error"
        );

        return;
      }

      const razorpayLoaded =
        await loadRazorpayScript();

      if (
        !razorpayLoaded
      ) {
        throw new Error(
          "Unable to load Razorpay Checkout."
        );
      }

      /*
        IMPORTANT:
        Price frontend-la
        send pannala.

        Backend plan name +
        billing base panni
        amount decide pannum.

        Existing secure
        payment system
        preserve aagudhu.
      */

      const orderResponse =
        await fetch(
          "/api/create-order",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body:
              JSON.stringify(
                {
                  plan:
                    plan.name,

                  billing,
                }
              ),
          }
        );

      let orderData;

      try {
        orderData =
          await orderResponse
            .json();

      } catch {
        throw new Error(
          "Server returned invalid response."
        );
      }

      if (
        !orderResponse.ok
      ) {
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
          "Payment information incomplete."
        );
      }

      const options = {
        key:
          orderData.keyId,

        amount:
          orderData.amount,

        currency:
          orderData.currency ||
          "INR",

        name:
          "AI Future Tamil",

        description:
          `${plan.name} Plan - ${
            billing ===
            "monthly"
              ? "Monthly"
              : "Yearly"
          }`,

        order_id:
          orderData.orderId,

        handler:
          async function (
            razorpayResponse
          ) {
            try {
              showMessage(
                "🔐 Payment received. Verifying securely...",
                "info"
              );

              const latestSession =
                await getLoggedInSession();

              if (
                !latestSession
                  ?.access_token
              ) {
                throw new Error(
                  "Login session expired."
                );
              }

              const verifyResponse =
                await fetch(
                  "/api/verify-payment",
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        `Bearer ${latestSession.access_token}`,
                    },

                    body:
                      JSON.stringify(
                        {
                          razorpay_order_id:
                            razorpayResponse
                              .razorpay_order_id,

                          razorpay_payment_id:
                            razorpayResponse
                              .razorpay_payment_id,

                          razorpay_signature:
                            razorpayResponse
                              .razorpay_signature,
                        }
                      ),
                  }
                );

              let verifyData;

              try {
                verifyData =
                  await verifyResponse
                    .json();

              } catch {
                throw new Error(
                  "Payment verification server returned invalid response."
                );
              }

              if (
                !verifyResponse.ok ||
                !verifyData
                  ?.success ||
                !verifyData
                  ?.verified
              ) {
                throw new Error(
                  verifyData
                    ?.error ||
                  "Payment verification failed."
                );
              }

              let expiryText =
                "";

              if (
                verifyData
                  .expiresAt
              ) {
                expiryText =
                  ` Valid until ${new Date(
                    verifyData
                      .expiresAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}.`;
              }

              showMessage(
                `✅ Payment verified! ${
                  verifyData.plan ||
                  plan.name
                } plan activated.${expiryText}`,
                "success"
              );

            } catch (
              error
            ) {
              console.error(
                error
              );

              showMessage(
                `⚠️ ${
                  error?.message ||
                  "Payment verification failed."
                }`,
                "error"
              );

            } finally {
              setLoadingPlan(
                ""
              );
            }
          },

        theme: {
          color:
            "#8b5cf6",
        },

        modal: {
          escape:
            true,

          backdropclose:
            false,

          ondismiss() {
            setLoadingPlan(
              ""
            );

            showMessage(
              "Payment checkout closed.",
              "info"
            );
          },
        },

        notes: {
          plan:
            plan.name,

          billing,

          website:
            "AI Future Tamil",
        },

        retry: {
          enabled:
            true,
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        (response) => {
          setLoadingPlan(
            ""
          );

          showMessage(
            `❌ ${
              response
                ?.error
                ?.description ||
              "Payment failed."
            }`,
            "error"
          );
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
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

  /* =========================================================
     MESSAGE STYLE
  ========================================================= */

  function getMessageStyle() {
    if (
      messageType ===
      "success"
    ) {
      return "border-green-400/30 bg-green-400/[0.07] text-green-200";
    }

    if (
      messageType ===
      "error"
    ) {
      return "border-red-400/30 bg-red-400/[0.07] text-red-200";
    }

    return "border-cyan-400/20 bg-cyan-400/[0.05] text-cyan-200";
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-transparent px-5 py-16 text-white sm:px-6 sm:py-20">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="mx-auto max-w-5xl text-center">

        <div className="inline-flex rounded-full border border-purple-400/20 bg-purple-400/[0.06] px-4 py-2 text-sm font-bold text-purple-300">
          💎 Simple & Affordable
          Pricing
        </div>

        <h1 className="mt-6 bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-4xl font-black text-transparent sm:text-5xl md:text-6xl">
          Choose Your Plan
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-gray-400">
          Start free and upgrade
          whenever you need more
          resources.
        </p>

        {/* BILLING SWITCH */}

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/10 bg-black/30 p-1.5">

          <button
            type="button"
            onClick={() =>
              setBilling(
                "monthly"
              )
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              billing ===
              "monthly"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() =>
              setBilling(
                "yearly"
              )
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              billing ===
              "yearly"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Yearly
          </button>

        </div>

      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message && (
        <section
          id="pricing-message"
          className={`mx-auto mt-8 max-w-4xl rounded-2xl border p-5 text-center ${getMessageStyle()}`}
        >
          {message}
        </section>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {pageLoading ? (

        <div className="py-24 text-center">

          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/10 border-t-purple-400" />

          <p className="mt-5 text-gray-500">
            Loading pricing...
          </p>

        </div>

      ) : plans.length ===
        0 ? (

        /* ===================================================
           EMPTY
        =================================================== */

        <section className="mx-auto mt-14 max-w-3xl rounded-[28px] border border-white/10 bg-white/[0.03] p-10 text-center">

          <div className="text-5xl">
            💳
          </div>

          <h2 className="mt-5 text-2xl font-black">
            Pricing plans coming
            soon
          </h2>

          <p className="mt-3 text-gray-500">
            Pricing plans can be
            managed from Admin CMS.
          </p>

        </section>

      ) : (

        /* ===================================================
           PRICING GRID
        =================================================== */

        <section className="mx-auto mt-14 grid max-w-[1500px] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">

          {plans.map(
            (plan) => {
              const accent =
                getAccentClasses(
                  plan.accent
                );

              const price =
                billing ===
                "monthly"
                  ? plan.monthly
                  : plan.yearly;

              const free =
                Number(
                  plan.monthly
                ) === 0 &&
                Number(
                  plan.yearly
                ) === 0;

              return (
                <article
                  key={plan.id}
                  className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-[#08090d]/90 p-6 transition-all duration-300 hover:-translate-y-1 ${accent.border} ${accent.glow}`}
                >

                  {/* POPULAR GLOW */}

                  {plan.popular && (
                    <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl" />
                  )}

                  {/* BADGE */}

                  {(plan.badge ||
                    plan.popular) && (

                    <div className="relative mb-5">

                      <span
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${accent.badge}`}
                      >
                        {plan.badge ||
                          "POPULAR"}
                      </span>

                    </div>
                  )}

                  {/* ICON */}

                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl ${accent.icon}`}
                  >
                    {plan.icon}
                  </div>

                  {/* TITLE */}

                  <h2 className="relative mt-5 text-2xl font-black">
                    {plan.name}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="relative mt-2 min-h-[72px] text-sm leading-6 text-gray-500">
                    {plan.description}
                  </p>

                  {/* PRICE */}

                  <div className="relative mt-6">

                    <div className="flex items-end gap-2">

                      <span className="text-4xl font-black">
                        ₹{price}
                      </span>

                      {!free && (
                        <span className="pb-1 text-sm text-gray-600">

                          {billing ===
                          "monthly"
                            ? "/month"
                            : "/year"}

                        </span>
                      )}

                    </div>

                  </div>

                  {/* BUTTON */}

                  <div className="relative mt-7">

                    {free ? (

                      <Link
                        to={
                          plan.button_url ||
                          "/ai-tools"
                        }
                        className="block rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-center font-black transition hover:bg-white/[0.08]"
                      >
                        {plan.button_text ||
                          "Continue Free"}
                      </Link>

                    ) : (

                      <button
                        type="button"
                        disabled={Boolean(
                          loadingPlan
                        )}
                        onClick={() =>
                          handlePaidPlan(
                            plan
                          )
                        }
                        className={`w-full rounded-xl px-4 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${accent.button}`}
                      >

                        {loadingPlan ===
                        plan.name
                          ? "Opening Payment..."
                          : plan.button_text ||
                            `Choose ${plan.name}`}

                      </button>

                    )}

                  </div>

                  <div className="relative my-7 border-t border-white/[0.07]" />

                  {/* FEATURES */}

                  <div className="relative flex-1">

                    <p className="mb-5 font-black">
                      What's included
                    </p>

                    {plan.features
                      .length > 0 ? (

                      <ul className="space-y-4">

                        {plan.features.map(
                          (
                            feature,
                            index
                          ) => (

                            <li
                              key={`${plan.id}-${index}-${feature}`}
                              className="flex gap-3 text-sm text-gray-400"
                            >

                              <span className="shrink-0 text-green-400">
                                ✓
                              </span>

                              <span>
                                {feature}
                              </span>

                            </li>
                          )
                        )}

                      </ul>

                    ) : (

                      <p className="text-sm text-gray-600">
                        Features will
                        be updated soon.
                      </p>

                    )}

                  </div>

                </article>
              );
            }
          )}

        </section>
      )}

    </main>
  );
}

export default Pricing;