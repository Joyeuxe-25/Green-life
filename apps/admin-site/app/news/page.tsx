import { AdminShell } from "@/components/admin-shell";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export default function NewsPage() {
  return (
    <AdminShell>
      <AdminPlaceholder
        title="News"
        description="Placeholder shell for future news management."
      />
    </AdminShell>
  );
}
