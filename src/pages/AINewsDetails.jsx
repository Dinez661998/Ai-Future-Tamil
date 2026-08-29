import { Link, useParams } from "react-router-dom";

const news = [
  {
    id: 1,
    category: "AI Trends",
    title: "AI is changing the future",
    icon: "🚀",
    date: "Today",
    content:
      "Artificial Intelligence is rapidly becoming part of our everyday lives. From education and business to creativity and productivity, AI is helping people complete tasks faster and discover new possibilities. The future of AI will continue to bring powerful tools and new opportunities.",
  },
  {
    id: 2,
    category: "AI Agents",
    title: "AI Agents are growing fast",
    icon: "🤖",
    date: "Today",
    content:
      "AI agents are becoming increasingly useful for research, coding, automation and productivity. Instead of simply answering questions, modern AI agents can help users complete multiple steps and workflows.",
  },
  {
    id: 3,
    category: "AI Images",
    title: "AI Image Generation is evolving",
    icon: "🎨",
    date: "Latest",
    content:
      "AI image generation is making visual creation easier than ever. Creators can use simple text prompts to generate illustrations, concepts, designs and creative visuals within seconds.",
  },
  {
    id: 4,
    category: "AI Videos",
    title: "AI Video Creation is becoming easier",
    icon: "🎬",
    date: "Latest",
    content:
      "AI video creation tools are helping creators produce animations, advertisements, educational videos and social media content with less time and effort.",
  },
  {
    id: 5,
    category: "AI Coding",
    title: "AI Coding Tools are improving",
    icon: "💻",
    date: "Trending",
    content:
      "AI coding assistants can help developers write code, understand complex programming concepts, find errors and improve development workflows.",
  },
  {
    id: 6,
    category: "Future AI",
    title: "AI is becoming part of daily life",
    icon: "🧠",
    date: "Trending",
    content:
      "Artificial Intelligence is becoming an important part of daily workflows. People are using AI for education, business, communication, creativity and many other activities.",
  },
];

function AINewsDetails() {
  const { id } = useParams();

  const article = news.find(
    (item) => item.id === Number(id)
  );

  if (!article) {
    return (
      <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6">
        <div className="text-center">

          <h1 className="text-4xl font-bold mb-6">
            Article Not Found
          </h1>

          <Link
            to="/ai-news"
            className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Back to AI News
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent text-white px-6 py-20">

      <article className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link
          to="/ai-news"
          className="text-blue-400 hover:text-white transition"
        >
          ← Back to AI News
        </Link>

        {/* Header */}
        <div className="mt-12">

          <div className="text-7xl mb-8">
            {article.icon}
          </div>

          <div className="flex items-center gap-4 mb-5">

            <span className="text-blue-400">
              {article.category}
            </span>

            <span className="text-gray-500">
              •
            </span>

            <span className="text-gray-500">
              {article.date}
            </span>

          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            {article.title}
          </h1>

        </div>

        {/* Article */}
        <div className="mt-12 border-t border-zinc-800 pt-10">

          <p className="text-gray-300 text-xl leading-9">
            {article.content}
          </p>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-zinc-800">

          <p className="text-gray-500">
            AI Future Tamil • AI News & Trends
          </p>

        </div>

      </article>

    </main>
  );
}

export default AINewsDetails;