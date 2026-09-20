import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  supabase,
} from "../supabase/client";

/* =========================================================
   PAGE KEY
========================================================= */

function getPageKey(pathname) {
  if (pathname === "/") {
    return "home";
  }

  if (pathname.startsWith("/ai-tools")) {
    return "ai-tools";
  }

  if (pathname.startsWith("/ai-news")) {
    return "ai-news";
  }

  if (pathname.startsWith("/prompts")) {
    return "prompts";
  }

  if (pathname.startsWith("/pricing")) {
    return "pricing";
  }

  if (pathname.startsWith("/courses")) {
    return "courses";
  }

  return (
    pathname
      .split("/")
      .filter(Boolean)[0] || "home"
  );
}

/* =========================================================
   META HELPER
========================================================= */

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

/* =========================================================
   CMS GLOBALS
========================================================= */

function CmsGlobals() {
  const location =
    useLocation();

  const [
    siteSettings,
    setSiteSettings,
  ] = useState({});

  /* =========================================================
     LOAD SITE SETTINGS

     Announcement banner intentionally removed.
     SEO + site settings + favicon continue working.
  ========================================================= */

  const loadGlobals =
    useCallback(async () => {
      try {
        const {
          data,
          error,
        } =
          await supabase
            .from("site_settings")
            .select(
              "setting_key, setting_value"
            );

        if (error) {
          throw error;
        }

        setSiteSettings(
          Object.fromEntries(
            (data || []).map(
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

  /* =========================================================
     SEO
  ========================================================= */

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
            .from("seo_settings")
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
          siteSettings.site_name ||
          "AI Future Tamil";

        document.title =
          data?.title ||
          siteName;

        setMeta(
          "name",
          "description",
          data?.description || ""
        );

        setMeta(
          "name",
          "keywords",
          data?.keywords || ""
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
          data?.description || ""
        );

        setMeta(
          "property",
          "og:image",
          data?.image_url ||
            siteSettings.logo_url ||
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

  /* =========================================================
     SITE SETTINGS REALTIME
  ========================================================= */

  useEffect(() => {
    loadGlobals();

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
        settingsChannel
      );
    };
  }, [loadGlobals]);

  /* =========================================================
     SEO REALTIME
  ========================================================= */

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

  /* =========================================================
     FAVICON
  ========================================================= */

  useEffect(() => {
    const favicon =
      siteSettings.favicon_url ||
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

  /* =========================================================
     NO ANNOUNCEMENT UI

     CmsGlobals handles background CMS tasks only.
  ========================================================= */

  return null;
}

export default CmsGlobals;