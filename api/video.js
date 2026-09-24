// ============================================================
// AI FUTURE TAMIL - VIDEO GENERATION API
// FILE: /api/video.js
//
// Supports:
// 1. Text -> Video
// 2. Image -> Video
// 3. Image + Prompt -> Video
//
// IMPORTANT:
// Existing /api/chat.js  = NO CHANGE
// Existing /api/image.js = NO CHANGE
// ============================================================

import { InferenceClient } from "@huggingface/inference";

// ------------------------------------------------------------
// MODELS
// ------------------------------------------------------------

// Fast / lightweight text-to-video model.
const TEXT_TO_VIDEO_MODEL =
  "Wan-AI/Wan2.1-T2V-1.3B";

// Image-to-video model.
const IMAGE_TO_VIDEO_MODEL =
  "Wan-AI/Wan2.2-I2V-A14B";

// Maximum uploaded image size.
// 8 MB is enough for normal JPG / PNG / WEBP uploads.
const MAX_IMAGE_BYTES =
  8 * 1024 * 1024;

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function cleanText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function sendError(
  res,
  status,
  message
) {
  return res
    .status(status)
    .json({
      error: message,
    });
}

function base64ToBlob(
  dataUrl
) {
  if (
    !dataUrl ||
    typeof dataUrl !== "string"
  ) {
    throw new Error(
      "Uploaded image is invalid."
    );
  }

  const match =
    dataUrl.match(
      /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/i
    );

  if (!match) {
    throw new Error(
      "Only JPG, PNG and WEBP images are supported."
    );
  }

  const mimeType =
    match[1] === "image/jpg"
      ? "image/jpeg"
      : match[1];

  const base64 =
    match[2];

  const buffer =
    Buffer.from(
      base64,
      "base64"
    );

  if (!buffer.length) {
    throw new Error(
      "Uploaded image is empty."
    );
  }

  if (
    buffer.length >
    MAX_IMAGE_BYTES
  ) {
    throw new Error(
      "Image is too large. Please use an image below 8 MB."
    );
  }

  return new Blob(
    [buffer],
    {
      type: mimeType,
    }
  );
}

async function resultToBuffer(
  result
) {
  // Hugging Face video methods normally return Blob.
  if (
    result instanceof Blob
  ) {
    const arrayBuffer =
      await result.arrayBuffer();

    return Buffer.from(
      arrayBuffer
    );
  }

  // Some providers / SDK versions may return ArrayBuffer.
  if (
    result instanceof ArrayBuffer
  ) {
    return Buffer.from(
      result
    );
  }

  // Uint8Array support.
  if (
    ArrayBuffer.isView(
      result
    )
  ) {
    return Buffer.from(
      result.buffer,
      result.byteOffset,
      result.byteLength
    );
  }

  throw new Error(
    "Video provider returned an unsupported response."
  );
}

// ------------------------------------------------------------
// HANDLER
// ------------------------------------------------------------

export default async function handler(
  req,
  res
) {
  if (
    req.method !== "POST"
  ) {
    res.setHeader(
      "Allow",
      "POST"
    );

    return sendError(
      res,
      405,
      "Method not allowed. Use POST."
    );
  }

  try {
    // --------------------------------------------------------
    // TOKEN
    // --------------------------------------------------------

    const hfToken =
      process.env.HF_TOKEN;

    if (!hfToken) {
      return sendError(
        res,
        500,
        "HF_TOKEN is not configured in Vercel."
      );
    }

    // --------------------------------------------------------
    // INPUT
    // --------------------------------------------------------

    const mode =
      cleanText(
        req.body?.mode
      ) || "text";

    const prompt =
      cleanText(
        req.body?.prompt
      );

    const imageDataUrl =
      cleanText(
        req.body?.image
      );

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      mode !== "text" &&
      mode !== "image"
    ) {
      return sendError(
        res,
        400,
        "Invalid video generation mode."
      );
    }

    // Text -> Video requires prompt.
    if (
      mode === "text" &&
      !prompt
    ) {
      return sendError(
        res,
        400,
        "Please enter a video prompt."
      );
    }

    // Image -> Video requires image.
    if (
      mode === "image" &&
      !imageDataUrl
    ) {
      return sendError(
        res,
        400,
        "Please upload an image."
      );
    }

    if (
      prompt.length >
      4000
    ) {
      return sendError(
        res,
        400,
        "Video prompt is too long."
      );
    }

    // --------------------------------------------------------
    // HUGGING FACE CLIENT
    // --------------------------------------------------------

    const client =
      new InferenceClient(
        hfToken
      );

    let videoResult;
    let usedModel;
    let generationType;

    // ========================================================
    // TEXT -> VIDEO
    // ========================================================

    if (
      mode === "text"
    ) {
      console.log(
        "Starting Text-to-Video:",
        TEXT_TO_VIDEO_MODEL
      );

      videoResult =
        await client.textToVideo(
          {
            model:
              TEXT_TO_VIDEO_MODEL,

            inputs:
              prompt,

            parameters: {
              num_frames:
                81,

              guidance_scale:
                5,

              num_inference_steps:
                20,
            },
          },
          {
            provider:
              "auto",
          }
        );

      usedModel =
        TEXT_TO_VIDEO_MODEL;

      generationType =
        "text-to-video";
    }

    // ========================================================
    // IMAGE -> VIDEO
    // IMAGE + TEXT -> VIDEO
    // ========================================================

    if (
      mode === "image"
    ) {
      console.log(
        "Starting Image-to-Video:",
        IMAGE_TO_VIDEO_MODEL
      );

      const imageBlob =
        base64ToBlob(
          imageDataUrl
        );

      // If the user typed a prompt:
      // Image + Text -> Video.
      //
      // If no prompt:
      // Image -> Video with a safe default motion instruction.

      const motionPrompt =
        prompt ||
        [
          "Animate this image naturally.",
          "Preserve the original subject,",
          "identity, composition and colors.",
          "Add subtle realistic motion,",
          "natural camera movement",
          "and cinematic animation."
        ].join(" ");

      videoResult =
        await client.imageToVideo(
          {
            model:
              IMAGE_TO_VIDEO_MODEL,

            inputs:
              imageBlob,

            parameters: {
              prompt:
                motionPrompt,

              num_frames:
                81,

              guidance_scale:
                5,

              num_inference_steps:
                20,
            },
          },
          {
            provider:
              "auto",
          }
        );

      usedModel =
        IMAGE_TO_VIDEO_MODEL;

      generationType =
        prompt
          ? "image-text-to-video"
          : "image-to-video";
    }

    // --------------------------------------------------------
    // VIDEO RESULT
    // --------------------------------------------------------

    if (!videoResult) {
      throw new Error(
        "Video provider returned no result."
      );
    }

    const videoBuffer =
      await resultToBuffer(
        videoResult
      );

    if (
      !videoBuffer ||
      videoBuffer.length === 0
    ) {
      throw new Error(
        "Generated video is empty."
      );
    }

    console.log(
      "Video generated successfully:",
      {
        type:
          generationType,

        model:
          usedModel,

        bytes:
          videoBuffer.length,
      }
    );

    // --------------------------------------------------------
    // SEND MP4 TO FRONTEND
    // --------------------------------------------------------

    res.setHeader(
      "Content-Type",
      "video/mp4"
    );

    res.setHeader(
      "Content-Length",
      String(
        videoBuffer.length
      )
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    res.setHeader(
      "X-AI-Provider",
      "Hugging-Face"
    );

    res.setHeader(
      "X-AI-Model",
      usedModel
    );

    res.setHeader(
      "X-Generation-Type",
      generationType
    );

    return res
      .status(200)
      .send(
        videoBuffer
      );

  } catch (error) {
    console.error(
      "VIDEO API ERROR:",
      error
    );

    const status =
      Number(
        error?.status ||
        error?.response?.status
      ) || 500;

    const rawMessage =
      error?.message ||
      "Video generation failed.";

    // Authentication / permission
    if (
      status === 401 ||
      status === 403
    ) {
      return sendError(
        res,
        status,
        "Hugging Face token does not have permission for video inference. Check HF_TOKEN permissions."
      );
    }

    // Payment / credits
    if (
      status === 402
    ) {
      return sendError(
        res,
        402,
        "Video generation credits are unavailable for this Hugging Face account/provider."
      );
    }

    // Rate limit
    if (
      status === 429
    ) {
      return sendError(
        res,
        429,
        "Video AI is temporarily rate limited. Please try again later."
      );
    }

    // Model/provider busy
    if (
      status === 503
    ) {
      return sendError(
        res,
        503,
        "Video model is currently busy or unavailable. Please try again shortly."
      );
    }

    return sendError(
      res,
      status >= 400 &&
        status <= 599
        ? status
        : 500,
      rawMessage
    );
  }
}