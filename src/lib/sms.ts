import "server-only";
import twilio from "twilio";
import { formatDateHu } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import type { Booking } from "@/types";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Twilio kulcsok hiányában konzolra írjuk az SMS-t (fejlesztői stub).
async function sendSms(to: string, body: string) {
  if (!client || !fromNumber) {
    console.info(`[sms:stub] → ${to} | ${body}`);
    return { sid: "stub", stubbed: true };
  }

  return client.messages.create({ to, from: fromNumber, body });
}

export async function sendBookingConfirmationSms(booking: Booking) {
  return sendSms(
    booking.guest_phone,
    `${siteConfig.name}: Foglalásod visszaigazolva ${formatDateHu(booking.booking_date)} ${booking.booking_time}-kor, ${booking.guest_count} főre. Várunk szeretettel!`
  );
}

export async function sendBookingReminderSms(booking: Booking, hoursBefore: 24 | 2) {
  const text =
    hoursBefore === 24
      ? `${siteConfig.name}: Emlékeztetünk, hogy holnap ${booking.booking_time}-kor asztalt foglaltál ${booking.guest_count} főre.`
      : `${siteConfig.name}: 2 óra múlva várunk ${booking.booking_time}-kor! Címünk: ${siteConfig.address}`;
  return sendSms(booking.guest_phone, text);
}

export async function sendBookingCancellationSms(booking: Booking) {
  return sendSms(
    booking.guest_phone,
    `${siteConfig.name}: A(z) ${formatDateHu(booking.booking_date)} ${booking.booking_time}-i foglalásod lemondva. Reméljük hamarosan újra látunk!`
  );
}
