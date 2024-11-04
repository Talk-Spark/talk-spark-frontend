import Image from "next/image";
//alias 테스트
import file from "@/public/file.svg";

// src/app/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Welcome to the home page of our Next.js app",
};

export default function HomePage() {
  console.log("hi");
  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <Image className="grid" src={file} alt="hi" />
    </>
  );
}
