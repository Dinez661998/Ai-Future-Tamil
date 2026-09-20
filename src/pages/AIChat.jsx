import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   AI FUTURE TAMIL
   FINAL AI CHAT
   Chat + Image + Video-ready UI
========================================================= */

const STORAGE_KEY =
  "ai-future-tamil-chat-v3";

const MODELS = [
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    short: "3.6 Flash",
    icon: "✦",
  },
  {
    id: "gemini-3.5-flash-lite",
    name: "Gemini 3.5 Flash Lite",
    short: "Flash Lite",
    icon: "⚡",
  },
];

const LANGUAGES = [
  {
    id: "auto",
    name: "Auto",
    icon: "🌐",
  },
  {
    id: "tanglish",
    name: "Tanglish",
    icon: "🗣️",
  },
  {
    id: "tamil",
    name: "Tamil",
    icon: "🇮🇳",
  },
  {
    id: "english",
    name: "English",
    icon: "🇬🇧",
  },
];

const MODES = [
  {
    id: "chat",
    name: "Chat",
    icon: "💬",
  },
  {
    id: "image",
    name: "Image",
    icon: "🎨",
  },
  {
    id: "video",
    name: "Video",
    icon: "🎬",
  },
];

const STARTERS = [
  {
    icon: "🤖",
    title: "Explain AI",
    subtitle:
      "AI basics simple-aa explain pannu",
    prompt:
      "Artificial Intelligence na enna? Simple Tanglish-la explain pannu.",
  },
  {
    icon: "💻",
    title: "Build Website",
    subtitle:
      "React coding help",
    prompt:
      "React website build panna beginner roadmap kudu.",
  },
  {
    icon: "✨",
    title: "Create Prompt",
    subtitle:
      "Better AI prompts",
    prompt:
      "Professional AI image prompt create panna help pannu.",
  },
  {
    icon: "📚",
    title: "Learn",
    subtitle:
      "Simple step-by-step learning",
    prompt:
      "AI basics step by step teach pannu.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createConversation() {
  return {
    id: createId(),
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function makeTitle(text) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    return "New Chat";
  }

  return clean.length > 35
    ? `${clean.slice(0, 35)}...`
    : clean;
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
      parsed.conversations
        .length === 0
    ) {
      throw new Error(
        "Invalid saved chat"
      );
    }

    return {
      conversations:
        parsed.conversations,

      activeId:
        parsed.activeId ||
        parsed.conversations[0]
          .id,
    };
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

/* =========================================================
   SIMPLE TEXT RENDERER
========================================================= */

function MessageContent({
  text,
}) {
  if (!text) {
    return null;
  }

  return (
    <div className="whitespace-pre-wrap break-words">
      {text}
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

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

  const [input, setInput] =
    useState("");

  const [
    generationMode,
    setGenerationMode,
  ] = useState("chat");

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
    error,
    setError,
  ] = useState("");

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

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
    activeConversation
      ?.messages || [];

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

  /* =======================================================
     SAVE
  ======================================================= */

  useEffect(() => {
    try {
      /*
        Generated base64 images can make
        localStorage large.

        For now this is fine for testing.
      */

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          conversations,
          activeId,
        })
      );
    } catch (storageError) {
      console.warn(
        "Chat history storage full:",
        storageError
      );
    }
  }, [
    conversations,
    activeId,
  ]);

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, [
    messages,
    loading,
  ]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      abortControllerRef
        .current
        ?.abort();
    };
  }, []);

  /* =======================================================
     UPDATE CONVERSATION
  ======================================================= */

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

  /* =======================================================
     NEW CHAT
  ======================================================= */

  function newChat() {
    stopGenerating();

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
      textareaRef.current
        ?.focus();
    }, 50);
  }

  /* =======================================================
     DELETE CHAT
  ======================================================= */

  function deleteChat(
    conversationId
  ) {
    if (
      loading &&
      conversationId ===
        activeId
    ) {
      stopGenerating();
    }

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
      activeId ===
      conversationId
    ) {
      setActiveId(
        remaining[0].id
      );
    }
  }

  /* =======================================================
     COPY
  ======================================================= */

  async function copyMessage(
    message
  ) {
    try {
      await navigator.clipboard
        .writeText(
          message.text || ""
        );

      setCopiedMessageId(
        message.id
      );

      setTimeout(() => {
        setCopiedMessageId(
          null
        );
      }, 1500);
    } catch {
      setError(
        "Copy failed."
      );
    }
  }

  /* =======================================================
     GEMINI TEXT REQUEST
  ======================================================= */

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
                    .filter(
                      (message) =>
                        message.type !==
                        "image"
                    )
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

      const assistantMessage =
        {
          id: createId(),

          role:
            "assistant",

          type: "text",

          text: String(
            data.reply
          ).trim(),

          model:
            data.model ||
            model,

          provider:
            data.provider ||
            "Google Gemini",

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
                  ...conversation
                    .messages,
                  assistantMessage,
                ],
        })
      );
    } catch (
      requestError
    ) {
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
        abortControllerRef
          .current ===
        controller
      ) {
        abortControllerRef.current =
          null;
      }

      setLoading(false);
    }
  }

  /* =======================================================
     IMAGE REQUEST
  ======================================================= */

  async function requestImage({
    conversationId,
    text,
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
          "/api/image",
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
                prompt: text,
              }),
          }
        );

      if (!response.ok) {
        let errorMessage =
          `Image generation failed (${response.status}).`;

        try {
          const data =
            await response.json();

          if (data?.error) {
            errorMessage =
              data.error;
          }
        } catch {
          // Ignore.
        }

        throw new Error(
          errorMessage
        );
      }

      const imageBlob =
        await response.blob();

      if (
        !imageBlob ||
        imageBlob.size === 0
      ) {
        throw new Error(
          "Image generator returned an empty image."
        );
      }

      const imageDataUrl =
        await new Promise(
          (
            resolve,
            reject
          ) => {
            const reader =
              new FileReader();

            reader.onloadend =
              () =>
                resolve(
                  reader.result
                );

            reader.onerror =
              () =>
                reject(
                  new Error(
                    "Generated image could not be loaded."
                  )
                );

            reader.readAsDataURL(
              imageBlob
            );
          }
        );

      const imageMessage = {
        id: createId(),

        role: "assistant",

        type: "image",

        text,

        imageUrl:
          imageDataUrl,

        model:
          "FLUX.1-schnell",

        provider:
          "Hugging Face",

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
                  imageMessage,
                ]
              : [
                  ...conversation
                    .messages,
                  imageMessage,
                ],
        })
      );
    } catch (
      requestError
    ) {
      if (
        requestError?.name ===
        "AbortError"
      ) {
        return;
      }

      console.error(
        requestError
      );

      setError(
        requestError?.message ||
          "Image generation failed."
      );
    } finally {
      if (
        abortControllerRef
          .current ===
        controller
      ) {
        abortControllerRef.current =
          null;
      }

      setLoading(false);
    }
  }

  /* =======================================================
     SEND
  ======================================================= */

  async function sendMessage(
    customText = null
  ) {
    if (loading) {
      return;
    }

    const text = String(
      customText ?? input
    ).trim();

    if (!text) {
      return;
    }

    if (
      generationMode ===
      "video"
    ) {
      setError(
        "🎬 Video generation backend இன்னும் connect பண்ணவில்லை. Chat அல்லது Image mode use பண்ணுங்க."
      );

      return;
    }

    const conversationId =
      activeConversation.id;

    const userMessage = {
      id: createId(),

      role: "user",

      type:
        generationMode ===
        "image"
          ? "image-prompt"
          : "text",

      text,

      createdAt:
        Date.now(),
    };

    const previousMessages =
      activeConversation
        .messages;

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
            ? makeTitle(
                text
              )
            : conversation.title,

        updatedAt:
          Date.now(),

        messages:
          nextMessages,
      })
    );

    setInput("");
    setError("");

    if (
      textareaRef.current
    ) {
      textareaRef.current.style.height =
        "auto";
    }

    if (
      generationMode ===
      "image"
    ) {
      await requestImage({
        conversationId,
        text,
      });

      return;
    }

    await requestAI({
      conversationId,

      text,

      requestHistory:
        nextMessages,
    });
  }

  /* =======================================================
     STOP
  ======================================================= */

  function stopGenerating() {
    abortControllerRef.current
      ?.abort();

    abortControllerRef.current =
      null;

    setLoading(false);
  }

  /* =======================================================
     REGENERATE TEXT
  ======================================================= */

  async function regenerateText(
    message
  ) {
    if (loading) {
      return;
    }

    const index =
      messages.findIndex(
        (item) =>
          item.id ===
          message.id
      );

    if (index < 0) {
      return;
    }

    let userIndex =
      index - 1;

    while (
      userIndex >= 0 &&
      messages[userIndex]
        .role !== "user"
    ) {
      userIndex -= 1;
    }

    if (userIndex < 0) {
      return;
    }

    const userMessage =
      messages[userIndex];

    const baseMessages =
      messages.slice(
        0,
        index
      );

    updateConversation(
      activeConversation.id,
      (conversation) => ({
        ...conversation,
        messages:
          baseMessages,
        updatedAt:
          Date.now(),
      })
    );

    await requestAI({
      conversationId:
        activeConversation.id,

      text:
        userMessage.text,

      requestHistory:
        baseMessages,

      replaceMessages:
        baseMessages,
    });
  }

  /* =======================================================
     REGENERATE IMAGE
  ======================================================= */

  async function regenerateImage(
    message
  ) {
    if (
      loading ||
      !message?.text
    ) {
      return;
    }

    const index =
      messages.findIndex(
        (item) =>
          item.id ===
          message.id
      );

    if (index < 0) {
      return;
    }

    const baseMessages =
      messages.slice(
        0,
        index
      );

    updateConversation(
      activeConversation.id,
      (conversation) => ({
        ...conversation,
        messages:
          baseMessages,
        updatedAt:
          Date.now(),
      })
    );

    await requestImage({
      conversationId:
        activeConversation.id,

      text:
        message.text,

      replaceMessages:
        baseMessages,
    });
  }

  /* =======================================================
     DOWNLOAD IMAGE
  ======================================================= */

  function downloadImage(
    message
  ) {
    if (
      !message?.imageUrl
    ) {
      return;
    }

    const link =
      document.createElement(
        "a"
      );

    link.href =
      message.imageUrl;

    link.download =
      `ai-future-tamil-${Date.now()}.png`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  }

  /* =======================================================
     INPUT
  ======================================================= */

  function handleInputChange(
    event
  ) {
    setInput(
      event.target.value
    );

    const textarea =
      event.target;

    textarea.style.height =
      "auto";

    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        200
      )}px`;
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

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="flex h-[calc(100vh-72px)] min-h-[600px] overflow-hidden bg-[#090a0d] text-white">

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
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[285px]
          flex-col
          border-r
          border-white/[0.07]
          bg-[#0d0e12]
          transition-transform
          duration-300
          lg:relative
          lg:z-auto
          lg:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="border-b border-white/[0.06] p-4">
          <div className="mb-4 flex items-center justify-between">

            <div>
              <div className="text-sm font-black">
                ✦ AI Future Tamil
              </div>

              <div className="mt-1 text-[10px] text-gray-600">
                Your AI Assistant
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
              className="rounded-lg px-2 py-1 text-gray-500 hover:bg-white/[0.05] hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>

          <button
            type="button"
            onClick={newChat}
            className="
              w-full
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.04]
              px-4
              py-3
              text-left
              text-sm
              font-bold
              text-gray-200
              transition
              hover:border-cyan-400/20
              hover:bg-cyan-400/[0.06]
              hover:text-white
            "
          >
            ＋ New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">

          <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-700">
            Recent Chats
          </div>

          <div className="space-y-1">
            {conversations.map(
              (
                conversation
              ) => (
                <div
                  key={
                    conversation.id
                  }
                  className={`
                    group
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    px-3
                    py-2.5
                    transition

                    ${
                      conversation.id ===
                      activeId
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

                      setError("");
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="truncate text-xs font-semibold text-gray-300">
                      {
                        conversation.title
                      }
                    </div>
                  </button>

                  <button
                    type="button"
                    title="Delete chat"
                    onClick={() =>
                      deleteChat(
                        conversation.id
                      )
                    }
                    className="rounded-md px-1.5 py-1 text-xs text-gray-700 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    🗑
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] p-4 text-[10px] leading-5 text-gray-700">
          AI can make mistakes.
          <br />
          Verify important information.
        </div>
      </aside>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="flex min-w-0 flex-1 flex-col">

        {/* TOP BAR */}

        <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#090a0d]/95 px-3 backdrop-blur-xl sm:px-5">

          <div className="flex min-w-0 items-center gap-3">

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-gray-400 hover:text-white lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-gray-200">
                {
                  activeConversation
                    ?.title
                }
              </div>

              <div className="text-[10px] text-gray-600">
                AI Future Tamil
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* MODEL */}

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
              disabled={
                loading ||
                generationMode !==
                  "chat"
              }
              className="
                max-w-[145px]
                rounded-xl
                border
                border-white/[0.08]
                bg-[#15161b]
                px-2.5
                py-2
                text-[11px]
                font-semibold
                text-gray-300
                outline-none
                disabled:opacity-40
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

            {/* LANGUAGE */}

            <select
              value={language}
              onChange={(
                event
              ) =>
                setLanguage(
                  event.target
                    .value
                )
              }
              disabled={
                loading
              }
              className="
                max-w-[110px]
                rounded-xl
                border
                border-white/[0.08]
                bg-[#15161b]
                px-2
                py-2
                text-[11px]
                text-gray-300
                outline-none
                disabled:opacity-40
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
                      item.icon
                    }{" "}
                    {
                      item.name
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </header>

        {/* =================================================
            MESSAGES
        ================================================= */}

        <div className="flex-1 overflow-y-auto">

          <div className="mx-auto w-full max-w-[880px] px-4 pb-8 pt-8 sm:px-6">

            {messages.length ===
            0 ? (
              /* WELCOME */

              <div className="flex min-h-[55vh] flex-col items-center justify-center">

                <div
                  className="
                    mb-5
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-gradient-to-br
                    from-cyan-400/[0.10]
                    to-purple-500/[0.10]
                    text-2xl
                    shadow-xl
                    shadow-cyan-500/5
                  "
                >
                  ✦
                </div>

                <h1 className="text-center text-2xl font-black tracking-tight text-white sm:text-3xl">
                  How can I help you?
                </h1>

                <p className="mt-3 max-w-md text-center text-sm leading-6 text-gray-600">
                  Chat, learn, code or
                  generate AI images with
                  AI Future Tamil.
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">

                  {STARTERS.map(
                    (
                      starter
                    ) => (
                      <button
                        key={
                          starter.title
                        }
                        type="button"
                        onClick={() => {
                          setGenerationMode(
                            "chat"
                          );

                          sendMessage(
                            starter.prompt
                          );
                        }}
                        className="
                          rounded-2xl
                          border
                          border-white/[0.07]
                          bg-white/[0.025]
                          p-4
                          text-left
                          transition
                          hover:border-cyan-400/20
                          hover:bg-white/[0.05]
                        "
                      >
                        <div className="flex gap-3">

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xl">
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

              <div className="w-full space-y-8">

                {messages.map(
                  (message) => (
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
                          {message.type ===
                            "image-prompt" && (
                            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                              🎨 Image
                              Prompt
                            </div>
                          )}

                          <div className="whitespace-pre-wrap break-words">
                            {
                              message.text
                            }
                          </div>
                        </div>
                      ) : (
                        /* ASSISTANT */

                        <div className="group flex w-full gap-3 sm:gap-4">

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

                            <div className="mb-3 flex items-center gap-2">

                              <span className="text-xs font-bold text-gray-400">
                                AI Future
                                Tamil
                              </span>

                              <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] text-gray-600">
                                {message.type ===
                                "image"
                                  ? "🎨 FLUX"
                                  : MODELS.find(
                                      (
                                        item
                                      ) =>
                                        item.id ===
                                        message.model
                                    )
                                      ?.short ||
                                    "AI"}
                              </span>
                            </div>

                            {/* IMAGE MESSAGE */}

                            {message.type ===
                              "image" &&
                            message.imageUrl ? (
                              <div className="w-full">

                                <div
                                  className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/[0.10]
                                    bg-black/20
                                    shadow-2xl
                                    shadow-black/30
                                  "
                                >
                                  <img
                                    src={
                                      message.imageUrl
                                    }
                                    alt={
                                      message.text ||
                                      "AI generated image"
                                    }
                                    className="block h-auto max-h-[650px] w-full object-contain"
                                  />
                                </div>

                                <div
                                  className="
                                    mt-3
                                    rounded-xl
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.025]
                                    px-4
                                    py-3
                                  "
                                >
                                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                    Image
                                    Prompt
                                  </div>

                                  <div className="text-sm leading-6 text-gray-300">
                                    {
                                      message.text
                                    }
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      downloadImage(
                                        message
                                      )
                                    }
                                    className="
                                      rounded-xl
                                      border
                                      border-white/[0.08]
                                      bg-white/[0.04]
                                      px-3
                                      py-2
                                      text-xs
                                      font-bold
                                      text-gray-300
                                      transition
                                      hover:border-cyan-400/30
                                      hover:bg-cyan-400/[0.08]
                                      hover:text-white
                                    "
                                  >
                                    ⬇ Download
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      loading
                                    }
                                    onClick={() =>
                                      regenerateImage(
                                        message
                                      )
                                    }
                                    className="
                                      rounded-xl
                                      border
                                      border-white/[0.08]
                                      bg-white/[0.04]
                                      px-3
                                      py-2
                                      text-xs
                                      font-bold
                                      text-gray-300
                                      transition
                                      hover:border-purple-400/30
                                      hover:bg-purple-400/[0.08]
                                      hover:text-white
                                      disabled:opacity-40
                                    "
                                  >
                                    ↻ Regenerate
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* TEXT MESSAGE */

                              <div className="text-[17px] leading-8 text-gray-200 sm:text-[18px]">
                                <MessageContent
                                  text={
                                    message.text
                                  }
                                />

                                <div className="mt-4 flex flex-wrap items-center gap-1 opacity-70 transition group-hover:opacity-100">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyMessage(
                                        message
                                      )
                                    }
                                    className="rounded-lg px-2.5 py-1.5 text-xs text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
                                  >
                                    {copiedMessageId ===
                                    message.id
                                      ? "✓ Copied"
                                      : "📋 Copy"}
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      loading
                                    }
                                    onClick={() =>
                                      regenerateText(
                                        message
                                      )
                                    }
                                    className="rounded-lg px-2.5 py-1.5 text-xs text-gray-500 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-30"
                                  >
                                    ↻ Regenerate
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* LOADING */}

                {loading && (
                  <div className="flex gap-4">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06]">
                      ✦
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-bold text-gray-500">
                        {generationMode ===
                        "image"
                          ? "Creating your image..."
                          : "AI Future Tamil is thinking..."}
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
                        className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.07] hover:text-white"
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

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mx-auto w-full max-w-[880px] px-4 sm:px-6">

            <div className="mb-2 flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">

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

        <div className="shrink-0 bg-gradient-to-t from-[#090a0d] via-[#090a0d] to-transparent px-3 pb-3 pt-2 sm:px-6 sm:pb-5">

          <div className="mx-auto w-full max-w-[880px]">

            {/* MODE SELECTOR */}

            <div
              className="
                mb-2
                flex
                items-center
                gap-1.5
                overflow-x-auto
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#111217]
                p-1.5
              "
            >
              {MODES.map(
                (modeItem) => {
                  const active =
                    generationMode ===
                    modeItem.id;

                  return (
                    <button
                      key={
                        modeItem.id
                      }
                      type="button"
                      disabled={
                        loading
                      }
                      onClick={() => {
                        setGenerationMode(
                          modeItem.id
                        );

                        setError("");

                        setTimeout(
                          () =>
                            textareaRef.current
                              ?.focus(),
                          50
                        );
                      }}
                      className={`
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        px-4
                        py-2
                        text-xs
                        font-bold
                        transition

                        ${
                          active
                            ? modeItem.id ===
                              "image"
                              ? "border-purple-400/25 bg-purple-500/[0.12] text-purple-200"
                              : modeItem.id ===
                                "video"
                              ? "border-pink-400/25 bg-pink-500/[0.12] text-pink-200"
                              : "border-cyan-400/25 bg-cyan-500/[0.12] text-cyan-200"
                            : "border-transparent text-gray-500 hover:bg-white/[0.05] hover:text-gray-200"
                        }

                        disabled:opacity-40
                      `}
                    >
                      <span>
                        {
                          modeItem.icon
                        }
                      </span>

                      <span>
                        {
                          modeItem.name
                        }
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {/* INPUT BOX */}

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
              "
            >
              <textarea
                ref={
                  textareaRef
                }
                value={input}
                rows={1}
                placeholder={
                  generationMode ===
                  "image"
                    ? "Describe the image you want to create..."
                    : generationMode ===
                      "video"
                    ? "Describe the video you want to create..."
                    : "Message AI Future Tamil..."
                }
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

              <div className="flex items-center justify-between gap-3 px-1 pb-1">

                {/* STATUS */}

                <div className="flex min-w-0 items-center gap-2">

                  <div
                    className={`
                      truncate
                      rounded-lg
                      px-2.5
                      py-1.5
                      text-[10px]
                      font-bold

                      ${
                        generationMode ===
                        "image"
                          ? "bg-purple-500/[0.10] text-purple-300"
                          : generationMode ===
                            "video"
                          ? "bg-pink-500/[0.10] text-pink-300"
                          : "bg-cyan-500/[0.10] text-cyan-300"
                      }
                    `}
                  >
                    {generationMode ===
                    "image"
                      ? "🎨 Image"
                      : generationMode ===
                        "video"
                      ? "🎬 Video"
                      : "💬 Chat"}
                  </div>

                  {generationMode ===
                    "chat" && (
                    <div className="hidden truncate rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-gray-500 sm:block">
                      {
                        selectedModel.icon
                      }{" "}
                      {
                        selectedModel.short
                      }
                    </div>
                  )}

                  <div className="hidden truncate rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-gray-600 md:block">
                    {
                      selectedLanguage.icon
                    }{" "}
                    {
                      selectedLanguage.name
                    }
                  </div>
                </div>

                {/* SEND */}

                {loading ? (
                  <button
                    type="button"
                    onClick={
                      stopGenerating
                    }
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-sm
                      font-black
                      text-black
                      transition
                      hover:bg-gray-200
                    "
                    title="Stop"
                  >
                    ■
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      sendMessage()
                    }
                    disabled={
                      !input.trim()
                    }
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-lg
                      font-black
                      text-black
                      transition
                      hover:bg-cyan-100
                      disabled:cursor-not-allowed
                      disabled:bg-white/10
                      disabled:text-gray-700
                    "
                    title={
                      generationMode ===
                      "image"
                        ? "Generate Image"
                        : generationMode ===
                          "video"
                        ? "Generate Video"
                        : "Send"
                    }
                  >
                    ↑
                  </button>
                )}
              </div>
            </div>

            <p className="mt-2 text-center text-[10px] text-gray-700">
              {generationMode ===
              "image"
                ? "AI images are generated using the connected image provider."
                : generationMode ===
                  "video"
                ? "Video generation will be connected next."
                : "AI Future Tamil can make mistakes. Check important information."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}