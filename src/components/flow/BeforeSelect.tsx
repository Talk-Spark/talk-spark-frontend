"use client";

import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import question from "@/public/nameCard/question.svg";
import warning_circle from "@/public/nameCard/warning_circle.svg";
import popup_bg from "@/public/nameCard/popup_bg.png";
import Image from "next/image";
import NameCard from "@/src/components/NameCard";
import Button from "@/src/components/common/Button";
import { NameCardObjProps } from "@/src/app/(flow)/flow/page";
// import { CardFlowType } from "@/src/app/(flow)/flow/page";
// import { CARD_FLOW } from "@/src/app/(flow)/flow/page";
import { getUserData } from "@/src/utils";
import { useSearchParams } from "next/navigation";
import { get } from "@/src/apis";

interface BeforeSelectProps {
  cardStep: number;
  setIsBefore: (input: boolean) => void;
  setCardStep: Dispatch<SetStateAction<number>>;
  socketRef: MutableRefObject<any>;
  roomId: string;
  isHost: boolean;
  questionTips: string;

  //socket으로 받아오는 정보들
  NameCardInfo: NameCardObjProps;
  quizInfo: QuizDataProps;
  fieldHoles: FieldType[];
}

export type FieldType =
  | "mbti"
  | "hobby"
  | "lookAlike"
  | "selfDescription"
  | "tmi";

//question으로 받아오는 1번째 데이터 타입
interface UserProfile {
  id: number; // 사용자 카드의 고유 ID
  ownerId: number; // 소유자 ID (sparkUserId)
  name: string; // 이름
  age: number; // 나이
  kakaoId: string; // 카카오톡 ID
  major: string; // 전공
  mbti: string; // MBTI
  hobby: string; // 취미
  lookAlike: string; // 닮은 꼴
  selfDescription: string; // 자기소개
  tmi: string; // TMI
  cardThema: string; // 카드 테마 색상
}

//question으로 받아오는 2번째 데이터 타입
interface UserBlanks {
  sparkUserId: number; // 사용자 ID
  blanks: FieldType[]; // 빈 필드 목록 - 남아있는 문제들이 올거임
}

//question으로 받아오는 3번째 데이터 타입
interface QuizDataProps {
  cardId: number; // 명함 아이디
  cardOwnerId: number; // 명함 주인 회원아이디
  fieldName: FieldType; // 빈칸으로 뚫릴 필드의 이름 (ex: "name", "age") -> mbti, hobby, lookAlike, selfDescription ,tmi
  correctAnswer: string; // 정답(보기 번호가 아니고 정답 내용이 들어갑니다. 문제 종류 관계없이 string입니다.)
  options: string[]; //정답 보기들(아마 4개)
}

export const CARD_FIELD_NUMBER = {
  mbti: 0,
  hobby: 1,
  lookAlike: 2,
  selfDescription: 3,
  tmi: 4,
} as const;

function splitByNewline(input: string) {
  return input.split("\n");
}

const BeforeSelect = ({
  cardStep,
  setIsBefore,
  setCardStep,
  socketRef,
  roomId,
  isHost,
  NameCardInfo,
  quizInfo,
  fieldHoles,
  questionTips,
}: BeforeSelectProps) => {
  const user = getUserData();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(""); //선택하는 거 emit하고 넘어가야함
  const [isAnswerSeleted, setIsAnswerSeleted] = useState(false);
  // const [questionTips, setQuestionTips] = useState<string[]>([]);

  const popUpRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socketRef.current.emit("getQuestion", { roomId });

    const handleClickOutSide = (e: MouseEvent) => {
      if (popUpRef.current && !popUpRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  useLayoutEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (popUpRef.current && !popUpRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutSide);

    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClickButton = (item: string) => {
    if (!isAnswerSeleted) setSelectedButton(item);
  };

  const handleAnswerSelect = () => {
    if (selectedButton) {
      setIsAnswerSeleted(true);
      //todo: userId 식별할 수 있는 방법 상의한 후, 그 userId를 잘 실어서 보내야함.
      socketRef.current.emit("submitSelection", {
        roomId: roomId,
        sparkUserId: user?.sparkUserId,
        answer: selectedButton,
      });
    }
  };

  if (cardStep > 4) {
    //todo: 이제 cardStep 사용안할거임
    //퀴즈 다 맞춘 상태 -> 알맞은 단계로 이어져야 함
    return;
  }

  const convertFieldName = (field: string) => {
    if (field === "SELFDESCRIPTION") return "SELFDESC";
    return field;
  };

  // useEffect(() => {
  //   if (quizInfo) {
  //     const getQuestionTip = async () => {
  //       try {
  //         const response = await get(
  //           `/api/rooms/question-tip?field=${convertFieldName(quizInfo.fieldName.toUpperCase())}`,
  //         );
  //         const questionTips = splitByNewline(response.data as string);
  //         setQuestionTips(questionTips);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     };
  //     getQuestionTip();
  //   }
  // }, [quizInfo]);

  if (!NameCardInfo || !quizInfo || !popUpRef || !fieldHoles) return;

  return (
    <section className="flex h-auto w-[37.5rem] flex-col items-center gap-[2.4rem]">
      <article className="flex h-[37.2rem] w-[37.5rem] shrink-0 items-center justify-center self-stretch bg-sub-palePink-55">
        <div className="flex w-[33.5rem] flex-col gap-[1.2rem]">
          <NameCard
            teamName={NameCardInfo.teamName}
            name={NameCardInfo.name}
            age={NameCardInfo.age}
            major={NameCardInfo.major}
            mbti={NameCardInfo.mbti}
            hobby={NameCardInfo.hobby}
            lookAlike={NameCardInfo.lookAlike}
            selfDescription={NameCardInfo.selfDescription}
            tmi={NameCardInfo.tmi}
            selectedCategory={quizInfo.fieldName}
            fieldHoles={fieldHoles}
          />
          <div className="flex gap-[0.5rem]" ref={popUpRef}>
            <div className="relative w-[20px]">
              <Image src={question} alt="quest" onClick={handleOpenPopup} />
              {isPopupOpen && (
                <div
                  className="absolute left-[-6px] top-[16px] flex h-[82px] w-[333px] shrink-0 flex-col gap-[0.8rem] pl-[16px] pt-[22px] text-caption-med text-gray-8"
                  style={{
                    backgroundImage: `url(${popup_bg.src})`,
                    backgroundSize: "cover",
                  }}
                >
                  <span>{questionTips}</span>
                  {/* <span>{`1. ${questionTips[0]}\n`}</span>
                  {questionTips[1] && <span>{`2. ${questionTips[1]}\n`}</span>} */}
                </div>
              )}
            </div>
            <span
              className="text-body-1-med text-gray-8"
              onClick={handleOpenPopup}
            >
              이런 질문은 어때요?
            </span>
          </div>
        </div>
      </article>

      <article className="flex h-[16.5rem] w-[37.5rem] flex-col items-center gap-[1.2rem]">
        <span className="self-stretch text-center text-headline-5 text-black">
          빈칸을 채워주세요!
        </span>
        <div className="flex w-[100%] justify-center">
          <div className="grid w-[33.5rem] grid-cols-2 gap-[1.2rem] self-stretch">
            {quizInfo.options.map((option, index) => {
              const itemLabel = String.fromCharCode(65 + index); // A, B, C, D 등
              return (
                <button
                  key={itemLabel}
                  onClick={() => handleClickButton(option)}
                  className={`br-[0.8rem] flex h-[5.6rem] w-[16.2rem] items-center justify-center gap-[1rem] rounded-[8px] border-gray-4 pb-[0.8rem] pl-[1.2rem] pr-[0.8rem] pt-[0.8rem] text-body-2-med shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)] ${
                    selectedButton === option
                      ? "bg-main-pink text-white"
                      : "bg-white text-gray-12"
                  }`}
                >
                  {`${itemLabel}. ${option}`}
                </button>
              );
            })}
          </div>
        </div>
      </article>

      <div className="flex w-[33.6rem] flex-col items-start gap-[0.8rem]">
        <Button
          disabled={isAnswerSeleted}
          variant={`${(isAnswerSeleted && "gray") || "black"}`}
          onClick={handleAnswerSelect}
        >
          {isAnswerSeleted ? "기다리는 중이에요" : "선택 완료"}
        </Button>
        <span className="flex items-center justify-center gap-[0.4rem] self-stretch text-caption-bold text-gray-7">
          <Image src={warning_circle} alt="warning" />
          선택 완료 후에는 답변을 변경할 수 없어요!
        </span>
        <div className="h-[2.6rem]"></div>
      </div>
    </section>
  );
};

export default BeforeSelect;
