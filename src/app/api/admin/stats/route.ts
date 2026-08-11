import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/data/admin-stats";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const stats = await getAdminStats();
  return NextResponse.json({ stats });
}
