import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "menu-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// POST /api/admin/upload — kép feltöltés Supabase Storage-ba (multipart/form-data, mezőnév: "file")
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        error:
          "A képfeltöltés Supabase Storage konfigurációt igényel. Demo módban add meg a kép URL-jét kézzel.",
      },
      { status: 501 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Hiányzó fájl." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Csak JPEG, PNG, WEBP vagy AVIF kép tölthető fel." }, { status: 415 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "A fájl mérete legfeljebb 5 MB lehet." }, { status: 413 });
  }

  const supabase = createAdminClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
