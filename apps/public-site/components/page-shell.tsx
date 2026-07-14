type PageShellProps = {
  title: string;
  description: string;
  note?: string;
};

export function PageShell({
  title,
  description,
  note = "Real Green for Life Rwanda content will be added in a later phase."
}: PageShellProps) {
  return (
    <section className="container section">
      <p className="eyebrow">
        Page shell
      </p>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{note}</p>
    </section>
  );
}
