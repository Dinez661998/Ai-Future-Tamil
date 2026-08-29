function ToolCard({ tool }) {
  return (
    <div className="group bg-[#18181b] border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1">

      {/* Icon */}
      <div className="text-5xl mb-5">
        {tool.icon}
      </div>

      {/* Tool Name */}
      <h3 className="text-2xl font-bold text-white mb-2">
        {tool.name}
      </h3>

      {/* Category */}
      <span className="inline-block text-sm text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-4">
        {tool.category}
      </span>

      {/* Description */}
      <p className="text-gray-400 leading-relaxed mb-6">
        {tool.description}
      </p>

      {/* Button */}
      <a
        href={tool.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
      >
        Visit Tool →
      </a>

    </div>
  );
}

export default ToolCard;