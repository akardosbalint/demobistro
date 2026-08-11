// Kézzel írt típusok a Supabase séma alapján (supabase/migrations/0001_init.sql).
// Éles projektben cserélhető a `supabase gen types typescript` kimenetére.

export type BookingStatus = "confirmed" | "checked-in" | "no-show" | "cancelled";
export type DietaryTag = "vegan" | "gluten-free" | "nut-free";

export interface RestaurantHours {
  day: string;
  hours: string;
}

export interface TableConfigEntry {
  type: string;
  label: string;
  count: number;
  capacity: number;
}

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          hours: RestaurantHours[];
          max_daily_guests: number;
          table_config: TableConfigEntry[];
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["restaurants"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Row"]>;
        Relationships: [];
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["menu_categories"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["menu_categories"]["Row"]>;
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          dietary_info: string[];
          allergens: string[];
          is_available: boolean;
          seasonal: boolean;
          is_new: boolean;
          portion_size: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["menu_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["menu_items"]["Row"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          restaurant_id: string | null;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
          guest_count: number;
          booking_date: string;
          booking_time: string;
          table_type: string;
          special_requests: string | null;
          dietary_restrictions: string[];
          booking_status: BookingStatus;
          confirmation_token: string;
          reminder_sent_24h: boolean;
          reminder_sent_2h: boolean;
          review_invite_sent: boolean;
          deposit_required: boolean;
          deposit_amount: number | null;
          stripe_payment_intent_id: string | null;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string | null;
          booking_id: string | null;
          guest_name: string;
          rating: number;
          comment: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
      unavailability: {
        Row: {
          id: string;
          restaurant_id: string | null;
          date: string;
          full_day: boolean;
          start_time: string | null;
          end_time: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["unavailability"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["unavailability"]["Row"]>;
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          full_name: string | null;
          role: "owner" | "manager" | "staff";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_users"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
