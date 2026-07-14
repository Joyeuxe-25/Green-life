import { AdminShell } from "@/components/admin-shell";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export default function AdminHomePage() {
  return (
    <AdminShell>
      <AdminPlaceholder
        title="Green for Life Rwanda Admin"
        description="Root admin route shell for the future management website."
      />
    </AdminShell>
  );
}
