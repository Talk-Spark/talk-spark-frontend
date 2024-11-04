// src/app/dashboard/layout.tsx
import { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <h2>Dashboard</h2>
      {children}
    </div>
  );
}
