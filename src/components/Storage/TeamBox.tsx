"use client";
import { useState, useEffect } from "react";
import starIcon from "@/public/nameCard/Star.svg";
import starPinkIcon from "@/public/nameCard/pinkStar.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRouterWrapper } from "../Router/RouterWrapperProvider";

interface CardBox {
  cardHolderId?: number;
  cardHolderName?: string;
  numOfTeammates: number;
  teamNames: string[];
  bookMark: boolean;
  storedAt: string;
}

interface RoomBox {
  roomId: number;
  roomName: string;
  roomPeopleCount: number;
  roomDateTime: string;
  guestBookFavorited: boolean;
  preViewContent: string;
}

interface TeamBoxProps {
  ver: "명함" | "방명록";
  team?: CardBox;
  room?: RoomBox;
  index: number;
  isSelected: boolean;
  isEdit: "complete" | "edit";
  onSelect: (index: number) => void;
  setIsToggle?: (value: boolean) => void;
  isNewData?: boolean;
  setIsNewData?: (value: boolean) => void;
  isLoading?: boolean;
  idToggle?: number;
  setIdToggle: (value: number) => void;
}

const TeamBox = (props: TeamBoxProps) => {
  const {
    team,
    room,
    index,
    isSelected,
    isEdit,
    isLoading,
    isNewData,
    onSelect,
    setIsNewData,
    ver,
    idToggle,
    setIdToggle,
  } = props;
  const [bgColor, setBgColor] = useState("bg-gray-1");
  const router = useRouterWrapper();

  // 큐알 코드를 통해 새로운 데이터 입력 시 3초 동안 pink 배경
  useEffect(() => {
    if (isNewData && index === 0 && !isLoading && setIsNewData) {
      setBgColor("bg-sub-palePink-55 border-sub-palePink");
      setIsNewData(false);
      setTimeout(() => {
        setBgColor("bg-gray-1");
      }, 3000);
    }
  }, [isNewData]);

  // 편집 시 선택되었을때 pink 메인 컬러
  const boxBgColor = isSelected
    ? "bg-sub-palePink-55 border-sub-palePink"
    : bgColor;

  //  개별 화면으로 이동
  const showDetailCard = () => {
    if (isEdit === "complete") {
      onSelect(index);
    } else if (ver === "명함" && team) {
      router.push(`/card/detail/${team?.cardHolderId}`);
    } else if (ver === "방명록" && room) {
      router.push(`/guest-book/${room?.roomId}`);
    }
    onSelect(index);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const formattedDate = team
    ? formatDate(team?.storedAt)
    : room && formatDate(room?.roomDateTime);

  const maxVisible = 4; // 보여지는 최대 이름 수
  const maxText = 18; // 보여지는 방명록 메세지 최대 길이 수
  const displayedParticipants =
    team && team.teamNames.length > maxVisible
      ? `${team.teamNames.slice(0, maxVisible).join(" ")} ...`
      : team?.teamNames.join(" ");

  const content = team
    ? displayedParticipants
    : (room && room.preViewContent) || "";

  const getPreviewContent = (content?: string) => {
    if (ver === "방명록" && content) {
      return content.length > maxText
        ? `${content.slice(0, maxText)}∙∙∙`
        : content;
    }
    return content;
  };

  const previewContent = getPreviewContent(content);

  // 방명록 or 명함
  const dataName = team ? team.cardHolderName : room && room.roomName;

  const dataNum = team ? team.numOfTeammates : room && room.roomPeopleCount;

  const dataBookMark = team
    ? team.bookMark
    : room
      ? room.guestBookFavorited
      : undefined;

  const dataId = team ? team.cardHolderId : (room && room.roomId) || 0;

  // 즐겨찾기 토글할 데이터의 아이디
  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dataId) {
      if (idToggle === dataId) {
        setIdToggle(-1);
        setTimeout(() => {
          setIdToggle(dataId); // 새로운 값 설정
        }, 0); // 다음 렌더링 사이클에 적용
      } else {
        setIdToggle(dataId);
      }
    }
  };

  return (
    <div
      onClick={() => showDetailCard()}
      className={`flex h-[7.2rem] w-full cursor-pointer flex-col justify-between gap-[0.4rem] rounded-[1.2rem] border-[0.1rem] ${boxBgColor} ${isEdit === "complete" && "cursor-pointer"} px-[1.6rem] py-[1.4rem]`}
    >
      <div className="flex justify-between">
        <div className="flex gap-[0.4rem]">
          <span className="text-body-2-bold text-gray-11">{dataName}</span>
          <span className="text-body-2-med text-gray-7">{dataNum}</span>
        </div>
        <Image
          src={dataBookMark ? starPinkIcon : starIcon}
          onClick={handleFavClick}
          alt="즐겨찾기"
          className="cursor-pointer"
        />
      </div>
      <div className="flex justify-between">
        <span className="text-body-2-reg text-gray-9">
          {ver === "방명록" ? previewContent : displayedParticipants}
        </span>
        <span className="text-caption-med text-gray-5">{formattedDate}</span>
      </div>
    </div>
  );
};
export default TeamBox;
