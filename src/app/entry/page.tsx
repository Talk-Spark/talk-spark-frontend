"use client";

import SearchInput from "@/src/components/SearchInput";
import TeamRoomList from "@/src/components/entry/TeamRoomList";
import { useEffect, useState } from "react";
import FindRoom from "@/src/components/entry/FindRoom";
import { instance } from "@/src/apis";
import ReadCode from "@/src/components/QrCode/ReadCode";
import Header from "@/src/components/Headers/Header";
import Template from "@/src/components/Router/template";
import { useRouterWrapper } from "@/src/components/Router/RouterWrapperProvider";

// 방 타입 정의
interface GameRoom {
  roomId: number;
  roomName: string;
  hostName: string;
  currentPeople: number;
  maxPeople: number;
}

interface Room {
  roomName: string;
}

const Entry = () => {
  const router = useRouterWrapper();
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredRooms, setFilteredRooms] = useState<GameRoom[]>([]);
  const [isCamera, setIsCamera] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [myRun, setMyRun] = useState<{
    cardId: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    localStorage.removeItem("isGameHost"); //entry를 통해 접근하는 사람은 방장이 아닌 것으로 치부.
  }, []);

  const handleSearch = async () => {
    setFilteredRooms([]);
    const keyword = searchValue.trim().toLowerCase(); // 검색어를 소문자로 변환

    const calculateSimilarity = (str1: string, str2: string): number => {
      // 간단한 유사도 계산: 검색어가 포함된 위치와 길이 비교
      const index = str1.indexOf(str2);
      return index !== -1 ? str2.length - index : -1; // 일치 길이 - 포함된 위치
    };

    setFilteredRooms([]); // 필터링 전에 초기화

    try {
      const response = await instance.get("/api/rooms", {
        params: { searchName: searchValue }, // 검색어를 쿼리 매개변수로 전달
      });

      // 검색된 데이터에서 유사도 기준으로 필터링 및 정렬
      const filteredRooms: GameRoom[] = response.data
        .filter(
          (room: GameRoom) =>
            calculateSimilarity(room.roomName.toLowerCase(), keyword) !== -1,
        ) // 유사도가 0 이상인 것만 필터링
        .sort(
          (a: GameRoom, b: GameRoom) =>
            calculateSimilarity(b.roomName.toLowerCase(), keyword) -
            calculateSimilarity(a.roomName.toLowerCase(), keyword), // 유사도 기준으로 정렬
        );

      setFilteredRooms(filteredRooms);
      console.log(response.data);
      console.log(filteredRooms);
    } catch (err) {
      console.error("Error fetching team data:", err);
    }
  };

  // 방 검색하기 api
  useEffect(() => {
    if (isFirst) {
      handleSearch();
    }
  }, [searchValue]);

  const headerBtn1 = () => {
    if (isCamera) {
      setIsCamera(false);
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full">
      <Header
        showButton1={true}
        button1Action={headerBtn1}
        title="입장하기"
        padding={false}
      />

      {isCamera && (
        <div className="w-[calc(100%+4rem) -mx-[2rem]">
          <ReadCode
            myRun={myRun}
            setMyRun={setMyRun}
            setIsCamera={setIsCamera}
            qrVer="room"
          />
        </div>
      )}
      <div className="my-[2.4rem] my-[2rem] flex flex-col">
        <span className="text-headline-3 text-black">팀 방 찾기</span>
        <SearchInput
          setSearchValue={setSearchValue}
          placeholderText={"팀 방 검색"}
          isQr={true}
          setIsCamera={setIsCamera}
          onSearch={handleSearch}
          setIsFirst={setIsFirst}
        />
      </div>
      {isFirst && filteredRooms.length > 0 ? (
        <TeamRoomList gameRooms={filteredRooms} />
      ) : (
        <FindRoom findText={"우리 팀을 찾아보아요~"} />
      )}
    </div>
  );
};

export default function EntryPage() {
  return (
    <Template>
      <Entry />
    </Template>
  );
}
