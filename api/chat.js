const ALLOWED_MODELS = new Set([
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
]);

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (item) =>
        item &&
        typeof item.text === "string" &&
        (item.role === "user" || item.role === "assistant")
    )
    .slice(-12)
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: item.text.slice(0, 12000),
        },
      ],
    }));
}

function languageInstruction(language) {
  switch (language) {
    case "tamil":
      return `
Respond mainly in clear Tamil.
Technical English terms may be used when needed.
Keep the explanation natural and easy to understand.
`;

    case "tanglish":
      return `
Respond in natural Tanglish.
Use Tamil meaning written mostly with English letters mixed with simple English.
Keep the tone friendly, clear and practical.
Avoid difficult literary Tamil.
`;

    case "english":
      return `
Respond in clear, simple English.
Use practical examples when useful.
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

function systemInstruction(language) {
  return `
You are AI Future Tamil Assistant.

Your job is to help users with:

- Artificial Intelligence
- Technology
- Programming
- Learning
- Content creation
- YouTube
- Prompt engineering
- General questions

Be accurate, useful, practical and easy to understand.

For coding questions:
- Give clean working code when appropriate.
- Explain important steps simply.
- Do not invent APIs, packages or functions.

For factual questions:
- If you are uncertain, clearly say so.
- Do not pretend to have live information unless it was actually provided.

${languageInstruction(language)}
`;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Gemini API key is not configured.",
      });
    }

    const message =
      typeof req.body?.message === "string"
        ? req.body.message.trim()
        : "";

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

    const requestedModel =
      typeof req.body?.model === "string"
        ? req.body.model
        : "";

    const model = ALLOWED_MODELS.has(requestedModel)
      ? requestedModel
      : "gemini-3.6-flash";

    const language =
      typeof req.body?.language === "string"
        ? req.body.language
        : "auto";

    let contents = cleanHistory(req.body?.history);

    // Ensure the current message is the latest user message.
    const lastContent = contents[contents.length - 1];

    const currentMessageAlreadyIncluded =
      lastContent?.role === "user" &&
      lastContent?.parts?.[0]?.text?.trim() === message;

    if (!currentMessageAlreadyIncluded) {
      contents.push({
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      });
    }

    // Gemini conversation should start with user.
    while (
      contents.length > 0 &&
      contents[0].role !== "user"
    ) {
      contents.shift();
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent`;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 45000);

    let geminiResponse;

    try {
      geminiResponse = await fetch(geminiUrl, {
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
                text: systemInstruction(language),
              },
            ],
          },

          contents,

          generationConfig: {
            maxOutputTokens: 4096,
          },
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    const rawText = await geminiResponse.text();

    let data = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("Invalid Gemini response:", rawText);

        return res.status(502).json({
          error: "AI returned an invalid response.",
        });
      }
    }

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", data);

      if (geminiResponse.status === 429) {
        return res.status(429).json({
          error:
            "Free AI limit reached for now. Please try again later.",
        });
      }

      return res.status(geminiResponse.status).json({
        error:
          data?.error?.message ||
          "Gemini API request failed.",
      });
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
      const blockReason =
        data?.promptFeedback?.blockReason;

      return res.status(502).json({
        error: blockReason
          ? `AI could not answer this request (${blockReason}).`
          : "AI did not return a text response.",
      });
    }

    return res.status(200).json({
      reply,
      model,
      provider: "Google Gemini",
    });
  } catch (error) {
    console.error("API /chat error:", error);

    if (error?.name === "AbortError") {
      return res.status(504).json({
        error:
          "AI took too long to respond. Please try again.",
      });
    }

    return res.status(500).json({
      error:
        "AI service is temporarily unavailable.",
    });
  }
}