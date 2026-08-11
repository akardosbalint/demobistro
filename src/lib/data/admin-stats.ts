import "server-only";
import { listBookings } from "@/lib/data/bookings";
import { getRestaurant } from "@/lib/data/restaurant";

const AVERAGE_TICKET_HUF = 8500; // durva becslés fejenkénti átlagos költésre (nincs valós POS-integráció)

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export interface AdminStats {
  todayBookingsCount: number;
  todayGuestsCount: number;
  weeklyEstimatedRevenue: number;
  occupancyRate: number; // 0-100, mai foglalt létszám / max napi vendégszám
  noShowRate: number; // 0-100, elmúlt 30 nap
  upcomingBookingsCount: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = toIsoDate(today);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);

  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [restaurant, weekBookings, monthBookings, todayBookings] = await Promise.all([
    getRestaurant(),
    listBookings({ from: toIsoDate(weekAgo), to: todayIso }),
    listBookings({ from: toIsoDate(monthAgo), to: todayIso }),
    listBookings({ from: todayIso, to: todayIso }),
  ]);

  const activeToday = todayBookings.filter((b) => b.booking_status !== "cancelled");
  const todayGuestsCount = activeToday.reduce((sum, b) => sum + b.guest_count, 0);

  const activeWeek = weekBookings.filter((b) => b.booking_status !== "cancelled");
  const weeklyEstimatedRevenue = activeWeek.reduce(
    (sum, b) => sum + b.guest_count * AVERAGE_TICKET_HUF,
    0
  );

  const noShowEligible = monthBookings.filter((b) =>
    ["checked-in", "no-show", "confirmed"].includes(b.booking_status)
  );
  const noShowCount = monthBookings.filter((b) => b.booking_status === "no-show").length;
  const noShowRate = noShowEligible.length > 0 ? (noShowCount / noShowEligible.length) * 100 : 0;

  const occupancyRate =
    restaurant.max_daily_guests > 0
      ? Math.min(100, (todayGuestsCount / restaurant.max_daily_guests) * 100)
      : 0;

  return {
    todayBookingsCount: activeToday.length,
    todayGuestsCount,
    weeklyEstimatedRevenue,
    occupancyRate,
    noShowRate,
    upcomingBookingsCount: activeToday.filter((b) => b.booking_status === "confirmed").length,
  };
}
