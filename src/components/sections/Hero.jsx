import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";

function Hero() {
  const { language } = useLanguage();

  const tamil = language === "ta";

  const t = (en, ta) => (tamil ? ta : en);

  return (
    <section
      className="
        relative
        overflow-hidden
        px-4
        pb-4
        pt-0
        sm:px-6
        lg:px-8
        lg:pb-5
        lg:pt-0
      "
    >
      <style>{`
        @keyframes heroBackRing {
          0%,100% {
            opacity:.82;
            filter:brightness(1);
          }
          50% {
            opacity:1;
            filter:brightness(1.3);
          }
        }

        @keyframes heroOuterOrbit {
          from {
            transform:rotate(0deg);
          }
          to {
            transform:rotate(360deg);
          }
        }

        @keyframes heroOuterOrbitReverse {
          from {
            transform:rotate(360deg);
          }
          to {
            transform:rotate(0deg);
          }
        }

        @keyframes heroFloat {
          0%,100% {
            transform:
              translateY(0px)
              rotate(var(--hero-rotate,0deg));
          }

          50% {
            transform:
              translateY(-10px)
              rotate(var(--hero-rotate,0deg));
          }
        }

        @keyframes heroChipFloat {
          0%,100% {
            transform:translateY(0px);
          }

          50% {
            transform:translateY(-9px);
          }
        }

        @keyframes heroSpark {
          0%,100% {
            opacity:.18;
            transform:scale(.7);
          }

          50% {
            opacity:1;
            transform:scale(1.45);
          }
        }

        @keyframes heroTitleGlow {
          0%,100% {
            filter:
              drop-shadow(
                0 0 8px
                rgba(236,72,153,.22)
              )
              drop-shadow(
                0 0 12px
                rgba(34,211,238,.10)
              );
          }

          50% {
            filter:
              drop-shadow(
                0 0 13px
                rgba(236,72,153,.38)
              )
              drop-shadow(
                0 0 23px
                rgba(34,211,238,.20)
              );
          }
        }

        @keyframes heroPlatformPulse {
          0%,100% {
            opacity:.82;
            transform:
              translateX(-50%)
              scaleX(1);
          }

          50% {
            opacity:1;
            transform:
              translateX(-50%)
              scaleX(1.025);
          }
        }

        @keyframes heroPlatformSpin {
          from {
            transform:
              translateX(-50%)
              rotate(0deg);
          }

          to {
            transform:
              translateX(-50%)
              rotate(360deg);
          }
        }

        @keyframes heroCircuit {
          0%,100% {
            opacity:.20;
          }

          50% {
            opacity:.65;
          }
        }

        @keyframes heroScan {
          0% {
            transform:translateY(120px);
            opacity:0;
          }

          15% {
            opacity:.6;
          }

          85% {
            opacity:.6;
          }

          100% {
            transform:translateY(-440px);
            opacity:0;
          }
        }

        @keyframes heroButtonShine {
          0% {
            transform:
              translateX(-180%)
              rotate(18deg);
          }

          70%,
          100% {
            transform:
              translateX(360%)
              rotate(18deg);
          }
        }

        @keyframes heroFloorPulse {
          0%,100% {
            opacity:.45;
          }

          50% {
            opacity:.85;
          }
        }

        .hero-back-ring {
          animation:
            heroBackRing
            4s ease-in-out infinite;
        }

        .hero-orbit {
          animation:
            heroOuterOrbit
            24s linear infinite;
        }

        .hero-orbit-reverse {
          animation:
            heroOuterOrbitReverse
            34s linear infinite;
        }

        .hero-float {
          animation:
            heroFloat
            4.5s ease-in-out infinite;
        }

        .hero-chip {
          animation:
            heroChipFloat
            4.2s ease-in-out infinite;
        }

        .hero-spark {
          animation:
            heroSpark
            2.4s ease-in-out infinite;
        }

        .hero-title-glow {
          animation:
            heroTitleGlow
            4s ease-in-out infinite;
        }

        .hero-platform-pulse {
          animation:
            heroPlatformPulse
            3.4s ease-in-out infinite;
        }

        .hero-platform-spin {
          animation:
            heroPlatformSpin
            18s linear infinite;
        }

        .hero-circuit {
          animation:
            heroCircuit
            3.2s ease-in-out infinite;
        }

        .hero-scan {
          animation:
            heroScan
            5s linear infinite;
        }

        .hero-floor {
          animation:
            heroFloorPulse
            3.2s ease-in-out infinite;
        }

        .hero-shine {
          position:relative;
          overflow:hidden;
        }

        .hero-shine::after {
          content:"";
          position:absolute;
          top:-100%;
          bottom:-100%;
          left:-30%;
          width:17%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.38),
              transparent
            );
          animation:
            heroButtonShine
            4.5s ease-in-out infinite;
          pointer-events:none;
        }

        @media
        (prefers-reduced-motion: reduce) {
          .hero-back-ring,
          .hero-orbit,
          .hero-orbit-reverse,
          .hero-float,
          .hero-chip,
          .hero-spark,
          .hero-title-glow,
          .hero-platform-pulse,
          .hero-platform-spin,
          .hero-circuit,
          .hero-scan,
          .hero-floor,
          .hero-shine::after {
            animation:none !important;
          }
        }
      `}</style>

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_76%_42%,rgba(37,99,235,0.11),transparent_30%),radial-gradient(circle_at_83%_46%,rgba(168,85,247,0.11),transparent_36%),radial-gradient(circle_at_10%_45%,rgba(6,182,212,0.035),transparent_31%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.10]
        "
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.035) 1px, transparent 1px)",
          backgroundSize:
            "40px 40px",
          maskImage:
            "radial-gradient(circle at 75% 55%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 75% 55%, black 0%, transparent 70%)",
        }}
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1600px]
        "
      >
        <div
          className="
            grid
            min-h-[730px]
            items-center
            gap-5
            xl:grid-cols-[0.98fr_1.02fr]
            xl:gap-0
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-30
              max-w-[780px]
              py-0
            "
          >
            {/* TITLE */}

            <h1
              className="
                hero-title-glow
                text-[50px]
                font-black
                leading-[1.01]
                tracking-[-0.045em]
                sm:text-[62px]
                lg:text-[76px]
                2xl:text-[84px]
              "
            >
              <span
                className="
                  bg-gradient-to-r
                  from-fuchsia-400
                  via-pink-300
                  to-purple-400
                  bg-clip-text
                  text-transparent
                "
              >
                {t(
                  "Learn AI.",
                  "AI கற்றுக்கொள்ளுங்கள்."
                )}
              </span>

              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-cyan-300
                  via-sky-400
                  via-55%
                  to-purple-400
                  bg-clip-text
                  text-transparent
                "
              >
                {t(
                  "Build Your Future.",
                  "உங்கள் எதிர்காலத்தை உருவாக்குங்கள்."
                )}
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-8
                max-w-[720px]
                text-base
                leading-8
                text-gray-300
                sm:text-[18px]
              "
            >
              {t(
                "Learn AI, YouTube, Instagram, Content Creation, Technology, Android Apps, Digital Products and more — all in one place.",
                "AI, YouTube, Instagram, Content Creation, Technology, Android Apps, Digital Products மற்றும் பலவற்றை ஒரே இடத்தில் கற்றுக்கொள்ளுங்கள்."
              )}
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                mt-9
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:flex-wrap
              "
            >
              <Link
                to="/courses"
                className="
                  hero-shine
                  inline-flex
                  min-h-[58px]
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-400
                  via-sky-400
                  to-blue-500
                  px-7
                  py-3
                  text-sm
                  font-black
                  text-black
                  shadow-[0_0_30px_rgba(34,211,238,.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_0_45px_rgba(34,211,238,.30)]
                "
              >
                🚀

                {t(
                  "Start Learning",
                  "கற்க தொடங்கு"
                )}

                <span>
                  →
                </span>
              </Link>

              <Link
  to="/utility-hub"
  className="
    inline-flex
    min-h-[58px]
    items-center
    justify-center
    gap-3
    rounded-xl
    border
    border-cyan-400/45
    bg-gradient-to-r
    from-cyan-500/[0.10]
    via-blue-500/[0.08]
    to-purple-500/[0.10]
    px-7
    py-3
    text-sm
    font-black
    text-white
    backdrop-blur-xl
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-300/80
    hover:bg-cyan-400/[0.12]
    hover:shadow-[0_0_30px_rgba(34,211,238,.18)]
  "
>
  🧰

  {t(
    "Utility Hub",
    "Utility Hub"
  )}
</Link>

              <Link
                to="/smart-hub"
                className="
                  inline-flex
                  min-h-[58px]
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-purple-400/55
                  bg-purple-500/[0.08]
                  px-7
                  py-3
                  text-sm
                  font-black
                  text-purple-100
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-purple-300
                  hover:bg-purple-500/[0.14]
                  hover:shadow-[0_0_30px_rgba(168,85,247,.16)]
                "
              >
                ⚡

                {t(
                  "Open Smart Hub",
                  "Smart Hub திறக்க"
                )}
              </Link>
            </div>

            {/* =================================================
                BENEFITS
            ================================================= */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-x-7
                gap-y-3
                text-sm
                font-medium
                text-gray-400
              "
            >
              <span>
                ✨ Beginner Friendly
              </span>

              <span
                className="
                  hidden
                  h-5
                  w-px
                  bg-white/15
                  sm:block
                "
              />

              <span>
                ⚡ Learn Faster
              </span>

              <span
                className="
                  hidden
                  h-5
                  w-px
                  bg-white/15
                  sm:block
                "
              />

              <span>
                🎯 Practical Content
              </span>
            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div
              className="
                mt-10
                grid
                max-w-[750px]
                grid-cols-2
                overflow-hidden
                rounded-[22px]
                border
                border-cyan-400/35
                bg-[#050a15]/82
                shadow-[0_20px_70px_rgba(0,0,0,.36),0_0_25px_rgba(59,130,246,.05)]
                backdrop-blur-xl
                sm:grid-cols-4
              "
            >
              <HeroStat
                icon="👥"
                value="10K+"
                label="Learners"
              />

              <HeroStat
                icon="📚"
                value="500+"
                label="AI Resources"
              />

              <HeroStat
                icon="🎬"
                value="100+"
                label="Lessons"
              />

              <HeroStat
                icon="⭐"
                value="4.8★"
                label="Community"
              />
            </div>
          </div>

          {/* =================================================
              RIGHT VISUAL
          ================================================= */}

          <div
            className="
              relative
              z-20
              mx-auto
              hidden
              min-h-[730px]
              w-full
              max-w-[780px]
              items-end
              justify-center
              xl:flex
            "
          >
            {/* =================================================
                REAR BLUE / PURPLE ATMOSPHERE
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[42%]
                h-[590px]
                w-[590px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-blue-600/[0.11]
                blur-[75px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-[56%]
                top-[43%]
                h-[490px]
                w-[490px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-purple-600/[0.12]
                blur-[85px]
              "
            />

            {/* =================================================
                REAR CIRCUIT SYSTEM
            ================================================= */}

            <div
              className="
                hero-circuit
                pointer-events-none
                absolute
                right-[-1%]
                top-[10%]
                h-[420px]
                w-[380px]
              "
            >
              <CircuitLine
                top="48px"
                width="215px"
              />

              <CircuitLine
                top="82px"
                width="190px"
                right="20px"
              />

              <CircuitLine
                top="116px"
                width="160px"
                right="42px"
              />

              <CircuitLine
                top="150px"
                width="135px"
                right="65px"
              />

              <CircuitLine
                top="184px"
                width="110px"
                right="90px"
              />

              <span
                className="
                  absolute
                  right-[74px]
                  top-[48px]
                  h-[240px]
                  w-px
                  bg-gradient-to-b
                  from-cyan-400/55
                  to-transparent
                "
              />

              <span
                className="
                  absolute
                  right-[130px]
                  top-[82px]
                  h-[200px]
                  w-px
                  bg-gradient-to-b
                  from-blue-500/45
                  to-transparent
                "
              />

              <span
                className="
                  absolute
                  right-[185px]
                  top-[116px]
                  h-[160px]
                  w-px
                  bg-gradient-to-b
                  from-purple-400/45
                  to-transparent
                "
              />
            </div>

            {/* =================================================
                OUTER ORBITS BEHIND MAN
            ================================================= */}

            <div
              className="
                hero-orbit
                pointer-events-none
                absolute
                left-1/2
                top-[42%]
                h-[590px]
                w-[590px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-blue-400/20
              "
            >
              <span
                className="
                  absolute
                  left-1/2
                  top-[-6px]
                  h-3
                  w-3
                  rounded-full
                  bg-cyan-300
                  shadow-[0_0_22px_#22d3ee]
                "
              />

              <span
                className="
                  absolute
                  bottom-[8%]
                  left-[11%]
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-fuchsia-400
                  shadow-[0_0_22px_#e879f9]
                "
              />

              <span
                className="
                  absolute
                  right-[5%]
                  top-[30%]
                  h-2
                  w-2
                  rounded-full
                  bg-blue-400
                  shadow-[0_0_18px_#60a5fa]
                "
              />
            </div>

            <div
              className="
                hero-orbit-reverse
                pointer-events-none
                absolute
                left-1/2
                top-[42%]
                h-[515px]
                w-[515px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-purple-400/25
              "
            />

            {/* =================================================
                BRIGHT MAIN NEON PORTAL
            ================================================= */}

            <div
              className="
                hero-back-ring
                pointer-events-none
                absolute
                left-1/2
                top-[42%]
                h-[455px]
                w-[455px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border-[5px]
                border-cyan-300
                shadow-[0_0_10px_#22d3ee,0_0_30px_rgba(34,211,238,.85),0_0_60px_rgba(37,99,235,.45)]
              "
            />

            <div
              className="
                hero-back-ring
                pointer-events-none
                absolute
                left-1/2
                top-[42%]
                h-[470px]
                w-[470px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border-[4px]
                border-fuchsia-400
                shadow-[0_0_14px_rgba(232,121,249,.9),0_0_42px_rgba(168,85,247,.5)]
              "
              style={{
                clipPath:
                  "polygon(50% 0%,100% 0%,100% 100%,50% 100%,50% 95%,95% 95%,95% 5%,50% 5%)",
              }}
            />

            {/* =================================================
                DIGITAL DOTS
            ================================================= */}

            {[
              ["15%", "9%", "#22d3ee"],
              ["78%", "8%", "#e879f9"],
              ["92%", "24%", "#22d3ee"],
              ["7%", "34%", "#8b5cf6"],
              ["94%", "51%", "#3b82f6"],
              ["12%", "65%", "#ec4899"],
              ["71%", "4%", "#22d3ee"],
              ["30%", "5%", "#a855f7"],
              ["87%", "69%", "#22d3ee"],
              ["20%", "72%", "#8b5cf6"],
            ].map(
              (
                [
                  left,
                  top,
                  color,
                ],
                index
              ) => (
                <span
                  key={index}
                  className="
                    hero-spark
                    pointer-events-none
                    absolute
                    z-[5]
                    h-2
                    w-2
                    rounded-full
                  "
                  style={{
                    left,
                    top,
                    backgroundColor:
                      color,
                    boxShadow:
                      `0 0 16px ${color}`,
                    animationDelay:
                      `${index * 0.28}s`,
                  }}
                />
              )
            )}

            {/* =================================================
                DREAM / CREATE / BUILD / GROW
            ================================================= */}

            <FloatingBadge
              icon="🚀"
              text="Dream"
              delay="0s"
              rotate="-2deg"
              className="
                left-[1%]
                top-[16%]
                border-fuchsia-400/70
                bg-purple-500/[0.16]
                text-white
              "
            />

            <FloatingBadge
              icon="💡"
              text="Create"
              delay="-1s"
              rotate="1deg"
              className="
                left-[-1%]
                top-[31%]
                border-yellow-400/65
                bg-yellow-400/[0.08]
                text-white
              "
            />

            <FloatingBadge
              icon="⚡"
              text="Build"
              delay="-2s"
              rotate="-3deg"
              className="
                left-[0%]
                top-[46%]
                border-blue-400/70
                bg-blue-500/[0.13]
                text-white
              "
            />

            <FloatingBadge
              icon="🌎"
              text="Grow"
              delay="-3s"
              rotate="-2deg"
              className="
                left-[-1%]
                top-[61%]
                border-emerald-400/70
                bg-emerald-500/[0.11]
                text-white
              "
            />

            {/* =================================================
                AI CHIP
            ================================================= */}

            <div
              className="
                hero-chip
                absolute
                right-[0%]
                top-[19%]
                z-40
                flex
                h-[118px]
                w-[118px]
                items-center
                justify-center
                rounded-[27px]
                border-2
                border-cyan-400/75
                bg-[#061127]/95
                shadow-[0_0_25px_rgba(34,211,238,.38),0_0_55px_rgba(59,130,246,.20)]
                backdrop-blur-xl
              "
            >
              <div
                className="
                  absolute
                  inset-[9px]
                  rounded-[20px]
                  border
                  border-purple-400/50
                  shadow-[inset_0_0_22px_rgba(168,85,247,.14)]
                "
              />

              <span
                className="
                  relative
                  z-10
                  bg-gradient-to-b
                  from-white
                  via-cyan-300
                  to-purple-400
                  bg-clip-text
                  text-[46px]
                  font-black
                  text-transparent
                "
              >
                AI
              </span>

              <span
                className="
                  absolute
                  -left-9
                  top-8
                  h-px
                  w-9
                  bg-cyan-400/70
                "
              />

              <span
                className="
                  absolute
                  -right-9
                  bottom-8
                  h-px
                  w-9
                  bg-purple-400/70
                "
              />
            </div>

            {/* =================================================
                LIGHT COLUMN BEHIND MAN
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-[78px]
                left-1/2
                z-[8]
                h-[535px]
                w-[400px]
                -translate-x-1/2
                bg-gradient-to-t
                from-blue-500/[0.18]
                via-blue-500/[0.03]
                to-transparent
                blur-2xl
              "
            />

            {/* SCAN LINE */}

            <div
              className="
                hero-scan
                pointer-events-none
                absolute
                bottom-[100px]
                left-1/2
                z-[24]
                h-px
                w-[360px]
                -translate-x-1/2
                bg-gradient-to-r
                from-transparent
                via-cyan-300/75
                to-transparent
                shadow-[0_0_16px_rgba(34,211,238,.70)]
              "
            />

            {/* =================================================
                PERSON
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-[70px]
                left-1/2
                z-20
                h-[650px]
                w-[490px]
                -translate-x-1/2
              "
            >
              <img
                src="/dinesh-hero.png"
                alt="AI Future Tamil Founder"
                className="
                  h-full
                  w-full
                  object-contain
                  object-bottom
                  drop-shadow-[0_25px_35px_rgba(0,0,0,.58)]
                "
              />

              {/* BLUE BODY FADE */}

              <div
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[125px]
                  w-[410px]
                  -translate-x-1/2
                  bg-gradient-to-t
                  from-blue-600/[0.30]
                  via-cyan-500/[0.08]
                  to-transparent
                  blur-md
                "
              />
            </div>

            {/* =================================================
                FRONT HOLOGRAPHIC PLATFORM
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-[5px]
                left-1/2
                z-30
                h-[150px]
                w-[600px]
                -translate-x-1/2
              "
            >
              {/* FLOOR AURA */}

              <div
                className="
                  hero-floor
                  absolute
                  bottom-[-18px]
                  left-1/2
                  h-[95px]
                  w-[590px]
                  -translate-x-1/2
                  rounded-[50%]
                  bg-gradient-to-r
                  from-blue-600/[0.16]
                  via-purple-500/[0.26]
                  to-cyan-400/[0.17]
                  blur-[30px]
                "
              />

              {/* PLATFORM OUTER BODY */}

              <div
                className="
                  absolute
                  bottom-[3px]
                  left-1/2
                  h-[78px]
                  w-[550px]
                  -translate-x-1/2
                  rounded-[50%]
                  border-[5px]
                  border-blue-500
                  bg-[#061127]/95
                  shadow-[0_0_15px_rgba(59,130,246,.95),0_0_35px_rgba(34,211,238,.55),0_0_65px_rgba(168,85,247,.30)]
                "
              />

              {/* PURPLE OUTER RING */}

              <div
                className="
                  absolute
                  bottom-[19px]
                  left-1/2
                  h-[66px]
                  w-[530px]
                  -translate-x-1/2
                  rounded-[50%]
                  border-[5px]
                  border-fuchsia-400
                  shadow-[0_0_15px_rgba(232,121,249,.9),0_0_35px_rgba(168,85,247,.45)]
                "
              />

              {/* CYAN INNER RING */}

              <div
                className="
                  hero-platform-pulse
                  absolute
                  bottom-[28px]
                  left-1/2
                  h-[57px]
                  w-[500px]
                  -translate-x-1/2
                  rounded-[50%]
                  border-[5px]
                  border-cyan-300
                  shadow-[0_0_12px_#22d3ee,0_0_30px_rgba(34,211,238,.90),0_0_55px_rgba(59,130,246,.40)]
                "
              />

              {/* INNER SURFACE */}

              <div
                className="
                  absolute
                  bottom-[38px]
                  left-1/2
                  h-[38px]
                  w-[455px]
                  -translate-x-1/2
                  rounded-[50%]
                  bg-[#08142b]/75
                  shadow-[inset_0_0_35px_rgba(37,99,235,.28)]
                "
              />

              {/* WHITE / BLUE LIGHT */}

              <div
                className="
                  absolute
                  bottom-[49px]
                  left-1/2
                  h-[14px]
                  w-[400px]
                  -translate-x-1/2
                  rounded-[50%]
                  bg-gradient-to-r
                  from-cyan-300/[0.28]
                  via-white/[0.72]
                  to-fuchsia-400/[0.28]
                  blur-[6px]
                "
              />

              {/* ROTATING HUD */}

              <div
                className="
                  hero-platform-spin
                  absolute
                  bottom-[14px]
                  left-1/2
                  h-[82px]
                  w-[560px]
                  -translate-x-1/2
                  rounded-[50%]
                  border
                  border-dashed
                  border-cyan-300/28
                "
              />

              {/* FRONT BASE */}

              <div
                className="
                  absolute
                  bottom-[-3px]
                  left-1/2
                  h-[35px]
                  w-[500px]
                  -translate-x-1/2
                  rounded-b-[48%]
                  border-b-2
                  border-cyan-400/50
                  bg-gradient-to-b
                  from-[#102253]
                  via-[#081536]
                  to-[#02040b]
                  shadow-[0_15px_25px_rgba(0,0,0,.55),0_0_20px_rgba(34,211,238,.20)]
                "
              />

              {/* FRONT BLUE LIGHT BARS */}

              <span
                className="
                  absolute
                  bottom-[8px]
                  left-[19%]
                  h-[3px]
                  w-[80px]
                  bg-cyan-300
                  shadow-[0_0_12px_#22d3ee]
                "
              />

              <span
                className="
                  absolute
                  bottom-[8px]
                  right-[19%]
                  h-[3px]
                  w-[80px]
                  bg-purple-400
                  shadow-[0_0_12px_#a855f7]
                "
              />
            </div>

            {/* =================================================
                QUOTE CARD
            ================================================= */}

            <div
              className="
                hero-float
                absolute
                bottom-[128px]
                right-[-1%]
                z-40
                w-[225px]
                rounded-[26px]
                border-2
                border-cyan-400/70
                bg-[#061127]/95
                p-5
                shadow-[0_0_24px_rgba(34,211,238,.25),0_0_45px_rgba(168,85,247,.16)]
                backdrop-blur-2xl
              "
              style={{
                "--hero-rotate":
                  "0deg",
              }}
            >
              <span
                className="
                  text-[44px]
                  font-black
                  leading-none
                  text-cyan-300
                "
              >
                “
              </span>

              <p
                className="
                  mt-1
                  text-[17px]
                  font-black
                  leading-7
                  text-white
                "
              >
                Stay Curious,
                <br />

                Keep Learning,
                <br />

                Build the Future!
              </p>

              <span
                className="
                  mt-4
                  block
                  h-px
                  bg-gradient-to-r
                  from-yellow-400/80
                  to-transparent
                "
              />

              <p
                className="
                  mt-3
                  text-right
                  text-sm
                  font-bold
                  italic
                  text-yellow-300
                "
              >
                – Dinesh Kumar.N
              </p>
            </div>
          </div>

          {/* =================================================
              MOBILE / TABLET PORTRAIT
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              flex
              w-full
              max-w-[520px]
              justify-center
              xl:hidden
            "
          >
            <div
              className="
                relative
                h-[560px]
                w-full
              "
            >
              <div
                className="
                  hero-back-ring
                  absolute
                  left-1/2
                  top-[41%]
                  h-[355px]
                  w-[355px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  border-[4px]
                  border-cyan-300
                  shadow-[0_0_25px_rgba(34,211,238,.55)]
                "
              />

              <div
                className="
                  absolute
                  left-1/2
                  top-[41%]
                  h-[370px]
                  w-[370px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  border-[3px]
                  border-purple-400/70
                "
              />

              <div
                className="
                  absolute
                  bottom-[72px]
                  left-1/2
                  z-20
                  h-[465px]
                  w-[355px]
                  -translate-x-1/2
                "
              >
                <img
                  src="/dinesh-hero.png"
                  alt="AI Future Tamil Founder"
                  className="
                    h-full
                    w-full
                    object-contain
                    object-bottom
                    drop-shadow-[0_20px_30px_rgba(0,0,0,.55)]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[100px]
                    w-[300px]
                    -translate-x-1/2
                    bg-gradient-to-t
                    from-blue-600/[0.30]
                    to-transparent
                    blur-md
                  "
                />
              </div>

              <div
                className="
                  absolute
                  bottom-[15px]
                  left-1/2
                  z-30
                  h-[100px]
                  w-[410px]
                  max-w-[96vw]
                  -translate-x-1/2
                "
              >
                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[62px]
                    w-full
                    -translate-x-1/2
                    rounded-[50%]
                    border-[4px]
                    border-blue-500
                    bg-[#061127]/90
                    shadow-[0_0_25px_rgba(59,130,246,.75)]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[13px]
                    left-1/2
                    h-[53px]
                    w-[95%]
                    -translate-x-1/2
                    rounded-[50%]
                    border-[4px]
                    border-fuchsia-400
                    shadow-[0_0_20px_rgba(232,121,249,.60)]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[23px]
                    left-1/2
                    h-[42px]
                    w-[88%]
                    -translate-x-1/2
                    rounded-[50%]
                    border-[4px]
                    border-cyan-300
                    shadow-[0_0_20px_rgba(34,211,238,.85)]
                  "
                />

                <div
                  className="
                    absolute
                    bottom-[36px]
                    left-1/2
                    h-[15px]
                    w-[72%]
                    -translate-x-1/2
                    rounded-[50%]
                    bg-white/40
                    blur-[7px]
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FLOATING BADGE
========================================================= */

function FloatingBadge({
  icon,
  text,
  className = "",
  delay = "0s",
  rotate = "0deg",
}) {
  return (
    <div
      className={`
        hero-float
        absolute
        z-40
        flex
        min-w-[130px]
        items-center
        justify-center
        gap-2.5
        rounded-2xl
        border
        px-5
        py-3
        text-sm
        font-black
        shadow-[0_15px_30px_rgba(0,0,0,.32)]
        backdrop-blur-xl
        ${className}
      `}
      style={{
        animationDelay:
          delay,
        "--hero-rotate":
          rotate,
      }}
    >
      <span
        className="
          text-lg
        "
      >
        {icon}
      </span>

      <span>
        {text}
      </span>
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function HeroStat({
  icon,
  value,
  label,
}) {
  return (
    <div
      className="
        group
        flex
        min-h-[140px]
        flex-col
        items-center
        justify-center
        border-r
        border-white/[0.10]
        p-4
        text-center
        last:border-r-0
      "
    >
      <span
        className="
          text-[28px]
          transition-all
          duration-300
          group-hover:-translate-y-1
          group-hover:scale-110
        "
      >
        {icon}
      </span>

      <p
        className="
          mt-2
          bg-gradient-to-b
          from-white
          via-cyan-200
          to-purple-400
          bg-clip-text
          text-[29px]
          font-black
          text-transparent
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-gray-400
        "
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   CIRCUIT LINE
========================================================= */

function CircuitLine({
  top,
  width,
  right = "0px",
}) {
  return (
    <span
      className="
        absolute
        h-px
        bg-gradient-to-l
        from-cyan-400/70
        via-blue-500/40
        to-transparent
      "
      style={{
        top,
        right,
        width,
      }}
    />
  );
}

export default Hero;