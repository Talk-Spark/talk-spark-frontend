//가장 큰 문제: 애초에 방장임을 명확히 확인할 수 없음

"use client";
import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
import { get } from "@/src/apis";
import ProfileImage from "@/src/components/ProfileImage";
import FindRoom from "@/src/components/entry/FindRoom";
import { getUserData, UserLocalData } from "@/src/utils";
import { Start } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";

//  참가자들 정보
interface Participant {
  name: string;
  owner: boolean;
  sparkUserId: number;
  color: "PINK" | "MINT" | "YELLOW" | "BLUE";
}

/* 방 정보 보기 요청 interface (웹소켓 : response에 맞게 수정하시면 됩니다) */
interface GameRoomDetail {
  roomId: number;
  roomName: string;
  difficulty: number;
  maxPeople: number;
}

//roomUpdate 소켓으로 받아오는 정보
interface RoomUpdateProps {
  name: string;
  owner: boolean;
  sparkUserId: number;
  color: "PINK" | "MINT" | "YELLOW" | "BLUE";
}

const TeamDetail = () => {
  //2.4.0 버전을 사용하기 때문에 타입 미존재(4.8.1 은 에러 발생)
  const socketRef = useRef<any>(null);
  const router = useRouter();

  const [user, setUser] = useState<UserLocalData | null>(null);
  const [isHost, setIsHost] = useState(!!localStorage.getItem("isGameHost"));
  const { id } = useParams(); // roomId 파라미터 가져온 후 get
  const [teamData, setTeamData] = useState<GameRoomDetail | null>(null);
  const [userDatas, setUserDatas] = useState<Participant[] | null>(null);
  const [isLottie, setIsLottie] = useState(false);

  const gameStartRef = useRef(false);
  const [gameStart, setGameStart] = useState(false);

  const difficulty: Record<number, string> = {
    1: "하",
    2: "중",
    3: "상",
    4: "랜덤",
  };

  //(only 방장) 게임 시작 버튼
  const handleStartGame = (roomId: string) => {
    socketRef.current?.emit("startGame", { roomId });
  };

  const startGame = () => {
    setIsLottie(true);
    handleStartGame(id as string);
  };

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push("/");
    } else {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (user) {
      socketRef.current = io("https://talkspark.site/", {
        transports: ["websocket"],
      });

      console.log(socketRef.current);

      socketRef.current.emit("joinRoom", {
        roomId: id,
        accessToken: user.accessToken,
        isHost: isHost, //연결 되는지 테스트
      });

      socketRef.current.on("roomUpdate", (arr: RoomUpdateProps[]) => {
        if (arr.length) setUserDatas(arr);
      });

      //게임이 시작되었을 떄
      socketRef.current?.on("startGame", (data: any) => {
        setGameStart(true);
      });

      socketRef.current.on("roomJoinError", (data: any) => {
        alert(data);
      });

      // const handleBeforeUnload = () => {
      //   socketRef.current.emit("leaveRoom", {
      //     roomId: id,
      //     accessToken: user.accessToken,
      //     isHost,
      //   });
      //   socketRef.current.disconnect();
      // };

      const setHostAndRoomData = async () => {
        try {
          //const response = await get(`/api/rooms/is-host?roomId=${id}`); //host 여부 받아오는 api
          const response2 = await get(`/api/rooms/${id}`); //방에 대한 정보 받아오는 api
          //setIsHost(response.data as boolean);
          setTeamData(response2.data as GameRoomDetail);
          console.log(response2.data);
        } catch (err) {
          console.error("Error fetching host data:", err);
        }
      };

      setHostAndRoomData();

      // window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        if (socketRef.current) {
          //방 퇴장시
          //console.log(gameStart);
          if (!gameStartRef.current) {
            console.log("나간다");
            socketRef.current.emit("leaveRoom", {
              roomId: id,
              accessToken: user.accessToken,
              isHost: isHost,
            });
          }
          socketRef.current.disconnect();
          // window.removeEventListener("beforeunload", handleBeforeUnload);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    gameStartRef.current = gameStart;
    if (gameStart) router.push(`/flow?roomId=${id}`);
  }, [gameStart]);

  // console.log(teamData);
  //console.log(userDatas); //특이하게, 참여자 수가 넘치면 더이상 정보를 못 받아옴 (메세지를 안 넘기는거임)
  if (!teamData || !userDatas) {
    return (
      <div>
        <FindRoom findText={"우리 팀 로딩 중이에요!"} />
      </div>
    );
  }

  return (
    <div className="w-[cal(100% + 4rem)] -mx-[2rem] h-[71.2rem] bg-gray-1 px-[2rem]">
      {isLottie ? (
        <Start />
      ) : (
        <div className="flex h-[62.8rem] flex-col justify-between pb-[6rem] pt-[2.4rem]">
          <div className="flex flex-col gap-[5.2rem]">
            <div className="flex justify-center">
              <div className="flex flex-col">
                <span className="text-center text-body-1-med text-gray-7">
                  난이도{" "}
                  <span className="text-black">
                    {difficulty[teamData.difficulty]}
                  </span>
                </span>
                <span className="mb-[1.2rem] mt-[0.8rem] text-headline-3 text-black">
                  {teamData.roomName}
                </span>
                <span className="text-center text-subhead-med">
                  <span className="text-subhead-bold text-main-pink">
                    {userDatas.length}
                  </span>
                  <span className="text-gray-12">
                    {" / "}
                    {teamData.maxPeople}
                  </span>
                </span>
              </div>
            </div>

            <div
              key={teamData.roomId}
              className="flex w-full flex-1 flex-wrap gap-x-[1.6rem] gap-y-[2rem] px-[0.75rem]"
            >
              {userDatas.map((participant, index) => (
                <div
                  key={index}
                  className="max-w-[(100%-4.8rem)/4] flex-1"
                  style={{ maxWidth: "calc((100% - 4.8rem) / 4)" }}
                >
                  <ProfileImage
                    color={participant.color}
                    isHost={participant.owner}
                  >
                    {participant.name}
                  </ProfileImage>
                </div>
              ))}
            </div>
          </div>
          {/* 로그인한 사용자가 방장일 경우 '시작하기' 버튼 */}
          {isHost ? (
            <button
              onClick={startGame}
              className="w-full cursor-pointer rounded-[1.2rem] bg-main-pink py-[1.6rem] text-center text-subhead-bold text-white"
              // disabled={userDatas.length < 2} // 참가자가 한명일때는 불가
            >
              시작하기
            </button>
          ) : (
            <button
              disabled={true}
              className="w-full cursor-not-allowed rounded-[1.2rem] bg-gray-3 py-[1.5rem] text-center text-subhead-bold text-white"
            >
              시작을 기다리고 있어요
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default TeamDetail;
