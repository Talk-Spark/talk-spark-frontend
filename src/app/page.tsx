"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

//해당 페이지에서 적절하게 navgiate하는 로직 구성하기
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      // user 데이터가 없으면 로그인 페이지로 이동
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    if (!user || !user.refreshToken) {
      // refreshToken이 없으면 로그인 페이지로 이동
      router.push("/login");
      return;
    }

    // Refresh Token으로 새 Access Token 및 Refresh Token 요청
    refreshAccessToken(user.refreshToken).then((newTokens) => {
      if (newTokens) {
        // 새 Access Token 및 Refresh Token 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          }),
        );
        // 새 토큰 저장 후 /home으로 리다이렉트
        router.push("/home");
      } else {
        // 재발급 실패 시 로그인 페이지로 이동
        router.push("/login");
      }
    });
  }, [router]);

  return <div></div>; // 리다이렉트만 수행되므로 UI를 렌더링하지 않음
}

// Refresh Token으로 Access Token 및 Refresh Token 재발급 요청
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(
      `https://talkspark.site/api/member/refresh?refreshToken=${refreshToken}`,
      {
        method: "GET",
      },
    );

    if (response.ok) {
      const data = await response.json();
      return {
        accessToken: data.accessToken, // 새 Access Token
        refreshToken: data.refreshToken, // 새 Refresh Token
      };
    }

    console.error("Failed to refresh tokens:", response.status);
    return null; // 재발급 실패
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return null; // 네트워크 또는 기타 오류
  }
}
