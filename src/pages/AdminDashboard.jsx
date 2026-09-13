import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../supabase/client";

/* =========================================================
   CONFIG
========================================================= */

const MODULES = [
  {
    key: "tools",
    title: "AI Tools",
    icon: "🤖",
    table: "ai_tools",
    route: null,
    description:
      "AI tools add, edit, delete, trending and featured control.",
  },
  {
    key: "news",
    title: "AI News",
    icon: "📰",
    table: "ai_news",
    route: null,
    description:
      "AI news, updates and trending stories manage pannalam.",
  },
  {
    key: "prompts",
    title: "Prompts",
    icon: "✨",
    table: "prompts",
    route: null,
    description:
      "Prompt library full-aa manage pannalam.",
  },
  {
    key: "pricing",
    title: "Pricing",
    icon: "💳",
    table: "pricing_plans",
    route: null,
    description:
      "Website pricing plans add/edit/delete.",
  },
  {
    key: "courses",
    title: "Courses",
    icon: "🎓",
    table: "courses",
    route: null,
    description:
      "AI courses and learning content manage pannalam.",
  },
  {
    key: "sections",
    title: "Page Content",
    icon: "🏠",
    table: "site_sections",
    route: null,
    description:
      "Home hero, CTA, headings and website sections edit.",
  },
  {
    key: "navigation",
    title: "Navbar / Footer",
    icon: "🧭",
    table: "navigation_items",
    route: null,
    description:
      "Navbar and footer menu links manage.",
  },
  {
    key: "announcements",
    title: "Announcements",
    icon: "📢",
    table: "announcements",
    route: null,
    description:
      "Website announcement banner control.",
  },
  {
    key: "seo",
    title: "SEO",
    icon: "🔎",
    table: "seo_settings",
    route: null,
    description:
      "SEO title, description and keywords.",
  },
  {
    key: "settings",
    title: "Site Settings",
    icon: "⚙️",
    table: "site_settings",
    route: null,
    description:
      "Website name, logo, tagline and global settings.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function prettyDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

const MODULE_FIELDS = {
  tools: [
    "name",
    "slug",
    "description",
    "category",
    "website_url",
    "logo_url",
    "pricing",
    "featured",
    "trending",
  ],
  news: [
    "title",
    "slug",
    "summary",
    "category",
    "image_url",
    "source_url",
    "featured",
    "trending",
    "published_at",
  ],
  prompts: [
    "title",
    "slug",
    "prompt_text",
    "description",
    "category",
    "image_url",
    "featured",
    "premium",
    "published",
  ],
  pricing: [
    "name",
    "description",
    "price",
    "billing_period",
    "button_text",
    "button_url",
    "features",
    "popular",
    "active",
    "sort_order",
  ],
  courses: [
    "title",
    "slug",
    "description",
    "category",
    "level",
    "duration",
    "image_url",
    "course_url",
    "featured",
    "published",
  ],
  sections: [
    "page_key",
    "section_key",
    "title",
    "subtitle",
    "description",
    "button_text",
    "button_url",
    "image_url",
    "active",
    "sort_order",
  ],
  navigation: [
    "label",
    "url",
    "location",
    "active",
    "sort_order",
  ],
  announcements: [
    "message",
    "button_text",
    "button_url",
    "active",
  ],
  seo: [
    "page_key",
    "title",
    "description",
    "keywords",
    "image_url",
  ],
  settings: [
    "setting_key",
    "setting_value",
  ],
};

function getRecordIdentity(moduleKey, record) {
  if (!record) return [];

  if (
    record.id !== undefined &&
    record.id !== null
  ) {
    return [["id", record.id]];
  }

  if (moduleKey === "settings") {
    return [
      [
        "setting_key",
        record.setting_key,
      ],
    ];
  }

  if (moduleKey === "seo") {
    return [
      ["page_key", record.page_key],
    ];
  }

  if (moduleKey === "sections") {
    return [
      ["page_key", record.page_key],
      [
        "section_key",
        record.section_key,
      ],
    ];
  }

  return [];
}


/* =========================================================
   ADVANCED ADMIN HELPERS
========================================================= */

const ADMIN_ACTIVITY_KEY =
  "ai-future-admin-activity-v2";

const ADMIN_FAVORITES_KEY =
  "ai-future-admin-favorite-modules-v2";

const KIDS_KEYWORDS = [
  "kid",
  "kids",
  "child",
  "children",
  "school",
  "student",
  "learning",
  "education",
  "beginner",
  "family",
  "creative",
  "story",
  "drawing",
  "fun",
  "safe",
  "tamil",
];

const RISKY_KIDS_WORDS = [
  "adult",
  "weapon",
  "violent",
  "violence",
  "gambling",
  "betting",
  "casino",
  "drug",
  "drugs",
  "nsfw",
  "explicit",
  "hate",
];

const MODULE_ACCENTS = {
  tools: {
    gradient:
      "from-cyan-500/20 via-blue-500/10 to-transparent",
    border:
      "border-cyan-400/20",
    text: "text-cyan-300",
  },
  news: {
    gradient:
      "from-blue-500/20 via-indigo-500/10 to-transparent",
    border:
      "border-blue-400/20",
    text: "text-blue-300",
  },
  prompts: {
    gradient:
      "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    border:
      "border-purple-400/20",
    text: "text-purple-300",
  },
  pricing: {
    gradient:
      "from-emerald-500/20 via-cyan-500/10 to-transparent",
    border:
      "border-emerald-400/20",
    text: "text-emerald-300",
  },
  courses: {
    gradient:
      "from-amber-500/20 via-orange-500/10 to-transparent",
    border:
      "border-amber-400/20",
    text: "text-amber-300",
  },
  sections: {
    gradient:
      "from-pink-500/20 via-purple-500/10 to-transparent",
    border:
      "border-pink-400/20",
    text: "text-pink-300",
  },
  navigation: {
    gradient:
      "from-sky-500/20 via-cyan-500/10 to-transparent",
    border:
      "border-sky-400/20",
    text: "text-sky-300",
  },
  announcements: {
    gradient:
      "from-orange-500/20 via-yellow-500/10 to-transparent",
    border:
      "border-orange-400/20",
    text: "text-orange-300",
  },
  seo: {
    gradient:
      "from-violet-500/20 via-purple-500/10 to-transparent",
    border:
      "border-violet-400/20",
    text: "text-violet-300",
  },
  settings: {
    gradient:
      "from-slate-500/20 via-gray-500/10 to-transparent",
    border:
      "border-white/10",
    text: "text-gray-300",
  },
};

function safeReadJSON(key, fallback) {
  try {
    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed =
      JSON.parse(raw);

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJSON(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // Local storage unavailable — admin
    // features should still keep working.
  }
}

function getRecordKey(moduleKey, record) {
  if (!record) {
    return "unknown";
  }

  if (
    record.id !== undefined &&
    record.id !== null
  ) {
    return String(record.id);
  }

  if (moduleKey === "settings") {
    return `setting:${record.setting_key || "unknown"}`;
  }

  if (moduleKey === "seo") {
    return `seo:${record.page_key || "unknown"}`;
  }

  if (moduleKey === "sections") {
    return `section:${record.page_key || "page"}:${record.section_key || "section"}`;
  }

  return JSON.stringify(record);
}

function getRecordTitle(record) {
  return (
    record?.name ||
    record?.title ||
    record?.label ||
    record?.message ||
    record?.setting_key ||
    record?.page_key ||
    `#${record?.id ?? "Record"}`
  );
}

function getRecordSubtitle(record) {
  return (
    record?.description ||
    record?.summary ||
    record?.setting_value ||
    record?.url ||
    record?.category ||
    record?.section_key ||
    "No description available."
  );
}

function recordText(record) {
  try {
    return JSON.stringify(
      record || {}
    ).toLowerCase();
  } catch {
    return "";
  }
}

function isKidsRecord(record) {
  const text = recordText(record);

  return KIDS_KEYWORDS.some(
    (keyword) =>
      text.includes(keyword)
  );
}

function getKidsSafety(record) {
  const text = recordText(record);

  const risky =
    RISKY_KIDS_WORDS.filter(
      (word) =>
        text.includes(word)
    );

  if (risky.length > 0) {
    return {
      label: "Review",
      icon: "⚠️",
      score: 35,
      className:
        "border-red-400/25 bg-red-400/[0.08] text-red-300",
      issues: risky,
    };
  }

  if (isKidsRecord(record)) {
    return {
      label: "Kid Friendly",
      icon: "🧒",
      score: 95,
      className:
        "border-green-400/25 bg-green-400/[0.08] text-green-300",
      issues: [],
    };
  }

  return {
    label: "General",
    icon: "✨",
    score: 75,
    className:
      "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300",
    issues: [],
  };
}

function getPublishState(record) {
  if (
    Object.prototype.hasOwnProperty.call(
      record || {},
      "published"
    )
  ) {
    return record.published
      ? "published"
      : "draft";
  }

  if (
    Object.prototype.hasOwnProperty.call(
      record || {},
      "active"
    )
  ) {
    return record.active
      ? "published"
      : "draft";
  }

  return "neutral";
}

function getAttentionIssues(moduleKey, record) {
  const issues = [];

  const title =
    String(
      getRecordTitle(record) || ""
    ).trim();

  const description =
    String(
      getRecordSubtitle(record) || ""
    ).trim();

  if (
    !title ||
    title.startsWith("#")
  ) {
    issues.push("Missing title");
  }

  if (
    [
      "tools",
      "news",
      "prompts",
      "courses",
      "sections",
      "pricing",
    ].includes(moduleKey) &&
    description.length < 18
  ) {
    issues.push(
      "Short description"
    );
  }

  if (
    [
      "tools",
      "news",
      "prompts",
      "courses",
    ].includes(moduleKey) &&
    !record?.slug
  ) {
    issues.push("Missing slug");
  }

  if (
    moduleKey === "tools" &&
    !record?.website_url
  ) {
    issues.push(
      "Missing website URL"
    );
  }

  if (
    ["news", "courses"].includes(
      moduleKey
    ) &&
    !record?.image_url
  ) {
    issues.push("Missing image");
  }

  if (
    moduleKey === "seo" &&
    !record?.description
  ) {
    issues.push(
      "Missing meta description"
    );
  }

  if (
    moduleKey === "navigation" &&
    !record?.url
  ) {
    issues.push("Missing URL");
  }

  return issues;
}

function getQualityScore(moduleKey, record) {
  const issues =
    getAttentionIssues(
      moduleKey,
      record
    );

  let score =
    Math.max(
      35,
      100 - issues.length * 14
    );

  if (record?.featured) {
    score += 2;
  }

  if (record?.trending) {
    score += 2;
  }

  if (isKidsRecord(record)) {
    score += 1;
  }

  return Math.min(100, score);
}

function formatRelativeTime(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff =
    Date.now() - date.getTime();

  const minutes =
    Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(hours / 24);

  return `${days}d ago`;
}

function escapeCsvValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const stringValue =
    typeof value === "object"
      ? JSON.stringify(value)
      : String(value);

  return `"${stringValue.replace(
    /"/g,
    '""'
  )}"`;
}

function downloadTextFile(
  filename,
  content,
  type = "application/json"
) {
  const blob = new Blob(
    [content],
    { type }
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

function StatusBadge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

function HealthRing({ value = 0, size = 96 }) {
  const safeValue =
    Math.max(
      0,
      Math.min(100, Number(value) || 0)
    );

  return (
    <div
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#22d3ee ${safeValue * 3.6}deg, rgba(255,255,255,.08) 0deg)`,
      }}
    >
      <div className="absolute inset-[7px] rounded-full bg-[#090d1a]" />
      <div className="relative text-center">
        <div className="text-xl font-black text-white">
          {safeValue}%
        </div>
        <div className="text-[9px] font-bold uppercase tracking-wide text-gray-500">
          Health
        </div>
      </div>
    </div>
  );
}

function SparkBars({ values = [] }) {
  const safe =
    values.length > 0
      ? values
      : [4, 6, 3, 8, 5, 9, 7];

  const max =
    Math.max(...safe, 1);

  return (
    <div className="flex h-16 items-end gap-1.5">
      {safe.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className="min-w-0 flex-1 rounded-t-md bg-gradient-to-t from-cyan-500/30 via-blue-400/60 to-purple-300/80 transition-all duration-300 hover:brightness-125"
          style={{
            height: `${Math.max(12, (value / max) * 100)}%`,
          }}
        />
      ))}
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="text-6xl">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-black text-white">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   GENERIC MODAL
========================================================= */

function Modal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md">
      <div className="w-full max-w-[1240px] rounded-[26px] border border-white/10 bg-[#0b1020] p-5 shadow-[0_30px_100px_rgba(0,0,0,.65)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
              Master Admin CMS
            </p>

            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-gray-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeModule, setActiveModule] =
    useState("dashboard");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [counts, setCounts] =
    useState({});

  const [records, setRecords] =
    useState([]);

  const [recordsLoading, setRecordsLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingRecord, setEditingRecord] =
    useState(null);

  const [form, setForm] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  /* =======================================================
     ADVANCED ADMIN STATE
  ======================================================= */

  const [adminEmail, setAdminEmail] =
    useState("");

  const [connectionStatus, setConnectionStatus] =
    useState("checking");

  const [lastRefresh, setLastRefresh] =
    useState(new Date());

  const [moduleSnapshots, setModuleSnapshots] =
    useState({});

  const [insightsLoading, setInsightsLoading] =
    useState(false);

  const [activities, setActivities] =
    useState(() =>
      safeReadJSON(
        ADMIN_ACTIVITY_KEY,
        []
      )
    );

  const [favoriteModules, setFavoriteModules] =
    useState(() =>
      safeReadJSON(
        ADMIN_FAVORITES_KEY,
        ["tools", "news", "courses"]
      )
    );

  const [commandOpen, setCommandOpen] =
    useState(false);

  const [commandQuery, setCommandQuery] =
    useState("");

  const commandInputRef =
    useRef(null);

  const [contentFilter, setContentFilter] =
    useState("all");

  const [sortMode, setSortMode] =
    useState("recent");

  const [viewMode, setViewMode] =
    useState("list");

  const [kidsMode, setKidsMode] =
    useState(false);

  const [selectedKeys, setSelectedKeys] =
    useState([]);

  const [previewRecord, setPreviewRecord] =
    useState(null);

  const [toast, setToast] =
    useState(null);

  const [backupLoading, setBackupLoading] =
    useState(false);

  const [bulkLoading, setBulkLoading] =
    useState(false);

  const currentModule =
    MODULES.find(
      (item) =>
        item.key === activeModule
    );

  /* =========================================================
     ADMIN VERIFY
  ========================================================= */

  useEffect(() => {
    async function init() {
      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!user) {
          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        setAdminEmail(
          user.email || "Admin"
        );

        const {
          data:
            adminResult,
          error:
            adminError,
        } =
          await supabase.rpc(
            "is_admin"
          );

        if (
          adminError ||
          adminResult !== true
        ) {
          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );

          return;
        }

        setConnectionStatus(
          "online"
        );

        await Promise.all([
          loadCounts(),
          loadDashboardInsights(),
        ]);

        addActivity(
          "login",
          "Admin session verified",
          "dashboard",
          false
        );

      } catch (error) {
        console.error(
          error
        );

        setConnectionStatus(
          "offline"
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate]);

  /* =========================================================
     COUNTS
  ========================================================= */

  async function loadCounts() {
    const nextCounts = {};

    for (
      const module of MODULES
    ) {
      try {
        const {
          count,
        } =
          await supabase
            .from(
              module.table
            )
            .select(
              "*",
              {
                count:
                  "exact",
                head:
                  true,
              }
            );

        nextCounts[
          module.key
        ] =
          count || 0;

      } catch {
        nextCounts[
          module.key
        ] = 0;
      }
    }

    setCounts(
      nextCounts
    );
  }

  /* =========================================================
     ADVANCED DASHBOARD DATA
  ========================================================= */

  function showToast(
    text,
    type = "info"
  ) {
    const nextToast = {
      id: Date.now(),
      text,
      type,
    };

    setToast(nextToast);

    window.setTimeout(() => {
      setToast((current) =>
        current?.id === nextToast.id
          ? null
          : current
      );
    }, 3200);
  }

  function addActivity(
    action,
    text,
    moduleKey = activeModule,
    persist = true
  ) {
    const nextActivity = {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
      action,
      text,
      moduleKey,
      time:
        new Date().toISOString(),
    };

    setActivities((current) => {
      const next = [
        nextActivity,
        ...(Array.isArray(current)
          ? current
          : []),
      ].slice(0, 30);

      if (persist) {
        safeWriteJSON(
          ADMIN_ACTIVITY_KEY,
          next
        );
      }

      return next;
    });
  }

  async function loadDashboardInsights() {
    setInsightsLoading(true);

    const nextSnapshots = {};

    for (const module of MODULES) {
      try {
        const {
          data,
          error,
        } = await supabase
          .from(module.table)
          .select("*")
          .limit(250);

        if (error) {
          throw error;
        }

        nextSnapshots[module.key] =
          data || [];
      } catch (error) {
        console.error(
          `Admin insights error (${module.key}):`,
          error
        );

        nextSnapshots[module.key] = [];
      }
    }

    setModuleSnapshots(
      nextSnapshots
    );

    setLastRefresh(
      new Date()
    );

    setInsightsLoading(false);
  }

  async function refreshEverything() {
    try {
      setConnectionStatus(
        "checking"
      );

      const jobs = [
        loadCounts(),
        loadDashboardInsights(),
      ];

      if (
        activeModule !==
          "dashboard" &&
        currentModule
      ) {
        jobs.push(
          loadRecords(
            currentModule
          )
        );
      }

      await Promise.all(jobs);

      setConnectionStatus(
        "online"
      );

      showToast(
        "Dashboard refreshed successfully.",
        "success"
      );

      addActivity(
        "refresh",
        "CMS data refreshed",
        activeModule
      );
    } catch (error) {
      console.error(error);

      setConnectionStatus(
        "offline"
      );

      showToast(
        "Refresh failed. Supabase connection check pannunga.",
        "error"
      );
    }
  }

  function toggleFavoriteModule(
    moduleKey
  ) {
    setFavoriteModules(
      (current) => {
        const exists =
          current.includes(
            moduleKey
          );

        const next = exists
          ? current.filter(
              (key) =>
                key !== moduleKey
            )
          : [
              ...current,
              moduleKey,
            ];

        safeWriteJSON(
          ADMIN_FAVORITES_KEY,
          next
        );

        return next;
      }
    );
  }

  function clearActivity() {
    setActivities([]);

    safeWriteJSON(
      ADMIN_ACTIVITY_KEY,
      []
    );

    showToast(
      "Recent activity cleared.",
      "success"
    );
  }

  function exportCurrentJSON() {
    if (!currentModule) {
      return;
    }

    downloadTextFile(
      `ai-future-tamil-${currentModule.key}-${new Date()
        .toISOString()
        .slice(0, 10)}.json`,
      JSON.stringify(
        records,
        null,
        2
      )
    );

    addActivity(
      "export",
      `${currentModule.title} JSON exported`,
      currentModule.key
    );

    showToast(
      "JSON export ready.",
      "success"
    );
  }

  function exportCurrentCSV() {
    if (
      !currentModule ||
      records.length === 0
    ) {
      showToast(
        "CSV export panna records illa.",
        "info"
      );
      return;
    }

    const headers = [
      ...new Set(
        records.flatMap(
          (record) =>
            Object.keys(record)
        )
      ),
    ];

    const lines = [
      headers
        .map(escapeCsvValue)
        .join(","),
      ...records.map(
        (record) =>
          headers
            .map((header) =>
              escapeCsvValue(
                record[header]
              )
            )
            .join(",")
      ),
    ];

    downloadTextFile(
      `ai-future-tamil-${currentModule.key}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      lines.join("\n"),
      "text/csv;charset=utf-8"
    );

    addActivity(
      "export",
      `${currentModule.title} CSV exported`,
      currentModule.key
    );

    showToast(
      "CSV export ready.",
      "success"
    );
  }

  async function backupAllContent() {
    if (backupLoading) {
      return;
    }

    setBackupLoading(true);

    try {
      const backup = {
        website:
          "AI Future Tamil",
        exported_at:
          new Date().toISOString(),
        modules: {},
      };

      for (const module of MODULES) {
        const {
          data,
          error,
        } = await supabase
          .from(module.table)
          .select("*");

        if (error) {
          throw error;
        }

        backup.modules[module.key] =
          data || [];
      }

      downloadTextFile(
        `ai-future-tamil-full-backup-${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        JSON.stringify(
          backup,
          null,
          2
        )
      );

      addActivity(
        "backup",
        "Full CMS backup exported",
        "dashboard"
      );

      showToast(
        "Full CMS backup downloaded.",
        "success"
      );
    } catch (error) {
      console.error(
        "Backup error:",
        error
      );

      showToast(
        error?.message ||
          "Backup failed.",
        "error"
      );
    } finally {
      setBackupLoading(false);
    }
  }

  function toggleRecordSelection(
    record
  ) {
    const key =
      getRecordKey(
        activeModule,
        record
      );

    setSelectedKeys(
      (current) =>
        current.includes(key)
          ? current.filter(
              (item) =>
                item !== key
            )
          : [...current, key]
    );
  }

  function clearSelection() {
    setSelectedKeys([]);
  }

  function selectVisibleRecords(
    visibleRecords
  ) {
    const keys =
      visibleRecords.map(
        (record) =>
          getRecordKey(
            activeModule,
            record
          )
      );

    const allSelected =
      keys.length > 0 &&
      keys.every((key) =>
        selectedKeys.includes(key)
      );

    setSelectedKeys(
      allSelected
        ? []
        : keys
    );
  }

  async function duplicateRecord(
    record
  ) {
    if (!currentModule) {
      return;
    }

    try {
      const allowedFields =
        MODULE_FIELDS[
          activeModule
        ] || [];

      const payload = {};

      allowedFields.forEach(
        (field) => {
          if (
            Object.prototype.hasOwnProperty.call(
              record,
              field
            )
          ) {
            payload[field] =
              record[field];
          }
        }
      );

      if (payload.name) {
        payload.name =
          `${payload.name} Copy`;
      }

      if (payload.title) {
        payload.title =
          `${payload.title} Copy`;
      }

      if (payload.label) {
        payload.label =
          `${payload.label} Copy`;
      }

      if (payload.slug) {
        payload.slug =
          `${payload.slug}-copy-${String(
            Date.now()
          ).slice(-5)}`;
      }

      if (
        activeModule ===
          "sections" &&
        payload.section_key
      ) {
        payload.section_key =
          `${payload.section_key}-copy-${String(
            Date.now()
          ).slice(-4)}`;
      }

      if (
        activeModule === "seo" &&
        payload.page_key
      ) {
        payload.page_key =
          `${payload.page_key}-copy-${String(
            Date.now()
          ).slice(-4)}`;
      }

      if (
        activeModule ===
          "settings" &&
        payload.setting_key
      ) {
        payload.setting_key =
          `${payload.setting_key}_copy_${String(
            Date.now()
          ).slice(-4)}`;
      }

      const {
        error,
      } = await supabase
        .from(
          currentModule.table
        )
        .insert(payload);

      if (error) {
        throw error;
      }

      await Promise.all([
        loadRecords(
          currentModule
        ),
        loadCounts(),
        loadDashboardInsights(),
      ]);

      addActivity(
        "duplicate",
        `${getRecordTitle(record)} duplicated`,
        activeModule
      );

      showToast(
        "Record duplicated successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Duplicate error:",
        error
      );

      showToast(
        error?.message ||
          "Duplicate failed.",
        "error"
      );
    }
  }

  async function bulkDeleteSelected() {
    if (
      !currentModule ||
      selectedKeys.length === 0 ||
      bulkLoading
    ) {
      return;
    }

    const selectedRecords =
      records.filter(
        (record) =>
          selectedKeys.includes(
            getRecordKey(
              activeModule,
              record
            )
          )
      );

    const ids =
      selectedRecords
        .map((record) =>
          record.id
        )
        .filter(
          (id) =>
            id !== undefined &&
            id !== null
        );

    if (
      ids.length !==
      selectedRecords.length
    ) {
      showToast(
        "Bulk delete id irukkura records-ku mattum support aagum.",
        "info"
      );
      return;
    }

    if (
      !window.confirm(
        `${ids.length} records permanent-aa delete panna sure-aa?`
      )
    ) {
      return;
    }

    setBulkLoading(true);

    try {
      const {
        error,
      } = await supabase
        .from(
          currentModule.table
        )
        .delete()
        .in("id", ids);

      if (error) {
        throw error;
      }

      setSelectedKeys([]);

      await Promise.all([
        loadRecords(
          currentModule
        ),
        loadCounts(),
        loadDashboardInsights(),
      ]);

      addActivity(
        "bulk-delete",
        `${ids.length} ${currentModule.title} records deleted`,
        activeModule
      );

      showToast(
        `${ids.length} records deleted.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Bulk delete error:",
        error
      );

      showToast(
        error?.message ||
          "Bulk delete failed.",
        "error"
      );
    } finally {
      setBulkLoading(false);
    }
  }

  async function bulkToggleState(
    field,
    value
  ) {
    if (
      !currentModule ||
      selectedKeys.length === 0 ||
      bulkLoading
    ) {
      return;
    }

    const selectedRecords =
      records.filter(
        (record) =>
          selectedKeys.includes(
            getRecordKey(
              activeModule,
              record
            )
          )
      );

    const ids =
      selectedRecords
        .filter((record) =>
          Object.prototype.hasOwnProperty.call(
            record,
            field
          )
        )
        .map((record) =>
          record.id
        )
        .filter(
          (id) =>
            id !== undefined &&
            id !== null
        );

    if (ids.length === 0) {
      showToast(
        `Selected records-la ${field} field illa.`,
        "info"
      );
      return;
    }

    setBulkLoading(true);

    try {
      const {
        error,
      } = await supabase
        .from(
          currentModule.table
        )
        .update({
          [field]: value,
        })
        .in("id", ids);

      if (error) {
        throw error;
      }

      await Promise.all([
        loadRecords(
          currentModule
        ),
        loadDashboardInsights(),
      ]);

      addActivity(
        "bulk-update",
        `${ids.length} records ${field}=${String(value)}`,
        activeModule
      );

      showToast(
        `${ids.length} records updated.`,
        "success"
      );
    } catch (error) {
      console.error(
        "Bulk update error:",
        error
      );

      showToast(
        error?.message ||
          "Bulk update failed.",
        "error"
      );
    } finally {
      setBulkLoading(false);
    }
  }

  /* =========================================================
     OPEN MODULE
  ========================================================= */

  async function openModule(
    module
  ) {
    if (!module) {
      return;
    }

    if (
      module.route
    ) {
      navigate(
        module.route
      );

      return;
    }

    setActiveModule(
      module.key
    );

    setSearch("");
    setContentFilter("all");
    setSelectedKeys([]);
    setCommandOpen(false);

    addActivity(
      "open",
      `${module.title} opened`,
      module.key
    );

    await loadRecords(
      module
    );
  }

  /* =========================================================
     LOAD RECORDS
  ========================================================= */

  async function loadRecords(
    module = currentModule
  ) {
    if (!module) return;

    setRecordsLoading(
      true
    );

    setMessage("");

    try {
      let query =
        supabase
          .from(
            module.table
          )
          .select("*");

      if (
        module.table ===
        "pricing_plans"
      ) {
        query =
          query.order(
            "sort_order",
            {
              ascending:
                true,
            }
          );

      } else if (
        module.table ===
          "navigation_items" ||
        module.table ===
          "site_sections"
      ) {
        query =
          query.order(
            "sort_order",
            {
              ascending:
                true,
            }
          );

      } else {
        query =
          query.order(
            "id",
            {
              ascending:
                false,
            }
          );
      }

      const {
        data,
        error,
      } =
        await query;

      if (error) {
        throw error;
      }

      setRecords(
        data || []
      );

    } catch (error) {
      console.error(
        error
      );

      setMessage(
        `❌ ${error.message}`
      );

      setRecords([]);

    } finally {
      setRecordsLoading(
        false
      );
    }
  }

  /* =========================================================
     NEW RECORD
  ========================================================= */

  function newRecord() {
    setEditingRecord(
      null
    );

    const defaults = {};

    switch (
      activeModule
    ) {
      case "tools":
        Object.assign(
          defaults,
          {
            name: "",
            slug: "",
            description:
              "",
            category:
              "AI Chat",
            website_url:
              "",
            logo_url:
              "",
            pricing:
              "Free",
            featured:
              false,
            trending:
              false,
          }
        );
        break;

      case "news":
        Object.assign(
          defaults,
          {
            title: "",
            slug: "",
            summary: "",
            category:
              "AI Update",
            image_url:
              "",
            source_url:
              "",
            featured:
              false,
            trending:
              false,
            published_at:
              toDateTimeLocal(
                new Date()
              ),
          }
        );
        break;

      case "prompts":
        Object.assign(
          defaults,
          {
            title: "",
            slug: "",
            prompt_text:
              "",
            description:
              "",
            category:
              "General",
            image_url:
              "",
            featured:
              false,
            premium:
              false,
            published:
              true,
          }
        );
        break;

      case "pricing":
        Object.assign(
          defaults,
          {
            name: "",
            description:
              "",
            price:
              "Free",
            billing_period:
              "",
            button_text:
              "Get Started",
            button_url:
              "/",
            features:
              "",
            popular:
              false,
            active:
              true,
            sort_order:
              0,
          }
        );
        break;

      case "courses":
        Object.assign(
          defaults,
          {
            title: "",
            slug: "",
            description:
              "",
            category:
              "AI",
            level:
              "Beginner",
            duration:
              "",
            image_url:
              "",
            course_url:
              "",
            featured:
              false,
            published:
              true,
          }
        );
        break;

      case "sections":
        Object.assign(
          defaults,
          {
            page_key:
              "home",
            section_key:
              "",
            title: "",
            subtitle: "",
            description:
              "",
            button_text:
              "",
            button_url:
              "",
            image_url:
              "",
            active:
              true,
            sort_order:
              0,
          }
        );
        break;

      case "navigation":
        Object.assign(
          defaults,
          {
            label: "",
            url: "",
            location:
              "navbar",
            active:
              true,
            sort_order:
              0,
          }
        );
        break;

      case "announcements":
        Object.assign(
          defaults,
          {
            message: "",
            button_text:
              "",
            button_url:
              "",
            active:
              true,
          }
        );
        break;

      case "seo":
        Object.assign(
          defaults,
          {
            page_key:
              "",
            title: "",
            description:
              "",
            keywords:
              "",
            image_url:
              "",
          }
        );
        break;

      case "settings":
        Object.assign(
          defaults,
          {
            setting_key:
              "",
            setting_value:
              "",
          }
        );
        break;

      default:
        break;
    }

    setForm(
      defaults
    );

    setModalOpen(
      true
    );
  }

  /* =========================================================
     EDIT
  ========================================================= */

  function editRecord(
    record
  ) {
    setEditingRecord(
      record
    );

    const copy = {
      ...record,
    };

    if (
      Array.isArray(
        copy.features
      )
    ) {
      copy.features =
        copy.features.join(
          "\n"
        );
    }

    if (
      activeModule === "news" &&
      copy.published_at
    ) {
      copy.published_at =
        toDateTimeLocal(
          copy.published_at
        );
    }

    setForm(copy);

    setModalOpen(
      true
    );
  }

  /* =========================================================
     CHANGE
  ========================================================= */

  function updateField(
    field,
    value
  ) {
    setForm(
      (current) => {
        const next = {
          ...current,
          [field]:
            value,
        };

        if (
          !editingRecord
        ) {
          if (
            field ===
              "name" &&
            activeModule ===
              "tools"
          ) {
            next.slug =
              slugify(
                value
              );
          }

          if (
            field ===
              "title" &&
            [
              "news",
              "prompts",
              "courses",
            ].includes(
              activeModule
            )
          ) {
            next.slug =
              slugify(
                value
              );
          }
        }

        return next;
      }
    );
  }

  /* =========================================================
     SAVE
  ========================================================= */

  function buildPayload() {
    const allowedFields =
      MODULE_FIELDS[
        activeModule
      ] || [];

    const payload = {};

    allowedFields.forEach(
      (field) => {
        if (
          Object.prototype
            .hasOwnProperty.call(
              form,
              field
            )
        ) {
          payload[field] =
            form[field];
        }
      }
    );

    if (
      activeModule ===
      "pricing"
    ) {
      payload.features =
        String(
          form.features || ""
        )
          .split("\n")
          .map((value) =>
            value.trim()
          )
          .filter(Boolean);

      payload.sort_order =
        Number(
          form.sort_order
        ) || 0;
    }

    if (
      activeModule ===
        "sections" ||
      activeModule ===
        "navigation"
    ) {
      payload.sort_order =
        Number(
          form.sort_order
        ) || 0;
    }

    if (
      activeModule ===
        "news" &&
      form.published_at
    ) {
      const publishedDate =
        new Date(
          form.published_at
        );

      if (
        !Number.isNaN(
          publishedDate.getTime()
        )
      ) {
        payload.published_at =
          publishedDate.toISOString();
      }
    }

    return payload;
  }

  function applyIdentity(
    query,
    record
  ) {
    const identity =
      getRecordIdentity(
        activeModule,
        record
      );

    if (
      identity.length === 0
    ) {
      throw new Error(
        "Record identity missing. Reload pannitu try pannunga."
      );
    }

    let nextQuery = query;

    identity.forEach(
      ([field, value]) => {
        nextQuery =
          nextQuery.eq(
            field,
            value
          );
      }
    );

    return nextQuery;
  }

  async function saveRecord(
    event
  ) {
    event.preventDefault();

    if (
      !currentModule ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload =
        buildPayload();

      if (
        Object.keys(
          payload
        ).length === 0
      ) {
        throw new Error(
          "Save panna data illa."
        );
      }

      let savedRecord;

      const wasEditing =
        Boolean(editingRecord);

      if (editingRecord) {
        let updateQuery =
          supabase
            .from(
              currentModule.table
            )
            .update(
              payload
            );

        updateQuery =
          applyIdentity(
            updateQuery,
            editingRecord
          );

        const {
          data,
          error,
        } =
          await updateQuery
            .select("*")
            .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(
            "Update apply aagala. Supabase UPDATE policy / RLS check pannunga."
          );
        }

        savedRecord =
          data;

        setMessage(
          "✅ Successfully updated."
        );
      } else {
        const {
          data,
          error,
        } =
          await supabase
            .from(
              currentModule.table
            )
            .insert(payload)
            .select("*")
            .single();

        if (error) {
          throw error;
        }

        savedRecord =
          data;

        setMessage(
          "✅ Successfully added."
        );
      }

      const savedLabel =
        getRecordTitle(
          savedRecord ||
            editingRecord ||
            form
        );

      setModalOpen(false);
      setEditingRecord(null);
      setForm({});

      await Promise.all([
        loadRecords(
          currentModule
        ),
        loadCounts(),
        loadDashboardInsights(),
      ]);

      addActivity(
        wasEditing
          ? "update"
          : "insert",
        `${savedLabel} ${
          wasEditing
            ? "updated"
            : "added"
        }`,
        activeModule
      );

      showToast(
        wasEditing
          ? "Updated successfully."
          : "Added successfully.",
        "success"
      );

      window.dispatchEvent(
        new CustomEvent(
          "ai-future-data-change",
          {
            detail: {
              module:
                activeModule,
              action:
                editingRecord
                  ? "update"
                  : "insert",
              record:
                savedRecord,
            },
          }
        )
      );

    } catch (error) {
      console.error(
        "CMS save error:",
        error
      );

      setMessage(
        `❌ ${
          error?.message ||
          "Save failed."
        }`
      );

      showToast(
        error?.message ||
          "Save failed.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     DELETE
  ========================================================= */

  async function deleteRecord(
    record
  ) {
    if (
      !currentModule
    ) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Idha permanent-aa delete panna sure-aa?"
      );

    if (!confirmDelete) {
      return;
    }

    setMessage("");

    try {
      let deleteQuery =
        supabase
          .from(
            currentModule.table
          )
          .delete();

      deleteQuery =
        applyIdentity(
          deleteQuery,
          record
        );

      const {
        data,
        error,
      } =
        await deleteQuery
          .select("*");

      if (error) {
        throw error;
      }

      if (
        !Array.isArray(data) ||
        data.length === 0
      ) {
        throw new Error(
          "Delete apply aagala. Supabase DELETE policy / RLS check pannunga."
        );
      }

      setMessage(
        "🗑️ Deleted successfully."
      );

      await Promise.all([
        loadRecords(
          currentModule
        ),
        loadCounts(),
        loadDashboardInsights(),
      ]);

      addActivity(
        "delete",
        `${getRecordTitle(record)} deleted`,
        activeModule
      );

      showToast(
        "Deleted successfully.",
        "success"
      );

      window.dispatchEvent(
        new CustomEvent(
          "ai-future-data-change",
          {
            detail: {
              module:
                activeModule,
              action:
                "delete",
              record,
            },
          }
        )
      );

    } catch (error) {
      console.error(
        "CMS delete error:",
        error
      );

      setMessage(
        `❌ ${
          error?.message ||
          "Delete failed."
        }`
      );

      showToast(
        error?.message ||
          "Delete failed.",
        "error"
      );
    }
  }

  /* =========================================================
     ADVANCED SEARCH / FILTER / ANALYTICS
  ========================================================= */

  const allSnapshotItems =
    useMemo(() => {
      return MODULES.flatMap(
        (module) =>
          (
            moduleSnapshots[
              module.key
            ] || []
          ).map((record) => ({
            module,
            record,
            key:
              `${module.key}:${getRecordKey(
                module.key,
                record
              )}`,
          }))
      );
    }, [moduleSnapshots]);

  const dashboardTotal =
    useMemo(() => {
      return Object.values(
        counts
      ).reduce(
        (sum, value) =>
          sum + (Number(value) || 0),
        0
      );
    }, [counts]);

  const dashboardHealth =
    useMemo(() => {
      if (
        allSnapshotItems.length === 0
      ) {
        return 100;
      }

      const total =
        allSnapshotItems.reduce(
          (sum, item) =>
            sum +
            getQualityScore(
              item.module.key,
              item.record
            ),
          0
        );

      return Math.round(
        total /
          allSnapshotItems.length
      );
    }, [allSnapshotItems]);

  const kidsContentCount =
    useMemo(() => {
      return allSnapshotItems.filter(
        ({ record }) =>
          isKidsRecord(record)
      ).length;
    }, [allSnapshotItems]);

  const attentionItems =
    useMemo(() => {
      return allSnapshotItems
        .map((item) => ({
          ...item,
          issues:
            getAttentionIssues(
              item.module.key,
              item.record
            ),
        }))
        .filter(
          (item) =>
            item.issues.length > 0
        );
    }, [allSnapshotItems]);

  const publishedContentCount =
    useMemo(() => {
      return allSnapshotItems.filter(
        ({ record }) =>
          getPublishState(record) ===
          "published"
      ).length;
    }, [allSnapshotItems]);

  const featuredContentCount =
    useMemo(() => {
      return allSnapshotItems.filter(
        ({ record }) =>
          Boolean(
            record.featured ||
            record.trending ||
            record.popular
          )
      ).length;
    }, [allSnapshotItems]);

  const moduleCountBars =
    useMemo(() => {
      return MODULES.map(
        (module) =>
          Number(
            counts[module.key]
          ) || 0
      );
    }, [counts]);

  const commandResults =
    useMemo(() => {
      const query =
        commandQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return allSnapshotItems
          .slice(0, 12);
      }

      return allSnapshotItems
        .filter(
          ({ module, record }) =>
            module.title
              .toLowerCase()
              .includes(query) ||
            recordText(record)
              .includes(query)
        )
        .slice(0, 18);
    }, [
      allSnapshotItems,
      commandQuery,
    ]);

  const currentModuleRecords =
    useMemo(() => {
      let next = [...records];

      const value =
        search
          .toLowerCase()
          .trim();

      if (value) {
        next = next.filter(
          (record) =>
            recordText(record)
              .includes(value)
        );
      }

      if (kidsMode) {
        next = next.filter(
          (record) =>
            isKidsRecord(record)
        );
      }

      if (
        contentFilter ===
        "published"
      ) {
        next = next.filter(
          (record) =>
            getPublishState(
              record
            ) === "published"
        );
      }

      if (
        contentFilter === "draft"
      ) {
        next = next.filter(
          (record) =>
            getPublishState(
              record
            ) === "draft"
        );
      }

      if (
        contentFilter ===
        "featured"
      ) {
        next = next.filter(
          (record) =>
            Boolean(
              record.featured ||
              record.trending ||
              record.popular
            )
        );
      }

      if (
        contentFilter === "kids"
      ) {
        next = next.filter(
          (record) =>
            isKidsRecord(record)
        );
      }

      if (
        contentFilter ===
        "attention"
      ) {
        next = next.filter(
          (record) =>
            getAttentionIssues(
              activeModule,
              record
            ).length > 0
        );
      }

      next.sort((a, b) => {
        if (sortMode === "title") {
          return getRecordTitle(a)
            .localeCompare(
              getRecordTitle(b)
            );
        }

        if (sortMode === "quality") {
          return (
            getQualityScore(
              activeModule,
              b
            ) -
            getQualityScore(
              activeModule,
              a
            )
          );
        }

        if (sortMode === "oldest") {
          const aTime =
            new Date(
              a.created_at ||
                a.published_at ||
                0
            ).getTime();

          const bTime =
            new Date(
              b.created_at ||
                b.published_at ||
                0
            ).getTime();

          return aTime - bTime;
        }

        const aTime =
          new Date(
            a.updated_at ||
              a.created_at ||
              a.published_at ||
              0
          ).getTime();

        const bTime =
          new Date(
            b.updated_at ||
              b.created_at ||
              b.published_at ||
              0
          ).getTime();

        return bTime - aTime;
      });

      return next;
    }, [
      records,
      search,
      contentFilter,
      sortMode,
      kidsMode,
      activeModule,
    ]);

  const filteredRecords =
    currentModuleRecords;

  const selectedRecords =
    useMemo(() => {
      return records.filter(
        (record) =>
          selectedKeys.includes(
            getRecordKey(
              activeModule,
              record
            )
          )
      );
    }, [
      records,
      selectedKeys,
      activeModule,
    ]);

  const moduleHealth =
    useMemo(() => {
      if (records.length === 0) {
        return 100;
      }

      const total =
        records.reduce(
          (sum, record) =>
            sum +
            getQualityScore(
              activeModule,
              record
            ),
          0
        );

      return Math.round(
        total / records.length
      );
    }, [records, activeModule]);

  const moduleKidsCount =
    useMemo(() => {
      return records.filter(
        (record) =>
          isKidsRecord(record)
      ).length;
    }, [records]);

  const moduleAttentionCount =
    useMemo(() => {
      return records.filter(
        (record) =>
          getAttentionIssues(
            activeModule,
            record
          ).length > 0
      ).length;
    }, [records, activeModule]);

  /* =========================================================
     KEYBOARD COMMANDS
  ========================================================= */

  useEffect(() => {
    function handleKeyboard(
      event
    ) {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();
        setCommandOpen(
          (current) => !current
        );
      }

      if (
        event.key === "Escape"
      ) {
        setCommandOpen(false);
        setPreviewRecord(null);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  useEffect(() => {
    if (
      commandOpen &&
      commandInputRef.current
    ) {
      window.setTimeout(() => {
        commandInputRef.current?.focus();
      }, 50);
    }
  }, [commandOpen]);

  /* =========================================================
     REALTIME ADMIN REFRESH
  ========================================================= */

  useEffect(() => {
    if (
      activeModule ===
        "dashboard" ||
      !currentModule
    ) {
      return undefined;
    }

    const channel =
      supabase
        .channel(
          `advanced-admin-${currentModule.table}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              currentModule.table,
          },
          () => {
            loadRecords(
              currentModule
            );
            loadCounts();
            loadDashboardInsights();
          }
        )
        .subscribe(
          (status) => {
            if (
              status ===
              "SUBSCRIBED"
            ) {
              setConnectionStatus(
                "online"
              );
            }
          }
        );

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [activeModule]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function handleLogout() {
    await supabase.auth.signOut();

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userEmail"
    );

    localStorage.removeItem(
      "userName"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }

  /* =========================================================
     FIELD UI
  ========================================================= */

  function textInput(
    label,
    field,
    options = {}
  ) {
    const {
      textarea = false,
      type = "text",
      placeholder = "",
      required = false,
      wide = false,
    } = options;

    return (
      <div
        className={
          wide
            ? "md:col-span-2 xl:col-span-3"
            : ""
        }
      >
        <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-gray-400">
          {label}
        </label>

        {textarea ? (
          <textarea
            rows="2"
            value={
              form[field] ?? ""
            }
            placeholder={
              placeholder
            }
            required={required}
            onChange={(
              event
            ) =>
              updateField(
                field,
                event.target.value
              )
            }
            className="min-h-[74px] w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50 focus:bg-black/40"
          />
        ) : (
          <input
            type={type}
            value={
              form[field] ?? ""
            }
            placeholder={
              placeholder
            }
            required={required}
            onChange={(
              event
            ) =>
              updateField(
                field,
                event.target.value
              )
            }
            className="h-[44px] w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50 focus:bg-black/40"
          />
        )}
      </div>
    );
  }

  function checkbox(
    label,
    field
  ) {
    return (
      <label className="flex h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
        <input
          type="checkbox"
          checked={Boolean(
            form[field]
          )}
          onChange={(
            event
          ) =>
            updateField(
              field,
              event.target.checked
            )
          }
          className="h-4 w-4 accent-cyan-400"
        />

        <span className="text-sm font-bold text-gray-200">
          {label}
        </span>
      </label>
    );
  }

  /* =========================================================
     FORM BY MODULE
  ========================================================= */

  function renderForm() {
    switch (
      activeModule
    ) {
      case "tools":
        return (
          <>
            {textInput(
              "Tool Name",
              "name"
            )}

            {textInput(
              "Slug",
              "slug"
            )}

            {textInput(
              "Description",
              "description",
              {
                textarea: true,
                wide: true,
              }
            )}

            {textInput(
              "Category",
              "category"
            )}

            {textInput(
              "Website URL",
              "website_url"
            )}

            {textInput(
              "Logo URL",
              "logo_url"
            )}

            {textInput(
              "Pricing",
              "pricing"
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {checkbox(
                "Featured",
                "featured"
              )}

              {checkbox(
                "Trending",
                "trending"
              )}
            </div>
          </>
        );

      case "news":
        return (
          <>
            {textInput(
              "News Title",
              "title",
              {
                required: true,
              }
            )}

            {textInput(
              "Slug",
              "slug",
              {
                required: true,
              }
            )}

            {textInput(
              "Category",
              "category"
            )}

            {textInput(
              "Summary",
              "summary",
              {
                textarea: true,
                wide: true,
              }
            )}

            {textInput(
              "Image URL",
              "image_url"
            )}

            {textInput(
              "Source URL",
              "source_url"
            )}

            {textInput(
              "Published At",
              "published_at",
              {
                type:
                  "datetime-local",
              }
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {checkbox(
                "Featured",
                "featured"
              )}

              {checkbox(
                "Trending",
                "trending"
              )}
            </div>
          </>
        );

      case "prompts":
        return (
          <>
            {textInput(
              "Title",
              "title"
            )}

            {textInput(
              "Slug",
              "slug"
            )}

            {textInput(
              "Prompt",
              "prompt_text",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Description",
              "description",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Category",
              "category"
            )}

            {textInput(
              "Image URL",
              "image_url"
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              {checkbox(
                "Featured",
                "featured"
              )}

              {checkbox(
                "Premium",
                "premium"
              )}

              {checkbox(
                "Published",
                "published"
              )}
            </div>
          </>
        );

      case "pricing":
        return (
          <>
            {textInput(
              "Plan Name",
              "name"
            )}

            {textInput(
              "Description",
              "description",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Price",
              "price"
            )}

            {textInput(
              "Billing Period",
              "billing_period"
            )}

            {textInput(
              "Button Text",
              "button_text"
            )}

            {textInput(
              "Button URL",
              "button_url"
            )}

            {textInput(
              "Features - one per line",
              "features",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Sort Order",
              "sort_order",
              {
                type:
                  "number",
              }
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {checkbox(
                "Popular",
                "popular"
              )}

              {checkbox(
                "Active",
                "active"
              )}
            </div>
          </>
        );

      case "courses":
        return (
          <>
            {textInput(
              "Course Title",
              "title"
            )}

            {textInput(
              "Slug",
              "slug"
            )}

            {textInput(
              "Description",
              "description",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Category",
              "category"
            )}

            {textInput(
              "Level",
              "level"
            )}

            {textInput(
              "Duration",
              "duration"
            )}

            {textInput(
              "Image URL",
              "image_url"
            )}

            {textInput(
              "Course URL",
              "course_url"
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {checkbox(
                "Featured",
                "featured"
              )}

              {checkbox(
                "Published",
                "published"
              )}
            </div>
          </>
        );

      case "sections":
        return (
          <>
            {textInput(
              "Page Key",
              "page_key"
            )}

            {textInput(
              "Section Key",
              "section_key"
            )}

            {textInput(
              "Title",
              "title"
            )}

            {textInput(
              "Subtitle",
              "subtitle"
            )}

            {textInput(
              "Description",
              "description",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Button Text",
              "button_text"
            )}

            {textInput(
              "Button URL",
              "button_url"
            )}

            {textInput(
              "Image URL",
              "image_url"
            )}

            {textInput(
              "Sort Order",
              "sort_order",
              {
                type:
                  "number",
              }
            )}

            {checkbox(
              "Active",
              "active"
            )}
          </>
        );

      case "navigation":
        return (
          <>
            {textInput(
              "Label",
              "label"
            )}

            {textInput(
              "URL",
              "url"
            )}

            {textInput(
              "Location",
              "location"
            )}

            {textInput(
              "Sort Order",
              "sort_order",
              {
                type:
                  "number",
              }
            )}

            {checkbox(
              "Active",
              "active"
            )}
          </>
        );

      case "announcements":
        return (
          <>
            {textInput(
              "Message",
              "message",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Button Text",
              "button_text"
            )}

            {textInput(
              "Button URL",
              "button_url"
            )}

            {checkbox(
              "Active",
              "active"
            )}
          </>
        );

      case "seo":
        return (
          <>
            {textInput(
              "Page Key",
              "page_key"
            )}

            {textInput(
              "SEO Title",
              "title"
            )}

            {textInput(
              "Meta Description",
              "description",
              {
                textarea:
                  true,
              }
            )}

            {textInput(
              "Keywords",
              "keywords"
            )}

            {textInput(
              "Social Image URL",
              "image_url"
            )}
          </>
        );

      case "settings":
        return (
          <>
            {textInput(
              "Setting Key",
              "setting_key"
            )}

            {textInput(
              "Setting Value",
              "setting_value",
              {
                textarea:
                  true,
              }
            )}
          </>
        );

      default:
        return null;
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040712] text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="relative text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] border border-cyan-400/20 bg-cyan-400/[0.06] text-5xl shadow-[0_0_60px_rgba(34,211,238,.12)]">
            👑
          </div>

          <h2 className="mt-6 text-2xl font-black">
            Master Admin CMS
          </h2>

          <p className="mt-2 font-bold text-gray-500">
            Loading your command center...
          </p>

          <div className="mx-auto mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#040712] text-white">
      {/* AMBIENT BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-48 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.055] blur-[120px]" />
        <div className="absolute right-[-180px] top-[18%] h-[560px] w-[560px] rounded-full bg-purple-500/[0.055] blur-[130px]" />
        <div className="absolute bottom-[-220px] left-[35%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1720px] px-4 py-5 sm:px-6 lg:px-8">
        {/* ===================================================
            TOP COMMAND BAR
        =================================================== */}
        <section className="mb-5 overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#080c19]/88 shadow-[0_25px_80px_rgba(0,0,0,.28)] backdrop-blur-2xl">
          <div className="relative p-5 sm:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge className="border-cyan-400/25 bg-cyan-400/[0.07] text-cyan-300">
                    ⚡ AI Future Tamil
                  </StatusBadge>

                  <StatusBadge
                    className={
                      connectionStatus === "online"
                        ? "border-green-400/25 bg-green-400/[0.07] text-green-300"
                        : connectionStatus === "checking"
                          ? "border-yellow-400/25 bg-yellow-400/[0.07] text-yellow-300"
                          : "border-red-400/25 bg-red-400/[0.07] text-red-300"
                    }
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        connectionStatus === "online"
                          ? "bg-green-300"
                          : connectionStatus === "checking"
                            ? "animate-pulse bg-yellow-300"
                            : "bg-red-300"
                      }`}
                    />
                    {connectionStatus === "online"
                      ? "Supabase Live"
                      : connectionStatus === "checking"
                        ? "Checking"
                        : "Offline"}
                  </StatusBadge>

                  <StatusBadge className="border-purple-400/20 bg-purple-400/[0.06] text-purple-300">
                    🧒 Kids Specialized
                  </StatusBadge>
                </div>

                <h1 className="mt-3 bg-gradient-to-r from-white via-cyan-100 to-purple-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl lg:text-[42px]">
                  👑 Master Admin Command Center
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <span>
                    {adminEmail || "Administrator"}
                  </span>
                  <span className="hidden h-4 w-px bg-white/10 sm:block" />
                  <span>
                    Last sync: {formatRelativeTime(lastRefresh)}
                  </span>
                  <span className="hidden h-4 w-px bg-white/10 sm:block" />
                  <span>
                    {dashboardTotal} total records
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/[0.07] px-4 py-3 text-sm font-black text-purple-200 transition hover:-translate-y-0.5 hover:border-purple-300/40 hover:bg-purple-400/[0.12]"
                >
                  🔎 Command Center
                  <span className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] text-gray-500">
                    Ctrl K
                  </span>
                </button>

                <button
                  type="button"
                  onClick={backupAllContent}
                  disabled={backupLoading}
                  className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm font-black text-emerald-300 transition hover:-translate-y-0.5 hover:bg-emerald-400/[0.10] disabled:opacity-50"
                >
                  {backupLoading ? "Backing up..." : "💾 Full Backup"}
                </button>

                <button
                  type="button"
                  onClick={refreshEverything}
                  className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-sm font-black text-cyan-300 transition hover:-translate-y-0.5 hover:bg-cyan-400/[0.10]"
                >
                  🔄 Refresh
                </button>

                <Link
                  to="/"
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-gray-300 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                >
                  🌐 Website
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-black text-red-300 transition hover:-translate-y-0.5 hover:bg-red-400/[0.12]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            MODULE NAVIGATION
        =================================================== */}
        <section className="mb-6 rounded-[24px] border border-white/[0.07] bg-black/20 p-2.5 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => {
                setActiveModule("dashboard");
                setSelectedKeys([]);
                setSearch("");
              }}
              className={`group flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${
                activeModule === "dashboard"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_30px_rgba(34,211,238,.16)]"
                  : "border border-transparent text-gray-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              📊 Dashboard
            </button>

            {MODULES.map((module) => {
              const favorite =
                favoriteModules.includes(module.key);

              return (
                <div
                  key={module.key}
                  className="relative shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => openModule(module)}
                    className={`group flex items-center gap-2 rounded-xl py-2.5 pl-4 pr-9 text-sm font-black transition ${
                      activeModule === module.key
                        ? "bg-white text-black"
                        : "border border-transparent text-gray-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span>{module.icon}</span>
                    <span>{module.title}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] ${
                        activeModule === module.key
                          ? "bg-black/10 text-black/70"
                          : "bg-white/[0.06] text-gray-600"
                      }`}
                    >
                      {counts[module.key] ?? 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Favorite module"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavoriteModule(module.key);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm transition ${
                      favorite
                        ? "text-yellow-300"
                        : "text-gray-700 hover:text-yellow-300"
                    }`}
                  >
                    {favorite ? "★" : "☆"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* MESSAGE */}
        {message && (
          <div className="mb-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] px-5 py-3.5 text-sm font-bold text-cyan-100">
            {message}
          </div>
        )}

        {/* ===================================================
            DASHBOARD
        =================================================== */}
        {activeModule === "dashboard" && (
          <div className="space-y-6">
            {/* HERO ANALYTICS */}
            <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
              <div className="relative overflow-hidden rounded-[32px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/[0.10] via-blue-500/[0.045] to-purple-500/[0.08] p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-purple-500/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-32 left-[20%] h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />

                <div className="relative">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                        ✨ World-Class CMS Intelligence
                      </p>

                      <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                        Build, protect and grow your AI platform from one place.
                      </h2>

                      <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400">
                        Content health, kids-friendly checks, publishing controls, realtime Supabase sync, backup, exports and advanced editing — all inside your admin command center.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => openModule(MODULES[0])}
                          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5"
                        >
                          + Add AI Tool
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setKidsMode(true);
                            openModule(
                              MODULES.find((item) => item.key === "courses")
                            );
                          }}
                          className="rounded-xl border border-green-400/20 bg-green-400/[0.06] px-5 py-3 text-sm font-black text-green-300 transition hover:-translate-y-0.5 hover:bg-green-400/[0.10]"
                        >
                          🧒 Kids Content Lab
                        </button>

                        <button
                          type="button"
                          onClick={() => setCommandOpen(true)}
                          className="rounded-xl border border-purple-400/20 bg-purple-400/[0.06] px-5 py-3 text-sm font-black text-purple-300 transition hover:-translate-y-0.5 hover:bg-purple-400/[0.10]"
                        >
                          ⚡ Quick Command
                        </button>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-6 rounded-[26px] border border-white/[0.08] bg-black/20 p-5 backdrop-blur-xl">
                      <HealthRing value={dashboardHealth} size={116} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Content Health
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          {dashboardHealth >= 90
                            ? "Excellent"
                            : dashboardHealth >= 75
                              ? "Strong"
                              : "Needs Review"}
                        </p>
                        <p className="mt-2 max-w-[170px] text-xs leading-5 text-gray-500">
                          {attentionItems.length} items need attention.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-purple-300">
                      📈 Content Pulse
                    </p>
                    <h3 className="mt-1 text-xl font-black">
                      Database Distribution
                    </h3>
                  </div>
                  <span className="text-xs text-gray-600">
                    {dashboardTotal} records
                  </span>
                </div>

                <div className="mt-6">
                  <SparkBars values={moduleCountBars} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-green-400/10 bg-green-400/[0.04] p-3">
                    <p className="text-xl font-black text-green-300">
                      {publishedContentCount}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-600">Published</p>
                  </div>
                  <div className="rounded-xl border border-purple-400/10 bg-purple-400/[0.04] p-3">
                    <p className="text-xl font-black text-purple-300">
                      {featuredContentCount}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-600">Featured</p>
                  </div>
                  <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3">
                    <p className="text-xl font-black text-cyan-300">
                      {kidsContentCount}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-600">Kids Ready</p>
                  </div>
                </div>
              </div>
            </section>

            {/* KEY METRICS */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[26px] border border-cyan-400/15 bg-cyan-400/[0.045] p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07] text-2xl">📚</div>
                  <StatusBadge className="border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300">LIVE</StatusBadge>
                </div>
                <p className="mt-5 text-4xl font-black">{dashboardTotal}</p>
                <p className="mt-1 font-bold">Total CMS Records</p>
                <p className="mt-2 text-xs text-gray-600">Across {MODULES.length} content modules</p>
              </div>

              <div className="rounded-[26px] border border-green-400/15 bg-green-400/[0.04] p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-green-400/15 bg-green-400/[0.07] text-2xl">🧒</div>
                  <StatusBadge className="border-green-400/15 bg-green-400/[0.05] text-green-300">SAFE LAB</StatusBadge>
                </div>
                <p className="mt-5 text-4xl font-black text-green-300">{kidsContentCount}</p>
                <p className="mt-1 font-bold">Kids-Friendly Signals</p>
                <p className="mt-2 text-xs text-gray-600">Educational, beginner & family content</p>
              </div>

              <div className="rounded-[26px] border border-orange-400/15 bg-orange-400/[0.04] p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-orange-400/15 bg-orange-400/[0.07] text-2xl">🚨</div>
                  <StatusBadge className="border-orange-400/15 bg-orange-400/[0.05] text-orange-300">REVIEW</StatusBadge>
                </div>
                <p className="mt-5 text-4xl font-black text-orange-300">{attentionItems.length}</p>
                <p className="mt-1 font-bold">Needs Attention</p>
                <p className="mt-2 text-xs text-gray-600">Missing URLs, images, metadata or text</p>
              </div>

              <div className="rounded-[26px] border border-purple-400/15 bg-purple-400/[0.04] p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-purple-400/15 bg-purple-400/[0.07] text-2xl">⭐</div>
                  <StatusBadge className="border-purple-400/15 bg-purple-400/[0.05] text-purple-300">ENGAGE</StatusBadge>
                </div>
                <p className="mt-5 text-4xl font-black text-purple-300">{featuredContentCount}</p>
                <p className="mt-1 font-bold">Featured / Trending</p>
                <p className="mt-2 text-xs text-gray-600">High-visibility content signals</p>
              </div>
            </section>

            {/* MODULE CARDS */}
            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    🧩 Content Modules
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Manage Your Entire Platform
                  </h2>
                </div>
                <p className="text-xs text-gray-600">
                  Star modules to keep your favorite workflows highlighted.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[...MODULES]
                  .sort((a, b) => {
                    const aFav = favoriteModules.includes(a.key) ? 1 : 0;
                    const bFav = favoriteModules.includes(b.key) ? 1 : 0;
                    return bFav - aFav;
                  })
                  .map((module) => {
                    const accent = MODULE_ACCENTS[module.key] || MODULE_ACCENTS.settings;
                    const moduleRecords = moduleSnapshots[module.key] || [];
                    const health = moduleRecords.length
                      ? Math.round(
                          moduleRecords.reduce(
                            (sum, record) => sum + getQualityScore(module.key, record),
                            0
                          ) / moduleRecords.length
                        )
                      : 100;
                    const favorite = favoriteModules.includes(module.key);

                    return (
                      <div
                        key={module.key}
                        className={`group relative overflow-hidden rounded-[26px] border ${accent.border} bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.045]`}
                      >
                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.gradient} opacity-70`} />

                        <div className="relative">
                          <div className="flex items-start justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => openModule(module)}
                              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-black/20 text-2xl transition group-hover:scale-105"
                            >
                              {module.icon}
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleFavoriteModule(module.key)}
                              className={`text-xl transition ${favorite ? "text-yellow-300" : "text-gray-700 hover:text-yellow-300"}`}
                            >
                              {favorite ? "★" : "☆"}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => openModule(module)}
                            className="mt-5 block w-full text-left"
                          >
                            <div className="flex items-end justify-between gap-3">
                              <p className="text-3xl font-black">{counts[module.key] ?? 0}</p>
                              <span className={`text-xs font-black ${accent.text}`}>{health}% healthy</span>
                            </div>
                            <h3 className="mt-1 font-black">{module.title}</h3>
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">{module.description}</p>
                          </button>

                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                              style={{ width: `${health}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* KIDS + ATTENTION + ACTIVITY */}
            <section className="grid gap-5 xl:grid-cols-[.9fr_1.1fr_1fr]">
              <div className="relative overflow-hidden rounded-[30px] border border-green-400/15 bg-green-400/[0.035] p-6">
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-green-400/10 blur-[70px]" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-green-300">🧒 Kids Specialization</p>
                      <h3 className="mt-1 text-xl font-black">Safe Learning Lab</h3>
                    </div>
                    <div className="text-4xl">🌈</div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-500">
                    Quickly discover learning, beginner, school and family-friendly content. The safety helper also flags risky keywords for manual review.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-green-400/10 bg-black/20 p-4 text-center">
                      <p className="text-2xl font-black text-green-300">{kidsContentCount}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-600">Friendly Signals</p>
                    </div>
                    <div className="rounded-2xl border border-orange-400/10 bg-black/20 p-4 text-center">
                      <p className="text-2xl font-black text-orange-300">
                        {allSnapshotItems.filter(({ record }) => getKidsSafety(record).label === "Review").length}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-600">Safety Reviews</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setKidsMode(true);
                      openModule(MODULES.find((item) => item.key === "courses"));
                    }}
                    className="mt-5 w-full rounded-xl bg-green-400 px-5 py-3 font-black text-black transition hover:bg-green-300"
                  >
                    Open Kids Content View →
                  </button>
                </div>
              </div>

              <div className="rounded-[30px] border border-orange-400/15 bg-white/[0.025] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-orange-300">🎯 Smart Review</p>
                    <h3 className="mt-1 text-xl font-black">Needs Attention</h3>
                  </div>
                  <StatusBadge className="border-orange-400/20 bg-orange-400/[0.06] text-orange-300">
                    {attentionItems.length} items
                  </StatusBadge>
                </div>

                <div className="mt-5 space-y-3">
                  {attentionItems.length === 0 ? (
                    <div className="rounded-2xl border border-green-400/10 bg-green-400/[0.04] p-5 text-center text-sm text-green-300">
                      ✅ Great! No major content issues detected.
                    </div>
                  ) : (
                    attentionItems.slice(0, 5).map((item) => (
                      <button
                        type="button"
                        key={item.key}
                        onClick={async () => {
                          await openModule(item.module);
                          setSearch(getRecordTitle(item.record));
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/20 p-3.5 text-left transition hover:border-orange-400/20 hover:bg-orange-400/[0.035]"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-400/[0.07] text-lg">
                          {item.module.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black">{getRecordTitle(item.record)}</p>
                          <p className="mt-1 truncate text-[11px] text-orange-300/80">{item.issues.join(" • ")}</p>
                        </div>
                        <span className="text-gray-700">→</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-300">🕘 Admin Timeline</p>
                    <h3 className="mt-1 text-xl font-black">Recent Activity</h3>
                  </div>
                  {activities.length > 0 && (
                    <button
                      type="button"
                      onClick={clearActivity}
                      className="text-xs font-bold text-gray-600 transition hover:text-red-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  {activities.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-600">
                      Admin activity will appear here.
                    </p>
                  ) : (
                    activities.slice(0, 6).map((activity) => {
                      const module = MODULES.find((item) => item.key === activity.moduleKey);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 rounded-2xl border border-white/[0.055] bg-black/15 p-3.5"
                        >
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-base">
                            {module?.icon || "⚡"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-300">{activity.text}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-700">{activity.action} • {formatRelativeTime(activity.time)}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            {/* QUICK WORKFLOWS */}
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-cyan-300">⚡ Quick Actions</p>
                    <h3 className="mt-1 text-xl font-black">One-Tap Workflows</h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["🤖", "Manage AI Tools", "tools", "from-cyan-400 to-blue-500"],
                    ["📰", "Publish AI News", "news", "from-blue-400 to-indigo-500"],
                    ["✨", "Create Prompt", "prompts", "from-purple-400 to-fuchsia-500"],
                    ["🎓", "Manage Courses", "courses", "from-amber-400 to-orange-500"],
                    ["🏠", "Edit Page Content", "sections", "from-pink-400 to-purple-500"],
                    ["🔎", "Improve SEO", "seo", "from-violet-400 to-purple-500"],
                  ].map(([icon, label, key, gradient]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => openModule(MODULES.find((item) => item.key === key))}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-left transition hover:-translate-y-0.5 hover:border-white/[0.14]"
                    >
                      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${gradient}`} />
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{icon}</div>
                        <div>
                          <p className="text-sm font-black">{label}</p>
                          <p className="mt-1 text-[10px] text-gray-600">{counts[key] ?? 0} records</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <p className="text-xs font-black uppercase tracking-wider text-purple-300">🧠 Admin Intelligence</p>
                <h3 className="mt-1 text-xl font-black">What this dashboard watches</h3>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["✅", "CRUD Verification", "Confirms Supabase add, edit and delete results."],
                    ["⚡", "Realtime Sync", "Refreshes module data when database changes."],
                    ["🧒", "Kids Safety Signals", "Flags educational content and risky keywords."],
                    ["🎯", "Content Health", "Detects missing title, slug, image, URL and metadata."],
                    ["💾", "Backup & Export", "JSON full backup plus module JSON / CSV exports."],
                    ["⌨️", "Command Palette", "Ctrl + K to find content across every CMS module."],
                  ].map(([icon, title, text]) => (
                    <div key={title} className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
                      <div className="text-xl">{icon}</div>
                      <p className="mt-2 text-sm font-black">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-600">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================
            MODULE WORKSPACE
        =================================================== */}
        {activeModule !== "dashboard" && currentModule && (
          <div className="space-y-5">
            {/* MODULE HERO */}
            <section
              className={`relative overflow-hidden rounded-[30px] border ${(MODULE_ACCENTS[activeModule] || MODULE_ACCENTS.settings).border} bg-white/[0.025] p-5 sm:p-6`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${(MODULE_ACCENTS[activeModule] || MODULE_ACCENTS.settings).gradient}`}
              />

              <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] border border-white/10 bg-black/25 text-3xl">
                    {currentModule.icon}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black sm:text-3xl">
                        {currentModule.title}
                      </h2>
                      {favoriteModules.includes(activeModule) && (
                        <span className="text-yellow-300">★</span>
                      )}
                    </div>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                      {currentModule.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge className="border-white/10 bg-white/[0.04] text-gray-400">
                        {records.length} records
                      </StatusBadge>
                      <StatusBadge className="border-green-400/15 bg-green-400/[0.05] text-green-300">
                        {moduleHealth}% healthy
                      </StatusBadge>
                      <StatusBadge className="border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300">
                        🧒 {moduleKidsCount} kids signals
                      </StatusBadge>
                      {moduleAttentionCount > 0 && (
                        <StatusBadge className="border-orange-400/15 bg-orange-400/[0.05] text-orange-300">
                          ⚠️ {moduleAttentionCount} review
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleFavoriteModule(activeModule)}
                    className="rounded-xl border border-yellow-400/15 bg-yellow-400/[0.05] px-4 py-3 text-sm font-black text-yellow-300 transition hover:bg-yellow-400/[0.09]"
                  >
                    {favoriteModules.includes(activeModule) ? "★ Favorite" : "☆ Favorite"}
                  </button>

                  <button
                    type="button"
                    onClick={exportCurrentJSON}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-gray-300 transition hover:bg-white/[0.08]"
                  >
                    JSON
                  </button>

                  <button
                    type="button"
                    onClick={exportCurrentCSV}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-gray-300 transition hover:bg-white/[0.08]"
                  >
                    CSV
                  </button>

                  <button
                    type="button"
                    onClick={newRecord}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(34,211,238,.12)] transition hover:-translate-y-0.5"
                  >
                    + Add New
                  </button>
                </div>
              </div>
            </section>

            {/* TOOLBAR */}
            <section className="rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🔎</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={`Search ${currentModule.title}...`}
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-cyan-400/40"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["published", "Published"],
                    ["draft", "Draft"],
                    ["featured", "Featured"],
                    ["kids", "🧒 Kids"],
                    ["attention", "⚠️ Review"],
                  ].map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setContentFilter(key)}
                      className={`rounded-xl px-3.5 py-2.5 text-xs font-black transition ${
                        contentFilter === key
                          ? "bg-white text-black"
                          : "border border-white/[0.08] bg-black/20 text-gray-500 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 border-t border-white/[0.06] pt-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setKidsMode((current) => !current)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-black transition ${
                      kidsMode
                        ? "border border-green-400/30 bg-green-400/[0.09] text-green-300"
                        : "border border-white/[0.08] bg-black/20 text-gray-500"
                    }`}
                  >
                    🧒 Kids Mode {kidsMode ? "ON" : "OFF"}
                  </button>

                  <button
                    type="button"
                    onClick={() => selectVisibleRecords(filteredRecords)}
                    className="rounded-xl border border-white/[0.08] bg-black/20 px-3.5 py-2 text-xs font-black text-gray-500 transition hover:text-white"
                  >
                    ☑ Select Visible
                  </button>

                  {(search || contentFilter !== "all" || kidsMode) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setContentFilter("all");
                        setKidsMode(false);
                      }}
                      className="rounded-xl border border-red-400/10 bg-red-400/[0.04] px-3.5 py-2 text-xs font-black text-red-300"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value)}
                    className="h-9 rounded-xl border border-white/[0.08] bg-[#080c19] px-3 text-xs font-bold text-gray-400 outline-none"
                  >
                    <option value="recent">Newest / Updated</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">Title A–Z</option>
                    <option value="quality">Best Quality</option>
                  </select>

                  <div className="flex rounded-xl border border-white/[0.08] bg-black/20 p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-black ${viewMode === "list" ? "bg-white text-black" : "text-gray-600"}`}
                    >
                      ☰ List
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-black ${viewMode === "grid" ? "bg-white text-black" : "text-gray-600"}`}
                    >
                      ▦ Grid
                    </button>
                  </div>

                  <span className="text-xs font-bold text-gray-700">
                    {filteredRecords.length} results
                  </span>
                </div>
              </div>
            </section>

            {/* BULK ACTION BAR */}
            {selectedKeys.length > 0 && (
              <section className="flex flex-col gap-3 rounded-[22px] border border-cyan-400/20 bg-cyan-400/[0.055] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400 text-sm font-black text-black">
                    {selectedKeys.length}
                  </div>
                  <div>
                    <p className="text-sm font-black">Selected records</p>
                    <p className="text-[11px] text-gray-500">Bulk actions apply only to supported fields.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedRecords.some((record) => Object.prototype.hasOwnProperty.call(record, "published")) && (
                    <>
                      <button type="button" onClick={() => bulkToggleState("published", true)} className="rounded-xl border border-green-400/20 bg-green-400/[0.06] px-3 py-2 text-xs font-black text-green-300">Publish</button>
                      <button type="button" onClick={() => bulkToggleState("published", false)} className="rounded-xl border border-yellow-400/20 bg-yellow-400/[0.06] px-3 py-2 text-xs font-black text-yellow-300">Draft</button>
                    </>
                  )}

                  {selectedRecords.some((record) => Object.prototype.hasOwnProperty.call(record, "active")) && (
                    <>
                      <button type="button" onClick={() => bulkToggleState("active", true)} className="rounded-xl border border-green-400/20 bg-green-400/[0.06] px-3 py-2 text-xs font-black text-green-300">Activate</button>
                      <button type="button" onClick={() => bulkToggleState("active", false)} className="rounded-xl border border-yellow-400/20 bg-yellow-400/[0.06] px-3 py-2 text-xs font-black text-yellow-300">Deactivate</button>
                    </>
                  )}

                  {selectedRecords.some((record) => Object.prototype.hasOwnProperty.call(record, "featured")) && (
                    <button type="button" onClick={() => bulkToggleState("featured", true)} className="rounded-xl border border-purple-400/20 bg-purple-400/[0.06] px-3 py-2 text-xs font-black text-purple-300">⭐ Feature</button>
                  )}

                  <button type="button" onClick={bulkDeleteSelected} disabled={bulkLoading} className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs font-black text-red-300 disabled:opacity-50">
                    {bulkLoading ? "Working..." : "🗑 Delete"}
                  </button>

                  <button type="button" onClick={clearSelection} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-gray-400">Clear</button>
                </div>
              </section>
            )}

            {/* RECORDS */}
            {recordsLoading ? (
              <section className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] py-24 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />
                <p className="mt-4 text-sm font-bold text-gray-500">Loading {currentModule.title}...</p>
              </section>
            ) : filteredRecords.length === 0 ? (
              <EmptyState
                icon={kidsMode ? "🧒" : "📭"}
                title={kidsMode ? "No kids-focused content found" : "No content found"}
                description={kidsMode ? "Try another module or add educational / beginner / family-friendly content." : "Change your filters or create a new record from the Admin CMS."}
                action={
                  <button type="button" onClick={newRecord} className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-black">
                    + Add New Record
                  </button>
                }
              />
            ) : (
              <section
                className={
                  viewMode === "grid"
                    ? "grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
                    : "space-y-3"
                }
              >
                {filteredRecords.map((record) => {
                  const key = getRecordKey(activeModule, record);
                  const selected = selectedKeys.includes(key);
                  const quality = getQualityScore(activeModule, record);
                  const issues = getAttentionIssues(activeModule, record);
                  const publishState = getPublishState(record);
                  const kidsSafety = getKidsSafety(record);

                  return (
                    <article
                      key={key}
                      className={`group relative overflow-hidden rounded-[24px] border p-5 transition-all duration-300 ${
                        selected
                          ? "border-cyan-400/35 bg-cyan-400/[0.055] shadow-[0_0_35px_rgba(34,211,238,.08)]"
                          : "border-white/[0.07] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]"
                      } ${viewMode === "list" ? "lg:flex lg:items-center lg:gap-5" : ""}`}
                    >
                      <div className={`flex min-w-0 items-start gap-4 ${viewMode === "list" ? "lg:flex-1" : ""}`}>
                        <label className="mt-1 flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleRecordSelection(record)}
                            className="h-4 w-4 accent-cyan-400"
                          />
                        </label>

                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/[0.08] bg-black/25 text-xl">
                          {currentModule.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="max-w-full truncate text-base font-black sm:text-lg">
                              {getRecordTitle(record)}
                            </h3>

                            {publishState === "published" && (
                              <StatusBadge className="border-green-400/15 bg-green-400/[0.05] text-green-300">● Live</StatusBadge>
                            )}

                            {publishState === "draft" && (
                              <StatusBadge className="border-yellow-400/15 bg-yellow-400/[0.05] text-yellow-300">○ Draft</StatusBadge>
                            )}

                            {record.featured && (
                              <StatusBadge className="border-purple-400/15 bg-purple-400/[0.05] text-purple-300">⭐ Featured</StatusBadge>
                            )}

                            {record.trending && (
                              <StatusBadge className="border-orange-400/15 bg-orange-400/[0.05] text-orange-300">🔥 Trending</StatusBadge>
                            )}

                            <StatusBadge className={kidsSafety.className}>
                              {kidsSafety.icon} {kidsSafety.label}
                            </StatusBadge>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                            {getRecordSubtitle(record)}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-gray-700">
                            {record.category && <span>🏷 {record.category}</span>}
                            {record.slug && <span>🔗 {record.slug}</span>}
                            {(record.updated_at || record.created_at || record.published_at) && (
                              <span>🕘 {formatRelativeTime(record.updated_at || record.created_at || record.published_at)}</span>
                            )}
                            {issues.length > 0 && (
                              <span className="text-orange-300">⚠️ {issues.length} issue{issues.length > 1 ? "s" : ""}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={`mt-5 flex flex-col gap-3 ${viewMode === "list" ? "lg:mt-0 lg:w-[390px] lg:flex-row lg:items-center lg:justify-end" : ""}`}>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className={`h-full rounded-full ${
                                quality >= 90
                                  ? "bg-green-400"
                                  : quality >= 70
                                    ? "bg-cyan-400"
                                    : "bg-orange-400"
                              }`}
                              style={{ width: `${quality}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-gray-600">{quality}%</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => setPreviewRecord(record)} className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-xs font-black text-gray-400 transition hover:text-white">👁 Preview</button>
                          <button type="button" onClick={() => editRecord(record)} className="rounded-xl border border-blue-400/20 bg-blue-400/[0.06] px-3 py-2 text-xs font-black text-blue-300 transition hover:bg-blue-400/[0.10]">Edit</button>
                          <button type="button" onClick={() => duplicateRecord(record)} className="rounded-xl border border-purple-400/20 bg-purple-400/[0.06] px-3 py-2 text-xs font-black text-purple-300 transition hover:bg-purple-400/[0.10]">⧉</button>
                          <button type="button" onClick={() => deleteRecord(record)} className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-400/[0.10]">Delete</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          EDIT / ADD MODAL — SINGLE FRAME
      ===================================================== */}
      <Modal
        open={modalOpen}
        title={editingRecord ? `Edit ${currentModule?.title || ""}` : `Add ${currentModule?.title || ""}`}
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
          setForm({});
        }}
      >
        <form
          onSubmit={saveRecord}
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        >
          {renderForm()}

          <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-4 sm:flex-row md:col-span-2 xl:col-span-3">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-2.5">
              <span className="text-lg">🧠</span>
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-300">
                  Smart CMS Save
                </p>
                <p className="truncate text-[10px] text-gray-600">
                  Supabase result verify pannitu dhaan success show aagum.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingRecord(null);
                setForm({});
              }}
              className="rounded-xl border border-white/10 px-6 py-3 font-black text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="min-w-[170px] rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-black text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? editingRecord
                  ? "Updating..."
                  : "Adding..."
                : editingRecord
                  ? "✓ Update"
                  : "+ Add"}
            </button>
          </div>
        </form>
      </Modal>

      {/* =====================================================
          PREVIEW PANEL
      ===================================================== */}
      {previewRecord && currentModule && (
        <div className="fixed inset-0 z-[115] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/10 bg-[#090d1a] shadow-[0_30px_100px_rgba(0,0,0,.65)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">👁 Content Preview</p>
                <h3 className="mt-1 text-xl font-black">{getRecordTitle(previewRecord)}</h3>
              </div>
              <button type="button" onClick={() => setPreviewRecord(null)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-gray-500 hover:text-white">×</button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge className={getKidsSafety(previewRecord).className}>
                      {getKidsSafety(previewRecord).icon} {getKidsSafety(previewRecord).label}
                    </StatusBadge>
                    <StatusBadge className="border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300">
                      Quality {getQualityScore(activeModule, previewRecord)}%
                    </StatusBadge>
                  </div>

                  <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-400">
                    {getRecordSubtitle(previewRecord)}
                  </p>
                </div>

                <HealthRing value={getQualityScore(activeModule, previewRecord)} size={92} />
              </div>

              {getAttentionIssues(activeModule, previewRecord).length > 0 && (
                <div className="mt-5 rounded-2xl border border-orange-400/15 bg-orange-400/[0.045] p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-orange-300">⚠️ Content Review</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getAttentionIssues(activeModule, previewRecord).map((issue) => (
                      <span key={issue} className="rounded-lg bg-orange-400/[0.07] px-2.5 py-1.5 text-xs font-bold text-orange-200">{issue}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                <p className="mb-3 text-xs font-black uppercase tracking-wider text-gray-500">Raw CMS Data</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(previewRecord)
                    .filter(([, value]) => value !== null && value !== undefined && value !== "")
                    .slice(0, 16)
                    .map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-gray-700">{key}</p>
                        <p className="mt-1 break-words text-xs text-gray-400">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setPreviewRecord(null)} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-black text-gray-400">Close</button>
                <button
                  type="button"
                  onClick={() => {
                    const record = previewRecord;
                    setPreviewRecord(null);
                    editRecord(record);
                  }}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-black"
                >
                  Edit This Record →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          COMMAND PALETTE
      ===================================================== */}
      {commandOpen && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center bg-black/80 px-4 pt-[8vh] backdrop-blur-lg">
          <div className="w-full max-w-3xl overflow-hidden rounded-[30px] border border-purple-400/20 bg-[#090d1a] shadow-[0_35px_120px_rgba(0,0,0,.7)]">
            <div className="border-b border-white/[0.07] p-4">
              <div className="flex items-center gap-3 rounded-2xl border border-purple-400/15 bg-purple-400/[0.045] px-4">
                <span className="text-xl">🔎</span>
                <input
                  ref={commandInputRef}
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  placeholder="Search every CMS module, record, category, slug..."
                  className="h-14 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-gray-700"
                />
                <button type="button" onClick={() => setCommandOpen(false)} className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-gray-600">ESC</button>
              </div>
            </div>

            <div className="max-h-[62vh] overflow-y-auto p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
                {commandQuery ? `${commandResults.length} search results` : "Quick CMS results"}
              </p>

              <div className="space-y-2">
                {commandResults.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-gray-600">
                    No matching CMS content found.
                  </div>
                ) : (
                  commandResults.map(({ module, record, key }) => (
                    <button
                      type="button"
                      key={key}
                      onClick={async () => {
                        setCommandOpen(false);
                        setCommandQuery("");
                        await openModule(module);
                        setSearch(getRecordTitle(record));
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-white/[0.055] bg-white/[0.02] p-3.5 text-left transition hover:border-purple-400/20 hover:bg-purple-400/[0.04]"
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-black/20 text-xl">{module.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-black">{getRecordTitle(record)}</p>
                          {isKidsRecord(record) && <span className="text-xs">🧒</span>}
                        </div>
                        <p className="mt-1 truncate text-xs text-gray-600">{module.title} • {getRecordSubtitle(record)}</p>
                      </div>
                      <span className="text-gray-700">↵</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-black/15 px-5 py-3 text-[10px] font-bold text-gray-700">
              <span>Ctrl K — open anywhere</span>
              <span>Searches cached admin data across {MODULES.length} modules</span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          TOAST
      ===================================================== */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[160] w-[min(92vw,380px)]">
          <div
            className={`rounded-2xl border p-4 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-2xl ${
              toast.type === "success"
                ? "border-green-400/25 bg-[#07140f]/95 text-green-200"
                : toast.type === "error"
                  ? "border-red-400/25 bg-[#17090c]/95 text-red-200"
                  : "border-cyan-400/25 bg-[#07121a]/95 text-cyan-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl">
                {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">{toast.text}</p>
                <p className="mt-1 text-[10px] text-gray-600">AI Future Tamil Admin CMS</p>
              </div>
              <button type="button" onClick={() => setToast(null)} className="text-gray-600 hover:text-white">×</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
