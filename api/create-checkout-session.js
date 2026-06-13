// api/create-checkout-session.js — Vercel serverless function
// Creates a Stripe Subscription and returns the confirmation_secret so the
// frontend can mount a Payment Element (native-looking card fields, fully
// styled to match the app). No embedded-checkout box, no "app in an app".
//
// SETUP — two env vars in Vercel:
//   STRIPE_SECRET_KEY      = sk_live_... / sk_test_...
//   STRIPE_PUBLISHABLE_KEY = pk_live_... / pk_test_...

const SECRET     = process.env.STRIPE_SECRET_KEY;
const PUBLISHABLE = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_API  = "https://api.stripe.com/v1";

const TIERS = {
  plus: { name: "FORGEAPC Plus", dollars: Number(process.env.PRICE_PLUS) || 2 },
  pro:  { name: "FORGEAPC Pro",  dollars: Number(process.env.PRICE_PRO)  || 5 },
  max:  { name: "FORGEAPC Max",  dollars: Number(process.env.PRICE_MAX)  || 8 },
};

async function stripeFetch(path, { method = "GET", form } = {}) {
  const opts = {
    method,
    headers: { Authorization: "Bearer " + SECRET, "Content-Type": "application/x-www-form-urlencoded" },
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
      return res.status(200).json({ status: sub.status });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const tier = TIERS[body.tier];
      if (!tier) return res.status(400).json({ error: "Unknown plan." });

      // Create a customer (required for subscriptions)
      const custForm = {};
      if (body.email) custForm.email = body.email;
      const customer = await stripeFetch("/customers", { method: "POST", form: custForm });

      // Create an inline product for this tier, then reference it in price_data
      const product = await stripeFetch("/products", { method: "POST", form: { name: tier.name } });

      // Create subscription with payment_behavior=default_incomplete so it
      // stays unpaid until the frontend confirms the Payment Element
      const subForm = {
        customer: customer.id,
        "items[0][price_data][currency]": "usd",
        "items[0][price_data][unit_amount]": String(Math.round(tier.dollars * 100)),
        "items[0][price_data][recurring][interval]": "month",
        "items[0][price_data][product]": product.id,
        payment_behavior: "default_incomplete",
        "payment_settings[save_default_payment_method]": "on_subscription",
        "expand[0]": "latest_invoice",
        "expand[1]": "latest_invoice.confirmation_secret",
      };
      const sub = await stripeFetch("/subscriptions", { method: "POST", form: subForm });

      // confirmation_secret is the client_secret for the Payment Element
      const clientSecret =
        sub?.latest_invoice?.confirmation_secret ||
        sub?.latest_invoice?.payment_intent?.client_secret;

      if (!clientSecret) throw new Error("Could not get payment secret from Stripe.");

      return res.status(200).json({
        clientSecret,
        publishableKey: PUBLISHABLE,
        subscriptionId: sub.id,
      });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    res.status(500).json({ error: (e?.message) || "Checkout failed" });
  }
}
