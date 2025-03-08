"use client";
import React, { useEffect, useRef, useState } from "react";

import CardTop from "./Storage/card/CardTop";
import CardBottom from "./Storage/card/CardBotttom";
import { toPng, toSvg } from "html-to-image";

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

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toSvg(cardRef.current, {
        cacheBust: true,
        includeQueryParams: true,
        filter,
      });

      const link = document.createElement("a");
      link.download = "명함.svg";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("SVG 다운로드 중 오류 발생:", err);
    }
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
