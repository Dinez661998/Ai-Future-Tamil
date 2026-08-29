import { Link } from "react-router-dom";

function Tools() {
  const tools = [
    {
      id: "chatgpt",
      name: "ChatGPT",
      icon: "🤖",
      category: "AI Chat",
      description:
        "AI assistant for writing, coding, learning and productivity.",
    },
    {
      id: "gemini",
      name: "Gemini",
      icon: "💎",
      category: "AI Chat",
      description:
        "Google AI assistant for research, writing and everyday tasks.",
    },
    {
      id: "claude",
      name: "Claude",
      icon: "🧠",
      category: "AI Chat",
      description:
        "Powerful AI assistant for writing, analysis and coding.",
    },
    {
      id: "midjourney",
      name: "Midjourney",
      icon: "🎨",
      category: "AI Image",
      description:
        "Create stunning AI-generated images from text prompts.",
    },
    {
      id: "runway",
      name: "Runway",
      icon: "🎬",
      category: "AI Video",
      description:
        "Create and edit videos using powerful AI tools.",
    },
    {
      id: "suno",
      name: "Suno AI",
      icon: "🎵",
      category: "AI Music",
      description:
        "Generate songs and music using artificial intelligence.",
    },
  ];

  return (
    <section className="min-h-screen bg-transparent/60 text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">

          <p className="text-blue-400 text-sm mb-3">
            🚀 Explore AI
          </p>

          <h1 className="text-5xl font-bold mb-4">
            AI Tools
          </h1>

          <p className="text-gray-400 text-lg">
            Discover powerful AI tools for work, creativity, learning and more.
          </p>

        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search AI tools..."
            className="w-full bg-[#18181b] border border-gray-700 rounded-lg px-5 py-4 text-white outline-none focus:border-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">

          <button className="px-5 py-2 rounded-full bg-white text-black text-sm">
            All
          </button>

          <button className="px-5 py-2 rounded-full border border-gray-700 text-white text-sm">
            AI Chat
          </button>

          <button className="px-5 py-2 rounded-full border border-gray-700 text-white text-sm">
            AI Image
          </button>

          <button className="px-5 py-2 rounded-full border border-gray-700 text-white text-sm">
            AI Video
          </button>

          <button className="px-5 py-2 rounded-full border border-gray-700 text-white text-sm">
            AI Music
          </button>

        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {tools.map((tool) => (

            <div
              key={tool.id}
              className="group bg-[#18181b] border border-gray-800 rounded-2xl p-7 hover:border-blue-500 transition-all duration-300"
            >

              {/* Icon */}
              <div className="text-5xl mb-6">
                {tool.icon}
              </div>

              {/* Category */}
              <p className="text-blue-400 text-sm mb-3">
                {tool.category}
              </p>

              {/* Name */}
              <h2 className="text-2xl font-bold mb-3">
                {tool.name}
              </h2>

              {/* Description */}
              <p className="text-gray-400 leading-7 mb-6">
                {tool.description}
              </p>

              {/* Visit Tool */}
              <Link
                to={`/ai-tools/${tool.id}`}
                className="block w-full text-center bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Visit Tool →
              </Link>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Tools;