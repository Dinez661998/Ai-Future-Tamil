import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const QUESTION_TYPES = [
  "MCQ",
  "Image-Based MCQ",
  "OEQ",
  "Two-Tier MCQ",
];

const STATUS_LIST = [
  "Draft",
  "AI Generated",
  "SME Review",
  "Peer Review",
  "Revision Needed",
  "Approved",
  "Rejected",
];

const INITIAL_FORM = {
  project_name: "",
  project_type: "Question Development",
  grade: "",
  subject: "",
  course: "",
  unit: "",
  lesson: "",
  standard: "",
  learning_objective: "",
  question_type: "MCQ",
  dok: "DOK 1",
  bloom_level: "Remember",
  difficulty: "Easy",
  question_count: 10,
};

export default function SMEHub() {
  const [user, setUser] = useState(null);

  const [activeWorkspace, setActiveWorkspace] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  const [search, setSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  const [reviewFilter, setReviewFilter] = useState("All");

  const [reviewComment, setReviewComment] = useState("");

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }, 3500);
  };

  /* =========================================================
     AUTH + INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const initialize = async () => {
    setLoading(true);

    const {
      data: { user: currentUser },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(error);
    }

    if (!currentUser) {
      setLoading(false);
      showToast("Please login to use SME Hub.", "error");
      return;
    }

    setUser(currentUser);

    await loadAllData(currentUser.id);

    setLoading(false);
  };

  const loadAllData = async (userId = user?.id) => {
    if (!userId) return;

    const [projectResult, itemResult] = await Promise.all([
      supabase
        .from("assessment_projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),

      supabase
        .from("assessment_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    if (projectResult.error) {
      console.error(projectResult.error);
      showToast(projectResult.error.message, "error");
    }

    if (itemResult.error) {
      console.error(itemResult.error);
      showToast(itemResult.error.message, "error");
    }

    setProjects(projectResult.data || []);
    setItems(itemResult.data || []);
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      totalProjects: projects.length,

      aiGenerated: projects.filter(
        (p) =>
          p.status === "AI Generated" ||
          p.status === "SME Review" ||
          p.status === "Peer Review" ||
          p.status === "Revision Needed"
      ).length,

      underReview: projects.filter(
        (p) =>
          p.status === "SME Review" ||
          p.status === "Peer Review" ||
          p.status === "Revision Needed"
      ).length,

      approved: projects.filter((p) => p.status === "Approved").length,

      totalItems: items.length,

      approvedItems: items.filter((i) => i.status === "Approved").length,
    };
  }, [projects, items]);

  /* =========================================================
     FORM HANDLERS
  ========================================================= */

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openNewProject = () => {
    setForm(INITIAL_FORM);
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  const openProject = (project) => {
    setSelectedProject(project);

    setForm({
      project_name: project.project_name || "",
      project_type: project.project_type || "Question Development",
      grade: project.grade || "",
      subject: project.subject || "",
      course: project.course || "",
      unit: project.unit || "",
      lesson: project.lesson || "",
      standard: project.standard || "",
      learning_objective: project.learning_objective || "",
      question_type: project.question_type || "MCQ",
      dok: project.dok || "DOK 1",
      bloom_level: project.bloom_level || "Remember",
      difficulty: project.difficulty || "Easy",
      question_count: project.question_count || 10,
    });

    setActiveWorkspace("developer");
  };

  /* =========================================================
     SAVE PROJECT
  ========================================================= */

  const saveProject = async () => {
    if (!user) {
      showToast("Please login first.", "error");
      return null;
    }

    if (!form.project_name.trim()) {
      showToast("Project name is required.", "error");
      return null;
    }

    if (!form.subject.trim()) {
      showToast("Subject is required.", "error");
      return null;
    }

    if (!form.lesson.trim()) {
      showToast("Lesson is required.", "error");
      return null;
    }

    setSaving(true);

    const payload = {
      user_id: user.id,
      project_name: form.project_name.trim(),
      project_type: form.project_type,
      grade: form.grade,
      subject: form.subject,
      course: form.course,
      unit: form.unit,
      lesson: form.lesson,
      standard: form.standard,
      learning_objective: form.learning_objective,
      question_type: form.question_type,
      dok: form.dok,
      bloom_level: form.bloom_level,
      difficulty: form.difficulty,
      question_count: Number(form.question_count),
      status: "Draft",
    };

    let result;

    if (selectedProject?.id) {
      result = await supabase
        .from("assessment_projects")
        .update(payload)
        .eq("id", selectedProject.id)
        .eq("user_id", user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("assessment_projects")
        .insert(payload)
        .select()
        .single();
    }

    setSaving(false);

    if (result.error) {
      console.error(result.error);
      showToast(result.error.message, "error");
      return null;
    }

    setSelectedProject(result.data);

    await loadAllData(user.id);

    showToast(
      selectedProject
        ? "Project updated successfully."
        : "Project created successfully."
    );

    setShowProjectModal(false);

    return result.data;
  };

  /* =========================================================
     AI GENERATION
  ========================================================= */

  const generateQuestions = async () => {
    if (!user) {
      showToast("Please login first.", "error");
      return;
    }

    if (!form.project_name || !form.subject || !form.lesson) {
      showToast(
        "Project Name, Subject and Lesson are required.",
        "error"
      );
      return;
    }

    setGenerating(true);

    try {
      let project = selectedProject;

      if (!project) {
        project = await saveProject();
      } else {
        const updated = await saveProject();
        project = updated || project;
      }

      if (!project?.id) {
        throw new Error("Project could not be saved.");
      }

      /*
       * First try the backend AI endpoint.
       * If the endpoint is not available yet,
       * a local structured generator is used so
       * the complete workflow remains functional.
       */

      let generatedQuestions = [];

      try {
        const response = await fetch("/api/generate-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project: {
              ...form,
              question_count: Number(form.question_count),
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data.questions)) {
            generatedQuestions = data.questions;
          }
        }
      } catch (apiError) {
        console.warn(
          "AI API not available. Using local generator.",
          apiError
        );
      }

      if (!generatedQuestions.length) {
        generatedQuestions = createLocalQuestions();
      }

      const itemPayload = generatedQuestions.map((question, index) => ({
        project_id: project.id,
        user_id: user.id,
        question_number: index + 1,
        question_type: question.question_type || form.question_type,
        question_text: question.question_text || "",
        image_url: question.image_url || null,
        option_a: question.option_a || null,
        option_b: question.option_b || null,
        option_c: question.option_c || null,
        option_d: question.option_d || null,
        correct_answer: question.correct_answer || null,
        rationale: question.rationale || "",
        explanation: question.explanation || "",
        grade: form.grade,
        subject: form.subject,
        course: form.course,
        unit: form.unit,
        lesson: form.lesson,
        standard: form.standard,
        learning_objective: form.learning_objective,
        dok: form.dok,
        bloom_level: form.bloom_level,
        difficulty: form.difficulty,
        status: "AI Generated",
        version: 1,
      }));

      const { error: itemError } = await supabase
        .from("assessment_items")
        .insert(itemPayload);

      if (itemError) {
        throw itemError;
      }

      const { error: projectError } = await supabase
        .from("assessment_projects")
        .update({
          status: "AI Generated",
        })
        .eq("id", project.id)
        .eq("user_id", user.id);

      if (projectError) {
        console.error(projectError);
      }

      await loadAllData(user.id);

      setSelectedProject({
        ...project,
        status: "AI Generated",
      });

      setActiveWorkspace("review");

      showToast(
        `${itemPayload.length} questions generated successfully.`
      );
    } catch (error) {
      console.error(error);
      showToast(
        error?.message || "Question generation failed.",
        "error"
      );
    } finally {
      setGenerating(false);
    }
  };

  /* =========================================================
     LOCAL STRUCTURED GENERATOR
  ========================================================= */

  const createLocalQuestions = () => {
    const count = Math.min(
      Math.max(Number(form.question_count) || 1, 1),
      50
    );

    const lesson = form.lesson || "the lesson";
    const subject = form.subject || "the subject";
    const objective =
      form.learning_objective ||
      `understand the key concepts in ${lesson}`;

    const result = [];

    for (let i = 1; i <= count; i++) {
      if (form.question_type === "OEQ") {
        result.push({
          question_type: "OEQ",
          question_text: `Explain the main concept from ${lesson}. In your response, use evidence or examples to demonstrate how the concept supports the learning objective: ${objective}.`,
          correct_answer:
            "A complete response should accurately explain the concept and connect it to the stated learning objective.",
          rationale:
            "The response should demonstrate understanding and appropriate application of the lesson concept.",
          explanation:
            `This item assesses the learner's understanding of ${lesson} in ${subject}.`,
        });
      } else if (form.question_type === "Two-Tier MCQ") {
        result.push({
          question_type: "Two-Tier MCQ",
          question_text: `Tier 1: Which statement best represents the key concept of ${lesson}?\n\nTier 2: Which explanation best supports your Tier 1 answer?`,
          option_a: "The concept is based on the evidence presented in the lesson.",
          option_b: "The concept is unrelated to the learning objective.",
          option_c: "The concept can only be understood through memorization.",
          option_d: "The concept does not require evidence.",
          correct_answer: "A",
          rationale:
            "Students should select the statement supported by the lesson evidence.",
          explanation:
            `This two-tier item checks both the selected answer and reasoning about ${lesson}.`,
        });
      } else if (form.question_type === "Image-Based MCQ") {
        result.push({
          question_type: "Image-Based MCQ",
          question_text: `Study the provided visual representation related to ${lesson}. Which statement best explains what the visual demonstrates?`,
          image_url: null,
          option_a: `It represents an important concept from ${lesson}.`,
          option_b: "It represents an unrelated process.",
          option_c: "It provides no evidence about the concept.",
          option_d: "It contradicts the lesson without evidence.",
          correct_answer: "A",
          rationale:
            "The visual should be interpreted using evidence from the lesson.",
          explanation:
            `This image-based item assesses interpretation of visual evidence related to ${lesson}.`,
        });
      } else {
        result.push({
          question_type: "MCQ",
          question_text: `Which statement best explains an important concept related to ${lesson}?`,
          option_a: `It is supported by the key ideas presented in ${lesson}.`,
          option_b: "It is unrelated to the lesson.",
          option_c: "It cannot be explained using evidence.",
          option_d: "It is based only on an unsupported assumption.",
          correct_answer: "A",
          rationale:
            "Option A provides the statement most directly connected to the lesson concept.",
          explanation:
            `This question assesses ${form.bloom_level} understanding of ${lesson}.`,
        });
      }
    }

    return result;
  };

  /* =========================================================
     REVIEW FUNCTIONS
  ========================================================= */

  const openReview = (item) => {
    setSelectedItem(item);
    setReviewComment(item.sme_comment || item.peer_comment || "");
    setShowReviewModal(true);
  };

  const updateItemStatus = async (item, status, comment = "") => {
    if (!user) return;

    const updateData = {
      status,
    };

    if (comment.trim()) {
      if (status === "Peer Review") {
        updateData.peer_comment = comment;
      } else {
        updateData.sme_comment = comment;
      }
    }

    const { error } = await supabase
      .from("assessment_items")
      .update(updateData)
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      showToast(error.message, "error");
      return;
    }

    await updateProjectStatusFromItems(item.project_id);

    await loadAllData(user.id);

    setShowReviewModal(false);

    showToast(`Item moved to ${status}.`);
  };

  const updateProjectStatusFromItems = async (projectId) => {
    if (!projectId || !user) return;

    const { data, error } = await supabase
      .from("assessment_items")
      .select("status")
      .eq("project_id", projectId)
      .eq("user_id", user.id);

    if (error || !data?.length) return;

    const statuses = data.map((item) => item.status);

    let projectStatus = "Draft";

    if (statuses.every((status) => status === "Approved")) {
      projectStatus = "Approved";
    } else if (statuses.some((status) => status === "Revision Needed")) {
      projectStatus = "Revision Needed";
    } else if (statuses.some((status) => status === "Peer Review")) {
      projectStatus = "Peer Review";
    } else if (statuses.some((status) => status === "SME Review")) {
      projectStatus = "SME Review";
    } else if (statuses.some((status) => status === "AI Generated")) {
      projectStatus = "AI Generated";
    }

    await supabase
      .from("assessment_projects")
      .update({
        status: projectStatus,
      })
      .eq("id", projectId)
      .eq("user_id", user.id);
  };

  const sendAllToSMEReview = async () => {
    if (!selectedProject) {
      showToast("Select a project first.", "error");
      return;
    }

    const projectItems = items.filter(
      (item) => item.project_id === selectedProject.id
    );

    if (!projectItems.length) {
      showToast("This project has no questions.", "error");
      return;
    }

    const { error } = await supabase
      .from("assessment_items")
      .update({
        status: "SME Review",
      })
      .eq("project_id", selectedProject.id)
      .eq("user_id", user.id)
      .in("status", ["AI Generated", "Draft", "Revision Needed"]);

    if (error) {
      showToast(error.message, "error");
      return;
    }

    await supabase
      .from("assessment_projects")
      .update({
        status: "SME Review",
      })
      .eq("id", selectedProject.id)
      .eq("user_id", user.id);

    await loadAllData(user.id);

    showToast("Questions sent to SME Review.");
  };

  /* =========================================================
     DELETE PROJECT
  ========================================================= */

  const deleteProject = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.project_name}"?\n\nAll questions inside this project will also be deleted.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("assessment_projects")
      .delete()
      .eq("id", project.id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      showToast(error.message, "error");
      return;
    }

    await loadAllData(user.id);

    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
    }

    showToast("Project deleted.");
  };

  /* =========================================================
     DELETE ITEM
  ========================================================= */

  const deleteItem = async (item) => {
    const confirmed = window.confirm(
      "Delete this assessment item?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("assessment_items")
      .delete()
      .eq("id", item.id)
      .eq("user_id", user.id);

    if (error) {
      showToast(error.message, "error");
      return;
    }

    await loadAllData(user.id);

    showToast("Assessment item deleted.");
  };

  /* =========================================================
     EXPORT
  ========================================================= */

  const exportProject = (project) => {
    const projectItems = items.filter(
      (item) => item.project_id === project.id
    );

    const exportData = {
      project,
      items: projectItems,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.project_name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.json`;

    link.click();

    URL.revokeObjectURL(url);

    showToast("Project exported successfully.");
  };

  /* =========================================================
     FILTERED DATA
  ========================================================= */

  const filteredProjects = useMemo(() => {
    const keyword = projectSearch.toLowerCase().trim();

    if (!keyword) return projects;

    return projects.filter((project) =>
      [
        project.project_name,
        project.subject,
        project.lesson,
        project.grade,
        project.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [projects, projectSearch]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (reviewFilter !== "All") {
      result = result.filter(
        (item) => item.status === reviewFilter
      );
    }

    const keyword = itemSearch.toLowerCase().trim();

    if (keyword) {
      result = result.filter((item) =>
        [
          item.question_text,
          item.subject,
          item.lesson,
          item.status,
          item.question_type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    return result;
  }, [items, reviewFilter, itemSearch]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const workspace = (name) => {
    setActiveWorkspace(name);
  };

  /* =========================================================
     STATUS STYLE
  ========================================================= */

  const statusStyle = (status) => {
    const styles = {
      Draft: "bg-slate-100 text-slate-700",
      "AI Generated": "bg-blue-100 text-blue-700",
      "SME Review": "bg-purple-100 text-purple-700",
      "Peer Review": "bg-indigo-100 text-indigo-700",
      "Revision Needed": "bg-orange-100 text-orange-700",
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🧠</div>
          <h2 className="text-xl font-bold text-slate-800">
            Loading SME Hub...
          </h2>
          <p className="text-slate-500 mt-2">
            Connecting to assessment workspace
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-24 right-6 z-[100] px-5 py-4 rounded-2xl shadow-2xl border ${
            toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {toast.type === "error" ? "⚠️" : "✅"}
            </span>

            <span className="font-semibold">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-blue-100 px-4 py-2 rounded-full text-sm font-semibold text-blue-700 shadow-sm mb-5">
                🧠 SME & Assessment Intelligence
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                SME Hub
              </h1>

              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                Develop, generate, review and approve high-quality
                assessment content from one intelligent workspace.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={openNewProject}
                className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-xl hover:bg-slate-800 transition"
              >
                + Create Assessment
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon="📁"
              className="bg-blue-50"
            />

            <StatCard
              title="AI Generated"
              value={stats.aiGenerated}
              icon="✨"
              className="bg-cyan-50"
            />

            <StatCard
              title="Under Review"
              value={stats.underReview}
              icon="🔍"
              className="bg-purple-50"
            />

            <StatCard
              title="Approved"
              value={stats.approved}
              icon="✅"
              className="bg-emerald-50"
            />
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              🔎
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SME Hub..."
              className="w-full pl-11 pr-4 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            onClick={() => loadAllData(user?.id)}
            className="px-5 py-4 rounded-2xl border border-slate-200 bg-white font-semibold hover:bg-slate-50"
          >
            🔄 Refresh
          </button>
        </div>

        {/* WORKSPACE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <WorkspaceCard
            active={activeWorkspace === "developer"}
            color="blue"
            icon="🧠"
            title="Question Developer"
            description="Create & generate assessment questions"
            onClick={() => workspace("developer")}
          />

          <WorkspaceCard
            active={activeWorkspace === "review"}
            color="purple"
            icon="🔍"
            title="Review Center"
            description="SME & peer quality review"
            onClick={() => workspace("review")}
          />

          <WorkspaceCard
            active={activeWorkspace === "library"}
            color="yellow"
            icon="📚"
            title="Project Library"
            description="Manage assessment projects"
            onClick={() => workspace("library")}
          />

          <WorkspaceCard
            active={activeWorkspace === "items"}
            color="green"
            icon="✅"
            title="Item Bank"
            description="Approved assessment items"
            onClick={() => workspace("items")}
          />
        </div>

        {/* WORKFLOW */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-xl font-bold">
                Assessment Workflow
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Draft → AI Generated → SME Review → Peer Review →
                Revision → Approved
              </p>
            </div>
          </div>

          <Workflow />
        </div>

        {/* WORKSPACE */}
        <div className="mt-8">
          {activeWorkspace === "overview" && (
            <OverviewWorkspace
              stats={stats}
              projects={projects}
              items={items}
              openNewProject={openNewProject}
              setActiveWorkspace={setActiveWorkspace}
            />
          )}

          {activeWorkspace === "developer" && (
            <DeveloperWorkspace
              form={form}
              updateForm={updateForm}
              saving={saving}
              generating={generating}
              saveProject={saveProject}
              generateQuestions={generateQuestions}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              sendAllToSMEReview={sendAllToSMEReview}
            />
          )}

          {activeWorkspace === "review" && (
            <ReviewWorkspace
              items={filteredItems}
              itemSearch={itemSearch}
              setItemSearch={setItemSearch}
              reviewFilter={reviewFilter}
              setReviewFilter={setReviewFilter}
              openReview={openReview}
              deleteItem={deleteItem}
            />
          )}

          {activeWorkspace === "library" && (
            <LibraryWorkspace
              projects={filteredProjects}
              projectSearch={projectSearch}
              setProjectSearch={setProjectSearch}
              openProject={openProject}
              deleteProject={deleteProject}
              exportProject={exportProject}
              setActiveWorkspace={setActiveWorkspace}
            />
          )}

          {activeWorkspace === "items" && (
            <ItemBankWorkspace
              items={filteredItems.filter(
                (item) => item.status === "Approved"
              )}
              itemSearch={itemSearch}
              setItemSearch={setItemSearch}
              deleteItem={deleteItem}
            />
          )}
        </div>
      </main>

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <Modal
          title={
            selectedProject
              ? "Edit Assessment Project"
              : "Create New Assessment"
          }
          onClose={() => setShowProjectModal(false)}
          wide
        >
          <ProjectForm
            form={form}
            updateForm={updateForm}
            onSave={saveProject}
            saving={saving}
            onGenerate={async () => {
              setShowProjectModal(false);
              await generateQuestions();
            }}
            generating={generating}
          />
        </Modal>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && selectedItem && (
        <Modal
          title="Assessment Item Review"
          onClose={() => setShowReviewModal(false)}
          wide
        >
          <ReviewModalContent
            item={selectedItem}
            comment={reviewComment}
            setComment={setReviewComment}
            onSME={() =>
              updateItemStatus(
                selectedItem,
                "SME Review",
                reviewComment
              )
            }
            onPeer={() =>
              updateItemStatus(
                selectedItem,
                "Peer Review",
                reviewComment
              )
            }
            onRevision={() =>
              updateItemStatus(
                selectedItem,
                "Revision Needed",
                reviewComment
              )
            }
            onApprove={() =>
              updateItemStatus(
                selectedItem,
                "Approved",
                reviewComment
              )
            }
            onReject={() =>
              updateItemStatus(
                selectedItem,
                "Rejected",
                reviewComment
              )
            }
          />
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
  className = "",
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="text-4xl font-black mt-2">
            {value}
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm border border-slate-100">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   WORKSPACE CARD
========================================================= */

function WorkspaceCard({
  active,
  color,
  icon,
  title,
  description,
  onClick,
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    yellow: "bg-yellow-50 border-yellow-200",
    green: "bg-emerald-50 border-emerald-200",
  };

  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
        active
          ? `${colors[color]} shadow-md`
          : "bg-white border-slate-200"
      }`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
        {icon}
      </div>

      <h3 className="text-lg font-bold mt-5">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   WORKFLOW
========================================================= */

function Workflow() {
  const steps = [
    ["01", "📝", "Draft"],
    ["02", "✨", "AI Generated"],
    ["03", "🧠", "SME Review"],
    ["04", "👥", "Peer Review"],
    ["05", "🔄", "Revision"],
    ["06", "✅", "Approved"],
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
      {steps.map(([number, icon, label], index) => (
        <div
          key={label}
          className="relative text-center"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl">
            {icon}
          </div>

          <p className="text-xs font-bold text-slate-400 mt-3">
            {number}
          </p>

          <p className="text-sm font-semibold text-slate-600 mt-1">
            {label}
          </p>

          {index < steps.length - 1 && (
            <div className="hidden xl:block absolute top-7 left-[70%] w-[70%] border-t-2 border-slate-200" />
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function OverviewWorkspace({
  stats,
  projects,
  items,
  openNewProject,
  setActiveWorkspace,
}) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-5">
        <QuickCard
          icon="🚀"
          title="Create Assessment"
          description="Start a new question development project."
          onClick={openNewProject}
        />

        <QuickCard
          icon="🔍"
          title="Review Questions"
          description={`${items.filter(
            (i) =>
              i.status === "SME Review" ||
              i.status === "Peer Review"
          ).length} items waiting for review.`}
          onClick={() => setActiveWorkspace("review")}
        />

        <QuickCard
          icon="📚"
          title="Open Item Bank"
          description={`${stats.approvedItems} approved items available.`}
          onClick={() => setActiveWorkspace("items")}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-7">
        <h2 className="text-xl font-bold">
          Recent Projects
        </h2>

        <div className="mt-5 space-y-3">
          {projects.slice(0, 5).map((project) => (
            <div
              key={project.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-slate-50 rounded-2xl"
            >
              <div>
                <p className="font-bold">
                  {project.project_name}
                </p>

                <p className="text-sm text-slate-500">
                  {project.subject} • {project.lesson}
                </p>
              </div>

              <StatusBadge status={project.status} />
            </div>
          ))}

          {!projects.length && (
            <EmptyState
              icon="📁"
              title="No projects yet"
              description="Create your first assessment project."
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DEVELOPER
========================================================= */

function DeveloperWorkspace({
  form,
  updateForm,
  saving,
  generating,
  saveProject,
  generateQuestions,
  selectedProject,
  sendAllToSMEReview,
}) {
  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-black">
            Question Developer
          </h2>

          <p className="text-slate-500 mt-1">
            Build your assessment specification and generate
            questions.
          </p>
        </div>

        {selectedProject && (
          <StatusBadge status={selectedProject.status} />
        )}
      </div>

      <ProjectForm
        form={form}
        updateForm={updateForm}
        onSave={saveProject}
        saving={saving}
        onGenerate={generateQuestions}
        generating={generating}
      />

      {selectedProject && (
        <div className="mt-6 pt-6 border-t border-blue-100">
          <button
            onClick={sendAllToSMEReview}
            className="px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
          >
            🧠 Send Questions to SME Review
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PROJECT FORM
========================================================= */

function ProjectForm({
  form,
  updateForm,
  onSave,
  saving,
  onGenerate,
  generating,
}) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Project Name *"
          value={form.project_name}
          onChange={(value) =>
            updateForm("project_name", value)
          }
          placeholder="Example: Atomic Spectra Assessment"
        />

        <Select
          label="Project Type"
          value={form.project_type}
          onChange={(value) =>
            updateForm("project_type", value)
          }
          options={[
            "Question Development",
            "Lesson Post-Test",
            "Course Pretest",
            "Unit Test",
            "Practice Assessment",
            "Assessment Bank",
          ]}
        />

        <Select
          label="Question Type"
          value={form.question_type}
          onChange={(value) =>
            updateForm("question_type", value)
          }
          options={QUESTION_TYPES}
        />

        <Select
          label="Grade"
          value={form.grade}
          onChange={(value) =>
            updateForm("grade", value)
          }
          options={[
            "",
            "Grade 6",
            "Grade 7",
            "Grade 8",
            "Grade 9",
            "Grade 10",
            "Grade 11",
            "Grade 12",
            "College",
          ]}
        />

        <Input
          label="Subject *"
          value={form.subject}
          onChange={(value) =>
            updateForm("subject", value)
          }
          placeholder="Example: Science"
        />

        <Input
          label="Course"
          value={form.course}
          onChange={(value) =>
            updateForm("course", value)
          }
          placeholder="Example: Chemistry"
        />

        <Input
          label="Unit"
          value={form.unit}
          onChange={(value) =>
            updateForm("unit", value)
          }
          placeholder="Example: Atomic Structure"
        />

        <Input
          label="Lesson *"
          value={form.lesson}
          onChange={(value) =>
            updateForm("lesson", value)
          }
          placeholder="Example: Atomic Spectra"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <TextArea
          label="Standard"
          value={form.standard}
          onChange={(value) =>
            updateForm("standard", value)
          }
          placeholder="Enter the learning standard..."
        />

        <TextArea
          label="Learning Objective"
          value={form.learning_objective}
          onChange={(value) =>
            updateForm("learning_objective", value)
          }
          placeholder="Students will be able to..."
        />
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        <Select
          label="DOK"
          value={form.dok}
          onChange={(value) =>
            updateForm("dok", value)
          }
          options={[
            "DOK 1",
            "DOK 2",
            "DOK 3",
            "DOK 4",
          ]}
        />

        <Select
          label="Bloom Level"
          value={form.bloom_level}
          onChange={(value) =>
            updateForm("bloom_level", value)
          }
          options={[
            "Remember",
            "Understand",
            "Apply",
            "Analyze",
            "Evaluate",
            "Create",
          ]}
        />

        <Select
          label="Difficulty"
          value={form.difficulty}
          onChange={(value) =>
            updateForm("difficulty", value)
          }
          options={[
            "Easy",
            "Medium",
            "Hard",
          ]}
        />

        <Input
          label="Number of Questions"
          type="number"
          min="1"
          max="50"
          value={form.question_count}
          onChange={(value) =>
            updateForm(
              "question_count",
              Math.min(
                Math.max(Number(value) || 1, 1),
                50
              )
            )
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-3">
        <button
          onClick={onSave}
          disabled={saving || generating}
          className="px-6 py-3 rounded-xl bg-white border border-slate-200 font-bold hover:bg-slate-50 disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save Project"}
        </button>

        <button
          onClick={onGenerate}
          disabled={saving || generating}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50"
        >
          {generating
            ? "✨ Generating..."
            : "✨ Generate Questions"}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW
========================================================= */

function ReviewWorkspace({
  items,
  itemSearch,
  setItemSearch,
  reviewFilter,
  setReviewFilter,
  openReview,
  deleteItem,
}) {
  return (
    <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">
            Review Center
          </h2>

          <p className="text-slate-500 mt-1">
            Review AI-generated assessment items before approval.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <input
          value={itemSearch}
          onChange={(e) =>
            setItemSearch(e.target.value)
          }
          placeholder="Search questions..."
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
        />

        <select
          value={reviewFilter}
          onChange={(e) =>
            setReviewFilter(e.target.value)
          }
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl"
        >
          <option value="All">All Status</option>

          {STATUS_LIST.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full">
                    Q{item.question_number}
                  </span>

                  <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {item.question_type}
                  </span>

                  <StatusBadge status={item.status} />
                </div>

                <p className="font-semibold text-slate-800 whitespace-pre-line">
                  {item.question_text}
                </p>

                <div className="mt-3 text-sm text-slate-500">
                  {item.subject} • {item.lesson} •{" "}
                  {item.dok} • {item.bloom_level}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openReview(item)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold"
                >
                  Review
                </button>

                <button
                  onClick={() => deleteItem(item)}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!items.length && (
          <EmptyState
            icon="🔍"
            title="No review items"
            description="Generated questions will appear here."
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LIBRARY
========================================================= */

function LibraryWorkspace({
  projects,
  projectSearch,
  setProjectSearch,
  openProject,
  deleteProject,
  exportProject,
  setActiveWorkspace,
}) {
  return (
    <div className="bg-yellow-50/50 border border-yellow-100 rounded-3xl p-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">
            Project Library
          </h2>

          <p className="text-slate-500 mt-1">
            Manage all your assessment projects.
          </p>
        </div>

        <button
          onClick={() => setActiveWorkspace("developer")}
          className="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold"
        >
          + New Project
        </button>
      </div>

      <input
        value={projectSearch}
        onChange={(e) =>
          setProjectSearch(e.target.value)
        }
        placeholder="Search projects..."
        className="w-full mt-6 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex justify-between gap-3">
              <div>
                <h3 className="font-bold">
                  {project.project_name}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {project.subject}
                </p>
              </div>

              <StatusBadge status={project.status} />
            </div>

            <div className="mt-4 space-y-1 text-sm text-slate-500">
              <p>📚 {project.lesson}</p>
              <p>📝 {project.question_type}</p>
              <p>🎯 {project.dok}</p>
              <p>🔢 {project.question_count} questions</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <button
                onClick={() => openProject(project)}
                className="py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm"
              >
                Open
              </button>

              <button
                onClick={() => exportProject(project)}
                className="py-2 rounded-lg bg-green-50 text-green-700 font-semibold text-sm"
              >
                Export
              </button>

              <button
                onClick={() => deleteProject(project)}
                className="py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!projects.length && (
        <EmptyState
          icon="📚"
          title="Project Library is empty"
          description="Create your first assessment project."
        />
      )}
    </div>
  );
}

/* =========================================================
   ITEM BANK
========================================================= */

function ItemBankWorkspace({
  items,
  itemSearch,
  setItemSearch,
  deleteItem,
}) {
  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-7">
      <div>
        <h2 className="text-2xl font-black">
          Approved Item Bank
        </h2>

        <p className="text-slate-500 mt-1">
          Approved assessment questions ready for reuse.
        </p>
      </div>

      <input
        value={itemSearch}
        onChange={(e) =>
          setItemSearch(e.target.value)
        }
        placeholder="Search approved items..."
        className="w-full mt-6 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none"
      />

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-emerald-100 rounded-2xl p-5"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    ✅ Approved
                  </span>

                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {item.question_type}
                  </span>
                </div>

                <p className="font-semibold whitespace-pre-line">
                  {item.question_text}
                </p>

                {item.question_type !== "OEQ" && (
                  <div className="grid md:grid-cols-2 gap-2 mt-4 text-sm">
                    <Option label="A" text={item.option_a} />
                    <Option label="B" text={item.option_b} />
                    <Option label="C" text={item.option_c} />
                    <Option label="D" text={item.option_d} />
                  </div>
                )}

                <div className="mt-4 text-sm text-slate-500">
                  Correct Answer:{" "}
                  <strong className="text-green-700">
                    {item.correct_answer || "Open Response"}
                  </strong>
                </div>
              </div>

              <button
                onClick={() => deleteItem(item)}
                className="h-fit px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!items.length && (
          <EmptyState
            icon="✅"
            title="No approved items"
            description="Approved questions will appear here."
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW MODAL CONTENT
========================================================= */

function ReviewModalContent({
  item,
  comment,
  setComment,
  onSME,
  onPeer,
  onRevision,
  onApprove,
  onReject,
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        <StatusBadge status={item.status} />

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
          {item.question_type}
        </span>

        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          {item.dok}
        </span>

        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          {item.bloom_level}
        </span>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5">
        <p className="font-bold text-lg whitespace-pre-line">
          {item.question_text}
        </p>

        {item.question_type !== "OEQ" && (
          <div className="grid md:grid-cols-2 gap-3 mt-5">
            <Option label="A" text={item.option_a} />
            <Option label="B" text={item.option_b} />
            <Option label="C" text={item.option_c} />
            <Option label="D" text={item.option_d} />
          </div>
        )}

        <div className="mt-5 p-4 bg-white rounded-xl">
          <p className="text-sm text-slate-500">
            Correct Answer
          </p>

          <p className="font-bold text-green-700 mt-1">
            {item.correct_answer || "Open Response"}
          </p>
        </div>

        {item.rationale && (
          <div className="mt-4">
            <p className="text-sm font-bold">
              Rationale
            </p>

            <p className="text-sm text-slate-600 mt-1">
              {item.rationale}
            </p>
          </div>
        )}

        {item.explanation && (
          <div className="mt-4">
            <p className="text-sm font-bold">
              Explanation
            </p>

            <p className="text-sm text-slate-600 mt-1">
              {item.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-bold mb-2">
          Reviewer Comment
        </label>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          rows={4}
          placeholder="Add SME / peer review comments..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
        <button
          onClick={onSME}
          className="px-4 py-3 rounded-xl bg-purple-100 text-purple-700 font-bold"
        >
          🧠 SME Review
        </button>

        <button
          onClick={onPeer}
          className="px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold"
        >
          👥 Peer Review
        </button>

        <button
          onClick={onRevision}
          className="px-4 py-3 rounded-xl bg-orange-100 text-orange-700 font-bold"
        >
          🔄 Revision
        </button>

        <button
          onClick={onApprove}
          className="px-4 py-3 rounded-xl bg-green-600 text-white font-bold"
        >
          ✅ Approve
        </button>

        <button
          onClick={onReject}
          className="px-4 py-3 rounded-xl bg-red-600 text-white font-bold"
        >
          ❌ Reject
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  children,
  onClose,
  wide = false,
}) {
  return (
    <div className="fixed inset-0 z-[90] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full ${
          wide ? "max-w-6xl" : "max-w-2xl"
        } max-h-[90vh] overflow-y-auto`}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
          <h2 className="text-xl font-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select"}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>

      <textarea
        rows={4}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

/* =========================================================
   OPTION
========================================================= */

function Option({ label, text }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white border border-slate-200">
      <span className="font-black text-blue-600">
        {label}
      </span>

      <span className="text-sm text-slate-700">
        {text || "—"}
      </span>
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-slate-100 text-slate-700",
    "AI Generated": "bg-blue-100 text-blue-700",
    "SME Review": "bg-purple-100 text-purple-700",
    "Peer Review": "bg-indigo-100 text-indigo-700",
    "Revision Needed": "bg-orange-100 text-orange-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Draft"}
    </span>
  );
}

/* =========================================================
   QUICK CARD
========================================================= */

function QuickCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-lg hover:-translate-y-1 transition"
    >
      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="font-bold text-lg mt-4">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        {description}
      </p>
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="py-14 text-center">
      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="text-lg font-bold mt-4">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        {description}
      </p>
    </div>
  );
}