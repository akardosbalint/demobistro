import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/menu-experience";
import { getMenuCategoriesWithItems } from "@/lib/data/menu";

export const metadata: Metadata = {
  title: "Étlap",
  description: "Szezonális, növényi alapú fogások — levesektől a desszertekig.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const categories = await getMenuCategoriesWithItems();

  return (
    <div className="pt-20">
      <div className="border-b border-border/60 bg-leaf-texture py-16 text-center">
        <div className="container-narrow">
          <p className="section-heading-eyebrow">Zöld Sarok</p>
          <h1 className="mt-3 font-display text-5xl italic sm:text-6xl">Étlap</h1>
          <p className="mx-auto mt-4 max-w-lg text-balance text-muted-foreground">
            Szezonális alapanyagokból, kézműves technikákkal készült fogásaink — minden tányér
            100%-ban növényi.
          </p>
        </div>
      </div>

      <MenuExperience categories={categories} />
    </div>
  );
}
