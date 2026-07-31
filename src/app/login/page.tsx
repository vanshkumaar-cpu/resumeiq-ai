import type { Metadata } from "next";
import { AuthShowcase } from "@/components/auth/auth-showcase";
import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata: Metadata = {
  title: "Sign in — ResumeIQ AI",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen flex-1 grid-cols-1 lg:grid-cols-2">
      <AuthShowcase />
      <AuthPanel />
    </div>
  );
}
