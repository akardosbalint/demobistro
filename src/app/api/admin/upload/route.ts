import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const BUCKET = "menu-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// A böngésző által küldött `file.type` (Content-Type) a kliens állítja be, tehát trivilisan
// hamisítható — egy .html/.svg fájl is bejelentkezhet "image/jpeg"-ként. Ehelyett a fájl
// tényleges bájtjait ("magic number") vizsgáljuk, és abból derítjük a valós formátumot.
function detectImageType(bytes: Uint8Array): { contentType: string; extension: string } | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { contentType: "image/png", extension: "png" };
  }
  const ascii = (start: number, len: number) =>
    String.fromCharCode(...Array.from(bytes.slice(start, start + len)));
  if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    return { contentType: "image/webp", extension: "webp" };
  }
  if (ascii(4, 4) === "ftyp" && /avif|avis/.test(ascii(8, 4))) {
    return { contentType: "image/avif", extension: "avif" };
  }
  return null;
}

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
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "A fájl mérete legfeljebb 5 MB lehet." }, { status: 413 });
  }

  const buffer = await file.arrayBuffer();
  const detected = detectImageType(new Uint8Array(buffer).slice(0, 32));
  if (!detected) {
    return NextResponse.json(
      { error: "Csak valódi JPEG, PNG, WEBP vagy AVIF kép tölthető fel." },
      { status: 415 }
    );
  }

  const supabase = createAdminClient();
  const path = `${crypto.randomUUID()}.${detected.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: detected.contentType, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
