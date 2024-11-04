// src/app/settings/layout.tsx
import { ReactNode } from "react";

type SettingsLayoutProps = {
  children: ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div>
      <h2>Settings</h2>
      {children}
    </div>
  );
}
