import { InferenceClient } from "@huggingface/inference";

const IMAGE_MODELS = new Set([
  "black-forest-labs/FLUX.1-schnell",
]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const token = process.env.HF_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "HF_TOKEN is not configured in Vercel.",
      });
    }

    const prompt =
      typeof req.body?.prompt === "string"
        ? req.body.prompt.trim()
        : "";

    if (!prompt) {
      return res.status(400).json({
        error: "Image prompt is required.",
      });
    }

    if (prompt.length > 4000) {
      return res.status(400).json({
        error: "Image prompt is too long.",
      });
    }

    const requestedModel =
      typeof req.body?.model === "string"
        ? req.body.model
        : "";

    const model = IMAGE_MODELS.has(requestedModel)
      ? requestedModel
      : "black-forest-labs/FLUX.1-schnell";

    const client = new InferenceClient(token);

    const image = await client.textToImage({
      model,
      provider: "auto",
      inputs: prompt,
    });

    if (!image) {
      return res.status(502).json({
        error: "Image model returned no image.",
      });
    }

    const arrayBuffer = await image.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const contentType =
      image.type || "image/jpeg";

    res.setHeader(
      "Content-Type",
      contentType
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    return res.status(200).send(buffer);
  } catch (error) {
    console.error(
      "Image generation error:",
      error
    );

    const message =
      error?.message ||
      "Image generation failed.";

    if (
      message.toLowerCase().includes("quota") ||
      message.toLowerCase().includes("credit") ||
      message.toLowerCase().includes("billing")
    ) {
      return res.status(429).json({
        error:
          "Hugging Face image generation credit/limit reached.",
      });
    }

    if (
      message.toLowerCase().includes("unauthorized") ||
      message.toLowerCase().includes("authentication") ||
      message.includes("401")
    ) {
      return res.status(401).json({
        error:
          "Hugging Face token is invalid or does not have inference permission.",
      });
    }

    return res.status(500).json({
      error: message,
    });
  }
}