export default function MenuLoading() {
  return (
    <div className="pt-20">
      <div className="border-b border-border/60 py-16 text-center">
        <div className="container-narrow">
          <div className="mx-auto h-4 w-24 skeleton-shimmer rounded-full" />
          <div className="mx-auto mt-4 h-12 w-48 skeleton-shimmer rounded-full" />
          <div className="mx-auto mt-4 h-4 w-80 skeleton-shimmer rounded-full" />
        </div>
      </div>
      <div className="container py-10">
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-3xl border border-border/60">
              <div className="aspect-[4/3] skeleton-shimmer" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 skeleton-shimmer rounded-full" />
                <div className="h-3 w-full skeleton-shimmer rounded-full" />
                <div className="h-3 w-3/4 skeleton-shimmer rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
