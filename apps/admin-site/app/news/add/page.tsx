import { AdminShell } from "@/components/admin-shell";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export default function AddNewsPage() {
  return (
    <AdminShell>
      <AdminPlaceholder
        title="Add News"
        description="Placeholder shell for creating news later."
      />
    </AdminShell>
  );
}
