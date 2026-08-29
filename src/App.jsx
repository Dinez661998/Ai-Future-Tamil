import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";

/* =========================================================
   GLOBAL COMPONENTS
========================================================= */

import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/layout/Navbar";
import NotificationCenter from "./components/NotificationCenter";
import ProtectedRoute from "./components/ProtectedRoute";
import CommandCenter from "./components/CommandCenter";
import Footer from "./components/Footer";

import AppSidebar, {
  getSidebarSection,
} from "./components/AppSidebar";

/* =========================================================
   LAZY LOADED PAGES
========================================================= */

const Home = lazy(() =>
  import("./pages/Home")
);

const AITools = lazy(() =>
  import("./pages/AITools")
);

const AINews = lazy(() =>
  import("./pages/AINews")
);

const Prompts = lazy(() =>
  import("./pages/Prompts")
);

const Pricing = lazy(() =>
  import("./pages/Pricing")
);

const Login = lazy(() =>
  import("./pages/Login")
);

const Signup = lazy(() =>
  import("./pages/Signup")
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard")
);

const ToolDetails = lazy(() =>
  import("./pages/ToolDetails")
);

const NewsDetails = lazy(() =>
  import("./pages/NewsDetails")
);

const Courses = lazy(() =>
  import("./pages/Courses")
);

const Contact = lazy(() =>
  import("./pages/Contact")
);

const NotFound = lazy(() =>
  import("./pages/NotFound")
);

const AIHubPage = lazy(() =>
  import("./pages/AIHubPage")
);

const CreatorHubPage = lazy(() =>
  import("./pages/CreatorHubPage")
);

const TechnologyHubPage = lazy(() =>
  import("./pages/TechnologyHubPage")
);

const ProductsHubPage = lazy(() =>
  import("./pages/ProductsHubPage")
);

const Community = lazy(() =>
  import("./pages/Community")
);

const PromotionHub = lazy(() =>
  import("./pages/PromotionHub")
);

const PremiumHub = lazy(() =>
  import("./pages/PremiumHub")
);

const SmartHub = lazy(() =>
  import("./pages/SmartHub")
);

/* =========================================================
   INFO PAGE
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
              pointer-events-none
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
   ABOUT
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
   PRIVACY
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
   TERMS
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
   LOADER
========================================================= */

function PageLoader() {
  return (
    <div
      className="
        flex
        min-h-[60vh]
        items-center
        justify-center
        px-6
        py-16
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-4
          text-center
        "
      >
        <div
          className="
            h-11
            w-11
            animate-spin
            rounded-full
            border-4
            border-white/10
            border-t-cyan-400
          "
        />

        <p
          className="
            text-sm
            font-bold
            text-gray-400
          "
        >
          Loading AI Future Tamil...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ROUTES
========================================================= */

function WebsiteRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      {/* AI */}

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

      {/* CREATORS */}

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

      <Route
  path="/smart-hub"
  element={<SmartHub />}
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

      {/* NEWS */}

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

      {/* INFORMATION */}

      <Route
        path="/about"
        element={<AboutPage />}
      />

      <Route
        path="/privacy"
        element={<PrivacyPage />}
      />

      <Route
        path="/terms"
        element={<TermsPage />}
      />

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

  /*
    Sidebar appears ONLY when current page belongs
    to a section with sub-options.

    Home / Dashboard / Pricing / Community /
    About etc do NOT get unnecessary sidebar.
  */

  const sidebarSection =
    getSidebarSection(location.pathname);

  const hasSidebar =
    !authPage &&
    Boolean(sidebarSection);

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

      {hasSidebar && (
        <AppSidebar />
      )}

      {/* MAIN */}

      <main
        className={`
          relative
          z-[1]
          min-h-screen
          min-w-0
          overflow-x-hidden
          transition-[margin]
          duration-300

          ${
            hasSidebar
              ? "lg:ml-[320px]"
              : ""
          }
        `}
      >
        <Suspense
          fallback={<PageLoader />}
        >
          <WebsiteRoutes />
        </Suspense>

        {!authPage && (
          <Footer />
        )}
      </main>

      {/* FLOATING UI */}

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