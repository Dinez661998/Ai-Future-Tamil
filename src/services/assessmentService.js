import { supabase } from "../supabase/client";

/* --------------------------------
   GET CURRENT USER
--------------------------------- */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
}

/* --------------------------------
   CREATE ASSESSMENT PROJECT
--------------------------------- */
export async function createAssessmentProject(projectData) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please login before creating an assessment project.");
  }

  const { data, error } = await supabase
    .from("assessment_projects")
    .insert({
      user_id: user.id,

      project_name:
        projectData.project_name || "Untitled Assessment",

      project_type:
        projectData.project_type || "Question Development",

      grade: projectData.grade || null,
      subject: projectData.subject || null,
      course: projectData.course || null,
      unit: projectData.unit || null,
      lesson: projectData.lesson || null,
      standard: projectData.standard || null,
      learning_objective:
        projectData.learning_objective || null,

      question_type:
        projectData.question_type || "MCQ",

      dok: projectData.dok || "DOK 1",

      bloom_level:
        projectData.bloom_level || "Remember",

      difficulty:
        projectData.difficulty || "Easy",

      question_count:
        Number(projectData.question_count) || 10,

      status: "Draft",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* --------------------------------
   UPDATE PROJECT STATUS
--------------------------------- */
export async function updateProjectStatus(
  projectId,
  status
) {
  const { data, error } = await supabase
    .from("assessment_projects")
    .update({
      status,
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* --------------------------------
   SAVE GENERATED QUESTIONS
--------------------------------- */
export async function saveAssessmentItems(
  projectId,
  questions,
  projectData
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please login first.");
  }

  const items = questions.map((question, index) => ({
    project_id: projectId,
    user_id: user.id,

    question_number:
      question.question_number || index + 1,

    question_type:
      question.question_type ||
      projectData.question_type ||
      "MCQ",

    question_text:
      question.question_text || "",

    image_url:
      question.image_url || null,

    option_a:
      question.option_a || null,

    option_b:
      question.option_b || null,

    option_c:
      question.option_c || null,

    option_d:
      question.option_d || null,

    correct_answer:
      question.correct_answer || null,

    rationale:
      question.rationale || null,

    explanation:
      question.explanation || null,

    grade:
      projectData.grade || null,

    subject:
      projectData.subject || null,

    course:
      projectData.course || null,

    unit:
      projectData.unit || null,

    lesson:
      projectData.lesson || null,

    standard:
      projectData.standard || null,

    learning_objective:
      projectData.learning_objective || null,

    dok:
      projectData.dok || null,

    bloom_level:
      projectData.bloom_level || null,

    difficulty:
      projectData.difficulty || null,

    status: "AI Generated",

    version: 1,
  }));

  const { data, error } = await supabase
    .from("assessment_items")
    .insert(items)
    .select();

  if (error) throw error;

  return data;
}

/* --------------------------------
   GET PROJECTS
--------------------------------- */
export async function getAssessmentProjects() {
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("assessment_projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

/* --------------------------------
   GET QUESTIONS
--------------------------------- */
export async function getAssessmentItems(projectId) {
  const { data, error } = await supabase
    .from("assessment_items")
    .select("*")
    .eq("project_id", projectId)
    .order("question_number", {
      ascending: true,
    });

  if (error) throw error;

  return data || [];
}