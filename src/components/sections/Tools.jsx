import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { supabase } from "../../supabase/client";

import {
  useCmsSection,
} from "../../hooks/useCms";

function getIcon(category = "") {
  const icons = {
    "AI Chat": "🤖",
    "AI Image": "🎨",
    "AI Video": "🎬",
    "AI Music": "🎵",
    "AI Coding": "💻",
    "AI Writing": "✍️",
    Productivity: "⚡",
    Education: "🎓",
  };

  return icons[category] || "✨";
}

function Tools() {
  const [tools, setTools] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const {
    section: cmsSection,
  } = useCmsSection(
    "home",
    "tools"
  );

  const loadTools =
    useCallback(async () => {
      try {
        const {
          data,
          error,
        } = await supabase
          .from("ai_tools")
          .select("*")
          .order("trending", {
            ascending: false,
          })
          .order("featured", {
            ascending: false,
          })
          .order("created_at", {
            ascending: false,
          })
          .limit(6);

        if (error) {
          throw error;
        }

        setTools(data || []);
      } catch (error) {
        console.error(
          "Home tools load error:",
          error
        );

        setTools([]);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadTools();

    const channel =
      supabase
        .channel(
          "home-ai-tools-cms"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "ai_tools",
          },
          loadTools
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [loadTools]);

  const categories =
    useMemo(() => {
      return [
        "All",
        ...new Set(
          tools
            .map(
              (tool) =>
                tool.category
            )
            .filter(Boolean)
        ),
      ];
    }, [tools]);

  const filteredTools =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return tools.filter(
        (tool) => {
          const matchesCategory =
            category === "All" ||
            tool.category ===
              category;

          const matchesSearch =
            !query ||
            String(
              tool.name || ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              tool.description ||
                ""
            )
              .toLowerCase()
              .includes(query) ||
            String(
              tool.category || ""
            )
              .toLowerCase()
              .includes(query);

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      tools,
      search,
      category,
    ]);

  const heading =
    cmsSection?.title ||
    "AI Tools";

  const description =
    cmsSection?.description ||
    cmsSection?.subtitle ||
    "Discover powerful AI tools for work, creativity, learning and more.";

  return (
    <section className="min-h-screen bg-transparent/60 px-6 py-20 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <p className="mb-3 text-sm text-blue-400">
            🚀 Explore AI
          </p>

          <h1 className="mb-4 text-5xl font-bold">
            {heading}
          </h1>

          <p className="text-lg text-gray-400">
            {description}
          </p>

        </div>

        <div className="mx-auto mb-8 max-w-2xl">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search AI tools..."
            className="w-full rounded-lg border border-gray-700 bg-[#18181b] px-5 py-4 text-white outline-none focus:border-blue-500"
          />

        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">

          {categories.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={`rounded-full px-5 py-2 text-sm transition ${
                  category === item
                    ? "bg-white text-black"
                    : "border border-gray-700 text-white hover:border-blue-500"
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

        {loading ? (

          <div className="py-20 text-center text-gray-400">
            Loading AI Tools...
          </div>

        ) : filteredTools.length ===
          0 ? (

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-500">
            No AI tools found.
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredTools.map(
              (tool) => {
                const slug =
                  tool.slug ||
                  String(tool.id);

                return (
                  <div
                    key={tool.id}
                    className="group rounded-2xl border border-gray-800 bg-[#18181b] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500"
                  >

                    {tool.logo_url ? (
                      <img
                        src={
                          tool.logo_url
                        }
                        alt={tool.name}
                        className="mb-6 h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="mb-6 text-5xl">
                        {getIcon(
                          tool.category
                        )}
                      </div>
                    )}

                    <p className="mb-3 text-sm text-blue-400">
                      {tool.category ||
                        "AI Tool"}
                    </p>

                    <h2 className="mb-3 text-2xl font-bold">
                      {tool.name}
                    </h2>

                    <p className="mb-6 leading-7 text-gray-400">
                      {
                        tool.description
                      }
                    </p>

                    <Link
                      to={`/ai-tools/${slug}`}
                      className="block w-full rounded-lg bg-white py-3 text-center font-semibold text-black transition hover:bg-gray-200"
                    >
                      Visit Tool →
                    </Link>

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </section>
  );
}

export default Tools;