import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  supabase,
} from "../supabase/client";

function getPageKey(
  pathname
) {
  if (pathname === "/") {
    return "home";
  }

  if (
    pathname.startsWith(
      "/ai-tools"
    )
  ) {
    return "ai-tools";
  }

  if (
    pathname.startsWith(
      "/ai-news"
    )
  ) {
    return "ai-news";
  }

  if (
    pathname.startsWith(
      "/prompts"
    )
  ) {
    return "prompts";
  }

  if (
    pathname.startsWith(
      "/pricing"
    )
  ) {
    return "pricing";
  }

  if (
    pathname.startsWith(
      "/courses"
    )
  ) {
    return "courses";
  }

  return (
    pathname
      .split("/")
      .filter(Boolean)[0] ||
    "home"
  );
}

function setMeta(
  attribute,
  key,
  value
) {
  let element =
    document.head.querySelector(
      `meta[${attribute}="${key}"]`
    );

  if (!value) {
    if (element) {
      element.remove();
    }

    return;
  }

  if (!element) {
    element =
      document.createElement(
        "meta"
      );

    element.setAttribute(
      attribute,
      key
    );

    document.head.appendChild(
      element
    );
  }

  element.setAttribute(
    "content",
    value
  );
}

function CmsGlobals() {
  const location =
    useLocation();

  const [
    announcement,
    setAnnouncement,
  ] = useState(null);

  const [
    siteSettings,
    setSiteSettings,
  ] = useState({});

  const loadGlobals =
    useCallback(async () => {
      try {
        const [
          announcementResult,
          settingsResult,
        ] =
          await Promise.all([
            supabase
              .from(
                "announcements"
              )
              .select("*")
              .eq(
                "active",
                true
              )
              .order("id", {
                ascending:
                  false,
              })
              .limit(1),

            supabase
              .from(
                "site_settings"
              )
              .select(
                "setting_key, setting_value"
              ),
          ]);

        if (
          announcementResult
            .error
        ) {
          throw announcementResult
            .error;
        }

        if (
          settingsResult.error
        ) {
          throw settingsResult
            .error;
        }

        setAnnouncement(
          announcementResult
            .data?.[0] || null
        );

        setSiteSettings(
          Object.fromEntries(
            (
              settingsResult.data ||
              []
            ).map(
              (item) => [
                item.setting_key,
                item.setting_value,
              ]
            )
          )
        );

      } catch (error) {
        console.error(
          "Global CMS error:",
          error
        );
      }
    }, []);

  const loadSeo =
    useCallback(async () => {
      try {
        const pageKey =
          getPageKey(
            location.pathname
          );

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "seo_settings"
            )
            .select("*")
            .eq(
              "page_key",
              pageKey
            )
            .maybeSingle();

        if (error) {
          throw error;
        }

        const siteName =
          siteSettings
            .site_name ||
          "AI Future Tamil";

        document.title =
          data?.title ||
          siteName;

        setMeta(
          "name",
          "description",
          data?.description ||
            ""
        );

        setMeta(
          "name",
          "keywords",
          data?.keywords ||
            ""
        );

        setMeta(
          "property",
          "og:title",
          data?.title ||
            siteName
        );

        setMeta(
          "property",
          "og:description",
          data?.description ||
            ""
        );

        setMeta(
          "property",
          "og:image",
          data?.image_url ||
            siteSettings
              .logo_url ||
            ""
        );

      } catch (error) {
        console.error(
          "SEO CMS error:",
          error
        );
      }
    }, [
      location.pathname,
      siteSettings,
    ]);

  useEffect(() => {
    loadGlobals();

    const announcementChannel =
      supabase
        .channel(
          "global-announcement-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "announcements",
          },
          loadGlobals
        )
        .subscribe();

    const settingsChannel =
      supabase
        .channel(
          "global-settings-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "site_settings",
          },
          loadGlobals
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        announcementChannel
      );

      supabase.removeChannel(
        settingsChannel
      );
    };
  }, [loadGlobals]);

  useEffect(() => {
    loadSeo();

    const channel =
      supabase
        .channel(
          "global-seo-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "seo_settings",
          },
          loadSeo
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadSeo]);

  useEffect(() => {
    const favicon =
      siteSettings
        .favicon_url ||
      siteSettings.logo_url;

    if (!favicon) {
      return;
    }

    let link =
      document.querySelector(
        'link[rel="icon"]'
      );

    if (!link) {
      link =
        document.createElement(
          "link"
        );

      link.rel = "icon";

      document.head.appendChild(
        link
      );
    }

    link.href = favicon;

  }, [siteSettings]);

  if (!announcement) {
    return null;
  }

  const buttonUrl =
    announcement.button_url ||
    "";

  const external =
    /^https?:\/\//i.test(
      buttonUrl
    );

  return (
    <div className="relative z-[9400] border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 px-4 py-2.5 text-center text-sm text-white backdrop-blur-xl">

      <span className="font-semibold">
        📢{" "}
        {announcement.message}
      </span>

      {buttonUrl &&
        announcement.button_text && (
          <>
            {" "}

            {external ? (
              <a
                href={buttonUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-2 font-black text-cyan-300 hover:text-white"
              >
                {
                  announcement.button_text
                }{" "}
                →
              </a>
            ) : (
              <Link
                to={buttonUrl}
                className="ml-2 font-black text-cyan-300 hover:text-white"
              >
                {
                  announcement.button_text
                }{" "}
                →
              </Link>
            )}
          </>
        )}

    </div>
  );
}

export default CmsGlobals;