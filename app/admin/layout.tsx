import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio Manager",
  description: "Admin dashboard to manage portfolio content.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
