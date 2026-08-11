import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mockRestaurant } from "@/lib/mock-data";
import type { Restaurant } from "@/types";

export async function getRestaurant(): Promise<Restaurant> {
  if (!isSupabaseConfigured) {
    return mockRestaurant;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("restaurants").select("*").limit(1).single();

  if (error || !data) return mockRestaurant;
  return data;
}
