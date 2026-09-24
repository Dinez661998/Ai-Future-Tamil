import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

/* =========================================================
   SME HUB - AI FUTURE TAMIL
   Complete Single-File SME / Question Development Workspace
   ========================================================= */

const WORKSPACE_GROUPS = [
  "Content Development",
  "SME & Analysis",
  "Question Development",
  "Assessment Design",
  "Review & Quality",
  "Question Bank",
  "Tools",
];

const WORKSPACES = [
  // CONTENT DEVELOPMENT
  {
    id: "content",
    title: "Content Developer",
    subtitle: "Develop lesson and instructional content",
    icon: "📝",
    group: "Content Development",
  },
  {
    id: "lesson-builder",
    title: "Lesson Builder",
    subtitle: "Build structured lesson content",
    icon: "📚",
    group: "Content Development",
  },
  {
    id: "curriculum",
    title: "Curriculum Mapping",
    subtitle: "Map curriculum, units and lessons",
    icon: "🗺️",
    group: "Content Development",
  },
  {
    id: "objectives",
    title: "Learning Objectives",
    subtitle: "Create measurable objectives",
    icon: "🎯",
    group: "Content Development",
  },
  {
    id: "storyboard",
    title: "Storyboard Developer",
    subtitle: "Develop lesson and assessment storyboards",
    icon: "🎬",
    group: "Content Development",
  },
  {
    id: "content-analysis",
    title: "Content Analysis",
    subtitle: "Analyze accuracy and instructional quality",
    icon: "🔎",
    group: "Content Development",
  },

  // SME
  {
    id: "sme",
    title: "SME Developer",
    subtitle: "Subject matter expert workspace",
    icon: "🧠",
    group: "SME & Analysis",
  },
  {
    id: "sme-analyzer",
    title: "SME Analyzer",
    subtitle: "Analyze subject matter and concepts",
    icon: "🧪",
    group: "SME & Analysis",
  },
  {
    id: "standard-alignment",
    title: "Standard Alignment",
    subtitle: "Check standard and objective alignment",
    icon: "🎯",
    group: "SME & Analysis",
  },
  {
    id: "dok-analyzer",
    title: "DOK Analyzer",
    subtitle: "Analyze Depth of Knowledge",
    icon: "📐",
    group: "SME & Analysis",
  },
  {
    id: "bloom-analyzer",
    title: "Bloom Analyzer",
    subtitle: "Analyze cognitive level",
    icon: "🌱",
    group: "SME & Analysis",
  },
  {
    id: "difficulty-analyzer",
    title: "Difficulty Analyzer",
    subtitle: "Analyze question difficulty",
    icon: "📊",
    group: "SME & Analysis",
  },
  {
    id: "misconception",
    title: "Misconception Analyzer",
    subtitle: "Identify learner misconceptions",
    icon: "💡",
    group: "SME & Analysis",
  },

  // QUESTION DEVELOPMENT
  {
    id: "question",
    title: "Question Developer",
    subtitle: "Create AI-powered assessment questions",
    icon: "✨",
    group: "Question Development",
  },
  {
    id: "mcq-builder",
    title: "MCQ Builder",
    subtitle: "Create multiple choice questions",
    icon: "🔘",
    group: "Question Development",
  },
  {
    id: "image-question",
    title: "Image-Based Questions",
    subtitle: "Create image-based assessment items",
    icon: "🖼️",
    group: "Question Development",
  },
  {
    id: "scenario-question",
    title: "Scenario Questions",
    subtitle: "Create application-based questions",
    icon: "🎭",
    group: "Question Development",
  },
  {
    id: "case-question",
    title: "Case-Based Questions",
    subtitle: "Build case and evidence-based items",
    icon: "📄",
    group: "Question Development",
  },
  {
    id: "oeq",
    title: "OEQ Builder",
    subtitle: "Create open-ended questions",
    icon: "✍️",
    group: "Question Development",
  },
  {
    id: "two-tier",
    title: "Two-Tier Questions",
    subtitle: "Create two-tier assessment items",
    icon: "🔀",
    group: "Question Development",
  },
  {
    id: "distractor",
    title: "Distractor Builder",
    subtitle: "Create plausible distractors",
    icon: "🎲",
    group: "Question Development",
  },

  // ASSESSMENT
  {
    id: "assessment-blueprint",
    title: "Assessment Blueprint",
    subtitle: "Design assessment structure",
    icon: "📋",
    group: "Assessment Design",
  },
  {
    id: "pretest",
    title: "Course / Lesson Pre-Test",
    subtitle: "Build pre-assessment items",
    icon: "📝",
    group: "Assessment Design",
  },
  {
    id: "posttest",
    title: "Lesson Post-Test",
    subtitle: "Build lesson post-test items",
    icon: "📘",
    group: "Assessment Design",
  },
  {
    id: "unittest",
    title: "Unit Test",
    subtitle: "Create unit-level assessments",
    icon: "📚",
    group: "Assessment Design",
  },
  {
    id: "final-assessment",
    title: "Final Assessment",
    subtitle: "Assemble final assessments",
    icon: "🏆",
    group: "Assessment Design",
  },

  // REVIEW
  {
    id: "peer",
    title: "Peer Reviewer",
    subtitle: "Review and validate questions",
    icon: "👥",
    group: "Review & Quality",
  },
  {
    id: "review",
    title: "Review Center",
    subtitle: "SME and peer quality review",
    icon: "🔍",
    group: "Review & Quality",
  },
  {
    id: "quality-review",
    title: "Quality Reviewer",
    subtitle: "Perform final quality checks",
    icon: "✅",
    group: "Review & Quality",
  },
  {
    id: "editorial-review",
    title: "Editorial Review",
    subtitle: "Grammar, clarity and style review",
    icon: "✏️",
    group: "Review & Quality",
  },
  {
    id: "accessibility-review",
    title: "Accessibility Review",
    subtitle: "Check accessible assessment design",
    icon: "♿",
    group: "Review & Quality",
  },
  {
    id: "revision",
    title: "Revision Tracker",
    subtitle: "Track comments and revisions",
    icon: "🔄",
    group: "Review & Quality",
  },

  // QUESTION BANK
  {
    id: "projects",
    title: "Project Library",
    subtitle: "Manage assessment projects",
    icon: "📚",
    group: "Question Bank",
  },
  {
    id: "itembank",
    title: "Item Bank",
    subtitle: "Approved assessment items",
    icon: "✅",
    group: "Question Bank",
  },
  {
    id: "draft-bank",
    title: "Draft Bank",
    subtitle: "Manage draft questions",
    icon: "📂",
    group: "Question Bank",
  },
  {
    id: "approved-bank",
    title: "Approved Bank",
    subtitle: "Browse approved questions",
    icon: "🏆",
    group: "Question Bank",
  },

  // TOOLS
  {
    id: "upload",
    title: "Upload Center",
    subtitle: "Reference files and resources",
    icon: "📤",
    group: "Tools",
  },
  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Content and quality insights",
    icon: "📊",
    group: "Tools",
  },
  {
    id: "settings",
    title: "AI Settings",
    subtitle: "Generation and quality controls",
    icon: "⚙️",
    group: "Tools",
  },
];

const QUESTION_TYPES = [
  "MCQ",
  "Image-Based MCQ",
  "Two-Tier MCQ",
  "OEQ",
  "Scenario-Based",
  "Case-Based",
];

const DOK_LEVELS = ["DOK 1", "DOK 2", "DOK 3", "DOK 4"];

const BLOOM_LEVELS = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const STATUS_LIST = [
  "Draft",
  "AI Generated",
  "SME Review",
  "Peer Review",
  "Revision Needed",
  "Approved",
  "Rejected",
];

const REVIEW_CHECKLIST = [
  "Question is clear and unambiguous",
  "Question aligns with learning objective",
  "Question aligns with standard",
  "DOK level is appropriate",
  "Bloom level is appropriate",
  "Correct answer is defensible",
  "Distractors are plausible",
  "Grammar and terminology are correct",
  "No unnecessary clues",
  "Grade level is appropriate",
  "Accessibility requirements considered",
  "No obvious bias or sensitivity issue",
];

const INITIAL_FORM = {
  projectName: "",
  projectType: "Question Development",
  grade: "",
  subject: "",
  course: "",
  unit: "",
  lesson: "",
  standard: "",
  learningObjective: "",
  questionType: "MCQ",
  dok: "DOK 2",
  bloomLevel: "Apply",
  difficulty: "Medium",
  questionCount: 10,
};

/* =========================================================
   SMALL UI COMPONENTS
   ========================================================= */

function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed right-6 top-6 z-[100] max-w-sm rounded-2xl bg-gray-950 px-5 py-4 text-sm font-bold text-white shadow-2xl">
      {toast}
    </div>
  );
}

function WorkspaceCard({ item, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-3xl border bg-white p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        selected
          ? "border-blue-400 ring-4 ring-blue-50 shadow-lg"
          : "border-gray-200"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-3xl shadow-sm transition group-hover:scale-105">
        {item.icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-gray-950">
        {item.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {item.subtitle}
      </p>

      <div className="mt-4 text-xs font-black text-blue-600">
        {item.group} →
      </div>
    </button>
  );
}

function StatCard({ title, value, icon, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-gray-200 p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-500">{title}</p>
          <p className="mt-2 text-4xl font-black text-gray-950">
            {value}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black text-gray-950">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

function WorkspaceDropdown({ value, onChange }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-blue-500">
            SME Workspace Navigator
          </p>

          <h2 className="mt-1 text-xl font-black text-gray-950">
            Choose Your Workspace
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Content development, question development, SME analysis,
            review, assessment and question-bank tools.
          </p>
        </div>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-bold text-gray-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 lg:w-[460px]"
        >
          {WORKSPACE_GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {WORKSPACES.filter(
                (item) => item.group === group
              ).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.icon} {item.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function SMEHub() {
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [workspace, setWorkspace] = useState("question");

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const [showQuestionModal, setShowQuestionModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [questionForm, setQuestionForm] = useState({
    topic: "",
    standard: "",
    objective: "",
    grade: "",
    subject: "",
    lesson: "",
    questionType: "MCQ",
    dok: "DOK 2",
    bloomLevel: "Apply",
    difficulty: "Medium",
    count: 5,
    instructions: "",
  });

  const [projectForm, setProjectForm] =
    useState(INITIAL_FORM);

  const [reviewComment, setReviewComment] =
    useState("");

  const [notes, setNotes] = useState("");

  const [reviewChecks, setReviewChecks] =
    useState({});

  /* =======================================================
     AUTH
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (mounted) {
        setUser(data?.user || null);
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /* =======================================================
     TOAST
     ======================================================= */

  const showToast = (message) => {
    setToast(message);

    window.clearTimeout(
      showToast.timeoutId
    );

    showToast.timeoutId = window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  /* =======================================================
     LOAD DATA
     ======================================================= */

  const loadData = async () => {
    setLoading(true);

    try {
      const {
        data: projectData,
        error: projectError,
      } = await supabase
        .from("assessment_projects")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (projectError) {
        console.error(projectError);
      }

      const {
        data: itemData,
        error: itemError,
      } = await supabase
        .from("assessment_items")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (itemError) {
        console.error(itemError);
      }

      setProjects(projectData || []);
      setItems(itemData || []);
    } catch (error) {
      console.error(error);
      showToast(
        "Unable to load SME Hub data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  /* =======================================================
     COUNTS
     ======================================================= */

  const aiGeneratedCount = useMemo(
    () =>
      projects.filter(
        (p) => p.status === "AI Generated"
      ).length,
    [projects]
  );

  const underReviewCount = useMemo(
    () =>
      projects.filter((p) =>
        [
          "SME Review",
          "Peer Review",
          "Revision Needed",
        ].includes(p.status)
      ).length,
    [projects]
  );

  const approvedCount = useMemo(
    () =>
      projects.filter(
        (p) => p.status === "Approved"
      ).length,
    [projects]
  );

  const approvedItems = useMemo(
    () =>
      items.filter(
        (item) => item.status === "Approved"
      ),
    [items]
  );

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return projects;

    return projects.filter((project) =>
      [
        project.project_name,
        project.subject,
        project.course,
        project.lesson,
        project.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [projects, search]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return items;

    return items.filter((item) =>
      [
        item.question_text,
        item.question_type,
        item.subject,
        item.lesson,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, search]);

  /* =======================================================
     CREATE PROJECT
     ======================================================= */

  const createProject = async () => {
    if (!projectForm.projectName.trim()) {
      showToast("Enter a project name.");
      return;
    }

    if (!user) {
      showToast(
        "Please login before creating a project."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        user_id: user.id,
        project_name:
          projectForm.projectName.trim(),
        project_type:
          projectForm.projectType,
        grade: projectForm.grade,
        subject: projectForm.subject,
        course: projectForm.course,
        unit: projectForm.unit,
        lesson: projectForm.lesson,
        standard: projectForm.standard,
        learning_objective:
          projectForm.learningObjective,
        question_type:
          projectForm.questionType,
        dok: projectForm.dok,
        bloom_level:
          projectForm.bloomLevel,
        difficulty:
          projectForm.difficulty,
        question_count:
          Number(projectForm.questionCount) || 10,
        status: "Draft",
      };

      const { data, error } = await supabase
        .from("assessment_projects")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => [
        data,
        ...prev,
      ]);

      setSelectedProject(data);
      setProjectForm(INITIAL_FORM);
      setShowCreateModal(false);

      showToast("Assessment project created.");
    } catch (error) {
      console.error(error);

      showToast(
        error?.message ||
          "Project creation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UPDATE PROJECT STATUS
     ======================================================= */

  const updateProjectStatus = async (
    projectId,
    status
  ) => {
    try {
      const { data, error } = await supabase
        .from("assessment_projects")
        .update({ status })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? data
            : project
        )
      );

      if (
        selectedProject?.id === projectId
      ) {
        setSelectedProject(data);
      }

      showToast(`Status updated: ${status}`);
    } catch (error) {
      console.error(error);
      showToast(
        error?.message ||
          "Unable to update status."
      );
    }
  };

  /* =======================================================
     GENERATE QUESTIONS
     ======================================================= */

  const generateQuestions = async () => {
    if (!user) {
      showToast(
        "Please login before generating questions."
      );
      return;
    }

    if (!questionForm.topic.trim()) {
      showToast("Enter a topic first.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...questionForm,
            count: Number(
              questionForm.count || 5
            ),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "AI generation failed."
        );
      }

      const generated =
        Array.isArray(result?.questions)
          ? result.questions
          : [];

      if (!generated.length) {
        throw new Error(
          "AI returned no questions."
        );
      }

      let project = selectedProject;

      if (!project) {
        const autoProject = {
          user_id: user.id,
          project_name:
            `${questionForm.topic} - AI Question Bank`,
          project_type:
            "AI Question Development",
          grade: questionForm.grade,
          subject: questionForm.subject,
          course: "",
          unit: "",
          lesson: questionForm.lesson,
          standard: questionForm.standard,
          learning_objective:
            questionForm.objective,
          question_type:
            questionForm.questionType,
          dok: questionForm.dok,
          bloom_level:
            questionForm.bloomLevel,
          difficulty:
            questionForm.difficulty,
          question_count:
            generated.length,
          status: "AI Generated",
        };

        const {
          data: createdProject,
          error: projectError,
        } = await supabase
          .from("assessment_projects")
          .insert(autoProject)
          .select()
          .single();

        if (projectError) {
          throw projectError;
        }

        project = createdProject;

        setProjects((prev) => [
          createdProject,
          ...prev,
        ]);

        setSelectedProject(
          createdProject
        );
      } else {
        await updateProjectStatus(
          project.id,
          "AI Generated"
        );
      }

      const rows = generated.map(
        (question, index) => ({
          project_id: project.id,
          user_id: user.id,
          question_number:
            index + 1,
          question_type:
            question.question_type ||
            questionForm.questionType,
          question_text:
            question.question_text ||
            question.question ||
            "",
          image_url:
            question.image_url || null,
          option_a:
            question.option_a ||
            question.options?.A ||
            "",
          option_b:
            question.option_b ||
            question.options?.B ||
            "",
          option_c:
            question.option_c ||
            question.options?.C ||
            "",
          option_d:
            question.option_d ||
            question.options?.D ||
            "",
          correct_answer:
            question.correct_answer ||
            "",
          rationale:
            question.rationale ||
            "",
          explanation:
            question.explanation ||
            "",
          grade:
            question.grade ||
            questionForm.grade,
          subject:
            question.subject ||
            questionForm.subject,
          course: "",
          unit: "",
          lesson:
            question.lesson ||
            questionForm.lesson,
          standard:
            question.standard ||
            questionForm.standard,
          learning_objective:
            question.learning_objective ||
            questionForm.objective,
          dok:
            question.dok ||
            questionForm.dok,
          bloom_level:
            question.bloom_level ||
            questionForm.bloomLevel,
          difficulty:
            question.difficulty ||
            questionForm.difficulty,
          status: "AI Generated",
          version: 1,
        })
      );

      const {
        data: insertedItems,
        error: itemError,
      } = await supabase
        .from("assessment_items")
        .insert(rows)
        .select();

      if (itemError) {
        throw itemError;
      }

      setItems((prev) => [
        ...(insertedItems || []),
        ...prev,
      ]);

      setShowQuestionModal(false);

      setQuestionForm({
        topic: "",
        standard: "",
        objective: "",
        grade: "",
        subject: "",
        lesson: "",
        questionType: "MCQ",
        dok: "DOK 2",
        bloomLevel: "Apply",
        difficulty: "Medium",
        count: 5,
        instructions: "",
      });

      showToast(
        `${insertedItems?.length || generated.length} questions generated successfully.`
      );
    } catch (error) {
      console.error(error);

      showToast(
        error?.message ||
          "Question generation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     UPDATE ITEM
     ======================================================= */

  const updateItemStatus = async (
    itemId,
    status,
    comment = ""
  ) => {
    try {
      const updates = {
        status,
      };

      if (comment.trim()) {
        updates.quality_comment =
          comment.trim();
      }

      const { data, error } =
        await supabase
          .from("assessment_items")
          .update(updates)
          .eq("id", itemId)
          .select()
          .single();

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? data
            : item
        )
      );

      setSelectedItem(data);
      setReviewComment("");

      showToast(
        `Question moved to ${status}.`
      );
    } catch (error) {
      console.error(error);

      showToast(
        error?.message ||
          "Unable to update question."
      );
    }
  };

  /* =======================================================
     DELETE PROJECT
     ======================================================= */

  const deleteProject = async (
    projectId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this project and its questions?"
      );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("assessment_projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project.id !== projectId
        )
      );

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.project_id !== projectId
        )
      );

      if (
        selectedProject?.id === projectId
      ) {
        setSelectedProject(null);
      }

      showToast("Project deleted.");
    } catch (error) {
      console.error(error);

      showToast(
        error?.message ||
          "Unable to delete project."
      );
    }
  };

  /* =======================================================
     EXPORT CSV
     ======================================================= */

  const exportItemsCSV = () => {
    if (!filteredItems.length) {
      showToast("No question items to export.");
      return;
    }

    const headers = [
      "Question Number",
      "Question Type",
      "Question",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Correct Answer",
      "Rationale",
      "Grade",
      "Subject",
      "Lesson",
      "Standard",
      "Learning Objective",
      "DOK",
      "Bloom Level",
      "Difficulty",
      "Status",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "")
        .replace(/"/g, '""')
        .replace(/\n/g, " ")}"`;

    const rows = filteredItems.map(
      (item) =>
        [
          item.question_number,
          item.question_type,
          item.question_text,
          item.option_a,
          item.option_b,
          item.option_c,
          item.option_d,
          item.correct_answer,
          item.rationale,
          item.grade,
          item.subject,
          item.lesson,
          item.standard,
          item.learning_objective,
          item.dok,
          item.bloom_level,
          item.difficulty,
          item.status,
        ]
          .map(escapeCSV)
          .join(",")
    );

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "AI-Future-Tamil-Question-Bank.csv";

    link.click();

    URL.revokeObjectURL(url);

    showToast("Question bank exported.");
  };

  /* =======================================================
     SELECT WORKSPACE
     ======================================================= */

  const selectWorkspace = (id) => {
    setWorkspace(id);

    const selected =
      WORKSPACES.find(
        (item) => item.id === id
      );

    if (selected) {
      showToast(
        `${selected.title} workspace selected.`
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const selectedWorkspace =
    WORKSPACES.find(
      (item) => item.id === workspace
    ) || WORKSPACES[0];

  /* =======================================================
     SPECIAL WORKSPACE DETECTION
     ======================================================= */

  const isReviewWorkspace = [
    "peer",
    "review",
    "quality-review",
    "editorial-review",
    "accessibility-review",
    "revision",
  ].includes(workspace);

  const isQuestionWorkspace = [
    "question",
    "mcq-builder",
    "image-question",
    "scenario-question",
    "case-question",
    "oeq",
    "two-tier",
    "distractor",
  ].includes(workspace);

  const isAnalysisWorkspace = [
    "sme-analyzer",
    "standard-alignment",
    "dok-analyzer",
    "bloom-analyzer",
    "difficulty-analyzer",
    "misconception",
  ].includes(workspace);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <Toast toast={toast} />

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="border-b border-gray-100 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-2 text-sm font-black text-blue-600 shadow-sm">
                🧠 SME & Assessment Intelligence
              </div>

              <h1 className="mt-6 text-5xl font-black tracking-tight text-gray-950 md:text-6xl">
                SME Hub
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
                Develop, generate, analyze, review and
                approve high-quality assessment content
                from one intelligent workspace.
              </p>

              {!user && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800">
                  🔐 Login is required for Supabase
                  project creation, question generation
                  and review actions.
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white shadow-xl hover:bg-gray-800"
              >
                + Create Assessment
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowQuestionModal(true)
                }
                className="rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl hover:bg-blue-700"
              >
                ✨ AI Generate Questions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-10 lg:px-8">
        {/* STATS */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={projects.length}
            icon="📁"
            className="bg-blue-50"
          />

          <StatCard
            title="AI Generated"
            value={aiGeneratedCount}
            icon="✨"
            className="bg-cyan-50"
          />

          <StatCard
            title="Under Review"
            value={underReviewCount}
            icon="🔍"
            className="bg-purple-50"
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            icon="✅"
            className="bg-green-50"
          />
        </div>

        {/* DROPDOWN */}

        <WorkspaceDropdown
          value={workspace}
          onChange={selectWorkspace}
        />

        {/* SEARCH */}

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="🔎 Search projects, questions, subjects, lessons..."
            className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-medium outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />

          <button
            type="button"
            onClick={loadData}
            className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-black shadow-sm hover:bg-gray-50"
          >
            🔄 Refresh
          </button>

          <button
            type="button"
            onClick={exportItemsCSV}
            className="rounded-2xl bg-gray-950 px-6 py-4 text-sm font-black text-white"
          >
            ⬇ Export Question Bank
          </button>
        </div>

        {/* =================================================
            WORKSPACE CARDS
            ================================================= */}

        <section>
          <SectionTitle
            title="All SME Workspaces"
            subtitle="Choose a specialized workspace without leaving the SME Hub."
          />

          {WORKSPACE_GROUPS.map(
            (group) => (
              <div
                key={group}
                className="mb-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="rounded-full bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500">
                    {group}
                  </span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {WORKSPACES.filter(
                    (item) =>
                      item.group === group
                  ).map((item) => (
                    <WorkspaceCard
                      key={item.id}
                      item={item}
                      selected={
                        workspace === item.id
                      }
                      onClick={() =>
                        selectWorkspace(
                          item.id
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </section>

        {/* =================================================
            WORKFLOW
            ================================================= */}

        <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <SectionTitle
            title="Assessment Workflow"
            subtitle="Draft → AI Generated → SME Review → Peer Review → Revision → Approved"
          />

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["01", "📝", "Draft"],
              ["02", "✨", "AI Generated"],
              ["03", "🧠", "SME Review"],
              ["04", "👥", "Peer Review"],
              ["05", "🔄", "Revision"],
              ["06", "✅", "Approved"],
            ].map(([number, icon, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  {icon}
                </div>

                <p className="mt-3 text-xs font-black text-gray-400">
                  {number}
                </p>

                <p className="mt-1 font-black">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================
            ACTIVE WORKSPACE
            ================================================= */}

        <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-4xl">
                {selectedWorkspace.icon}
              </div>

              <h2 className="mt-4 text-3xl font-black">
                {selectedWorkspace.title}
              </h2>

              <p className="mt-2 text-gray-500">
                {selectedWorkspace.subtitle}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 px-5 py-4 text-sm font-bold text-gray-600">
              Active Workspace
              <span className="ml-2 text-blue-600">
                {selectedWorkspace.group}
              </span>
            </div>
          </div>

          {/* QUESTION DEVELOPMENT */}

          {isQuestionWorkspace && (
            <div className="mt-8 rounded-3xl border border-purple-100 bg-purple-50 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-black">
                    Question Development Workspace
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Create standards-aligned, DOK-aware,
                    Bloom-aligned assessment questions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowQuestionModal(true)
                  }
                  className="rounded-2xl bg-purple-600 px-6 py-4 text-sm font-black text-white"
                >
                  ✨ Open Question Generator
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  ["MCQ", "🔘"],
                  ["Image-Based", "🖼️"],
                  ["Scenario", "🎭"],
                  ["OEQ", "✍️"],
                ].map(
                  ([label, icon]) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => {
                        setQuestionForm(
                          (prev) => ({
                            ...prev,
                            questionType:
                              label === "Image-Based"
                                ? "Image-Based MCQ"
                                : label,
                          })
                        );

                        setShowQuestionModal(
                          true
                        );
                      }}
                      className="rounded-2xl border border-white bg-white p-5 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="text-2xl">
                        {icon}
                      </div>

                      <p className="mt-3 font-black">
                        {label}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* REVIEW WORKSPACE */}

          {isReviewWorkspace && (
            <div className="mt-8 rounded-3xl border border-green-100 bg-green-50 p-6">
              <h3 className="text-xl font-black">
                Review & Quality Workspace
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Select a question below and move it through
                the SME → Peer → Revision → Approved workflow.
              </p>

              <div className="mt-6 grid gap-4">
                {filteredItems
                  .filter(
                    (item) =>
                      item.status !==
                      "Approved"
                  )
                  .slice(0, 10)
                  .map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        setSelectedItem(item)
                      }
                      className="rounded-2xl border border-white bg-white p-5 text-left shadow-sm hover:shadow-md"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs font-black text-gray-400">
                            Q
                            {item.question_number}{" "}
                            •{" "}
                            {item.question_type}
                          </p>

                          <p className="mt-2 line-clamp-2 font-bold">
                            {item.question_text}
                          </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-black">
                          {item.status}
                        </span>
                      </div>
                    </button>
                  ))}

                {!filteredItems.filter(
                  (item) =>
                    item.status !==
                    "Approved"
                ).length && (
                  <div className="rounded-2xl bg-white p-8 text-center text-sm font-bold text-gray-500">
                    No questions currently waiting for review.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANALYSIS WORKSPACE */}

          {isAnalysisWorkspace && (
            <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="text-xl font-black">
                Analysis Workspace
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Analyze standards, objectives, cognitive
                demand, difficulty and misconceptions before
                final approval.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  [
                    "Standard Alignment",
                    "🎯",
                    "Check alignment",
                  ],
                  [
                    "DOK Analysis",
                    "📐",
                    "Check cognitive demand",
                  ],
                  [
                    "Bloom Analysis",
                    "🌱",
                    "Check Bloom level",
                  ],
                  [
                    "Difficulty",
                    "📊",
                    "Check difficulty",
                  ],
                ].map(
                  ([title, icon, text]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white bg-white p-5"
                    >
                      <div className="text-3xl">
                        {icon}
                      </div>

                      <h4 className="mt-4 font-black">
                        {title}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        {text}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* DEFAULT WORKSPACE */}

          {!isQuestionWorkspace &&
            !isReviewWorkspace &&
            !isAnalysisWorkspace && (
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <div className="text-3xl">
                    📝
                  </div>

                  <h3 className="mt-4 font-black">
                    Development
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Create structured content, lessons,
                    objectives and assessment materials.
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <div className="text-3xl">
                    🧠
                  </div>

                  <h3 className="mt-4 font-black">
                    Analysis
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Analyze standards, DOK, Bloom,
                    difficulty and misconceptions.
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <div className="text-3xl">
                    ✅
                  </div>

                  <h3 className="mt-4 font-black">
                    Quality
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Review, revise, approve and manage
                    assessment quality.
                  </p>
                </div>
              </div>
            )}
        </section>

        {/* =================================================
            PROJECT LIBRARY
            ================================================= */}

        <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SectionTitle
              title="Project Library"
              subtitle={`${filteredProjects.length} project(s) available`}
            />

            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-black text-white"
            >
              + New Project
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-gray-50 p-10 text-center font-bold text-gray-500">
              Loading projects...
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredProjects
                .slice(0, 12)
                .map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-gray-100 p-5 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black">
                            {project.project_name}
                          </h3>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                            {project.status}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                          {project.grade && (
                            <span>
                              Grade:{" "}
                              {project.grade}
                            </span>
                          )}

                          {project.subject && (
                            <span>
                              •{" "}
                              {project.subject}
                            </span>
                          )}

                          {project.lesson && (
                            <span>
                              •{" "}
                              {project.lesson}
                            </span>
                          )}

                          <span>
                            •{" "}
                            {project.question_count ||
                              0}{" "}
                            questions
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProject(
                              project
                            );
                            setWorkspace(
                              "question"
                            );
                            setShowQuestionModal(
                              true
                            );
                          }}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white"
                        >
                          Generate
                        </button>

                        <select
                          value={
                            project.status ||
                            "Draft"
                          }
                          onChange={(e) =>
                            updateProjectStatus(
                              project.id,
                              e.target.value
                            )
                          }
                          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold"
                        >
                          {STATUS_LIST.map(
                            (status) => (
                              <option
                                key={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProject(
                              project.id
                            )
                          }
                          className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {!filteredProjects.length && (
                <div className="rounded-2xl bg-gray-50 p-10 text-center">
                  <div className="text-4xl">
                    📁
                  </div>

                  <p className="mt-3 font-black">
                    No projects found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Create your first assessment project.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            ITEM BANK
            ================================================= */}

        <section className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
          <SectionTitle
            title="Question Bank"
            subtitle={`${filteredItems.length} assessment item(s)`}
          />

          <div className="grid gap-4">
            {filteredItems
              .slice(0, 20)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-4xl">
                      <div className="flex flex-wrap gap-2 text-xs font-black">
                        <span className="rounded-full bg-gray-100 px-3 py-1">
                          Q
                          {item.question_number}
                        </span>

                        <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-600">
                          {item.question_type}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                          {item.dok}
                        </span>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-green-600">
                          {item.bloom_level}
                        </span>

                        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">
                          {item.difficulty}
                        </span>
                      </div>

                      <p className="mt-4 font-bold leading-7 text-gray-900">
                        {item.question_text}
                      </p>

                      {item.question_type !==
                        "OEQ" && (
                        <div className="mt-4 grid gap-2 md:grid-cols-2">
                          {[
                            [
                              "A",
                              item.option_a,
                            ],
                            [
                              "B",
                              item.option_b,
                            ],
                            [
                              "C",
                              item.option_c,
                            ],
                            [
                              "D",
                              item.option_d,
                            ],
                          ].map(
                            ([letter, option]) =>
                              option && (
                                <div
                                  key={letter}
                                  className="rounded-xl bg-gray-50 p-3 text-sm"
                                >
                                  <b>
                                    {letter}.
                                  </b>{" "}
                                  {option}
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-2 text-center text-xs font-black">
                        {item.status}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedItem(
                            item
                          )
                        }
                        className="rounded-xl bg-gray-950 px-4 py-2 text-xs font-black text-white"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {!filteredItems.length && (
              <div className="rounded-2xl bg-gray-50 p-10 text-center">
                <div className="text-4xl">
                  📚
                </div>

                <p className="mt-3 font-black">
                  Question Bank is empty
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Use AI Question Developer to generate
                  assessment items.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
            ================================================= */}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "Create Assessment",
              "🚀",
              "Start a new question development project.",
              () =>
                setShowCreateModal(true),
            ],
            [
              "Review Questions",
              "🔍",
              `${underReviewCount} projects are under review.`,
              () =>
                selectWorkspace("review"),
            ],
            [
              "Open Item Bank",
              "📚",
              `${approvedItems.length} approved items available.`,
              () =>
                selectWorkspace(
                  "approved-bank"
                ),
            ],
            [
              "AI Question Developer",
              "✨",
              "Generate questions with AI.",
              () =>
                setShowQuestionModal(
                  true
                ),
            ],
          ].map(
            ([title, icon, text, action]) => (
              <button
                type="button"
                key={title}
                onClick={action}
                className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-3xl">
                  {icon}
                </div>

                <h3 className="mt-5 text-lg font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {text}
                </p>
              </button>
            )
          )}
        </section>
      </main>

      {/* ===================================================
          CREATE PROJECT MODAL
          =================================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/60 p-5">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-black">
                  Create Assessment Project
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure your assessment before generating
                  questions.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="rounded-xl bg-gray-100 px-4 py-2 font-black"
              >
                ✕
              </button>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {[
                [
                  "Project Name",
                  "projectName",
                  "Example: Atomic Spectra Unit Test",
                ],
                [
                  "Grade",
                  "grade",
                  "Example: Grade 9",
                ],
                [
                  "Subject",
                  "subject",
                  "Example: Science",
                ],
                [
                  "Course",
                  "course",
                  "Example: Physical Science",
                ],
                [
                  "Unit",
                  "unit",
                  "Example: Atomic Structure",
                ],
                [
                  "Lesson",
                  "lesson",
                  "Example: Atomic Spectra",
                ],
                [
                  "Standard",
                  "standard",
                  "Enter standard",
                ],
                [
                  "Learning Objective",
                  "learningObjective",
                  "Students will be able to...",
                ],
              ].map(
                ([label, key, placeholder]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-black">
                      {label}
                    </label>

                    <input
                      value={
                        projectForm[key]
                      }
                      onChange={(e) =>
                        setProjectForm(
                          (prev) => ({
                            ...prev,
                            [key]:
                              e.target.value,
                          })
                        )
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                )
              )}

              <div>
                <label className="mb-2 block text-sm font-black">
                  Question Type
                </label>

                <select
                  value={
                    projectForm.questionType
                  }
                  onChange={(e) =>
                    setProjectForm(
                      (prev) => ({
                        ...prev,
                        questionType:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {QUESTION_TYPES.map(
                    (type) => (
                      <option key={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Question Count
                </label>

                <input
                  type="number"
                  min="1"
                  max="100"
                  value={
                    projectForm.questionCount
                  }
                  onChange={(e) =>
                    setProjectForm(
                      (prev) => ({
                        ...prev,
                        questionCount:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  DOK
                </label>

                <select
                  value={projectForm.dok}
                  onChange={(e) =>
                    setProjectForm(
                      (prev) => ({
                        ...prev,
                        dok: e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {DOK_LEVELS.map(
                    (level) => (
                      <option key={level}>
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Bloom Level
                </label>

                <select
                  value={
                    projectForm.bloomLevel
                  }
                  onChange={(e) =>
                    setProjectForm(
                      (prev) => ({
                        ...prev,
                        bloomLevel:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {BLOOM_LEVELS.map(
                    (level) => (
                      <option key={level}>
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Difficulty
                </label>

                <select
                  value={
                    projectForm.difficulty
                  }
                  onChange={(e) =>
                    setProjectForm(
                      (prev) => ({
                        ...prev,
                        difficulty:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {DIFFICULTIES.map(
                    (level) => (
                      <option key={level}>
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={createProject}
                className="rounded-xl bg-gray-950 px-6 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {saving
                  ? "Creating..."
                  : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          AI QUESTION MODAL
          =================================================== */}

      {showQuestionModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/60 p-5">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-black">
                  ✨ AI Question Developer
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Generate assessment items and save them directly
                  to your Supabase Question Bank.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowQuestionModal(false)
                }
                className="rounded-xl bg-gray-100 px-4 py-2 font-black"
              >
                ✕
              </button>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {[
                [
                  "Topic / Lesson",
                  "topic",
                  "Example: Atomic Spectra",
                ],
                [
                  "Grade",
                  "grade",
                  "Example: Grade 9",
                ],
                [
                  "Subject",
                  "subject",
                  "Example: Science",
                ],
                [
                  "Lesson",
                  "lesson",
                  "Example: Atomic Spectra",
                ],
                [
                  "Standard",
                  "standard",
                  "Enter standard",
                ],
                [
                  "Learning Objective",
                  "objective",
                  "Students will be able to...",
                ],
              ].map(
                ([label, key, placeholder]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-black">
                      {label}
                    </label>

                    <input
                      value={
                        questionForm[key]
                      }
                      onChange={(e) =>
                        setQuestionForm(
                          (prev) => ({
                            ...prev,
                            [key]:
                              e.target.value,
                          })
                        )
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                )
              )}

              <div>
                <label className="mb-2 block text-sm font-black">
                  Question Type
                </label>

                <select
                  value={
                    questionForm.questionType
                  }
                  onChange={(e) =>
                    setQuestionForm(
                      (prev) => ({
                        ...prev,
                        questionType:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {QUESTION_TYPES.map(
                    (type) => (
                      <option key={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Number of Questions
                </label>

                <input
                  type="number"
                  min="1"
                  max="50"
                  value={questionForm.count}
                  onChange={(e) =>
                    setQuestionForm(
                      (prev) => ({
                        ...prev,
                        count:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  DOK
                </label>

                <select
                  value={questionForm.dok}
                  onChange={(e) =>
                    setQuestionForm(
                      (prev) => ({
                        ...prev,
                        dok: e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {DOK_LEVELS.map(
                    (level) => (
                      <option key={level}>
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Bloom Level
                </label>

                <select
                  value={
                    questionForm.bloomLevel
                  }
                  onChange={(e) =>
                    setQuestionForm(
                      (prev) => ({
                        ...prev,
                        bloomLevel:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {BLOOM_LEVELS.map(
                    (level) => (
                      <option key={level}>
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Difficulty
                </label>

                <select
                  value={
                    questionForm.difficulty
                  }
                  onChange={(e) =>
                    setQuestionForm(
                      (prev) => ({
                        ...prev,
                        difficulty:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                >
                  {DIFFICULTIES.map(
                    (level) => (
                      <option key={level}>
                        {level}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-black">
                Additional Instructions
              </label>

              <textarea
                rows={5}
                value={
                  questionForm.instructions
                }
                onChange={(e) =>
                  setQuestionForm(
                    (prev) => ({
                      ...prev,
                      instructions:
                        e.target.value,
                    })
                  )
                }
                placeholder="Example: Make questions application-based. Avoid clues. Use real-world contexts. Include plausible distractors."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {selectedProject && (
              <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
                📁 Questions will be added to:
                {" "}
                {selectedProject.project_name}
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowQuestionModal(false)
                }
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-black"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={generateQuestions}
                className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-black text-white shadow-lg disabled:opacity-50"
              >
                {saving
                  ? "Generating..."
                  : "✨ Generate Questions"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          REVIEW ITEM MODAL
          =================================================== */}

      {selectedItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-950/60 p-5">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-500">
                  Question Review
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Q
                  {selectedItem.question_number}
                  {" "}
                  •{" "}
                  {selectedItem.question_type}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedItem(null)
                }
                className="rounded-xl bg-gray-100 px-4 py-2 font-black"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-6">
              <p className="text-lg font-bold leading-8">
                {selectedItem.question_text}
              </p>

              {selectedItem.question_type !==
                "OEQ" && (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {[
                    [
                      "A",
                      selectedItem.option_a,
                    ],
                    [
                      "B",
                      selectedItem.option_b,
                    ],
                    [
                      "C",
                      selectedItem.option_c,
                    ],
                    [
                      "D",
                      selectedItem.option_d,
                    ],
                  ].map(
                    ([letter, option]) =>
                      option && (
                        <div
                          key={letter}
                          className="rounded-xl bg-white p-4 text-sm"
                        >
                          <b>
                            {letter}.
                          </b>{" "}
                          {option}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-bold text-gray-500">
                  DOK
                </p>
                <p className="mt-1 font-black">
                  {selectedItem.dok}
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs font-bold text-gray-500">
                  Bloom
                </p>
                <p className="mt-1 font-black">
                  {selectedItem.bloom_level}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs font-bold text-gray-500">
                  Difficulty
                </p>
                <p className="mt-1 font-black">
                  {selectedItem.difficulty}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-xs font-bold text-gray-500">
                  Correct Answer
                </p>
                <p className="mt-1 font-black">
                  {selectedItem.correct_answer ||
                    "OEQ"}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="font-black">
                Quality Checklist
              </h3>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {REVIEW_CHECKLIST.map(
                  (check) => (
                    <label
                      key={check}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <input
                        type="checkbox"
                        checked={
                          !!reviewChecks[
                            check
                          ]
                        }
                        onChange={(e) =>
                          setReviewChecks(
                            (prev) => ({
                              ...prev,
                              [check]:
                                e.target
                                  .checked,
                            })
                          )
                        }
                      />

                      <span className="text-sm font-medium">
                        {check}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-black">
                Reviewer Comment
              </label>

              <textarea
                value={reviewComment}
                onChange={(e) =>
                  setReviewComment(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Enter SME / Peer / Quality review comments..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  updateItemStatus(
                    selectedItem.id,
                    "SME Review",
                    reviewComment
                  )
                }
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white"
              >
                🧠 SME Review
              </button>

              <button
                type="button"
                onClick={() =>
                  updateItemStatus(
                    selectedItem.id,
                    "Peer Review",
                    reviewComment
                  )
                }
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-black text-white"
              >
                👥 Peer Review
              </button>

              <button
                type="button"
                onClick={() =>
                  updateItemStatus(
                    selectedItem.id,
                    "Revision Needed",
                    reviewComment
                  )
                }
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white"
              >
                🔄 Revision Needed
              </button>

              <button
                type="button"
                onClick={() =>
                  updateItemStatus(
                    selectedItem.id,
                    "Approved",
                    reviewComment
                  )
                }
                className="rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white"
              >
                ✅ Approve
              </button>

              <button
                type="button"
                onClick={() =>
                  updateItemStatus(
                    selectedItem.id,
                    "Rejected",
                    reviewComment
                  )
                }
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white"
              >
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          UPLOAD CENTER
          =================================================== */}

      {showUploadModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-950/60 p-5">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">
                📤 Upload Center
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowUploadModal(false)
                }
                className="rounded-xl bg-gray-100 px-4 py-2 font-black"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
              <div className="text-5xl">
                📄
              </div>

              <h3 className="mt-4 font-black">
                Upload Reference Material
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                PDF, DOCX, PPTX, XLSX and reference files.
              </p>

              <input
                type="file"
                className="mt-6 block w-full text-sm"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setShowUploadModal(false);
                showToast(
                  "Upload center is ready for file integration."
                );
              }}
              className="mt-6 w-full rounded-xl bg-gray-950 px-5 py-3 text-sm font-black text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-8 text-center lg:px-8">
          <p className="text-sm font-bold text-gray-500">
            AI Future Tamil • SME & Assessment Intelligence
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Content Development • Question Development • SME
            Analysis • Peer Review • Quality Review • Question Bank
          </p>
        </div>
      </footer>
    </div>
  );
}