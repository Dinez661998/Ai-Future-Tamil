function Features() {
  const features = [
    {
      icon: "⚡",
      title: "AI Tools",
      description:
        "Discover powerful AI tools for writing, design, coding, video, images and more.",
    },
    {
      icon: "📰",
      title: "AI News",
      description:
        "Stay updated with the latest artificial intelligence news, launches and trends.",
    },
    {
      icon: "✨",
      title: "AI Prompts",
      description:
        "Get ready-to-use prompts to improve your AI results and productivity.",
    },
    {
      icon: "🎥",
      title: "AI Videos",
      description:
        "Explore AI-powered video creation tools and techniques.",
    },
    {
      icon: "🎨",
      title: "AI Images",
      description:
        "Create amazing visuals using the latest AI image generation tools.",
    },
    {
      icon: "🎓",
      title: "AI Courses",
      description:
        "Learn artificial intelligence through simple tutorials, guides and resources.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-black/60 text-white px-6 py-24"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Everything AI in One Place
          </h2>

          <p className="text-gray-400 text-lg mt-4">
            Explore, learn and discover the world of Artificial Intelligence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#18181b] border border-gray-800 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300"
            >

              {/* Icon */}
              <div className="text-5xl mb-6">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-7">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;