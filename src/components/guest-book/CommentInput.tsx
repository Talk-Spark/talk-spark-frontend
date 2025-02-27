"use client";
import checkBox from "@/public/guest-book/checkBox.svg";
import fullCheckBox from "@/public/guest-book/fullCheckBox.svg";
import sendIcon from "@/public/guest-book/sendIcon.svg";

import Image from "next/image";
import NewIcon from "@/public/guest-book/newIconS.svg";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { instance } from "@/src/apis";
import { setTimeout } from "timers";

type CommentInputProps = {
  roomId: number;
  commentValue: string;
  setCommentValue: (value: string) => void;
  fetchGuestBookData: () => void;
};

const CommnetInput = ({
  roomId,
  commentValue,
  setCommentValue,
  fetchGuestBookData,
}: CommentInputProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = () => setIsCheck((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value);
  };

  const handleClickGuestBook = async () => {
    if (!commentValue.trim()) {
      return;
    }
    /* 전송 버튼 클릭시 post 요청 후 새로고침처럼 get요청 */
    /* 방명록 작성하기 POST */
    const queryParam = isCheck ? "true" : "false";

    try {
      const response = await instance.post(
        `/api/guest-books/${roomId}?anonymity=${queryParam}`,
        { content: commentValue },
      );

      if (response.status === 200) {
        console.log("방명록 작성 성공:", response.data);
      }
    } catch (error) {
      console.error("방명록 작성 중 오류 발생:", error);
    }
    setCommentValue("");
    fetchGuestBookData();
  };

  // 애니메이션 핸들러
  const handleNew = () => {
    setIsAnimating(true);
    fetchGuestBookData();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // 높이 자동 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      const maxHeight =
        parseInt(getComputedStyle(textareaRef.current).lineHeight || "24") * 3; // 세 줄 높이 계산
      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`; // 최대 높이로 제한
        textareaRef.current.style.overflowY = "scroll";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  }, [commentValue]);

  return (
    <div className="fixed bottom-0 h-[8.4rem] w-full max-w-[77rem] bg-white">
      <Image
        src={NewIcon}
        className={classNames(
          "absolute -top-[6.5rem] right-[0.7rem] w-[5.5rem] transform cursor-pointer transition-all duration-300",
          { "animate-bounce-scale": isAnimating },
        )}
        alt="새로고침 버튼"
        onClick={handleNew}
      />
      <div className="relative mx-[1.2rem] mt-[0.6rem] flex w-[calc(100%-2.4rem)] gap-[0.8rem] overflow-hidden rounded-[2rem] border-[0.1rem] border-gray-6 bg-gray-1 pl-[1.2rem] pr-[4.5rem]">
        <Image
          src={sendIcon}
          alt="전송 버튼"
          className="absolute bottom-[0.5rem] right-[1.5rem] cursor-pointer"
          onClick={handleClickGuestBook}
        />
        <div className="relative w-[5rem]">
          {/* 체크박스 선택시 데이터 이름에 "익명" post */}
          <div className="absolute top-[0.8rem] flex w-full items-center justify-center gap-[0.4rem]">
            <Image
              src={isCheck ? fullCheckBox : checkBox}
              alt="체크박스"
              onClick={handleCheck}
            />
            <span className="w-[3rem] text-caption-med text-gray-6">익명</span>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          placeholder="내용을 작성해 주세요"
          aria-label="댓글 입력 필드"
          className="search-reset w-full resize-none overflow-hidden bg-transparent py-[0.5rem] text-body-1-med text-gray-12 placeholder-gray-4 focus:outline-none"
          onChange={handleChange}
          value={commentValue}
          maxLength={200}
          rows={1}
        />
      </div>
    </div>
  );
};

export default CommnetInput;
