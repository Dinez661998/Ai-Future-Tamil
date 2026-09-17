import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

const STORAGE_KEY =
  "ai-future-tamil-chat-v1";

const MODELS = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    short: "Gemini Flash",
    icon: "✦",
    description: "Best overall",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    short: "Gemini Lite",
    icon: "⚡",
    description: "Fast & lightweight",
  },
];

const LANGUAGES = [
  {
    id: "auto",
    label: "Auto",
  },
  {
    id: "tanglish",
    label: "Tanglish",
  },
  {
    id: "tamil",
    label: "Tamil",
  },
  {
    id: "english",
    label: "English",
  },
];

const STARTERS = [
  {
    icon: "💻",
    title: "Help me code",
    prompt:
      "Create a simple React component and explain it step by step.",
  },
  {
    icon: "🇮🇳",
    title: "Explain in Tanglish",
    prompt:
      "Artificial Intelligence na enna? Simple Tanglish-la explain pannu.",
  },
  {
    icon: "✨",
    title: "Create a prompt",
    prompt:
      "Create a professional AI image prompt for a futuristic Chennai city.",
  },
  {
    icon: "📺",
    title: "YouTube idea",
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
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      const conversation =
        createConversation();

      return {
        conversations: [
          conversation,
        ],
        activeId:
          conversation.id,
      };
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(
        parsed?.conversations
      ) ||
      parsed.conversations.length ===
        0
    ) {
      throw new Error(
        "Invalid chat storage"
      );
    }

    return parsed;
  } catch {
    const conversation =
      createConversation();

    return {
      conversations: [
        conversation,
      ],
      activeId:
        conversation.id,
    };
  }
}

function makeTitle(text) {
  const clean =
    text
      .replace(/\s+/g, " ")
      .trim();

  if (clean.length <= 34) {
    return clean;
  }

  return `${clean.slice(
    0,
    34
  )}...`;
}

function MessageContent({
  text,
}) {
  return (
    <div className="whitespace-pre-wrap break-words leading-7">
      {text}
    </div>
  );
}

export default function AIChat() {
  const initialState =
    useMemo(
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

  const [
    input,
    setInput,
  ] = useState("");

  const [
    model,
    setModel,
  ] = useState(
    "gemini-2.5-flash"
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

  const [
    error,
    setError,
  ] = useState("");

  const textareaRef =
    useRef(null);

  const bottomRef =
    useRef(null);

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeId
    ) ||
    conversations[0];

  const messages =
    activeConversation
      ?.messages || [];

  const selectedModel =
    MODELS.find(
      (item) =>
        item.id === model
    ) || MODELS[0];

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        conversations,
        activeId,
      })
    );
  }, [
    conversations,
    activeId,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    messages,
    loading,
  ]);

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

  function newChat() {
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

  function deleteChat(
    conversationId
  ) {
    const remaining =
      conversations.filter(
        (conversation) =>
          conversation.id !==
          conversationId
      );

    if (
      remaining.length === 0
    ) {
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

  async function copyText(
    text
  ) {
    try {
      await navigator.clipboard.writeText(
        text
      );
    } catch {
      // Clipboard may be blocked.
    }
  }

  async function sendMessage(
    customText = null
  ) {
    if (loading) {
      return;
    }

    const text =
      (
        customText ??
        input
      ).trim();

    if (!text) {
      return;
    }

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
    setLoading(true);

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

            body:
              JSON.stringify({
                message:
                  text,

                model,

                language,

                history:
                  nextMessages
                    .slice(-12)
                    .map(
                      (
                        message
                      ) => ({
                        role:
                          message.role,
                        text:
                          message.text,
                      })
                    ),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI request failed."
        );
      }

      const assistantMessage = {
        id: createId(),
        role: "assistant",
        text:
          data.reply,
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

          messages: [
            ...conversation.messages,
            assistantMessage,
          ],
        })
      );
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

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
      messages[
        lastUserIndex
      ];

    const conversationId =
      activeConversation.id;

    const historyBefore =
      messages.slice(
        0,
        lastUserIndex
      );

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,
        messages:
          historyBefore,
      })
    );

    setLoading(true);
    setError("");

    try {
      const requestHistory = [
        ...historyBefore,
        lastUser,
      ];

      const response =
        await fetch(
          "/api/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                message:
                  lastUser.text,

                model,

                language,

                history:
                  requestHistory
                    .slice(-12)
                    .map(
                      (
                        message
                      ) => ({
                        role:
                          message.role,
                        text:
                          message.text,
                      })
                    ),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI request failed."
        );
      }

      updateConversation(
        conversationId,
        (conversation) => ({
          ...conversation,

          updatedAt:
            Date.now(),

          messages: [
            ...historyBefore,

            lastUser,

            {
              id:
                createId(),
              role:
                "assistant",
              text:
                data.reply,
              model:
                data.model ||
                model,
              createdAt:
                Date.now(),
            },
          ],
        })
      );
    } catch (requestError) {
      updateConversation(
        conversationId,
        (conversation) => ({
          ...conversation,
          messages: [
            ...historyBefore,
            lastUser,
          ],
        })
      );

      setError(
        requestError?.message ||
          "Could not regenerate."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event
  ) {
    if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-76px)] min-h-[600px] overflow-hidden bg-[#090a0d] text-white">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
          className="fixed inset-0 z-[280] bg-black/60 lg:hidden"
        />
      )}

      {/* CHAT SIDEBAR */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-[76px]
          z-[300]
          flex
          w-[280px]
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
              border-white/[0.08]
              bg-white/[0.04]
              px-4
              py-3
              text-sm
              font-bold
              transition
              hover:bg-white/[0.08]
            "
          >
            <span className="text-lg">
              ＋
            </span>

            New chat
          </button>
        </div>

        <div className="px-4 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-600">
          Recent
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="space-y-1">
            {conversations.map(
              (
                conversation
              ) => {
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
                          ? "bg-white/[0.07]"
                          : "hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(
                          conversation.id
                        );

                        setSidebarOpen(
                          false
                        );
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

        <div className="border-t border-white/[0.07] p-3">
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

      {/* MAIN CHAT */}

      <section className="relative flex min-w-0 flex-1 flex-col bg-[#090a0d]">

        {/* CHAT HEADER */}

        <header
          className="
            flex
            h-[62px]
            shrink-0
            items-center
            justify-between
            border-b
            border-white/[0.06]
            px-3
            sm:px-5
          "
        >
          <div className="flex min-w-0 items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  true
                )
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

            <select
              value={model}
              onChange={(
                event
              ) =>
                setModel(
                  event.target
                    .value
                )
              }
              className="
                max-w-[180px]
                cursor-pointer
                rounded-xl
                border
                border-white/[0.08]
                bg-[#15161b]
                px-3
                py-2
                text-sm
                font-semibold
                text-gray-200
                outline-none
              "
            >
              {MODELS.map(
                (item) => (
                  <option
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {
                      item.name
                    }
                  </option>
                )
              )}
            </select>

          </div>

          <div className="flex items-center gap-2">

            <select
              value={
                language
              }
              onChange={(
                event
              ) =>
                setLanguage(
                  event.target
                    .value
                )
              }
              className="
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
              "
            >
              {LANGUAGES.map(
                (item) => (
                  <option
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {
                      item.label
                    }
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

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto">
          <div
            className={`
              mx-auto
              w-full
              max-w-[850px]
              px-4
              sm:px-6

              ${
                messages.length ===
                0
                  ? "flex min-h-full items-center justify-center"
                  : "py-8"
              }
            `}
          >

            {messages.length ===
            0 ? (
              <div className="w-full pb-20 text-center">

                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/[0.06]
                    text-3xl
                  "
                >
                  ✦
                </div>

                <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                  How can I help you?
                </h1>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Chat with AI in
                  English, Tamil or
                  Tanglish.
                </p>

                <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">

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
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-white/[0.025]
                          p-4
                          text-left
                          transition
                          hover:border-white/[0.12]
                          hover:bg-white/[0.05]
                        "
                      >
                        <span className="text-xl">
                          {
                            starter.icon
                          }
                        </span>

                        <p className="mt-3 text-sm font-bold">
                          {
                            starter.title
                          }
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">
                          {
                            starter.prompt
                          }
                        </p>
                      </button>
                    )
                  )}

                </div>
              </div>
            ) : (
              <div className="w-full space-y-8">

                {messages.map(
                  (
                    message
                  ) => (
                    <div
                      key={
                        message.id
                      }
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
                      {message.role ===
                      "user" ? (
                        <div className="max-w-[85%] rounded-[22px] bg-[#202126] px-5 py-3 text-[15px] text-gray-100 sm:max-w-[75%]">
                          <MessageContent
                            text={
                              message.text
                            }
                          />
                        </div>
                      ) : (
                        <div className="group flex w-full gap-4">

                          <div
                            className="
                              mt-1
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-cyan-400/20
                              bg-cyan-400/[0.06]
                              text-sm
                            "
                          >
                            ✦
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="mb-2 text-xs font-bold text-gray-500">
                              AI Future Tamil
                            </div>

                            <div className="text-[15px] text-gray-200">
                              <MessageContent
                                text={
                                  message.text
                                }
                              />
                            </div>

                            <div className="mt-3 flex items-center gap-1 opacity-70 transition group-hover:opacity-100">

                              <button
                                type="button"
                                onClick={() =>
                                  copyText(
                                    message.text
                                  )
                                }
                                className="rounded-lg px-2 py-1 text-xs text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
                              >
                                📋 Copy
                              </button>

                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}

                {loading && (
                  <div className="flex gap-4">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06]">
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
                    </div>

                  </div>
                )}

                <div
                  ref={
                    bottomRef
                  }
                />

              </div>
            )}

          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mx-auto w-full max-w-[850px] px-4 sm:px-6">
            <div className="mb-2 flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">

              <span>
                {error}
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

        {/* COMPOSER */}

        <div className="shrink-0 bg-gradient-to-t from-[#090a0d] via-[#090a0d] to-transparent px-3 pb-3 pt-2 sm:px-6 sm:pb-5">

          <div className="mx-auto w-full max-w-[850px]">

            <div
              className="
                rounded-[24px]
                border
                border-white/[0.10]
                bg-[#18191e]
                p-2
                shadow-2xl
                shadow-black/20
                transition
                focus-within:border-white/[0.18]
              "
            >

              <textarea
                ref={
                  textareaRef
                }
                value={input}
                rows={1}
                disabled={
                  loading
                }
                placeholder="Message AI Future Tamil..."
                onChange={(
                  event
                ) => {
                  setInput(
                    event.target
                      .value
                  );

                  event.target.style.height =
                    "auto";

                  event.target.style.height =
                    `${Math.min(
                      event
                        .target
                        .scrollHeight,
                      180
                    )}px`;
                }}
                onKeyDown={
                  handleKeyDown
                }
                className="
                  max-h-[180px]
                  min-h-[48px]
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
                  disabled:opacity-50
                "
              />

              <div className="flex items-center justify-between gap-3 px-1 pb-1">

                <div className="flex min-w-0 items-center gap-2">

                  <div
                    className="
                      truncate
                      rounded-lg
                      bg-white/[0.04]
                      px-2.5
                      py-1.5
                      text-[11px]
                      font-semibold
                      text-gray-500
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
                      LANGUAGES.find(
                        (
                          item
                        ) =>
                          item.id ===
                          language
                      )?.label
                    }
                  </div>

                </div>

                <button
                  type="button"
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  onClick={() =>
                    sendMessage()
                  }
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
                    hover:bg-gray-200
                    disabled:cursor-not-allowed
                    disabled:bg-white/10
                    disabled:text-gray-700
                  "
                >
                  ↑
                </button>

              </div>

            </div>

            <div className="mt-2 flex items-center justify-center gap-3 text-center text-[10px] text-gray-700">

              <span>
                Free-tier AI
              </span>

              {messages.length >
                0 && (
                <>
                  <span>
                    •
                  </span>

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={
                      regenerate
                    }
                    className="transition hover:text-gray-400 disabled:opacity-40"
                  >
                    Regenerate last response
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