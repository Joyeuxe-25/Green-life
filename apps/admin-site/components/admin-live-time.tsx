"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const formatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

export function AdminLiveTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const intervalId = window.setInterval(() => setNow(new Date()), 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm">
      <Clock3 aria-hidden="true" className="text-primary" size={17} />
      <span suppressHydrationWarning>
        {now ? formatter.format(now) : "Loading time..."}
      </span>
    </div>
  );
}
