import { useMemo, useState } from "react";

const initialPosts = [
  {
    id: 1,
    user: "AI Creator",
    avatar: "🤖",
    time: "2h ago",
    category: "AI Tools",
    title: "ChatGPT use panni daily productivity epdi improve panradhu?",
    content:
      "Naan daily planning, content ideas, coding help-ku AI use panren. Neenga most useful-ah use panra workflow enna?",
    likes: 24,
    comments: 8,
    bookmarked: false,
    followed: false,
  },
  {
    id: 2,
    user: "Creator Tamil",
    avatar: "🎬",
    time: "5h ago",
    category: "YouTube",
    title: "YouTube thumbnail CTR improve panna best tips?",
    content:
      "Simple title + strong face/emotion + 3 words max nu try panren. Vera enna techniques work aagudhu?",
    likes: 41,
    comments: 13,
    bookmarked: true,
    followed: false,
  },
  {
    id: 3,
    user: "Tech Learner",
    avatar: "💻",
    time: "1d ago",
    category: "Technology",
    title: "Best free coding resources share pannunga",
    content:
      "HTML, CSS, JavaScript learn panna free resources collect panren. Useful sites irundha share pannunga.",
    likes: 18,
    comments: 5,
    bookmarked: false,
    followed: true,
  },
];

function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTab, setActiveTab] = useState("Latest");
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "AI Tools",
  });

  const filteredPosts = useMemo(() => {
    if (activeTab === "Popular") {
      return [...posts].sort((a, b) => b.likes - a.likes);
    }

    if (activeTab === "Following") {
      return posts.filter((post) => post.followed);
    }

    return posts;
  }, [posts, activeTab]);

  const toggleLike = (id) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const toggleBookmark = (id) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, bookmarked: !post.bookmarked }
          : post
      )
    );
  };

  const toggleFollow = (id) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, followed: !post.followed }
          : post
      )
    );
  };

  const handleCreatePost = (event) => {
    event.preventDefault();

    if (!newPost.title.trim() || !newPost.content.trim()) {
      return;
    }

    const post = {
      id: Date.now(),
      user: "You",
      avatar: "👤",
      time: "Just now",
      category: newPost.category,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      likes: 0,
      comments: 0,
      bookmarked: false,
      followed: true,
    };

    setPosts((current) => [post, ...current]);

    setNewPost({
      title: "",
      content: "",
      category: "AI Tools",
    });

    setShowCreate(false);
  };

  return (
    <main className="min-h-screen bg-transparent text-white px-5 sm:px-6 py-10">
      <section className="max-w-7xl mx-auto">

        {/* HERO */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-cyan-400/20
            bg-black/30
            backdrop-blur-xl
            p-8
            md:p-12
            mb-10
          "
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-cyan-400 font-semibold mb-3">
                👥 AI Future Tamil Community
              </p>

              <h1 className="text-4xl md:text-6xl font-black mb-4">
                Learn. Share. Grow Together.
              </h1>

              <p className="text-gray-400 text-lg max-w-2xl leading-8">
                AI tools, creator tips, technology ideas and useful resources-ai
                Tamil community-la discuss pannunga.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="
                shrink-0
                rounded-2xl
                bg-white
                text-black
                px-7
                py-4
                font-bold
                transition
                hover:bg-gray-200
              "
            >
              ✍️ Create Post
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["Latest", "Popular", "Following"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`
                rounded-xl
                px-5
                py-3
                font-semibold
                border
                transition
                ${
                  activeTab === tab
                    ? "bg-cyan-400/10 border-cyan-400 text-cyan-300"
                    : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                }
              `}
            >
              {tab === "Latest" && "🆕 "}
              {tab === "Popular" && "🔥 "}
              {tab === "Following" && "👤 "}
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* POSTS */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/30 p-12 text-center">
                <div className="text-5xl mb-4">🌌</div>
                <p className="text-gray-300">No posts here yet.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="
                    rounded-3xl
                    border
                    border-white/[0.08]
                    bg-black/30
                    backdrop-blur-xl
                    p-6
                    transition-all
                    duration-300
                    hover:border-cyan-400/20
                  "
                >
                  {/* USER */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-2xl">
                        {post.avatar}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold truncate">
                          {post.user}
                        </p>

                        <p className="text-sm text-gray-500">
                          {post.time} · {post.category}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFollow(post.id)}
                      className={`
                        rounded-xl
                        border
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        transition
                        ${
                          post.followed
                            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                            : "border-white/10 text-gray-400 hover:text-white"
                        }
                      `}
                    >
                      {post.followed ? "Following ✓" : "+ Follow"}
                    </button>
                  </div>

                  {/* POST */}
                  <h2 className="text-2xl font-bold mb-3">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 leading-7">
                    {post.content}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-white/[0.07]">

                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`
                        rounded-xl
                        border
                        px-4
                        py-2.5
                        text-sm
                        transition
                        ${
                          post.liked
                            ? "border-pink-400/30 bg-pink-400/10 text-pink-300"
                            : "border-white/10 text-gray-400 hover:text-white"
                        }
                      `}
                    >
                      ❤️ {post.likes}
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:text-white transition"
                    >
                      💬 {post.comments}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(post.id)}
                      className={`
                        rounded-xl
                        border
                        px-4
                        py-2.5
                        text-sm
                        transition
                        ${
                          post.bookmarked
                            ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                            : "border-white/10 text-gray-400 hover:text-white"
                        }
                      `}
                    >
                      {post.bookmarked ? "🔖 Saved" : "🔖 Bookmark"}
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:text-white transition"
                    >
                      ↗️ Share
                    </button>

                  </div>
                </article>
              ))
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-black/30 p-6">
              <h3 className="text-xl font-bold mb-5">
                🔥 Community Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Posts</span>
                  <span className="font-bold">{posts.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Categories</span>
                  <span className="font-bold">3</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Community</span>
                  <span className="text-green-400 font-semibold">
                    ● Active
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-400/20 bg-purple-400/[0.05] p-6">
              <div className="text-4xl mb-4">💎</div>

              <h3 className="text-xl font-bold">
                Premium Community
              </h3>

              <p className="text-gray-400 text-sm leading-6 mt-3">
                Exclusive discussions, premium resources and priority support
                later add pannalaam.
              </p>
            </div>
          </aside>

        </div>
      </section>

      {/* CREATE POST MODAL */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreate(false);
            }
          }}
        >
          <form
            onSubmit={handleCreatePost}
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-cyan-400/20
              bg-[#090b15]
              p-7
              shadow-[0_0_60px_rgba(0,234,255,.10)]
            "
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-cyan-400 text-sm font-semibold">
                  Community
                </p>

                <h2 className="text-2xl font-black">
                  Create New Post
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="w-10 h-10 rounded-xl border border-white/10 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <select
                value={newPost.category}
                onChange={(event) =>
                  setNewPost((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-4 outline-none focus:border-cyan-400"
              >
                <option>AI Tools</option>
                <option>YouTube</option>
                <option>Technology</option>
                <option>Creator Resources</option>
              </select>

              <input
                value={newPost.title}
                onChange={(event) =>
                  setNewPost((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Post title..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-4 outline-none focus:border-cyan-400"
              />

              <textarea
                value={newPost.content}
                onChange={(event) =>
                  setNewPost((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                placeholder="Share something useful..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-4 outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-white text-black py-4 font-bold hover:bg-gray-200 transition"
              >
                🚀 Publish Post
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Community;