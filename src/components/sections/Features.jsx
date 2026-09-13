import {
  useMemo,
} from "react";

import {
  useCmsSection,
  useCmsSections,
} from "../../hooks/useCms";

const fallbackFeatures = [
  {
    section_key:
      "feature-ai-tools",
    subtitle: "⚡",
    title: "AI Tools",
    description:
      "Discover powerful AI tools for writing, design, coding, video, images and more.",
  },
  {
    section_key:
      "feature-ai-news",
    subtitle: "📰",
    title: "AI News",
    description:
      "Stay updated with the latest artificial intelligence news, launches and trends.",
  },
  {
    section_key:
      "feature-prompts",
    subtitle: "✨",
    title: "AI Prompts",
    description:
      "Get ready-to-use prompts to improve your AI results and productivity.",
  },
  {
    section_key:
      "feature-videos",
    subtitle: "🎥",
    title: "AI Videos",
    description:
      "Explore AI-powered video creation tools and techniques.",
  },
  {
    section_key:
      "feature-images",
    subtitle: "🎨",
    title: "AI Images",
    description:
      "Create amazing visuals using the latest AI image generation tools.",
  },
  {
    section_key:
      "feature-courses",
    subtitle: "🎓",
    title: "AI Courses",
    description:
      "Learn artificial intelligence through simple tutorials, guides and resources.",
  },
];

function Features() {
  const {
    section: headingSection,
  } = useCmsSection(
    "home",
    "features"
  );

  const {
    sections,
  } = useCmsSections(
    "home"
  );

  const features =
    useMemo(() => {
      const cmsFeatures =
        sections.filter(
          (item) =>
            item.section_key
              ?.toLowerCase()
              .startsWith(
                "feature-"
              ) ||
            item.section_key
              ?.toLowerCase()
              .startsWith(
                "feature_"
              )
        );

      return cmsFeatures.length
        ? cmsFeatures
        : fallbackFeatures;
    }, [sections]);

  return (
    <section
      id="features"
      className="bg-black/60 px-6 py-24 text-white"
    >

      <div className="mx-auto max-w-7xl">

        <div className="mb-16 text-center">

          <h2 className="text-5xl font-bold">
            {headingSection?.title ||
              "Everything AI in One Place"}
          </h2>

          <p className="mt-4 text-lg text-gray-400">
            {headingSection
              ?.description ||
              headingSection
                ?.subtitle ||
              "Explore, learn and discover the world of Artificial Intelligence."}
          </p>

        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map(
            (feature) => (
              <div
                key={
                  feature.id ||
                  feature.section_key
                }
                className="rounded-2xl border border-gray-800 bg-[#18181b] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500"
              >

                <div className="mb-6 text-5xl">
                  {feature.subtitle ||
                    "✨"}
                </div>

                <h3 className="mb-4 text-2xl font-bold">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-400">
                  {
                    feature.description
                  }
                </p>

              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
}

export default Features;