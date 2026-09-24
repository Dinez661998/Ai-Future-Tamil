export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      question_type,
      grade,
      subject,
      course,
      unit,
      lesson,
      standard,
      learning_objective,
      dok,
      bloom_level,
      difficulty,
      question_count,
    } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured.",
      });
    }

    const count = Math.min(
      Math.max(Number(question_count) || 1, 1),
      50
    );

    const prompt = `
You are a highly strict K-12 assessment question developer,
SME and quality reviewer.

Generate ${count} assessment questions.

Assessment details:

Question Type: ${question_type}
Grade: ${grade}
Subject: ${subject}
Course: ${course}
Unit: ${unit}
Lesson: ${lesson}
Standard: ${standard}
Learning Objective: ${learning_objective}
DOK: ${dok}
Bloom Level: ${bloom_level}
Difficulty: ${difficulty}

Requirements:

1. Questions must align with the supplied learning objective.
2. Questions must align with the supplied standard.
3. Match the requested DOK.
4. Match the requested Bloom level.
5. Avoid ambiguity.
6. Avoid unnecessary clues.
7. Distractors must be plausible.
8. Only one answer should be correct for MCQ.
9. Use grade-appropriate language.
10. Do not invent standards.
11. Do not include explanations outside the JSON.
12. Return ONLY valid JSON.

For MCQ and Image-Based MCQ use:
option_a
option_b
option_c
option_d
correct_answer

For OEQ, options can be null.

Return exactly this structure:

{
  "questions": [
    {
      "question_number": 1,
      "question_type": "${question_type}",
      "question_text": "",
      "image_url": null,
      "option_a": "",
      "option_b": "",
      "option_c": "",
      "option_d": "",
      "correct_answer": "",
      "rationale": "",
      "explanation": ""
    }
  ]
}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },

        body: JSON.stringify({
          model:
            process.env.OPENAI_MODEL ||
            "gpt-4.1-mini",

          messages: [
            {
              role: "system",
              content:
                "You are an expert K-12 assessment developer and quality reviewer.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.3,

          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(result);

      return res.status(response.status).json({
        error:
          result?.error?.message ||
          "AI generation failed.",
      });
    }

    const content =
      result?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        error: "AI returned an empty response.",
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(500).json({
        error: "AI returned invalid JSON.",
      });
    }

    return res.status(200).json({
      questions: parsed.questions || [],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error:
        error?.message ||
        "Unexpected server error.",
    });
  }
}