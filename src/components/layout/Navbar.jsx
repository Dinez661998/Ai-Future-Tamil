import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../../supabase/client";

/* =========================================================
   MEGA MENU DATA
========================================================= */

const megaMenus = {
  AI: {
    label: "AI",

    items: [
      {
        label: "AI Tools",
        icon: "🤖",
        path: "/ai-tools",
      },
      {
        label: "AI News",
        icon: "📰",
        path: "/ai-news",
      },
      {
        label: "AI Apps",
        icon: "📱",
        path: "/ai-apps",
      },
      {
        label: "AI Prompts",
        icon: "✨",
        path: "/prompts",
      },
      {
        label: "AI Images",
        icon: "🎨",
        path: "/ai-images",
      },
      {
        label: "AI Videos",
        icon: "🎬",
        path: "/ai-videos",
      },
      {
        label: "AI Courses",
        icon: "🎓",
        path: "/courses",
      },
      {
        label: "AI Models",
        icon: "🧠",
        path: "/ai-models",
      },
      {
        label: "AI Datasets",
        icon: "📊",
        path: "/ai-datasets",
      },
      {
        label: "Source Code",
        icon: "💻",
        path: "/source-code",
      },
      {
        label: "AI Templates",
        icon: "🧩",
        path: "/ai-templates",
      },
      {
        label: "Wallpapers",
        icon: "🌌",
        path: "/wallpapers",
      },
    ],
  },

  Creators: {
    label: "Creators",

    items: [
      {
        label: "YouTube Resources",
        icon: "▶️",
        path: "/creators/youtube",
      },
      {
        label: "Instagram Resources",
        icon: "📸",
        path: "/creators/instagram",
      },
      {
        label: "Video Editing",
        icon: "🎞️",
        path: "/creators/video-editing",
      },
      {
        label: "Thumbnail Packs",
        icon: "🖼️",
        path: "/creators/thumbnails",
      },
      {
        label: "Music & SFX",
        icon: "🎵",
        path: "/creators/music-sfx",
      },
      {
        label: "CapCut Templates",
        icon: "✂️",
        path: "/creators/capcut",
      },
      {
        label: "Premiere Pro",
        icon: "🎬",
        path: "/creators/premiere",
      },
      {
        label: "Canva Templates",
        icon: "🎨",
        path: "/creators/canva",
      },
      {
        label: "Motion Graphics",
        icon: "💫",
        path: "/creators/motion-graphics",
      },
      {
        label: "Green Screen",
        icon: "🟢",
        path: "/creators/green-screen",
      },
      {
        label: "PNG Packs",
        icon: "🧷",
        path: "/creators/png-packs",
      },
      {
        label: "Intro / Outro",
        icon: "🚀",
        path: "/creators/intro-outro",
      },
    ],
  },

  Technology: {
    label: "Technology",

    items: [
      {
        label: "Android Apps",
        icon: "📱",
        path: "/technology/android",
      },
      {
        label: "Windows Software",
        icon: "🖥️",
        path: "/technology/windows",
      },
      {
        label: "AI Software",
        icon: "🤖",
        path: "/technology/ai-software",
      },
      {
        label: "Mobile Tips",
        icon: "📲",
        path: "/technology/mobile-tips",
      },
      {
        label: "Tech News",
        icon: "📰",
        path: "/technology/news",
      },
      {
        label: "Chrome Extensions",
        icon: "🧩",
        path: "/technology/chrome",
      },
      {
        label: "Laptop Tips",
        icon: "💻",
        path: "/technology/laptop-tips",
      },
      {
        label: "Cyber Security",
        icon: "🛡️",
        path: "/technology/cyber-security",
      },
      {
        label: "Programming",
        icon: "👨‍💻",
        path: "/technology/programming",
      },
      {
        label: "Coding Resources",
        icon: "⚙️",
        path: "/technology/coding-resources",
      },
    ],
  },

  Products: {
    label: "Products",

    items: [
      {
        label: "Free Products",
        icon: "🎁",
        path: "/products/free",
      },
      {
        label: "Premium Products",
        icon: "💎",
        path: "/products/premium",
      },
      {
        label: "AI Prompts",
        icon: "✨",
        path: "/products/prompts",
      },
      {
        label: "eBooks & PDFs",
        icon: "📚",
        path: "/products/ebooks",
      },
      {
        label: "Templates",
        icon: "📦",
        path: "/products/templates",
      },
      {
        label: "Icons & Fonts",
        icon: "🔤",
        path: "/products/icons-fonts",
      },
      {
        label: "UI Kits",
        icon: "🖌️",
        path: "/products/ui-kits",
      },
      {
        label: "Source Code",
        icon: "💻",
        path: "/products/source-code",
      },
      {
        label: "Photoshop Files",
        icon: "🖼️",
        path: "/products/photoshop",
      },
      {
        label: "CapCut Templates",
        icon: "✂️",
        path: "/products/capcut",
      },
      {
        label: "LUTs & Presets",
        icon: "🎛️",
        path: "/products/luts",
      },
      {
        label: "Animation Packs",
        icon: "🎞️",
        path: "/products/animations",
      },
    ],
  },
};

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [user, setUser] =
    useState(null);

  const [
    activeMegaMenu,
    setActiveMegaMenu,
  ] = useState(null);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    mobileSection,
    setMobileSection,
  ] = useState(null);

  const location =
    useLocation();

  const navigate =
    useNavigate();

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const getUser =
      async () => {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (mounted) {
          setUser(user);
        }
      };

    getUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          session
        ) => {
          if (mounted) {
            setUser(
              session?.user ??
                null
            );
          }
        }
      );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);

  /* =========================================================
     CLOSE MENU ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [
    location.pathname,
  ]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    async () => {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        alert(
          error.message
        );

        return;
      }

      setUser(null);

      navigate("/");
    };

  /* =========================================================
     USER NAME
  ========================================================= */

  const displayName =
    user?.user_metadata
      ?.full_name ||
    user?.email?.split(
      "@"
    )[0] ||
    "User";

  /* =========================================================
     NAV STYLE
  ========================================================= */

  const navButtonClass = `
    inline-flex
    h-10
    items-center
    justify-center
    whitespace-nowrap
    rounded-lg
    px-2.5
    text-[13px]
    font-semibold
    text-gray-300
    transition-all
    duration-200
    hover:bg-white/[0.05]
    hover:text-cyan-300
  `;

  return (
    <>
      <nav
        className="
          sticky
          top-0
          z-[9500]
          w-full
          border-b
          border-white/10
          bg-[#05060b]/95
          text-white
          backdrop-blur-2xl
        "
      >
        {/* =================================================
            MAIN NAVBAR
        ================================================= */}

        <div
          className="
            mx-auto
            flex
            h-[76px]
            w-full
            max-w-[1600px]
            items-center
            gap-4
            px-4
            sm:px-5
            xl:px-6
          "
        >
          {/* ===============================================
              LOGO
          =============================================== */}

          <Link
            to="/"
            className="
              shrink-0
              whitespace-nowrap
              bg-gradient-to-r
              from-cyan-300
              via-white
              to-purple-400
              bg-clip-text
              text-[22px]
              font-black
              tracking-tight
              text-transparent
            "
          >
            AI Future Tamil
          </Link>

          {/* ===============================================
              DESKTOP MENU
          =============================================== */}

          <div
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1
              xl:flex
            "
          >
            <Link
              to="/"
              className={
                navButtonClass
              }
            >
              Home
            </Link>

            {Object.keys(
              megaMenus
            ).map(
              (
                menuKey
              ) => {
                const menu =
                  megaMenus[
                    menuKey
                  ];

                const open =
                  activeMegaMenu ===
                  menuKey;

                return (
                  <button
                    key={
                      menuKey
                    }
                    type="button"
                    onClick={() =>
                      setActiveMegaMenu(
                        (
                          current
                        ) =>
                          current ===
                          menuKey
                            ? null
                            : menuKey
                      )
                    }
                    className={`
                      ${navButtonClass}

                      ${
                        open
                          ? "bg-cyan-400/[0.07] text-cyan-300"
                          : ""
                      }
                    `}
                  >
                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      {
                        menu.label
                      }

                      <span
                        className={`
                          text-[10px]
                          transition-transform
                          duration-200

                          ${
                            open
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      >
                        ▼
                      </span>
                    </span>
                  </button>
                );
              }
            )}

            <Link
              to="/community"
              className={
                navButtonClass
              }
            >
              Community
            </Link>

            <Link
              to="/promotion"
              className={
                navButtonClass
              }
            >
              Promotion
            </Link>

            <Link
              to="/premium"
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                whitespace-nowrap
                rounded-lg
                border
                border-purple-400/25
                bg-purple-400/[0.06]
                px-3
                text-[13px]
                font-bold
                text-purple-300
                transition-all
                duration-200
                hover:border-purple-300/50
                hover:bg-purple-400/[0.12]
              "
            >
              💎 Premium
            </Link>

            <Link
              to="/pricing"
              className={
                navButtonClass
              }
            >
              Pricing
            </Link>
          </div>

          {/* ===============================================
              RIGHT SIDE
          =============================================== */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            {/* =============================================
                USER LOGGED IN
            ============================================= */}

            {user ? (
              <>
                {/* USER NAME */}

                <div
                  className="
                    hidden
                    max-w-[120px]
                    text-right
                    2xl:block
                  "
                >
                  <p
                    className="
                      text-[10px]
                      leading-none
                      text-gray-500
                    "
                  >
                    Welcome
                  </p>

                  <p
                    title={
                      displayName
                    }
                    className="
                      mt-1
                      truncate
                      text-xs
                      font-bold
                      text-gray-200
                    "
                  >
                    {
                      displayName
                    }
                  </p>
                </div>

                {/* DASHBOARD */}

                <Link
                  to="/dashboard"
                  className="
                    hidden
                    h-10
                    shrink-0
                    items-center
                    justify-center
                    whitespace-nowrap
                    rounded-xl
                    border
                    border-cyan-400/35
                    bg-cyan-400/[0.06]
                    px-3.5
                    text-[13px]
                    font-bold
                    text-cyan-300
                    transition-all
                    duration-200
                    hover:border-cyan-300
                    hover:bg-cyan-400/[0.12]
                    sm:inline-flex
                  "
                >
                  Dashboard
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    hidden
                    h-10
                    shrink-0
                    items-center
                    justify-center
                    whitespace-nowrap
                    rounded-xl
                    border
                    border-red-500/35
                    bg-red-500/[0.06]
                    px-3.5
                    text-[13px]
                    font-bold
                    text-red-300
                    transition-all
                    duration-200
                    hover:border-red-400
                    hover:bg-red-500/[0.14]
                    xl:inline-flex
                  "
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="
                  hidden
                  h-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-white
                  px-5
                  text-sm
                  font-black
                  text-black
                  transition
                  hover:bg-gray-200
                  sm:inline-flex
                "
              >
                Login
              </Link>
            )}

            {/* =============================================
                MOBILE BUTTON
            ============================================= */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              aria-label="Toggle navigation menu"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                text-xl
                transition
                hover:border-cyan-400/40
                xl:hidden
              "
            >
              {mobileOpen
                ? "✕"
                : "☰"}
            </button>
          </div>
        </div>

        {/* =================================================
            DESKTOP MEGA MENU
        ================================================= */}

        {activeMegaMenu && (
          <div
            className="
              absolute
              left-0
              right-0
              top-full
              hidden
              border-y
              border-white/10
              bg-[#070914]/98
              shadow-[0_30px_80px_rgba(0,0,0,.65)]
              backdrop-blur-2xl
              xl:block
            "
          >
            <div
              className="
                mx-auto
                max-w-7xl
                px-6
                py-8
              "
            >
              {/* HEADER */}

              <div
                className="
                  mb-6
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      mb-1
                      text-sm
                      font-semibold
                      text-cyan-400
                    "
                  >
                    Explore
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    {
                      megaMenus[
                        activeMegaMenu
                      ].label
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveMegaMenu(
                      null
                    )
                  }
                  aria-label="Close menu"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    text-gray-400
                    transition
                    hover:border-white/20
                    hover:text-white
                  "
                >
                  ✕
                </button>
              </div>

              {/* GRID */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  xl:grid-cols-4
                "
              >
                {megaMenus[
                  activeMegaMenu
                ].items.map(
                  (
                    item
                  ) => (
                    <Link
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      className="
                        group
                        flex
                        min-h-[82px]
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        p-4
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-cyan-400/30
                        hover:bg-cyan-400/[0.05]
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
                          rounded-xl
                          border
                          border-white/10
                          bg-black/30
                          text-2xl
                          transition
                          group-hover:border-cyan-400/30
                        "
                      >
                        {
                          item.icon
                        }
                      </div>

                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            truncate
                            font-semibold
                            text-white
                          "
                        >
                          {
                            item.label
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-500
                          "
                        >
                          Open section →
                        </p>
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileOpen && (
          <div
            className="
              max-h-[calc(100vh-76px)]
              overflow-y-auto
              border-t
              border-white/10
              bg-[#070914]/98
              px-4
              py-5
              backdrop-blur-2xl
              xl:hidden
            "
          >
            <div
              className="
                mx-auto
                max-w-3xl
                space-y-2
              "
            >
              {/* HOME */}

              <Link
                to="/"
                className="
                  block
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-3
                  font-semibold
                "
              >
                🏠 Home
              </Link>

              {/* ===========================================
                  MOBILE MEGA MENUS
              =========================================== */}

              {Object.keys(
                megaMenus
              ).map(
                (
                  menuKey
                ) => {
                  const menu =
                    megaMenus[
                      menuKey
                    ];

                  const open =
                    mobileSection ===
                    menuKey;

                  return (
                    <div
                      key={
                        menuKey
                      }
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setMobileSection(
                            (
                              current
                            ) =>
                              current ===
                              menuKey
                                ? null
                                : menuKey
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-white/[0.07]
                          bg-white/[0.025]
                          px-4
                          py-3
                          font-semibold
                        "
                      >
                        <span>
                          {
                            menu.label
                          }
                        </span>

                        <span
                          className={`
                            text-xs
                            transition-transform

                            ${
                              open
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        >
                          ▼
                        </span>
                      </button>

                      {open && (
                        <div
                          className="
                            mt-2
                            grid
                            grid-cols-1
                            gap-2
                            sm:grid-cols-2
                          "
                        >
                          {menu.items.map(
                            (
                              item
                            ) => (
                              <Link
                                key={
                                  item.path
                                }
                                to={
                                  item.path
                                }
                                className="
                                  flex
                                  items-center
                                  gap-3
                                  rounded-xl
                                  border
                                  border-white/[0.06]
                                  bg-black/20
                                  px-4
                                  py-3
                                  text-sm
                                  text-gray-300
                                  transition
                                  hover:border-cyan-400/20
                                  hover:text-white
                                "
                              >
                                <span
                                  className="
                                    text-xl
                                  "
                                >
                                  {
                                    item.icon
                                  }
                                </span>

                                <span>
                                  {
                                    item.label
                                  }
                                </span>
                              </Link>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}

              {/* COMMUNITY */}

              <Link
                to="/community"
                className="
                  block
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-3
                  font-semibold
                "
              >
                👥 Community
              </Link>

              {/* PROMOTION */}

              <Link
                to="/promotion"
                className="
                  block
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-3
                  font-semibold
                "
              >
                📣 Promotion
              </Link>

              {/* PREMIUM */}

              <Link
                to="/premium"
                className="
                  block
                  rounded-xl
                  border
                  border-purple-400/20
                  bg-purple-400/[0.05]
                  px-4
                  py-3
                  font-semibold
                  text-purple-300
                "
              >
                💎 Premium
              </Link>

              {/* PRICING */}

              <Link
                to="/pricing"
                className="
                  block
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-3
                  font-semibold
                "
              >
                💰 Pricing
              </Link>

              {/* ===========================================
                  MOBILE AUTH
              =========================================== */}

              <div
                className="
                  mt-4
                  border-t
                  border-white/10
                  pt-4
                "
              >
                {user ? (
                  <div
                    className="
                      space-y-2
                    "
                  >
                    {/* USER */}

                    <div
                      className="
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.025]
                        px-4
                        py-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          text-gray-500
                        "
                      >
                        Logged in as
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          font-bold
                          text-white
                        "
                      >
                        {
                          displayName
                        }
                      </p>
                    </div>

                    {/* DASHBOARD */}

                    <Link
                      to="/dashboard"
                      className="
                        block
                        rounded-xl
                        border
                        border-cyan-400/30
                        bg-cyan-400/[0.06]
                        px-4
                        py-3
                        font-semibold
                        text-cyan-300
                      "
                    >
                      📊 Dashboard
                    </Link>

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/[0.06]
                        px-4
                        py-3
                        text-left
                        font-semibold
                        text-red-300
                      "
                    >
                      🚪 Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="
                      block
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      text-center
                      font-bold
                      text-black
                    "
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===================================================
          OUTSIDE CLICK LAYER
      =================================================== */}

      {activeMegaMenu && (
        <button
          type="button"
          aria-label="Close mega menu"
          onClick={() =>
            setActiveMegaMenu(
              null
            )
          }
          className="
            fixed
            inset-0
            z-[9400]
            hidden
            cursor-default
            bg-black/20
            xl:block
          "
        />
      )}
    </>
  );
}

export default Navbar;