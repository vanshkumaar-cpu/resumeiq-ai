import { FileText, Mail, CalendarDays, FileSearch } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileForm } from "@/components/profile/profile-form";
import { formatDate } from "@/lib/score-utils";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const [analyses, total] = await Promise.all([
    db.analysis.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, resumeFilename: true, createdAt: true },
    }),
    db.analysis.count({ where: { userId: user!.id } }),
  ]);

  const initials = user!.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="glass-strong flex flex-col items-center gap-4 rounded-3xl p-8 text-center sm:flex-row sm:text-left">
        <Avatar className="size-20 border-2 border-border">
          <AvatarFallback
            className="text-2xl font-semibold text-white"
            style={{ backgroundColor: user!.avatarColor }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user!.name}</h2>
          <p className="text-sm text-muted-foreground">{user!.jobTitle || "No job title set"}</p>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
            <Mail className="size-3.5" />
            {user!.email}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="font-semibold">User Information</h3>
          <div className="mt-4">
            <ProfileForm
              user={{ name: user!.name, jobTitle: user!.jobTitle, location: user!.location }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="font-semibold">Account Details</h3>
          <div className="mt-4 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
                <CalendarDays className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Member since</p>
                <p className="text-xs text-muted-foreground">{formatDate(user!.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
                <FileSearch className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Total analyses</p>
                <p className="text-xs text-muted-foreground">{total} resumes analyzed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="font-semibold">Uploaded Resumes</h3>
        {analyses.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No resumes uploaded yet.</p>
        ) : (
          <div className="mt-3 space-y-1">
            {analyses.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.resumeFilename}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
