"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  user: { name: string; jobTitle: string | null; location: string | null };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [jobTitle, setJobTitle] = useState(user.jobTitle ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, jobTitle: jobTitle || null, location: location || null }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Profile updated");
      setEditing(false);
      router.refresh();
    } else {
      toast.error("Failed to update profile");
    }
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Full name</p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Job title</p>
            <p className="text-sm font-medium">{user.jobTitle || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium">{user.location || "—"}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setEditing(true)}>
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="jobTitle">Job title</Label>
        <Input
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Product Designer"
          className="rounded-lg"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Bengaluru, India"
          className="rounded-lg"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-lg">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="rounded-lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}
