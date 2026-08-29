import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../supabase/client";
import { useLanguage } from "../../context/LanguageContext.jsx";

/* =========================================================
   MEGA MENU DATA
========================================================= */

const megaMenus = {
  AI: {
    en: "AI",
    ta: "AI",
    items: [
      {
        en: "AI Tools",
        ta: "AI கருவிகள்",
        icon: "🤖",
        path: "/ai-tools",
      },
      {
        en: "AI News",
        ta: "AI செய்திகள்",
        icon: "📰",
        path: "/ai-news",
      },
      {
        en: "AI Apps",
        ta: "AI செயலிகள்",
        icon: "📱",
        path: "/ai-apps",
      },
      {
        en: "AI Prompts",
        ta: "AI பிராம்ப்ட்கள்",
        icon: "✨",
        path: "/prompts",
      },
      {
        en: "AI Images",
        ta: "AI படங்கள்",
        icon: "🎨",
        path: "/ai-images",
      },
      {
        en: "AI Videos",
        ta: "AI வீடியோக்கள்",
        icon: "🎬",
        path: "/ai-videos",
      },
      {
        en: "AI Courses",
        ta: "AI பாடநெறிகள்",
        icon: "🎓",
        path: "/courses",
      },
      {
        en: "AI Models",
        ta: "AI மாடல்கள்",
        icon: "🧠",
        path: "/ai-models",
      },
      {
        en: "AI Datasets",
        ta: "AI தரவுத்தொகுப்புகள்",
        icon: "📊",
        path: "/ai-datasets",
      },
      {
        en: "Source Code",
        ta: "சோர்ஸ் கோடு",
        icon: "💻",
        path: "/source-code",
      },
      {
        en: "AI Templates",
        ta: "AI டெம்ப்ளேட்கள்",
        icon: "🧩",
        path: "/ai-templates",
      },
      {
        en: "Wallpapers",
        ta: "வால்பேப்பர்கள்",
        icon: "🌌",
        path: "/wallpapers",
      },
    ],
  },

  Creators: {
    en: "Creators",
    ta: "கிரியேட்டர்கள்",
    items: [
      {
        en: "YouTube Resources",
        ta: "YouTube வளங்கள்",
        icon: "▶️",
        path: "/creators/youtube",
      },
      {
        en: "Instagram Resources",
        ta: "Instagram வளங்கள்",
        icon: "📸",
        path: "/creators/instagram",
      },
      {
        en: "Video Editing",
        ta: "வீடியோ எடிட்டிங்",
        icon: "🎞️",
        path: "/creators/video-editing",
      },
      {
        en: "Thumbnail Packs",
        ta: "தம்ப்நெயில் பேக்குகள்",
        icon: "🖼️",
        path: "/creators/thumbnails",
      },
      {
        en: "Music & SFX",
        ta: "மியூசிக் & SFX",
        icon: "🎵",
        path: "/creators/music-sfx",
      },
      {
        en: "CapCut Templates",
        ta: "CapCut டெம்ப்ளேட்கள்",
        icon: "✂️",
        path: "/creators/capcut",
      },
      {
        en: "Premiere Pro",
        ta: "Premiere Pro",
        icon: "🎬",
        path: "/creators/premiere",
      },
      {
        en: "Canva Templates",
        ta: "Canva டெம்ப்ளேட்கள்",
        icon: "🎨",
        path: "/creators/canva",
      },
      {
        en: "Motion Graphics",
        ta: "மோஷன் கிராஃபிக்ஸ்",
        icon: "💫",
        path: "/creators/motion-graphics",
      },
      {
        en: "Green Screen",
        ta: "கிரீன் ஸ்கிரீன்",
        icon: "🟢",
        path: "/creators/green-screen",
      },
      {
        en: "PNG Packs",
        ta: "PNG பேக்குகள்",
        icon: "🧷",
        path: "/creators/png-packs",
      },
      {
        en: "Intro / Outro",
        ta: "இன்ட்ரோ / அவுட்ரோ",
        icon: "🚀",
        path: "/creators/intro-outro",
      },
    ],
  },

  Technology: {
    en: "Technology",
    ta: "தொழில்நுட்பம்",
    items: [
      {
        en: "Android Apps",
        ta: "Android செயலிகள்",
        icon: "📱",
        path: "/technology/android",
      },
      {
        en: "Windows Software",
        ta: "Windows மென்பொருள்",
        icon: "🖥️",
        path: "/technology/windows",
      },
      {
        en: "AI Software",
        ta: "AI மென்பொருள்",
        icon: "🤖",
        path: "/technology/ai-software",
      },
      {
        en: "Mobile Tips",
        ta: "மொபைல் குறிப்புகள்",
        icon: "📲",
        path: "/technology/mobile-tips",
      },
      {
        en: "Tech News",
        ta: "டெக் செய்திகள்",
        icon: "📰",
        path: "/technology/news",
      },
      {
        en: "Chrome Extensions",
        ta: "Chrome Extensions",
        icon: "🧩",
        path: "/technology/chrome",
      },
      {
        en: "Laptop Tips",
        ta: "லேப்டாப் குறிப்புகள்",
        icon: "💻",
        path: "/technology/laptop-tips",
      },
      {
        en: "Cyber Security",
        ta: "சைபர் பாதுகாப்பு",
        icon: "🛡️",
        path: "/technology/cyber-security",
      },
      {
        en: "Programming",
        ta: "புரோகிராமிங்",
        icon: "👨‍💻",
        path: "/technology/programming",
      },
      {
        en: "Coding Resources",
        ta: "கோடிங் வளங்கள்",
        icon: "⚙️",
        path: "/technology/coding-resources",
      },
    ],
  },

  Products: {
    en: "Products",
    ta: "பொருட்கள்",
    items: [
      {
        en: "Free Products",
        ta: "இலவச பொருட்கள்",
        icon: "🎁",
        path: "/products/free",
      },
      {
        en: "Premium Products",
        ta: "பிரீமியம் பொருட்கள்",
        icon: "💎",
        path: "/products/premium",
      },
      {
        en: "AI Prompts",
        ta: "AI பிராம்ப்ட்கள்",
        icon: "✨",
        path: "/products/prompts",
      },
      {
        en: "eBooks & PDFs",
        ta: "eBooks & PDFs",
        icon: "📚",
        path: "/products/ebooks",
      },
      {
        en: "Templates",
        ta: "டெம்ப்ளேட்கள்",
        icon: "📦",
        path: "/products/templates",
      },
      {
        en: "Icons & Fonts",
        ta: "ஐகான்கள் & எழுத்துருக்கள்",
        icon: "🔤",
        path: "/products/icons-fonts",
      },
      {
        en: "UI Kits",
        ta: "UI கிட்கள்",
        icon: "🖌️",
        path: "/products/ui-kits",
      },
      {
        en: "Source Code",
        ta: "சோர்ஸ் கோடு",
        icon: "💻",
        path: "/products/source-code",
      },
      {
        en: "Photoshop Files",
        ta: "Photoshop கோப்புகள்",
        icon: "🧠",
        path: "/products/photoshop",
      },
      {
        en: "CapCut Templates",
        ta: "CapCut டெம்ப்ளேட்கள்",
        icon: "✂️",
        path: "/products/capcut",
      },
      {
        en: "LUTs & Presets",
        ta: "LUTs & Presets",
        icon: "🎛️",
        path: "/products/luts",
      },
      {
        en: "Animation Packs",
        ta: "அனிமேஷன் பேக்குகள்",
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
  const [user, setUser] = useState(null);
  const [activeMegaMenu, setActiveMegaMenu] =
    useState(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [mobileSection, setMobileSection] =
    useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    language,
    changeLanguage,
  } = useLanguage();

  const isTamil = language === "ta";

  const text = (english, tamil) =>
    isTamil ? tamil : english;

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =========================================================
     ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
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
     USER NAME
  ========================================================= */

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  /* =========================================================
     DESKTOP BUTTON STYLE
  ========================================================= */

  const navButtonClass = `
    h-10
    inline-flex
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
          backdrop-blur-2xl
          text-white
        "
      >
        {/* =====================================================
            MAIN NAVBAR
        ===================================================== */}

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
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="
              shrink-0
              whitespace-nowrap
              text-[22px]
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

          {/* =================================================
              DESKTOP CENTER MENU
          ================================================= */}

          <div
            className="
              hidden
              xl:flex
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1
            "
          >
            <Link
              to="/"
              className={navButtonClass}
            >
              {text("Home", "முகப்பு")}
            </Link>

            {Object.keys(megaMenus).map(
              (menuKey) => {
                const menu =
                  megaMenus[menuKey];

                return (
                  <button
                    key={menuKey}
                    type="button"
                    onClick={() =>
                      setActiveMegaMenu(
                        (current) =>
                          current === menuKey
                            ? null
                            : menuKey
                      )
                    }
                    className={`
                      ${navButtonClass}

                      ${
                        activeMegaMenu ===
                        menuKey
                          ? "bg-cyan-400/[0.07] text-cyan-300"
                          : ""
                      }
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {isTamil
                        ? menu.ta
                        : menu.en}

                      <span
                        className={`
                          text-[10px]
                          transition-transform
                          duration-200

                          ${
                            activeMegaMenu ===
                            menuKey
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
              className={navButtonClass}
            >
              {text(
                "Community",
                "சமூகம்"
              )}
            </Link>

            <Link
              to="/promotion"
              className={navButtonClass}
            >
              {text(
                "Promotion",
                "ப்ரமோஷன்"
              )}
            </Link>

            <Link
              to="/premium"
              className="
                h-10
                inline-flex
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
              💎{" "}
              {text(
                "Premium",
                "பிரீமியம்"
              )}
            </Link>

            <Link
              to="/pricing"
              className={navButtonClass}
            >
              {text(
                "Pricing",
                "விலை"
              )}
            </Link>
          </div>

          {/* =================================================
              RIGHT AREA
          ================================================= */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            {/* ===============================================
                LANGUAGE DESKTOP
            =============================================== */}

            <div
              className="
                hidden
                xl:flex
                h-10
                shrink-0
                items-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.035]
                p-1
              "
            >
              <button
                type="button"
                onClick={() =>
                  changeLanguage("en")
                }
                className={`
                  h-8
                  min-w-[38px]
                  rounded-lg
                  px-2
                  text-xs
                  font-black
                  transition-all

                  ${
                    language === "en"
                      ? "bg-cyan-400 text-black"
                      : "text-gray-400 hover:text-white"
                  }
                `}
              >
                EN
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage("ta")
                }
                className={`
                  h-8
                  rounded-lg
                  px-2.5
                  text-xs
                  font-bold
                  transition-all

                  ${
                    language === "ta"
                      ? "bg-cyan-400 text-black"
                      : "text-gray-400 hover:text-white"
                  }
                `}
              >
                தமிழ்
              </button>
            </div>

            {/* ===============================================
                LOGGED IN
            =============================================== */}

            {user ? (
              <>
                {/* USER NAME */}

                <div
                  className="
                    hidden
                    2xl:block
                    max-w-[115px]
                    text-right
                  "
                >
                  <p className="text-[10px] leading-none text-gray-500">
                    {text(
                      "Welcome",
                      "வரவேற்கிறோம்"
                    )}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      font-bold
                      text-gray-200
                    "
                    title={displayName}
                  >
                    {displayName}
                  </p>
                </div>

                {/* DASHBOARD */}

                <Link
                  to="/dashboard"
                  className="
                    hidden
                    sm:inline-flex
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
                  "
                >
                  {text(
                    "Dashboard",
                    "டாஷ்போர்டு"
                  )}
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    hidden
                    xl:inline-flex
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
                  "
                >
                  🚪{" "}
                  {text(
                    "Logout",
                    "வெளியேறு"
                  )}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="
                  hidden
                  sm:inline-flex
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
                "
              >
                {text(
                  "Login",
                  "உள்நுழை"
                )}
              </Link>
            )}

            {/* ===============================================
                MOBILE / TABLET MENU BUTTON
            =============================================== */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              aria-label="Toggle navigation menu"
              className="
                xl:hidden
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
              "
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* =====================================================
            DESKTOP MEGA MENU
        ===================================================== */}

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
                    {text(
                      "Explore",
                      "ஆராயுங்கள்"
                    )}
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    {isTamil
                      ? megaMenus[
                          activeMegaMenu
                        ].ta
                      : megaMenus[
                          activeMegaMenu
                        ].en}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveMegaMenu(null)
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
                  xl:grid-cols-4
                "
              >
                {megaMenus[
                  activeMegaMenu
                ].items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
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
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-semibold
                          text-white
                        "
                      >
                        {isTamil
                          ? item.ta
                          : item.en}
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-gray-500
                        "
                      >
                        {text(
                          "Open section →",
                          "பகுதியை திறக்க →"
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            MOBILE / TABLET MENU
        ===================================================== */}

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
              {/* LANGUAGE */}

              <div
                className="
                  mb-4
                  rounded-2xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/[0.04]
                  p-3
                "
              >
                <p
                  className="
                    mb-2
                    text-xs
                    font-bold
                    text-gray-500
                  "
                >
                  🌐{" "}
                  {text(
                    "Language",
                    "மொழி"
                  )}
                </p>

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      changeLanguage("en")
                    }
                    className={`
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-sm
                      font-bold
                      transition

                      ${
                        language === "en"
                          ? "border-cyan-400 bg-cyan-400 text-black"
                          : "border-white/10 bg-white/[0.03] text-gray-300"
                      }
                    `}
                  >
                    English
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeLanguage("ta")
                    }
                    className={`
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-sm
                      font-bold
                      transition

                      ${
                        language === "ta"
                          ? "border-cyan-400 bg-cyan-400 text-black"
                          : "border-white/10 bg-white/[0.03] text-gray-300"
                      }
                    `}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

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
                🏠{" "}
                {text(
                  "Home",
                  "முகப்பு"
                )}
              </Link>

              {/* MEGA MENUS */}

              {Object.keys(megaMenus).map(
                (menuKey) => {
                  const menu =
                    megaMenus[menuKey];

                  return (
                    <div key={menuKey}>
                      <button
                        type="button"
                        onClick={() =>
                          setMobileSection(
                            (current) =>
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
                          {isTamil
                            ? menu.ta
                            : menu.en}
                        </span>

                        <span
                          className={`
                            text-xs
                            transition-transform

                            ${
                              mobileSection ===
                              menuKey
                                ? "rotate-180"
                                : ""
                            }
                          `}
                        >
                          ▼
                        </span>
                      </button>

                      {mobileSection ===
                        menuKey && (
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
                            (item) => (
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
                                "
                              >
                                <span className="text-xl">
                                  {
                                    item.icon
                                  }
                                </span>

                                <span>
                                  {isTamil
                                    ? item.ta
                                    : item.en}
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
                👥{" "}
                {text(
                  "Community",
                  "சமூகம்"
                )}
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
                📣{" "}
                {text(
                  "Promotion",
                  "ப்ரமோஷன்"
                )}
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
                💎{" "}
                {text(
                  "Premium",
                  "பிரீமியம்"
                )}
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
                💰{" "}
                {text(
                  "Pricing",
                  "விலை திட்டங்கள்"
                )}
              </Link>

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
                  <div className="space-y-2">
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
                        {text(
                          "Logged in as",
                          "உள்நுழைந்தவர்"
                        )}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          font-bold
                          text-white
                        "
                      >
                        {displayName}
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
                      📊{" "}
                      {text(
                        "Dashboard",
                        "டாஷ்போர்டு"
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
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
                      🚪{" "}
                      {text(
                        "Logout",
                        "வெளியேறு"
                      )}
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
                    {text(
                      "Login",
                      "உள்நுழை"
                    )}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* =====================================================
          OUTSIDE CLICK LAYER
      ===================================================== */}

      {activeMegaMenu && (
        <button
          type="button"
          aria-label="Close mega menu"
          onClick={() =>
            setActiveMegaMenu(null)
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