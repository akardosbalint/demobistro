import type { Database, BookingStatus } from "./database";

export type MenuCategory = Database["public"]["Tables"]["menu_categories"]["Row"];
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Unavailability = Database["public"]["Tables"]["unavailability"]["Row"];
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];
export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

export type { BookingStatus };

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

export interface BookingFormValues {
  bookingDate: string;
  bookingTime: string;
  guestCount: number;
  tableType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  dietaryRestrictions: string[];
}
