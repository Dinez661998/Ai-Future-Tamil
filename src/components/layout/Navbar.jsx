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

import { supabase } from "../../supabase/client";

/* =========================================================
   FALLBACK MENU NAMES

   Menu content database-la irundhu varum.
   Parent names mattum location values-la irundhu derive aagum.
========================================================= */

const MEGA_MENU_ORDER = [
  "AI",
  "Creators",
  "Technology",
  "Products",
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [user, setUser] =
    useState(null);

  const [
    navigationItems,
    setNavigationItems,
  ] = useState([]);

  const [
    navigationLoading,
    setNavigationLoading,
  ] = useState(true);

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
     LOAD NAVIGATION FROM SUPABASE
  ========================================================= */

  const loadNavigation =
    useCallback(
      async () => {
        try {
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

          setNavigationItems(
            data || []
          );

        } catch (error) {
          console.error(
            "Navbar navigation load error:",
            error
          );

        } finally {
          setNavigationLoading(
            false
          );
        }
      },
      []
    );

  /* =========================================================
     INITIAL LOAD + REALTIME
  ========================================================= */

  useEffect(() => {
    loadNavigation();

    const channel =
      supabase
        .channel(
          "navbar-navigation-cms"
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
            loadNavigation();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };

  }, [
    loadNavigation,
  ]);

  /* =========================================================
     AUTH
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      const {
        data: {
          user:
            currentUser,
        },
      } =
        await supabase.auth.getUser();

      if (mounted) {
        setUser(
          currentUser
        );
      }
    }

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
          if (
            mounted
          ) {
            setUser(
              session?.user ||
                null
            );
          }
        }
      );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };

  }, []);

  /* =========================================================
     CLOSE MENU WHEN PAGE CHANGES
  ========================================================= */

  useEffect(() => {
    setActiveMegaMenu(
      null
    );

    setMobileOpen(
      false
    );

    setMobileSection(
      null
    );

  }, [
    location.pathname,
  ]);

  /* =========================================================
     DATABASE DATA GROUPING
  ========================================================= */

  const mainLinks =
    useMemo(
      () =>
        navigationItems
          .filter(
            (item) =>
              item.location ===
              "navbar"
          )
          .sort(
            (
              a,
              b
            ) =>
              Number(
                a.sort_order ||
                  0
              ) -
              Number(
                b.sort_order ||
                  0
              )
          ),
      [
        navigationItems,
      ]
    );

  const megaMenus =
    useMemo(
      () => {
        const result = {};

        navigationItems.forEach(
          (item) => {
            if (
              !item.location?.startsWith(
                "mega:"
              )
            ) {
              return;
            }

            const menuName =
              item.location.replace(
                "mega:",
                ""
              );

            if (
              !result[
                menuName
              ]
            ) {
              result[
                menuName
              ] = [];
            }

            result[
              menuName
            ].push(
              item
            );
          }
        );

        Object.keys(
          result
        ).forEach(
          (menuName) => {
            result[
              menuName
            ].sort(
              (
                a,
                b
              ) =>
                Number(
                  a.sort_order ||
                    0
                ) -
                Number(
                  b.sort_order ||
                    0
                )
            );
          }
        );

        return result;
      },
      [
        navigationItems,
      ]
    );

  const visibleMegaMenus =
    useMemo(
      () => {
        const existing =
          Object.keys(
            megaMenus
          );

        return [
          ...MEGA_MENU_ORDER.filter(
            (name) =>
              existing.includes(
                name
              )
          ),

          ...existing.filter(
            (name) =>
              !MEGA_MENU_ORDER.includes(
                name
              )
          ),
        ];
      },
      [
        megaMenus,
      ]
    );

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

      localStorage.removeItem(
        "isLoggedIn"
      );

      localStorage.removeItem(
        "userEmail"
      );

      localStorage.removeItem(
        "userName"
      );

      setUser(null);

      navigate("/");
    };

  /* =========================================================
     USER NAME
  ========================================================= */

  const displayName =
    user?.user_metadata
      ?.full_name ||
    user?.user_metadata
      ?.name ||
    user?.email
      ?.split("@")[0] ||
    "User";

  const isActive =
    (path) =>
      location.pathname ===
      path;

  /* =========================================================
     STYLE
  ========================================================= */

  const navButtonClass = `
    relative
    inline-flex
    items-center
    justify-center
    whitespace-nowrap
    rounded-lg
    px-2
    py-2
    text-[12px]
    font-semibold
    text-gray-300
    transition-all
    duration-200
    hover:bg-white/[0.05]
    hover:text-cyan-300
    2xl:px-2.5
    2xl:text-[13px]
  `;

  /* =========================================================
     SPECIAL MAIN LINKS
  ========================================================= */

  function renderMainLink(
    item
  ) {
    const base =
      item.url || "/";

    /* INNOVATION */

    if (
      base ===
      "/innovation-lab"
    ) {
      return (
        <Link
          key={item.id}
          to={base}
          className={`
            relative
            inline-flex
            items-center
            justify-center
            whitespace-nowrap
            rounded-xl
            border
            px-2.5
            py-2
            text-[12px]
            font-black
            transition-all
            duration-300
            2xl:px-3
            2xl:text-[13px]

            ${
              isActive(
                base
              )
                ? `
                  border-fuchsia-300/50
                  bg-gradient-to-r
                  from-fuchsia-500/20
                  to-cyan-500/15
                  text-fuchsia-200
                `
                : `
                  border-fuchsia-400/25
                  bg-fuchsia-400/[0.06]
                  text-fuchsia-300
                  hover:-translate-y-0.5
                `
            }
          `}
        >
          {item.icon ||
            "🧪"}{" "}
          {item.label}
        </Link>
      );
    }

    /* EXPERIENCE */

    if (
      base ===
      "/experience-zone"
    ) {
      return (
        <Link
          key={item.id}
          to={base}
          className="
            inline-flex
            items-center
            justify-center
            whitespace-nowrap
            rounded-xl
            border
            border-cyan-400/25
            bg-cyan-400/[0.06]
            px-2.5
            py-2
            text-[12px]
            font-black
            text-cyan-300
            transition
            hover:-translate-y-0.5
            hover:border-cyan-300/50
            2xl:px-3
            2xl:text-[13px]
          "
        >
          {item.icon ||
            "🌌"}{" "}
          {item.label}
        </Link>
      );
    }

    /* PREMIUM */

    if (
      base ===
      "/premium"
    ) {
      return (
        <Link
          key={item.id}
          to={base}
          className="
            inline-flex
            items-center
            justify-center
            whitespace-nowrap
            rounded-xl
            border
            border-purple-400/30
            bg-purple-400/[0.06]
            px-2.5
            py-2
            text-[12px]
            font-bold
            text-purple-300
            transition
            hover:border-purple-300
            hover:bg-purple-400/15
            2xl:px-3
            2xl:text-[13px]
          "
        >
          {item.icon ||
            "💎"}{" "}
          {item.label}
        </Link>
      );
    }

    return (
      <Link
        key={item.id}
        to={base}
        className={`
          ${navButtonClass}

          ${
            isActive(
              base
            )
              ? "bg-white/[0.05] text-cyan-300"
              : ""
          }
        `}
      >
        {item.label}
      </Link>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

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
            DESKTOP MAIN BAR
        ================================================= */}

        <div
          className="
            mx-auto
            flex
            h-[76px]
            w-full
            max-w-[1700px]
            items-center
            justify-between
            gap-2
            px-4
            sm:px-6
            xl:px-5
            2xl:px-8
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

          {/* DESKTOP NAV */}

          <div
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              gap-0
              xl:flex
              2xl:gap-0.5
            "
          >

            {navigationLoading ? (
              <span className="text-xs text-gray-600">
                Loading...
              </span>
            ) : (
              <>
                {/* HOME FIRST */}

                {mainLinks
                  .filter(
                    (item) =>
                      item.url ===
                      "/"
                  )
                  .map(
                    renderMainLink
                  )}

                {/* MEGA MENUS */}

                {visibleMegaMenus.map(
                  (
                    menuName
                  ) => (
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
                      <span className="flex items-center gap-1">
                        {
                          menuName
                        }

                        <span
                          className={`text-[9px] transition-transform ${
                            activeMegaMenu ===
                            menuName
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          ▼
                        </span>
                      </span>
                    </button>
                  )
                )}

                {/* OTHER MAIN NAV ITEMS */}

                {mainLinks
                  .filter(
                    (item) =>
                      ![
                        "/",
                        "/innovation-lab",
                        "/experience-zone",
                        "/premium",
                        "/pricing",
                      ].includes(
                        item.url
                      )
                  )
                  .map(
                    renderMainLink
                  )}

                {/* PRICING + PREMIUM COMBINED */}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMegaMenu(
                        (current) =>
                          current ===
                          "__pricing__"
                            ? null
                            : "__pricing__"
                      )
                    }
                    className={`
                      ${navButtonClass}
                      ${
                        location.pathname.startsWith(
                          "/pricing"
                        ) ||
                        location.pathname.startsWith(
                          "/premium"
                        ) ||
                        activeMegaMenu ===
                          "__pricing__"
                          ? "bg-white/[0.05] text-purple-300"
                          : ""
                      }
                    `}
                  >
                    <span className="flex items-center gap-1">
                      Pricing

                      <span
                        className={`text-[9px] transition-transform ${
                          activeMegaMenu ===
                          "__pricing__"
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        ▼
                      </span>
                    </span>
                  </button>

                  {activeMegaMenu ===
                    "__pricing__" && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[calc(100%+14px)]
                        z-[9800]
                        w-[240px]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#090b16]/98
                        p-2
                        shadow-[0_24px_70px_rgba(0,0,0,.55)]
                        backdrop-blur-2xl
                      "
                    >
                      <Link
                        to="/pricing"
                        className="group flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-cyan-400/[0.07]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06]">
                          💳
                        </span>

                        <span>
                          <span className="block text-sm font-black text-white">
                            Pricing Plans
                          </span>

                          <span className="mt-0.5 block text-[11px] text-gray-500">
                            Free & paid plans
                          </span>
                        </span>
                      </Link>

                      <Link
                        to="/premium"
                        className="group mt-1 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-purple-400/[0.08]"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-400/25 bg-purple-400/[0.08]">
                          💎
                        </span>

                        <span>
                          <span className="block text-sm font-black text-purple-200">
                            Premium
                          </span>

                          <span className="mt-0.5 block text-[11px] text-gray-500">
                            Premium benefits
                          </span>
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* AUTH */}

          <div className="flex shrink-0 items-center gap-2">

            {user ? (
              <>
                <div className="hidden text-right 2xl:block">
                  <p className="text-[10px] text-gray-600">
                    Welcome
                  </p>

                  <p className="max-w-[100px] truncate text-xs font-semibold text-gray-200">
                    {
                      displayName
                    }
                  </p>
                </div>

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
                    hover:bg-cyan-400/10
                    sm:inline-flex
                  "
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="
                    hidden
                    rounded-xl
                    border
                    border-red-500/30
                    bg-red-500/[0.06]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-red-300
                    md:inline-flex
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-xl bg-white px-4 py-2 text-sm font-black text-black sm:inline-flex"
              >
                Login
              </Link>
            )}

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

        {activeMegaMenu &&
          megaMenus[
            activeMegaMenu
          ] && (
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

            <div className="mx-auto max-w-[1500px] px-8 py-8">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="mb-1 text-sm font-semibold text-cyan-400">
                    Explore
                  </p>

                  <h2 className="text-2xl font-black">
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-gray-400"
                >
                  ✕
                </button>

              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">

                {megaMenus[
                  activeMegaMenu
                ].map(
                  (
                    item
                  ) => (
                    <Link
                      key={
                        item.id
                      }
                      to={
                        item.url
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
                        transition
                        hover:-translate-y-1
                        hover:border-cyan-400/30
                        hover:bg-cyan-400/[0.05]
                      "
                    >

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-2xl">
                        {
                          item.icon ||
                          "🔗"
                        }
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-white">
                          {
                            item.label
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
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
            MOBILE
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

            <div className="mx-auto max-w-3xl space-y-2">

              {mainLinks
                .filter(
                  (item) =>
                    ![
                      "/innovation-lab",
                      "/experience-zone",
                      "/premium",
                      "/pricing",
                    ].includes(
                      item.url
                    )
                )
                .map(
                  (
                    item
                  ) => (
                    <MobileLink
                      key={
                        item.id
                      }
                      to={
                        item.url
                      }
                      icon={
                        item.icon ||
                        "🔗"
                      }
                    >
                      {
                        item.label
                      }
                    </MobileLink>
                  )
                )}

              {/* MOBILE PRICING + PREMIUM */}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileSection(
                      (current) =>
                        current ===
                        "__pricing__"
                          ? null
                          : "__pricing__"
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-purple-400/20
                    bg-purple-400/[0.04]
                    px-4
                    py-3.5
                    font-semibold
                    text-purple-100
                  "
                >
                  <span>💳 Pricing</span>

                  <span
                    className={`transition-transform ${
                      mobileSection ===
                      "__pricing__"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection ===
                  "__pricing__" && (
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <MobileLink
                      to="/pricing"
                      icon="💳"
                    >
                      Pricing Plans
                    </MobileLink>

                    <MobileLink
                      to="/premium"
                      icon="💎"
                    >
                      Premium
                    </MobileLink>
                  </div>
                )}
              </div>

              {visibleMegaMenus.map(
                (
                  menuName
                ) => (
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
                      {
                        menuName
                      }

                      <span>
                        ▼
                      </span>
                    </button>

                    {mobileSection ===
                      menuName && (
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">

                        {megaMenus[
                          menuName
                        ].map(
                          (
                            item
                          ) => (
                            <MobileLink
                              key={
                                item.id
                              }
                              to={
                                item.url
                              }
                              icon={
                                item.icon ||
                                "🔗"
                              }
                            >
                              {
                                item.label
                              }
                            </MobileLink>
                          )
                        )}

                      </div>
                    )}

                  </div>
                )
              )}

              <div className="mt-4 border-t border-white/10 pt-4">

                {user ? (
                  <div className="space-y-2">

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-gray-600">
                        Signed in as
                      </p>

                      <p className="mt-1 truncate font-black">
                        {
                          displayName
                        }
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="block rounded-xl border border-cyan-400/30 bg-cyan-400/[0.06] px-4 py-3 font-semibold text-cyan-300"
                    >
                      📊 Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="w-full rounded-xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-left font-semibold text-red-300"
                    >
                      🚪 Logout
                    </button>

                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block rounded-xl bg-white px-4 py-3 text-center font-black text-black"
                  >
                    Login
                  </Link>
                )}

              </div>
            </div>
          </div>
        )}

      </nav>

      {/* CLICK OUTSIDE */}

      {activeMegaMenu && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setActiveMegaMenu(
              null
            )
          }
          className="fixed inset-0 z-[9400] hidden cursor-default bg-black/20 xl:block"
        />
      )}

    </>
  );
}

/* =========================================================
   MOBILE LINK
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
      <span className="text-xl">
        {icon}
      </span>

      <span>
        {children}
      </span>
    </Link>
  );
}

export default Navbar;