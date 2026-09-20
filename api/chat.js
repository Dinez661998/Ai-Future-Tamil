// ============================================================
// AI FUTURE TAMIL - CHAT API
// Gemini Primary -> Gemini fallback -> Hugging Face fallback
// FILE: /api/chat.js
// ============================================================

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

const HF_FALLBACK_MODEL = "openai/gpt-oss-120b:fastest";

const GEMINI_TIMEOUT = 20000;
const HF_TIMEOUT = 40000;

function safeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item) =>
        item &&
        typeof item.text === "string" &&
        (item.role === "user" || item.role === "assistant")
    )
    .slice(-10)
    .map((item) => ({
      role: item.role,
      text: item.text.slice(0, 10000),
    }));
}

function languageInstruction(language) {
  if (language === "tamil") {
    return `
Respond mainly in simple Tamil.
Technical English terms may be used.
Keep everything beginner friendly.
`;
  }

  if (language === "tanglish") {
    return `
Respond naturally in Tanglish.
Use Tamil meaning mostly written in English letters.
Mix simple English where useful.
Keep the tone friendly and practical.
`;
  }

  if (language === "english") {
    return `
Respond in clear simple English.
Use practical examples when useful.
`;
  }

  return `
Automatically match the user's language.
Tanglish question -> Tanglish answer.
Tamil question -> Tamil answer.
English question -> English answer.
Keep explanations simple.
`;
}

function systemPrompt(language) {
  return `
You are AI Future Tamil Assistant.

You help users with:
- Artificial Intelligence
- Machine Learning
- Technology
- Programming
- Website Development
- Content Creation
- YouTube
- Prompt Engineering
- Education
- General Questions

Be friendly, accurate and practical.

Explain difficult concepts simply.

For coding questions:
- Give working code.
- Explain important steps simply.
- Never invent APIs or packages.

If information is uncertain, say so.

${languageInstruction(language)}
`;
}

function createGeminiContents(history, message) {
  const contents = history.map((item) => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.text }],
  }));

  const last = contents[contents.length - 1];

  if (
    !last ||
    last.role !== "user" ||
    safeString(last.parts?.[0]?.text) !== message
  ) {
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });
  }

  while (contents.length && contents[0].role !== "user") {
    contents.shift();
  }

  return contents;
}

function createHFMessages(history, message, language) {
  const messages = [
    {
      role: "system",
      content: systemPrompt(language),
    },
  ];

  for (const item of history) {
    messages.push({
      role: item.role,
      content: item.text,
    });
  }

  const last = messages[messages.length - 1];

  if (
    last?.role !== "user" ||
    safeString(last?.content) !== message
  ) {
    messages.push({
      role: "user",
      content: message,
    });
  }

  return messages;
}

async function callGemini({
  apiKey,
  model,
  history,
  message,
  language,
}) {
  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    GEMINI_TIMEOUT
  );

  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent`;

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
              text: systemPrompt(language),
            },
          ],
        },

        contents: createGeminiContents(
          history,
          message
        ),

        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
        },
      }),
    });

    const raw = await response.text();

    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error:
          data?.error?.message ||
          `Gemini ${model} failed.`,
      };
    }

    const parts =
      data?.candidates?.[0]?.content?.parts;

    const reply = Array.isArray(parts)
      ? parts
          .map((part) =>
            typeof part?.text === "string"
              ? part.text
              : ""
          )
          .join("")
          .trim()
      : "";

    if (!reply) {
      return {
        ok: false,
        status: 502,
        error: "Gemini returned empty response.",
      };
    }

    return {
      ok: true,
      status: 200,
      reply,
      model,
    };
  } catch (error) {
    return {
      ok: false,

      status:
        error?.name === "AbortError"
          ? 504
          : 500,

      error:
        error?.name === "AbortError"
          ? `${model} timed out.`
          : error?.message ||
            `${model} failed.`,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function callHuggingFace({
  token,
  history,
  message,
  language,
}) {
  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    HF_TIMEOUT
  );

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",

        signal: controller.signal,

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: HF_FALLBACK_MODEL,

          messages: createHFMessages(
            history,
            message,
            language
          ),

          max_tokens: 2048,

          temperature: 0.7,

          stream: false,
        }),
      }
    );

    const raw = await response.text();

    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      return {
        ok: false,

        status: response.status,

        error:
          data?.error?.message ||
          data?.error ||
          data?.message ||
          `Hugging Face failed (${response.status}).`,
      };
    }

    const reply = safeString(
      data?.choices?.[0]?.message?.content
    );

    if (!reply) {
      return {
        ok: false,
        status: 502,
        error:
          "Hugging Face returned an empty response.",
      };
    }

    return {
      ok: true,
      status: 200,
      reply,
    };
  } catch (error) {
    return {
      ok: false,

      status:
        error?.name === "AbortError"
          ? 504
          : 500,

      error:
        error?.name === "AbortError"
          ? "Hugging Face timed out."
          : error?.message ||
            "Hugging Face failed.",
    };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const geminiApiKey =
      process.env.GEMINI_API_KEY;

    const hfToken =
      process.env.HF_TOKEN;

    if (!geminiApiKey && !hfToken) {
      return res.status(500).json({
        error:
          "AI API keys are not configured.",
      });
    }

    const message = safeString(
      req.body?.message
    );

    if (!message) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    if (message.length > 12000) {
      return res.status(400).json({
        error: "Message is too long.",
      });
    }

    const language =
      safeString(req.body?.language) ||
      "auto";

    const history =
      cleanHistory(req.body?.history);

    // ==========================================
    // 1. GEMINI MODEL CHAIN
    // ==========================================

    if (geminiApiKey) {
      const requestedModel =
        safeString(req.body?.model);

      const models = [
        requestedModel,
        ...GEMINI_MODELS,
      ].filter(
        (model, index, array) =>
          model &&
          array.indexOf(model) === index
      );

      for (const model of models) {
        console.log(
          `Trying Gemini model: ${model}`
        );

        const result = await callGemini({
          apiKey: geminiApiKey,
          model,
          history,
          message,
          language,
        });

        if (result.ok && result.reply) {
          console.log(
            `Gemini success: ${model}`
          );

          return res.status(200).json({
            reply: result.reply,
            model,
            provider: "Google Gemini",
            fallback:
              model !== requestedModel,
          });
        }

        console.warn(
          `Gemini failed: ${model}`,
          {
            status: result.status,
            error: result.error,
          }
        );

        // Authentication / bad request:
        // trying another Gemini model usually
        // won't solve it.
        if (
          result.status === 400 ||
          result.status === 401 ||
          result.status === 403
        ) {
          break;
        }
      }
    }

    // ==========================================
    // 2. HUGGING FACE FALLBACK
    // ==========================================

    if (hfToken) {
      console.log(
        `Trying Hugging Face: ${HF_FALLBACK_MODEL}`
      );

      const hfResult =
        await callHuggingFace({
          token: hfToken,
          history,
          message,
          language,
        });

      if (
        hfResult.ok &&
        hfResult.reply
      ) {
        console.log(
          "Hugging Face fallback success."
        );

        return res.status(200).json({
          reply: hfResult.reply,

          model:
            HF_FALLBACK_MODEL,

          provider:
            "Hugging Face",

          fallback: true,
        });
      }

      console.error(
        "Hugging Face fallback failed:",
        {
          status:
            hfResult.status,

          error:
            hfResult.error,
        }
      );

      if (
        hfResult.status === 401 ||
        hfResult.status === 403
      ) {
        return res.status(503).json({
          error:
            "Backup AI token permission problem. Check HF_TOKEN Inference Providers permission.",
        });
      }

      if (hfResult.status === 402) {
        return res.status(503).json({
          error:
            "Hugging Face inference credits are unavailable.",
        });
      }

      if (hfResult.status === 429) {
        return res.status(503).json({
          error:
            "AI services are temporarily rate limited. Please try again shortly.",
        });
      }
    }

    return res.status(503).json({
      error:
        "AI services are temporarily unavailable. Please try again shortly.",
    });
  } catch (error) {
    console.error(
      "AI Future Tamil API error:",
      error
    );

    return res.status(500).json({
      error:
        "AI service is temporarily unavailable.",
    });
  }
}