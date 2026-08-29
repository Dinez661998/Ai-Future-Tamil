import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

/* =========================================================
   SIDEBAR MENUS
========================================================= */

const sidebarMenus = {
  ai: {
    icon: "🤖",
    title: "AI Collection",
    description: "Explore AI resources",

    items: [
      ["🤖", "AI Tools", "/ai-tools"],
      ["📰", "AI News", "/ai-news"],
      ["📱", "AI Apps", "/ai-apps"],
      ["✨", "AI Prompts", "/prompts"],
      ["🎨", "AI Images", "/ai-images"],
      ["🎬", "AI Videos", "/ai-videos"],
      ["🎓", "AI Courses", "/courses"],
      ["🧠", "AI Models", "/ai-models"],
      ["📊", "AI Datasets", "/ai-datasets"],
      ["💻", "Source Code", "/source-code"],
      ["🧩", "AI Templates", "/ai-templates"],
      ["🌌", "Wallpapers", "/wallpapers"],
    ],
  },

  creators: {
    icon: "🎬",
    title: "Creator Resources",
    description: "Resources for creators",

    items: [
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
    description: "Apps, software and coding",

    items: [
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
    title: "Digital Products",
    description: "Digital resources",

    items: [
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

  promotion: {
    icon: "📣",
    title: "Promotion Hub",
    description: "Grow your presence",

    items: [
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
    description: "Exclusive resources",

    items: [
      ["⬇️", "Premium Downloads", "/products/premium"],
      ["✨", "Premium Prompts", "/products/prompts"],
      ["🎓", "Premium Courses", "/courses"],
      ["📦", "Premium Templates", "/products/templates"],
      ["💻", "Source Code", "/products/source-code"],
      ["👥", "Private Community", "/community"],
    ],
  },
};

/* =========================================================
   CURRENT SECTION
========================================================= */

export function getSidebarSection(pathname) {
  if (pathname.startsWith("/creators/")) {
    return "creators";
  }

  if (pathname.startsWith("/technology/")) {
    return "technology";
  }

  if (pathname.startsWith("/products/")) {
    return "products";
  }

  if (pathname === "/promotion") {
    return "promotion";
  }

  if (pathname === "/premium") {
    return "premium";
  }

  if (
    pathname === "/ai-tools" ||
    pathname.startsWith("/ai-tools/") ||
    pathname === "/ai-news" ||
    pathname.startsWith("/ai-news/") ||
    pathname === "/ai-apps" ||
    pathname === "/prompts" ||
    pathname === "/ai-images" ||
    pathname === "/ai-videos" ||
    pathname === "/courses" ||
    pathname.startsWith("/courses/") ||
    pathname === "/ai-models" ||
    pathname === "/ai-datasets" ||
    pathname === "/source-code" ||
    pathname === "/ai-templates" ||
    pathname === "/wallpapers"
  ) {
    return "ai";
  }

  return null;
}

/* =========================================================
   SIDEBAR
========================================================= */

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const section =
    getSidebarSection(location.pathname);

  if (!section) {
    return null;
  }

  const menu =
    sidebarMenus[section];

  /* =======================================================
     ACTIVE LINK
  ======================================================= */

  const isActive = (path) => {
    if (path === "/promotion") {
      return location.pathname === "/promotion";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  /* =======================================================
     GO BACK
  ======================================================= */

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  /* =======================================================
     SIDEBAR CONTENT
  ======================================================= */

  const SidebarContent = ({
    mobile = false,
  }) => {
    return (
      <div
        className="
          flex
          h-full
          min-h-0
          flex-col
          bg-[#050711]
          text-white
        "
      >
        {/* NAVBAR SPACE */}

        {!mobile && (
          <div className="h-[76px] shrink-0" />
        )}

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          className="
            shrink-0
            border-b
            border-white/[0.07]
            px-5
            py-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-cyan-400/20
                bg-gradient-to-br
                from-cyan-400/[0.09]
                via-blue-500/[0.06]
                to-purple-500/[0.09]
                text-xl
                shadow-[0_0_18px_rgba(34,211,238,.05)]
              "
            >
              {menu.icon}
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate
                  text-[18px]
                  font-black
                  tracking-tight
                  text-white
                "
              >
                {menu.title}
              </h2>

              <p
                className="
                  mt-1
                  truncate
                  text-[11px]
                  font-medium
                  text-gray-600
                "
              >
                {menu.description}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            MENU ITEMS
        ================================================= */}

        <div
          className="
            sidebar-custom-scroll
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-3
            py-3
          "
        >
          <div className="space-y-1.5">

            {menu.items.map(
              ([icon, label, path], index) => {
                const selected =
                  isActive(path);

                return (
                  <Link
                    key={`${label}-${index}`}
                    to={path}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={`
                      group
                      relative
                      flex
                      h-[58px]
                      w-full
                      items-center
                      gap-3
                      overflow-hidden
                      rounded-2xl
                      border
                      px-3
                      text-sm
                      font-bold
                      transition-all
                      duration-300

                      ${
                        selected
                          ? `
                            border-cyan-400/35
                            bg-gradient-to-r
                            from-cyan-500/[0.13]
                            via-cyan-400/[0.07]
                            to-purple-500/[0.06]
                            text-cyan-300
                            shadow-[inset_0_0_20px_rgba(34,211,238,.03)]
                          `
                          : `
                            border-transparent
                            bg-transparent
                            text-gray-400
                            hover:border-white/[0.08]
                            hover:bg-white/[0.035]
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {/* ACTIVE LEFT LINE */}

                    {selected && (
                      <span
                        className="
                          absolute
                          bottom-3
                          left-0
                          top-3
                          w-[3px]
                          rounded-r-full
                          bg-gradient-to-b
                          from-cyan-300
                          via-blue-400
                          to-purple-400
                          shadow-[0_0_14px_rgba(34,211,238,.9)]
                        "
                      />
                    )}

                    {/* ICON */}

                    <span
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        text-lg
                        transition-all
                        duration-300

                        ${
                          selected
                            ? `
                              border-cyan-400/20
                              bg-cyan-400/[0.08]
                            `
                            : `
                              border-white/[0.05]
                              bg-white/[0.035]
                              group-hover:border-white/[0.10]
                            `
                        }
                      `}
                    >
                      {icon}
                    </span>

                    {/* LABEL */}

                    <span
                      className="
                        min-w-0
                        flex-1
                        truncate
                      "
                    >
                      {label}
                    </span>

                    {/* ACTIVE DOT */}

                    {selected && (
                      <span
                        className="
                          mr-1
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          bg-cyan-300
                          shadow-[0_0_12px_#67e8f9]
                        "
                      />
                    )}
                  </Link>
                );
              }
            )}

          </div>
        </div>

        {/* =================================================
            PREMIUM BRANDED BACK AREA
        ================================================= */}

        <div
          className="
            shrink-0
            border-t
            border-white/[0.08]
            bg-[#030409]
            p-4
          "
        >
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="
              aft-premium-back
              group
              relative
              flex
              h-[60px]
              w-full
              items-center
              overflow-hidden
              rounded-2xl
              border
              border-fuchsia-400/55
              bg-[#08070d]
              px-3
              text-left
              transition-all
              duration-300

              hover:-translate-y-0.5
              hover:border-pink-300/90
              hover:bg-[#100914]
            "
          >
            {/* =================================================
                STATIC BACKGROUND GRADIENT
            ================================================= */}

            <span
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-r
                from-pink-500/[0.10]
                via-purple-500/[0.08]
                to-cyan-500/[0.05]
              "
            />

            {/* =================================================
                TOP LIGHT
            ================================================= */}

            <span
              className="
                pointer-events-none
                absolute
                inset-x-8
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-pink-300/80
                to-transparent
              "
            />

            {/* =================================================
                MOVING SHINE
            ================================================= */}

            <span
              className="
                aft-back-shine
                pointer-events-none
                absolute
                -left-24
                top-[-30%]
                h-[160%]
                w-16
                rotate-12
                bg-gradient-to-r
                from-transparent
                via-white/15
                to-transparent
                blur-[1px]
              "
            />

            {/* =================================================
                ARROW ICON
            ================================================= */}

            <span
              className="
                relative
                z-10
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-pink-300/40
                bg-gradient-to-br
                from-pink-500/20
                via-purple-500/15
                to-cyan-500/10
                text-lg
                font-black
                text-pink-100
                shadow-[0_0_18px_rgba(236,72,153,.28)]
                transition-all
                duration-300

                group-hover:-translate-x-1
                group-hover:scale-105
                group-hover:border-pink-200/70
              "
            >
              ←
            </span>

            {/* =================================================
                TEXT
            ================================================= */}

            <span
              className="
                relative
                z-10
                ml-3
                flex
                min-w-0
                flex-1
                flex-col
                justify-center
              "
            >
              <span
                className="
                  text-[14px]
                  font-black
                  tracking-wide
                  text-white
                "
              >
                Go Back
              </span>

              <span
                className="
                  mt-0.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-pink-300/65
                "
              >
                Previous Page
              </span>
            </span>

            {/* =================================================
                ACTION DOT
            ================================================= */}

            <span
              className="
                relative
                z-10
                mr-2
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-pink-400/25
                bg-pink-400/[0.07]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-pink-300
                  shadow-[0_0_10px_#f9a8d4]
                "
              />
            </span>
          </button>
        </div>

        {/* =================================================
            STYLES
        ================================================= */}

        <style>{`
          .sidebar-custom-scroll {
            scrollbar-width: thin;
            scrollbar-color:
              rgba(34, 211, 238, 0.65)
              transparent;
          }

          .sidebar-custom-scroll::-webkit-scrollbar {
            width: 5px;
          }

          .sidebar-custom-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar-custom-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(
              to bottom,
              #22d3ee,
              #8b5cf6,
              #ec4899
            );

            border-radius: 999px;
          }

          @keyframes premiumBackPulse {
            0%,
            100% {
              box-shadow:
                0 0 8px rgba(236, 72, 153, 0.34),
                0 0 18px rgba(168, 85, 247, 0.14),
                inset 0 0 12px rgba(236, 72, 153, 0.025);
            }

            50% {
              box-shadow:
                0 0 13px rgba(236, 72, 153, 0.62),
                0 0 30px rgba(168, 85, 247, 0.24),
                inset 0 0 18px rgba(236, 72, 153, 0.055);
            }
          }

          @keyframes premiumBackShine {
            0% {
              transform:
                translateX(-110px)
                rotate(12deg);
            }

            55% {
              transform:
                translateX(420px)
                rotate(12deg);
            }

            100% {
              transform:
                translateX(420px)
                rotate(12deg);
            }
          }

          .aft-premium-back {
            animation:
              premiumBackPulse
              2.4s
              ease-in-out
              infinite;
          }

          .aft-back-shine {
            animation:
              premiumBackShine
              4.8s
              ease-in-out
              infinite;
          }

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .aft-premium-back,
            .aft-back-shine {
              animation: none;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      {/* ===================================================
          DESKTOP SIDEBAR
      =================================================== */}

      <aside
        className="
          fixed
          bottom-0
          left-0
          top-0
          z-[9000]
          hidden
          w-[320px]
          border-r
          border-white/[0.07]
          bg-[#050711]
          shadow-[20px_0_60px_rgba(0,0,0,.22)]
          lg:block
        "
      >
        <SidebarContent />
      </aside>

      {/* ===================================================
          MOBILE OPEN BUTTON
      =================================================== */}

      <button
        type="button"
        onClick={() =>
          setMobileOpen(true)
        }
        aria-label="Open sidebar"
        className="
          fixed
          bottom-6
          left-4
          z-[9990]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-cyan-400/30
          bg-[#080a13]
          text-xl
          text-white
          shadow-[0_10px_40px_rgba(0,0,0,.45)]
          backdrop-blur-xl
          transition
          hover:border-cyan-300
          lg:hidden
        "
      >
        ☰
      </button>

      {/* ===================================================
          MOBILE BACKDROP
      =================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed
            inset-0
            z-[9970]
            bg-black/75
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* ===================================================
          MOBILE SIDEBAR
      =================================================== */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-[9980]
          w-[310px]
          max-w-[88vw]
          border-r
          border-white/[0.08]
          bg-[#050711]
          transition-transform
          duration-300
          lg:hidden

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <button
          type="button"
          onClick={() =>
            setMobileOpen(false)
          }
          aria-label="Close sidebar"
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-black/40
            text-gray-400
            transition
            hover:text-white
          "
        >
          ✕
        </button>

        <SidebarContent mobile />
      </aside>
    </>
  );
}

export default AppSidebar;