import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/70 lg:block">
        <SidebarNav />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
