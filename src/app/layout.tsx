// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import { ReactNode } from "react";

//font를 직접 다운로드해서 사용하는 예시
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

type RootLayoutProps = {
  children: ReactNode;
};

//SEO를 위한 메타데이터(레이아웃 전체에 적용)
export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A sample Next.js application",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
