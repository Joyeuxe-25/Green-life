type PageShellProps = {
  title: string;
  description: string;
  note?: string;
};

export function PageShell({
  title,
  description,
  note = "Real Green Life Rwanda content will be added in a later phase."
}: PageShellProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Page shell
      </p>
      <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="max-w-3xl text-base leading-7 text-foreground/75">
        {description}
      </p>
      <p className="max-w-3xl rounded-md border border-dashed border-border bg-white/70 p-4 text-sm text-foreground/70">
        {note}
      </p>
    </section>
  );
}
