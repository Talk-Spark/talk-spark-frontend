import { FormData } from "@/src/app/(onBoarding)/creating-card/page";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import InputField from "./InputField";

export type StepProps = {
  onNext: () => void;
  formData: FormData;
  onChange: (key: keyof FormData, value: string | number) => void;
};

const Step1 = ({ onNext, formData, onChange }: StepProps) => {
  const [isFormValid, setIsFormValid] = useState(false);

  // 이름 글자 수 제한 (한:6자, 영:11자)
  const validateNameLength = (name: string) => {
    let koreanCount = 0;
    let englishCount = 0;

    for (let i = 0; i < name.length; i++) {
      const charCode = name.charCodeAt(i);
      if (
        (charCode >= 0xac00 && charCode <= 0xd7af) || // 한글 완성형
        (charCode >= 0x3130 && charCode <= 0x318f) || // 한글 호환 자모
        (charCode >= 0x1100 && charCode <= 0x11ff) // 한글 자모
      ) {
        koreanCount += 1;
      } else if (
        (charCode >= 0x0041 && charCode <= 0x005a) || // 영어 대문자
        (charCode >= 0x0061 && charCode <= 0x007a) // 영어 소문자
      ) {
        englishCount += 1;
      }
    }

    return koreanCount <= 6 && englishCount <= 11;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 글자수 제한 범위 내일 경우
    if (validateNameLength(inputValue)) {
      onChange("name", inputValue);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const age = parseInt(value, 10);

    // 숫자인지 확인
    if (!isNaN(age)) {
      onChange("age", age);
    }
  };

  const fields = [
    {
      label: "이름",
      id: "name",
      value: formData.name,
      onChange: handleNameChange,
      placeholder: "이름을 입력해 주세요",
      type: "text",
    },
    {
      label: "나이",
      id: "age",
      value: formData.age === 0 ? "" : formData.age.toString(),
      onChange: handleAgeChange,
      placeholder: "숫자만 입력해 주세요",
      type: "number",
    },
    {
      label: "전공/직무",
      id: "major",
      value: formData.major,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange("major", e.target.value),
      placeholder: "ex. 경영학 전공, IT 서비스 기획 직무",
      type: "text",
      maxLength: 11,
    },
  ];

  useEffect(() => {
    setIsFormValid(!!formData.name && !!formData.age && !!formData.major);
  }, [formData]);

  const handleNext = () => {
    if (isFormValid) {
      onNext();
    }
  };

  return (
    <div className="flex h-[58.7rem] flex-col justify-between">
      <div className="flex flex-col gap-[5.2rem]">
        <div>
          <h2 className="relative mb-[0.8rem] text-headline-3 text-black">
            기본 정보를 입력해 주세요
          </h2>
          <p className="text-body-2-med text-gray-9">
            TalkSpark에서 나만의 명함을 만들어 보세요!
          </p>
        </div>
        <div className="flex flex-col gap-[3.6rem]">
          {fields.map((field) => (
            <InputField
              key={field.id}
              label={field.label}
              id={field.id}
              value={field.value}
              onChange={field.onChange}
              placeholder={field.placeholder}
              type={field.type}
              maxLength={field.maxLength}
            />
          ))}
        </div>
      </div>
      <Button
        onClick={handleNext}
        variant={isFormValid ? "black" : "gray"}
        disabled={!isFormValid}
      >
        다음으로
      </Button>
    </div>
  );
};

export default Step1;
