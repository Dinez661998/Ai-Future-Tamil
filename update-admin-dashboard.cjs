const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "src",
  "pages",
  "AdminDashboard.jsx"
);

const backupPath = path.join(
  __dirname,
  "src",
  "pages",
  "AdminDashboard.backup.jsx"
);

if (!fs.existsSync(filePath)) {
  console.error("❌ AdminDashboard.jsx not found:");
  console.error(filePath);
  process.exit(1);
}

let code = fs.readFileSync(filePath, "utf8");

/* =========================================================
   SAFE HELPERS
========================================================= */

function replaceOnce(search, replacement, label) {
  if (!code.includes(search)) {
    console.error(`\n❌ PATCH FAILED: ${label}`);
    console.error("Required old code block not found.");
    process.exit(1);
  }

  code = code.replace(search, replacement);

  console.log(`✅ ${label}`);
}

function insertBefore(search, addition, label) {
  if (!code.includes(search)) {
    console.error(`\n❌ PATCH FAILED: ${label}`);
    console.error("Insertion point not found.");
    process.exit(1);
  }

  code = code.replace(
    search,
    addition + search
  );

  console.log(`✅ ${label}`);
}

/* =========================================================
   BACKUP
========================================================= */

fs.copyFileSync(
  filePath,
  backupPath
);

console.log("");
console.log("💾 Backup created:");
console.log(backupPath);
console.log("");

/* =========================================================
   1. ADD COURSE LESSONS + COURSE QUIZ MODULES
========================================================= */

replaceOnce(
`  {
    key: "courses",
    title: "Courses",
    icon: "🎓",
    table: "courses",
    route: null,
    description:
      "AI courses and learning content manage pannalam.",
  },
  {
    key: "sections",`,

`  {
    key: "courses",
    title: "Courses",
    icon: "🎓",
    table: "courses",
    route: null,
    description:
      "AI courses and learning content manage pannalam.",
  },
  {
    key: "lessons",
    title: "Course Lessons",
    icon: "📚",
    table: "course_lessons",
    route: null,
    description:
      "Course lessons, content, points and order manage pannalam.",
  },
  {
    key: "quizzes",
    title: "Course Quiz",
    icon: "🧠",
    table: "course_quizzes",
    route: null,
    description:
      "Course quiz questions, options and answers manage pannalam.",
  },
  {
    key: "sections",`,

  "Course Lessons + Course Quiz modules"
);

/* =========================================================
   2. NAVBAR / FOOTER -> SEPARATE FOOTER MODULE
========================================================= */

replaceOnce(
`  {
    key: "navigation",
    title: "Navbar / Footer",
    icon: "🧭",
    table: "navigation_items",
    route: null,
    description:
      "Navbar and footer menu links manage.",
  },
  {
    key: "announcements",`,

`  {
    key: "navigation",
    title: "Navbar",
    icon: "🧭",
    table: "navigation_items",
    route: null,
    description:
      "Navbar and menu links manage.",
  },
  {
    key: "footer",
    title: "Footer",
    icon: "🦶",
    table: "footer_items",
    route: null,
    description:
      "Footer sections, links and icons manage pannalam.",
  },
  {
    key: "announcements",`,

  "Separate Footer module"
);

/* =========================================================
   3. MODULE FIELDS
========================================================= */

replaceOnce(
`  courses: [
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
  sections: [`,

`  courses: [
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
  lessons: [
    "course_slug",
    "lesson_slug",
    "title",
    "duration",
    "content",
    "points",
    "video_url",
    "image_url",
    "active",
    "sort_order",
  ],
  quizzes: [
    "course_slug",
    "question",
    "options",
    "correct_answer",
    "explanation",
    "active",
    "sort_order",
  ],
  sections: [`,

  "Course Lessons / Quiz fields"
);

replaceOnce(
`    "description",
    "button_text",
    "button_url",
    "image_url",
    "active",
    "sort_order",
  ],
  navigation: [`,

`    "description",
    "content",
    "button_text",
    "button_url",
    "image_url",
    "active",
    "sort_order",
  ],
  navigation: [`,

  "Page Content content field"
);

replaceOnce(
`  navigation: [
    "label",
    "url",
    "location",
    "active",
    "sort_order",
  ],
  announcements: [`,

`  navigation: [
    "label",
    "url",
    "location",
    "active",
    "sort_order",
  ],
  footer: [
    "section",
    "label",
    "url",
    "icon",
    "active",
    "sort_order",
  ],
  announcements: [`,

  "Footer fields"
);

replaceOnce(
`  announcements: [
    "message",
    "button_text",
    "button_url",
    "active",
  ],`,

`  announcements: [
    "title",
    "message",
    "button_text",
    "button_url",
    "type",
    "active",
    "start_at",
    "end_at",
  ],`,

  "Announcement fields"
);

replaceOnce(
`  seo: [
    "page_key",
    "title",
    "description",
    "keywords",
    "image_url",
  ],`,

`  seo: [
    "page_key",
    "title",
    "description",
    "keywords",
    "image_url",
    "canonical_url",
    "noindex",
  ],`,

  "SEO fields"
);

replaceOnce(
`  settings: [
    "setting_key",
    "setting_value",
  ],`,

`  settings: [
    "setting_key",
    "setting_value",
    "setting_json",
    "public",
  ],`,

  "Site Settings fields"
);

/* =========================================================
   4. MODULE ACCENTS
========================================================= */

insertBefore(
`  sections: {
    gradient:`,

`  lessons: {
    gradient:
      "from-teal-500/20 via-cyan-500/10 to-transparent",
    border:
      "border-teal-400/20",
    text: "text-teal-300",
  },

  quizzes: {
    gradient:
      "from-fuchsia-500/20 via-purple-500/10 to-transparent",
    border:
      "border-fuchsia-400/20",
    text: "text-fuchsia-300",
  },

`,
  "Lessons / Quiz colors"
);

insertBefore(
`  announcements: {
    gradient:`,

`  footer: {
    gradient:
      "from-indigo-500/20 via-blue-500/10 to-transparent",
    border:
      "border-indigo-400/20",
    text: "text-indigo-300",
  },

`,
  "Footer color"
);

/* =========================================================
   5. SORT ORDER SUPPORT
========================================================= */

replaceOnce(
`      } else if (
        module.table ===
          "navigation_items" ||
        module.table ===
          "site_sections"
      ) {`,

`      } else if (
        [
          "navigation_items",
          "site_sections",
          "footer_items",
          "course_lessons",
          "course_quizzes",
        ].includes(
          module.table
        )
      ) {`,

  "New table sorting"
);

/* =========================================================
   6. NEW RECORD DEFAULTS - LESSONS / QUIZZES
========================================================= */

replaceOnce(
`      case "sections":
        Object.assign(`,

`      case "lessons":
        Object.assign(
          defaults,
          {
            course_slug: "",
            lesson_slug: "",
            title: "",
            duration: "",
            content: "",
            points: "",
            video_url: "",
            image_url: "",
            active: true,
            sort_order: 0,
          }
        );
        break;

      case "quizzes":
        Object.assign(
          defaults,
          {
            course_slug: "",
            question: "",
            options: "",
            correct_answer: 0,
            explanation: "",
            active: true,
            sort_order: 0,
          }
        );
        break;

      case "sections":
        Object.assign(`,

  "Lesson / Quiz defaults"
);

/* =========================================================
   7. PAGE CONTENT DEFAULT
========================================================= */

replaceOnce(
`            subtitle: "",
            description:
              "",
            button_text:`,

`            subtitle: "",
            description:
              "",
            content:
              "",
            button_text:`,

  "Page Content default"
);

/* =========================================================
   8. FOOTER DEFAULTS
========================================================= */

replaceOnce(
`      case "announcements":
        Object.assign(`,

`      case "footer":
        Object.assign(
          defaults,
          {
            section:
              "resources",
            label: "",
            url: "",
            icon: "",
            active:
              true,
            sort_order:
              0,
          }
        );
        break;

      case "announcements":
        Object.assign(`,

  "Footer defaults"
);

/* =========================================================
   9. ANNOUNCEMENT DEFAULTS
========================================================= */

replaceOnce(
`      case "announcements":
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
        break;`,

`      case "announcements":
        Object.assign(
          defaults,
          {
            title: "",
            message: "",
            button_text:
              "",
            button_url:
              "",
            type:
              "info",
            active:
              true,
            start_at:
              "",
            end_at:
              "",
          }
        );
        break;`,

  "Announcement defaults"
);

/* =========================================================
   10. SEO DEFAULTS
========================================================= */

replaceOnce(
`            keywords:
              "",
            image_url:
              "",
          }
        );
        break;

      case "settings":`,

`            keywords:
              "",
            image_url:
              "",
            canonical_url:
              "",
            noindex:
              false,
          }
        );
        break;

      case "settings":`,

  "SEO defaults"
);

/* =========================================================
   11. SITE SETTINGS DEFAULTS
========================================================= */

replaceOnce(
`      case "settings":
        Object.assign(
          defaults,
          {
            setting_key:
              "",
            setting_value:
              "",
          }
        );
        break;`,

`      case "settings":
        Object.assign(
          defaults,
          {
            setting_key:
              "",
            setting_value:
              "",
            setting_json:
              "",
            public:
              true,
          }
        );
        break;`,

  "Site Settings defaults"
);

/* =========================================================
   12. EDIT RECORD JSON CONVERSION
========================================================= */

replaceOnce(
`    if (
      activeModule === "news" &&
      copy.published_at
    ) {`,

`    if (
      Array.isArray(
        copy.points
      )
    ) {
      copy.points =
        copy.points.join(
          "\\n"
        );
    }

    if (
      Array.isArray(
        copy.options
      )
    ) {
      copy.options =
        copy.options.join(
          "\\n"
        );
    }

    if (
      copy.setting_json &&
      typeof copy.setting_json ===
        "object"
    ) {
      copy.setting_json =
        JSON.stringify(
          copy.setting_json,
          null,
          2
        );
    }

    if (
      activeModule ===
        "announcements"
    ) {
      if (copy.start_at) {
        copy.start_at =
          toDateTimeLocal(
            copy.start_at
          );
      }

      if (copy.end_at) {
        copy.end_at =
          toDateTimeLocal(
            copy.end_at
          );
      }
    }

    if (
      activeModule === "news" &&
      copy.published_at
    ) {`,

  "Edit form conversions"
);

/* =========================================================
   13. AUTO LESSON SLUG
========================================================= */

replaceOnce(
`          if (
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
        }`,

`          if (
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

          if (
            field ===
              "title" &&
            activeModule ===
              "lessons"
          ) {
            next.lesson_slug =
              slugify(
                value
              );
          }
        }`,

  "Auto Lesson Slug"
);

/* =========================================================
   14. PAYLOAD SORT SUPPORT
========================================================= */

replaceOnce(
`    if (
      activeModule ===
        "sections" ||
      activeModule ===
        "navigation"
    ) {
      payload.sort_order =
        Number(
          form.sort_order
        ) || 0;
    }`,

`    if (
      [
        "sections",
        "navigation",
        "footer",
        "lessons",
        "quizzes",
      ].includes(
        activeModule
      )
    ) {
      payload.sort_order =
        Number(
          form.sort_order
        ) || 0;
    }`,

  "Payload sort order"
);

/* =========================================================
   15. JSON + QUIZ + SETTINGS + ANNOUNCEMENTS PAYLOAD
========================================================= */

insertBefore(
`    if (
      activeModule ===
        "news" &&
      form.published_at
    ) {`,

`    if (
      activeModule ===
        "lessons"
    ) {
      payload.points =
        String(
          form.points || ""
        )
          .split("\\n")
          .map((value) =>
            value.trim()
          )
          .filter(Boolean);
    }

    if (
      activeModule ===
        "quizzes"
    ) {
      payload.options =
        String(
          form.options || ""
        )
          .split("\\n")
          .map((value) =>
            value.trim()
          )
          .filter(Boolean);

      payload.correct_answer =
        Number(
          form.correct_answer
        ) || 0;
    }

    if (
      activeModule ===
        "settings"
    ) {
      const rawSettingJson =
        String(
          form.setting_json || ""
        ).trim();

      if (rawSettingJson) {
        try {
          payload.setting_json =
            JSON.parse(
              rawSettingJson
            );
        } catch {
          throw new Error(
            "Setting JSON correct JSON format-la kudunga."
          );
        }
      } else {
        payload.setting_json =
          null;
      }
    }

    if (
      activeModule ===
        "announcements"
    ) {
      [
        "start_at",
        "end_at",
      ].forEach(
        (field) => {
          if (form[field]) {
            const date =
              new Date(
                form[field]
              );

            if (
              !Number.isNaN(
                date.getTime()
              )
            ) {
              payload[field] =
                date.toISOString();
            }
          } else {
            payload[field] =
              null;
          }
        }
      );
    }

`,
  "JSON and datetime payload conversions"
);

/* =========================================================
   16. COURSE LESSON FORM + COURSE QUIZ FORM
========================================================= */

const renderFormMarker =
`  function renderForm() {`;

const renderFormIndex =
  code.indexOf(
    renderFormMarker
  );

if (renderFormIndex === -1) {
  console.error(
    "❌ renderForm not found."
  );
  process.exit(1);
}

const sectionsCase =
`      case "sections":
        return (
          <>`;

const sectionsCaseIndex =
  code.indexOf(
    sectionsCase,
    renderFormIndex
  );

if (sectionsCaseIndex === -1) {
  console.error(
    "❌ renderForm sections case not found."
  );
  process.exit(1);
}

const lessonQuizForms =
`      case "lessons":
        return (
          <>
            {textInput(
              "Course Slug",
              "course_slug",
              {
                required:
                  true,
              }
            )}

            {textInput(
              "Lesson Slug",
              "lesson_slug",
              {
                required:
                  true,
              }
            )}

            {textInput(
              "Lesson Title",
              "title",
              {
                required:
                  true,
              }
            )}

            {textInput(
              "Duration",
              "duration"
            )}

            {textInput(
              "Lesson Content",
              "content",
              {
                textarea:
                  true,
                wide:
                  true,
              }
            )}

            {textInput(
              "Learning Points - one per line",
              "points",
              {
                textarea:
                  true,
                wide:
                  true,
              }
            )}

            {textInput(
              "Video URL",
              "video_url"
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

      case "quizzes":
        return (
          <>
            {textInput(
              "Course Slug",
              "course_slug",
              {
                required:
                  true,
              }
            )}

            {textInput(
              "Question",
              "question",
              {
                textarea:
                  true,
                wide:
                  true,
                required:
                  true,
              }
            )}

            {textInput(
              "Options - one per line",
              "options",
              {
                textarea:
                  true,
                wide:
                  true,
              }
            )}

            {textInput(
              "Correct Answer Index (0 = first option)",
              "correct_answer",
              {
                type:
                  "number",
              }
            )}

            {textInput(
              "Explanation",
              "explanation",
              {
                textarea:
                  true,
                wide:
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

            {checkbox(
              "Active",
              "active"
            )}
          </>
        );

`;

code =
  code.slice(
    0,
    sectionsCaseIndex
  ) +
  lessonQuizForms +
  code.slice(
    sectionsCaseIndex
  );

console.log(
  "✅ Lesson / Quiz forms"
);

/* =========================================================
   17. PAGE CONTENT FORM - CONTENT
========================================================= */

const renderFormIndex2 =
  code.indexOf(
    renderFormMarker
  );

const sectionsIndex2 =
  code.indexOf(
    `      case "sections":`,
    renderFormIndex2
  );

const pageButtonMarker =
`            {textInput(
              "Button Text",
              "button_text"
            )}`;

const pageButtonIndex =
  code.indexOf(
    pageButtonMarker,
    sectionsIndex2
  );

if (pageButtonIndex === -1) {
  console.error(
    "❌ Page Content Button Text form not found."
  );
  process.exit(1);
}

const pageContentInput =
`            {textInput(
              "Content",
              "content",
              {
                textarea:
                  true,
                wide:
                  true,
              }
            )}

`;

code =
  code.slice(
    0,
    pageButtonIndex
  ) +
  pageContentInput +
  code.slice(
    pageButtonIndex
  );

console.log(
  "✅ Page Content form"
);

/* =========================================================
   18. FOOTER FORM
========================================================= */

const renderFormIndex3 =
  code.indexOf(
    renderFormMarker
  );

const announcementFormIndex =
  code.indexOf(
    `      case "announcements":
        return (`,
    renderFormIndex3
  );

if (announcementFormIndex === -1) {
  console.error(
    "❌ Announcement form not found."
  );
  process.exit(1);
}

const footerForm =
`      case "footer":
        return (
          <>
            {textInput(
              "Footer Section",
              "section",
              {
                required:
                  true,
              }
            )}

            {textInput(
              "Label",
              "label",
              {
                required:
                  true,
              }
            )}

            {textInput(
              "URL",
              "url"
            )}

            {textInput(
              "Icon",
              "icon"
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

`;

code =
  code.slice(
    0,
    announcementFormIndex
  ) +
  footerForm +
  code.slice(
    announcementFormIndex
  );

console.log(
  "✅ Footer form"
);

/* =========================================================
   19. ANNOUNCEMENT FORM
========================================================= */

const announcementOld =
`      case "announcements":
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
        );`;

const announcementNew =
`      case "announcements":
        return (
          <>
            {textInput(
              "Title",
              "title"
            )}

            {textInput(
              "Message",
              "message",
              {
                textarea:
                  true,
                wide:
                  true,
                required:
                  true,
              }
            )}

            {textInput(
              "Type",
              "type",
              {
                placeholder:
                  "info / success / warning / error",
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
              "Start At",
              "start_at",
              {
                type:
                  "datetime-local",
              }
            )}

            {textInput(
              "End At",
              "end_at",
              {
                type:
                  "datetime-local",
              }
            )}

            {checkbox(
              "Active",
              "active"
            )}
          </>
        );`;

replaceOnce(
  announcementOld,
  announcementNew,
  "Announcement form"
);

/* =========================================================
   20. SEO FORM
========================================================= */

const seoOld =
`      case "seo":
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
        );`;

const seoNew =
`      case "seo":
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
                wide:
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

            {textInput(
              "Canonical URL",
              "canonical_url"
            )}

            {checkbox(
              "No Index",
              "noindex"
            )}
          </>
        );`;

replaceOnce(
  seoOld,
  seoNew,
  "SEO form"
);

/* =========================================================
   21. SITE SETTINGS FORM
========================================================= */

const settingsOld =
`      case "settings":
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
        );`;

const settingsNew =
`      case "settings":
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
                wide:
                  true,
              }
            )}

            {textInput(
              "Setting JSON",
              "setting_json",
              {
                textarea:
                  true,
                wide:
                  true,
                placeholder:
                  "{\\"example\\": true}",
              }
            )}

            {checkbox(
              "Public",
              "public"
            )}
          </>
        );`;

replaceOnce(
  settingsOld,
  settingsNew,
  "Site Settings form"
);

/* =========================================================
   FINAL VALIDATION
========================================================= */

const requiredChecks = [
  `table: "footer_items"`,
  `table: "course_lessons"`,
  `table: "course_quizzes"`,
  `"setting_json"`,
  `"canonical_url"`,
  `"noindex"`,
  `"start_at"`,
  `"end_at"`,
  `"correct_answer"`,
  `"points"`,
  `"options"`,
];

for (const item of requiredChecks) {
  if (!code.includes(item)) {
    console.error(
      `❌ Final validation failed: ${item}`
    );
    process.exit(1);
  }
}

/* =========================================================
   SAVE FINAL FILE
========================================================= */

fs.writeFileSync(
  filePath,
  code,
  "utf8"
);

console.log("");
console.log(
  "=============================================="
);
console.log(
  "🎉 ADMIN DASHBOARD UPDATE SUCCESS!"
);
console.log(
  "=============================================="
);

console.log("");
console.log(
  "✅ Footer CMS added"
);
console.log(
  "✅ Course Lessons CMS added"
);
console.log(
  "✅ Course Quiz CMS added"
);
console.log(
  "✅ Page Content upgraded"
);
console.log(
  "✅ Announcements upgraded"
);
console.log(
  "✅ SEO upgraded"
);
console.log(
  "✅ Site Settings upgraded"
);
console.log(
  "✅ JSON conversion added"
);
console.log(
  "✅ Datetime conversion added"
);
console.log(
  "✅ Old file backup created"
);

console.log("");
console.log(
  "Next command:"
);
console.log(
  "npm run dev"
);
console.log("");