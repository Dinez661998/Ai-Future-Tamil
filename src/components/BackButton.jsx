import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "aft_back_navigation_stack";

const HIDDEN_ROUTES = [
  "/",
  "/login",
  "/register",
];

function getRoute(location) {
  return (
    location.pathname +
    location.search +
    location.hash
  );
}

function getSavedStack() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStack(stack) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stack)
    );
  } catch {
    // Ignore storage errors.
  }
}

export default function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = getRoute(location);

  const [stack, setStack] = useState(() => {
    const saved = getSavedStack();

    if (saved.length === 0) {
      return [currentRoute];
    }

    if (saved[saved.length - 1] !== currentRoute) {
      return [...saved, currentRoute];
    }

    return saved;
  });

  const [isClicking, setIsClicking] = useState(false);

  /*
   * When true, the next location change was caused
   * by OUR Back button.
   *
   * Therefore we should NOT push that route again.
   */
  const isBackNavigation = useRef(false);

  const initialized = useRef(false);

  /*
   * --------------------------------------------------
   * TRACK INTERNAL WEBSITE NAVIGATION
   * --------------------------------------------------
   */
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      const saved = getSavedStack();

      if (saved.length === 0) {
        const initial = [currentRoute];

        saveStack(initial);
        setStack(initial);

        return;
      }

      if (saved[saved.length - 1] !== currentRoute) {
        const updated = [
          ...saved,
          currentRoute,
        ].slice(-50);

        saveStack(updated);
        setStack(updated);
      } else {
        setStack(saved);
      }

      return;
    }

    /*
     * If this navigation came from our Back button,
     * don't add the destination again.
     */
    if (isBackNavigation.current) {
      isBackNavigation.current = false;

      const saved = getSavedStack();

      setStack(saved);

      return;
    }

    /*
     * Normal internal navigation.
     *
     * Example:
     *
     * Dashboard
     *    ↓
     * AI Tools
     *    ↓
     * ChatGPT
     *
     * All three are stored.
     */
    const saved = getSavedStack();

    const lastRoute =
      saved[saved.length - 1];

    if (lastRoute !== currentRoute) {
      const updated = [
        ...saved,
        currentRoute,
      ].slice(-50);

      saveStack(updated);
      setStack(updated);
    }
  }, [currentRoute]);

  /*
   * --------------------------------------------------
   * HIDE ON ROOT / AUTH PAGES
   * --------------------------------------------------
   */
  if (HIDDEN_ROUTES.includes(location.pathname)) {
    return null;
  }

  /*
   * We need at least:
   *
   * [previous, current]
   *
   */
  const canGoBack = stack.length > 1;

  /*
   * --------------------------------------------------
   * SAFE FALLBACK
   * --------------------------------------------------
   */
  const goToParentSection = () => {
    const path = location.pathname;

    if (path.startsWith("/ai-tools/")) {
      navigate("/ai-tools", {
        replace: true,
      });

      return;
    }

    if (path.startsWith("/ai-news/")) {
      navigate("/ai-news", {
        replace: true,
      });

      return;
    }

    if (path.startsWith("/prompts/")) {
      navigate("/prompts", {
        replace: true,
      });

      return;
    }

    if (path.startsWith("/courses/")) {
      navigate("/courses", {
        replace: true,
      });

      return;
    }

    if (path.startsWith("/dashboard")) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    navigate("/", {
      replace: true,
    });
  };

  /*
   * --------------------------------------------------
   * BACK BUTTON
   * --------------------------------------------------
   */
  const handleBack = () => {
    if (isClicking) return;

    /*
     * Click animation
     */
    setIsClicking(true);

    setTimeout(() => {
      setIsClicking(false);
    }, 450);

    const saved = getSavedStack();

    /*
     * No previous internal page.
     *
     * Use a safe section fallback.
     */
    if (saved.length <= 1) {
      goToParentSection();

      return;
    }

    /*
     * ------------------------------------------------
     * REMOVE CURRENT PAGE
     * ------------------------------------------------
     *
     * Example:
     *
     * [
     *   "/dashboard",
     *   "/ai-tools",
     *   "/ai-tools/chatgpt",
     *   "/ai-tools/gemini"
     * ]
     *
     * Current:
     * /ai-tools/gemini
     *
     * New stack:
     *
     * [
     *   "/dashboard",
     *   "/ai-tools",
     *   "/ai-tools/chatgpt"
     * ]
     */
    const newStack = saved.slice(0, -1);

    const previousRoute =
      newStack[newStack.length - 1];

    saveStack(newStack);
    setStack(newStack);

    /*
     * Tell useEffect that this is a Back navigation.
     */
    isBackNavigation.current = true;

    /*
     * IMPORTANT:
     *
     * We navigate directly to the previous
     * internal route instead of navigate(-1).
     *
     * This gives us reliable multi-level Back.
     */
    navigate(previousRoute, {
      replace: true,
    });
  };

  return (
    <>
      {/* Neon Back Button */}
    <div
  className="
    fixed
    left-5
    top-[30px]
    sm:left-2
    sm:top-[20px]
    z-[9999]
  "
>
        <button
          type="button"
          onClick={handleBack}
          disabled={!canGoBack}
          aria-label="Go back"
          title="Go back"
          className={`
            neon-back-button
            group
            relative
            flex
            items-center
            gap-2
            overflow-hidden
            rounded-xl
            border
            px-4
            py-2.5
            sm:px-5
            sm:py-3
            text-sm
            sm:text-base
            font-semibold
            tracking-wide
            backdrop-blur-xl
            transition-all
            duration-300
            select-none

            ${
              canGoBack
                ? `
                  cursor-pointer
                  border-fuchsia-400/70
                  bg-black/75
                  text-white
                  shadow-[0_0_10px_rgba(217,70,239,0.45),0_0_25px_rgba(59,130,246,0.20)]
                  hover:border-fuchsia-300
                  hover:bg-zinc-950
                  hover:shadow-[0_0_12px_rgba(217,70,239,0.75),0_0_30px_rgba(59,130,246,0.45)]
                  active:scale-95
                `
                : `
                  cursor-not-allowed
                  border-zinc-800
                  bg-zinc-950/70
                  text-zinc-600
                `
            }

            ${isClicking ? "neon-back-click" : ""}
          `}
        >
          {/* Animated neon border */}
          {canGoBack && (
            <span
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-xl
                opacity-70
                bg-[linear-gradient(90deg,transparent,rgba(236,72,153,0.8),rgba(168,85,247,0.8),rgba(59,130,246,0.8),transparent)]
                bg-[length:200%_100%]
                animate-[neonBorder_3s_linear_infinite]
              "
            />
          )}

          {/* Inner background */}
          <span
            className="
              pointer-events-none
              absolute
              inset-[1px]
              rounded-[11px]
              bg-black/90
            "
          />

          {/* Ripple */}
          {isClicking && (
            <span
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-5
                w-5
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-fuchsia-400/50
                animate-[backRipple_450ms_ease-out_forwards]
              "
            />
          )}

          {/* Arrow */}
          <span
            className="
              relative
              z-10
              text-lg
              sm:text-xl
              leading-none
              transition-all
              duration-300
              group-hover:-translate-x-1
              group-hover:text-fuchsia-300
            "
          >
            ←
          </span>

          {/* Text */}
          <span
            className="
              relative
              z-10
              transition-all
              duration-300
              group-hover:text-white
              group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]
            "
          >
            Back
          </span>

          {/* Small shine */}
          {canGoBack && (
            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-10
                z-20
                w-8
                rotate-12
                bg-white/20
                blur-sm
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />
          )}
        </button>
      </div>

      {/* Component-specific animations */}
      <style>{`
        @keyframes neonBorder {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }

        @keyframes backRipple {
          0% {
            width: 20px;
            height: 20px;
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1);
          }

          100% {
            width: 180px;
            height: 180px;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .neon-back-button {
          animation: neonIdle 3s ease-in-out infinite;
        }

        .neon-back-button:hover {
          animation: none;
        }

        .neon-back-click {
          animation:
            neonClick 450ms cubic-bezier(.2,.8,.2,1) !important;
        }

        @keyframes neonIdle {
          0%,
          100% {
            filter:
              drop-shadow(
                0 0 3px rgba(236,72,153,0.25)
              );
          }

          50% {
            filter:
              drop-shadow(
                0 0 8px rgba(168,85,247,0.45)
              );
          }
        }

        @keyframes neonClick {
          0% {
            transform: scale(1);
          }

          35% {
            transform: scale(0.92);
          }

          65% {
            transform: scale(1.06);
          }

          100% {
            transform: scale(1);
          }
        }

        @media (max-width: 640px) {
          .neon-back-button {
            box-shadow:
              0 0 8px rgba(217,70,239,0.4),
              0 0 18px rgba(59,130,246,0.2);
          }
        }
      `}</style>
    </>
  );
}