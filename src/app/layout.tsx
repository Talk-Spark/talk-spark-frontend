// src/app/layout.tsx
import localFont from "next/font/local";
import "./globals.css";
import HeaderWrapper from "../components/Headers/HeaderWrapper"; // Client Component
import type { Metadata } from "next";
import Script from "next/script";
import { RouterWrapperProvider } from "../components/Router/RouterWrapperProvider";
import AnimationProvider from "../components/Router/AnimationProvider";
import AuthCheck from "../components/common/AuthCheck";

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

// SEO를 위한 메타데이터 (레이아웃 전체에 적용)
export const metadata: Metadata = {
  title: "Talk Spark",
  description: "실시간 아이스브레이킹 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <RouterWrapperProvider>
        <AnimationProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} bg-white antialiased`}
          >
            <AuthCheck /> {/* 로그인 체크 추가 */}
            {/* EditProvider로 감싸서 전체에서 편집 상태 관리 */}
            <HeaderWrapper />
            {/* 375px 이하의 디스플레이인 모든 페이지 양쪽에 20px의 여백 생성 (이후 breakpoint 추가 가능) */}
            <main className="gutter container">{children}</main>
          </body>
        </AnimationProvider>
      </RouterWrapperProvider>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
        integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
        crossOrigin="anonymous"
        async
      />
    </html>
  );
}
