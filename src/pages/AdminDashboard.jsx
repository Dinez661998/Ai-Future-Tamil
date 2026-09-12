import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

export default function AdminDashboard() {
  const emptyForm = {
    name: "",
    slug: "",
    description: "",
    category: "",
    website_url: "",
    logo_url: "",
    pricing: "Free",
    featured: false,
    trending: false,
  };

  const [tools, setTools] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTools();
  }, []);

  async function fetchTools() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ai_tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("❌ Tools load aagala");
    } else {
      setTools(data || []);
    }

    setLoading(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(e) {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: editingId ? prev.slug : generateSlug(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage("⚠️ Tool name enter pannu");
      return;
    }

    if (!form.slug.trim()) {
      setMessage("⚠️ Slug empty-aa irukka koodadhu");
      return;
    }

    setSaving(true);
    setMessage("");

    if (editingId) {
      const { error } = await supabase
        .from("ai_tools")
        .update(form)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        setMessage("❌ Tool update aagala");
      } else {
        setMessage("✅ Tool successfully update aayiduchu");
        resetForm();
        fetchTools();
      }
    } else {
      const { error } = await supabase.from("ai_tools").insert([form]);

      if (error) {
        console.error(error);

        if (error.code === "23505") {
          setMessage("⚠️ Indha slug already iruku");
        } else {
          setMessage("❌ Tool add aagala");
        }
      } else {
        setMessage("✅ New AI Tool add aayiduchu");
        resetForm();
        fetchTools();
      }
    }

    setSaving(false);
  }

  function editTool(tool) {
    setEditingId(tool.id);

    setForm({
      name: tool.name || "",
      slug: tool.slug || "",
      description: tool.description || "",
      category: tool.category || "",
      website_url: tool.website_url || "",
      logo_url: tool.logo_url || "",
      pricing: tool.pricing || "Free",
      featured: tool.featured || false,
      trending: tool.trending || false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteTool(id, name) {
    const confirmDelete = window.confirm(
      `${name} tool-a delete panna sure-aa?`
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("ai_tools")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("❌ Tool delete aagala");
    } else {
      setMessage("🗑️ Tool delete aayiduchu");
      fetchTools();

      if (editingId === id) {
        resetForm();
      }
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  return (
    <div className="admin-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .admin-page {
          min-height: 100vh;
          padding: 40px 20px;
          background:
            radial-gradient(circle at top left, #102a56, transparent 35%),
            radial-gradient(circle at top right, #30145b, transparent 35%),
            #050816;
          color: white;
          font-family: Arial, sans-serif;
        }

        .admin-container {
          width: 100%;
          max-width: 1250px;
          margin: auto;
        }

        .admin-header {
          margin-bottom: 30px;
        }

        .admin-header h1 {
          margin: 0;
          font-size: 36px;
        }

        .admin-header p {
          color: #9ca3af;
          margin-top: 10px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }

        .stat-card {
          padding: 22px;
          border-radius: 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .stat-card span {
          display: block;
          color: #9ca3af;
          margin-bottom: 10px;
        }

        .stat-card strong {
          font-size: 30px;
        }

        .admin-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 25px;
          align-items: start;
        }

        .panel {
          border-radius: 20px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 25px;
          backdrop-filter: blur(12px);
        }

        .panel h2 {
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          color: #d1d5db;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 13px 14px;
          border-radius: 10px;
          border: 1px solid #374151;
          outline: none;
          background: #0f172a;
          color: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .checkbox-row {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }

        .checkbox-row label {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .submit-btn {
          width: 100%;
          border: none;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
          font-size: 15px;
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          color: white;
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        .cancel-btn {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          color: white;
          background: #374151;
          border: none;
        }

        .message {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: rgba(37,99,235,0.18);
          border: 1px solid rgba(96,165,250,0.3);
        }

        .tools-list {
          display: grid;
          gap: 15px;
        }

        .tool-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px;
          border-radius: 14px;
          background: #0f172a;
          border: 1px solid #1f2937;
        }

        .tool-left {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .tool-logo {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          object-fit: cover;
          background: white;
        }

        .tool-info h3 {
          margin: 0 0 6px;
        }

        .tool-info p {
          margin: 0;
          font-size: 14px;
          color: #9ca3af;
        }

        .badges {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 20px;
          background: #1e293b;
          font-size: 12px;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          padding: 9px 13px;
          border-radius: 8px;
          cursor: pointer;
          color: white;
        }

        .edit-btn {
          background: #2563eb;
        }

        .delete-btn {
          background: #dc2626;
        }

        .empty {
          padding: 50px 20px;
          text-align: center;
          color: #9ca3af;
        }

        @media (max-width: 900px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .admin-page {
            padding: 25px 12px;
          }

          .admin-header h1 {
            font-size: 28px;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .tool-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .actions {
            width: 100%;
          }

          .edit-btn,
          .delete-btn {
            flex: 1;
          }
        }
      `}</style>

      <div className="admin-container">

        <div className="admin-header">
          <h1>👑 AI Future Tamil Admin</h1>

          <p>
            Website AI Tools-ah coding touch pannama manage pannunga.
          </p>
        </div>

        <div className="stats">

          <div className="stat-card">
            <span>Total Tools</span>
            <strong>{tools.length}</strong>
          </div>

          <div className="stat-card">
            <span>Trending</span>
            <strong>
              {tools.filter((tool) => tool.trending).length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Featured</span>
            <strong>
              {tools.filter((tool) => tool.featured).length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Categories</span>
            <strong>
              {
                new Set(
                  tools
                    .map((tool) => tool.category)
                    .filter(Boolean)
                ).size
              }
            </strong>
          </div>

        </div>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <div className="admin-grid">

          <div className="panel">

            <h2>
              {editingId ? "✏️ Edit AI Tool" : "➕ Add AI Tool"}
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Tool Name</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Example: ChatGPT"
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug</label>

                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="chatgpt"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option>AI Chat</option>
                  <option>AI Image</option>
                  <option>AI Video</option>
                  <option>AI Music</option>
                  <option>AI Coding</option>
                  <option>AI Writing</option>
                  <option>Productivity</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tool short description..."
                />
              </div>

              <div className="form-group">
                <label>Website URL</label>

                <input
                  name="website_url"
                  value={form.website_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Logo URL</label>

                <input
                  name="logo_url"
                  value={form.logo_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label>Pricing</label>

                <select
                  name="pricing"
                  value={form.pricing}
                  onChange={handleChange}
                >
                  <option>Free</option>
                  <option>Freemium</option>
                  <option>Paid</option>
                  <option>Free Trial</option>
                </select>
              </div>

              <div className="checkbox-row">

                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  ⭐ Featured
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="trending"
                    checked={form.trending}
                    onChange={handleChange}
                  />
                  🔥 Trending
                </label>

              </div>

              <button
                className="submit-btn"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Tool"
                  : "Add Tool"}
              </button>

              {editingId && (
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </form>

          </div>

          <div className="panel">

            <h2>🤖 AI Tools</h2>

            {loading ? (

              <div className="empty">
                Loading tools...
              </div>

            ) : tools.length === 0 ? (

              <div className="empty">
                <h3>No AI Tools yet</h3>
                <p>
                  Left side form use panni first tool add pannu.
                </p>
              </div>

            ) : (

              <div className="tools-list">

                {tools.map((tool) => (

                  <div
                    key={tool.id}
                    className="tool-card"
                  >

                    <div className="tool-left">

                      {tool.logo_url ? (
                        <img
                          className="tool-logo"
                          src={tool.logo_url}
                          alt={tool.name}
                        />
                      ) : (
                        <div
                          className="tool-logo"
                          style={{
                            display: "grid",
                            placeItems: "center",
                            color: "#111",
                            fontSize: "24px",
                          }}
                        >
                          🤖
                        </div>
                      )}

                      <div className="tool-info">

                        <h3>{tool.name}</h3>

                        <p>
                          {tool.category || "No category"} •{" "}
                          {tool.pricing || "Free"}
                        </p>

                        <div className="badges">

                          {tool.trending && (
                            <span className="badge">
                              🔥 Trending
                            </span>
                          )}

                          {tool.featured && (
                            <span className="badge">
                              ⭐ Featured
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                    <div className="actions">

                      <button
                        className="edit-btn"
                        onClick={() => editTool(tool)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTool(tool.id, tool.name)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}