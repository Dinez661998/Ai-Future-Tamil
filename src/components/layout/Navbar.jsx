import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../supabase/client";

const megaMenus = {
  AI: [
    { label: "AI Tools", icon: "🤖", path: "/ai-tools" },
    { label: "AI News", icon: "📰", path: "/ai-news" },
    { label: "AI Apps", icon: "📱", path: "/ai-apps" },
    { label: "AI Prompts", icon: "✨", path: "/prompts" },
    { label: "AI Images", icon: "🎨", path: "/ai-images" },
    { label: "AI Videos", icon: "🎬", path: "/ai-videos" },
    { label: "AI Courses", icon: "🎓", path: "/courses" },
    { label: "AI Models", icon: "🧠", path: "/ai-models" },
    { label: "AI Datasets", icon: "📊", path: "/ai-datasets" },
    { label: "Source Code", icon: "💻", path: "/source-code" },
    { label: "AI Templates", icon: "🧩", path: "/ai-templates" },
    { label: "Wallpapers", icon: "🌌", path: "/wallpapers" },
  ],

  Creators: [
    { label: "YouTube Resources", icon: "▶️", path: "/creators/youtube" },
    { label: "Instagram Resources", icon: "📸", path: "/creators/instagram" },
    { label: "Video Editing", icon: "🎞️", path: "/creators/video-editing" },
    { label: "Thumbnail Packs", icon: "🖼️", path: "/creators/thumbnails" },
    { label: "Music & SFX", icon: "🎵", path: "/creators/music-sfx" },
    { label: "CapCut Templates", icon: "✂️", path: "/creators/capcut" },
    { label: "Premiere Pro", icon: "🎬", path: "/creators/premiere" },
    { label: "Canva Templates", icon: "🎨", path: "/creators/canva" },
    { label: "Motion Graphics", icon: "💫", path: "/creators/motion-graphics" },
    { label: "Green Screen", icon: "🟢", path: "/creators/green-screen" },
    { label: "PNG Packs", icon: "🧷", path: "/creators/png-packs" },
    { label: "Intro / Outro", icon: "🚀", path: "/creators/intro-outro" },
  ],

  Technology: [
    { label: "Android Apps", icon: "📱", path: "/technology/android" },
    { label: "Windows Software", icon: "🖥️", path: "/technology/windows" },
    { label: "AI Software", icon: "🤖", path: "/technology/ai-software" },
    { label: "Mobile Tips", icon: "📲", path: "/technology/mobile-tips" },
    { label: "Tech News", icon: "📰", path: "/technology/news" },
    { label: "Chrome Extensions", icon: "🧩", path: "/technology/chrome" },
    { label: "Laptop Tips", icon: "💻", path: "/technology/laptop-tips" },
    { label: "Cyber Security", icon: "🛡️", path: "/technology/cyber-security" },
    { label: "Programming", icon: "👨‍💻", path: "/technology/programming" },
    { label: "Coding Resources", icon: "⚙️", path: "/technology/coding-resources" },
  ],

  Products: [
    { label: "Free Products", icon: "🎁", path: "/products/free" },
    { label: "Premium Products", icon: "💎", path: "/products/premium" },
    { label: "AI Prompts", icon: "✨", path: "/products/prompts" },
    { label: "eBooks & PDFs", icon: "📚", path: "/products/ebooks" },
    { label: "Templates", icon: "📦", path: "/products/templates" },
    { label: "Icons & Fonts", icon: "🔤", path: "/products/icons-fonts" },
    { label: "UI Kits", icon: "🖌️", path: "/products/ui-kits" },
    { label: "Source Code", icon: "💻", path: "/products/source-code" },
    { label: "Photoshop Files", icon: "🧠", path: "/products/photoshop" },
    { label: "CapCut Templates", icon: "✂️", path: "/products/capcut" },
    { label: "LUTs & Presets", icon: "🎛️", path: "/products/luts" },
    { label: "Animation Packs", icon: "🎞️", path: "/products/animations" },
  ],
};

function Navbar() {
  const [user, setUser] = useState(null);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [location.pathname]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setUser(null);
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const navButtonClass =
    "relative px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:text-cyan-300";

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
          bg-black/70
          backdrop-blur-2xl
          text-white
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            py-4
            flex
            items-center
            justify-between
            gap-4
          "
        >
          {/* LOGO */}
          <Link
            to="/"
            className="
              shrink-0
              text-xl
              sm:text-2xl
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

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-2">

            <Link
              to="/"
              className={navButtonClass}
            >
              Home
            </Link>

            {Object.keys(megaMenus).map((menuName) => (
              <button
                key={menuName}
                type="button"
                onClick={() =>
                  setActiveMegaMenu((current) =>
                    current === menuName ? null : menuName
                  )
                }
                className={`
                  ${navButtonClass}
                  ${
                    activeMegaMenu === menuName
                      ? "text-cyan-300"
                      : ""
                  }
                `}
              >
                <span className="flex items-center gap-1.5">
                  {menuName}

                  <span
                    className={`
                      text-xs
                      transition-transform
                      duration-300
                      ${
                        activeMegaMenu === menuName
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  >
                    ▼
                  </span>
                </span>
              </button>
            ))}

            <Link
              to="/community"
              className={navButtonClass}
            >
              Community
            </Link>

<Link
  to="/promotion"
  className={navButtonClass}
>
  Promotion
</Link>

<Link
  to="/premium"
  className="
    px-4
    py-2
    rounded-xl
    border
    border-purple-400/30
    bg-purple-400/[0.06]
    text-purple-300
    text-sm
    font-bold
    transition-all
    duration-300
    hover:bg-purple-400/15
    hover:border-purple-300
    hover:shadow-[0_0_20px_rgba(168,85,247,.15)]
  "
>
  💎 Premium
</Link>

            <Link
              to="/pricing"
              className={navButtonClass}
            >
              Pricing
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">

            {user ? (
              <>
                <div className="hidden xl:block text-right mr-1">
                  <p className="text-[11px] text-gray-500">
                    Welcome
                  </p>

                  <p className="text-sm font-semibold text-gray-200 max-w-[140px] truncate">
                    {displayName}
                  </p>
                </div>

                <Link
                  to="/dashboard"
                  className="
                    hidden
                    sm:inline-flex
                    items-center
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-cyan-400/40
                    bg-cyan-400/[0.06]
                    text-cyan-300
                    text-sm
                    font-semibold
                    transition
                    hover:bg-cyan-400/10
                    hover:border-cyan-300
                  "
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    hidden
                    md:inline-flex
                    items-center
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-red-500/40
                    bg-red-500/[0.06]
                    text-red-300
                    text-sm
                    font-semibold
                    transition
                    hover:bg-red-500/15
                    hover:border-red-400
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
                  sm:inline-flex
                  px-5
                  py-2.5
                  rounded-xl
                  bg-white
                  text-black
                  font-bold
                  text-sm
                  transition
                  hover:bg-gray-200
                "
              >
                Login
              </Link>

              



            )}

            {/* MOBILE BUTTON */}
            <button
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              aria-label="Toggle mobile menu"
              className="
                lg:hidden
                w-11
                h-11
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                flex
                items-center
                justify-center
                text-xl
                transition
                hover:border-cyan-400/40
              "
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* DESKTOP MEGA MENU */}
        {activeMegaMenu && (
          <div
            className="
              hidden
              lg:block
              absolute
              left-0
              right-0
              top-full
              border-t
              border-white/10
              border-b
              border-white/10
              bg-[#070914]/98
              backdrop-blur-2xl
              shadow-[0_30px_80px_rgba(0,0,0,.55)]
            "
          >
            <div className="max-w-7xl mx-auto px-6 py-8">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-cyan-400 text-sm font-semibold mb-1">
                    Explore
                  </p>

                  <h2 className="text-2xl font-black">
                    {activeMegaMenu}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMegaMenu(null)}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-white/10
                    text-gray-400
                    hover:text-white
                    hover:border-white/20
                    transition
                  "
                >
                  ✕
                </button>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  xl:grid-cols-4
                  gap-3
                "
              >
                {megaMenus[activeMegaMenu].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
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
                        w-12
                        h-12
                        shrink-0
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        flex
                        items-center
                        justify-center
                        text-2xl
                        transition
                        group-hover:border-cyan-400/30
                      "
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">
                        {item.label}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Open section →
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div
            className="
              lg:hidden
              border-t
              border-white/10
              bg-[#070914]/98
              backdrop-blur-2xl
              px-4
              py-5
            "
          >
            <div className="space-y-2">

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

              {Object.keys(megaMenus).map((menuName) => (
                <div key={menuName}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSection((current) =>
                        current === menuName ? null : menuName
                      )
                    }
                    className="
                      w-full
                      flex
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
                    <span>{menuName}</span>

                    <span
                      className={`
                        text-xs
                        transition-transform
                        ${
                          mobileSection === menuName
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    >
                      ▼
                    </span>
                  </button>

                  {mobileSection === menuName && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">

                      {megaMenus[menuName].map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
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
                            {item.icon}
                          </span>

                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

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
                💎 Pricing
              </Link>

              <div className="pt-3 border-t border-white/10 mt-4">

                {user ? (
                  <div className="space-y-2">

                    <p className="px-2 py-2 text-sm text-gray-400">
                      Hi,{" "}
                      <span className="text-white font-semibold">
                        {displayName}
                      </span>
                    </p>

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
                        text-cyan-300
                        font-semibold
                      "
                    >
                      📊 Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        w-full
                        text-left
                        rounded-xl
                        border
                        border-red-500/30
                        bg-red-500/[0.06]
                        px-4
                        py-3
                        text-red-300
                        font-semibold
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
                      text-center
                      rounded-xl
                      bg-white
                      px-4
                      py-3
                      text-black
                      font-bold
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

      {/* CLICK OUTSIDE LAYER */}
      {activeMegaMenu && (
        <button
          type="button"
          aria-label="Close mega menu"
          onClick={() => setActiveMegaMenu(null)}
          className="
            hidden
            lg:block
            fixed
            inset-0
            z-[9400]
            cursor-default
            bg-black/20
          "
        />
      )}
    </>
  );
}

export default Navbar;