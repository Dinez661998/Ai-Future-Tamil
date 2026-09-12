import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../supabase/client";

export default function AdminNews() {
  const emptyForm = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    image_url: "",
    category: "AI News",
    source_url: "",
    featured: false,
    trending: false,
  };

  const [news, setNews] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  /* =========================================================
     FETCH NEWS
  ========================================================= */

  async function fetchNews() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("ai_news")
      .select("*")
      .order("published_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      setMessage(
        "❌ News load aagala."
      );
    } else {
      setNews(data || []);
    }

    setLoading(false);
  }

  /* =========================================================
     SLUG
  ========================================================= */

  function generateSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleTitleChange(event) {
    const value =
      event.target.value;

    setForm((current) => ({
      ...current,

      title: value,

      slug: editingId
        ? current.slug
        : generateSlug(value),
    }));
  }

  /* =========================================================
     INPUTS
  ========================================================= */

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  /* =========================================================
     SAVE
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage(
        "⚠️ News title enter pannu."
      );

      return;
    }

    if (!form.slug.trim()) {
      setMessage(
        "⚠️ Slug empty-aa irukka koodadhu."
      );

      return;
    }

    setSaving(true);
    setMessage("");

    if (editingId) {
      const {
        error,
      } = await supabase
        .from("ai_news")
        .update({
          ...form,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);

        setMessage(
          "❌ News update aagala."
        );
      } else {
        setMessage(
          "✅ News successfully update aayiduchu."
        );

        resetForm();

        await fetchNews();
      }
    } else {
      const {
        error,
      } = await supabase
        .from("ai_news")
        .insert([
          {
            ...form,

            published_at:
              new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error(error);

        if (
          error.code === "23505"
        ) {
          setMessage(
            "⚠️ Indha slug already irukku."
          );
        } else {
          setMessage(
            "❌ News add aagala."
          );
        }
      } else {
        setMessage(
          "✅ New AI News add aayiduchu."
        );

        resetForm();

        await fetchNews();
      }
    }

    setSaving(false);
  }

  /* =========================================================
     EDIT
  ========================================================= */

  function editNews(item) {
    setEditingId(item.id);

    setForm({
      title:
        item.title || "",

      slug:
        item.slug || "",

      summary:
        item.summary || "",

      content:
        item.content || "",

      image_url:
        item.image_url || "",

      category:
        item.category ||
        "AI News",

      source_url:
        item.source_url || "",

      featured:
        Boolean(
          item.featured
        ),

      trending:
        Boolean(
          item.trending
        ),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function deleteNews(
    id,
    title
  ) {
    const confirmed =
      window.confirm(
        `"${title}" delete panna sure-aa?`
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("ai_news")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);

      setMessage(
        "❌ News delete aagala."
      );

      return;
    }

    setMessage(
      "🗑️ News delete aayiduchu."
    );

    if (
      editingId === id
    ) {
      resetForm();
    }

    await fetchNews();
  }

  /* =========================================================
     RESET
  ========================================================= */

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-transparent
        px-5
        py-10
        text-white
        sm:px-7
        lg:px-10
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
        "
      >

        {/* HEADER */}

        <section
          className="
            rounded-[30px]
            border
            border-white/[0.08]
            bg-black/30
            p-7
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  text-cyan-400
                "
              >
                👑 ADMIN PANEL
              </p>

              <h1
                className="
                  mt-2
                  text-4xl
                  font-black
                "
              >
                📰 AI News Manager
              </h1>

              <p
                className="
                  mt-3
                  text-gray-400
                "
              >
                Coding touch pannama
                AI News add, edit,
                delete pannunga.
              </p>

            </div>

            <Link
              to="/admin"
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                px-5
                py-3
                font-bold
                text-gray-300
                transition
                hover:text-white
              "
            >
              ← Admin Dashboard
            </Link>

          </div>

        </section>

        {/* STATS */}

        <section
          className="
            mt-6
            grid
            grid-cols-2
            gap-4
            lg:grid-cols-4
          "
        >

          <StatCard
            title="Total News"
            value={
              news.length
            }
          />

          <StatCard
            title="Trending"
            value={
              news.filter(
                (item) =>
                  item.trending
              ).length
            }
          />

          <StatCard
            title="Featured"
            value={
              news.filter(
                (item) =>
                  item.featured
              ).length
            }
          />

          <StatCard
            title="Categories"
            value={
              new Set(
                news
                  .map(
                    (item) =>
                      item.category
                  )
                  .filter(Boolean)
              ).size
            }
          />

        </section>

        {/* MESSAGE */}

        {message && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-400/[0.06]
              p-4
            "
          >
            {message}
          </div>
        )}

        {/* CONTENT */}

        <section
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[420px_1fr]
          "
        >

          {/* FORM */}

          <div
            className="
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/30
              p-6
              backdrop-blur-xl
            "
          >

            <h2
              className="
                text-xl
                font-black
              "
            >
              {editingId
                ? "✏️ Edit News"
                : "➕ Add AI News"}
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-6
                space-y-5
              "
            >

              <Input
                label="News Title"
                name="title"
                value={
                  form.title
                }
                onChange={
                  handleTitleChange
                }
                placeholder="Example: ChatGPT launches new feature"
                required
              />

              <Input
                label="Slug"
                name="slug"
                value={
                  form.slug
                }
                onChange={
                  handleChange
                }
                placeholder="chatgpt-new-feature"
                required
              />

              <div>

                <label className="mb-2 block text-sm text-gray-300">
                  Category
                </label>

                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#101625]
                    px-4
                    py-3
                    outline-none
                  "
                >
                  <option>
                    AI News
                  </option>

                  <option>
                    ChatGPT
                  </option>

                  <option>
                    Gemini
                  </option>

                  <option>
                    Claude
                  </option>

                  <option>
                    AI Tools
                  </option>

                  <option>
                    AI Image
                  </option>

                  <option>
                    AI Video
                  </option>

                  <option>
                    Technology
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>

              <TextArea
                label="Short Summary"
                name="summary"
                value={
                  form.summary
                }
                onChange={
                  handleChange
                }
                placeholder="Short news summary..."
                rows={4}
              />

              <TextArea
                label="Full Content"
                name="content"
                value={
                  form.content
                }
                onChange={
                  handleChange
                }
                placeholder="Full news content..."
                rows={8}
              />

              <Input
                label="Image URL"
                name="image_url"
                value={
                  form.image_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://..."
              />

              <Input
                label="Original Source URL"
                name="source_url"
                value={
                  form.source_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://..."
              />

              <div
                className="
                  flex
                  flex-wrap
                  gap-5
                "
              >

                <Checkbox
                  label="⭐ Featured"
                  name="featured"
                  checked={
                    form.featured
                  }
                  onChange={
                    handleChange
                  }
                />

                <Checkbox
                  label="🔥 Trending"
                  name="trending"
                  checked={
                    form.trending
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  px-5
                  py-4
                  font-black
                  transition
                  hover:opacity-90
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update News"
                  : "Add News"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    py-3
                    font-bold
                    text-gray-400
                  "
                >
                  Cancel Edit
                </button>
              )}

            </form>

          </div>

          {/* NEWS LIST */}

          <div
            className="
              rounded-[28px]
              border
              border-white/[0.08]
              bg-black/30
              p-6
              backdrop-blur-xl
            "
          >

            <h2
              className="
                text-xl
                font-black
              "
            >
              📰 Published News
            </h2>

            {loading ? (

              <div
                className="
                  py-20
                  text-center
                  text-gray-500
                "
              >
                Loading News...
              </div>

            ) : news.length === 0 ? (

              <div
                className="
                  py-20
                  text-center
                  text-gray-500
                "
              >
                <div className="text-5xl">
                  📰
                </div>

                <p className="mt-4">
                  No AI News yet.
                </p>

              </div>

            ) : (

              <div
                className="
                  mt-6
                  space-y-4
                "
              >

                {news.map(
                  (item) => (
                    <article
                      key={item.id}
                      className="
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-[#0d1424]
                        p-5
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-5
                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                        "
                      >

                        <div
                          className="
                            flex
                            min-w-0
                            gap-4
                          "
                        >

                          <div
                            className="
                              flex
                              h-16
                              w-16
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-xl
                              border
                              border-white/10
                              bg-white/[0.04]
                              text-3xl
                            "
                          >

                            {item.image_url ? (

                              <img
                                src={
                                  item.image_url
                                }
                                alt={
                                  item.title
                                }
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />

                            ) : (
                              "📰"
                            )}

                          </div>

                          <div
                            className="
                              min-w-0
                            "
                          >

                            <p
                              className="
                                text-xs
                                font-bold
                                text-cyan-400
                              "
                            >
                              {
                                item.category
                              }
                            </p>

                            <h3
                              className="
                                mt-1
                                font-black
                              "
                            >
                              {
                                item.title
                              }
                            </h3>

                            <div
                              className="
                                mt-2
                                flex
                                flex-wrap
                                gap-2
                              "
                            >

                              {item.trending && (
                                <Badge>
                                  🔥 Trending
                                </Badge>
                              )}

                              {item.featured && (
                                <Badge>
                                  ⭐ Featured
                                </Badge>
                              )}

                            </div>

                          </div>

                        </div>

                        <div
                          className="
                            flex
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              editNews(
                                item
                              )
                            }
                            className="
                              rounded-xl
                              bg-blue-600
                              px-4
                              py-2
                              font-bold
                            "
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteNews(
                                item.id,
                                item.title
                              )
                            }
                            className="
                              rounded-xl
                              bg-red-600
                              px-4
                              py-2
                              font-bold
                            "
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </div>

                    </article>
                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>
    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
  title,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.08]
        bg-white/[0.035]
        p-5
      "
    >
      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p
        className="
          mt-2
          text-3xl
          font-black
        "
      >
        {value}
      </p>
    </div>
  );
}

function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          text-gray-300
        "
      >
        {label}
      </label>

      <input
        {...props}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-[#101625]
          px-4
          py-3
          text-white
          outline-none
          focus:border-cyan-400/40
        "
      />

    </div>
  );
}

function TextArea({
  label,
  ...props
}) {
  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          text-gray-300
        "
      >
        {label}
      </label>

      <textarea
        {...props}
        className="
          w-full
          resize-y
          rounded-xl
          border
          border-white/10
          bg-[#101625]
          px-4
          py-3
          text-white
          outline-none
          focus:border-cyan-400/40
        "
      />

    </div>
  );
}

function Checkbox({
  label,
  ...props
}) {
  return (
    <label
      className="
        flex
        items-center
        gap-2
        font-bold
      "
    >
      <input
        type="checkbox"
        {...props}
      />

      {label}
    </label>
  );
}

function Badge({
  children,
}) {
  return (
    <span
      className="
        rounded-full
        border
        border-white/10
        bg-white/[0.05]
        px-2.5
        py-1
        text-[11px]
      "
    >
      {children}
    </span>
  );
}