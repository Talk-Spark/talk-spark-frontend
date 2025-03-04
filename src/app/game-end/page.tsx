"use client";

import BarGraph from "@/src/components/game-end/BarGraph";
import RankingSheet from "@/src/components/game-end/RankingSheet";
import React, { useEffect, useState } from "react";
import { FinalPeopleProps } from "../(flow)/flow/page";
import Header from "@/src/components/Headers/Header";
import { useRouter } from "next/navigation";
import { getDataFromLocalStorage } from "@/src/utils";

export interface Player {
  name: string;
  score: number;
}

const DUMMY_DATA: Player[] = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 82 },
  { name: "Charlie", score: 92 },
  { name: "David", score: 78 },
  { name: "Eve", score: 88 },
];

export default function GameEnd() {
  const router = useRouter();
  const [finalData, setFinalData] = useState<Player[] | null>(null);

  useEffect(() => {
    const finalPeople = getDataFromLocalStorage("finalPeople");
    const finalScores = getDataFromLocalStorage("finalScores");

    // 로직
    if (finalPeople && finalScores) {
      const finalData: Player[] = (finalPeople as FinalPeopleProps[])
        .filter((person) => finalScores[person.ownerId] !== undefined) // 점수가 있는 사람만 매칭
        .map((person) => ({
          name: person.name,
          score: finalScores[person.ownerId],
        }));

      setFinalData(finalData);
    }
  }, []);

  if (!finalData) return;

  //todo: 실제로 받아온 정보로 나중에는 슬라이싱해서 ranking sheet에 넘기기.
  const sortedPlayers = finalData.sort((a, b) => b.score - a.score);
  const otherPlayers = finalData.length >= 4 ? sortedPlayers.slice(3) : [];

  return (
    <>
      <Header
        title="최종 스코어"
        button2Type="next"
        padding={false}
        button2Action={() => {
          router.push("/all-cards");
        }}
      />
      <main className="w-[cal(100% + 4rem)] -mx-[2rem] flex flex-col items-center bg-gray-1">
        <BarGraph players={finalData} />
        <RankingSheet otherPlayers={otherPlayers} />
      </main>
    </>
  );
}
