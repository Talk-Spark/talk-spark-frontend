import React from "react";
import { Player } from "./BarGraph";

interface RankingSheetProps {
  otherPlayers: Player[];
}

const RankingSheet = ({ otherPlayers }: RankingSheetProps) => {
  return (
    <section className="fixed top-[32.5rem] z-10 flex h-[43.9rem] w-full max-w-[76.8rem] flex-col items-center self-stretch rounded-b-[0px] rounded-t-[24px] bg-white pb-[12.7rem] pl-[2rem] pr-[2rem] pt-[2rem] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.08)]">
      {otherPlayers.map((player, idx) => (
        <article
          className="mb-[8px] flex h-[5.2rem] items-center justify-between self-stretch rounded-[1.2rem] border-[1.2px] border-gray-4 bg-white pb-[1.2rem] pl-[1.2rem] pr-[2.2rem] pt-[1.2rem]"
          key={`otherPlayer-${idx}`}
        >
          <div className="flex items-center gap-[1.2rem]">
            <div className="padding-[0.4rem_0.9rem] flex h-[2.8rem] w-[2.8rem] flex-col items-center justify-center gap-[1rem] rounded-[1.4rem] bg-gray-3 text-body-2-bold">
              {idx + 4}
            </div>
            <span className="text-body-2-med text-gray-12">{player.name}</span>
          </div>
          <span className="self-stretch text-center text-body-2-med text-black">
            {player.score}개
          </span>
        </article>
      ))}
    </section>
  );
};

export default RankingSheet;
