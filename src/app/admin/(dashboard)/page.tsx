import Link from "next/link";
import { CalendarCheck, Users, TrendingUp, PercentCircle, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/data/admin-stats";
import { listBookings } from "@/lib/data/bookings";
import { bookingStatusLabels } from "@/lib/site-config";
import { formatCurrencyHUF } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "success" | "secondary" | "destructive"> = {
  confirmed: "default",
  "checked-in": "success",
  "no-show": "destructive",
  cancelled: "secondary",
};

export default async function AdminDashboardPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [stats, todayBookings] = await Promise.all([
    getAdminStats(),
    listBookings({ from: today, to: today }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="section-heading-eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Áttekintés</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<CalendarCheck className="h-5 w-5" />}
          label="Mai foglalások"
          value={stats.todayBookingsCount}
          accent="avocado"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Mai vendégek"
          value={stats.todayGuestsCount}
          suffix=" fő"
          accent="gold"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Heti becsült bevétel"
          value={stats.weeklyEstimatedRevenue}
          accent="clay"
        />
        <StatCard
          icon={<PercentCircle className="h-5 w-5" />}
          label="Mai telítettség"
          value={stats.occupancyRate}
          decimals={0}
          suffix="%"
          accent="avocado"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-dashed">
          <CardContent className="flex items-center gap-4 p-6">
            <AlertTriangle className="h-8 w-8 text-clay-500" />
            <div>
              <p className="text-sm text-muted-foreground">No-show arány (30 nap)</p>
              <p className="font-display text-2xl">{stats.noShowRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        <p className="self-center text-sm text-muted-foreground">
          A heti bevétel becsült érték (átlagos fejenkénti költés × vendégszám) — pontos
          bevételkövetéshez POS-integráció szükséges.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mai foglalások</CardTitle>
          <Link href="/admin/bookings" className="text-sm text-primary hover:underline">
            Összes megtekintése →
          </Link>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Mára még nincs foglalás.
            </p>
          ) : (
            <div className="divide-y divide-border/60">
              {todayBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">{booking.guest_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.booking_time} · {booking.guest_count} fő
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {formatCurrencyHUF(booking.guest_count * 8500)} becsült
                    </span>
                    <Badge variant={statusVariant[booking.booking_status]}>
                      {bookingStatusLabels[booking.booking_status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
