import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";
import { formatDateHu } from "@/lib/utils";
import type { Booking } from "@/types";

const resendApiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL ?? "Zöld Sarok <asztal@zoldsarok.hu>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
}

// Resend API kulcs hiányában konzolra írjuk az e-mailt (fejlesztői stub),
// így a hívási lánc production-ready marad kulcs nélkül is.
async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (!resend) {
    console.info(`[email:stub] → ${to} | ${subject}`);
    return { id: "stub", stubbed: true };
  }

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
  });

  if (error) throw new Error(`Resend hiba: ${error.message}`);
  return data;
}

function bookingSummaryHtml(booking: Booking, heading: string, extra?: string) {
  return `
    <div style="font-family: Georgia, serif; color: #26331d; max-width: 480px; margin: 0 auto;">
      <h1 style="font-weight: 500;">${heading}</h1>
      <p>Kedves ${booking.guest_name}!</p>
      ${extra ? `<p>${extra}</p>` : ""}
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tbody>
          <tr><td style="padding: 6px 0; color: #6d4029;">Dátum</td><td style="padding: 6px 0;">${formatDateHu(booking.booking_date)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6d4029;">Időpont</td><td style="padding: 6px 0;">${booking.booking_time}</td></tr>
          <tr><td style="padding: 6px 0; color: #6d4029;">Létszám</td><td style="padding: 6px 0;">${booking.guest_count} fő</td></tr>
          <tr><td style="padding: 6px 0; color: #6d4029;">Asztal</td><td style="padding: 6px 0;">${booking.table_type}</td></tr>
        </tbody>
      </table>
      <p style="color: #6d4029;">${siteConfig.address} · ${siteConfig.phone}</p>
      <p>Szeretettel várunk!<br/>${siteConfig.name} csapata</p>
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
        <p>Kedves ${booking.guest_name}! Örülnénk, ha pár mondatban megosztanád velünk a tapasztalataidat.</p>
        <p><a href="${reviewUrl}" style="display:inline-block; padding: 12px 24px; background:#49632c; color:#fff; border-radius: 999px; text-decoration:none;">Vélemény írása</a></p>
        <p>${siteConfig.name} csapata</p>
      </div>
    `,
  });
}
