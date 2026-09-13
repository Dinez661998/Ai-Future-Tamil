import {
  useEffect,
  useMemo,
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

        await loadCounts();

      } catch (error) {
        console.error(
          error
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
     OPEN MODULE
  ========================================================= */

  async function openModule(
    module
  ) {
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

      setModalOpen(false);
      setEditingRecord(null);
      setForm({});

      await loadRecords(
        currentModule
      );

      await loadCounts();

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

      await loadRecords(
        currentModule
      );

      await loadCounts();

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
    }
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredRecords =
    useMemo(() => {
      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return records;
      }

      return records.filter(
        (record) =>
          JSON.stringify(
            record
          )
            .toLowerCase()
            .includes(
              value
            )
      );

    }, [
      records,
      search,
    ]);

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

  if (
    loading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="text-5xl">
            👑
          </div>

          <p className="mt-4 font-bold text-gray-400">
            Loading Admin CMS...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">

        {/* TOP */}

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
              AI Future Tamil
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              👑 Master Admin CMS
            </h1>

            <p className="mt-2 text-gray-400">
              Website full content inga irundhu manage pannalam.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              🌐 View Website
            </Link>

            <button
              onClick={
                handleLogout
              }
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/20"
            >
              Logout
            </button>

          </div>
        </div>

        {/* NAV */}

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

          <button
            onClick={() =>
              setActiveModule(
                "dashboard"
              )
            }
            className={`whitespace-nowrap rounded-xl px-5 py-3 font-bold ${
              activeModule ===
              "dashboard"
                ? "bg-cyan-500 text-black"
                : "border border-white/10 bg-white/5 text-gray-300"
            }`}
          >
            📊 Dashboard
          </button>

          {MODULES.map(
            (module) => (
              <button
                key={
                  module.key
                }
                onClick={() =>
                  openModule(
                    module
                  )
                }
                className={`whitespace-nowrap rounded-xl px-5 py-3 font-bold ${
                  activeModule ===
                  module.key
                    ? "bg-cyan-500 text-black"
                    : "border border-white/10 bg-white/5 text-gray-300"
                }`}
              >
                {module.icon}{" "}
                {
                  module.title
                }
              </button>
            )
          )}

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* DASHBOARD */}

        {activeModule ===
          "dashboard" && (
          <>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

              {MODULES.map(
                (module) => (
                  <button
                    key={
                      module.key
                    }
                    onClick={() =>
                      openModule(
                        module
                      )
                    }
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 text-left transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="text-3xl">
                      {
                        module.icon
                      }
                    </div>

                    <div className="mt-4 text-3xl font-black">
                      {
                        counts[
                          module.key
                        ] ?? 0
                      }
                    </div>

                    <div className="mt-1 font-bold">
                      {
                        module.title
                      }
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {
                        module.description
                      }
                    </p>

                  </button>
                )
              )}

            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6">

                <h2 className="text-xl font-black">
                  ⚡ Quick Actions
                </h2>

                <div className="mt-5 grid gap-3">

                  <button
                    onClick={() =>
                      openModule(
                        MODULES[0]
                      )
                    }
                    className="rounded-xl bg-cyan-500 px-5 py-4 text-left font-black text-black"
                  >
                    + Add / Manage AI Tool
                  </button>

                  <button
                    onClick={() =>
                      openModule(
                        MODULES.find(
                          (item) =>
                            item.key ===
                            "news"
                        )
                      )
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left font-bold"
                  >
                    📰 Manage AI News
                  </button>

                  <button
                    onClick={() =>
                      openModule(
                        MODULES.find(
                          (
                            item
                          ) =>
                            item.key ===
                            "sections"
                        )
                      )
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left font-bold"
                  >
                    🏠 Edit Website Content
                  </button>

                </div>

              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6">

                <h2 className="text-xl font-black">
                  ✅ CMS Controls
                </h2>

                <div className="mt-5 space-y-3 text-sm text-gray-300">

                  <p>
                    ✅ Add new content
                  </p>

                  <p>
                    ✅ Edit existing content
                  </p>

                  <p>
                    ✅ Delete content
                  </p>

                  <p>
                    ✅ Publish / unpublish
                  </p>

                  <p>
                    ✅ Featured / trending
                  </p>

                  <p>
                    ✅ Navbar & footer control
                  </p>

                  <p>
                    ✅ SEO settings
                  </p>

                  <p>
                    ✅ Homepage content control
                  </p>

                </div>

              </div>

            </div>

          </>
        )}

        {/* MODULE */}

        {activeModule !==
          "dashboard" &&
          currentModule &&
          !currentModule.route && (
          <>

            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-2xl font-black">
                  {
                    currentModule.icon
                  }{" "}
                  {
                    currentModule.title
                  }
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    currentModule.description
                  }
                </p>
              </div>

              <button
                onClick={
                  newRecord
                }
                className="rounded-xl bg-cyan-500 px-5 py-3 font-black text-black"
              >
                + Add New
              </button>

            </div>

            <div className="mb-5">

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder={`Search ${currentModule.title}...`}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none sm:max-w-md"
              />

            </div>

            {recordsLoading ? (
              <div className="py-20 text-center text-gray-500">
                Loading...
              </div>
            ) : filteredRecords.length ===
              0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-gray-500">
                No content yet.
              </div>
            ) : (
              <div className="space-y-3">

                {filteredRecords.map(
                  (
                    record
                  ) => (
                    <div
                      key={
                        record.id
                      }
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 lg:flex-row lg:items-center"
                    >

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate text-lg font-black">
                          {record.name ||
                            record.title ||
                            record.label ||
                            record.message ||
                            record.setting_key ||
                            record.page_key ||
                            `#${record.id}`}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {record.description ||
                            record.summary ||
                            record.setting_value ||
                            record.url ||
                            record.category ||
                            prettyDate(
                              record.updated_at ||
                                record.created_at
                            )}
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            editRecord(
                              record
                            )
                          }
                          className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 font-bold text-blue-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteRecord(
                              record
                            )
                          }
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 font-bold text-red-300"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </>
        )}

      </div>

      {/* MODAL */}

      <Modal
        open={
          modalOpen
        }
        title={
          editingRecord
            ? `Edit ${currentModule?.title || ""}`
            : `Add ${currentModule?.title || ""}`
        }
        onClose={() => {
          setModalOpen(false);
          setEditingRecord(null);
          setForm({});
        }}
      >

        <form
          onSubmit={
            saveRecord
          }
          className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        >

          {renderForm()}

          <div className="flex gap-3 border-t border-white/[0.08] pt-4 md:col-span-2 xl:col-span-3">

            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingRecord(null);
                setForm({});
              }}
              className="flex-1 rounded-xl border border-white/10 py-3 font-bold text-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-cyan-500 py-3 font-black text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? editingRecord
                  ? "Updating..."
                  : "Adding..."
                : editingRecord
                  ? "Update"
                  : "Add"}
            </button>

          </div>

        </form>

      </Modal>

    </main>
  );
}