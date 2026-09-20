// ============================================================
// AI FUTURE TAMIL - GEMINI CHAT API
// File: /api/chat.js
// Full replacement
// ============================================================

const DEFAULT_MODEL = "gemini-3.6-flash";

// UI-la currently use pannura models
const ALLOWED_MODELS = new Set([
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
]);

// Retry settings
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

// ============================================================
// HELPERS
// ============================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item) =>
        item &&
        typeof item.text === "string" &&
        (item.role === "user" ||
          item.role === "assistant")
    )
    .slice(-12)
    .map((item) => ({
      role:
        item.role === "assistant"
          ? "model"
          : "user",

      parts: [
        {
          text: item.text.slice(0, 12000),
        },
      ],
    }));
}

// ============================================================
// LANGUAGE
// ============================================================

function languageInstruction(language) {
  switch (language) {
    case "tamil":
      return `
Respond mainly in clear Tamil.

Technical English terms may be used when needed.

Keep the explanation natural, simple and easy to understand.
`;

    case "tanglish":
      return `
Respond in natural Tanglish.

Use Tamil meaning written mostly using English letters mixed with simple English.

Keep the tone friendly, simple and practical.

Avoid difficult literary Tamil.
`;

    case "english":
      return `
Respond in clear and simple English.

Use practical real-world examples when useful.
`;

    default:
      return `
Automatically match the user's language.

If the user writes Tanglish, reply in Tanglish.

If the user writes Tamil, reply in Tamil.

If the user writes English, reply in English.
`;
  }
}

// ============================================================
// SYSTEM INSTRUCTION
// ============================================================

function systemInstruction(language) {
  return `
You are AI Future Tamil Assistant.

You are the AI assistant built into the AI Future Tamil website.

Your job is to help users with:

- Artificial Intelligence
- Machine Learning
- Technology
- Programming
- Website Development
- Content Creation
- YouTube
- Social Media
- Prompt Engineering
- Education
- General Questions

STYLE:

Be friendly, accurate, practical and easy to understand.

Explain complicated concepts in a beginner-friendly way.

When useful, give examples.

Do not pretend that you performed actions that you cannot perform.

CODING:

When the user asks coding questions:

- Give clean working code.
- Explain important steps simply.
- Avoid unnecessary complexity.
- Never invent APIs, packages or functions.

FACTUAL QUESTIONS:

If information is uncertain, clearly say so.

Do not pretend to have live information unless live information was actually provided.

${languageInstruction(language)}
`;
}

// ============================================================
// PARSE GEMINI RESPONSE
// ============================================================

function getReply(data) {
  const parts =
    data?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) =>
      typeof part?.text === "string"
        ? part.text
        : ""
    )
    .join("")
    .trim();
}

// ============================================================
// CALL GEMINI
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

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 45000);

  try {
    const response =
      await fetch(url, {
        method: "POST",

        signal:
          controller.signal,

        headers: {
          "Content-Type":
            "application/json",

          "x-goog-api-key":
            apiKey,
        },

        body:
          JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text:
                    systemInstruction(
                      language
                    ),
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

    const raw =
      await response.text();

    let data = {};

    if (raw) {
      try {
        data =
          JSON.parse(raw);
      } catch {
        data = {};
      }
    }

    return {
      ok:
        response.ok,

      status:
        response.status,

      data,

      reply:
        response.ok
          ? getReply(data)
          : "",
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// RETRY LOGIC
// ============================================================

function shouldRetry(status) {
  return (
    status === 408 ||
    status === 429 ||
    status >= 500
  );
}

async function generateWithRetry({
  apiKey,
  model,
  contents,
  language,
}) {
  let lastResult = null;

  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt += 1
  ) {
    try {
      const result =
        await callGemini({
          apiKey,
          model,
          contents,
          language,
        });

      lastResult = result;

      // SUCCESS
      if (
        result.ok &&
        result.reply
      ) {
        return result;
      }

      // Don't retry permanent errors
      if (
        !shouldRetry(
          result.status
        )
      ) {
        return result;
      }

      // Last retry reached
      if (
        attempt ===
        MAX_RETRIES
      ) {
        break;
      }

      // Exponential backoff + jitter
      const exponential =
        BASE_DELAY *
        Math.pow(
          2,
          attempt
        );

      const jitter =
        Math.floor(
          Math.random() *
            500
        );

      const delay =
        exponential +
        jitter;

      console.log(
        `Gemini temporary error ${result.status}. ` +
          `Retry ${attempt + 1}/${MAX_RETRIES} ` +
          `after ${delay}ms.`
      );

      await sleep(delay);
    } catch (error) {
      lastResult = {
        ok: false,
        status:
          error?.name ===
          "AbortError"
            ? 504
            : 500,

        data: {
          error: {
            message:
              error?.message ||
              "Gemini request failed.",
          },
        },

        reply: "",
      };

      if (
        attempt ===
        MAX_RETRIES
      ) {
        break;
      }

      const exponential =
        BASE_DELAY *
        Math.pow(
          2,
          attempt
        );

      const jitter =
        Math.floor(
          Math.random() *
            500
        );

      await sleep(
        exponential +
          jitter
      );
    }
  }

  return lastResult;
}

// ============================================================
// MAIN API HANDLER
// ============================================================

export default async function handler(
  req,
  res
) {
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  // ----------------------------------------------------------
  // METHOD CHECK
  // ----------------------------------------------------------

  if (
    req.method !==
    "POST"
  ) {
    return res
      .status(405)
      .json({
        error:
          "Method not allowed. Use POST.",
      });
  }

  try {
    // --------------------------------------------------------
    // API KEY
    // --------------------------------------------------------

    const apiKey =
      process.env
        .GEMINI_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({
          error:
            "Gemini API key is not configured.",
        });
    }

    // --------------------------------------------------------
    // MESSAGE
    // --------------------------------------------------------

    const message =
      typeof req.body
        ?.message ===
      "string"
        ? req.body.message.trim()
        : "";

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
    // MODEL
    // --------------------------------------------------------

    const requestedModel =
      typeof req.body
        ?.model ===
      "string"
        ? req.body.model
        : "";

    const model =
      ALLOWED_MODELS.has(
        requestedModel
      )
        ? requestedModel
        : DEFAULT_MODEL;

    // --------------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------------

    const language =
      typeof req.body
        ?.language ===
      "string"
        ? req.body.language
        : "auto";

    // --------------------------------------------------------
    // HISTORY
    // --------------------------------------------------------

    let contents =
      cleanHistory(
        req.body?.history
      );

    // Current message already history-la irukka check
    const lastContent =
      contents[
        contents.length - 1
      ];

    const alreadyIncluded =
      lastContent?.role ===
        "user" &&
      lastContent
        ?.parts?.[0]
        ?.text?.trim() ===
        message;

    if (
      !alreadyIncluded
    ) {
      contents.push({
        role: "user",

        parts: [
          {
            text:
              message,
          },
        ],
      });
    }

    // Gemini conversation user message-la start aaganum
    while (
      contents.length >
        0 &&
      contents[0]
        .role !== "user"
    ) {
      contents.shift();
    }

    // --------------------------------------------------------
    // GEMINI REQUEST + AUTO RETRY
    // --------------------------------------------------------

    const result =
      await generateWithRetry({
        apiKey,
        model,
        contents,
        language,
      });

    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    if (
      result?.ok &&
      result?.reply
    ) {
      return res
        .status(200)
        .json({
          reply:
            result.reply,

          model,

          provider:
            "Google Gemini",
        });
    }

    // --------------------------------------------------------
    // ERROR HANDLING
    // --------------------------------------------------------

    const status =
      result?.status ||
      500;

    const geminiMessage =
      result?.data
        ?.error?.message ||
      "";

    console.error(
      "Gemini final error:",
      {
        status,
        model,
        error:
          result?.data,
      }
    );

    // RATE LIMIT
    if (
      status === 429
    ) {
      return res
        .status(429)
        .json({
          error:
            "AI free limit is busy right now. Please wait a little and try again.",
        });
    }

    // HIGH DEMAND / SERVICE BUSY
    if (
      status === 503
    ) {
      return res
        .status(503)
        .json({
          error:
            "AI is temporarily busy because of high demand. Automatic retries were attempted. Please try again shortly.",
        });
    }

    // TIMEOUT
    if (
      status === 504
    ) {
      return res
        .status(504)
        .json({
          error:
            "AI took too long to respond. Please try again.",
        });
    }

    // INVALID API KEY / ACCESS
    if (
      status === 401 ||
      status === 403
    ) {
      return res
        .status(status)
        .json({
          error:
            "Gemini API authentication failed. Please check the server API key.",
        });
    }

    // MODEL NOT FOUND
    if (
      status === 404
    ) {
      return res
        .status(404)
        .json({
          error:
            geminiMessage ||
            `Gemini model "${model}" is not available for this API key.`,
        });
    }

    // BAD REQUEST
    if (
      status === 400
    ) {
      return res
        .status(400)
        .json({
          error:
            geminiMessage ||
            "Gemini rejected the request.",
        });
    }

    // GENERIC
    return res
      .status(
        status >= 400 &&
          status < 600
          ? status
          : 500
      )
      .json({
        error:
          geminiMessage ||
          "AI service is temporarily unavailable.",
      });
  } catch (error) {
    console.error(
      "AI Future Tamil /api/chat error:",
      error
    );

    if (
      error?.name ===
      "AbortError"
    ) {
      return res
        .status(504)
        .json({
          error:
            "AI took too long to respond. Please try again.",
        });
    }

    return res
      .status(500)
      .json({
        error:
          "AI service is temporarily unavailable.",
      });
  }
}