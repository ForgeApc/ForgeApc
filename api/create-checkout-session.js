// api/create-checkout-session.js — Vercel serverless function
// Creates a Stripe Subscription and returns a payment intent client_secret
// for the frontend Payment Element.
//
// SETUP — two env vars in Vercel:
//   STRIPE_SECRET_KEY      = sk_live_... / sk_test_...
//   STRIPE_PUBLISHABLE_KEY = pk_live_... / pk_test_...

const SECRET      = process.env.STRIPE_SECRET_KEY;
const PUBLISHABLE = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_API  = "https://api.stripe.com/v1";

const TIERS = {
  plus: { name: "FORGEAPC Plus", monthly: Number(process.env.PRICE_PLUS)        || 2,  annual: Number(process.env.PRICE_PLUS_ANNUAL)  || 12 },
  pro:  { name: "FORGEAPC Pro",  monthly: Number(process.env.PRICE_PRO)         || 5,  annual: Number(process.env.PRICE_PRO_ANNUAL)   || 18 },
  max:  { name: "FORGEAPC Max",  monthly: Number(process.env.PRICE_MAX)         || 8,  annual: Number(process.env.PRICE_MAX_ANNUAL)   || 55 },
};

async function stripeFetch(path, { method = "GET", form } = {}) {
  const opts = {
    method,
    headers: { Authorization: "Bearer " + SECRET, "Content-Type": "application/x-www-form-urlencoded", "Stripe-Version": "2023-10-16" },
  };
  if (form) opts.body = new URLSearchParams(form).toString();
  const r    = await fetch(STRIPE_API + path, opts);
  const data = await r.json();
  if (!r.ok) throw new Error((data?.error?.message) || ("Stripe " + r.status));
  return data;
}

export default async function handler(req, res) {
  if (!SECRET || !PUBLISHABLE) {
    return res.status(500).json({ error: "Payments aren't connected yet. Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in Vercel." });
  }

  try {
    // GET ?subscription_id=xxx — status check after payment
    if (req.method === "GET") {
      const sid = req.query?.subscription_id;
      if (!sid) return res.status(400).json({ error: "subscription_id required" });
      const sub = await stripeFetch("/subscriptions/" + encodeURIComponent(sid));
      const tierKey = sub?.metadata?.tier || null;
      return res.status(200).json({ status: sub.status, tier: tierKey });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const tierKey = body.tier;
      const interval = body.interval === "year" ? "year" : "month";
      const tier = TIERS[tierKey];
      if (!tier) return res.status(400).json({ error: "Unknown plan." });

      const dollars = interval === "year" ? tier.annual : tier.monthly;

      // 1. Create customer — name shows in Stripe dashboard so you know who bought
      const custForm = {};
      if (body.email)    custForm.email = body.email;
      if (body.username) custForm.name  = body.username;
      const customer = await stripeFetch("/customers", { method: "POST", form: custForm });

      // 2. Create product
      const productName = tier.name + (interval === "year" ? " (Annual)" : " (Monthly)");
      const product = await stripeFetch("/products", { method: "POST", form: { name: productName } });

      // 3. Create subscription — attach tier + interval + username as metadata
      const sub = await stripeFetch("/subscriptions", {
        method: "POST",
        form: {
          customer: customer.id,
          "items[0][price_data][currency]": "usd",
          "items[0][price_data][unit_amount]": String(Math.round(dollars * 100)),
          "items[0][price_data][recurring][interval]": interval,
          "items[0][price_data][product]": product.id,
          payment_behavior: "default_incomplete",
          "payment_settings[save_default_payment_method]": "on_subscription",
          "expand[0]": "latest_invoice",
          "metadata[tier]": tierKey,
          "metadata[interval]": interval,
          "metadata[username]": body.username || "",
        },
      });

      // 4. Get the payment intent ID from the invoice, then fetch it for the client_secret
      const invoicePaymentIntent = sub?.latest_invoice?.payment_intent;
      if (!invoicePaymentIntent) throw new Error("No payment intent on invoice — subscription may already be active.");

      const piId = typeof invoicePaymentIntent === "object" ? invoicePaymentIntent.id : invoicePaymentIntent;
      const pi   = await stripeFetch("/payment_intents/" + encodeURIComponent(piId));

      return res.status(200).json({
        clientSecret:   pi.client_secret,
        publishableKey: PUBLISHABLE,
        subscriptionId: sub.id,
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    res.status(500).json({ error: (e?.message) || "Checkout failed" });
  }
}
