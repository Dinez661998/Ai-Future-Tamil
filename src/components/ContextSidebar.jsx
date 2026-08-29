import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const menus = {
  ai: {
    icon: "🤖",
    title: "AI Hub",
    items: [
      ["🏠", "Home", "/"],
      ["🤖", "AI Tools", "/ai-tools"],
      ["✨", "Prompts", "/prompts"],
      ["🎓", "Courses", "/courses"],
      ["📰", "AI News", "/ai-news"],
      ["📱", "AI Apps", "/ai-apps"],
      ["🎨", "AI Images", "/ai-images"],
      ["🎬", "AI Videos", "/ai-videos"],
      ["🧠", "AI Models", "/ai-models"],
      ["📊", "AI Datasets", "/ai-datasets"],
      ["💻", "Source Code", "/source-code"],
      ["🧩", "AI Templates", "/ai-templates"],
      ["🌌", "Wallpapers", "/wallpapers"],
    ],
  },

  creators: {
    icon: "🎬",
    title: "Creator Hub",
    items: [
      ["🏠", "Home", "/"],
      ["▶️", "YouTube Resources", "/creators/youtube"],
      ["📸", "Instagram Resources", "/creators/instagram"],
      ["🎞️", "Video Editing", "/creators/video-editing"],
      ["🖼️", "Thumbnail Packs", "/creators/thumbnails"],
      ["🎵", "Music & SFX", "/creators/music-sfx"],
      ["✂️", "CapCut Templates", "/creators/capcut"],
      ["🎬", "Premiere Pro", "/creators/premiere"],
      ["🎨", "Canva Templates", "/creators/canva"],
      ["💫", "Motion Graphics", "/creators/motion-graphics"],
      ["🟢", "Green Screen", "/creators/green-screen"],
      ["🧷", "PNG Packs", "/creators/png-packs"],
      ["🚀", "Intro / Outro", "/creators/intro-outro"],
    ],
  },

  technology: {
    icon: "💻",
    title: "Technology",
    items: [
      ["🏠", "Home", "/"],
      ["📱", "Android Apps", "/technology/android"],
      ["🖥️", "Windows Software", "/technology/windows"],
      ["🤖", "AI Software", "/technology/ai-software"],
      ["📲", "Mobile Tips", "/technology/mobile-tips"],
      ["📰", "Tech News", "/technology/news"],
      ["🧩", "Chrome Extensions", "/technology/chrome"],
      ["💻", "Laptop Tips", "/technology/laptop-tips"],
      ["🛡️", "Cyber Security", "/technology/cyber-security"],
      ["👨‍💻", "Programming", "/technology/programming"],
      ["⚙️", "Coding Resources", "/technology/coding-resources"],
    ],
  },

  products: {
    icon: "🛍️",
    title: "Products",
    items: [
      ["🏠", "Home", "/"],
      ["🎁", "Free Products", "/products/free"],
      ["💎", "Premium Products", "/products/premium"],
      ["✨", "AI Prompt Packs", "/products/prompts"],
      ["📚", "eBooks & PDFs", "/products/ebooks"],
      ["📦", "Templates", "/products/templates"],
      ["🔤", "Icons & Fonts", "/products/icons-fonts"],
      ["🖌️", "UI Kits", "/products/ui-kits"],
      ["💻", "Source Code", "/products/source-code"],
      ["🖼️", "Photoshop Files", "/products/photoshop"],
      ["✂️", "CapCut Templates", "/products/capcut"],
      ["🎛️", "LUTs & Presets", "/products/luts"],
      ["🎞️", "Animation Packs", "/products/animations"],
    ],
  },

  community: {
    icon: "👥",
    title: "Community",
    items: [
      ["🏠", "Home", "/"],
      ["👥", "Community Home", "/community"],
      ["🔥", "Popular Posts", "/community"],
      ["🆕", "Latest Posts", "/community"],
      ["👤", "Following", "/community"],
      ["✨", "Prompts", "/prompts"],
      ["🎓", "Courses", "/courses"],
      ["💎", "Premium Community", "/premium"],
    ],
  },

  promotion: {
    icon: "📣",
    title: "Promotion Hub",
    items: [
      ["🏠", "Home", "/"],
      ["📣", "Promotion Home", "/promotion"],
      ["📸", "Instagram Promotion", "/promotion"],
      ["▶️", "YouTube Promotion", "/promotion"],
      ["🌐", "Website Promotion", "/promotion"],
      ["✈️", "Telegram Promotion", "/promotion"],
      ["🚀", "Social Promotion", "/promotion"],
      ["⭐", "Featured Homepage", "/promotion"],
      ["📰", "Sponsored Article", "/promotion"],
    ],
  },

  premium: {
    icon: "💎",
    title: "Premium",
    items: [
      ["🏠", "Home", "/"],
      ["💎", "Premium Home", "/premium"],
      ["⬇️", "Premium Downloads", "/products/premium"],
      ["✨", "Premium Prompts", "/products/prompts"],
      ["🎓", "Premium Courses", "/courses"],
      ["📦", "Premium Templates", "/products/templates"],
      ["💻", "Source Code", "/products/source-code"],
      ["👥", "Private Community", "/community"],
      ["💰", "Pricing", "/pricing"],
    ],
  },

  general: {
    icon: "⚡",
    title: "AI Future Tamil",
    items: [
      ["🏠", "Home", "/"],
      ["🤖", "AI Tools", "/ai-tools"],
      ["✨", "Prompts", "/prompts"],
      ["🎓", "Courses", "/courses"],
      ["📰", "AI News", "/ai-news"],
      ["👥", "Community", "/community"],
      ["📣", "Promotion Hub", "/promotion"],
      ["💎", "Premium", "/premium"],
      ["💰", "Pricing", "/pricing"],
      ["📊", "Dashboard", "/dashboard"],
    ],
  },
};

function getSection(path) {
  if (path.startsWith("/creators")) return "creators";

  if (path.startsWith("/technology")) return "technology";

  if (path.startsWith("/products")) return "products";

  if (path.startsWith("/community")) return "community";

  if (path.startsWith("/promotion")) return "promotion";

  if (path.startsWith("/premium")) return "premium";

  if (
    path === "/ai-tools" ||
    path.startsWith("/ai-tools/") ||
    path.startsWith("/ai-") ||
    path === "/prompts" ||
    path === "/courses" ||
    path.startsWith("/courses/") ||
    path === "/source-code" ||
    path === "/wallpapers"
  ) {
    return "ai";
  }

  return "general";
}

function ContextSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const section = getSection(
    location.pathname
  );

  const menu = menus[section];

  const active = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* =========================
          MOBILE OPEN BUTTON
      ========================= */}

      <button
        type="button"
        onClick={() =>
          setMobileOpen(true)
        }
        className="
          lg:hidden
          fixed
          left-4
          bottom-24
          z-[9990]

          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          border
          border-cyan-400/30

          bg-[#080a13]/95
          text-xl
          text-white

          shadow-[0_0_30px_rgba(34,211,238,.15)]
          backdrop-blur-xl
        "
      >
        ☰
      </button>

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed
            inset-0
            z-[9980]
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`
          fixed

          left-0
          top-[108px]
          bottom-0

          z-[9990]

          w-[300px]

          border-r
          border-white/10

          bg-[#080a13]/98
          backdrop-blur-2xl

          shadow-[10px_0_40px_rgba(0,0,0,.25)]

          transition-transform
          duration-300

          lg:translate-x-0

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =====================
            BACK
        ===================== */}

        <div className="border-b border-white/10 p-4">

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              w-full
              items-center
              gap-3

              rounded-2xl

              border
              border-purple-400/30

              bg-purple-400/[0.06]

              px-4
              py-3

              font-bold
              text-white

              transition-all
              duration-200

              hover:border-purple-300
              hover:bg-purple-400/10
              hover:shadow-[0_0_20px_rgba(168,85,247,.12)]
            "
          >
            <span className="text-xl">
              ←
            </span>

            Back
          </button>

        </div>

        {/* =====================
            TITLE
        ===================== */}

        <div className="border-b border-white/10 px-5 py-5">

          <div className="flex items-center justify-between">

            <div>
              <p
                className="
                  mb-2
                  text-[11px]
                  uppercase
                  tracking-[0.22em]
                  text-gray-600
                "
              >
                Explore
              </p>

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-xl

                    border
                    border-white/[0.07]

                    bg-white/[0.04]

                    text-2xl
                  "
                >
                  {menu.icon}
                </div>

                <h2 className="text-xl font-black">
                  {menu.title}
                </h2>

              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileOpen(false)
              }
              className="
                lg:hidden

                flex
                h-10
                w-10
                items-center
                justify-center

                rounded-xl

                border
                border-white/10

                text-gray-400
              "
            >
              ✕
            </button>

          </div>
        </div>

        {/* =====================
            LINKS
        ===================== */}

        <div
          className="
            h-[calc(100%-190px)]
            overflow-y-auto
            px-3
            py-4
          "
        >
          <div className="space-y-1">

            {menu.items.map(
              ([icon, label, path], index) => {

                const selected =
                  active(path);

                return (
                  <Link
                    key={`${path}-${index}`}
                    to={path}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`
                      group

                      flex
                      items-center
                      gap-3

                      rounded-xl

                      border

                      px-3
                      py-3

                      text-sm
                      font-semibold

                      transition-all
                      duration-200

                      ${
                        selected
                          ? `
                            border-cyan-400/30
                            bg-cyan-400/[0.10]
                            text-cyan-300
                          `
                          : `
                            border-transparent
                            text-gray-400

                            hover:border-white/[0.08]
                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `}
                  >

                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center

                        rounded-xl

                        bg-white/[0.04]

                        text-lg

                        transition-transform
                        group-hover:scale-110
                      "
                    >
                      {icon}
                    </span>

                    <span className="flex-1">
                      {label}
                    </span>

                    {selected && (
                      <span
                        className="
                          h-2
                          w-2
                          rounded-full

                          bg-cyan-300

                          shadow-[0_0_10px_#67e8f9]
                        "
                      />
                    )}

                  </Link>
                );
              }
            )}

          </div>

          {/* PREMIUM CARD */}

          <div
            className="
              mt-6

              rounded-2xl

              border
              border-purple-400/20

              bg-gradient-to-br
              from-purple-500/[0.08]
              to-cyan-500/[0.04]

              p-5
            "
          >
            <div className="text-3xl">
              💎
            </div>

            <h3 className="mt-3 font-black">
              Premium Access
            </h3>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-gray-500
              "
            >
              Premium resources,
              courses, prompts and
              downloads.
            </p>

            <Link
              to="/premium"
              onClick={() =>
                setMobileOpen(false)
              }
              className="
                mt-4
                inline-block

                text-sm
                font-bold
                text-purple-300

                hover:text-purple-200
              "
            >
              Explore Premium →
            </Link>

          </div>

          <div className="h-10" />

        </div>
      </aside>
    </>
  );
}

export default ContextSidebar;