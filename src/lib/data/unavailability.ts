import "server-only";
import { randomUUID } from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { mockUnavailability } from "@/lib/mock-data";
import type { Unavailability } from "@/types";

export async function listUnavailability(): Promise<Unavailability[]> {
  if (!isSupabaseConfigured) {
    return mockUnavailability.slice().sort((a, b) => a.date.localeCompare(b.date));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("unavailability").select("*").order("date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export interface CreateUnavailabilityInput {
  date: string;
  reason?: string | null;
  full_day?: boolean;
}

export async function addUnavailability(input: CreateUnavailabilityInput): Promise<Unavailability> {
  if (!isSupabaseConfigured) {
    const row: Unavailability = {
      id: randomUUID(),
      restaurant_id: null,
      date: input.date,
      full_day: input.full_day ?? true,
      start_time: null,
      end_time: null,
      reason: input.reason ?? null,
      created_at: new Date().toISOString(),
    };
    mockUnavailability.push(row);
    return row;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("unavailability")
    .insert({ date: input.date, reason: input.reason ?? null, full_day: input.full_day ?? true })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function removeUnavailability(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = mockUnavailability.findIndex((u) => u.id === id);
    if (idx !== -1) mockUnavailability.splice(idx, 1);
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("unavailability").delete().eq("id", id);
  if (error) throw error;
}
