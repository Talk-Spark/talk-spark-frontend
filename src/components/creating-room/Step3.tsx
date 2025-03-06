import difficult from "@/public/Image/creating-room/difficult_default.png";
import difficult_pressed from "@/public/Image/creating-room/difficult_pressed.png";
import easy from "@/public/Image/creating-room/easy_default.png";
import easy_pressed from "@/public/Image/creating-room/easy_pressed.png";
import normal from "@/public/Image/creating-room/normal_default.png";
import normal_pressed from "@/public/Image/creating-room/normal_pressed.png";
import random from "@/public/Image/creating-room/random_default.png";
import random_pressed from "@/public/Image/creating-room/random_pressed.png";
import { post } from "@/src/apis";
import { RoomDataForm } from "@/src/app/creating-room/page";
import { AxiosResponse } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../common/Button";

interface Step3Props {
  onNext: () => void;
  formData: RoomDataForm;
  onChange: (data: Partial<RoomDataForm>) => void;
}

interface RoomResponse {
  roomId: number;
  roomName: string; // response.data의 구조에 맞게 정의
}

const Step3 = ({ formData, onChange }: Step3Props) => {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const levels = [
    {
      id: 1,
      name: "하",
      defaultImage: easy,
      pressedImage: easy_pressed,
    },
    {
      id: 2,
      name: "중",
      defaultImage: normal,
      pressedImage: normal_pressed,
    },
    {
      id: 3,
      name: "상",
      defaultImage: difficult,
      pressedImage: difficult_pressed,
    },
    {
      id: 4,
      name: "랜덤",
      defaultImage: random,
      pressedImage: random_pressed,
    },
  ];

  const handleLevelClick = (levelId: number) => {
    setIsFormValid(true);
    setSelectedLevel(levelId);

    if (levelId === 4) {
      const randomLevel = Math.floor(Math.random() * 3) + 1; // 1~3 범위의 랜덤 값
      onChange({ difficulty: randomLevel });
    } else {
      onChange({ difficulty: levelId });
    }
  };

  const createNewRoom = async () => {
    const userObj = localStorage.getItem("user");
    if (!userObj) {
      alert("로그인 정보가 없습니다.");
      return;
    }
    // const sparkUserId = JSON.parse(userObj).sparkUserId;

    try {
      const response: AxiosResponse<RoomResponse> = await post("/api/rooms", {
        roomName: formData.name,
        maxPeople: formData.participants,
        difficulty: formData.difficulty,
        // hostId: sparkUserId,
      });

      //roomId를 사용할 일이 있으면 사용
      const roomId = response.data.roomId;
      console.log(roomId);
      // roomId가 유효한 숫자인지 확인
      if (typeof roomId === "number") {
        // 숫자를 문자열로 변환 후 저장
        localStorage.setItem("roomId", roomId.toString());
        console.log("룸아이디저장됨");
      }

      router.push(`/creating-room/result?roomId=${roomId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextClick = () => {
    createNewRoom();
  };

  return (
    <div className="flex h-[58.4rem] flex-col justify-between">
      <div>
        <h2 className="relative mb-[0.8rem] text-headline-3 text-black">
          난이도를 선택해 주세요
        </h2>
        <p className="mb-[5.2rem] text-body-2-med text-gray-9">
          4인 기준 예상 소요 시간이에요
        </p>
        <div className="grid grid-cols-2 gap-[1.2rem]">
          {levels.map((level) => (
            <div
              key={level.id}
              className="flex flex-col items-center gap-[1.2rem]"
              onClick={() => handleLevelClick(level.id)}
            >
              <Image
                src={
                  selectedLevel === level.id
                    ? level.pressedImage
                    : level.defaultImage
                }
                alt={level.name}
                width={162}
                height={161}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-[1.6rem]">
        <Button
          onClick={handleNextClick}
          variant={isFormValid ? "black" : "gray"}
          disabled={!isFormValid}
        >
          다음으로
        </Button>
      </div>
    </div>
  );
};

export default Step3;
