import {
  LayoutDashboard,
  FileSearch,
  MessagesSquare,
  History,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Analysis", href: "/dashboard/analyze", icon: FileSearch },
  { label: "Interview Prep", href: "/dashboard/interview", icon: MessagesSquare },
  { label: "Resume History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: UserRound },
];
