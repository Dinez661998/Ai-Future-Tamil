import { createClient } from "@supabase/supabase-js";

const PLAN_PRICES = {
  Starter: {
    monthly: 500,
    yearly: 5000,
  },

  Creator: {
    monthly: 1000,
    yearly: 10000,
  },

  Pro: {
    monthly: 2500,
    yearly: 25000,
  },

  Premium: {
    monthly: 5000,
    yearly: 50000,
  },
};

function getBearerToken(req) {
  const authHeader =
    req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7).trim();
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
    /* =====================================================
       ENVIRONMENT VARIABLES
    ====================================================== */

    const razorpayKeyId =
      process.env.RAZORPAY_KEY_ID;

    const razorpayKeySecret =
      process.env.RAZORPAY_KEY_SECRET;

    const supabaseUrl =
      process.env.VITE_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !razorpayKeyId ||
      !razorpayKeySecret
    ) {
      return res.status(500).json({
        error:
          "Razorpay environment variables are missing.",
      });
    }

    if (
      !supabaseUrl ||
      !supabaseServiceRoleKey
    ) {
      return res.status(500).json({
        error:
          "Supabase server environment variables are missing.",
      });
    }

    /* =====================================================
       USER AUTHENTICATION
    ====================================================== */

    const token =
      getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        error:
          "Please login before purchasing a plan.",
      });
    }

    const supabaseAdmin =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

    const {
      data: userData,
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
        token
      );

    const user =
      userData?.user;

    if (userError || !user) {
      return res.status(401).json({
        error:
          "Your login session is invalid. Please login again.",
      });
    }

    /* =====================================================
       VALIDATE PLAN
    ====================================================== */

    const {
      plan,
      billing,
    } = req.body || {};

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({
        error:
          "Invalid plan selected.",
      });
    }

    if (
      !["monthly", "yearly"].includes(
        billing
      )
    ) {
      return res.status(400).json({
        error:
          "Invalid billing cycle.",
      });
    }

    const amount =
      PLAN_PRICES[plan][billing];

    /* =====================================================
       CREATE RAZORPAY ORDER
    ====================================================== */

    const auth =
      Buffer.from(
        `${razorpayKeyId}:${razorpayKeySecret}`
      ).toString("base64");

    const receipt =
      `aft_${Date.now()}_${user.id.slice(
        0,
        8
      )}`;

    const razorpayResponse =
      await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Basic ${auth}`,
          },

          body: JSON.stringify({
            amount,

            currency: "INR",

            receipt,

            notes: {
              user_id: user.id,
              plan,
              billing,
              source:
                "AI Future Tamil",
            },
          }),
        }
      );

    const rawText =
      await razorpayResponse.text();

    let razorpayOrder = null;

    if (rawText) {
      try {
        razorpayOrder =
          JSON.parse(rawText);
      } catch {
        return res.status(502).json({
          error:
            "Razorpay returned an invalid response.",
        });
      }
    }

    if (!razorpayResponse.ok) {
      console.error(
        "Razorpay order error:",
        razorpayOrder
      );

      return res
        .status(
          razorpayResponse.status
        )
        .json({
          error:
            razorpayOrder?.error
              ?.description ||
            "Unable to create Razorpay order.",
        });
    }

    if (
      !razorpayOrder?.id ||
      !razorpayOrder?.amount
    ) {
      return res.status(502).json({
        error:
          "Invalid Razorpay order response.",
      });
    }

    /* =====================================================
       SAVE ORDER IN SUPABASE
    ====================================================== */

    const {
      error: orderInsertError,
    } =
      await supabaseAdmin
        .from("payment_orders")
        .insert({
          user_id: user.id,

          razorpay_order_id:
            razorpayOrder.id,

          plan,

          billing,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency ||
            "INR",

          status: "created",
        });

    if (orderInsertError) {
      console.error(
        "Supabase payment order insert error:",
        orderInsertError
      );

      return res.status(500).json({
        error:
          "Payment order was created, but could not be saved securely. Please try again.",
      });
    }

    /* =====================================================
       SAFE RESPONSE
    ====================================================== */

    return res.status(200).json({
      success: true,

      orderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency ||
        "INR",

      keyId:
        razorpayKeyId,

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