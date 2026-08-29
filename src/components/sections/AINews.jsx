const news = [
  {
    icon: "🤖",
    category: "AI News",
    title: "The Future of Artificial Intelligence",
    description:
      "Discover the latest developments, innovations and trends in artificial intelligence.",
  },
  {
    icon: "🚀",
    category: "Technology",
    title: "AI Technology Is Moving Faster",
    description:
      "New AI tools and technologies are changing the way we work, learn and create.",
  },
  {
    icon: "🧠",
    category: "AI Trends",
    title: "How AI Is Changing Everyday Life",
    description:
      "Explore how artificial intelligence is becoming part of our daily digital experience.",
  },
];

function AINews() {
  return (
    <section
      id="news"
      className="bg-zinc-950 text-white px-6 py-24"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-blue-400 font-semibold mb-3">
            Latest Updates
          </p>

          <h2 className="text-5xl font-bold">
            AI News & Trends
          </h2>

          <p className="text-gray-400 text-lg mt-4">
            Stay updated with the latest developments in Artificial Intelligence.
          </p>
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {news.map((item) => (
            <article
              key={item.title}
              className="bg-black border border-gray-800 rounded-2xl p-8 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >

              <div className="text-5xl mb-6">
                {item.icon}
              </div>

              <span className="text-blue-400 text-sm font-semibold">
                {item.category}
              </span>

              <h3 className="text-2xl font-bold mt-3 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {item.description}
              </p>

              <button className="mt-6 text-white font-semibold hover:text-blue-400 transition">
                Read More →
              </button>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default AINews;