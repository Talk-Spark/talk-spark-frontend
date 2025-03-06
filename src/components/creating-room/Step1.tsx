import { instance } from "@/src/apis";
import { RoomDataForm } from "@/src/app/creating-room/page";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import InputField from "../creating-card/InputField";

interface Step1Props {
  onNext: () => void;
  formData: RoomDataForm;
  onChange: (data: Partial<RoomDataForm>) => void;
}

const Step1 = ({ onNext, formData, onChange }: Step1Props) => {
  const maxLength = 20; // 최대 글자 수 설정
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null); // 중복 여부 상태

  // 디바운싱된 API 호출 함수
  const checkRoomNameDuplicate = debounce(async (roomName: string) => {
    if (!roomName) {
      setIsDuplicate(null); // 방 이름이 없으면 초기 상태 설정
      return;
    }

    try {
      const response = await instance.get(
        `/api/rooms/is-duplicate?roomName=${roomName}`,
      );
      setIsDuplicate(response.data); // true: 중복, false: 중복X
    } catch (error) {
      console.error("방 이름 중복 확인 중 오류 발생:", error);
      setIsDuplicate(null);
    }
  }, 500);

  // 방 이름 변경 시 디바운싱된 함수 호출
  const handleRoomNameChange = (value: string) => {
    onChange({ name: value });
    checkRoomNameDuplicate(value);
  };

  useEffect(() => {
    // 언마운트 시 디바운스된 함수 취소
    return () => {
      checkRoomNameDuplicate.cancel();
    };
  }, []);

  return (
    <div className="flex h-[58.4rem] flex-col justify-between">
      <div>
        <h2 className="relative mb-[8rem] text-headline-3 text-black">
          팀 방 이름은 무엇인가요?
        </h2>
        <div className="relative">
          <InputField
            id="roomName"
            value={formData.name}
            onChange={(e) => handleRoomNameChange(e.target.value)}
            placeholder="팀 방 이름을 입력해 주세요"
            type="text"
            maxLength={maxLength}
            isDuplicate={isDuplicate}
            icon={
              isDuplicate === true ? (
                <ErrorOutline
                  style={{ height: "2.4rem", width: "2.4rem" }}
                  className="text-main-pink"
                />
              ) : isDuplicate === false ? (
                <CheckCircleOutline
                  style={{ height: "2.4rem", width: "2.4rem" }}
                  className="text-gray-10"
                />
              ) : null
            }
          />
          <div className="flex justify-between">
            <div className="absolute right-0 mt-[0.8rem] text-caption-med text-gray-6">
              {formData.name.length}/{maxLength}
            </div>
            {isDuplicate && (
              <div className="text-body-2-med text-main-pink">
                이미 사용 중인 이름이에요
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={onNext}
        variant={
          isDuplicate === true || formData.name.length === 0 ? "gray" : "black"
        }
        disabled={isDuplicate === true || formData.name.length === 0}
      >
        다음으로
      </Button>
    </div>
  );
};

export default Step1;
