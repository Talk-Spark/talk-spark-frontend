"use client";

const AfterSelect = dynamic(() => import("@/src/components/flow/AfterSelect"), {
  ssr: false,
});
const BeforeSelect = dynamic(
  () => import("@/src/components/flow/BeforeSelect"),
  { ssr: false },
);
import { get } from "@/src/apis";
// import AfterSelect from "@/src/components/flow/AfterSelect";
// import BeforeSelect from "@/src/components/flow/BeforeSelect";
import Header from "@/src/components/Headers/Header";
import { getUserData } from "@/src/utils";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// export const CARD_FLOW = [
//   "엠비티아이",
//   "취미",
//   "닮은꼴",
//   "나는 이런 사람이야",
//   "TMI",
// ] as const;
// export type CardFlowType = (typeof CARD_FLOW)[number];

export interface NameCardObjProps {
  teamName: string;
  name: string;
  age: number;
  major: string;
  mbti: string;
  hobby: string;
  lookAlike: string;
  selfDescription: string;
  tmi: string;
}

export interface singleQuestionObjProps {
  sparkUserId: number;
  isCorrect: boolean;
  color: "PINK" | "MINT" | "YELLOW" | "BLUE";
  name: string;
}

export interface Props {
  sparkUserId: number;
  isCorrect: boolean;
  color: "PINK" | "MINT" | "YELLOW" | "BLUE";
  name: string;
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
export interface QuizDataProps {
  cardId: number; // 명함 아이디
  cardOwnerId: number; // 명함 주인 회원아이디
  fieldName: FieldType; // 빈칸으로 뚫릴 필드의 이름 (ex: "name", "age") -> mbti, hobby, lookAlike, selfDescription ,tmi
  correctAnswer: string; // 정답(보기 번호가 아니고 정답 내용이 들어갑니다. 문제 종류 관계없이 string입니다.)
  options: string[]; //정답 보기들(아마 4개)
}

export interface StorageCardProps {
  teamName: string;
  name: string;
  age: number;
  major: string;
  mbti: string;
  hobby: string;
  lookAlike: string;
  selfDescription: string;
  tmi: string;
  cardThema: "PINK" | "MINT" | "YELLOW" | "BLUE";
}

export interface FinalPeopleProps {
  age: number;
  cardThema: "PINK" | "MINT" | "YELLOW" | "BLUE";
  hobby: string;
  id: number;
  kakaoId: string;
  lookAlike: string;
  major: string;
  mbti: string;
  name: string;
  ownerId: number;
  selfDescription: string;
  tmi: string;
}

interface ScoresProps {
  [ownerId: number]: number;
}

const Flow = () => {
  /* 
    /flow?roomId={roomId}  와 같은 주소에서 roomId 내용을 뽑아올거임
  */
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const user = getUserData();
  const router = useRouter();

  const [isHost, setIsHost] = useState<boolean>(false); //방장 여부

  const [isReady, setIsReady] = useState(false);
  const [cardStep, setCardStep] = useState(0); //소켓으로 on 해올 예정 -> todo: 아마 현재 문제가 뭔지에 대해서...
  const [isBefore, setIsBefore] = useState(true); //소켓에서 현재 상태를 받아와서 대기 room으로 이동 여부 결정
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [correctedPeople, setCorrectedPeople] = useState<
    singleQuestionObjProps[] | null
  >(null);
  const [isAllCorrect, setIsAllCorrect] = useState(false);
  const [isQuizEnd, setIsQuizEnd] = useState(false);
  const [storageCard, setStorageCard] = useState<StorageCardProps | null>(null);

  //소켓에서 받아오는 정보들
  const [NameCardInfo, setNameCardInfo] = useState<NameCardObjProps>({
    //더미데이터
    teamName: "팀 이름 없음",
    name: "JunHyuk Kong",
    age: 18,
    major: "컴퓨터공학과",
    mbti: "INTJ",
    hobby: "축구",
    lookAlike: "강동원",
    selfDescription: "안녕하세요 저는 공준혁이라고 합니다",
    tmi: "카페인이 너무 잘 들어요",
  });
  const [quizInfo, setQuizInfo] = useState<QuizDataProps | null>(null);
  const [fieldHoles, setFieldHoles] = useState<FieldType[] | null>(null);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    const fetchHostStatus = async () => {
      try {
        const response = await get(`/api/rooms/is-host?roomId=${roomId}`);
        setIsHost(response.data as boolean);
      } catch (error) {
        console.error("Error fetching host status:", error);
      }
    };

    fetchHostStatus();

    //여기서 다시 연결
    console.log("연결 중!");
    socketRef.current = io("https://talkspark.site/", {
      transports: ["websocket"],
    });
    console.log(socketRef.current);

    //방에 잘 접속했다는 메세지 전송
    socketRef.current.emit("joinGame", {
      roomId,
      accessToken: user?.accessToken,
    });
    socketRef.current.on("gameJoined", () => {
      console.log("게임 접속!!");
      if (socketRef.current && isHost)
        // 방에 접속 후, 방장인 경우 퀴즈 준비를 요청.
        socketRef.current.emit("prepareQuizzes", { roomId });

      setTimeout(() => {
        setIsReady(true);
      }, 3000); //3초 대기 후 진행
    });

    //todo: 명함 하나 공개, 전체 공개와 관련된 로직 구성하기 - 맞출 사람이 더 남은 경우
    socketRef.current.on("singleResult", (data: StorageCardProps) => {
      console.log("singleResult 데이터:", data); // 데이터 출력

      setIsQuizEnd(true);

      setIsAllCorrect(false);
      setStorageCard({
        name: data.name,
        teamName: NameCardInfo.teamName,
        age: data.age,
        major: data.major,
        mbti: data.mbti,
        hobby: data.hobby,
        lookAlike: data.lookAlike,
        selfDescription: data.selfDescription,
        tmi: data.tmi,
        cardThema: data.cardThema,
      });
    });
    socketRef.current.on("lastResult", (data: StorageCardProps) => {
      console.log("lastResult 데이터:", data); // 데이터 출력

      setIsQuizEnd(true);
      setIsAllCorrect(false);
      setStorageCard({
        name: data.name,
        teamName: NameCardInfo.teamName,
        age: data.age,
        major: data.major,
        mbti: data.mbti,
        hobby: data.hobby,
        lookAlike: data.lookAlike,
        selfDescription: data.selfDescription,
        tmi: data.tmi,
        cardThema: data.cardThema,
      });

      setIsGameEnd(true);
    });

    socketRef.current.on(
      "question",
      (
        profileData: UserProfile,
        blankData: UserBlanks,
        QuizData: QuizDataProps,
        teamName: string,
      ) => {
        console.log("question 데이터:", {
          profileData,
          blankData,
          QuizData,
          teamName,
        }); // 데이터 출력
        setNameCardInfo({
          teamName: teamName,
          name: profileData.name,
          age: profileData.age,
          major: profileData.major,
          mbti: profileData.mbti,
          hobby: profileData.hobby,
          lookAlike: profileData.lookAlike,
          selfDescription: profileData.selfDescription,
          tmi: profileData.tmi,
        });
        setIsQuizEnd(false);
        setQuizInfo(QuizData);
        setFieldHoles(blankData.blanks);
        setIsBefore(true);
      },
    );

    //todo: 현재 이 메세지 안옴(서버 문제)
    socketRef.current.on("singleQuestionScoreBoard", (data: Props[]) => {
      setCorrectedPeople(data as singleQuestionObjProps[]);
      setIsBefore(false);
      console.log("singleQuestionScoreBoard 데이터:", data); // 데이터 출력
    });

    // 최종 스코어 가져오기
    socketRef.current.on(
      "scores",
      (scores: ScoresProps, data: FinalPeopleProps[]) => {
        //data를 localStorage에 잘 저장해두었다가, /game-end 에서 사용하여 렌더링하도록 만들기.
        router.push("/game-end"); //최종스코어 창으로 이동!
        localStorage.setItem("finalScores", JSON.stringify(scores)); //todo: data 형식 잘 확인하고, 보내기, 나중에 이동한 game-end에서 잘 받아와서 사용하기
        localStorage.setItem("finalPeople", JSON.stringify(data));
      },
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null; //메모리 누수 방지
    };
  }, []);

  useEffect(() => {
    if (correctedPeople) {
      const isAllCorrect = correctedPeople.every(
        (person) => person.isCorrect === true,
      );
      setIsAllCorrect(isAllCorrect);
      console.log(isAllCorrect);
    }
  }, [correctedPeople]);

  const addLabelToCorrectAnswer = (
    quizInfoOptions: string[],
    correctAnswer: string,
  ): string => {
    const index = quizInfoOptions.indexOf(correctAnswer);
    const label = String.fromCharCode(65 + index);
    return `${label}. ${correctAnswer}`;
  };

  if (!roomId) return;
  //나중에 방장 여부 넘겨서, 버튼 활성화 여부 결정 필요
  return (
    <>
      <Header title="명함 맞추기" />
      <main className="w-[cal(100% + 4rem)] -mx-[2rem] flex h-[71.2rem] flex-col items-center bg-gray-1">
        {isReady ? (
          socketRef && isBefore ? (
            <BeforeSelect
              cardStep={cardStep}
              setIsBefore={setIsBefore}
              setCardStep={setCardStep}
              socketRef={socketRef as MutableRefObject<any>}
              roomId={roomId}
              isHost={isHost}
              NameCardInfo={NameCardInfo}
              quizInfo={quizInfo as QuizDataProps}
              fieldHoles={fieldHoles as FieldType[]}
            />
          ) : (
            <AfterSelect
              cardStep={cardStep}
              setIsBefore={setIsBefore}
              socketRef={socketRef as MutableRefObject<any>}
              roomId={roomId}
              isHost={isHost}
              isQuizEnd={isQuizEnd}
              isGameEnd={isGameEnd}
              correctedPeople={correctedPeople as singleQuestionObjProps[]}
              answer={addLabelToCorrectAnswer(
                quizInfo?.options as string[],
                quizInfo?.correctAnswer as string,
              )}
              answerCount={
                correctedPeople?.filter((person) => person.correct)
                  .length as number
              }
              isAllCorrect={isAllCorrect}
              storageCard={storageCard as StorageCardProps}
            />
          )
        ) : (
          <div>
            로딩중.. 3초만 기다려주세요
            {/* <Image src={loading} alt="로딩" /> */}
          </div>
        )}
      </main>
    </>
  );
};

export default function SuspenseFlow() {
  return (
    <Suspense>
      <Flow />
    </Suspense>
  );
}
