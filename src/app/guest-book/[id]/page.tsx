"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import FixedComment from "@/src/components/guest-book/FixedComment";
import MyTalk from "@/src/components/guest-book/MyTalk";
import YourTalk from "@/src/components/guest-book/YourTalk";
import CommnetInput from "@/src/components/guest-book/CommentInput";
import Header from "@/src/components/Headers/Header";
import { AxiosResponse } from "axios";
import { instance } from "@/src/apis";
import Template from "@/src/components/Router/template";
import { useRouterWrapper } from "@/src/components/Router/RouterWrapperProvider";

interface GuestBookDataProps {
  guestBookId: number;
  sparkUserName: string;
  guestBookContent: string;
  guestBookDateTime: string;
  ownerGuestBook: boolean;
  cardThema: "PINK" | "YELLOW" | "MINT" | "BLUE";
}

interface RoomDataProps {
  roomId: number;
  roomName: string;
  roomDateTime: string;
  guestBookData: GuestBookDataProps[];
  guestBookFavorited: boolean;
}

const defaultRoom: RoomDataProps = {
  roomId: 0,
  roomName: "",
  roomDateTime: "",
  guestBookData: [],
  guestBookFavorited: false,
};

const Page = () => {
  const [commentValue, setCommentValue] = useState("");
  const [guestDetailData, setGuestDetailData] =
    useState<RoomDataProps>(defaultRoom);
  const router = useRouterWrapper();

  const { id } = useParams(); // roomId 파라미터 가져온 후 get
  const roomId = id ? Number(id) : 0;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 데이터를 불러오고 난 후 스크롤을 밑으로 이동
  useEffect(() => {
    fetchGuestBookData();
  }, []);

  useEffect(() => {
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollHeight >
        scrollContainerRef.current.offsetHeight &&
      guestDetailData.guestBookData.length > 0
    ) {
      setTimeout(() => {
        scrollContainerRef.current!.scrollTop =
          scrollContainerRef.current!.scrollHeight;
      }, 0);
    } else {
      console.log("스크롤이 필요하지 않음");
    }
  }, [guestDetailData]);

  /* 방명록 내용 조회하기 (상세정보) */
  const fetchGuestBookData = async () => {
    if (roomId) {
      try {
        const response: AxiosResponse<{
          status: number;
          message: string;
          data: RoomDataProps;
        }> = await instance.get(`/api/guest-books/${roomId}`);
        const resData = response.data.data;
        setGuestDetailData(resData);
        console.log(resData);
      } catch (error) {
        console.log("Error fetching guest book data:", error);
      }
    }
  };

  useEffect(() => {
    fetchGuestBookData();
  }, []);

  const date = guestDetailData ? guestDetailData.roomDateTime : "";
  const roomName = guestDetailData ? guestDetailData.roomName : "";

  const formatDate = (dateString: string) => {
    if (!dateString) return "날짜 정보 없음"; // dateString이 비어있으면 기본값 반환
    const [year, month, day] = dateString.split(" ")[0].split("-");
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  };

  function formatTimeWithMeridiem(dateTime: string) {
    if (!dateTime || !dateTime.includes("T")) return "시간 정보 없음"; // dateTime이 비어있으면 기본값 반환
    // 날짜 객체로 변환
    const date = new Date(dateTime);

    // 7시간 추가
    const correctedDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    // 시간 및 분 추출
    const hour = correctedDate.getHours();
    const minute = correctedDate.getMinutes();

    // 오전/오후 및 시각 변환
    const meridiem = hour < 12 ? "오전" : "오후";
    const formattedHour = hour % 12 || 12;

    // 최종 포맷된 문자열 반환
    return `${meridiem} ${formattedHour}:${minute.toString().padStart(2, "0")}`;
  }

  const guestBookData: {
    guestBookId: string;
    isOwnerGuestBook: boolean;
    sparkUserName: string;
    guestBookContent: string;
    guestBookDateTime: string;
  }[] = [
    // 더미데이터
  ];
  const headerBtn1 = () => {
    const gameEnd = JSON.parse(localStorage.getItem("gameEnd") || "false");
    if (!gameEnd) {
      router.back();
    } else {
      router.push("/guest-book");
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="scroll-container relative -mx-[2rem] h-[100vh] w-[calc(100%+4rem)] overflow-y-auto bg-gray-1"
    >
      <div className="max-[76.8rem] fixed top-0 z-10 w-full max-w-[76.8rem]">
        <Header
          title={roomName}
          padding={true}
          showButton1={true}
          button1Action={headerBtn1}
          isPositionFixed={false}
        />
      </div>

      <div className="flex flex-col items-center pb-[9.9rem]">
        <div className="mb-[2rem] mt-[8rem] rounded-[1.2rem] border-[0.1rem] border-gray-7 px-[0.7rem] py-[0.3rem] text-caption-med text-gray-7">
          {formatDate(date)}
        </div>
        <div className="mx-[2rem] flex w-[calc(100%-4rem)] flex-1 flex-col">
          <FixedComment
            roomName={roomName}
            formatTimeWithMeridiem={formatTimeWithMeridiem}
            date={date}
          />
          {/* Guest Book Data */}
          <div className="flex flex-col bg-gray-1">
            {guestDetailData?.guestBookData?.length > 0 ? (
              guestDetailData?.guestBookData.map((data, index) => {
                const isLastOfSameTime =
                  index === guestDetailData.guestBookData.length - 1 || // 마지막 메시지거나
                  formatTimeWithMeridiem(data.guestBookDateTime) !==
                    formatTimeWithMeridiem(
                      guestDetailData.guestBookData[index + 1]
                        ?.guestBookDateTime,
                    ); // 다음 메시지와 시간이 다르면 true

                // 동일한 사람과 시간에 대해서 첫 번째 메시지에만 프로필 이미지를 표시
                const isFirstOfSameUserAndTime =
                  index === 0 ||
                  data.guestBookId !==
                    guestDetailData.guestBookData[index - 1]?.guestBookId ||
                  formatTimeWithMeridiem(data.guestBookDateTime) !==
                    formatTimeWithMeridiem(
                      guestDetailData.guestBookData[index - 1]
                        ?.guestBookDateTime,
                    );

                const shouldShowDate =
                  index !== 0 && // 첫 번째 메시지에서는 날짜 표시 안함
                  (formatDate(data.guestBookDateTime) !==
                    formatDate(
                      guestDetailData.guestBookData[index - 1]
                        ?.guestBookDateTime,
                    ) ||
                    index === 0); // 이전 메시지와 날짜가 다르면 날짜 표시

                return (
                  <div key={data.guestBookId}>
                    {shouldShowDate && (
                      <div className="flex justify-center">
                        <div
                          className="mt-[2.8rem] w-full rounded-[1.2rem] border-[0.1rem] border-gray-7 px-[0.7rem] py-[0.3rem] text-caption-med text-gray-7"
                          style={{ width: "auto" }} // Auto width based on content
                        >
                          {formatDate(data.guestBookDateTime)}{" "}
                        </div>
                      </div>
                    )}
                    {data.ownerGuestBook ? (
                      <MyTalk
                        key={data.guestBookId}
                        content={data.guestBookContent}
                        dateTime={data.guestBookDateTime}
                        formatTimeWithMeridiem={formatTimeWithMeridiem}
                        shouldShowTime={isLastOfSameTime} // 시간을 표시할지 여부 전달
                        isFirstOfSameUserAndTime={isFirstOfSameUserAndTime}
                      />
                    ) : (
                      <YourTalk
                        key={data.guestBookId}
                        userName={data.sparkUserName}
                        content={data.guestBookContent}
                        dateTime={data.guestBookDateTime}
                        formatTimeWithMeridiem={formatTimeWithMeridiem}
                        color={data.cardThema}
                        shouldShowTime={isLastOfSameTime} // 시간을 표시할지 여부 전달
                        shouldShowProfile={isFirstOfSameUserAndTime} // 첫 번째 말에만 프로필 표시
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500"></p>
            )}
          </div>
        </div>
        <CommnetInput
          commentValue={commentValue}
          setCommentValue={setCommentValue}
          roomId={roomId}
          fetchGuestBookData={fetchGuestBookData}
        />
      </div>
    </div>
  );
};

export default function GuestBookPage() {
  return (
    <Template>
      <Page />
    </Template>
  );
}
