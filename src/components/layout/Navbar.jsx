import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../supabase/client";

/* =========================================================
   MEGA MENU DATA
========================================================= */

const megaMenus = {
  AI: [
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

  Creators: [
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

  Technology: [
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

  Products: [
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
      icon: "🧠",
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
          data: { user },
        } =
          await supabase.auth.getUser();

        if (mounted) {
          setUser(user);
        }
      };

    getUser();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
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
     CLOSE MENUS ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setActiveMegaMenu(null);

    setMobileOpen(false);

    setMobileSection(null);
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout =
    async () => {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        alert(error.message);
        return;
      }

      setUser(null);

      navigate("/");
    };

  /* =========================================================
     DISPLAY NAME
  ========================================================= */

  const displayName =
    user?.user_metadata
      ?.full_name ||
    user?.email?.split(
      "@"
    )[0] ||
    "User";

  /* =========================================================
     ACTIVE ROUTE
  ========================================================= */

  const isActive = (
    path
  ) =>
    location.pathname ===
    path;

  /* =========================================================
     COMMON NAV STYLE
  ========================================================= */

  const navButtonClass = `
    relative
    inline-flex
    items-center
    justify-center
    whitespace-nowrap
    rounded-lg
    px-2.5
    py-2
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
            justify-between
            gap-3
            px-4
            sm:px-6
            xl:px-8
          "
        >
          {/* LOGO */}

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
              text-xl
              font-black
              tracking-tight
              text-transparent
              sm:text-2xl
            "
          >
            AI Future Tamil
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              gap-0.5
              xl:flex
            "
          >
            <Link
              to="/"
              className={`
                ${navButtonClass}

                ${
                  isActive("/")
                    ? "bg-white/[0.05] text-cyan-300"
                    : ""
                }
              `}
            >
              Home
            </Link>

            {/* MEGA MENUS */}

            {Object.keys(
              megaMenus
            ).map(
              (menuName) => (
                <button
                  key={
                    menuName
                  }
                  type="button"
                  onClick={() =>
                    setActiveMegaMenu(
                      (
                        current
                      ) =>
                        current ===
                        menuName
                          ? null
                          : menuName
                    )
                  }
                  className={`
                    ${navButtonClass}

                    ${
                      activeMegaMenu ===
                      menuName
                        ? "bg-white/[0.05] text-cyan-300"
                        : ""
                    }
                  `}
                >
                  <span
                    className="
                      flex
                      items-center
                      gap-1
                    "
                  >
                    {menuName}

                    <span
                      className={`
                        text-[9px]
                        transition-transform
                        duration-300

                        ${
                          activeMegaMenu ===
                          menuName
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    >
                      ▼
                    </span>
                  </span>
                </button>
              )
            )}

            <Link
              to="/community"
              className={`
                ${navButtonClass}

                ${
                  isActive(
                    "/community"
                  )
                    ? "text-cyan-300"
                    : ""
                }
              `}
            >
              Community
            </Link>

            {/* =================================================
                NEW INNOVATION LAB
            ================================================= */}

            <Link
              to="/innovation-lab"
              className={`
                relative
                inline-flex
                items-center
                justify-center
                whitespace-nowrap
                rounded-xl
                border
                px-3
                py-2
                text-[13px]
                font-black
                transition-all
                duration-300

                ${
                  isActive(
                    "/innovation-lab"
                  )
                    ? `
                      border-fuchsia-300/50
                      bg-gradient-to-r
                      from-fuchsia-500/20
                      to-cyan-500/15
                      text-fuchsia-200
                      shadow-[0_0_24px_rgba(217,70,239,.18)]
                    `
                    : `
                      border-fuchsia-400/25
                      bg-fuchsia-400/[0.06]
                      text-fuchsia-300
                      hover:border-fuchsia-300/50
                      hover:bg-fuchsia-400/[0.12]
                      hover:shadow-[0_0_24px_rgba(217,70,239,.16)]
                    `
                }
              `}
            >
              🧪 Innovation Lab
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
                items-center
                justify-center
                whitespace-nowrap
                rounded-xl
                border
                border-purple-400/30
                bg-purple-400/[0.06]
                px-3
                py-2
                text-[13px]
                font-bold
                text-purple-300
                transition-all
                duration-300
                hover:border-purple-300
                hover:bg-purple-400/15
                hover:shadow-[0_0_20px_rgba(168,85,247,.15)]
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

          {/* =================================================
              RIGHT AREA
          ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            {user ? (
              <>
                {/* USER NAME */}

                <div
                  className="
                    hidden
                    text-right
                    2xl:block
                  "
                >
                  <p
                    className="
                      text-[10px]
                      text-gray-600
                    "
                  >
                    Welcome
                  </p>

                  <p
                    className="
                      max-w-[110px]
                      truncate
                      text-xs
                      font-semibold
                      text-gray-200
                    "
                  >
                    {displayName}
                  </p>
                </div>

                {/* DASHBOARD */}

                <Link
                  to="/dashboard"
                  className="
                    hidden
                    items-center
                    rounded-xl
                    border
                    border-cyan-400/35
                    bg-cyan-400/[0.06]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-cyan-300
                    transition
                    hover:border-cyan-300
                    hover:bg-cyan-400/10
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
                    items-center
                    rounded-xl
                    border
                    border-red-500/30
                    bg-red-500/[0.06]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-red-300
                    transition
                    hover:border-red-400
                    hover:bg-red-500/15
                    md:inline-flex
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="
                  hidden
                  rounded-xl
                  bg-white
                  px-4
                  py-2
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

            {/* MOBILE BUTTON */}

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
              aria-label="Toggle mobile menu"
              className="
                flex
                h-11
                w-11
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
              border-b
              border-t
              border-white/10
              bg-[#070914]/98
              shadow-[0_30px_80px_rgba(0,0,0,.55)]
              backdrop-blur-2xl
              xl:block
            "
          >
            <div
              className="
                mx-auto
                max-w-[1500px]
                px-8
                py-8
              "
            >
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
                      activeMegaMenu
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

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >
                {megaMenus[
                  activeMegaMenu
                ].map(
                  (item) => (
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
            MOBILE / TABLET MENU
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

              <MobileLink
                to="/"
                icon="🏠"
              >
                Home
              </MobileLink>

              {/* =================================================
                  NEW INNOVATION LAB MOBILE
              ================================================= */}

              <Link
                to="/innovation-lab"
                className="
                  relative
                  flex
                  items-center
                  justify-between
                  overflow-hidden
                  rounded-2xl
                  border
                  border-fuchsia-400/30
                  bg-gradient-to-r
                  from-fuchsia-500/[0.10]
                  to-cyan-500/[0.06]
                  px-4
                  py-4
                  transition
                  hover:border-fuchsia-300/50
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
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-fuchsia-400/20
                      bg-fuchsia-400/[0.08]
                      text-xl
                    "
                  >
                    🧪
                  </div>

                  <div>
                    <p
                      className="
                        font-black
                        text-fuchsia-200
                      "
                    >
                      Innovation Lab
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[11px]
                        text-gray-500
                      "
                    >
                      Create • Experiment •
                      Build
                    </p>
                  </div>
                </div>

                <span
                  className="
                    font-black
                    text-fuchsia-300
                  "
                >
                  →
                </span>
              </Link>

              {/* MEGA MENU MOBILE */}

              {Object.keys(
                megaMenus
              ).map(
                (menuName) => (
                  <div
                    key={
                      menuName
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
                            menuName
                              ? null
                              : menuName
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
                        py-3.5
                        font-semibold
                      "
                    >
                      <span>
                        {
                          menuName
                        }
                      </span>

                      <span
                        className={`
                          text-xs
                          transition-transform

                          ${
                            mobileSection ===
                            menuName
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      >
                        ▼
                      </span>
                    </button>

                    {mobileSection ===
                      menuName && (
                      <div
                        className="
                          mt-2
                          grid
                          grid-cols-1
                          gap-2
                          sm:grid-cols-2
                        "
                      >
                        {megaMenus[
                          menuName
                        ].map(
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
                )
              )}

              <MobileLink
                to="/community"
                icon="👥"
              >
                Community
              </MobileLink>

              <MobileLink
                to="/promotion"
                icon="📣"
              >
                Promotion
              </MobileLink>

              <MobileLink
                to="/premium"
                icon="💎"
              >
                Premium
              </MobileLink>

              <MobileLink
                to="/pricing"
                icon="💳"
              >
                Pricing
              </MobileLink>

              {/* AUTH */}

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
                    <div
                      className="
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        px-4
                        py-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          text-gray-600
                        "
                      >
                        Signed in as
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          font-black
                          text-white
                        "
                      >
                        {
                          displayName
                        }
                      </p>
                    </div>

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
                      font-black
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

      {/* =================================================
          CLICK OUTSIDE LAYER
      ================================================= */}

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

/* =========================================================
   MOBILE LINK COMPONENT
========================================================= */

function MobileLink({
  to,
  icon,
  children,
}) {
  return (
    <Link
      to={to}
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        px-4
        py-3.5
        font-semibold
        transition
        hover:border-cyan-400/20
        hover:bg-white/[0.04]
      "
    >
      <span>
        {icon}
      </span>

      <span>
        {children}
      </span>
    </Link>
  );
}

export default Navbar;