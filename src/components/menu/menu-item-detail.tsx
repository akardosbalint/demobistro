"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { BlurImage } from "@/components/menu/blur-image";
import { DishPlaceholder } from "@/components/menu/dish-placeholder";
import { DietaryBadge } from "@/components/menu/dietary-icons";
import { AllergenTag } from "@/components/menu/dietary-icons";
import { PriceTag } from "@/components/menu/price-tag";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { MenuItem } from "@/types";

interface MenuItemDetailProps {
  item: MenuItem | null;
  onOpenChange: (open: boolean) => void;
}

function DetailBody({ item }: { item: MenuItem }) {
  return (
    <>
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        {item.image_url ? (
          <BlurImage
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(min-width: 640px) 32rem, 100vw"
            className="object-cover"
          />
        ) : (
          <DishPlaceholder seed={item.id} name={item.name} />
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {item.is_new && (
            <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground shadow">
              Új
            </span>
          )}
          {item.seasonal && (
            <span className="rounded-full bg-avocado-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-cream-50 shadow">
              Szezonális
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle asChild>
              <h2 className="font-display text-3xl">{item.name}</h2>
            </DialogTitle>
            {item.portion_size && (
              <p className="mt-1 text-sm text-muted-foreground">Adag: {item.portion_size}</p>
            )}
          </div>
          <PriceTag value={item.price} className="font-display text-2xl text-primary" />
        </div>

        <DialogDescription asChild>
          <p className="text-base leading-relaxed text-foreground/80">{item.description}</p>
        </DialogDescription>

        {item.dietary_info.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.dietary_info.map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {item.allergens.length > 0 && (
          <div>
            <p className="section-heading-eyebrow mb-2">Allergének</p>
            <div className="flex flex-wrap gap-2">
              {item.allergens.map((a) => (
                <AllergenTag key={a} allergen={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function MenuItemDetail({ item, onOpenChange }: MenuItemDetailProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const open = Boolean(item);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl overflow-hidden rounded-3xl p-0 [&>button]:bg-cream-50/80 [&>button]:text-avocado-900">
          {item && <DetailBody item={item} />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92vh] flex-col overflow-hidden rounded-t-3xl p-0 [&>button]:bg-cream-50/80 [&>button]:text-avocado-900"
      >
        <div className="overflow-y-auto">{item && <DetailBody item={item} />}</div>
      </SheetContent>
    </Sheet>
  );
}
