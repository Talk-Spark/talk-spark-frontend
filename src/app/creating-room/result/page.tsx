"use client";

import kakaoImage from "@/public/Image/onBoarding/kakaoImage.svg";
import Button from "@/src/components/common/Button";
import QrCode from "@/src/components/QrCode/QrCode";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const Result = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const roomName = searchParams.get("roomName");

  // 카카오 SDK 초기화
  useEffect(() => {
    if (typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        console.log("Kakao SDK Initialized:", window.Kakao.isInitialized());
      }
    }
  }, []);

  const handleKakaoShare = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }

      // kakao.Share.sendDefault({
      //   objectType: "feed",
      //   content: {
      //     title: "톡스파크에 초대합니다!",
      //     description: `방 이름: ${roomName || "Unknown"}`,
      //     link: {
      //       mobileWebUrl: `https://talk-spark-frontend-nine.vercel.app/team/${roomId}`,
      //       webUrl: `https://talk-spark-frontend-nine.vercel.app/team/${roomId}`,
      //     },
      //   },
      //   buttons: [
      //     {
      //       title: "방에 참여하기",
      //       link: {
      //         mobileWebUrl: `https://talk-spark-frontend-nine.vercel.app/team/${roomId}`,
      //         webUrl: `https://talk-spark-frontend-nine.vercel.app/team/${roomId}`,
      //       },
      //     },
      //   ],
      // });
      kakao.Share.sendCustom({
        templateId: 116096,
        templateArgs: {
          roomId: roomId,
        },
      });
    }
  };

  const handleHostStartGame = () => {
    // if (typeof window !== "undefined") {
    //   localStorage.setItem("isGameHost", "true");
    // }
    router.push(`/team/${roomId}`);
  };

  return (
    <div className="mt-[4rem] flex h-[58.4rem] flex-col items-center justify-between">
      <div className="flex flex-col items-center justify-center gap-[3.6rem]">
        <h2 className="text-headline-2 text-gray-11">방 만들기 성공!</h2>
        <div className="h-[30.3rem] w-[30.3rem]">
          <QrCode
            cardId={Number(roomId)}
            name={roomName || "Unknown"}
            size={287}
          />
        </div>
        <button
          className="flex h-[5.6rem] w-[33.5rem] items-center justify-center gap-[1rem] rounded-[1.2rem] border-[1.5px] border-gray-3 bg-white"
          onClick={handleKakaoShare}
        >
          <Image src={kakaoImage} width={20} height={18} alt="kakaoImage" />
          <p className="text-body-1-bold text-gray-9">카카오톡 초대장 보내기</p>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-[1.2rem]">
        {/* todo: 입장하기 1_방장으로 이동 */}
        <Button variant="pink" onClick={handleHostStartGame}>
          시작하기
        </Button>
        <p
          className="text-body-2-med text-gray-7 underline decoration-solid decoration-1 underline-offset-4"
          onClick={() => router.push("/home")}
        >
          홈으로 가기
        </p>
      </div>
    </div>
  );
};

export default function PageWithSuspense() {
  return (
    <Suspense>
      <Result />
    </Suspense>
  );
}
