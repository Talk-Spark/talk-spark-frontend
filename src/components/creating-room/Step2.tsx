import { RoomDataForm } from "@/src/app/creating-room/page";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Button from "../common/Button";

interface Step2Props {
  onNext: () => void;
  formData: RoomDataForm;
  onChange: (data: Partial<RoomDataForm>) => void;
}

const Step2 = ({ onNext, formData, onChange }: Step2Props) => {
  const handleIncrease = () => {
    if ((formData.participants || 2) < 12) {
      onChange({ participants: (formData.participants || 2) + 1 });
    }
  };

  const handleDecrease = () => {
    if ((formData.participants || 2) > 2) {
      onChange({ participants: (formData.participants || 2) - 1 });
    }
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 빈 문자열일 경우 participants를 undefined로 설정
    if (value === "") {
      onChange({ participants: undefined });
      return;
    }

    const numberValue = parseInt(value, 10);

    if (isNaN(numberValue)) {
      onChange({ participants: 2 });
      return;
    }

    if (numberValue < 2) {
      onChange({ participants: 2 });
    } else if (numberValue > 12) {
      onChange({ participants: 12 });
    } else {
      onChange({ participants: numberValue });
    }
  };

  return (
    <div className="flex h-[58.4rem] flex-col justify-between">
      <div>
        <h2 className="relative mb-[8rem] text-headline-3 text-black">
          총 몇 명인가요?
        </h2>
        <div className="flex h-[6rem] items-center justify-between rounded-[1.2rem] border-[1px] border-gray-3 bg-gray-1 px-[7.2rem] py-[1.2rem]">
          <IconButton onClick={handleDecrease}>
            <RemoveIcon sx={{ fontSize: "2.4rem" }} />
          </IconButton>
          <input
            type="number"
            min="2"
            max="12"
            value={formData.participants ?? ""}
            onChange={handleNumberInput}
            placeholder="2"
            className="min-w-[6.4rem] bg-transparent text-center text-headline-3 text-main-pink [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <IconButton onClick={handleIncrease}>
            <AddIcon sx={{ fontSize: "2.4rem" }} />
          </IconButton>
        </div>
      </div>
      <Button onClick={onNext} variant="black">
        다음으로
      </Button>
    </div>
  );
};

export default Step2;
