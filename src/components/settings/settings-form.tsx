"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, Moon, Sun, Laptop, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  user: { notifications: boolean; language: string };
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "hi", label: "हिन्दी" },
  { value: "ja", label: "日本語" },
];

export function SettingsForm({ user }: SettingsFormProps) {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(user.notifications);
  const [language, setLanguage] = useState(user.language);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  async function persist(patch: Record<string, unknown>) {
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function handleNotificationsToggle(checked: boolean) {
    setNotifications(checked);
    await persist({ notifications: checked });
    toast.success(checked ? "Notifications enabled" : "Notifications disabled");
  }

  async function handleLanguageChange(value: string) {
    setLanguage(value);
    await persist({ language: value });
    toast.success("Language preference saved");
  }

  async function handlePasswordChange() {
    if (!currentPassword || newPassword.length < 8) {
      toast.error("Enter your current password and a new password (8+ characters)");
      return;
    }
    setChangingPassword(true);
    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setChangingPassword(false);
    if (!res.ok) {
      toast.error(data.error ?? "Failed to change password");
      return;
    }
    toast.success("Password updated");
    setCurrentPassword("");
    setNewPassword("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="font-semibold">Theme</h3>
        <p className="text-sm text-muted-foreground">Choose how ResumeIQ AI looks on your device.</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition-all",
                theme === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border/70 text-muted-foreground hover:bg-accent",
              )}
            >
              <opt.icon className="size-5" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="font-semibold">Notifications</h3>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email notifications</p>
            <p className="text-sm text-muted-foreground">
              Get notified when an analysis completes or a new suggestion is ready.
            </p>
          </div>
          <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="font-semibold">Language</h3>
        <p className="text-sm text-muted-foreground">Preferred interface language.</p>
        <div className="mt-4 max-w-xs">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <KeyRound className="size-4" />
          Change password
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-lg">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>
        <Button
          onClick={handlePasswordChange}
          disabled={changingPassword}
          className="mt-4 rounded-lg"
          size="sm"
        >
          {changingPassword && <Loader2 className="size-3.5 animate-spin" />}
          Update password
        </Button>
      </div>
    </div>
  );
}
