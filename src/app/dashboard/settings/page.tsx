import { getCurrentUser } from "@/lib/auth";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your appearance, notifications, and account security.
        </p>
      </div>

      <SettingsForm user={{ notifications: user!.notifications, language: user!.language }} />
    </div>
  );
}
