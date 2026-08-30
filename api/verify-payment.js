import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

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
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    const supabaseUrl =
      process.env.VITE_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!keySecret) {
      return res.status(500).json({
        error:
          "RAZORPAY_KEY_SECRET is missing.",
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
       AUTHENTICATE USER
    ====================================================== */

    const token =
      getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        error:
          "Please login before verifying payment.",
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
          "Your login session is invalid.",
      });
    }

    /* =====================================================
       PAYMENT DATA
    ====================================================== */

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        error:
          "Missing Razorpay payment details.",
      });
    }

    /* =====================================================
       GET ORIGINAL ORDER FROM DATABASE
    ====================================================== */

    const {
      data: order,
      error: orderError,
    } =
      await supabaseAdmin
        .from("payment_orders")
        .select(
          `
            id,
            user_id,
            razorpay_order_id,
            plan,
            billing,
            amount,
            currency,
            status
          `
        )
        .eq(
          "razorpay_order_id",
          razorpay_order_id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (orderError) {
      console.error(
        "Order lookup error:",
        orderError
      );

      return res.status(500).json({
        error:
          "Unable to verify payment order.",
      });
    }

    if (!order) {
      return res.status(400).json({
        error:
          "Payment order was not found for this user.",
      });
    }

    /* =====================================================
       VERIFY RAZORPAY SIGNATURE
    ====================================================== */

    const signatureBody =
      `${order.razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          keySecret
        )
        .update(signatureBody)
        .digest("hex");

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        razorpay_signature,
        "utf8"
      );

    const isValid =
      expectedBuffer.length ===
        receivedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error:
          "Payment signature verification failed.",
      });
    }

    /* =====================================================
       CHECK DUPLICATE PAYMENT
    ====================================================== */

    const {
      data: existingPayment,
      error: existingPaymentError,
    } =
      await supabaseAdmin
        .from("payments")
        .select(
          "id, razorpay_payment_id"
        )
        .eq(
          "razorpay_payment_id",
          razorpay_payment_id
        )
        .maybeSingle();

    if (existingPaymentError) {
      console.error(
        "Existing payment lookup error:",
        existingPaymentError
      );

      return res.status(500).json({
        error:
          "Unable to check existing payment.",
      });
    }

    if (existingPayment) {
      return res.status(200).json({
        success: true,
        verified: true,
        alreadyProcessed: true,
        message:
          "Payment already verified.",
        plan: order.plan,
        billing: order.billing,
      });
    }

    /* =====================================================
       CALCULATE SUBSCRIPTION EXPIRY
    ====================================================== */

    const startsAt =
      new Date();

    const expiresAt =
      new Date(startsAt);

    if (
      order.billing === "yearly"
    ) {
      expiresAt.setFullYear(
        expiresAt.getFullYear() + 1
      );
    } else {
      expiresAt.setMonth(
        expiresAt.getMonth() + 1
      );
    }

    /* =====================================================
       SAVE PAYMENT
    ====================================================== */

    const {
      error: paymentInsertError,
    } =
      await supabaseAdmin
        .from("payments")
        .insert({
          user_id: user.id,

          razorpay_order_id:
            order.razorpay_order_id,

          razorpay_payment_id,

          plan: order.plan,

          billing: order.billing,

          amount: order.amount,

          currency:
            order.currency || "INR",

          status: "paid",

          paid_at:
            startsAt.toISOString(),
        });

    if (paymentInsertError) {
      console.error(
        "Payment insert error:",
        paymentInsertError
      );

      return res.status(500).json({
        error:
          "Payment was verified, but could not be saved.",
      });
    }

    /* =====================================================
       UPDATE PAYMENT ORDER
    ====================================================== */

    const {
      error: orderUpdateError,
    } =
      await supabaseAdmin
        .from("payment_orders")
        .update({
          status: "paid",
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          order.id
        );

    if (orderUpdateError) {
      console.error(
        "Order update error:",
        orderUpdateError
      );
    }

    /* =====================================================
       ACTIVATE / UPDATE SUBSCRIPTION
    ====================================================== */

    const {
      error: subscriptionError,
    } =
      await supabaseAdmin
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,

            plan: order.plan,

            billing:
              order.billing,

            status: "active",

            starts_at:
              startsAt.toISOString(),

            expires_at:
              expiresAt.toISOString(),

            razorpay_payment_id,

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "user_id",
          }
        );

    if (subscriptionError) {
      console.error(
        "Subscription update error:",
        subscriptionError
      );

      return res.status(500).json({
        error:
          "Payment was verified, but subscription activation failed.",
      });
    }

    /* =====================================================
       SUCCESS
    ====================================================== */

    return res.status(200).json({
      success: true,

      verified: true,

      message:
        "Payment verified and subscription activated successfully.",

      plan:
        order.plan,

      billing:
        order.billing,

      expiresAt:
        expiresAt.toISOString(),

      paymentId:
        razorpay_payment_id,
    });
  } catch (error) {
    console.error(
      "API /verify-payment error:",
      error
    );

    return res.status(500).json({
      success: false,

      error:
        error?.message ||
        "Internal server error.",
    });
  }
}