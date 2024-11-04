// src/app/dashboard/[userId]/layout.tsx
import { ReactNode } from "react";

type UserLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div>
      <h3>User Details</h3>
      {children}
    </div>
  );
}
