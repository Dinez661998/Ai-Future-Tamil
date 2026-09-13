import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase/client";

/* =========================================================
   ONE CMS SECTION
========================================================= */

export function useCmsSection(
  pageKey,
  sectionKey
) {
  const [section, setSection] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadSection =
    useCallback(async () => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("site_sections")
          .select("*")
          .eq("page_key", pageKey)
          .eq(
            "section_key",
            sectionKey
          )
          .eq("active", true)
          .maybeSingle();

        if (error) {
          throw error;
        }

        setSection(data || null);
      } catch (error) {
        console.error(
          `CMS section error: ${pageKey}/${sectionKey}`,
          error
        );
      } finally {
        setLoading(false);
      }
    }, [pageKey, sectionKey]);

  useEffect(() => {
    loadSection();

    const channel =
      supabase
        .channel(
          `cms-section-${pageKey}-${sectionKey}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "site_sections",
          },
          loadSection
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadSection]);

  return {
    section,
    loading,
    refresh: loadSection,
  };
}

/* =========================================================
   ALL CMS SECTIONS FOR A PAGE
========================================================= */

export function useCmsSections(
  pageKey
) {
  const [sections, setSections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadSections =
    useCallback(async () => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("site_sections")
          .select("*")
          .eq("page_key", pageKey)
          .eq("active", true)
          .order("sort_order", {
            ascending: true,
          });

        if (error) {
          throw error;
        }

        setSections(data || []);
      } catch (error) {
        console.error(
          `CMS page sections error: ${pageKey}`,
          error
        );

        setSections([]);
      } finally {
        setLoading(false);
      }
    }, [pageKey]);

  useEffect(() => {
    loadSections();

    const channel =
      supabase
        .channel(
          `cms-page-${pageKey}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "site_sections",
          },
          loadSections
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadSections]);

  return {
    sections,
    loading,
    refresh: loadSections,
  };
}

/* =========================================================
   SITE SETTINGS
========================================================= */

export function useSiteSettings() {
  const [settings, setSettings] =
    useState({});

  const loadSettings =
    useCallback(async () => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("site_settings")
          .select(
            "setting_key, setting_value"
          );

        if (error) {
          throw error;
        }

        const mapped =
          Object.fromEntries(
            (data || []).map(
              (item) => [
                item.setting_key,
                item.setting_value,
              ]
            )
          );

        setSettings(mapped);
      } catch (error) {
        console.error(
          "Site settings error:",
          error
        );
      }
    }, []);

  useEffect(() => {
    loadSettings();

    const channel =
      supabase
        .channel(
          "global-site-settings"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "site_settings",
          },
          loadSettings
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadSettings]);

  return settings;
}