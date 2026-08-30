export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST.",
    });
  }

  try {
    const { plan, billing } = req.body || {};

    const prices = {
      Starter: {
        monthly: 5,
        yearly: 50,
      },
      Creator: {
        monthly: 10,
        yearly: 100,
      },
      Pro: {
        monthly: 25,
        yearly: 250,
      },
      Premium: {
        monthly: 50,
        yearly: 500,
      },
    };

    if (!prices[plan]) {
      return res.status(400).json({
        error: "Invalid plan selected.",
      });
    }

    if (!["monthly", "yearly"].includes(billing)) {
      return res.status(400).json({
        error: "Invalid billing cycle.",
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({
        error:
          "Razorpay environment variables are missing.",
      });
    }

    const amountInRupees =
      prices[plan][billing];

    const amountInPaise =
      amountInRupees * 100;

    const auth = Buffer.from(
      `${keyId}:${keySecret}`
    ).toString("base64");

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },

        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `aft_${Date.now()}`,

          notes: {
            plan,
            billing,
            source: "AI Future Tamil",
          },
        }),
      }
    );

    const rawText =
      await razorpayResponse.text();

    let data = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        return res.status(502).json({
          error:
            "Razorpay returned an invalid response.",
        });
      }
    }

    if (!razorpayResponse.ok) {
      console.error(
        "Razorpay create order error:",
        data
      );

      return res
        .status(razorpayResponse.status)
        .json({
          error:
            data?.error?.description ||
            data?.error?.reason ||
            "Unable to create Razorpay order.",
        });
    }

    return res.status(200).json({
      success: true,

      orderId: data.id,

      amount: data.amount,

      currency: data.currency,

      keyId,

      plan,

      billing,
    });
  } catch (error) {
    console.error(
      "API /create-order error:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Internal server error.",
    });
  }
}