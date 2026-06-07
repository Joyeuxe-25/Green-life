type AdminPlaceholderProps = {
  title: string;
  description: string;
};

export function AdminPlaceholder({
  title,
  description
}: AdminPlaceholderProps) {
  return (
    <section className="rounded-lg border border-border bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Placeholder
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/70">
        {description}
      </p>
      <div className="mt-6 rounded-md border border-dashed border-border bg-background p-4 text-sm text-foreground/60">
        Real admin functionality, forms, API calls, and authentication will be
        added in later phases.
      </div>
    </section>
  );
}
