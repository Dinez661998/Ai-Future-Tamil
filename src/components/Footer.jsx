import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }

    setMessage("🎉 You're on the list!");
    setEmail("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <footer
      className="
        relative
        z-[2]
        mt-16
        border-t
        border-white/[0.08]
        bg-[#05070d]/90
        backdrop-blur-2xl
      "
    >
      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <div className="mx-auto max-w-[1500px] px-5 pt-10 sm:px-7 lg:px-9">
        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-cyan-400/15
            bg-gradient-to-br
            from-cyan-400/[0.05]
            via-purple-500/[0.04]
            to-pink-500/[0.05]
            px-6
            py-9
            sm:px-8
            lg:px-10
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
              grid
              gap-8
              lg:grid-cols-[1fr_520px]
              lg:items-center
            "
          >
            <div>
              <p
                className="
                  mb-3
                  text-sm
                  font-bold
                  text-cyan-300
                "
              >
                📩 AI Future Tamil Newsletter
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                "
              >
                Stay Ahead of AI.
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  leading-7
                  text-gray-400
                "
              >
                Get useful AI tools, creator resources,
                technology updates and premium releases
                in one place.
              </p>
            </div>

            <form onSubmit={handleSubscribe}>
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Enter your email address"
                  className="
                    min-w-0
                    flex-1
                    rounded-2xl
                    border
                    border-white/[0.09]
                    bg-black/30
                    px-5
                    py-4
                    text-white
                    outline-none
                    placeholder:text-gray-600
                    transition-all
                    focus:border-cyan-400/40
                    focus:shadow-[0_0_20px_rgba(34,211,238,.06)]
                  "
                />

                <button
                  type="submit"
                  className="
                    shrink-0
                    rounded-2xl
                    bg-white
                    px-6
                    py-4
                    font-black
                    text-black
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-gray-200
                  "
                >
                  Subscribe →
                </button>
              </div>

              <div className="mt-3 min-h-[20px]">
                {message && (
                  <p
                    className={`
                      text-sm
                      font-semibold
                      ${
                        message.includes("🎉")
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    `}
                  >
                    {message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div
        className="
          mx-auto
          grid
          max-w-[1500px]
          gap-10
          px-5
          py-12
          sm:px-7
          md:grid-cols-2
          lg:grid-cols-[1.4fr_1fr_1fr_1fr]
          lg:px-9
        "
      >
        {/* BRAND */}

        <div>
          <Link
            to="/"
            className="
              inline-block
              text-2xl
              font-black
              tracking-tight
              bg-gradient-to-r
              from-cyan-300
              via-white
              to-purple-400
              bg-clip-text
              text-transparent
            "
          >
            AI Future Tamil
          </Link>

          <p
            className="
              mt-4
              max-w-sm
              text-sm
              leading-7
              text-gray-500
            "
          >
            Explore AI tools, creator resources,
            technology, digital products, courses
            and premium content in one platform.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["🤖 AI", "🎬 Creators", "💻 Tech", "💎 Premium"].map(
              (item) => (
                <span
                  key={item}
                  className="
                    rounded-full
                    border
                    border-white/[0.08]
                    bg-white/[0.025]
                    px-3
                    py-1.5
                    text-xs
                    text-gray-400
                  "
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* EXPLORE */}

        <div>
          <h3 className="font-black text-white">
            Explore
          </h3>

          <div className="mt-5 space-y-3 text-sm">
            <Link
              to="/ai-tools"
              className="block text-gray-500 transition hover:text-cyan-300"
            >
              AI Tools
            </Link>

            <Link
              to="/prompts"
              className="block text-gray-500 transition hover:text-cyan-300"
            >
              AI Prompts
            </Link>

            <Link
              to="/courses"
              className="block text-gray-500 transition hover:text-cyan-300"
            >
              Courses
            </Link>

            <Link
              to="/ai-news"
              className="block text-gray-500 transition hover:text-cyan-300"
            >
              AI News
            </Link>

            <Link
              to="/community"
              className="block text-gray-500 transition hover:text-cyan-300"
            >
              Community
            </Link>
          </div>
        </div>

        {/* PLATFORM */}

        <div>
          <h3 className="font-black text-white">
            Platform
          </h3>

          <div className="mt-5 space-y-3 text-sm">
            <Link
              to="/products/free"
              className="block text-gray-500 transition hover:text-purple-300"
            >
              Free Products
            </Link>

            <Link
              to="/products/premium"
              className="block text-gray-500 transition hover:text-purple-300"
            >
              Premium Products
            </Link>

            <Link
              to="/promotion"
              className="block text-gray-500 transition hover:text-purple-300"
            >
              Promotion Hub
            </Link>

            <Link
              to="/premium"
              className="block text-gray-500 transition hover:text-purple-300"
            >
              Premium
            </Link>

            <Link
              to="/pricing"
              className="block text-gray-500 transition hover:text-purple-300"
            >
              Pricing
            </Link>
          </div>
        </div>

        {/* SUPPORT */}

        <div>
          <h3 className="font-black text-white">
            Support
          </h3>

          <div className="mt-5 space-y-3 text-sm">
            <Link
              to="/contact"
              className="block text-gray-500 transition hover:text-pink-300"
            >
              Contact
            </Link>

            <Link
              to="/privacy"
              className="block text-gray-500 transition hover:text-pink-300"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="block text-gray-500 transition hover:text-pink-300"
            >
              Terms & Conditions
            </Link>

            <span className="block text-gray-500">
              ▶️ YouTube
            </span>

            <span className="block text-gray-500">
              📸 Instagram
            </span>

            <span className="block text-gray-500">
              ✈️ Telegram
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div className="border-t border-white/[0.07]">
        <div
          className="
            mx-auto
            flex
            max-w-[1500px]
            flex-col
            gap-3
            px-5
            py-6
            text-sm
            text-gray-600
            sm:px-7
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-9
          "
        >
          <p>
            © {new Date().getFullYear()} AI Future Tamil.
            All rights reserved.
          </p>

          <p>
            Built for AI • Creators • Technology 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;