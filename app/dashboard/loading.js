export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-secondary/60" />
          <div className="h-4 w-64 rounded-lg bg-secondary/40" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-secondary/60" />
      </div>

      {/* Cards row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-card/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-lg bg-secondary/60" />
              <div className="h-8 w-8 rounded-lg bg-secondary/60" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-secondary/80" />
            <div className="h-3 w-32 rounded-md bg-secondary/40" />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card/60 p-5 space-y-4">
          <div className="h-5 w-40 rounded-lg bg-secondary/60" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/60 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded-lg bg-secondary/60" />
                <div className="h-3 w-1/2 rounded-md bg-secondary/40" />
              </div>
              <div className="h-7 w-16 rounded-lg bg-secondary/50" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/60 p-5 space-y-4">
          <div className="h-5 w-32 rounded-lg bg-secondary/60" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded-md bg-secondary/60" />
                <div className="h-3 w-8 rounded-md bg-secondary/40" />
              </div>
              <div className="h-2 w-full rounded-full bg-secondary/40">
                <div
                  className="h-2 rounded-full bg-primary/30"
                  style={{ width: `${60 - i * 8}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}