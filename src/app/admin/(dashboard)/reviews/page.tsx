import type { Metadata } from "next";
import { ReviewsManager } from "@/components/admin/reviews-manager";

export const metadata: Metadata = { title: "Vélemények" };

export default function AdminReviewsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="section-heading-eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Vélemények moderálása</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Csak a &bdquo;Publikus&rdquo; vélemények jelennek meg a főoldal carouselben.
        </p>
      </div>
      <ReviewsManager />
    </div>
  );
}
