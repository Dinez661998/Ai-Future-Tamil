export default async function handler(req, res) {
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  if (req.method !== "POST") {
    return res.status(405).json({
      error:
        "Method not allowed. Use POST.",
    });
  }

  try {
    const message =
      req.body?.message?.trim();

    if (!message) {
      return res.status(400).json({
        error:
          "Message is required.",
      });
    }

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error:
          "GEMINI_API_KEY is missing in Vercel environment variables.",
      });
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const geminiResponse =
      await fetch(
        geminiUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                role: "user",

                parts: [
                  {
                    text:
                      message,
                  },
                ],
              },
            ],
          }),
        }
      );

    const rawText =
      await geminiResponse.text();

    let data = null;

    if (rawText) {
      try {
        data =
          JSON.parse(
            rawText
          );
      } catch {
        return res
          .status(502)
          .json({
            error:
              "Gemini returned an invalid response.",
          });
      }
    }

    if (
      !geminiResponse.ok
    ) {
      console.error(
        "Gemini API error:",
        data
      );

      return res
        .status(
          geminiResponse.status
        )
        .json({
          error:
            data?.error
              ?.message ||
            `Gemini API failed with status ${geminiResponse.status}.`,
        });
    }

    const parts =
      data?.candidates?.[0]
        ?.content?.parts;

    const reply =
      Array.isArray(parts)
        ? parts
            .map(
              (part) =>
                part?.text ||
                ""
            )
            .join("")
            .trim()
        : "";

    if (!reply) {
      return res
        .status(502)
        .json({
          error:
            "Gemini did not return any text.",
        });
    }

    return res
      .status(200)
      .json({
        reply,
      });
  } catch (error) {
    console.error(
      "API /chat error:",
      error
    );

    return res
      .status(500)
      .json({
        error:
          error?.message ||
          "Internal server error.",
      });
  }
}