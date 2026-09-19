import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";

function Hero() {
  const { language } = useLanguage();
  const tamil = language === "ta";
  const t = (en, ta) => (tamil ? ta : en);

  const heroImage = "/dinesh-hero.png";

  const stats = [
    {
      icon: "👥",
      value: "10K+",
      label: t("Active Learners", "Active Learners"),
    },
    {
      icon: "📚",
      value: "500+",
      label: t("AI Tools & Resources", "AI Tools & Resources"),
    },
    {
      icon: "🎬",
      value: "100+",
      label: t("Learning Guides", "Learning Guides"),
    },
    {
      icon: "⭐",
      value: "4.8★",
      label: t("User Rating", "User Rating"),
    },
  ];

  return (
    <section className="aft-hero">
      <style>{`
        /* =========================================================
           AI FUTURE TAMIL — HERO
        ========================================================= */

        .aft-hero {
          position: relative;
          width: 100%;
          min-height: 780px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 73% 45%,
              rgba(37, 99, 235, 0.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 87% 47%,
              rgba(147, 51, 234, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 52% 92%,
              rgba(6, 182, 212, 0.08),
              transparent 28%
            ),
            #020811;
        }

        .aft-hero * {
          box-sizing: border-box;
        }

        /* GRID BACKGROUND */

        .aft-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.12;

          background-image:
            linear-gradient(
              rgba(34, 211, 238, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(99, 102, 241, 0.035) 1px,
              transparent 1px
            );

          background-size: 42px 42px;

          mask-image:
            radial-gradient(
              circle at 72% 50%,
              black 0%,
              transparent 70%
            );
        }

        /* =========================================================
           ANIMATIONS
        ========================================================= */

        @keyframes aftFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes aftOrbit {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes aftOrbitReverse {
          from {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }
        }

        @keyframes aftPulse {
          0%,
          100% {
            opacity: 0.72;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes aftDot {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.75);
          }

          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes aftPlatform {
          0%,
          100% {
            transform:
              translateX(-50%)
              scaleX(1);
          }

          50% {
            transform:
              translateX(-50%)
              scaleX(1.03);
          }
        }

        @keyframes aftShine {
          0% {
            transform:
              translateX(-180%)
              rotate(20deg);
          }

          65%,
          100% {
            transform:
              translateX(420%)
              rotate(20deg);
          }
        }

        @keyframes aftRobot {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(-2deg);
          }

          50% {
            transform:
              translateY(-9px)
              rotate(2deg);
          }
        }

        .aft-floating {
          animation: aftFloat 4s ease-in-out infinite;
        }

        .aft-dot {
          animation: aftDot 2.8s ease-in-out infinite;
        }

        /* =========================================================
           MAIN CONTAINER
        ========================================================= */

        .aft-container {
          position: relative;
          z-index: 10;

          width: min(100%, 1640px);
          min-height: 780px;

          margin: 0 auto;

          padding:
            34px
            38px
            68px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(620px, 0.95fr);

          align-items: center;

          gap: 12px;
        }

        /* =========================================================
           LEFT
        ========================================================= */

        .aft-left {
          position: relative;
          z-index: 30;

          max-width: 800px;

          padding-top: 4px;
        }

        .aft-title {
          margin: 0;

          font-size: clamp(
            66px,
            5.3vw,
            96px
          );

          line-height: 0.96;

          letter-spacing: -0.055em;

          font-weight: 950;
        }

        .aft-title-one {
          display: block;

          background:
            linear-gradient(
              90deg,
              #ff55c8 0%,
              #dc6cf7 55%,
              #a855f7 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;

          filter:
            drop-shadow(
              0 0 18px
              rgba(217, 70, 239, 0.16)
            );
        }

        .aft-title-two {
          display: block;

          margin-top: 8px;

          white-space: nowrap;

          background:
            linear-gradient(
              90deg,
              #19e4ee 0%,
              #0bb9f2 34%,
              #4c9bff 63%,
              #bd65f7 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;

          filter:
            drop-shadow(
              0 0 20px
              rgba(34, 211, 238, 0.12)
            );
        }

        .aft-description {
          max-width: 780px;

          margin:
            27px
            0
            0;

          color: #c9d2df;

          font-size: 18px;

          line-height: 1.75;

          font-weight: 400;
        }

        /* =========================================================
           BUTTONS
        ========================================================= */

        .aft-buttons {
          display: flex;
          flex-wrap: wrap;

          gap: 12px;

          margin-top: 26px;

          max-width: 700px;
        }

        .aft-btn {
          min-height: 58px;

          padding: 0 28px;

          border-radius: 14px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          text-decoration: none;

          font-size: 15px;

          font-weight: 900;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;

          position: relative;

          overflow: hidden;
        }

        .aft-btn:hover {
          transform: translateY(-3px);
        }

        .aft-btn-primary {
          min-width: 220px;

          color: #001018;

          border:
            1px solid
            rgba(34, 211, 238, 0.7);

          background:
            linear-gradient(
              90deg,
              #18e2df,
              #08bff2,
              #1e83ff
            );

          box-shadow:
            0 0 28px
            rgba(34, 211, 238, 0.18);
        }

        .aft-btn-primary::after {
          content: "";

          position: absolute;

          top: -100%;
          bottom: -100%;

          left: -35%;

          width: 18%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.5),
              transparent
            );

          animation:
            aftShine
            4.5s
            ease-in-out
            infinite;
        }

        .aft-btn-dark {
          min-width: 185px;

          color: #ffffff;

          border:
            1px solid
            rgba(125, 211, 252, 0.32);

          background:
            linear-gradient(
              135deg,
              rgba(8, 25, 44, 0.95),
              rgba(9, 16, 35, 0.95)
            );

          box-shadow:
            inset 0 0 20px
            rgba(34, 211, 238, 0.025);
        }

        .aft-btn-purple {
          min-width: 210px;

          color: #ffffff;

          border:
            1px solid
            rgba(217, 70, 239, 0.55);

          background:
            linear-gradient(
              135deg,
              rgba(53, 20, 74, 0.72),
              rgba(17, 17, 39, 0.92)
            );
        }

        .aft-second-row {
          flex-basis: 100%;
          height: 0;
        }

        .aft-small-btn {
          min-width: 230px;
          min-height: 55px;
        }

        /* =========================================================
           BENEFITS
        ========================================================= */

        .aft-benefits {
          display: flex;
          flex-wrap: wrap;

          align-items: center;

          gap: 16px;

          margin-top: 21px;

          color: #d0d6df;

          font-size: 14px;

          font-weight: 600;
        }

        .aft-divider {
          width: 1px;
          height: 23px;

          background:
            rgba(255,255,255,0.17);
        }

        /* =========================================================
           STATS
        ========================================================= */

        .aft-stats {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          max-width: 760px;

          margin-top: 25px;

          overflow: hidden;

          border:
            1px solid
            rgba(103, 184, 255, 0.32);

          border-radius: 21px;

          background:
            linear-gradient(
              180deg,
              rgba(5, 14, 27, 0.92),
              rgba(2, 9, 18, 0.92)
            );

          box-shadow:
            0 20px 60px
            rgba(0,0,0,0.3);
        }

        .aft-stat {
          min-height: 145px;

          padding: 23px 15px 18px;

          display: flex;

          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          position: relative;
        }

        .aft-stat:not(:last-child)::after {
          content: "";

          position: absolute;

          right: 0;
          top: 19px;
          bottom: 19px;

          width: 1px;

          background:
            rgba(255,255,255,0.13);
        }

        .aft-stat-icon {
          font-size: 28px;

          margin-bottom: 9px;
        }

        .aft-stat-value {
          color: #ffffff;

          font-size: 30px;

          line-height: 1;

          font-weight: 950;
        }

        .aft-stat-label {
          margin-top: 9px;

          color: #d1d7e0;

          font-size: 13px;

          line-height: 1.3;
        }

        /* =========================================================
           RIGHT VISUAL
        ========================================================= */

        .aft-right {
          position: relative;

          width: 100%;

          height: 700px;

          align-self: end;

          z-index: 20;
        }

        .aft-atmosphere {
          position: absolute;

          left: 54%;
          top: 44%;

          width: 620px;
          height: 620px;

          transform:
            translate(-50%, -50%);

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(37,99,235,0.2),
              rgba(88,28,135,0.12) 45%,
              transparent 70%
            );

          filter: blur(25px);
        }

        /* ORBITS */

        .aft-orbit-one,
        .aft-orbit-two,
        .aft-main-ring,
        .aft-purple-ring {
          position: absolute;

          left: 53%;
          top: 43%;

          border-radius: 50%;

          pointer-events: none;
        }

        .aft-orbit-one {
          width: 560px;
          height: 560px;

          border:
            1px solid
            rgba(59,130,246,0.27);

          animation:
            aftOrbit
            25s
            linear
            infinite;
        }

        .aft-orbit-two {
          width: 500px;
          height: 500px;

          border:
            1px solid
            rgba(168,85,247,0.28);

          animation:
            aftOrbitReverse
            32s
            linear
            infinite;
        }

        .aft-main-ring {
          width: 445px;
          height: 445px;

          transform:
            translate(-50%, -50%);

          border:
            6px solid
            #21e5f3;

          box-shadow:
            0 0 12px #22d3ee,
            0 0 35px
            rgba(34,211,238,0.7),
            0 0 75px
            rgba(37,99,235,0.35);

          animation:
            aftPulse
            4s
            ease-in-out
            infinite;
        }

        .aft-purple-ring {
          width: 458px;
          height: 458px;

          transform:
            translate(-50%, -50%);

          border:
            4px solid
            rgba(192, 76, 255, 0.7);

          box-shadow:
            0 0 35px
            rgba(168,85,247,0.34);

          clip-path:
            polygon(
              50% 0,
              100% 0,
              100% 100%,
              50% 100%,
              50% 96%,
              95% 96%,
              95% 4%,
              50% 4%
            );
        }

        /* DOTS */

        .aft-dot {
          position: absolute;

          width: 9px;
          height: 9px;

          border-radius: 50%;

          z-index: 10;
        }

        .dot-1 {
          left: 16%;
          top: 14%;

          background: #22d3ee;

          box-shadow:
            0 0 18px #22d3ee;
        }

        .dot-2 {
          left: 80%;
          top: 13%;

          background: #e879f9;

          box-shadow:
            0 0 18px #e879f9;

          animation-delay: -1s;
        }

        .dot-3 {
          right: 3%;
          top: 38%;

          background: #22d3ee;

          box-shadow:
            0 0 18px #22d3ee;

          animation-delay: -1.7s;
        }

        .dot-4 {
          left: 8%;
          top: 48%;

          background: #a855f7;

          box-shadow:
            0 0 18px #a855f7;

          animation-delay: -2.1s;
        }

        .dot-5 {
          right: 11%;
          top: 67%;

          background: #3b82f6;

          box-shadow:
            0 0 18px #3b82f6;

          animation-delay: -0.6s;
        }

        /* =========================================================
           PERSON
        ========================================================= */

        .aft-person {
          position: absolute;

          z-index: 22;

          left: 52%;
          bottom: 5px;

          transform:
            translateX(-50%);

          width: 500px;
          height: 650px;

          pointer-events: none;
        }

        .aft-person img {
          display: block;

          width: 100%;
          height: 100%;

          object-fit: contain;
          object-position: bottom center;

          filter:
            drop-shadow(
              0 25px 30px
              rgba(0,0,0,0.6)
            );
        }

        .aft-person-fade {
          position: absolute;

          left: 50%;
          bottom: 0;

          transform:
            translateX(-50%);

          width: 430px;
          height: 120px;

          background:
            linear-gradient(
              to top,
              rgba(0, 125, 255, 0.24),
              transparent
            );

          filter: blur(15px);
        }

        /* =========================================================
           FLOATING BADGES
        ========================================================= */

        .aft-badge {
          position: absolute;

          z-index: 35;

          min-width: 145px;
          min-height: 58px;

          padding: 0 20px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          border-radius: 16px;

          backdrop-filter: blur(16px);

          font-size: 15px;

          font-weight: 900;

          color: white;

          animation:
            aftFloat
            4.2s
            ease-in-out
            infinite;
        }

        .aft-dream {
          left: -1%;
          top: 18%;

          border:
            1px solid
            rgba(217,70,239,0.7);

          background:
            rgba(88,28,135,0.36);

          box-shadow:
            0 0 20px
            rgba(168,85,247,0.12);
        }

        .aft-create {
          left: -4%;
          top: 36%;

          border:
            1px solid
            rgba(245,158,11,0.65);

          background:
            rgba(120,72,0,0.14);

          animation-delay: -1s;
        }

        .aft-build {
          left: -2%;
          top: 53%;

          border:
            1px solid
            rgba(59,130,246,0.7);

          background:
            rgba(30,64,175,0.22);

          animation-delay: -2s;
        }

        .aft-grow {
          left: -5%;
          top: 70%;

          border:
            1px solid
            rgba(16,185,129,0.65);

          background:
            rgba(6,78,59,0.25);

          animation-delay: -3s;
        }

        /* =========================================================
           AI CHIP
        ========================================================= */

        .aft-ai-chip {
          position: absolute;

          right: -1%;
          top: 22%;

          z-index: 40;

          width: 120px;
          height: 120px;

          display: flex;

          align-items: center;
          justify-content: center;

          border:
            2px solid
            rgba(34,211,238,0.8);

          border-radius: 24px;

          background:
            rgba(5, 17, 39, 0.95);

          box-shadow:
            0 0 25px
            rgba(34,211,238,0.35),
            0 0 50px
            rgba(59,130,246,0.15);

          animation:
            aftFloat
            4.4s
            ease-in-out
            infinite;
        }

        .aft-ai-chip::before {
          content: "";

          position: absolute;

          inset: 9px;

          border:
            1px solid
            rgba(168,85,247,0.55);

          border-radius: 18px;
        }

        .aft-ai-text {
          position: relative;

          z-index: 2;

          font-size: 46px;

          line-height: 1;

          font-weight: 950;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #36e4f4 50%,
              #a855f7
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;
        }

        /* =========================================================
           QUOTE
        ========================================================= */

        .aft-quote {
          position: absolute;

          z-index: 45;

          right: -3%;

          bottom: 72px;

          width: 250px;

          padding:
            21px
            21px
            18px;

          border:
            1px solid
            rgba(34,211,238,0.7);

          border-radius: 23px;

          background:
            linear-gradient(
              145deg,
              rgba(5,17,39,0.96),
              rgba(5,11,27,0.96)
            );

          box-shadow:
            0 0 25px
            rgba(34,211,238,0.15);

          backdrop-filter:
            blur(18px);

          animation:
            aftFloat
            4.6s
            ease-in-out
            infinite;
        }

        .aft-quote-symbol {
          color: #39c8f0;

          font-size: 43px;

          line-height: 0.8;

          font-weight: 950;
        }

        .aft-quote p {
          margin: 10px 0 0;

          color: white;

          font-size: 17px;

          line-height: 1.6;

          font-weight: 700;
        }

        .aft-quote-name {
          display: block;

          margin-top: 11px;

          color: #facc15;

          text-align: right;

          font-size: 12px;

          font-style: italic;

          font-weight: 700;
        }

        /* =========================================================
           AI COMMAND
        ========================================================= */

        .aft-command {
          position: absolute;

          right: -3%;
          bottom: 5px;

          z-index: 48;

          width: 255px;
          min-height: 72px;

          display: flex;

          align-items: center;

          gap: 13px;

          padding:
            10px
            72px
            10px
            14px;

          border:
            1px solid
            rgba(14,165,233,0.58);

          border-radius: 18px;

          background:
            rgba(3, 15, 34, 0.94);

          box-shadow:
            0 0 22px
            rgba(14,165,233,0.13);
        }

        .aft-command-icon {
          flex: 0 0 auto;

          width: 42px;
          height: 42px;

          border-radius: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            #0a1a36;

          font-size: 21px;
        }

        .aft-command-title {
          color: white;

          font-size: 13px;

          font-weight: 900;
        }

        .aft-command-subtitle {
          margin-top: 2px;

          color: #8190a8;

          font-size: 10px;
        }

        .aft-robot {
          position: absolute;

          right: -18px;
          bottom: -11px;

          width: 88px;
          height: 92px;

          display: flex;

          align-items: center;
          justify-content: center;

          font-size: 64px;

          filter:
            drop-shadow(
              0 0 15px
              rgba(59,130,246,0.45)
            );

          animation:
            aftRobot
            3s
            ease-in-out
            infinite;
        }

        /* =========================================================
           PLATFORM / FLOOR
        ========================================================= */

        .aft-platform {
          position: absolute;

          z-index: 19;

          left: 52%;
          bottom: -8px;

          transform:
            translateX(-50%);

          width: 570px;
          height: 85px;

          border:
            4px solid
            #2563eb;

          border-radius: 50%;

          background:
            rgba(6, 17, 39, 0.88);

          box-shadow:
            0 0 18px
            rgba(59,130,246,0.8),
            0 0 42px
            rgba(34,211,238,0.4),
            0 0 65px
            rgba(168,85,247,0.25);

          animation:
            aftPlatform
            3.4s
            ease-in-out
            infinite;
        }

        .aft-platform::before {
          content: "";

          position: absolute;

          inset:
            12px
            15px;

          border:
            4px solid
            #e879f9;

          border-radius: 50%;

          box-shadow:
            0 0 18px
            rgba(232,121,249,0.6);
        }

        .aft-platform::after {
          content: "";

          position: absolute;

          inset:
            22px
            30px;

          border:
            4px solid
            #22d3ee;

          border-radius: 50%;

          box-shadow:
            0 0 20px
            rgba(34,211,238,0.75);
        }

        /* =========================================================
           BOTTOM WAVE
        ========================================================= */

        .aft-wave {
          position: absolute;

          z-index: 5;

          left: -3%;
          right: -3%;
          bottom: -76px;

          height: 120px;

          border-top:
            2px solid
            rgba(65, 105, 255, 0.9);

          border-radius: 50% 50% 0 0;

          background:
            linear-gradient(
              180deg,
              rgba(28, 48, 115, 0.75),
              rgba(20, 31, 80, 0.95)
            );

          transform:
            rotate(-0.5deg);

          box-shadow:
            0 -2px 20px
            rgba(168,85,247,0.22);
        }

        /* =========================================================
           TABLET
        ========================================================= */

        @media (max-width: 1280px) {

          .aft-container {
            grid-template-columns:
              minmax(0, 1fr)
              570px;

            padding-left: 28px;
            padding-right: 28px;
          }

          .aft-title {
            font-size:
              clamp(
                56px,
                5.3vw,
                76px
              );
          }

          .aft-right {
            transform:
              scale(0.9);

            transform-origin:
              center right;
          }
        }

        /* =========================================================
           MOBILE / TABLET STACK
        ========================================================= */

        @media (max-width: 1050px) {

          .aft-hero {
            min-height: auto;
          }

          .aft-container {
            min-height: auto;

            grid-template-columns: 1fr;

            padding:
              45px
              22px
              75px;
          }

          .aft-left {
            max-width: 850px;

            margin: 0 auto;

            text-align: center;
          }

          .aft-title {
            font-size:
              clamp(
                50px,
                9vw,
                78px
              );
          }

          .aft-title-two {
            white-space: normal;
          }

          .aft-description {
            margin-left: auto;
            margin-right: auto;
          }

          .aft-buttons {
            justify-content: center;

            margin-left: auto;
            margin-right: auto;
          }

          .aft-benefits {
            justify-content: center;
          }

          .aft-stats {
            margin-left: auto;
            margin-right: auto;
          }

          .aft-right {
            height: 650px;

            max-width: 720px;

            margin: 15px auto 0;

            transform: none;
          }
        }

        /* =========================================================
           PHONE
        ========================================================= */

        @media (max-width: 650px) {

          .aft-container {
            padding:
              36px
              15px
              65px;
          }

          .aft-title {
            font-size:
              clamp(
                44px,
                13vw,
                62px
              );

            line-height: 1;
          }

          .aft-description {
            margin-top: 22px;

            font-size: 15px;

            line-height: 1.7;
          }

          .aft-buttons {
            display: grid;

            grid-template-columns: 1fr;

            width: 100%;
          }

          .aft-btn,
          .aft-small-btn {
            width: 100%;
            min-width: 0;
          }

          .aft-second-row {
            display: none;
          }

          .aft-benefits {
            gap: 11px;

            font-size: 12px;
          }

          .aft-divider {
            display: none;
          }

          .aft-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .aft-stat {
            min-height: 125px;
          }

          .aft-stat:nth-child(2)::after {
            display: none;
          }

          .aft-stat:nth-child(-n+2) {
            border-bottom:
              1px solid
              rgba(255,255,255,0.1);
          }

          .aft-stat-value {
            font-size: 26px;
          }

          .aft-right {
            height: 525px;

            margin-top: 25px;
          }

          .aft-atmosphere {
            width: 440px;
            height: 440px;
          }

          .aft-orbit-one {
            width: 390px;
            height: 390px;
          }

          .aft-orbit-two {
            width: 350px;
            height: 350px;
          }

          .aft-main-ring {
            width: 320px;
            height: 320px;

            border-width: 4px;
          }

          .aft-purple-ring {
            width: 333px;
            height: 333px;

            border-width: 3px;
          }

          .aft-person {
            width: 350px;
            height: 475px;

            bottom: 3px;
          }

          .aft-platform {
            width: 390px;
            max-width: 94vw;

            height: 64px;
          }

          .aft-badge {
            min-width: 105px;
            min-height: 45px;

            padding: 0 12px;

            font-size: 11px;
          }

          .aft-dream {
            left: 0;
            top: 17%;
          }

          .aft-create {
            left: -1%;
            top: 33%;
          }

          .aft-build {
            left: 1%;
            top: 50%;
          }

          .aft-grow {
            left: 0;
            top: 66%;
          }

          .aft-ai-chip {
            right: 0;
            top: 19%;

            width: 82px;
            height: 82px;

            border-radius: 18px;
          }

          .aft-ai-text {
            font-size: 32px;
          }

          .aft-quote {
            right: 0;
            bottom: 77px;

            width: 180px;

            padding: 14px;
          }

          .aft-quote-symbol {
            font-size: 31px;
          }

          .aft-quote p {
            font-size: 12px;

            line-height: 1.55;
          }

          .aft-quote-name {
            font-size: 9px;
          }

          .aft-command {
            right: 0;
            bottom: 8px;

            width: 190px;

            min-height: 60px;

            padding:
              8px
              53px
              8px
              9px;
          }

          .aft-command-icon {
            width: 34px;
            height: 34px;

            font-size: 16px;
          }

          .aft-command-title {
            font-size: 10px;
          }

          .aft-command-subtitle {
            font-size: 8px;
          }

          .aft-robot {
            right: -13px;
            bottom: -8px;

            width: 66px;

            font-size: 48px;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {

          .aft-floating,
          .aft-dot,
          .aft-orbit-one,
          .aft-orbit-two,
          .aft-main-ring,
          .aft-platform,
          .aft-btn-primary::after,
          .aft-robot {
            animation:
              none !important;
          }
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="aft-grid" />

      {/* MAIN */}
      <div className="aft-container">

        {/* =======================================================
            LEFT SIDE
        ======================================================= */}

        <div className="aft-left">

          <h1 className="aft-title">

            <span className="aft-title-one">
              {t(
                "Learn AI.",
                "AI கற்றுக்கொள்ளுங்கள்."
              )}
            </span>

            <span className="aft-title-two">
              {t(
                "Build Your Future.",
                "உங்கள் எதிர்காலத்தை உருவாக்குங்கள்."
              )}
            </span>

          </h1>

          <p className="aft-description">
            {t(
              "Learn AI, YouTube, Instagram, Content Creation, Technology, Android Apps, Digital Products and more — all in one place.",
              "AI, YouTube, Instagram, Content Creation, Technology, Android Apps, Digital Products மற்றும் பலவற்றை ஒரே இடத்தில் கற்றுக்கொள்ளுங்கள்."
            )}
          </p>

          {/* BUTTONS */}

          <div className="aft-buttons">

            <Link
              to="/courses"
              className="
                aft-btn
                aft-btn-primary
              "
            >
              🚀
              {t(
                "Start Learning",
                "கற்க தொடங்கு"
              )}
              <span>→</span>
            </Link>

            <Link
              to="/utility-hub"
              className="
                aft-btn
                aft-btn-dark
              "
            >
              🧰
              Utility Hub
            </Link>

            <Link
              to="/smart-hub"
              className="
                aft-btn
                aft-btn-purple
              "
            >
              ⚡
              {t(
                "Open Smart Hub",
                "Smart Hub திறக்க"
              )}
            </Link>

            <span className="aft-second-row" />

            <Link
              to="/innovation-lab"
              className="
                aft-btn
                aft-btn-dark
                aft-small-btn
              "
            >
              🧪
              Innovation Lab
              <span>→</span>
            </Link>

            <Link
              to="/experience-zone"
              className="
                aft-btn
                aft-btn-dark
                aft-small-btn
              "
            >
              🌌
              Experience Zone
              <span>→</span>
            </Link>

          </div>

          {/* BENEFITS */}

          <div className="aft-benefits">

            <span>
              ✨ Beginner Friendly
            </span>

            <span className="aft-divider" />

            <span>
              ⚡ Learn Faster
            </span>

            <span className="aft-divider" />

            <span>
              🎯 Practical Content
            </span>

          </div>

          {/* STATS */}

          <div className="aft-stats">

            {stats.map((item) => (
              <div
                className="aft-stat"
                key={item.label}
              >

                <div className="aft-stat-icon">
                  {item.icon}
                </div>

                <div className="aft-stat-value">
                  {item.value}
                </div>

                <div className="aft-stat-label">
                  {item.label}
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* =======================================================
            RIGHT SIDE
        ======================================================= */}

        <div className="aft-right">

          <div className="aft-atmosphere" />

          {/* ORBITS */}

          <div className="aft-orbit-one" />
          <div className="aft-orbit-two" />

          <div className="aft-main-ring" />
          <div className="aft-purple-ring" />

          {/* LIGHT DOTS */}

          <span className="aft-dot dot-1" />
          <span className="aft-dot dot-2" />
          <span className="aft-dot dot-3" />
          <span className="aft-dot dot-4" />
          <span className="aft-dot dot-5" />

          {/* FLOATING LABELS */}

          <div className="aft-badge aft-dream">
            🚀 Dream
          </div>

          <div className="aft-badge aft-create">
            💡 Create
          </div>

          <div className="aft-badge aft-build">
            ⚡ Build
          </div>

          <div className="aft-badge aft-grow">
            🌎 Grow
          </div>

          {/* AI CHIP */}

          <div className="aft-ai-chip">

            <span className="aft-ai-text">
              AI
            </span>

          </div>

          {/* PLATFORM BEHIND PERSON */}

          <div className="aft-platform" />

          {/* PERSON */}

          <div className="aft-person">

            <img
              src={heroImage}
              alt="AI Future Tamil Founder"
            />

            <div className="aft-person-fade" />

          </div>

          {/* QUOTE */}

          <div className="aft-quote">

            <div className="aft-quote-symbol">
              “
            </div>

            <p>
              Stay Curious,
              <br />
              Keep Learning,
              <br />
              Build the Future!
            </p>

            <span className="aft-quote-name">
              – Dinesh Kumar.N
            </span>

          </div>

          {/* AI COMMAND */}

          <div className="aft-command">

            <div className="aft-command-icon">
              ⚡
            </div>

            <div>
              <div className="aft-command-title">
                AI Command
              </div>

              <div className="aft-command-subtitle">
                Global Search 2.0
              </div>
            </div>

            <div className="aft-robot">
              🤖
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM WAVE */}

      <div className="aft-wave" />

    </section>
  );
}

export default Hero;