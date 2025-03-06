import rightArrow from "@/public/nameCard/rightArrow.svg";
import leftArrow from "@/public/nameCard/leftArrow.svg";
import Image from "next/image";

interface ArrowProps {
  otherCards: Array<{ storedCardId: number }>;
  previous: () => void;
  next: () => void;
  currentIndex: number;
}
const Arrow: React.FC<ArrowProps> = ({
  otherCards,
  previous,
  next,
  currentIndex,
}) => {
  return (
   <div className="mt-[1.6rem] flex justify-center gap-[2rem]">
      <div onClick={previous}>
        <Image
          className="h-[2.4rem] w-[2.4rem]"
          src={leftArrow}
          alt="오른쪽 화살표"
        />
      </div>
      <div className="flex w-[4rem] justify-between gap-[0.4rem]">
        <span className="flex w-[0.9rem] items-center text-body-2-bold text-main-pink">
          {currentIndex + 1}
        </span>
        <span className="flex items-center text-body-2-med text-gray-12">
          /
        </span>
        <span className="flex items-center text-body-2-med text-gray-12">
          {otherCards.length}
        </span>
      </div>
      <div onClick={next}>
        <Image
          className="h-[2.4rem] w-[2.4rem]"
          src={rightArrow}
          alt="오른쪽 화살표"
        />
      </div>
    </div>
  );
};
export default Arrow;
 