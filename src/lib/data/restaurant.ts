import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

export async function updateRestaurant(patch: Partial<Restaurant>): Promise<Restaurant> {
  if (!isSupabaseConfigured) {
    Object.assign(mockRestaurant, patch, { updated_at: new Date().toISOString() });
    return mockRestaurant;
  }

  const current = await getRestaurant();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("restaurants")
    .update(patch)
    .eq("id", current.id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
