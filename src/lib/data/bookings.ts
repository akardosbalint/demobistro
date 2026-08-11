import "server-only";
import { randomUUID } from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Booking, BookingStatus } from "@/types";
import { mockUnavailability } from "@/lib/mock-data";

// Demo (Supabase nélküli) módban egy folyamat-memóriabeli tömb szimulálja a `bookings` táblát,
// hogy a foglalási folyamat és az admin felület helyben is tesztelhető legyen.
const mockBookingsStore: Booking[] = [];

export interface CreateBookingInput {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_count: number;
  booking_date: string;
  booking_time: string;
  table_type: string;
  special_requests?: string | null;
  dietary_restrictions: string[];
  deposit_required?: boolean;
  deposit_amount?: number | null;
}

function toBookingRow(input: CreateBookingInput): Booking {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    restaurant_id: null,
    guest_name: input.guest_name,
    guest_email: input.guest_email,
    guest_phone: input.guest_phone,
    guest_count: input.guest_count,
    booking_date: input.booking_date,
    booking_time: input.booking_time,
    table_type: input.table_type,
    special_requests: input.special_requests ?? null,
    dietary_restrictions: input.dietary_restrictions,
    booking_status: "confirmed",
    confirmation_token: randomUUID(),
    reminder_sent_24h: false,
    reminder_sent_2h: false,
    review_invite_sent: false,
    deposit_required: input.deposit_required ?? false,
    deposit_amount: input.deposit_amount ?? null,
    deposit_paid: false,
    stripe_payment_intent_id: null,
    admin_note: null,
    created_at: now,
    updated_at: now,
  };
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  if (!isSupabaseConfigured) {
    const row = toBookingRow(input);
    mockBookingsStore.unshift(row);
    return row;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      guest_name: input.guest_name,
      guest_email: input.guest_email,
      guest_phone: input.guest_phone,
      guest_count: input.guest_count,
      booking_date: input.booking_date,
      booking_time: input.booking_time,
      table_type: input.table_type,
      special_requests: input.special_requests ?? null,
      dietary_restrictions: input.dietary_restrictions,
      deposit_required: input.deposit_required ?? false,
      deposit_amount: input.deposit_amount ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getBookingsForDate(date: string): Promise<Booking[]> {
  if (!isSupabaseConfigured) {
    return mockBookingsStore.filter(
      (b) => b.booking_date === date && b.booking_status !== "cancelled"
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_date", date)
    .neq("booking_status", "cancelled");

  if (error) throw error;
  return data ?? [];
}

export async function getBookingByToken(token: string): Promise<Booking | null> {
  if (!isSupabaseConfigured) {
    return mockBookingsStore.find((b) => b.confirmation_token === token) ?? null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("confirmation_token", token)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  if (!isSupabaseConfigured) {
    return mockBookingsStore.find((b) => b.id === id) ?? null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("bookings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export interface BookingFilters {
  from?: string;
  to?: string;
  status?: BookingStatus;
}

export async function listBookings(filters: BookingFilters = {}): Promise<Booking[]> {
  if (!isSupabaseConfigured) {
    return mockBookingsStore
      .filter((b) => (filters.from ? b.booking_date >= filters.from : true))
      .filter((b) => (filters.to ? b.booking_date <= filters.to : true))
      .filter((b) => (filters.status ? b.booking_status === filters.status : true))
      .sort((a, b) => a.booking_date.localeCompare(b.booking_date) || a.booking_time.localeCompare(b.booking_time));
  }

  const supabase = createAdminClient();
  let query = supabase.from("bookings").select("*").order("booking_date", { ascending: true });
  if (filters.from) query = query.gte("booking_date", filters.from);
  if (filters.to) query = query.lte("booking_date", filters.to);
  if (filters.status) query = query.eq("booking_status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<Booking> {
  if (!isSupabaseConfigured) {
    const idx = mockBookingsStore.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Foglalás nem található.");
    mockBookingsStore[idx] = {
      ...mockBookingsStore[idx],
      ...patch,
      updated_at: new Date().toISOString(),
    };
    return mockBookingsStore[idx];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBooking(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = mockBookingsStore.findIndex((b) => b.id === id);
    if (idx !== -1) mockBookingsStore.splice(idx, 1);
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

export async function getUnavailableDates(from: string, to: string) {
  if (!isSupabaseConfigured) {
    return mockUnavailability.filter((u) => u.date >= from && u.date <= to);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("unavailability")
    .select("*")
    .gte("date", from)
    .lte("date", to);

  if (error) throw error;
  return data ?? [];
}
