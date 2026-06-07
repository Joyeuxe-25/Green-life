import { AdminShell } from "@/components/admin-shell";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export default function ChangePasswordPage() {
  return (
    <AdminShell>
      <AdminPlaceholder
        title="Change Password"
        description="Placeholder shell for future password change flow requiring a valid cookie session."
      />
    </AdminShell>
  );
}
