import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

/* =========================================================
   AI FUTURE TAMIL — AI CONTENT STUDIO
   ========================================================= */

const DOK_OPTIONS = [
  "DOK 1 – Recall & Reproduction",
  "DOK 2 – Skills & Concepts",
  "DOK 3 – Strategic Thinking",
  "DOK 4 – Extended Thinking",
];

const BLOOM_OPTIONS = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

const CONTENT_TYPES = [
  "Lesson Content",
  "Learning Module",
  "Study Material",
  "Teacher Guide",
  "Student Guide",
  "eLearning Content",
  "Assessment Preparation",
];

const STATUS_OPTIONS = [
  "Draft",
  "AI Generated",
  "SME Review",
  "Revision Needed",
  "Approved",
];

const initialForm = {
  projectName: "",
  grade: "",
  subject: "",
  course: "",
  unit: "",
  lesson: "",
  standard: "",
  learningObjective: "",
  dok: DOK_OPTIONS[0],
  bloom: "Understand",
  difficulty: "Medium",
  contentType: "Lesson Content",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({ title, value, icon, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, description }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-slate-100 text-slate-600",
    "AI Generated": "bg-blue-50 text-blue-700",
    "SME Review": "bg-amber-50 text-amber-700",
    "Revision Needed": "bg-orange-50 text-orange-700",
    Approved: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        styles[status] || "bg-slate-100 text-slate-600"
      )}
    >
      {status}
    </span>
  );
}

function CreateProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const createProject = async () => {
    setError("");

    if (!form.projectName.trim()) {
      setError("Project Name is required.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please login before creating a content project.");
      }

      const { data, error: insertError } = await supabase
        .from("content_projects")
        .insert({
          user_id: user.id,
          project_name: form.projectName,
          grade: form.grade,
          subject: form.subject,
          course: form.course,
          unit: form.unit,
          lesson: form.lesson,
          standard: form.standard,
          learning_objective: form.learningObjective,
          dok: form.dok,
          bloom_level: form.bloom,
          difficulty: form.difficulty,
          content_type: form.contentType,
          status: "Draft",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.message || "Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create Content Project
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Define your instructional content requirements.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-7 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <SectionTitle
              icon="📋"
              title="Project Information"
              description="Basic information about the content project."
            />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Project Name"
                required
                value={form.projectName}
                onChange={(v) => update("projectName", v)}
                placeholder="Example: Grade 9 Atomic Spectra"
              />

              <SelectField
                label="Content Type"
                value={form.contentType}
                onChange={(v) => update("contentType", v)}
                options={CONTENT_TYPES}
              />

              <InputField
                label="Grade"
                value={form.grade}
                onChange={(v) => update("grade", v)}
                placeholder="Example: Grade 9"
              />

              <InputField
                label="Subject"
                value={form.subject}
                onChange={(v) => update("subject", v)}
                placeholder="Example: Science"
              />

              <InputField
                label="Course"
                value={form.course}
                onChange={(v) => update("course", v)}
                placeholder="Example: Physical Science"
              />

              <InputField
                label="Unit"
                value={form.unit}
                onChange={(v) => update("unit", v)}
                placeholder="Example: Atomic Structure"
              />

              <InputField
                label="Lesson"
                value={form.lesson}
                onChange={(v) => update("lesson", v)}
                placeholder="Example: Atomic Spectra"
              />
            </div>
          </div>

          <div>
            <SectionTitle
              icon="🎯"
              title="Instructional Alignment"
              description="Define standards, objectives and cognitive expectations."
            />

            <div className="space-y-5">
              <InputField
                label="Standard"
                value={form.standard}
                onChange={(v) => update("standard", v)}
                placeholder="Enter the applicable academic standard"
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Learning Objective
                </label>

                <textarea
                  value={form.learningObjective}
                  onChange={(e) =>
                    update("learningObjective", e.target.value)
                  }
                  rows={4}
                  placeholder="Students will be able to..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <SelectField
                  label="DOK Level"
                  value={form.dok}
                  onChange={(v) => update("dok", v)}
                  options={DOK_OPTIONS}
                />

                <SelectField
                  label="Bloom's Taxonomy"
                  value={form.bloom}
                  onChange={(v) => update("bloom", v)}
                  options={BLOOM_OPTIONS}
                />

                <SelectField
                  label="Difficulty"
                  value={form.difficulty}
                  onChange={(v) => update("difficulty", v)}
                  options={DIFFICULTY_OPTIONS}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <div className="flex gap-3">
              <div className="text-2xl">🧠</div>

              <div>
                <h3 className="font-bold text-indigo-900">
                  DOK + Bloom Alignment
                </h3>

                <p className="mt-1 text-sm leading-6 text-indigo-700">
                  DOK defines the depth of cognitive processing while Bloom's
                  Taxonomy defines the type of cognitive process expected from
                  the learner.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700">
                    {form.dok}
                  </span>

                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700">
                    Bloom: {form.bloom}
                  </span>

                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-indigo-700">
                    Difficulty: {form.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={createProject}
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Content Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceCard({ icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl transition group-hover:bg-indigo-50">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 text-sm font-semibold text-indigo-600">
        Open Workspace →
      </div>
    </button>
  );
}

export default function ContentStudio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const loadProjects = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProjects([]);
        return;
      }

      const { data, error } = await supabase
        .from("content_projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error(error);
      showToast("Unable to load content projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      drafts: projects.filter((p) => p.status === "Draft").length,
      review: projects.filter((p) => p.status === "SME Review").length,
      approved: projects.filter((p) => p.status === "Approved").length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return projects;

    return projects.filter((project) =>
      [
        project.project_name,
        project.grade,
        project.subject,
        project.course,
        project.unit,
        project.lesson,
        project.standard,
        project.dok,
        project.bloom_level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [projects, search]);

  const updateStatus = async (project, status) => {
    try {
      const { error } = await supabase
        .from("content_projects")
        .update({ status })
        .eq("id", project.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((item) =>
          item.id === project.id ? { ...item, status } : item
        )
      );

      setSelectedProject((prev) =>
        prev ? { ...prev, status } : prev
      );

      showToast(`Project moved to ${status}.`);
    } catch (error) {
      console.error(error);
      showToast("Unable to update project status.");
    }
  };

  const tabs = [
    "Overview",
    "Content Developer",
    "AI Content Tools",
    "Review Center",
    "Project Library",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {toast && (
        <div className="fixed right-5 top-5 z-[200] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                ✨ AI FUTURE TAMIL
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                AI Content Studio
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                Create, structure, analyze and review instructional content
                using standards, objectives, DOK and Bloom's Taxonomy.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              + Create Content Project
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Projects"
                value={stats.total}
                icon="📚"
                description="All content projects"
              />

              <StatCard
                title="Drafts"
                value={stats.drafts}
                icon="📝"
                description="Projects being prepared"
              />

              <StatCard
                title="In Review"
                value={stats.review}
                icon="🔍"
                description="Waiting for SME review"
              />

              <StatCard
                title="Approved"
                value={stats.approved}
                icon="✅"
                description="Approved content"
              />
            </div>

            <section className="mt-10">
              <SectionTitle
                icon="🧩"
                title="Content Development Workspaces"
                description="Choose a workspace based on the task you want to perform."
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <WorkspaceCard
                  icon="✍️"
                  title="Content Developer"
                  description="Create lesson content, objectives, summaries, vocabulary and instructional structure."
                  onClick={() => setActiveTab("Content Developer")}
                />

                <WorkspaceCard
                  icon="🧠"
                  title="AI Content Tools"
                  description="Generate summaries, concepts, objectives, vocabulary and content outlines."
                  onClick={() => setActiveTab("AI Content Tools")}
                />

                <WorkspaceCard
                  icon="🔎"
                  title="Review Center"
                  description="Review instructional quality, alignment, clarity and revision requirements."
                  onClick={() => setActiveTab("Review Center")}
                />

                <WorkspaceCard
                  icon="📁"
                  title="Project Library"
                  description="Search and manage all content development projects."
                  onClick={() => setActiveTab("Project Library")}
                />
              </div>
            </section>

            <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                icon="🔄"
                title="Content Development Workflow"
                description="Track your project from initial planning to approval."
              />

              <div className="grid gap-3 md:grid-cols-5">
                {STATUS_OPTIONS.map((status, index) => (
                  <div
                    key={status}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-xs font-bold text-indigo-600">
                      STEP {index + 1}
                    </div>

                    <div className="mt-2 font-bold text-slate-800">
                      {status}
                    </div>

                    {index < STATUS_OPTIONS.length - 1 && (
                      <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-slate-300 md:block">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "Content Developer" && (
          <section className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-7 text-white">
              <p className="text-sm font-semibold text-indigo-100">
                CONTENT DEVELOPER WORKSPACE
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Build structured learning content
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-indigo-100">
                Start with standards and learning objectives, then develop
                structured instructional content aligned to DOK and Bloom's.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <WorkspaceCard
                icon="📄"
                title="Lesson Structure"
                description="Build introduction, explanation, examples, practice and recap sections."
                onClick={() => showToast("Lesson Structure workspace selected.")}
              />

              <WorkspaceCard
                icon="🎯"
                title="Learning Objectives"
                description="Create measurable objectives aligned with the selected standard."
                onClick={() =>
                  showToast("Learning Objectives workspace selected.")
                }
              />

              <WorkspaceCard
                icon="📚"
                title="Key Concepts"
                description="Identify the important concepts students must understand."
                onClick={() => showToast("Key Concepts workspace selected.")}
              />

              <WorkspaceCard
                icon="🔤"
                title="Vocabulary"
                description="Develop important subject-specific vocabulary and definitions."
                onClick={() => showToast("Vocabulary workspace selected.")}
              />

              <WorkspaceCard
                icon="🧾"
                title="Content Summary"
                description="Create concise summaries for instructional and review use."
                onClick={() => showToast("Content Summary workspace selected.")}
              />

              <WorkspaceCard
                icon="🔗"
                title="Standard Alignment"
                description="Map lesson content and objectives to academic standards."
                onClick={() =>
                  showToast("Standard Alignment workspace selected.")
                }
              />
            </div>
          </section>
        )}

        {activeTab === "AI Content Tools" && (
          <section>
            <SectionTitle
              icon="🤖"
              title="AI Content Tools"
              description="AI-assisted content development utilities."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["📝", "Generate Summary", "Create a concise lesson summary."],
                [
                  "🎯",
                  "Generate Objectives",
                  "Create measurable learning objectives.",
                ],
                [
                  "🧠",
                  "Extract Key Concepts",
                  "Identify essential concepts from lesson content.",
                ],
                [
                  "🔤",
                  "Generate Vocabulary",
                  "Identify important academic vocabulary.",
                ],
                [
                  "🔗",
                  "Standard Alignment",
                  "Map content to standards.",
                ],
                [
                  "📑",
                  "Generate Content Outline",
                  "Create a structured lesson outline.",
                ],
              ].map(([icon, title, description]) => (
                <WorkspaceCard
                  key={title}
                  icon={icon}
                  title={title}
                  description={description}
                  onClick={() => showToast(`${title} selected.`)}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === "Review Center" && (
          <section>
            <SectionTitle
              icon="🔎"
              title="Review Center"
              description="Manage instructional content review and approval."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <WorkspaceCard
                icon="🎯"
                title="Objective Alignment"
                description="Check whether objectives match the selected standards."
                onClick={() => showToast("Objective Alignment selected.")}
              />

              <WorkspaceCard
                icon="🧠"
                title="DOK Review"
                description="Review whether the content reflects the selected DOK level."
                onClick={() => showToast("DOK Review selected.")}
              />

              <WorkspaceCard
                icon="📊"
                title="Bloom Review"
                description="Review the cognitive process represented by the content."
                onClick={() => showToast("Bloom Review selected.")}
              />

              <WorkspaceCard
                icon="✅"
                title="Approval Queue"
                description="Review projects that are ready for approval."
                onClick={() => showToast("Approval Queue selected.")}
              />
            </div>
          </section>
        )}

        {activeTab === "Project Library" && (
          <section>
            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <SectionTitle
                icon="📁"
                title="Project Library"
                description="Search and manage your content projects."
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 md:w-80"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Loading projects...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl">📚</div>
                  <h3 className="mt-3 font-bold text-slate-800">
                    No content projects found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Create your first content project to get started.
                  </p>

                  <button
                    onClick={() => setShowCreate(true)}
                    className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
                  >
                    + Create Project
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {project.project_name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                          {project.grade && (
                            <span className="rounded-lg bg-slate-100 px-2 py-1">
                              {project.grade}
                            </span>
                          )}

                          {project.subject && (
                            <span className="rounded-lg bg-slate-100 px-2 py-1">
                              {project.subject}
                            </span>
                          )}

                          {project.dok && (
                            <span className="rounded-lg bg-indigo-50 px-2 py-1 text-indigo-700">
                              {project.dok}
                            </span>
                          )}

                          {project.bloom_level && (
                            <span className="rounded-lg bg-purple-50 px-2 py-1 text-purple-700">
                              Bloom: {project.bloom_level}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={project.status} />

                        <button
                          onClick={() => setSelectedProject(project)}
                          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={(project) => {
            setProjects((prev) => [project, ...prev]);
            showToast("Content project created successfully.");
            setActiveTab("Project Library");
          }}
        />
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Content Project
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  {selectedProject.project_name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">DOK Level</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedProject.dok || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Bloom's Level</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedProject.bloom_level || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Difficulty</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {selectedProject.difficulty || "Not set"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Grade
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedProject.grade || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Subject
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedProject.subject || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Course
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedProject.course || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">Unit</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedProject.unit || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Lesson
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedProject.lesson || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Content Type
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedProject.content_type || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Standard
                </p>

                <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedProject.standard || "No standard entered."}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Learning Objective
                </p>

                <div className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedProject.learning_objective ||
                    "No learning objective entered."}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <p className="mb-3 text-sm font-bold text-slate-800">
                  Update Workflow
                </p>

                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedProject, status)}
                      className={cn(
                        "rounded-xl border px-4 py-2 text-xs font-semibold transition",
                        selectedProject.status === status
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}