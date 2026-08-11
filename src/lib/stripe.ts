import "server-only";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(stripeSecretKey);

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2026-07-29.dahlia" })
  : null;
