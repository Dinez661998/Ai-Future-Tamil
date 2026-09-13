import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  supabase,
} from "../supabase/client";

function FooterLink({
  item,
}) {
  const url =
    item.url || "/";

  const external =
    /^https?:\/\//i.test(url);

  const className =
    "text-sm text-gray-400 transition hover:text-cyan-300";

  if (external) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      to={url}
      className={className}
    >
      {item.label}
    </Link>
  );
}

function Footer() {
  const [
    footerLinks,
    setFooterLinks,
  ] = useState([]);

  const [
    siteName,
    setSiteName,
  ] = useState(
    "AI Future Tamil"
  );

  const [
    tagline,
    setTagline,
  ] = useState(
    "Learn • Build • Grow Together"
  );

  const [
    logoUrl,
    setLogoUrl,
  ] = useState("");

  const loadFooter =
    useCallback(async () => {
      try {
        const {
          data:
            navigationData,
          error:
            navigationError,
        } =
          await supabase
            .from(
              "navigation_items"
            )
            .select("*")
            .eq(
              "location",
              "footer"
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

        if (
          navigationError
        ) {
          throw navigationError;
        }

        setFooterLinks(
          navigationData || []
        );

        const {
          data:
            settingsData,
          error:
            settingsError,
        } =
          await supabase
            .from(
              "site_settings"
            )
            .select(
              "setting_key, setting_value"
            )
            .in(
              "setting_key",
              [
                "site_name",
                "tagline",
                "logo_url",
              ]
            );

        if (settingsError) {
          throw settingsError;
        }

        const settings =
          Object.fromEntries(
            (settingsData || []).map(
              (item) => [
                item.setting_key,
                item.setting_value,
              ]
            )
          );

        setSiteName(
          settings.site_name ||
            "AI Future Tamil"
        );

        setTagline(
          settings.tagline ||
            "Learn • Build • Grow Together"
        );

        setLogoUrl(
          settings.logo_url ||
            ""
        );

      } catch (error) {
        console.error(
          "Footer load error:",
          error
        );
      }
    }, []);

  useEffect(() => {
    loadFooter();

    const navChannel =
      supabase
        .channel(
          "footer-navigation-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "navigation_items",
          },
          loadFooter
        )
        .subscribe();

    const settingsChannel =
      supabase
        .channel(
          "footer-settings-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "site_settings",
          },
          loadFooter
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        navChannel
      );

      supabase.removeChannel(
        settingsChannel
      );
    };
  }, [loadFooter]);

  return (
    <footer className="border-t border-white/10 bg-[#05060b] text-white">

      <div className="mx-auto max-w-[1500px] px-6 py-12">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

          <div>

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-11 w-11 rounded-xl object-contain"
                />
              )}

              <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-400 bg-clip-text text-2xl font-black text-transparent">
                {siteName}
              </span>

            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
              {tagline}
            </p>

          </div>

          <div>

            <h3 className="mb-5 text-lg font-black">
              Quick Links
            </h3>

            {footerLinks.length >
            0 ? (

              <div className="grid grid-cols-2 gap-3">

                {footerLinks.map(
                  (item) => (
                    <FooterLink
                      key={item.id}
                      item={item}
                    />
                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-gray-600">
                Footer links can
                be added from
                Admin CMS.
              </p>

            )}

          </div>

          <div>

            <h3 className="mb-5 text-lg font-black">
              {siteName}
            </h3>

            <p className="text-sm leading-7 text-gray-500">
              AI tools, news,
              prompts, courses,
              technology and
              creator resources.
            </p>

          </div>

        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-600 sm:flex-row">

          <p>
            ©{" "}
            {
              new Date().getFullYear()
            }{" "}
            {siteName}. All rights
            reserved.
          </p>

          <p>
            Built with ❤️ for AI
            learners.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;