"use client"; // 클라이언트 컴포넌트로 설정!

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCheck() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");

      if (!userStr) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(userStr);
      if (!user || !user.refreshToken) {
        router.push("/login");
      }
    }
  }, [router]);

  return null;
}
