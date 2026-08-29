// ============================================================
// dashboardStorage.js
// Central localStorage helper for Dashboard / AI Tools / Prompts
// ============================================================

// ------------------------------------------------------------
// Common helper
// ------------------------------------------------------------
import { supabase } from "../supabase/supabaseClient";
function readArray(key) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read localStorage key: ${key}`, error);
    return [];
  }
}

function writeArray(key, value) {
  const safeArray = Array.isArray(value) ? value : [];

  localStorage.setItem(
    key,
    JSON.stringify(safeArray)
  );

  dispatchDashboardUpdate();

  return safeArray;
}

function readNumber(key) {
  const value = Number(
    localStorage.getItem(key)
  );

  return Number.isFinite(value) ? value : 0;
}

function writeNumber(key, value) {
  const safeValue = Number.isFinite(Number(value))
    ? Number(value)
    : 0;

  localStorage.setItem(
    key,
    String(safeValue)
  );

  dispatchDashboardUpdate();

  return safeValue;
}

function dispatchDashboardUpdate() {
  window.dispatchEvent(
    new Event("dashboard-data-updated")
  );
}


// ============================================================
// FAVORITE AI TOOLS
// localStorage + Supabase
// ============================================================

const VALID_TOOL_IDS = [
  "chatgpt",
  "gemini",
  "claude",
  "midjourney",
  "runway",
  "suno",
];

function normalizeToolId(toolOrId) {
  if (
    typeof toolOrId === "object" &&
    toolOrId !== null &&
    toolOrId.id
  ) {
    return String(toolOrId.id);
  }

  return String(toolOrId);
}

// ------------------------------------------------------------
// READ LOCAL FAVORITES
// ------------------------------------------------------------

export function getFavoriteTools() {
  const favorites = readArray("favoriteTools");

  const cleaned = favorites
    .map(String)
    .filter((id) => VALID_TOOL_IDS.includes(id));

  if (cleaned.length !== favorites.length) {
    writeArray("favoriteTools", cleaned);
  }

  return cleaned;
}

// ------------------------------------------------------------
// GET CURRENT USER
// ------------------------------------------------------------

async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Favorite user error:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Favorite auth error:", error);
    return null;
  }
}

// ------------------------------------------------------------
// SAVE FAVORITE TO SUPABASE
// ------------------------------------------------------------

async function saveFavoriteToSupabase(toolId) {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabase
      .from("favorites")
      .upsert(
        {
          user_id: user.id,
          tool_id: toolId,
        },
        {
          onConflict: "user_id,tool_id",
        }
      );

    if (error) {
      console.error(
        "Supabase favorite save error:",
        error
      );
      return;
    }

    console.log(
      "✅ Favorite saved to Supabase:",
      toolId
    );
  } catch (error) {
    console.error(
      "Favorite save error:",
      error
    );
  }
}

// ------------------------------------------------------------
// REMOVE FAVORITE FROM SUPABASE
// ------------------------------------------------------------

async function removeFavoriteFromSupabase(toolId) {
  try {
    const user = await getCurrentUser();

    if (!user) return;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("tool_id", toolId);

    if (error) {
      console.error(
        "Supabase favorite delete error:",
        error
      );
      return;
    }

    console.log(
      "✅ Favorite removed from Supabase:",
      toolId
    );
  } catch (error) {
    console.error(
      "Favorite delete error:",
      error
    );
  }
}

// ------------------------------------------------------------
// SAVE FAVORITE
// ------------------------------------------------------------

export function saveFavoriteTool(toolOrId) {
  const id = normalizeToolId(toolOrId);

  if (!VALID_TOOL_IDS.includes(id)) {
    console.error("Invalid tool id:", id);
    return getFavoriteTools();
  }

  const favorites = getFavoriteTools();

  if (!favorites.includes(id)) {
    favorites.push(id);
  }

  const updated = writeArray(
    "favoriteTools",
    favorites
  );

  // Supabase save
  saveFavoriteToSupabase(id);

  return updated;
}

// ------------------------------------------------------------
// REMOVE FAVORITE
// ------------------------------------------------------------

export function removeFavoriteTool(toolOrId) {
  const id = normalizeToolId(toolOrId);

  const favorites = getFavoriteTools();

  const updated = favorites.filter(
    (item) => String(item) !== id
  );

  const result = writeArray(
    "favoriteTools",
    updated
  );

  // Supabase delete
  removeFavoriteFromSupabase(id);

  return result;
}

// ------------------------------------------------------------
// TOGGLE FAVORITE
// ------------------------------------------------------------

export function toggleFavoriteTool(toolOrId) {
  const id = normalizeToolId(toolOrId);

  const favorites = getFavoriteTools();

  if (favorites.includes(id)) {
    return removeFavoriteTool(id);
  }

  return saveFavoriteTool(id);
}


// ============================================================
// SAVED PROMPTS
// localStorage key:
// savedPrompts
// ============================================================

export function getSavedPrompts() {
  return readArray("savedPrompts");
}

export function savePrompt(promptId) {
  const id = String(promptId);

  const saved = getSavedPrompts();

  if (!saved.includes(id)) {
    saved.push(id);
  }

  const updated = writeArray(
    "savedPrompts",
    saved
  );

  return updated;
}

export function removeSavedPrompt(promptId) {
  const id = String(promptId);

  const saved = getSavedPrompts();

  const updated = saved.filter(
    (item) => String(item) !== id
  );

  return writeArray(
    "savedPrompts",
    updated
  );
}

export function toggleSavedPrompt(promptId) {
  const id = String(promptId);

  const saved = getSavedPrompts();

  if (saved.includes(id)) {
    return removeSavedPrompt(id);
  }

  return savePrompt(id);
}

export function getPromptsSavedCount() {
  return getSavedPrompts().length;
}
// Check if a specific prompt is saved (used by Prompts page)
export function isPromptSaved(promptId) {
  const id = String(promptId);
  return getSavedPrompts().includes(id);
}

// ============================================================
// RECENTLY VISITED TOOLS
// localStorage key:
// recentlyVisitedTools
// ============================================================

export function getRecentlyVisitedTools() {
  return readArray("recentlyVisitedTools");
}

export function saveRecentlyVisitedTool(tool) {
  if (!tool || !tool.id) {
    return getRecentlyVisitedTools();
  }

  const current = getRecentlyVisitedTools();

  const newTool = {
    ...tool,
    id: String(tool.id),
    visitedAt: new Date().toISOString(),
  };

  const withoutDuplicate = current.filter(
    (item) =>
      String(item?.id) !== String(newTool.id)
  );

  const updated = [
    newTool,
    ...withoutDuplicate,
  ].slice(0, 10);

  return writeArray(
    "recentlyVisitedTools",
    updated
  );
}
// Alias used by ToolDetails page
export function trackToolVisit(tool) {
  return saveRecentlyVisitedTool(tool);
}

// ============================================================
// RECENT ACTIVITY
// localStorage key:
// recentActivity
// ============================================================

export function getRecentActivity() {
  return readArray("recentActivity");
}

export function addRecentActivity(activity) {
  if (!activity) {
    return getRecentActivity();
  }

  const current = getRecentActivity();

  const newActivity = {
    ...activity,
    id:
      activity.id ||
      `${Date.now()}-${Math.random()}`,
    createdAt:
      activity.createdAt ||
      new Date().toISOString(),
  };

  const updated = [
    newActivity,
    ...current,
  ].slice(0, 10);

  return writeArray(
    "recentActivity",
    updated
  );
}


// ============================================================
// TOOLS EXPLORED
// localStorage key:
// toolsExplored
// ============================================================

export function getToolsExplored() {
  return readArray("toolsExplored");
}

export function markToolExplored(toolId) {
  const id = String(toolId);

  const explored = getToolsExplored();

  if (!explored.includes(id)) {
    explored.push(id);
  }

  return writeArray(
    "toolsExplored",
    explored
  );
}

export function getToolsExploredCount() {
  return getToolsExplored().length;
}


// ============================================================
// NEWS READ
// localStorage key:
// newsRead
// ============================================================

export function getNewsRead() {
  return readArray("newsRead");
}

export function trackNewsRead(newsId) {
  const id = String(newsId);

  const readNews = getNewsRead();

  if (!readNews.includes(id)) {
    readNews.push(id);
  }

  return writeArray(
    "newsRead",
    readNews
  );
}

export function markNewsRead(newsId) {
  return trackNewsRead(newsId);
}

export function getNewsReadCount() {
  return getNewsRead().length;
}


// ============================================================
// COURSES
// localStorage key:
// aft_completed_courses
// ============================================================

export function getCompletedCourses() {
  return readArray(
    "aft_completed_courses"
  );
}

export function completeCourse(courseId) {
  const id = String(courseId);

  const completed =
    getCompletedCourses();

  if (!completed.includes(id)) {
    completed.push(id);
  }

  return writeArray(
    "aft_completed_courses",
    completed
  );
}

export function removeCompletedCourse(courseId) {
  const id = String(courseId);

  const completed =
    getCompletedCourses();

  const updated = completed.filter(
    (item) => String(item) !== id
  );

  return writeArray(
    "aft_completed_courses",
    updated
  );
}

export function isCourseCompleted(courseId) {
  const id = String(courseId);

  return getCompletedCourses().includes(id);
}

export function getCompletedCourseCount() {
  return getCompletedCourses().length;
}

// ------------------------------------------------------------
// Backward-compatible old function name
// ------------------------------------------------------------

export function getCoursesCompletedCount() {
  return getCompletedCourseCount();
}


// ============================================================
// ACTIVITY TIME FORMATTER
// ============================================================

export function formatActivityTime(dateValue) {
  if (!dateValue) {
    return "Recently";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = Date.now();
  const diff = now - date.getTime();

  const seconds = Math.floor(
    diff / 1000
  );

  const minutes = Math.floor(
    seconds / 60
  );

  const hours = Math.floor(
    minutes / 60
  );

  const days = Math.floor(
    hours / 24
  );

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
}


// ============================================================
// OPTIONAL COUNTER HELPERS
// These keep compatibility with older components.
// ============================================================

export function getStoredCount(key) {
  return readNumber(key);
}

export function setStoredCount(key, value) {
  return writeNumber(key, value);
}


// ============================================================
// CLEAR ALL DASHBOARD DATA
// Useful for testing only.
// ============================================================

export function clearDashboardStorage() {
  const keys = [
    "favoriteTools",
    "savedPrompts",
    "recentlyVisitedTools",
    "recentActivity",
    "toolsExplored",
    "newsRead",
    "aft_completed_courses",
    "aiCourseProgress",
    "aiCourseQuizResults",
  ];

  keys.forEach((key) => {
    localStorage.removeItem(key);
  });

  dispatchDashboardUpdate();
}