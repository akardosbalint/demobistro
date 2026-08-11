// A Supabase csak akkor aktív, ha a szükséges kulcsok be vannak állítva.
// Enélkül az app mock adatokkal fut, hogy a UI önmagában is tesztelhető legyen.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
