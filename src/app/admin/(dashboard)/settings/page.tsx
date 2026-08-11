import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Beállítások" };

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="section-heading-eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Beállítások</h1>
      </div>
      <SettingsForm />
    </div>
  );
}
