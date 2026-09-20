import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

const STORAGE_KEY = "ai-future-tamil-chat-v2";

const MODELS = [
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    short: "Gemini Flash",
    icon: "✦",
    description: "Best overall",
  },
  {
    id: "gemini-3.6-flash-lite",
    name: "Gemini 3.6 Flash-Lite",
    short: "Gemini Lite",
    icon: "⚡",
    description: "Fast & lightweight",
  },
];

const LANGUAGES = [
  { id: "auto", label: "Auto" },
  { id: "tanglish", label: "Tanglish" },
  { id: "tamil", label: "Tamil" },
  { id: "english", label: "English" },
];

const STARTERS = [
  {
    icon: "💻",
    title: "Help me code",
    subtitle: "Build and debug code",
    prompt:
      "Create a simple React component and explain it step by step.",
  },
  {
    icon: "🇮🇳",
    title: "Explain in Tanglish",
    subtitle: "Simple Tamil + English",
    prompt:
      "Artificial Intelligence na enna? Simple Tanglish-la explain pannu.",
  },
  {
    icon: "✨",
    title: "Create a prompt",
    subtitle: "Professional AI prompts",
    prompt:
      "Create a professional AI image prompt for a futuristic Chennai city.",
  },
  {
    icon: "📺",
    title: "YouTube ideas",
    subtitle: "Content inspiration",
    prompt:
      "Give me 10 trending Tamil YouTube video ideas about AI.",
  },
];

function createId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createConversation() {
  return {
    id: createId(),
    title: "New Chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  };
}

function loadSavedState() {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY);

    const old =
      localStorage.getItem(
        "ai-future-tamil-chat-v1"
      );

    const raw = v2 || old;

    if (!raw) {
      const conversation =
        createConversation();

      return {
        conversations: [conversation],
        activeId: conversation.id,
      };
    }

    const parsed = JSON.parse(raw);

    if (
      !Array.isArray(parsed?.conversations) ||
      parsed.conversations.length === 0
    ) {
      throw new Error("Invalid storage");
    }

    return parsed;
  } catch {
    const conversation =
      createConversation();

    return {
      conversations: [conversation],
      activeId: conversation.id,
    };
  }
}

function makeTitle(text) {
  const clean = text
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= 38) {
    return clean;
  }

  return `${clean.slice(0, 38)}...`;
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =========================================================
   LIGHTWEIGHT MARKDOWN
   No external npm package required
========================================================= */

function InlineMarkdown({ text }) {
  const parts = String(text).split(
    /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g
  );

  return (
    <>
      {parts.map((part, index) => {
        if (
          part.startsWith("`") &&
          part.endsWith("`")
        ) {
          return (
            <code
              key={index}
              className="
                rounded-md
                border
                border-white/[0.08]
                bg-white/[0.07]
                px-1.5
                py-0.5
                font-mono
                text-[0.9em]
                text-cyan-200
              "
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        if (
          part.startsWith("**") &&
          part.endsWith("**")
        ) {
          return (
            <strong
              key={index}
              className="font-bold text-white"
            >
              {part.slice(2, -2)}
            </strong>
          );
        }

        return (
          <span key={index}>
            {part}
          </span>
        );
      })}
    </>
  );
}

function CodeBlock({
  language,
  code,
  onCopy,
}) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    await onCopy(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div
      className="
        my-5
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.09]
        bg-[#0d0e12]
        shadow-xl
        shadow-black/20
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/[0.07]
          bg-[#15161b]
          px-4
          py-2.5
        "
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

          <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {language || "code"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="
            rounded-lg
            px-2.5
            py-1.5
            text-xs
            text-gray-400
            transition
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          {copied
            ? "✓ Copied"
            : "📋 Copy code"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <pre
          className="
            min-w-max
            p-5
            text-[13px]
            leading-6
            text-gray-200
          "
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function MarkdownSection({
  text,
  onCopy,
}) {
  const lines = text.split("\n");

  const elements = [];

  let listItems = [];

  function flushList() {
    if (!listItems.length) return;

    elements.push(
      <ul
        key={`list-${elements.length}`}
        className="
          my-3
          list-disc
          space-y-1.5
          pl-6
          text-gray-200
        "
      >
        {listItems.map((item, index) => (
          <li key={index}>
            <InlineMarkdown text={item} />
          </li>
        ))}
      </ul>
    );

    listItems = [];
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    const bullet =
      trimmed.match(/^[-*]\s+(.+)/);

    if (bullet) {
      listItems.push(bullet[1]);
      return;
    }

    flushList();

    if (!trimmed) {
      elements.push(
        <div
          key={`space-${index}`}
          className="h-3"
        />
      );
      return;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="mb-2 mt-5 text-lg font-bold text-white"
        >
          <InlineMarkdown
            text={trimmed.slice(4)}
          />
        </h3>
      );

      return;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="mb-2 mt-6 text-xl font-black text-white"
        >
          <InlineMarkdown
            text={trimmed.slice(3)}
          />
        </h2>
      );

      return;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1
          key={index}
          className="mb-3 mt-6 text-2xl font-black text-white"
        >
          <InlineMarkdown
            text={trimmed.slice(2)}
          />
        </h1>
      );

      return;
    }

    const numbered =
      trimmed.match(/^(\d+)\.\s+(.+)/);

    if (numbered) {
      elements.push(
        <div
          key={index}
          className="my-2 flex gap-3"
        >
          <span
            className="
              flex
              h-6
              min-w-6
              items-center
              justify-center
              rounded-full
              bg-white/[0.07]
              px-1
              text-xs
              font-bold
              text-gray-300
            "
          >
            {numbered[1]}
          </span>

          <p className="min-w-0 flex-1">
            <InlineMarkdown
              text={numbered[2]}
            />
          </p>
        </div>
      );

      return;
    }

    elements.push(
      <p
        key={index}
        className="my-1 leading-7 text-gray-200"
      >
        <InlineMarkdown text={line} />
      </p>
    );
  });

  flushList();

  return (
    <div className="break-words">
      {elements}
    </div>
  );
}

function MessageContent({
  text,
  onCopy,
}) {
  const content = String(text || "");

  const parts = content.split(
    /```([\w#+.-]*)\n?([\s\S]*?)```/g
  );

  const elements = [];

  for (
    let index = 0;
    index < parts.length;
    index += 3
  ) {
    const normalText =
      parts[index];

    if (normalText) {
      elements.push(
        <MarkdownSection
          key={`text-${index}`}
          text={normalText}
          onCopy={onCopy}
        />
      );
    }

    if (
      index + 2 <
      parts.length
    ) {
      elements.push(
        <CodeBlock
          key={`code-${index}`}
          language={
            parts[index + 1]
          }
          code={
            parts[index + 2].replace(
              /\n$/,
              ""
            )
          }
          onCopy={onCopy}
        />
      );
    }
  }

  return <>{elements}</>;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AIChat() {
  const initialState = useMemo(
    () => loadSavedState(),
    []
  );

  const [
    conversations,
    setConversations,
  ] = useState(
    initialState.conversations
  );

  const [
    activeId,
    setActiveId,
  ] = useState(
    initialState.activeId
  );

  const [input, setInput] =
    useState("");

  const [model, setModel] =
    useState(
      "gemini-3.6-flash"
    );

  const [
    language,
    setLanguage,
  ] = useState("auto");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    copiedMessageId,
    setCopiedMessageId,
  ] = useState(null);

  const textareaRef =
    useRef(null);

  const bottomRef =
    useRef(null);

  const abortControllerRef =
    useRef(null);

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeId
    ) || conversations[0];

  const messages =
    activeConversation?.messages ||
    [];

  const selectedModel =
    MODELS.find(
      (item) =>
        item.id === model
    ) || MODELS[0];

  const selectedLanguage =
    LANGUAGES.find(
      (item) =>
        item.id === language
    ) || LANGUAGES[0];

  /* ================= SAVE ================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          conversations,
          activeId,
        })
      );
    } catch {
      // Storage unavailable.
    }
  }, [
    conversations,
    activeId,
  ]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [
    messages,
    loading,
  ]);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function updateConversation(
    conversationId,
    updater
  ) {
    setConversations(
      (current) =>
        current.map(
          (conversation) =>
            conversation.id ===
            conversationId
              ? updater(
                  conversation
                )
              : conversation
        )
    );
  }

  /* ================= NEW CHAT ================= */

  function newChat() {
    if (loading) {
      stopGenerating();
    }

    const conversation =
      createConversation();

    setConversations(
      (current) => [
        conversation,
        ...current,
      ]
    );

    setActiveId(
      conversation.id
    );

    setInput("");
    setError("");
    setSidebarOpen(false);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }

  /* ================= DELETE ================= */

  function deleteChat(
    conversationId
  ) {
    if (
      loading &&
      conversationId === activeId
    ) {
      stopGenerating();
    }

    const remaining =
      conversations.filter(
        (conversation) =>
          conversation.id !==
          conversationId
      );

    if (!remaining.length) {
      const conversation =
        createConversation();

      setConversations([
        conversation,
      ]);

      setActiveId(
        conversation.id
      );

      return;
    }

    setConversations(
      remaining
    );

    if (
      conversationId ===
      activeId
    ) {
      setActiveId(
        remaining[0].id
      );
    }
  }

  /* ================= COPY ================= */

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(
        text
      );

      return true;
    } catch {
      return false;
    }
  }

  async function copyMessage(
    message
  ) {
    const success =
      await copyText(
        message.text
      );

    if (!success) return;

    setCopiedMessageId(
      message.id
    );

    setTimeout(() => {
      setCopiedMessageId(
        null
      );
    }, 1500);
  }

  /* ================= REQUEST ================= */

  async function requestAI({
    conversationId,
    text,
    requestHistory,
    replaceMessages = null,
  }) {
    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            signal:
              controller.signal,

            body:
              JSON.stringify({
                message: text,
                model,
                language,

                history:
                  requestHistory
                    .slice(-12)
                    .map(
                      (message) => ({
                        role:
                          message.role,
                        text:
                          message.text,
                      })
                    ),
              }),
          }
        );

      const raw =
        await response.text();

      let data = {};

      try {
        data = raw
          ? JSON.parse(raw)
          : {};
      } catch {
        throw new Error(
          "AI server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `AI request failed (${response.status}).`
        );
      }

      if (
        !data?.reply ||
        !String(
          data.reply
        ).trim()
      ) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      const assistantMessage = {
        id: createId(),
        role: "assistant",
        text: String(
          data.reply
        ).trim(),
        model:
          data.model ||
          model,
        createdAt:
          Date.now(),
      };

      updateConversation(
        conversationId,
        (conversation) => ({
          ...conversation,

          updatedAt:
            Date.now(),

          messages:
            replaceMessages
              ? [
                  ...replaceMessages,
                  assistantMessage,
                ]
              : [
                  ...conversation.messages,
                  assistantMessage,
                ],
        })
      );
    } catch (requestError) {
      if (
        requestError?.name ===
        "AbortError"
      ) {
        return;
      }

      setError(
        requestError?.message ||
          "Something went wrong."
      );
    } finally {
      if (
        abortControllerRef.current ===
        controller
      ) {
        abortControllerRef.current =
          null;
      }

      setLoading(false);
    }
  }

  /* ================= SEND ================= */

  async function sendMessage(
    customText = null
  ) {
    if (loading) return;

    const text = String(
      customText ?? input
    ).trim();

    if (!text) return;

    const conversationId =
      activeConversation.id;

    const userMessage = {
      id: createId(),
      role: "user",
      text,
      createdAt: Date.now(),
    };

    const previousMessages =
      activeConversation.messages;

    const nextMessages = [
      ...previousMessages,
      userMessage,
    ];

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,

        title:
          conversation.messages
            .length === 0
            ? makeTitle(text)
            : conversation.title,

        updatedAt:
          Date.now(),

        messages:
          nextMessages,
      })
    );

    setInput("");
    setError("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";
    }

    await requestAI({
      conversationId,
      text,
      requestHistory:
        nextMessages,
    });
  }

  /* ================= STOP ================= */

  function stopGenerating() {
    abortControllerRef.current?.abort();

    abortControllerRef.current =
      null;

    setLoading(false);
  }

  /* ================= REGENERATE ================= */

  async function regenerate() {
    if (
      loading ||
      messages.length === 0
    ) {
      return;
    }

    const lastUserIndex = [
      ...messages,
    ]
      .map(
        (message) =>
          message.role
      )
      .lastIndexOf("user");

    if (
      lastUserIndex === -1
    ) {
      return;
    }

    const lastUser =
      messages[lastUserIndex];

    const historyBefore =
      messages.slice(
        0,
        lastUserIndex
      );

    const requestHistory = [
      ...historyBefore,
      lastUser,
    ];

    const conversationId =
      activeConversation.id;

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,
        messages:
          requestHistory,
      })
    );

    await requestAI({
      conversationId,
      text:
        lastUser.text,
      requestHistory,
      replaceMessages:
        requestHistory,
    });
  }

  /* ================= KEYBOARD ================= */

  function handleKeyDown(
    event
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!loading) {
        sendMessage();
      }
    }
  }

  /* ================= INPUT SIZE ================= */

  function handleInputChange(
    event
  ) {
    setInput(
      event.target.value
    );

    event.target.style.height =
      "auto";

    event.target.style.height =
      `${Math.min(
        event.target.scrollHeight,
        200
      )}px`;
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        relative
        flex
        h-[calc(100vh-76px)]
        min-h-[580px]
        overflow-hidden
        bg-[#090a0d]
        text-white
      "
    >
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-[280]
            bg-black/70
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-[76px]
          z-[300]
          flex
          w-[285px]
          flex-col
          border-r
          border-white/[0.07]
          bg-[#111216]
          transition-transform
          duration-300

          lg:static
          lg:z-auto
          lg:h-full
          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* SIDEBAR BRAND */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/[0.06]
            px-4
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-cyan-400/20
                to-purple-500/20
                text-lg
              "
            >
              ✦
            </div>

            <div>
              <p className="text-sm font-black">
                AI Future Tamil
              </p>

              <p className="text-[10px] text-gray-600">
                AI Assistant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              rounded-lg
              p-2
              text-gray-500
              hover:bg-white/[0.05]
              hover:text-white
              lg:hidden
            "
          >
            ×
          </button>
        </div>

        {/* NEW CHAT */}

        <div className="p-3">
          <button
            type="button"
            onClick={newChat}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-white/[0.09]
              bg-white/[0.04]
              px-4
              py-3
              text-sm
              font-bold
              transition
              hover:border-cyan-400/20
              hover:bg-white/[0.07]
            "
          >
            <span className="text-xl">
              ＋
            </span>

            New chat
          </button>
        </div>

        <div
          className="
            px-4
            pb-2
            pt-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-gray-600
          "
        >
          Recent
        </div>

        {/* HISTORY */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-2
            pb-4
          "
        >
          <div className="space-y-1">
            {conversations.map(
              (conversation) => {
                const active =
                  conversation.id ===
                  activeId;

                return (
                  <div
                    key={
                      conversation.id
                    }
                    className={`
                      group
                      flex
                      items-center
                      rounded-xl
                      transition

                      ${
                        active
                          ? "bg-white/[0.075]"
                          : "hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (loading) {
                          stopGenerating();
                        }

                        setActiveId(
                          conversation.id
                        );

                        setSidebarOpen(
                          false
                        );

                        setError("");
                      }}
                      className="
                        min-w-0
                        flex-1
                        truncate
                        px-3
                        py-3
                        text-left
                        text-sm
                        text-gray-300
                      "
                    >
                      {
                        conversation.title
                      }
                    </button>

                    <button
                      type="button"
                      title="Delete chat"
                      onClick={() =>
                        deleteChat(
                          conversation.id
                        )
                      }
                      className="
                        mr-2
                        rounded-lg
                        px-2
                        py-1
                        text-gray-600
                        opacity-0
                        transition
                        hover:bg-red-500/10
                        hover:text-red-400
                        group-hover:opacity-100
                      "
                    >
                      ×
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* SIDEBAR FOOTER */}

        <div
          className="
            border-t
            border-white/[0.07]
            p-3
          "
        >
          <Link
            to="/ai-tools"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-gray-400
              transition
              hover:bg-white/[0.04]
              hover:text-white
            "
          >
            <span>🤖</span>
            Explore AI Tools
          </Link>

          <Link
            to="/"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-gray-400
              transition
              hover:bg-white/[0.04]
              hover:text-white
            "
          >
            <span>←</span>
            Back to Home
          </Link>
        </div>
      </aside>

      {/* =====================================================
          MAIN CHAT
      ===================================================== */}

      <section
        className="
          relative
          flex
          min-w-0
          flex-1
          flex-col
          bg-[#090a0d]
        "
      >
        {/* HEADER */}

        <header
          className="
            flex
            h-[64px]
            shrink-0
            items-center
            justify-between
            border-b
            border-white/[0.06]
            bg-[#090a0d]/95
            px-3
            backdrop-blur-xl
            sm:px-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-gray-400
                transition
                hover:bg-white/[0.06]
                hover:text-white
                lg:hidden
              "
            >
              ☰
            </button>

            <div className="hidden sm:block">
              <p className="text-sm font-black">
                AI Future Tamil
              </p>

              <p className="text-[10px] text-gray-600">
                AI Chat
              </p>
            </div>

            {/* MODEL */}

            <select
              value={model}
              disabled={loading}
              onChange={(event) =>
                setModel(
                  event.target.value
                )
              }
              className="
                max-w-[190px]
                cursor-pointer
                rounded-xl
                border
                border-white/[0.08]
                bg-[#15161b]
                px-3
                py-2
                text-xs
                font-semibold
                text-gray-200
                outline-none
                transition
                hover:border-white/[0.15]
                disabled:opacity-50
                sm:text-sm
              "
            >
              {MODELS.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* LANGUAGE */}

            <select
              value={language}
              disabled={loading}
              onChange={(event) =>
                setLanguage(
                  event.target.value
                )
              }
              className="
                max-w-[105px]
                cursor-pointer
                rounded-xl
                border
                border-white/[0.08]
                bg-[#15161b]
                px-3
                py-2
                text-xs
                font-semibold
                text-gray-300
                outline-none
                disabled:opacity-50
              "
            >
              {LANGUAGES.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={newChat}
              title="New chat"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.03]
                text-lg
                transition
                hover:bg-white/[0.07]
              "
            >
              ＋
            </button>
          </div>
        </header>

        {/* =================================================
            MESSAGES
        ================================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            scroll-smooth
          "
        >
          <div
            className={`
              mx-auto
              w-full
              max-w-[880px]
              px-4
              sm:px-6

              ${
                messages.length === 0
                  ? "flex min-h-full items-center justify-center"
                  : "py-8 sm:py-10"
              }
            `}
          >
            {/* EMPTY SCREEN */}

            {messages.length === 0 ? (
              <div
                className="
                  w-full
                  pb-16
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-gradient-to-br
                    from-cyan-400/[0.08]
                    to-purple-500/[0.08]
                    text-3xl
                    shadow-2xl
                    shadow-cyan-500/5
                  "
                >
                  ✦
                </div>

                <h1
                  className="
                    mt-6
                    text-2xl
                    font-black
                    tracking-tight
                    sm:text-4xl
                  "
                >
                  How can I help you?
                </h1>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-lg
                    text-sm
                    leading-6
                    text-gray-500
                  "
                >
                  Ask questions, write
                  code, create content,
                  learn AI or chat in
                  Tamil, Tanglish and
                  English.
                </p>

                {/* STARTERS */}

                <div
                  className="
                    mx-auto
                    mt-9
                    grid
                    max-w-2xl
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  {STARTERS.map(
                    (starter) => (
                      <button
                        key={
                          starter.title
                        }
                        type="button"
                        onClick={() =>
                          sendMessage(
                            starter.prompt
                          )
                        }
                        className="
                          group
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-white/[0.025]
                          p-4
                          text-left
                          transition
                          hover:-translate-y-0.5
                          hover:border-cyan-400/20
                          hover:bg-white/[0.05]
                        "
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-white/[0.05]
                              text-xl
                            "
                          >
                            {
                              starter.icon
                            }
                          </span>

                          <div>
                            <p className="text-sm font-bold text-gray-100">
                              {
                                starter.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {
                                starter.subtitle
                              }
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              /* CONVERSATION */

              <div className="w-full space-y-9">
                {messages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className={`
                        flex
                        w-full

                        ${
                          message.role ===
                          "user"
                            ? "justify-end"
                            : "justify-start"
                        }
                      `}
                    >
                      {/* USER */}

                      {message.role ===
                      "user" ? (
                        <div
                          className="
                            max-w-[88%]
                            rounded-[22px]
                            rounded-br-md
                            bg-[#202126]
                            px-5
                            py-3.5
                            text-[15px]
                            leading-7
                            text-gray-100
                            sm:max-w-[75%]
                          "
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {
                              message.text
                            }
                          </div>
                        </div>
                      ) : (
                        /* ASSISTANT */

                        <div
                          className="
                            group
                            flex
                            w-full
                            gap-3
                            sm:gap-4
                          "
                        >
                          <div
                            className="
                              mt-0.5
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-cyan-400/20
                              bg-gradient-to-br
                              from-cyan-400/[0.08]
                              to-purple-500/[0.08]
                              text-sm
                            "
                          >
                            ✦
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className="
                                mb-3
                                flex
                                items-center
                                gap-2
                              "
                            >
                              <span className="text-xs font-bold text-gray-400">
                                AI Future
                                Tamil
                              </span>

                              <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] text-gray-600">
                                {
                                  MODELS.find(
                                    (
                                      item
                                    ) =>
                                      item.id ===
                                      message.model
                                  )
                                    ?.short ||
                                  "AI"
                                }
                              </span>
                            </div>

                            <div
                              className="
  text-[17px]
  sm:text-[18px]
  lg:text-[19px]
  leading-8
  text-gray-200
"
                            >
                              <MessageContent
                                text={
                                  message.text
                                }
                                onCopy={
                                  copyText
                                }
                              />
                            </div>

                            {/* ACTIONS */}

                            <div
                              className="
                                mt-4
                                flex
                                flex-wrap
                                items-center
                                gap-1
                                opacity-70
                                transition
                                group-hover:opacity-100
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  copyMessage(
                                    message
                                  )
                                }
                                className="
                                  rounded-lg
                                  px-2.5
                                  py-1.5
                                  text-xs
                                  text-gray-500
                                  transition
                                  hover:bg-white/[0.05]
                                  hover:text-white
                                "
                              >
                                {copiedMessageId ===
                                message.id
                                  ? "✓ Copied"
                                  : "📋 Copy"}
                              </button>

                              {message.id ===
                                messages[
                                  messages.length -
                                    1
                                ]?.id && (
                                <button
                                  type="button"
                                  disabled={
                                    loading
                                  }
                                  onClick={
                                    regenerate
                                  }
                                  className="
                                    rounded-lg
                                    px-2.5
                                    py-1.5
                                    text-xs
                                    text-gray-500
                                    transition
                                    hover:bg-white/[0.05]
                                    hover:text-white
                                    disabled:opacity-30
                                  "
                                >
                                  ↻ Regenerate
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* LOADING */}

                {loading && (
                  <div className="flex gap-4">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-cyan-400/20
                        bg-cyan-400/[0.06]
                      "
                    >
                      ✦
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-bold text-gray-500">
                        AI Future Tamil
                      </p>

                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />

                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:120ms]" />

                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:240ms]" />
                      </div>

                      <button
                        type="button"
                        onClick={
                          stopGenerating
                        }
                        className="
                          mt-4
                          rounded-lg
                          border
                          border-white/[0.08]
                          bg-white/[0.03]
                          px-3
                          py-1.5
                          text-xs
                          text-gray-400
                          transition
                          hover:bg-white/[0.07]
                          hover:text-white
                        "
                      >
                        ■ Stop generating
                      </button>
                    </div>
                  </div>
                )}

                <div
                  ref={bottomRef}
                  className="h-1"
                />
              </div>
            )}
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="
              mx-auto
              w-full
              max-w-[880px]
              px-4
              sm:px-6
            "
          >
            <div
              className="
                mb-2
                flex
                items-start
                justify-between
                gap-4
                rounded-xl
                border
                border-red-400/20
                bg-red-500/[0.06]
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              <span>
                ⚠️ {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="text-red-400"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* =================================================
            COMPOSER
        ================================================= */}

        <div
          className="
            shrink-0
            bg-gradient-to-t
            from-[#090a0d]
            via-[#090a0d]
            to-transparent
            px-3
            pb-3
            pt-2
            sm:px-6
            sm:pb-5
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[880px]
            "
          >
            <div
              className="
                rounded-[26px]
                border
                border-white/[0.11]
                bg-[#18191e]
                p-2
                shadow-2xl
                shadow-black/30
                transition
                focus-within:border-cyan-400/20
                focus-within:shadow-cyan-500/5
              "
            >
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                placeholder="Message AI Future Tamil..."
                onChange={
                  handleInputChange
                }
                onKeyDown={
                  handleKeyDown
                }
                className="
                  max-h-[200px]
                  min-h-[52px]
                  w-full
                  resize-none
                  bg-transparent
                  px-3
                  py-3
                  text-[15px]
                  leading-6
                  text-white
                  outline-none
                  placeholder:text-gray-600
                "
              />

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  px-1
                  pb-1
                "
              >
                {/* STATUS */}

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      truncate
                      rounded-lg
                      bg-white/[0.04]
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-gray-500
                      sm:text-[11px]
                    "
                  >
                    {
                      selectedModel.icon
                    }{" "}
                    {
                      selectedModel.short
                    }
                  </div>

                  <div
                    className="
                      hidden
                      rounded-lg
                      bg-white/[0.04]
                      px-2.5
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-gray-500
                      sm:block
                    "
                  >
                    🌐{" "}
                    {
                      selectedLanguage.label
                    }
                  </div>
                </div>

                {/* SEND / STOP */}

                {loading ? (
                  <button
                    type="button"
                    onClick={
                      stopGenerating
                    }
                    title="Stop generating"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-black
                      transition
                      hover:bg-gray-200
                    "
                  >
                    <span className="h-3 w-3 rounded-[2px] bg-black" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={
                      !input.trim()
                    }
                    onClick={() =>
                      sendMessage()
                    }
                    title="Send message"
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-lg
                      font-black
                      text-black
                      transition
                      hover:scale-105
                      hover:bg-gray-200
                      disabled:cursor-not-allowed
                      disabled:bg-white/10
                      disabled:text-gray-700
                      disabled:hover:scale-100
                    "
                  >
                    ↑
                  </button>
                )}
              </div>
            </div>

            {/* BOTTOM INFO */}

            <div
              className="
                mt-2
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-[10px]
                text-gray-700
              "
            >
              <span>
                AI can make mistakes.
                Check important info.
              </span>

              {messages.length >
                0 &&
                !loading && (
                  <>
                    <span>•</span>

                    <button
                      type="button"
                      onClick={
                        regenerate
                      }
                      className="
                        transition
                        hover:text-gray-400
                      "
                    >
                      Regenerate
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}