import { siteConfig } from "@/lib/site-config";

// Foglalási időpontok legenerálása a nyitvatartás és az intervallum alapján.
export function generateTimeSlots(): string[] {
  const { openTime, closeTime, slotIntervalMinutes, lastSeatingOffsetMinutes } =
    siteConfig.bookingSettings;

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toTimeStr = (mins: number) => {
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const start = toMinutes(openTime);
  const lastSeating = toMinutes(closeTime) - lastSeatingOffsetMinutes;

  const slots: string[] = [];
  for (let t = start; t <= lastSeating; t += slotIntervalMinutes) {
    slots.push(toTimeStr(t));
  }
  return slots;
}

export function isRestaurantClosedOn(date: Date): boolean {
  // A mintaadatokban a hétfő zárva nap — igazítsd az étterem tényleges nyitvatartásához.
  return date.getDay() === 1;
}

export function isDateInPast(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return target < today;
}
