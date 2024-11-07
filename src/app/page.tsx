import Image from "next/image";
//alias 테스트
import file from "@/public/file.svg";

// src/app/page.tsx
import { Metadata } from "next";

//SEO를 위한 메타데이터(해당 페이지에 적용, 레이아웃 메타데이터를 덮어씀)
export const metadata: Metadata = {
  title: "Home Page",
  description: "Welcome to the home page of our Next.js app",
};

//반드시 export만 해주면 됨.(컴포넌트명은 뭐가 되든 상관 x)
export default function HomePage() {
  console.log("hi");
  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <Image className="grid" src={file} alt="hi" />
    </>
  );
}