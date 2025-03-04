import { useState, useEffect } from "react";
import SearchInput from "../SearchInput";
import Sorting from "./Sorting";
import TeamBox from "./TeamBox";
import Modal from "../common/Modal";
import { instance, put } from "@/src/apis";
import { motion } from "framer-motion";
import { CardHolderResponse } from "@/src/app/card/page";

interface Team {
  cardHolderId: number;
  cardHolderName: string;
  numOfTeammates: number;
  teamNames: string[];
  bookMark: boolean;
  storedAt: string;
}

interface Room {
  roomId: number;
  roomName: string;
  roomPeopleCount: number;
  roomDateTime: string;
  guestBookFavorited: boolean;
  preViewContent: string;
}

type GuestBookProps = {
  ver: "방명록" | "명함";
  roomData?: Room[];
  setRoomData?: React.Dispatch<React.SetStateAction<Room[]>>;
  isEdit: "edit" | "complete";
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  setSortOption: (option: string) => void;
  setSearchValue: (value: string) => void;
  searchValue: string;
};

type NameCardProps = GuestBookProps & {
  teamData?: Team[];
  setTeamData?: React.Dispatch<React.SetStateAction<Team[]>>;
  isNewData?: boolean;
  setIsNewData?: (value: boolean) => void;
  setIsCamera?: (value: boolean) => void;
  searchValue: string;
  selectedTeamBoxes?: number[];
  setSelectedTeamBoxes?: (value: number[]) => void;
  idToggle: number;
  setIdToggle: (value: number) => void;
};

const SearchAndGetCard = (props: NameCardProps) => {
  const {
    ver,
    teamData,
    setTeamData,
    roomData,
    setRoomData,
    isEdit,
    isLoading,
    setIsLoading,
    setSortOption,
    setIsCamera,
    setSearchValue,
    searchValue,
    selectedTeamBoxes,
    setSelectedTeamBoxes,
    isNewData,
    setIsNewData,
    idToggle,
    setIdToggle,
  } = props;

  const [isModal, setIsModal] = useState(false);
  const [deleteType, setDeleteType] = useState<"selected" | "all" | null>(null);
  const [filterDataC, setFilterDataC] = useState<Team[]>([]);
  const [filterDataR, setFilterDataR] = useState<Room[]>([]);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    if (teamData) {
      setFilterDataC(teamData);
    } else if (roomData) {
      setFilterDataR(roomData);
    }
  }, [teamData, roomData]);

  useEffect(() => {
    if (teamData) {
      setDataLength(filterDataC.length);
    } else if (roomData) {
      setDataLength(filterDataR.length);
    }
  }, [filterDataR, filterDataC]);

  // const [animateButton, setAnimateButton] = useState(false); // 버튼 애니메이션 상태

  // const dataLength = filterDataC ? filterDataC?.length : filterDataR?.length;

  // 버튼 애니메이션을 0.5초 뒤에 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      // setAnimateButton(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const addCardBtn = () => {
    if (ver === "명함" && setIsCamera) {
      setIsCamera(true); // setIsCamera가 정의되어 있을 때만 호출
    }
  };

  useEffect(() => {
    if (isEdit === "edit" && setSelectedTeamBoxes) {
      setSelectedTeamBoxes([]);
    }
  }, [isEdit]);

  // 편집 시 팀 박스 선택
  const handleSelectTeamBox = (index: number) => {
    if (isEdit === "edit") {
      return;
    }
    if (selectedTeamBoxes && setSelectedTeamBoxes) {
      if (selectedTeamBoxes.includes(index)) {
        // 기존 팀 박스 선택/해제 처리
        setSelectedTeamBoxes(
          selectedTeamBoxes.filter((item) => item !== index),
        );
      } else {
        setSelectedTeamBoxes([...selectedTeamBoxes, index]);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (teamData && setTeamData && selectedTeamBoxes && setSelectedTeamBoxes) {
      /* 보관된 명함 삭제 (선택)) API */
      try {
        // 선택된 팀 Id
        const selectedTeamIds = selectedTeamBoxes?.map(
          (index) => teamData[index].cardHolderId,
        );

        // 각 선택된 cardId에 대해 DELETE 요청 보내기
        const deleteRequests = selectedTeamIds.map((cardHolderId) =>
          instance.delete(`/api/storedCard/${cardHolderId}`),
        );

        // 모든 DELETE 요청을 병렬로 처리
        await Promise.all(deleteRequests);

        // 요청이 모두 완료되면 선택된 팀 박스를 초기화하고 모달을 닫기
        setSelectedTeamBoxes([]);
        setIsModal(false);
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    } else if (
      roomData &&
      setRoomData &&
      selectedTeamBoxes &&
      setSelectedTeamBoxes
    ) {
      /* 보관된 방명록 삭제 (선택)) API */
      try {
        // 선택된 방명록 Id
        const selectedRoomIds = selectedTeamBoxes.map(
          (index) => roomData[index].roomId,
        );

        // 각 선택된 roomId에 대해 DELETE 요청 보내기
        const deleteRequests = selectedRoomIds.map((roomId) =>
          instance.delete(`/api/storedCard/${roomId}`),
        );

        // 모든 DELETE 요청을 병렬로 처리
        await Promise.all(deleteRequests);

        // 요청이 모두 완료되면 선택된 방명록 박스를 초기화하고 모달을 닫기
        setSelectedTeamBoxes([]);
        setIsModal(false);
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    } else {
      console.log("모하니?");
    }
  };

  useEffect(() => {
    if (teamData && setTeamData) {
      /* 보관된 명함에 대한 즐겨찾기 PUT */
      const putFav = async (favId: number) => {
        await put(`/api/storedCard/${favId}`);
      };
      if (idToggle && idToggle >= 0) {
        putFav(idToggle);
        setTeamData((prevData) =>
          prevData.map((team) =>
            team.cardHolderId === idToggle
              ? { ...team, bookMark: !team.bookMark }
              : team,
          ),
        );
      }
    } else if (roomData && setRoomData) {
      /* 보관된 방명록에 대한 즐겨찾기 PUT (배열) */
      const putFav = async (favId: number) => {
        await put(`/api/guest-books/${favId}`);
      };
      if (idToggle && idToggle >= 0) {
        putFav(idToggle);
        setRoomData((prevData) =>
          prevData.map((room) =>
            room.roomId === idToggle
              ? { ...room, guestBookFavorited: !room.guestBookFavorited }
              : room,
          ),
        );
      }
    }
  }, [idToggle]);

  const handleDeleteAll = () => {
    if (setSelectedTeamBoxes) {
      /* 보관된 명함 삭제하기 DELETE (전체)  API */
      if (ver === "명함" && teamData) {
        let allIndexes: number[] = [];

        allIndexes = teamData.map((_, index) => index);

        if (selectedTeamBoxes?.length === allIndexes.length) {
          setSelectedTeamBoxes([]);
        } else {
          setSelectedTeamBoxes(allIndexes);
          // console.log(selectedTeamBoxes);
        }
      } else if (ver === "방명록" && roomData && setRoomData) {
        /* 방명록 삭제하기  API */
        if (selectedTeamBoxes?.length === roomData.length) {
          setSelectedTeamBoxes([]); // 선택 해제
        } else {
          const allIndexes = roomData.map((_, index) => index);
          setSelectedTeamBoxes(allIndexes);
        }
      }
    }
    setIsModal(false);
  };

  const deleteModal = (type: "selected" | "all") => {
    setDeleteType(type);
    if (type === "selected") {
      setIsModal(true);
    } else if (type === "all") {
      handleDeleteAll();
    }
  };

  const handleConfirmDelete = () => {
    if (deleteType === "selected") {
      handleDeleteSelected();
    } else if (deleteType === "all") {
      handleDeleteAll();
    }
    setIsModal(false);
  };

  const handleSearch = () => {
    const keyword = searchValue.trim().toLowerCase(); // 검색어를 소문자로 변환

    const calculateSimilarity = (str1: string, str2: string): number => {
      // 간단한 유사도 계산: 검색어가 포함된 위치와 길이 비교
      const index = str1.indexOf(str2);
      return index !== -1 ? str2.length - index : -1; // 일치 길이 - 포함된 위치
    };

    if (ver === "명함" && teamData && setTeamData) {
      const filteredTeams = teamData
        .filter((team) => team.cardHolderName.toLowerCase().includes(keyword)) // 필터링
        .sort(
          (a, b) =>
            calculateSimilarity(b.cardHolderName.toLowerCase(), keyword) -
            calculateSimilarity(a.cardHolderName.toLowerCase(), keyword),
        ); // 유사도로 정렬
      console.log(filteredTeams);
      setFilterDataC(filteredTeams);
    } else if (ver === "방명록" && roomData && setRoomData) {
      const filteredRooms = roomData
        .filter((room) => room.roomName.toLowerCase().includes(keyword)) // 필터링
        .sort(
          (a, b) =>
            calculateSimilarity(b.roomName.toLowerCase(), keyword) -
            calculateSimilarity(a.roomName.toLowerCase(), keyword),
        ); // 유사도로 정렬
      setFilterDataR(filteredRooms);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <div className="w-full bg-white">
      <div className="w-[calc(100% - 4rem)] mx-[2rem] pb-[19rem]">
        <SearchInput
          setSearchValue={setSearchValue}
          placeholderText={
            ver === "명함" ? "팀명 또는 이름 검색" : "방명록 검색"
          }
          isQr={false}
          onSearch={handleSearch}
        />
        <div className="mb-[1.2rem] mt-[2.4rem] flex h-[3.6rem] w-full justify-between">
          <div className="flex items-center gap-[0.4rem]">
            <span className="text-body-1-med text-gray-11">
              보관된 {ver === "명함" ? "명함" : "방명록"}
            </span>
            <span className="text-body-1-bold text-gray-7">{dataLength}</span>
          </div>
          <Sorting
            deleteModal={deleteModal}
            setSortOption={setSortOption}
            isEdit={isEdit}
          />
        </div>
        <div className="flex w-full flex-col gap-[1.2rem]">
          {ver === "명함"
            ? filterDataC?.map((team, index) => (
                <TeamBox
                  key={index}
                  ver={ver}
                  team={team}
                  index={index}
                  isSelected={selectedTeamBoxes?.includes(index) || false}
                  isEdit={isEdit}
                  onSelect={handleSelectTeamBox}
                  isLoading={isLoading}
                  idToggle={idToggle}
                  setIdToggle={setIdToggle}
                  isNewData={isNewData}
                  setIsNewData={setIsNewData}
                />
              ))
            : filterDataR?.map((room, index) => (
                <TeamBox
                  key={index}
                  ver={ver}
                  room={room}
                  index={index}
                  isSelected={selectedTeamBoxes?.includes(index) || false}
                  isEdit={isEdit}
                  onSelect={handleSelectTeamBox}
                  isLoading={isLoading}
                  idToggle={idToggle}
                  setIdToggle={setIdToggle}
                />
              ))}
        </div>
      </div>
      {isModal && (
        <Modal
          actionText="취소"
          buttonText={ver === "방명록" ? "방명록 삭제" : "명함 삭제"}
          isOpen={true}
          title={
            ver === "방명록"
              ? "방명록을 삭제하시겠어요?"
              : "명함을 삭제하시겠어요?"
          }
          description={
            ver === "방명록"
              ? "대화방 내용이 복구되지 않아요"
              : "명함 내용이 복구되지 않아요"
          }
          onAction={() => setIsModal(false)}
          onClose={handleConfirmDelete}
        />
      )}
      {ver === "명함" && (
        <motion.div
          className="fixed bottom-0 flex h-[10.6rem] w-full max-w-[76.8rem] justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0.28%, #FFF 158.49%)",
          }}
        >
          <button
            onClick={addCardBtn}
            className="h-[5.6rem] w-[33.5rem] rounded-[1.2rem] bg-gray-11 text-subhead-bold text-white"
          >
            명함 추가하기
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndGetCard;
