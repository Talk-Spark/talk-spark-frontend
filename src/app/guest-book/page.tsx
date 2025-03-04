"use client";
import { instance } from "@/src/apis";
import Header from "@/src/components/Headers/Header";
import { useRouterWrapper } from "@/src/components/Router/RouterWrapperProvider";
import Template from "@/src/components/Router/template";
import SearchAndGetCard from "@/src/components/Storage/SearchAndGetCard";
import { useEffect, useState } from "react";

const Page = () => {
  const [isEdit, setIsEdit] = useState<"edit" | "complete">("edit");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("최신순");
  const [searchValue, setSearchValue] = useState<string>("");

  const handleCompleteClick = () => {
    setIsEdit((prev) => (prev === "edit" ? "complete" : "edit"));
  };

  type RoomData = {
    roomId: number;
    roomName: string;
    roomDateTime: string;
    roomPeopleCount: number;
    guestBookFavorited: boolean;
    preViewContent: string;
  };
  const router = useRouterWrapper();
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const [idToggle, setIdToggle] = useState(0);
  const [selectedTeamBoxes, setSelectedTeamBoxes] = useState<number[]>([]); // 선택 박스

  const headerBtn1 = () => {
    const gameEnd = JSON.parse(localStorage.getItem("gameEnd") || "false");
    console.log(gameEnd);

    if (!gameEnd) {
      router.back();
    } else {
      router.push("/home");
      localStorage.setItem("gameEnd", JSON.stringify(false)); // 저장
    }
  };

  /* 정렬 조건에 따른 방명록 검색하기 */
  useEffect(() => {
    const fetchGuestBooks = async () => {
      if (isLoading) return;

      try {
        setIsLoading(true);

        // API 응답 타입 정의
        type ApiResponse = {
          guestBookRooms: RoomData[];
        };

        // 쿼리 파라미터 생성 함수
        const getQueryParam = () => {
          if (sortOption === "즐겨찾기")
            return `?serach=${searchValue}&sortBy=favorites`;
          if (sortOption === "가나다순")
            return `?serach=${searchValue}&sortBy=alphabetical`;
          return `?serach=${searchValue}`; // 최신순 기본값
        };

        const queryParam = getQueryParam();
        const response = await instance.get(`/api/guest-books${queryParam}`);

        // 응답 데이터가 올바른 형식인지 확인
        const data = response.data.data as ApiResponse;
        console.log(data.guestBookRooms);
        if (data && data.guestBookRooms) {
          setRoomData(data.guestBookRooms); // 응답 데이터를 RoomData 형식으로 설정
        }
      } catch (error) {
        console.log("Error fetching guest books:", error);
        setRoomData([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (!searchValue) {
      fetchGuestBooks();
    }
  }, [searchValue, sortOption]); // 종속성 배열에 roomData는 필요하지 않음

  return (
    <div className="-mx-[2rem] w-[calc(100%+4rem)]">
      <Header
        title="방명록 보관함"
        button2Type={isEdit}
        button2Action={handleCompleteClick}
        padding={true}
        showButton1={true}
        button1Action={headerBtn1}
      />{" "}
      <SearchAndGetCard
        ver="방명록"
        roomData={roomData}
        setRoomData={setRoomData}
        isEdit={isEdit}
        isLoading={isLoading}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSortOption={setSortOption}
        selectedTeamBoxes={selectedTeamBoxes}
        setSelectedTeamBoxes={setSelectedTeamBoxes}
        idToggle={idToggle}
        setIdToggle={setIdToggle}
      />
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
