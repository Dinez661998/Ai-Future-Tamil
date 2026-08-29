import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { lazy, Suspense, useState } from "react";

/* =========================================================
   GLOBAL COMPONENTS
========================================================= */

import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/layout/Navbar";
import NotificationCenter from "./components/NotificationCenter";
import ProtectedRoute from "./components/ProtectedRoute";
import CommandCenter from "./components/CommandCenter";
import Footer from "./components/Footer";

/* =========================================================
   LAZY LOADED PAGES
========================================================= */

const Home = lazy(() => import("./pages/Home"));
const AITools = lazy(() => import("./pages/AITools"));
const AINews = lazy(() => import("./pages/AINews"));
const Prompts = lazy(() => import("./pages/Prompts"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const ToolDetails = lazy(() => import("./pages/ToolDetails"));
const NewsDetails = lazy(() => import("./pages/NewsDetails"));
const Courses = lazy(() => import("./pages/Courses"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AIHubPage = lazy(() => import("./pages/AIHubPage"));
const CreatorHubPage = lazy(() => import("./pages/CreatorHubPage"));
const TechnologyHubPage = lazy(() => import("./pages/TechnologyHubPage"));
const ProductsHubPage = lazy(() => import("./pages/ProductsHubPage"));

const Community = lazy(() => import("./pages/Community"));
const PromotionHub = lazy(() => import("./pages/PromotionHub"));
const PremiumHub = lazy(() => import("./pages/PremiumHub"));

/* =========================================================
   SIDEBAR DATA
========================================================= */

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
    title: "Digital Products",
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
      ["🤖", "AI Tools", "/ai-tools"],
      ["✨", "Prompts", "/prompts"],
      ["🎓", "Courses", "/courses"],
      ["📰", "AI News", "/ai-news"],
      ["💎", "Premium", "/premium"],
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

  info: {
    icon: "ℹ️",
    title: "Information",
    items: [
      ["🏠", "Home", "/"],
      ["ℹ️", "About Us", "/about"],
      ["📩", "Contact", "/contact"],
      ["🔒", "Privacy Policy", "/privacy"],
      ["📜", "Terms & Conditions", "/terms"],
      ["💎", "Premium", "/premium"],
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

/* =========================================================
   DETECT SECTION
========================================================= */

function detectSection(path) {
  if (path.startsWith("/creators")) return "creators";

  if (path.startsWith("/technology")) return "technology";

  if (path.startsWith("/products")) return "products";

  if (path.startsWith("/community")) return "community";

  if (path.startsWith("/promotion")) return "promotion";

  if (path.startsWith("/premium")) return "premium";

  if (
    path === "/about" ||
    path === "/privacy" ||
    path === "/terms" ||
    path === "/contact"
  ) {
    return "info";
  }

  if (
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

/* =========================================================
   SIDEBAR
========================================================= */

function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const section =
    detectSection(location.pathname);

  const menu =
    menus[section];

  const isActive = (path) => {
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

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const SidebarContent = ({
    mobile = false,
  }) => (
    <div
      className={`
        flex
        h-full
        min-h-0
        flex-col
        bg-[#070914]

        ${mobile ? "" : "pt-[104px]"}
      `}
    >
      {/* BACK */}

      <div
        className="
          shrink-0
          border-b
          border-white/[0.08]
          p-4
        "
      >
        <button
          type="button"
          onClick={goBack}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-2xl
            border
            border-purple-400/30
            bg-purple-400/[0.07]
            px-5
            py-4
            font-black
            text-white
            transition-all
            duration-300
            hover:border-purple-300
            hover:bg-purple-400/[0.12]
          "
        >
          <span className="text-xl transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back
        </button>
      </div>

      {/* HEADER */}

      <div
        className="
          shrink-0
          border-b
          border-white/[0.08]
          px-5
          py-5
        "
      >
        <p
          className="
            mb-3
            text-[11px]
            font-bold
            uppercase
            tracking-[0.22em]
            text-gray-600
          "
        >
          Explore
        </p>

        <div className="flex items-center gap-4">

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
              border-white/[0.08]
              bg-white/[0.04]
              text-2xl
            "
          >
            {menu.icon}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-black">
              {menu.title}
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Explore resources
            </p>
          </div>

        </div>
      </div>

      {/* LINKS */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-4
        "
      >
        <div className="space-y-1">

          {menu.items.map(
            ([icon, label, path], index) => {

              const selected =
                isActive(path);

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
                    rounded-2xl
                    border
                    px-3
                    py-3
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      selected
                        ? `
                          border-cyan-400/30
                          bg-cyan-400/[0.09]
                          text-cyan-300
                        `
                        : `
                          border-transparent
                          text-gray-400
                          hover:border-white/[0.08]
                          hover:bg-white/[0.035]
                          hover:text-white
                        `
                    }
                  `}
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.04]
                      bg-white/[0.035]
                      text-lg
                    "
                  >
                    {icon}
                  </span>

                  <span className="flex-1 truncate">
                    {label}
                  </span>

                  {selected && (
                    <span
                      className="
                        h-2
                        w-2
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

        {/* PREMIUM CARD */}

        <div
          className="
            mt-7
            rounded-3xl
            border
            border-purple-400/20
            bg-gradient-to-br
            from-purple-500/[0.08]
            via-transparent
            to-cyan-500/[0.05]
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
            Premium prompts, courses,
            files and exclusive resources.
          </p>

          <Link
            to="/premium"
            className="
              mt-4
              inline-block
              text-sm
              font-bold
              text-purple-300
            "
          >
            Explore Premium →
          </Link>
        </div>

        <div className="h-5" />

      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP */}

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
          border-white/[0.08]
          bg-[#070914]
          lg:block
        "
      >
        <SidebarContent />
      </aside>

      {/* MOBILE BUTTON */}

      <button
        type="button"
        onClick={() =>
          setMobileOpen(true)
        }
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
          lg:hidden
        "
      >
        ☰
      </button>

      {/* MOBILE BACKDROP */}

      {mobileOpen && (
        <div
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

      {/* MOBILE SIDEBAR */}

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
          bg-[#070914]
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
        <SidebarContent mobile />
      </aside>
    </>
  );
}

/* =========================================================
   REUSABLE INFO PAGE
========================================================= */

function InfoPage({
  icon,
  eyebrow,
  title,
  subtitle,
  sections,
}) {
  return (
    <main
      className="
        min-h-screen
        bg-transparent
        px-5
        py-10
        text-white
        sm:px-7
        lg:px-10
      "
    >
      <div className="mx-auto max-w-[1300px]">

        {/* HERO */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.08]
            bg-black/30
            p-7
            backdrop-blur-xl
            sm:p-10
          "
        >
          <div
            className="
              absolute
              -right-20
              -top-20
              h-72
              w-72
              rounded-full
              bg-purple-500/10
              blur-3xl
            "
          />

          <div className="relative z-10">

            <div
              className="
                mb-6
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-cyan-400/20
                bg-cyan-400/[0.05]
                text-4xl
              "
            >
              {icon}
            </div>

            <p
              className="
                mb-3
                text-sm
                font-bold
                text-cyan-400
              "
            >
              {eyebrow}
            </p>

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              {title}
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-lg
                leading-8
                text-gray-400
              "
            >
              {subtitle}
            </p>

          </div>
        </section>

        {/* SECTIONS */}

        <section
          className="
            mt-7
            space-y-5
          "
        >
          {sections.map(
            (section, index) => (
              <article
                key={section.title}
                className="
                  rounded-[26px]
                  border
                  border-white/[0.08]
                  bg-black/25
                  p-6
                  backdrop-blur-xl
                  sm:p-8
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-purple-400/20
                      bg-purple-400/[0.05]
                      font-black
                      text-purple-300
                    "
                  >
                    {index + 1}
                  </div>

                  <div>
                    <h2
                      className="
                        text-xl
                        font-black
                        sm:text-2xl
                      "
                    >
                      {section.title}
                    </h2>

                    <div
                      className="
                        mt-3
                        space-y-3
                        text-sm
                        leading-7
                        text-gray-400
                        sm:text-base
                      "
                    >
                      {section.text.map(
                        (paragraph) => (
                          <p key={paragraph}>
                            {paragraph}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                </div>
              </article>
            )
          )}
        </section>

        {/* CONTACT CARD */}

        <section
          className="
            mt-7
            rounded-[26px]
            border
            border-cyan-400/20
            bg-cyan-400/[0.04]
            p-7
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="font-black">
                Need help?
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Contact AI Future Tamil
                for questions or support.
              </p>
            </div>

            <Link
              to="/contact"
              className="
                rounded-xl
                bg-white
                px-6
                py-3
                text-center
                font-black
                text-black
                transition
                hover:bg-gray-200
              "
            >
              Contact Us →
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

function AboutPage() {
  return (
    <InfoPage
      icon="🚀"
      eyebrow="ABOUT AI FUTURE TAMIL"
      title="Learn. Create. Grow with AI."
      subtitle="AI Future Tamil is a platform built to help users discover AI tools, creator resources, technology, learning content and useful digital products in one place."
      sections={[
        {
          title: "Our Mission",
          text: [
            "Our goal is to make useful AI and technology resources easier to discover and understand.",
            "We aim to support learners, creators, developers and technology enthusiasts with practical resources and simple navigation.",
          ],
        },

        {
          title: "What You Can Explore",
          text: [
            "AI Future Tamil includes AI tools, prompts, courses, AI news, creator resources, technology resources, digital products, community features and premium content.",
          ],
        },

        {
          title: "For Creators",
          text: [
            "Creators can explore YouTube resources, Instagram resources, video editing tools, thumbnail packs, music, sound effects, templates and promotion opportunities.",
          ],
        },

        {
          title: "For Learners",
          text: [
            "Learners can explore AI tools, courses, prompts, programming resources and technology content designed to make learning easier.",
          ],
        },

        {
          title: "Our Vision",
          text: [
            "We want AI Future Tamil to grow into a useful digital ecosystem where AI, technology, learning and creator resources are available through one platform.",
          ],
        },
      ]}
    />
  );
}

/* =========================================================
   PRIVACY PAGE
========================================================= */

function PrivacyPage() {
  return (
    <InfoPage
      icon="🔒"
      eyebrow="LEGAL & PRIVACY"
      title="Privacy Policy"
      subtitle="This page explains how AI Future Tamil may collect, use and protect information when you use the platform."
      sections={[
        {
          title: "Information We Collect",
          text: [
            "When account features are used, information such as your name, email address, user ID and account creation date may be stored.",
            "The platform may also store activity related to saved resources, favorites, courses or other account features when those systems are enabled.",
          ],
        },

        {
          title: "How Information Is Used",
          text: [
            "Information may be used to provide account features, improve user experience, maintain saved content and support platform functionality.",
          ],
        },

        {
          title: "Authentication",
          text: [
            "AI Future Tamil may use Supabase authentication and database services for account login, signup and related user data features.",
          ],
        },

        {
          title: "Cookies and Local Storage",
          text: [
            "The website may use browser local storage or similar technologies to remember preferences, dashboard activity or saved items.",
          ],
        },

        {
          title: "Third-Party Services",
          text: [
            "Some pages may link to third-party AI tools, websites or services. Their privacy practices are controlled by those third-party providers.",
          ],
        },

        {
          title: "Data Security",
          text: [
            "Reasonable technical measures should be used to protect stored account information. No online system can guarantee absolute security.",
          ],
        },

        {
          title: "Policy Updates",
          text: [
            "This privacy policy may be updated as AI Future Tamil adds new features, services or integrations.",
          ],
        },
      ]}
    />
  );
}

/* =========================================================
   TERMS PAGE
========================================================= */

function TermsPage() {
  return (
    <InfoPage
      icon="📜"
      eyebrow="LEGAL INFORMATION"
      title="Terms & Conditions"
      subtitle="By using AI Future Tamil, users agree to use the platform and its resources responsibly."
      sections={[
        {
          title: "Platform Use",
          text: [
            "AI Future Tamil provides information, resources, tools, links, learning content and digital platform features.",
            "Users are responsible for how they use information or third-party resources discovered through the platform.",
          ],
        },

        {
          title: "User Accounts",
          text: [
            "Users are responsible for maintaining access to their account and providing accurate information when creating an account.",
          ],
        },

        {
          title: "Third-Party Tools",
          text: [
            "AI Future Tamil may provide links to AI tools, websites and external services. Availability, pricing and functionality of those services may change independently.",
          ],
        },

        {
          title: "Digital Products",
          text: [
            "Free and premium digital resources may have specific usage restrictions or licensing conditions. Users should follow the terms provided with each resource.",
          ],
        },

        {
          title: "Community Use",
          text: [
            "Users should not post abusive, illegal, misleading or harmful content in community areas.",
          ],
        },

        {
          title: "Premium Features",
          text: [
            "Premium features, memberships, downloads and pricing may change as the platform evolves.",
          ],
        },

        {
          title: "Changes to Terms",
          text: [
            "These terms may be updated when new features, services, payment systems or platform policies are introduced.",
          ],
        },
      ]}
    />
  );
}

/* =========================================================
   PAGE LOADER
========================================================= */

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />
        <p className="text-sm font-bold text-gray-400">
          Loading AI Future Tamil...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   WEBSITE ROUTES
========================================================= */

function WebsiteRoutes() {
  return (
    <Routes>

      {/* HOME */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* AI HUB */}

      <Route
        path="/ai-apps"
        element={<AIHubPage />}
      />

      <Route
        path="/ai-images"
        element={<AIHubPage />}
      />

      <Route
        path="/ai-videos"
        element={<AIHubPage />}
      />

      <Route
        path="/ai-models"
        element={<AIHubPage />}
      />

      <Route
        path="/ai-datasets"
        element={<AIHubPage />}
      />

      <Route
        path="/source-code"
        element={<AIHubPage />}
      />

      <Route
        path="/ai-templates"
        element={<AIHubPage />}
      />

      <Route
        path="/wallpapers"
        element={<AIHubPage />}
      />

      {/* CREATOR HUB */}

      <Route
        path="/creators/youtube"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/instagram"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/video-editing"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/thumbnails"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/music-sfx"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/capcut"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/premiere"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/canva"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/motion-graphics"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/green-screen"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/png-packs"
        element={<CreatorHubPage />}
      />

      <Route
        path="/creators/intro-outro"
        element={<CreatorHubPage />}
      />

      {/* TECHNOLOGY */}

      <Route
        path="/technology/android"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/windows"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/ai-software"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/mobile-tips"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/news"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/chrome"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/laptop-tips"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/cyber-security"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/programming"
        element={<TechnologyHubPage />}
      />

      <Route
        path="/technology/coding-resources"
        element={<TechnologyHubPage />}
      />

      {/* PRODUCTS */}

      <Route
        path="/products/free"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/premium"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/prompts"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/ebooks"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/templates"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/icons-fonts"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/ui-kits"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/source-code"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/photoshop"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/capcut"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/luts"
        element={<ProductsHubPage />}
      />

      <Route
        path="/products/animations"
        element={<ProductsHubPage />}
      />

      {/* COMMUNITY */}

      <Route
        path="/community"
        element={<Community />}
      />

      {/* PROMOTION */}

      <Route
        path="/promotion"
        element={<PromotionHub />}
      />

      {/* PREMIUM */}

      <Route
        path="/premium"
        element={<PremiumHub />}
      />

      {/* AI TOOLS */}

      <Route
        path="/ai-tools"
        element={<AITools />}
      />

      <Route
        path="/ai-tools/:id"
        element={<ToolDetails />}
      />

      {/* AI NEWS */}

      <Route
        path="/ai-news"
        element={<AINews />}
      />

      <Route
        path="/ai-news/:id"
        element={<NewsDetails />}
      />

      {/* PROMPTS */}

      <Route
        path="/prompts"
        element={<Prompts />}
      />

      {/* COURSES */}

      <Route
        path="/courses"
        element={<Courses />}
      />

      <Route
        path="/courses/:courseId"
        element={<Courses />}
      />

      {/* PRICING */}

      <Route
        path="/pricing"
        element={<Pricing />}
      />

      {/* ABOUT */}

      <Route
        path="/about"
        element={<AboutPage />}
      />

      {/* PRIVACY */}

      <Route
        path="/privacy"
        element={<PrivacyPage />}
      />

      {/* TERMS */}

      <Route
        path="/terms"
        element={<TermsPage />}
      />

      {/* CONTACT */}

      <Route
        path="/contact"
        element={<Contact />}
      />

      {/* AUTH */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* DASHBOARD */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

/* =========================================================
   WEBSITE LAYOUT
========================================================= */

function WebsiteLayout() {
  const location = useLocation();

  const authPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div
      className="
        relative
        z-[1]
        min-h-screen
        text-white
      "
    >
      {/* NAVBAR */}

      {!authPage && (
        <Navbar />
      )}

      {/* SIDEBAR */}

      {!authPage && (
        <AppSidebar />
      )}

      {/* MAIN WEBSITE */}

      <main
        className={`
          relative
          z-[1]
          min-h-screen
          min-w-0
          overflow-x-hidden

          ${
            authPage
              ? ""
              : "lg:ml-[320px]"
          }
        `}
      >
        <Suspense fallback={<PageLoader />}>
          <WebsiteRoutes />
        </Suspense>

        {!authPage && (
          <Footer />
        )}

      </main>

      {/* GLOBAL FLOATING UI */}

      {!authPage && (
        <>
          <NotificationCenter />
          <CommandCenter />
        </>
      )}

    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>

      <AnimatedBackground />

      <WebsiteLayout />

    </BrowserRouter>
  );
}

export default App;