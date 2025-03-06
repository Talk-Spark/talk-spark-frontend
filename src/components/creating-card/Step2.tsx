import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import InputField from "./InputField";
import { StepProps } from "./Step1";

const Step2 = ({ onNext, formData, onChange }: StepProps) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(!!formData.mbti && !!formData.hobby && !!formData.lookAlike);
  }, [formData]);

  const fields = [
    {
      label: "나의 MBTI 유형은?",
      id: "mbti",
      value: formData.mbti,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange("mbti", e.target.value),
      placehorder: "ex. ESTJ",
      type: "text",
      maxLength: 4,
    },
    {
      label: "나의 취미는??",
      id: "hobby",
      value: formData.hobby,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange("hobby", e.target.value),
      placehorder: "ex. 영화 보기",
      type: "text",
      maxLength: 15,
    },
    {
      label: "나의 닮은꼴은?",
      id: "lookAlike",
      value: formData.lookAlike,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange("lookAlike", e.target.value),
      placehorder: "ex. 토끼",
      type: "text",
      maxLength: 15,
    },
  ];

  return (
    <div className="flex h-[58.7rem] flex-col justify-between">
      <div className="flex flex-col gap-[5.2rem]">
        <div>
          <h2 className="mb-[0.8rem] text-headline-3 text-black">
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
              placeholder={field.placehorder}
              type={field.type}
              maxLength={field.maxLength}
            />
          ))}
        </div>
      </div>
      <Button
        onClick={onNext}
        variant={isFormValid ? "black" : "gray"}
        disabled={!isFormValid}
      >
        다음으로
      </Button>
    </div>
  );
};

export default Step2;
