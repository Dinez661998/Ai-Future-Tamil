import React, { useEffect, useMemo, useState } from "react";

const FEATURES = [
  {
    id: "career",
    icon: "🎯",
    title: "AI Career Roadmap",
    short: "Build your career path",
  },
  {
    id: "resume",
    icon: "📄",
    title: "Resume & Portfolio",
    short: "Create professional profile",
  },
  {
    id: "interview",
    icon: "🧪",
    title: "AI Interview Simulator",
    short: "Practice interviews",
  },
  {
    id: "share",
    icon: "🔗",
    title: "Smart Share Page",
    short: "Create your public profile",
  },
  {
    id: "challenges",
    icon: "🏆",
    title: "Challenges",
    short: "Complete tasks & earn XP",
  },
  {
    id: "launchpad",
    icon: "🚀",
    title: "Project Launchpad",
    short: "Showcase your projects",
  },
  {
    id: "app-builder",
    icon: "🛠️",
    title: "Mini App Builder",
    short: "Build small apps with AI",
  },
  {
    id: "community",
    icon: "🌐",
    title: "Community Hub",
    short: "Share knowledge",
  },
  {
    id: "trust",
    icon: "🛡️",
    title: "Content Trust Center",
    short: "Review AI content",
  },
];

const DEFAULT_CHALLENGES = [
  {
    id: 1,
    title: "Explore 3 AI Tools",
    description: "Discover three useful AI tools today.",
    xp: 20,
  },
  {
    id: 2,
    title: "Create One AI Prompt",
    description: "Write and test one useful AI prompt.",
    xp: 25,
  },
  {
    id: 3,
    title: "Build Your Career Goal",
    description: "Create your first AI career roadmap.",
    xp: 40,
  },
  {
    id: 4,
    title: "Practice Interview",
    description: "Complete one AI interview question.",
    xp: 50,
  },
  {
    id: 5,
    title: "Launch a Project",
    description: "Publish your first project in Launchpad.",
    xp: 60,
  },
];

function getSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

async function askAI(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      prompt: message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "AI request failed.");
  }

  return (
    data?.reply ||
    data?.text ||
    data?.message ||
    data?.response ||
    data?.result ||
    "AI response received."
  );
}

function SectionHeader({ icon, title, description }) {
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
          {icon}
        </div>

        <div>
          <h2 className="text-2xl font-black text-white md:text-3xl">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-slate-300">
          {label}
        </span>
      )}

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.06]"
      />
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function ResultBox({ title, content }) {
  if (!content) return null;

  return (
    <div className="mt-6 rounded-3xl border border-cyan-400/15 bg-cyan-400/[0.04] p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-black text-white">{title}</h3>

        <button
          onClick={() => navigator.clipboard?.writeText(content)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
        >
          Copy
        </button>
      </div>

      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
        {content}
      </div>
    </div>
  );
}

function LoadingBox() {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      AI is preparing your result...
    </div>
  );
}

/* =========================================================
   1. AI CAREER ROADMAP
========================================================= */

function CareerRoadmap() {
  const [currentSkill, setCurrentSkill] = useState("");
  const [career, setCareer] = useState("");
  const [duration, setDuration] = useState("90");
  const [hours, setHours] = useState("2");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateRoadmap() {
    if (!career.trim()) {
      alert("Target career enter pannu da.");
      return;
    }

    setLoading(true);
    setRoadmap("");

    try {
      const result = await askAI(`
You are an expert career mentor for AI Future Tamil.

Create a practical career roadmap.

Current skills:
${currentSkill || "Beginner"}

Target career:
${career}

Roadmap duration:
${duration} days

Daily available study time:
${hours} hours

Create the answer in simple English.

Include:
1. Career goal summary
2. Skills already useful
3. Skills to learn
4. Phase-by-phase roadmap
5. Weekly learning targets
6. Practice projects
7. Tools/software to learn
8. Portfolio plan
9. Interview preparation
10. Final job-ready checklist

Make it easy for a beginner to follow.
      `);

      setRoadmap(result);
    } catch (error) {
      setRoadmap(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHeader
        icon="🎯"
        title="AI Career Roadmap Builder"
        description="Turn your career goal into a clear step-by-step learning plan."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Current Skills"
          value={currentSkill}
          onChange={setCurrentSkill}
          placeholder="Example: HTML, CSS, Figma"
        />

        <Field
          label="Target Career"
          value={career}
          onChange={setCareer}
          placeholder="Example: UI/UX Designer"
        />

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-300">
            Roadmap Duration
          </span>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#10182d] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
          >
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="180">6 Months</option>
          </select>
        </label>

        <Field
          label="Daily Study Hours"
          value={hours}
          onChange={setHours}
          placeholder="2"
          type="number"
        />
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={generateRoadmap} disabled={loading}>
          {loading ? "Building Roadmap..." : "✨ Generate Career Roadmap"}
        </PrimaryButton>
      </div>

      {loading && <LoadingBox />}

      <ResultBox title="Your Career Roadmap" content={roadmap} />
    </div>
  );
}

/* =========================================================
   2. RESUME + PORTFOLIO
========================================================= */

function ResumePortfolio() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    experience: "",
    skills: "",
    education: "",
    projects: "",
  });

  const [mode, setMode] = useState("resume");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function generate() {
    if (!form.name || !form.role) {
      alert("Name and target role enter pannu da.");
      return;
    }

    setLoading(true);
    setResult("");

    const request =
      mode === "resume"
        ? "Create an ATS-friendly professional resume."
        : "Create professional portfolio website content.";

    try {
      const response = await askAI(`
You are a professional career writer for AI Future Tamil.

${request}

Candidate:

Name: ${form.name}
Target Role: ${form.role}
Experience: ${form.experience || "Fresher"}
Skills: ${form.skills}
Education: ${form.education}
Projects: ${form.projects}

Use professional language.
Do not invent fake companies, qualifications or achievements.

Include:
Professional headline
Professional summary
Skills
Experience section
Education
Projects
Key strengths

If creating portfolio content also include:
Hero introduction
About me
Services
Project descriptions
Contact CTA.
      `);

      setResult(response);
    } catch (error) {
      setResult(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHeader
        icon="📄"
        title="Resume & Portfolio Builder"
        description="Create professional career content using AI."
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <button
          onClick={() => setMode("resume")}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            mode === "resume"
              ? "bg-cyan-400 text-slate-950"
              : "bg-white/5 text-slate-300"
          }`}
        >
          📄 Resume
        </button>

        <button
          onClick={() => setMode("portfolio")}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            mode === "portfolio"
              ? "bg-cyan-400 text-slate-950"
              : "bg-white/5 text-slate-300"
          }`}
        >
          💼 Portfolio
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Full Name"
          value={form.name}
          onChange={(v) => update("name", v)}
          placeholder="Your name"
        />

        <Field
          label="Target Role"
          value={form.role}
          onChange={(v) => update("role", v)}
          placeholder="Example: E-learning Developer"
        />

        <Field
          label="Experience"
          value={form.experience}
          onChange={(v) => update("experience", v)}
          placeholder="Example: 3 years"
        />

        <Field
          label="Skills"
          value={form.skills}
          onChange={(v) => update("skills", v)}
          placeholder="Storyline, Photoshop, React..."
        />

        <Field
          label="Education"
          value={form.education}
          onChange={(v) => update("education", v)}
          placeholder="Degree / College"
        />

        <Field
          label="Projects"
          value={form.projects}
          onChange={(v) => update("projects", v)}
          placeholder="Your important projects"
        />
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={generate} disabled={loading}>
          {loading
            ? "Generating..."
            : mode === "resume"
              ? "✨ Create Resume"
              : "✨ Create Portfolio Content"}
        </PrimaryButton>
      </div>

      {loading && <LoadingBox />}

      <ResultBox
        title={
          mode === "resume"
            ? "Generated Resume"
            : "Generated Portfolio Content"
        }
        content={result}
      />
    </div>
  );
}

/* =========================================================
   3. INTERVIEW SIMULATOR
========================================================= */

function InterviewSimulator() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [questionNo, setQuestionNo] = useState(1);
  const [loading, setLoading] = useState(false);

  async function createQuestion(nextNumber = questionNo) {
    if (!role) {
      alert("Job role enter pannu da.");
      return;
    }

    setLoading(true);
    setQuestion("");
    setFeedback("");
    setAnswer("");

    try {
      const response = await askAI(`
You are conducting a ${level} level interview.

Job role:
${role}

Ask only ONE interview question.
This is question number ${nextNumber}.

Do not give the answer.
Keep the question practical and professional.
      `);

      setQuestion(response);
    } catch (error) {
      setQuestion(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateAnswer() {
    if (!answer.trim()) {
      alert("Answer enter pannu da.");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const response = await askAI(`
You are an expert interview coach.

Role:
${role}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate this answer.

Give:
Score out of 10
What was good
What needs improvement
Corrected professional answer
One quick interview tip

Be supportive but accurate.
      `);

      setFeedback(response);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function nextQuestion() {
    const next = questionNo + 1;
    setQuestionNo(next);
    await createQuestion(next);
  }

  return (
    <div>
      <SectionHeader
        icon="🧪"
        title="AI Interview Simulator"
        description="Practice real interview questions and receive AI feedback."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Job Role"
          value={role}
          onChange={setRole}
          placeholder="Example: React Developer"
        />

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-300">
            Difficulty
          </span>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#10182d] px-4 py-3 text-white outline-none"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
      </div>

      <div className="mt-5">
        <PrimaryButton onClick={() => createQuestion()} disabled={loading}>
          🎤 Start Interview
        </PrimaryButton>
      </div>

      {loading && <LoadingBox />}

      {question && (
        <div className="mt-6 rounded-3xl border border-violet-400/20 bg-violet-400/[0.05] p-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-300">
            Question {questionNo}
          </div>

          <div className="text-lg font-bold leading-8 text-white">
            {question}
          </div>

          <div className="mt-5">
            <TextArea
              label="Your Answer"
              value={answer}
              onChange={setAnswer}
              placeholder="Type your interview answer..."
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryButton onClick={evaluateAnswer} disabled={loading}>
              ✅ Check My Answer
            </PrimaryButton>

            {feedback && (
              <button
                onClick={nextQuestion}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
              >
                Next Question →
              </button>
            )}
          </div>
        </div>
      )}

      <ResultBox title="Interview Feedback" content={feedback} />
    </div>
  );
}

/* =========================================================
   4. SMART SHARE PAGE
========================================================= */

function SmartSharePage() {
  const [profile, setProfile] = useState(() =>
    getSaved("aft-smart-profile", {
      name: "",
      title: "",
      bio: "",
      youtube: "",
      instagram: "",
      portfolio: "",
    }),
  );

  const [saved, setSaved] = useState(false);

  function update(key, value) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function saveProfile() {
    localStorage.setItem("aft-smart-profile", JSON.stringify(profile));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  const username =
    profile.name
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "your-name";

  return (
    <div>
      <SectionHeader
        icon="🔗"
        title="Smart Share Page Builder"
        description="Build one simple creator page for your profile and important links."
      />

      <div className="grid gap-7 lg:grid-cols-[1fr_0.85fr]">
        <div className="space-y-4">
          <Field
            label="Name"
            value={profile.name}
            onChange={(v) => update("name", v)}
            placeholder="Your name"
          />

          <Field
            label="Professional Title"
            value={profile.title}
            onChange={(v) => update("title", v)}
            placeholder="Creator • Designer • Developer"
          />

          <TextArea
            label="Short Bio"
            value={profile.bio}
            onChange={(v) => update("bio", v)}
            placeholder="Tell people about yourself..."
            rows={4}
          />

          <Field
            label="YouTube Link"
            value={profile.youtube}
            onChange={(v) => update("youtube", v)}
            placeholder="https://youtube.com/..."
          />

          <Field
            label="Instagram Link"
            value={profile.instagram}
            onChange={(v) => update("instagram", v)}
            placeholder="https://instagram.com/..."
          />

          <Field
            label="Portfolio / Website"
            value={profile.portfolio}
            onChange={(v) => update("portfolio", v)}
            placeholder="https://..."
          />

          <PrimaryButton onClick={saveProfile}>
            💾 Save Share Page
          </PrimaryButton>

          {saved && (
            <div className="text-sm font-bold text-emerald-400">
              ✓ Profile saved successfully
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 overflow-hidden rounded-[32px] border border-cyan-400/15 bg-gradient-to-b from-[#17213a] to-[#080d1b] p-7 shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 text-3xl font-black text-white">
              {(profile.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="mt-5 text-center">
              <h3 className="text-2xl font-black text-white">
                {profile.name || "Your Name"}
              </h3>

              <p className="mt-1 text-sm font-semibold text-cyan-300">
                {profile.title || "Your professional title"}
              </p>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-400">
                {profile.bio ||
                  "Your short creator introduction will appear here."}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {profile.youtube && (
                <a
                  href={profile.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/5 p-3 text-center font-bold text-white hover:bg-white/10"
                >
                  ▶ YouTube
                </a>
              )}

              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/5 p-3 text-center font-bold text-white hover:bg-white/10"
                >
                  ◎ Instagram
                </a>
              )}

              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-white/5 p-3 text-center font-bold text-white hover:bg-white/10"
                >
                  🌐 Portfolio
                </a>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-3 text-center text-xs text-slate-500">
              ai-future-tamil.vercel.app/u/{username}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   5. CHALLENGES + LEADERBOARD
========================================================= */

function ChallengesLeaderboard() {
  const [completed, setCompleted] = useState(() =>
    getSaved("aft-challenges", []),
  );

  const xp = useMemo(() => {
    return DEFAULT_CHALLENGES.filter((item) =>
      completed.includes(item.id),
    ).reduce((total, item) => total + item.xp, 0);
  }, [completed]);

  useEffect(() => {
    localStorage.setItem("aft-challenges", JSON.stringify(completed));
  }, [completed]);

  function completeChallenge(id) {
    if (completed.includes(id)) return;

    setCompleted((prev) => [...prev, id]);
  }

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  const leaderboard = [
    { name: "AI Explorer", xp: Math.max(320, xp) },
    { name: "Prompt Master", xp: 260 },
    { name: "Creator Pro", xp: 210 },
    { name: "Future Builder", xp: 180 },
    { name: "You", xp },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div>
      <SectionHeader
        icon="🏆"
        title="Challenges + Leaderboard"
        description="Complete useful activities, earn XP and increase your level."
      />

      <div className="mb-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Your XP
          </div>
          <div className="mt-2 text-3xl font-black text-cyan-300">
            {xp} XP
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Level
          </div>
          <div className="mt-2 text-3xl font-black text-violet-300">
            {level}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Completed
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-300">
            {completed.length}/{DEFAULT_CHALLENGES.length}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-bold text-slate-400">
          <span>Level {level}</span>
          <span>{levelProgress}/100 XP</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1fr_0.75fr]">
        <div className="space-y-3">
          {DEFAULT_CHALLENGES.map((challenge) => {
            const done = completed.includes(challenge.id);

            return (
              <div
                key={challenge.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-black text-white">
                    {done ? "✅ " : "⚡ "}
                    {challenge.title}
                  </div>

                  <div className="mt-1 text-sm text-slate-400">
                    {challenge.description}
                  </div>

                  <div className="mt-2 text-xs font-black text-cyan-300">
                    +{challenge.xp} XP
                  </div>
                </div>

                <button
                  disabled={done}
                  onClick={() => completeChallenge(challenge.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold ${
                    done
                      ? "cursor-default bg-emerald-400/10 text-emerald-300"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {done ? "Completed" : "Complete"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <h3 className="mb-5 text-xl font-black text-white">
            🏅 Leaderboard
          </h3>

          <div className="space-y-3">
            {leaderboard.map((user, index) => (
              <div
                key={`${user.name}-${index}`}
                className={`flex items-center justify-between rounded-2xl border p-4 ${
                  user.name === "You"
                    ? "border-cyan-400/30 bg-cyan-400/[0.07]"
                    : "border-white/5 bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 text-center font-black text-slate-500">
                    #{index + 1}
                  </div>

                  <div className="font-bold text-white">{user.name}</div>
                </div>

                <div className="font-black text-cyan-300">
                  {user.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   6. PROJECT LAUNCHPAD
========================================================= */

function ProjectLaunchpad() {
  const [projects, setProjects] = useState(() =>
    getSaved("aft-projects", []),
  );

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    link: "",
  });

  useEffect(() => {
    localStorage.setItem("aft-projects", JSON.stringify(projects));
  }, [projects]);

  function update(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function launchProject() {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Project title and description enter pannu da.");
      return;
    }

    const newProject = {
      id: Date.now(),
      ...form,
      likes: 0,
      date: new Date().toLocaleDateString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    setForm({
      title: "",
      category: "",
      description: "",
      link: "",
    });
  }

  function likeProject(id) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, likes: project.likes + 1 }
          : project,
      ),
    );
  }

  function deleteProject(id) {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id),
    );
  }

  return (
    <div>
      <SectionHeader
        icon="🚀"
        title="AI Project Launchpad"
        description="Publish your projects and build your creator portfolio."
      />

      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Project Name"
            value={form.title}
            onChange={(v) => update("title", v)}
            placeholder="Example: AI Future Tamil"
          />

          <Field
            label="Category"
            value={form.category}
            onChange={(v) => update("category", v)}
            placeholder="AI / Web / Design / Education"
          />

          <div className="md:col-span-2">
            <TextArea
              label="Project Description"
              value={form.description}
              onChange={(v) => update("description", v)}
              placeholder="Explain your project..."
              rows={4}
            />
          </div>

          <div className="md:col-span-2">
            <Field
              label="Project Link"
              value={form.link}
              onChange={(v) => update("link", v)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-5">
          <PrimaryButton onClick={launchProject}>
            🚀 Launch Project
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-white/10 p-10 text-center text-slate-500">
            No projects yet. Launch your first project.
          </div>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <span className="rounded-lg bg-violet-400/10 px-2 py-1 text-xs font-bold text-violet-300">
                  {project.category || "Project"}
                </span>

                <h3 className="mt-3 text-lg font-black text-white">
                  {project.title}
                </h3>
              </div>

              <button
                onClick={() => deleteProject(project.id)}
                className="text-slate-600 hover:text-red-400"
              >
                ×
              </button>
            </div>

            <p className="min-h-[70px] text-sm leading-6 text-slate-400">
              {project.description}
            </p>

            <div className="mt-5 flex items-center justify-between gap-2">
              <button
                onClick={() => likeProject(project.id)}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
              >
                ❤️ {project.likes}
              </button>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-cyan-300 hover:text-cyan-200"
                >
                  Visit Project ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   7. MINI APP BUILDER
========================================================= */

function MiniAppBuilder() {
  const [idea, setIdea] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function buildApp() {
    if (!idea.trim()) {
      alert("App idea enter pannu da.");
      return;
    }

    setLoading(true);
    setCode("");

    try {
      const result = await askAI(`
You are an expert frontend developer.

Build a small working mini web application for this request:

${idea}

Important rules:
Return ONLY complete HTML.
Do not use markdown code fences.
Use embedded CSS and JavaScript inside one HTML file.
Make it responsive.
Use a modern dark premium UI.
Do not use external libraries.
Do not include explanations.
      `);

      const cleaned = result
        .replace(/^```html/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      setCode(cleaned);
    } catch (error) {
      setCode(`
<!doctype html>
<html>
<body style="background:#111827;color:white;font-family:Arial;padding:30px">
<h2>Unable to build app</h2>
<p>${error.message}</p>
</body>
</html>
      `);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHeader
        icon="🛠️"
        title="No-Code Mini App Builder"
        description="Describe a small application and let AI generate a live preview."
      />

      <TextArea
        label="What do you want to build?"
        value={idea}
        onChange={setIdea}
        placeholder="Example: Create a simple EMI calculator with amount, interest and months..."
        rows={5}
      />

      <div className="mt-4">
        <PrimaryButton onClick={buildApp} disabled={loading}>
          {loading ? "Building App..." : "✨ Build Mini App"}
        </PrimaryButton>
      </div>

      {loading && <LoadingBox />}

      {code && !loading && (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-black text-white">Live Preview</h3>

            <button
              onClick={() => navigator.clipboard?.writeText(code)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300"
            >
              Copy HTML
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white">
            <iframe
              title="AI Mini App Preview"
              srcDoc={code}
              sandbox="allow-scripts"
              className="h-[600px] w-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   8. COMMUNITY HUB
========================================================= */

function CommunityHub() {
  const [posts, setPosts] = useState(() =>
    getSaved("aft-community-posts", []),
  );

  const [category, setCategory] = useState("AI Tips");
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "aft-community-posts",
      JSON.stringify(posts),
    );
  }, [posts]);

  function publishPost() {
    if (!text.trim()) {
      alert("Post content enter pannu da.");
      return;
    }

    const post = {
      id: Date.now(),
      category,
      text,
      likes: 0,
      saved: false,
      date: new Date().toLocaleString(),
    };

    setPosts((prev) => [post, ...prev]);
    setText("");
  }

  function like(id) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, likes: post.likes + 1 }
          : post,
      ),
    );
  }

  function toggleSave(id) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, saved: !post.saved }
          : post,
      ),
    );
  }

  return (
    <div>
      <SectionHeader
        icon="🌐"
        title="Community Knowledge Hub"
        description="Share useful AI knowledge, creator tips and learning resources."
      />

      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#10182d] px-4 py-3 text-sm font-bold text-white"
          >
            <option>AI Tips</option>
            <option>Prompts</option>
            <option>Career</option>
            <option>Creator Tips</option>
            <option>Web Development</option>
            <option>Design</option>
          </select>
        </div>

        <TextArea
          value={text}
          onChange={setText}
          placeholder="Share something useful with the community..."
          rows={4}
        />

        <div className="mt-4">
          <PrimaryButton onClick={publishPost}>
            🌐 Publish Post
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        {posts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-slate-500">
            Community is waiting for its first post.
          </div>
        )}

        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-lg bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                {post.category}
              </span>

              <span className="text-xs text-slate-600">
                {post.date}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {post.text}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => like(post.id)}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
              >
                ❤️ {post.likes}
              </button>

              <button
                onClick={() => toggleSave(post.id)}
                className={`rounded-xl px-3 py-2 text-sm font-bold ${
                  post.saved
                    ? "bg-violet-400/15 text-violet-300"
                    : "bg-white/5 text-slate-300"
                }`}
              >
                🔖 {post.saved ? "Saved" : "Save"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   9. CONTENT TRUST CENTER
========================================================= */

function ContentTrustCenter() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyse() {
    if (!content.trim()) {
      alert("Content enter pannu da.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await askAI(`
You are the AI Future Tamil Content Trust Assistant.

Review the content below.

CONTENT:
${content}

Important:
Do NOT claim that something is definitely true or false unless supported by the supplied text.
Do NOT pretend you performed live web verification.
Clearly tell the user that important factual claims should be independently verified with reliable sources.

Analyse:

1. Content summary
2. Claims that may require verification
3. Suspicious or exaggerated wording
4. Bias or promotional wording
5. Internal contradictions
6. Writing clarity
7. Risk level: Low / Medium / High
8. Suggested improvements
9. A safer rewritten version
10. Final verification checklist

Keep it clear and professional.
      `);

      setResult(response);
    } catch (error) {
      setResult(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionHeader
        icon="🛡️"
        title="AI Content Trust Center"
        description="Review content for risky claims, unclear wording and information that needs verification."
      />

      <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-sm leading-6 text-amber-100/80">
        ⚠️ This feature provides AI-assisted review. It is not a
        guaranteed fact-checking service. Important information should
        still be verified using reliable original sources.
      </div>

      <TextArea
        label="Paste Content"
        value={content}
        onChange={setContent}
        placeholder="Paste an article, AI response, social media post or other content..."
        rows={10}
      />

      <div className="mt-4">
        <PrimaryButton onClick={analyse} disabled={loading}>
          {loading ? "Reviewing Content..." : "🛡️ Analyse Content"}
        </PrimaryButton>
      </div>

      {loading && <LoadingBox />}

      <ResultBox title="Content Trust Report" content={result} />
    </div>
  );
}

/* =========================================================
   MAIN NEXT GEN HUB
========================================================= */

export default function NextGenHub() {
  const [active, setActive] = useState("career");

  const activeFeature = FEATURES.find(
    (feature) => feature.id === active,
  );

  function renderFeature() {
    switch (active) {
      case "career":
        return <CareerRoadmap />;

      case "resume":
        return <ResumePortfolio />;

      case "interview":
        return <InterviewSimulator />;

      case "share":
        return <SmartSharePage />;

      case "challenges":
        return <ChallengesLeaderboard />;

      case "launchpad":
        return <ProjectLaunchpad />;

      case "app-builder":
        return <MiniAppBuilder />;

      case "community":
        return <CommunityHub />;

      case "trust":
        return <ContentTrustCenter />;

      default:
        return <CareerRoadmap />;
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent px-6 py-9 shadow-2xl md:px-10 md:py-12">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              AI Future Tamil • Next Generation
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
              One Platform.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                9 Powerful Experiences.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 md:text-lg">
              Build your career, practice interviews, launch projects,
              create apps, grow your profile and learn together.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActive(feature.id)}
                className={`rounded-2xl border p-3 text-center transition ${
                  active === feature.id
                    ? "border-cyan-400/40 bg-cyan-400/[0.09]"
                    : "border-white/5 bg-black/10 hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="text-2xl">{feature.icon}</div>

                <div className="mt-2 hidden text-[10px] font-bold leading-4 text-slate-300 sm:block">
                  {feature.title}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[30px] border border-white/10 bg-white/[0.035] p-3 lg:sticky lg:top-24">
            <div className="mb-3 px-3 pb-2 pt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-600">
              Explore Features
            </div>

            <div className="space-y-1.5">
              {FEATURES.map((feature) => {
                const selected = active === feature.id;

                return (
                  <button
                    key={feature.id}
                    onClick={() => setActive(feature.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      selected
                        ? "bg-gradient-to-r from-cyan-400/15 to-violet-500/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selected
                          ? "bg-cyan-400/10"
                          : "bg-white/[0.04]"
                      }`}
                    >
                      {feature.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-black">
                        {feature.title}
                      </div>

                      <div className="mt-0.5 truncate text-[11px] text-slate-600">
                        {feature.short}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="min-w-0 rounded-[32px] border border-white/10 bg-[#090e1d]/90 p-5 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-5">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                AI Future Tamil
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-bold text-slate-400">
                {activeFeature?.icon} {activeFeature?.title}
              </div>
            </div>

            {renderFeature()}
          </main>
        </section>
      </div>
    </div>
  );
}