import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAllReviews } from "@/lib/data/reviews";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const reviews = await listAllReviews();
  return NextResponse.json({ reviews });
}
