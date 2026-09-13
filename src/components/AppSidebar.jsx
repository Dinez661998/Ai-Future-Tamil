import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../supabase/client";

/* =========================================================
   PATH → SIDEBAR SECTION

   IMPORTANT:
   App.jsx already imports this function.
   So export name change panna koodadhu.
========================================================= */

export function getSidebarSection(
  pathname
) {
  if (!pathname) {
    return null;
  }

  /* AI COLLECTION */

  const aiRoutes = [
    "/ai-tools",
    "/ai-news",
    "/ai-apps",
    "/prompts",
    "/ai-images",
    "/ai-videos",
    "/courses",
    "/ai-models",
    "/ai-datasets",
    "/source-code",
    "/ai-templates",
    "/wallpapers",
  ];

  if (
    aiRoutes.some(
      (route) =>
        pathname ===
          route ||
        pathname.startsWith(
          `${route}/`
        )
    )
  ) {
    return "AI";
  }

  /* CREATORS */

  if (
    pathname.startsWith(
      "/creators"
    )
  ) {
    return "Creators";
  }

  /* TECHNOLOGY */

  if (
    pathname.startsWith(
      "/technology"
    )
  ) {
    return "Technology";
  }

  /* PRODUCTS */

  if (
    pathname.startsWith(
      "/products"
    )
  ) {
    return "Products";
  }

  return null;
}

/* =========================================================
   SECTION DETAILS
========================================================= */

const SECTION_DETAILS = {
  AI: {
    title:
      "AI Collection",
    icon:
      "🤖",
    subtitle:
      "Explore AI resources",
  },

  Creators: {
    title:
      "Creator Resources",
    icon:
      "🎬",
    subtitle:
      "Tools for creators",
  },

  Technology: {
    title:
      "Technology",
    icon:
      "💻",
    subtitle:
      "Explore technology",
  },

  Products: {
    title:
      "Digital Products",
    icon:
      "📦",
    subtitle:
      "Explore products",
  },
};

/* =========================================================
   SIDEBAR
========================================================= */

function AppSidebar() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const section =
    getSidebarSection(
      location.pathname
    );

  const [
    items,
    setItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =========================================================
     LOAD SIDEBAR ITEMS FROM SAME NAVIGATION TABLE
  ========================================================= */

  const loadItems =
    useCallback(
      async () => {
        if (!section) {
          setItems([]);

          setLoading(
            false
          );

          return;
        }

        try {
          setLoading(
            true
          );

          const {
            data,
            error,
          } =
            await supabase
              .from(
                "navigation_items"
              )
              .select(
                `
                  id,
                  label,
                  url,
                  location,
                  icon,
                  active,
                  sort_order
                `
              )
              .eq(
                "location",
                `mega:${section}`
              )
              .eq(
                "active",
                true
              )
              .order(
                "sort_order",
                {
                  ascending:
                    true,
                }
              );

          if (error) {
            throw error;
          }

          setItems(
            data || []
          );

        } catch (error) {
          console.error(
            "Sidebar navigation error:",
            error
          );

          setItems([]);

        } finally {
          setLoading(
            false
          );
        }
      },
      [
        section,
      ]
    );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadItems();

  }, [
    loadItems,
  ]);

  /* =========================================================
     REALTIME

     Admin update/delete panna
     sidebar immediate refresh.
  ========================================================= */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          `sidebar-navigation-${section || "none"}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema:
              "public",
            table:
              "navigation_items",
          },
          () => {
            loadItems();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };

  }, [
    section,
    loadItems,
  ]);

  /* =========================================================
     CURRENT SECTION INFO
  ========================================================= */

  const sectionInfo =
    useMemo(
      () =>
        SECTION_DETAILS[
          section
        ] || {
          title:
            "Explore",
          icon:
            "✨",
          subtitle:
            "Browse resources",
        },
      [
        section,
      ]
    );

  if (!section) {
    return null;
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <aside
      className="
        fixed
        bottom-0
        left-0
        top-[76px]
        z-[200]
        hidden
        w-[320px]
        border-r
        border-white/10
        bg-[#060812]/95
        text-white
        backdrop-blur-xl
        lg:flex
        lg:flex-col
      "
    >

      {/* HEADER */}

      <div className="border-b border-white/10 p-5">

        <div className="flex items-center gap-4">

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
              border-cyan-400/20
              bg-cyan-400/[0.05]
              text-2xl
            "
          >
            {
              sectionInfo.icon
            }
          </div>

          <div className="min-w-0">

            <h2 className="truncate text-lg font-black">
              {
                sectionInfo.title
              }
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {
                sectionInfo.subtitle
              }
            </p>

          </div>

        </div>
      </div>

      {/* LINKS */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          py-4
          scrollbar-thin
        "
      >

        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-gray-600">
            Loading...
          </div>
        ) : items.length ===
          0 ? (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-white/10
              px-4
              py-8
              text-center
              text-sm
              text-gray-600
            "
          >
            No menu items.
          </div>
        ) : (
          <div className="space-y-2">

            {items.map(
              (
                item
              ) => {
                const active =
                  location.pathname ===
                    item.url ||
                  location.pathname.startsWith(
                    `${item.url}/`
                  );

                return (
                  <Link
                    key={
                      item.id
                    }
                    to={
                      item.url
                    }
                    className={`
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      px-4
                      py-3
                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            border-white/10
                            bg-white/[0.06]
                            text-white
                          `
                          : `
                            border-transparent
                            text-gray-400
                            hover:border-white/[0.06]
                            hover:bg-white/[0.025]
                            hover:text-white
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        text-xl

                        ${
                          active
                            ? `
                              border-white/10
                              bg-white/[0.05]
                            `
                            : `
                              border-white/[0.07]
                              bg-white/[0.025]
                            `
                        }
                      `}
                    >
                      {
                        item.icon ||
                        "🔗"
                      }
                    </div>

                    <span className="truncate font-semibold">
                      {
                        item.label
                      }
                    </span>

                  </Link>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* BACK */}

      <div className="border-t border-white/10 p-4">

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            border
            border-fuchsia-400/25
            bg-fuchsia-400/[0.06]
            px-4
            py-4
            text-left
            transition
            hover:border-fuchsia-300/40
            hover:bg-fuchsia-400/[0.10]
          "
        >

          <div className="flex items-center gap-3">

            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-400/20 bg-fuchsia-400/[0.08]">
              ←
            </span>

            <div>
              <p className="font-black">
                Go Back
              </p>

              <p className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
                Previous Page
              </p>
            </div>

          </div>

          <span className="text-fuchsia-300">
            ●
          </span>

        </button>

      </div>

    </aside>
  );
}

export default AppSidebar;