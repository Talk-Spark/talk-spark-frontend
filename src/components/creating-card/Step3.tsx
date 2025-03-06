import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import InputField from "./InputField";
import { StepProps } from "./Step1";

const Step3 = ({ onNext, formData, onChange }: StepProps) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(!!formData.slogan && !!formData.tmi);
  }, [formData]);

  const fields = [
    {
      label: "나는 이런 사람이야",
      id: "slogan",
      value: formData.slogan,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange("slogan", e.target.value),
      placehorder: "ex. 만능 개발자",
      type: "text",
      maxLength: 20,
    },
    {
      label: "나의 TMI는?",
      id: "tmi",
      value: formData.tmi,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange("tmi", e.target.value),
      placehorder: "ex. 흰 머리가 많다",
      type: "text",
      maxLength: 20,
    },
  ];

  return (
    <div className="flex h-[58.7rem] flex-col justify-between">
      <div className="flex flex-col gap-[5.2rem]">
        <div>
          <h2 className="mb-[0.8rem] text-headline-3 text-black">
            나만의 명함을 만들어 보세요!
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

export default Step3;
