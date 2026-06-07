export function AdminNavbar() {
  return (
    <header className="flex flex-col gap-3 border-b border-border bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-foreground/60">Admin shell</p>
        <h1 className="text-lg font-semibold text-foreground">
          Green Life Rwanda Admin
        </h1>
      </div>
      <div className="flex items-center gap-3 text-sm text-foreground/70">
        <span>Current time placeholder</span>
        <button
          className="rounded-md border border-border px-3 py-2 text-sm hover:bg-background"
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
