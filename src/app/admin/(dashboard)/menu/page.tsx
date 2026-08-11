import type { Metadata } from "next";
import { MenuManager } from "@/components/admin/menu-manager";

export const metadata: Metadata = { title: "Étlap kezelő" };

export default function AdminMenuPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="section-heading-eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Étlap kezelő</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Húzd a fogantyút a kategóriák és ételek sorrendjének módosításához.
        </p>
      </div>
      <MenuManager />
    </div>
  );
}
