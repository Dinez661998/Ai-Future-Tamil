// ============================================================
// AI FUTURE TAMIL - CHAT API
// Gemini Primary + Hugging Face Automatic Fallback
// FILE: /api/chat.js
// ============================================================

const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

const ALLOWED_GEMINI_MODELS = new Set([
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
]);

// Hugging Face fallback.
// HF will automatically choose an available provider.
const HF_FALLBACK_MODEL = "openai/gpt-oss-120b";

// Don't make the user wait too long.
const GEMINI_MAX_RETRIES = 1;
const GEMINI_TIMEOUT = 30000;
const HF_TIMEOUT = 45000;


// ============================================================
// SMALL HELPERS
// ============================================================

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function safeString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}


// ============================================================
// LANGUAGE
// ============================================================

function languageInstruction(language) {
  switch (language) {
    case "tamil":
      return `
Respond mainly in simple Tamil.

Technical English words may be used when useful.

Explain everything clearly for a beginner.
`;

    case "tanglish":
      return `
Respond naturally in Tanglish.

Use Tamil meaning mostly written using English letters.

Mix simple English where useful.

Keep the tone friendly, practical and easy to understand.

Avoid difficult literary Tamil.
`;

    case "english":
      return `
Respond in clear and simple English.

Use practical examples when useful.
`;

    default:
      return `
Automatically match the user's language.

If the user writes Tanglish, respond in Tanglish.

If the user writes Tamil, respond in Tamil.

If the user writes English, respond in English.

Keep explanations simple and beginner friendly.
`;
  }
}


// ============================================================
// SYSTEM PROMPT
// ============================================================

function getSystemPrompt(language) {
  return `
You are AI Future Tamil Assistant.

You are the AI assistant built into the AI Future Tamil website.

You help users with:

- Artificial Intelligence
- Machine Learning
- Technology
- Programming
- Website Development
- Mobile Technology
- Content Creation
- YouTube
- Social Media
- Prompt Engineering
- Education
- Productivity
- General Questions

BEHAVIOUR:

Be friendly, accurate, useful and practical.

Explain difficult topics in a beginner-friendly way.

Use examples when they improve understanding.

Never claim that you performed an action that you did not perform.

If information is uncertain, clearly say that it may be uncertain.

Do not pretend to have live internet information unless live information
was actually supplied to you.

CODING:

When users ask coding questions:

- Give clean working code.
- Keep explanations simple.
- Avoid unnecessary complexity.
- Do not invent APIs, libraries, packages or functions.

${languageInstruction(language)}
`;
}


// ============================================================
// NORMALIZE FRONTEND HISTORY
// ============================================================

function cleanFrontendHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => {
      return (
        item &&
        typeof item.text === "string" &&
        (
          item.role === "user" ||
          item.role === "assistant"
        )
      );
    })
    .slice(-12)
    .map((item) => ({
      role: item.role,
      text: item.text.slice(0, 12000),
    }));
}


// ============================================================
// GEMINI HISTORY
// ============================================================

function createGeminiContents(history, currentMessage) {
  const contents = history.map((item) => ({
    role:
      item.role === "assistant"
        ? "model"
        : "user",

    parts: [
      {
        text: item.text,
      },
    ],
  }));

  const last = contents[contents.length - 1];

  const alreadyIncluded =
    last?.role === "user" &&
    safeString(last?.parts?.[0]?.text) === currentMessage;

  if (!alreadyIncluded) {
    contents.push({
      role: "user",

      parts: [
        {
          text: currentMessage,
        },
      ],
    });
  }

  // Gemini history should start with user.
  while (
    contents.length > 0 &&
    contents[0].role !== "user"
  ) {
    contents.shift();
  }

  return contents;
}


// ============================================================
// HUGGING FACE HISTORY
// ============================================================

function createHFMessages(
  history,
  currentMessage,
  language
) {
  const messages = [
    {
      role: "system",
      content: getSystemPrompt(language),
    },
  ];

  for (const item of history) {
    messages.push({
      role: item.role,
      content: item.text,
    });
  }

  const last = messages[messages.length - 1];

  const alreadyIncluded =
    last?.role === "user" &&
    safeString(last?.content) === currentMessage;

  if (!alreadyIncluded) {
    messages.push({
      role: "user",
      content: currentMessage,
    });
  }

  return messages;
}


// ============================================================
// PARSE GEMINI
// ============================================================

function extractGeminiReply(data) {
  const parts =
    data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => {
      return typeof part?.text === "string"
        ? part.text
        : "";
    })
    .join("")
    .trim();
}


// ============================================================
// GEMINI REQUEST
// ============================================================

async function callGemini({
  apiKey,
  model,
  contents,
  language,
}) {
  const url =
    "https://generativelanguage.googleapis.com/" +
    "v1beta/models/" +
    encodeURIComponent(model) +
    ":generateContent";

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, GEMINI_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: "POST",

      signal: controller.signal,

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },

      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: getSystemPrompt(language),
            },
          ],
        },

        contents,

        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
        },
      }),
    });

    const raw = await response.text();

    let data = {};

    try {
      data = raw
        ? JSON.parse(raw)
        : {};
    } catch {
      data = {};
    }

    return {
      ok: response.ok,

      status: response.status,

      reply: response.ok
        ? extractGeminiReply(data)
        : "",

      error:
        data?.error?.message ||
        "",
    };
  } catch (error) {
    return {
      ok: false,

      status:
        error?.name === "AbortError"
          ? 504
          : 500,

      reply: "",

      error:
        error?.name === "AbortError"
          ? "Gemini request timed out."
          : error?.message ||
            "Gemini request failed.",
    };
  } finally {
    clearTimeout(timer);
  }
}


// ============================================================
// GEMINI RETRY
// ============================================================

function isTemporaryGeminiError(status) {
  return (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}


async function callGeminiWithRetry(options) {
  let result = null;

  for (
    let attempt = 0;
    attempt <= GEMINI_MAX_RETRIES;
    attempt += 1
  ) {
    result = await callGemini(options);

    if (
      result.ok &&
      result.reply
    ) {
      return result;
    }

    if (
      !isTemporaryGeminiError(
        result.status
      )
    ) {
      return result;
    }

    if (
      attempt <
      GEMINI_MAX_RETRIES
    ) {
      const delay =
        700 +
        Math.floor(
          Math.random() * 500
        );

      await sleep(delay);
    }
  }

  return result;
}


// ============================================================
// HUGGING FACE FALLBACK
// ============================================================

async function callHuggingFace({
  token,
  history,
  currentMessage,
  language,
}) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, HF_TIMEOUT);

  try {
    const messages =
      createHFMessages(
        history,
        currentMessage,
        language
      );

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",

        signal: controller.signal,

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model:
            HF_FALLBACK_MODEL,

          messages,

          max_tokens: 2048,

          temperature: 0.7,

          stream: false,
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
      data = {};
    }

    const reply =
      safeString(
        data?.choices?.[0]
          ?.message?.content
      );

    return {
      ok:
        response.ok &&
        Boolean(reply),

      status:
        response.status,

      reply,

      error:
        data?.error?.message ||
        (
          typeof data?.error === "string"
            ? data.error
            : ""
        ),
    };
  } catch (error) {
    return {
      ok: false,

      status:
        error?.name === "AbortError"
          ? 504
          : 500,

      reply: "",

      error:
        error?.name === "AbortError"
          ? "Fallback AI timed out."
          : error?.message ||
            "Fallback AI failed.",
    };
  } finally {
    clearTimeout(timer);
  }
}


// ============================================================
// MAIN API
// ============================================================

export default async function handler(req, res) {
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  // ----------------------------------------------------------
  // METHOD
  // ----------------------------------------------------------

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({
        error:
          "Method not allowed. Use POST.",
      });
  }


  try {
    // --------------------------------------------------------
    // ENVIRONMENT VARIABLES
    // --------------------------------------------------------

    const geminiApiKey =
      process.env.GEMINI_API_KEY;

    const hfToken =
      process.env.HF_TOKEN;


    if (
      !geminiApiKey &&
      !hfToken
    ) {
      return res
        .status(500)
        .json({
          error:
            "AI API keys are not configured.",
        });
    }


    // --------------------------------------------------------
    // USER MESSAGE
    // --------------------------------------------------------

    const message =
      safeString(
        req.body?.message
      );


    if (!message) {
      return res
        .status(400)
        .json({
          error:
            "Message is required.",
        });
    }


    if (
      message.length >
      12000
    ) {
      return res
        .status(400)
        .json({
          error:
            "Message is too long.",
        });
    }


    // --------------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------------

    const language =
      safeString(
        req.body?.language
      ) || "auto";


    // --------------------------------------------------------
    // MODEL
    // --------------------------------------------------------

    const requestedModel =
      safeString(
        req.body?.model
      );


    const geminiModel =
      ALLOWED_GEMINI_MODELS.has(
        requestedModel
      )
        ? requestedModel
        : DEFAULT_GEMINI_MODEL;


    // --------------------------------------------------------
    // HISTORY
    // --------------------------------------------------------

    const history =
      cleanFrontendHistory(
        req.body?.history
      );


    // ========================================================
    // 1. TRY GEMINI FIRST
    // ========================================================

    let geminiResult = null;


    if (geminiApiKey) {
      const contents =
        createGeminiContents(
          history,
          message
        );


      geminiResult =
        await callGeminiWithRetry({
          apiKey:
            geminiApiKey,

          model:
            geminiModel,

          contents,

          language,
        });


      if (
        geminiResult?.ok &&
        geminiResult?.reply
      ) {
        return res
          .status(200)
          .json({
            reply:
              geminiResult.reply,

            model:
              geminiModel,

            provider:
              "Google Gemini",

            fallback:
              false,
          });
      }


      console.warn(
        "Gemini unavailable:",
        {
          status:
            geminiResult?.status,

          error:
            geminiResult?.error,
        }
      );
    }


    // ========================================================
    // 2. HUGGING FACE FALLBACK
    // ========================================================

    if (hfToken) {
      console.log(
        "Trying Hugging Face fallback..."
      );


      const hfResult =
        await callHuggingFace({
          token:
            hfToken,

          history,

          currentMessage:
            message,

          language,
        });


      if (
        hfResult?.ok &&
        hfResult?.reply
      ) {
        return res
          .status(200)
          .json({
            reply:
              hfResult.reply,

            model:
              HF_FALLBACK_MODEL,

            provider:
              "Hugging Face",

            fallback:
              true,
          });
      }


      console.error(
        "Hugging Face fallback failed:",
        {
          status:
            hfResult?.status,

          error:
            hfResult?.error,
        }
      );


      // HF token permission problem
      if (
        hfResult?.status ===
          401 ||
        hfResult?.status ===
          403
      ) {
        return res
          .status(503)
          .json({
            error:
              "Primary AI is busy and the backup AI token does not have Inference Provider permission.",
          });
      }


      // HF credits/rate limit
      if (
        hfResult?.status ===
        402
      ) {
        return res
          .status(503)
          .json({
            error:
              "Primary AI is busy and the backup AI has no remaining inference credits.",
          });
      }


      if (
        hfResult?.status ===
        429
      ) {
        return res
          .status(503)
          .json({
            error:
              "Both AI services are temporarily busy. Please try again shortly.",
          });
      }
    }


    // ========================================================
    // 3. BOTH FAILED
    // ========================================================

    if (
      geminiResult?.status ===
      429
    ) {
      return res
        .status(503)
        .json({
          error:
            "AI usage limit is temporarily busy and the backup AI is unavailable. Please try again shortly.",
        });
    }


    if (
      geminiResult?.status ===
        503 ||
      geminiResult?.status ===
        504 ||
      geminiResult?.status >=
        500
    ) {
      return res
        .status(503)
        .json({
          error:
            "Both primary and backup AI services are temporarily unavailable. Please try again shortly.",
        });
    }


    // Gemini permanent error
    if (
      geminiResult &&
      !isTemporaryGeminiError(
        geminiResult.status
      )
    ) {
      return res
        .status(
          geminiResult.status >= 400 &&
          geminiResult.status < 600
            ? geminiResult.status
            : 500
        )
        .json({
          error:
            geminiResult.error ||
            "Gemini request failed.",
        });
    }


    return res
      .status(503)
      .json({
        error:
          "AI service is temporarily unavailable.",
      });


  } catch (error) {
    console.error(
      "AI Future Tamil chat error:",
      error
    );


    return res
      .status(500)
      .json({
        error:
          "AI service is temporarily unavailable.",
      });
  }
}