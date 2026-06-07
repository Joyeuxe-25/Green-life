import { AdminShell } from "@/components/admin-shell";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export default function DashboardPage() {
  return (
    <AdminShell>
      <AdminPlaceholder
        title="Dashboard"
        description="Placeholder shell for the future admin dashboard overview."
      />
    </AdminShell>
  );
}
