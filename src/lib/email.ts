import "server-only";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";
import { formatDateHu } from "@/lib/utils";
import type { Booking } from "@/types";

// Google Workspace / Gmail SMTP-n keresztül küldünk e-mailt egy dedikált postafiókból
// (pl. asztal@zoldsarok.hu), alkalmazásjelszóval vagy Workspace SMTP-relay hitelesítéssel.
const workspaceUser = process.env.GOOGLE_WORKSPACE_EMAIL;
const workspacePassword = process.env.GOOGLE_WORKSPACE_APP_PASSWORD;
const fromAddress = process.env.GOOGLE_WORKSPACE_FROM_NAME
  ? `"${process.env.GOOGLE_WORKSPACE_FROM_NAME}" <${workspaceUser}>`
  : `"Zöld Sarok" <${workspaceUser}>`;

const transporter =
  workspaceUser && workspacePassword
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: workspaceUser, pass: workspacePassword },
        // Explicit timeoutok, hogy egy hálózati/hitelesítési probléma gyorsan,
        // egyértelmű hibaként bukjon el ahelyett, hogy a szerverless függvényt
        // némán kifuttatná az időkorlátig.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })
    : null;

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

// Vendég által megadott mezők (guest_name, table_type, stb.) sosem kerülhetnek escapelés
// nélkül a kimenő HTML e-mailbe — enélkül egy `<img src=x onerror=...>` jellegű name
// tartalom HTML-injekciót engedne a saját e-mail kliensünkből küldött levelekbe.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Google Workspace hitelesítő adatok hiányában konzolra írjuk az e-mailt (fejlesztői stub),
// így a hívási lánc production-ready marad kulcsok nélkül is.
async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (!transporter) {
    console.info(`[email:stub] → ${to} | ${subject}`);
    return { id: "stub", stubbed: true };
  }

  try {
    const info = await transporter.sendMail({ from: fromAddress, to, subject, html });
    return info;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ismeretlen hiba.";
    throw new Error(`Google Workspace e-mail küldési hiba: ${message}`);
  }
}

function bookingSummaryHtml(booking: Booking, heading: string, extra?: string) {
  return `
    <div style="font-family: Georgia, serif; color: #26331d; max-width: 480px; margin: 0 auto;">
      <h1 style="font-weight: 500;">${escapeHtml(heading)}</h1>
      <p>Kedves ${escapeHtml(booking.guest_name)}!</p>
      ${extra ? `<p>${escapeHtml(extra)}</p>` : ""}
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tbody>
          <tr><td style="padding: 6px 0; color: #6d4029;">Dátum</td><td style="padding: 6px 0;">${escapeHtml(formatDateHu(booking.booking_date))}</td></tr>
          <tr><td style="padding: 6px 0; color: #6d4029;">Időpont</td><td style="padding: 6px 0;">${escapeHtml(booking.booking_time)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6d4029;">Létszám</td><td style="padding: 6px 0;">${booking.guest_count} fő</td></tr>
          <tr><td style="padding: 6px 0; color: #6d4029;">Asztal</td><td style="padding: 6px 0;">${escapeHtml(booking.table_type)}</td></tr>
        </tbody>
      </table>
      <p style="color: #6d4029;">${escapeHtml(siteConfig.address)} · ${escapeHtml(siteConfig.phone)}</p>
      <p>Szeretettel várunk!<br/>${escapeHtml(siteConfig.name)} csapata</p>
    </div>
  `;
}

export async function sendBookingConfirmationEmail(booking: Booking) {
  return sendEmail({
    to: booking.guest_email,
    subject: `Foglalás visszaigazolva — ${siteConfig.name}`,
    html: bookingSummaryHtml(booking, "Foglalásod visszaigazolva! ✅"),
  });
}

export async function sendBookingCancellationEmail(booking: Booking) {
  return sendEmail({
    to: booking.guest_email,
    subject: `Foglalás lemondva — ${siteConfig.name}`,
    html: bookingSummaryHtml(
      booking,
      "Foglalásod lemondva",
      "Sajnáljuk, hogy nem tartunk ezúttal asztalt — reméljük, hamarosan újra vendégül láthatunk."
    ),
  });
}

export async function sendBookingReminderEmail(booking: Booking, hoursBefore: 24 | 2) {
  return sendEmail({
    to: booking.guest_email,
    subject:
      hoursBefore === 24
        ? `Emlékeztető: holnapi asztalfoglalásod — ${siteConfig.name}`
        : `Emlékeztető: 2 óra múlva várunk! — ${siteConfig.name}`,
    html: bookingSummaryHtml(
      booking,
      hoursBefore === 24 ? "Emlékeztető a holnapi foglalásodra" : "Hamarosan találkozunk!"
    ),
  });
}

export async function sendReviewInviteEmail(booking: Booking, reviewUrl: string) {
  return sendEmail({
    to: booking.guest_email,
    subject: `Milyen volt a látogatásod? — ${siteConfig.name}`,
    html: `
      <div style="font-family: Georgia, serif; color: #26331d; max-width: 480px; margin: 0 auto;">
        <h1 style="font-weight: 500;">Köszönjük a látogatást!</h1>
        <p>Kedves ${escapeHtml(booking.guest_name)}! Örülnénk, ha pár mondatban megosztanád velünk a tapasztalataidat.</p>
        <p><a href="${escapeHtml(reviewUrl)}" style="display:inline-block; padding: 12px 24px; background:#49632c; color:#fff; border-radius: 999px; text-decoration:none;">Vélemény írása</a></p>
        <p>${escapeHtml(siteConfig.name)} csapata</p>
      </div>
    `,
  });
}
