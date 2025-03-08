"use client";
import React, { useEffect, useRef, useState } from "react";

import CardTop from "./Storage/card/CardTop";
import CardBottom from "./Storage/card/CardBotttom";
import { toPng } from "html-to-image";

type CardDataProps = {
  // 기본 정보
  name: string;
  age: number;
  major: string;
  mbti?: string;
  hobby?: string;
  lookAlike?: string;
  selfDescription?: string;
  tmi?: string;
  cardThema: "PINK" | "MINT" | "YELLOW" | "BLUE";
};

export type MyNameCardProps = CardDataProps & {
  // 내 명함 response 바디
  // response body
  id?: number;
  kakaoId?: string;
  ownerId?: number;
  // 다른 사람 명함 개별 조회
  storedCardId?: number;
  bookMark?: boolean;
  cardHolderName?: string;
};

type PutCardProps = CardDataProps & {
  // 내 명함 req putData
  sparkUserId?: number;
};

type NameCardProps = {
  oneCard: MyNameCardProps;
  otherCard?: OtherCardProps;
  isFull?: boolean;
  isStorage?: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  setSelectedColor?: React.Dispatch<
    React.SetStateAction<"PINK" | "MINT" | "YELLOW" | "BLUE">
  >;
};

type OtherCardProps = CardDataProps & {
  storedCardId?: number;
  bookMark?: boolean;
  cardHolderName?: string;
};

const StorageNameCard: React.FC<NameCardProps> = ({
  oneCard,
  isFull = false,
  isStorage = false,
  isEditing,
  setIsEditing,
  setSelectedColor,
}) => {
  const [putData, setPutData] = useState<PutCardProps>({
    sparkUserId: oneCard?.ownerId,
    ...oneCard,
  });
  const selectedColor = putData ? putData.cardThema : oneCard.cardThema;
  //console.log(oneCard);

  const cardRef = useRef<HTMLDivElement>(null);

  const filter = (node: HTMLElement) => {
    // 편집, 다운로드 버튼 제거
    if (node.tagName === "BUTTON") {
      return false;
    }
    const exclusionClasses = ["remove-me", "secret-div"];
    return !exclusionClasses.some((classname) =>
      node.classList?.contains(classname),
    );
  };

  // 명함 이미지 저장 html-to-image
  const handleDownload = async () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // iOS 환경 확인
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // 파일 크기 제한 설정: iOS일 경우 400KB, 아니면 100KB
    const targetSize = isIos ? 400 * 1024 : 100 * 1024;
    let fileSize = 0;

    const filter = (node: HTMLElement) => {
      if (node.tagName === "BUTTON") {
        return false;
      }
      const exclusionClasses = ["remove-me", "secret-div"];
      return !exclusionClasses.some((classname) =>
        node.classList?.contains(classname),
      );
    };

    const attemptDownload = async () => {
      try {
        const dataUrl = await toPng(cardElement, {
          cacheBust: true,
          includeQueryParams: true,
          filter: filter,
        });

        // 이미지 크기 체크
        fileSize = dataUrl.length * (3 / 4); // Base64로 인코딩된 데이터 URL 크기 계산
        console.log("파일 크기:", fileSize);

        if (fileSize >= targetSize) {
          // 크기가 targetSize 이상일 경우 다운로드
          const link = document.createElement("a");
          link.download = "명함.png";
          link.href = dataUrl;
          link.click();
        } else {
          // 크기가 targetSize 미만일 경우 다시 시도
          console.log("파일 크기가 작음. 다시 시도합니다.");
          setTimeout(attemptDownload, 250); // 250ms 후에 다시 시도
        }
      } catch (err) {
        console.error("이미지 변환 중 오류 발생:", err);
      }
    };

    // 최초 다운로드 시도
    attemptDownload();
  };

  useEffect(() => {
    if (setSelectedColor) {
      if (putData) {
        setSelectedColor(putData?.cardThema);
      } else if (oneCard) {
        setSelectedColor(oneCard.cardThema);
      }
    }
  }, [putData, oneCard]);

  const contentTextColor =
    selectedColor === "BLUE"
      ? "text-gray-3 text-body-2-med "
      : " text-body-2-med text-gray-10";

  //301 + 192 = 493
  return (
    <div
      ref={cardRef}
      className={`relative bg-transparent ${isFull ? "h-[49.3rem]" : "h-[30.1rem]"} w-[33.5rem] rounded-[2rem]`}
    >
      {/* 첫 번째 사각형 - 상단 */}
      <div className="">
        <CardTop
          oneCard={oneCard}
          putData={putData}
          setPutData={setPutData}
          contentTextColor={contentTextColor}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isFull={isFull}
          isStorage={isStorage}
          handleDownload={handleDownload}
        />
      </div>
      {/* 두 번째 사각형 - 하단 */}
      {isFull && (
        <CardBottom
          oneCard={oneCard}
          putData={putData}
          setPutData={setPutData}
          contentTextColor={contentTextColor}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default StorageNameCard;
