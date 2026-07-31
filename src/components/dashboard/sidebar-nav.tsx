"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/components/dashboard/nav-items";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-1.5" onClick={onNavigate}>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25">
          <Sparkles className="size-4" />
        </div>
        <span className="font-semibold tracking-tight">ResumeIQ AI</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className="relative z-10 size-[18px]" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="glass rounded-2xl p-4">
        <p className="text-xs font-medium text-foreground">Free plan</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Unlimited resume analyses while in preview.
        </p>
      </div>
    </div>
  );
}
