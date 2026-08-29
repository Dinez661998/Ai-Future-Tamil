import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

      {/* BACKGROUND GLOWS */}

      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[110px]" />

      {/* CONTENT */}

      <div className="relative mx-auto max-w-7xl">

        <div className="max-w-4xl">

          {/* BADGE */}

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
            🚀 AI Future Tamil
          </div>

          {/* TITLE */}

          <h1 className="max-w-4xl text-4xl font-black leading-[1.08] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Learn AI.
            <br />

            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            Learn AI, YouTube, Instagram, Content Creation,
            Technology, Android Apps, Digital Products and more —
            all in one place.
          </p>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

            <Link
              to="/courses"
              className="
                inline-flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                px-6
                py-3
                text-sm
                font-black
                text-black
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_12px_35px_rgba(34,211,238,0.18)]

                sm:w-auto
              "
            >
              📚 Start Learning
            </Link>

            <Link
              to="/ai-tools"
              className="
                inline-flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                px-6
                py-3
                text-sm
                font-bold
                text-white
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-cyan-400/30
                hover:bg-cyan-400/[0.07]

                sm:w-auto
              "
            >
              🤖 Explore AI Tools
            </Link>

          </div>

          {/* MINI INFO */}

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-gray-500 sm:text-sm">

            <span>
              ✨ Beginner Friendly
            </span>

            <span>
              ⚡ Learn Faster
            </span>

            <span>
              🎯 Practical Content
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;