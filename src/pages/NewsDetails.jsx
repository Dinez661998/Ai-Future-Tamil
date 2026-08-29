import {
  Link,
  useParams,
} from "react-router-dom";

import { useEffect } from "react";

import newsData from "../data/news";

import {
  trackNewsRead,
} from "../utils/dashboardStorage";

function NewsDetails() {
  const { id } = useParams();

  const news = newsData.find(
    (item) =>
      item.id === Number(id)
  );

  useEffect(() => {
    if (news) {
      trackNewsRead(news.id);
    }
  }, [news]);

  if (!news) {
    return (
      <div className="min-h-screen bg-transparent text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-4xl font-bold mb-4">
            News Not Found
          </h1>

        

        </div>

      </div>
    );
  }

  return (
    <section className="min-h-screen bg-transparent text-white px-6 py-20">

      <div className="max-w-4xl mx-auto">

        <Link
          to="/ai-news"
          className="text-blue-400 hover:text-blue-300"
        >
          ← Back to AI News
        </Link>

        <div className="mt-10">

          <div className="text-7xl mb-8">
            {news.icon}
          </div>

          <div className="flex items-center gap-4 mb-6">

            <span className="text-blue-400">
              {news.category}
            </span>

            <span className="text-gray-500">
              {news.date}
            </span>

          </div>

          <h1 className="text-5xl font-bold leading-tight mb-8">
            {news.title}
          </h1>

          <p className="text-gray-300 text-xl leading-9">
            {news.description}
          </p>

          <div className="mt-10 border-t border-gray-800 pt-10">

            <p className="text-gray-400 text-lg leading-8">
              Artificial Intelligence is rapidly
              changing the way people work,
              learn, create and communicate.
              New AI technologies are being
              developed every day, making
              powerful tools available to everyone.
            </p>

            <p className="text-gray-400 text-lg leading-8 mt-6">
              AI tools are becoming more useful
              across education, business, coding,
              design, video creation and many
              other areas. Staying updated with
              these developments can help users
              understand and make better use of
              emerging technologies.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default NewsDetails;