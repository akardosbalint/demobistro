import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mockReviews } from "@/lib/mock-data";
import type { Review } from "@/types";

export async function getPublishedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    return mockReviews.filter((r) => r.is_published);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
