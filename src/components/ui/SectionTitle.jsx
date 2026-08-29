import aiTools from "../../data/aiTools";
import ToolCard from "../ui/ToolCard";

function Tools() {
  return (
    <section className="bg-black text-white py-24 px-6">

      {/* Section Heading */}
      <div className="max-w-7xl mx-auto text-center mb-16">

        <h2 className="text-5xl font-bold mb-4">
          Popular AI Tools
        </h2>

        <p className="text-gray-400 text-lg">
          Explore the world's most powerful AI tools.
        </p>

      </div>

      {/* Tool Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {aiTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
          />
        ))}

      </div>

    </section>
  );
}

export default Tools;