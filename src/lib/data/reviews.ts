import "server-only";
import { randomUUID } from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mockReviews } from "@/lib/mock-data";
import type { Review } from "@/types";

export async function getPublishedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    return mockReviews.filter((r) => r.is_published);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface CreateReviewInput {
  restaurant_id: string | null;
  booking_id: string;
  guest_name: string;
  rating: number;
  comment?: string | null;
}

// Vendég által beküldött vélemény — moderálásig nem publikus (is_published: false).
export async function createReview(input: CreateReviewInput): Promise<Review> {
  if (!isSupabaseConfigured) {
    const review: Review = {
      id: randomUUID(),
      restaurant_id: input.restaurant_id,
      booking_id: input.booking_id,
      guest_name: input.guest_name,
      rating: input.rating,
      comment: input.comment ?? null,
      is_published: false,
      created_at: new Date().toISOString(),
    };
    mockReviews.push(review);
    return review;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      restaurant_id: input.restaurant_id,
      booking_id: input.booking_id,
      guest_name: input.guest_name,
      rating: input.rating,
      comment: input.comment ?? null,
      is_published: false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function listAllReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    return mockReviews.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setReviewPublished(id: string, isPublished: boolean): Promise<Review> {
  if (!isSupabaseConfigured) {
    const review = mockReviews.find((r) => r.id === id);
    if (!review) throw new Error("Vélemény nem található.");
    review.is_published = isPublished;
    return review;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .update({ is_published: isPublished })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
