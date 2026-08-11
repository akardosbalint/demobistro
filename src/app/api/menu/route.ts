import { NextResponse } from "next/server";
import { getMenuCategoriesWithItems } from "@/lib/data/menu";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

// GET /api/menu — publikus étlap lekérdezés (kategóriák a hozzájuk tartozó elérhető ételekkel)
export async function GET() {
  try {
    const categories = await getMenuCategoriesWithItems();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Az étlap betöltése sikertelen." }, { status: 500 });
  }
}
