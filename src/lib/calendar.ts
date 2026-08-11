import { siteConfig } from "@/lib/site-config";
import type { Booking } from "@/types";

const RESERVATION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 óra — az emlékeztető üzenetekben is ez a feltételezett időtartam

function formatGoogleCalendarDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

export function buildGoogleCalendarUrl(booking: Booking): string {
  const start = new Date(`${booking.booking_date}T${booking.booking_time}`);
  const end = new Date(start.getTime() + RESERVATION_DURATION_MS);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Asztalfoglalás – ${siteConfig.name}`,
    dates: `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`,
    details: `Asztalfoglalás ${booking.guest_count} főre.\nVisszaigazoló kód: ${booking.confirmation_token.slice(0, 8)}\nTelefon: ${siteConfig.phone}`,
    location: siteConfig.address,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
