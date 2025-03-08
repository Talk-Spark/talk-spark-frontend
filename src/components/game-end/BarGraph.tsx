"use client";
import React, { useEffect, useState } from "react";
import ProfileImage from "../ProfileImage";

export interface Player {
  name: string;
  score: number;
}

interface BarGraphProps {
  players: Player[];
}

interface PlayersWithRank extends Player {
  rank: number;
}

/*
    랭킹 타입 분리
    a. 1,2,3 순위
    b. 1,1,1 순위
    c. 1,1,2 순위 -> 1,1,3 순위로 인식할 것!
    d. 1,2,2 순위
    e. 1,2 순위
*/
type RankingType = "a" | "b" | "c" | "d" | "e";

const BarGraph = ({ players }: BarGraphProps) => {
  //3개의 바를 입력받음
  const [topThree, setTopThree] = useState<PlayersWithRank[]>();
  const [barHeights, setBarHeights] = useState<PlayersWithRank["score"][]>([
    0, 0, 0,
  ]);
  const [bottomPosition, setBottomPosition] = useState(25); // profile의 초기 bottom 위치
  const [rankingType, setRankingType] = useState<RankingType>("a");

  useEffect(() => {
    //우선 점수로 내림차순 sorting
    const sortedPlayers = players.sort((a, b) => b.score - a.score);

    //1,2,3순위의 플레이어 숫자
    const rankingCounts = [0, 0, 0];

    //sortedPlayers에서 점수를 보면서 ranking의 숫자 counting (1순위 몇명인지, 2순위 몇명인지)
    let currentScore = sortedPlayers[0].score;
    let rank = 0;
    sortedPlayers.forEach((players) => {
      if (currentScore === players.score) {
        rankingCounts[rank]++;
      } else {
        if (rank < 2) {
          rank++;
          currentScore = players.score;
          rankingCounts[rank]++;
        } else {
          //noting to do.
        }
      }
    });

    const temp: PlayersWithRank[] = [];
    let tempRankingType: RankingType = "a";
    if (rankingCounts[0] === 1 && rankingCounts[1] === 1) {
      if (rankingCounts[2]) {
        // a.
        tempRankingType = "a" as const;
        for (let i = 0; i < 3; i++) {
          temp.push({
            name: sortedPlayers[i].name,
            score: sortedPlayers[i].score,
            rank: i + 1,
          });
        }
      } else {
        //e.
        tempRankingType = "e" as const;
        for (let i = 0; i < 2; i++) {
          temp.push({
            name: sortedPlayers[i].name,
            score: sortedPlayers[i].score,
            rank: i + 1,
          });
        }
      }
    } else if (rankingCounts[0] >= 3) {
      //b.
      tempRankingType = "b" as const;
      for (let i = 0; i < 3; i++) {
        temp.push({
          name: sortedPlayers[i].name,
          score: sortedPlayers[i].score,
          rank: 1,
        });
      }
    } else if (rankingCounts[0] == 2 && rankingCounts[1]) {
      //c. 1,1,3
      tempRankingType = "c" as const;
      for (let i = 0; i < 2; i++) {
        temp.push({
          name: sortedPlayers[i].name,
          score: sortedPlayers[i].score,
          rank: 1,
        });
      }

      temp.push({
        name: sortedPlayers[2].name,
        score: sortedPlayers[2].score,
        rank: 3,
      });
    } else if (rankingCounts[0] == 1 && rankingCounts[1] >= 2) {
      //d.
      tempRankingType = "d" as const;
      temp.push({
        name: sortedPlayers[0].name,
        score: sortedPlayers[0].score,
        rank: 1,
      });

      for (let i = 1; i < 3; i++) {
        temp.push({
          name: sortedPlayers[i].name,
          score: sortedPlayers[i].score,
          rank: 2,
        });
      }
    } else if (
      rankingCounts[0] === 2 &&
      !rankingCounts[1] &&
      !rankingCounts[2]
    ) {
      //e. (단, 위와는 달리 둘의 점수가 같을 때)
      tempRankingType = "e" as const;
      for (let i = 0; i < 2; i++) {
        temp.push({
          name: sortedPlayers[i].name,
          score: sortedPlayers[i].score,
          rank: 1,
        });
      }
    }

    //top 3명 이름, 점수, 랭킹 정보 저장 & 랭킹 타입 저장
    // console.log(temp);
    setTopThree(temp);
    setRankingType(tempRankingType);
  }, [players]);

  //barHeight 계산 (순위에 맞는 bar 높이 부여)
  useEffect(() => {
    // console.log(topThree);
    if (topThree && topThree.length >= 2) {
      const heightsWithRank = [166, 145, 134];

      const tempHeights: number[] = [];
      topThree.forEach((player) => {
        tempHeights.push(heightsWithRank[player.rank - 1]);
      });

      setBarHeights(tempHeights);
      setBottomPosition(101);
    }
  }, [topThree]);

  useEffect(() => {
    // console.log(barHeights);
  }, [barHeights]);

  /*
    랭킹 타입 분리
    a. 1,2,3 순위
    b. 1,1,1 순위
    c. 1,1,2 순위 -> 1,1,3 순위로 인식할 것!
    d. 1,2,2 순위
    e. 1,2 순위
*/
  let leftPostion = [];
  switch (rankingType) {
    case "a":
      leftPostion = [54, 148, 242];
      break;
    case "b":
      leftPostion = [48, 148, 248];
      break;
    case "c":
      leftPostion = [54, 154, 248];
      break;
    case "d":
      leftPostion = [60, 154, 242];
      break;
    case "e":
      leftPostion = [103, 197];
      break;
  }

  const profileSize: (64 | 52)[] = [64, 52, 52];
  const profileLeftPosition = [7.5, 7.5, 7.5];

  const aTypeTopThree =
    topThree?.length === 3 ? [topThree![1], topThree![0], topThree![2]] : [];
  return (
    <section className="relative h-[31.7rem] w-[37.5rem] shrink-0 overflow-hidden bg-gradient-35-pink">
      <article className="mt-[3.2rem] flex flex-col items-center gap-[0.8rem] self-stretch">
        <span className="self-stretch text-center text-body-2-bold text-main-pink">
          {/* 전체 문항 수 ? */}
          {`총 ${topThree?.[0]?.score}문항` || "총 NN문항"}
        </span>
        <h1 className="self-stretch text-center text-headline-3 text-black">
          누가 가장 많이 맞췄을까요?
        </h1>
      </article>

      {rankingType === "a"
        ? aTypeTopThree?.map((player, idx) => (
            <div
              key={`topThree-${idx}`}
              className="w-[8rem] shrink-0 rounded-[12px] bg-transparent transition-all duration-1000 ease-out"
              style={{
                position: "absolute",
                bottom: "-25px",
                left: `${leftPostion[idx]}px`,
                height: `${barHeights[player.rank - 1]}px`,
                transformOrigin: "bottom", // 아래쪽을 기준으로 변형 적용
              }}
            >
              {/*배경만 정확히 블러처리를 위한 before요소 */}
              <div className="absolute inset-0 z-0 rounded-[12px] bg-main-pink-15 blur-[1px]"></div>

              <div
                className="absolute flex flex-col justify-center"
                style={{
                  bottom: `${bottomPosition}px`,
                  left: `${profileLeftPosition[player.rank - 1]}px`,
                  transition: "bottom 1s ease-out",
                }}
              >
                <span
                  className={`mb-[0.8rem] self-stretch text-center text-black ${player.rank === 1 ? "text-subhead-bold" : "text-body-1-med"}`}
                >
                  {player.score}개
                </span>
                <ProfileImage
                  isSelected={player.rank === 1}
                  isSecond={player.rank === 2}
                  noBorder
                  size={profileSize[player.rank - 1]}
                >
                  {player.name}
                </ProfileImage>
              </div>
            </div>
          ))
        : topThree?.map((player, idx) => (
            <div
              key={`topThree-${idx}`}
              className="w-[8rem] shrink-0 rounded-[12px] bg-transparent transition-all duration-1000 ease-out "
              style={{
                position: "absolute",
                bottom: "-25px",
                left: `${leftPostion[idx]}px`,
                height: `${barHeights[player.rank - 1]}px`,
                transformOrigin: "bottom", // 아래쪽을 기준으로 변형 적용
              }}
            >
              {/*배경만 정확히 블러처리를 위한 before요소 */}
              <div className="absolute inset-0 z-0 rounded-[12px] bg-main-pink-15 blur-[1px]"></div>

              <div
                className="absolute flex flex-col justify-center"
                style={{
                  bottom: `${bottomPosition}px`,
                  left: `${profileLeftPosition[player.rank - 1]}px`,
                  transition: "bottom 1s ease-out",
                }}
              >
                <span
                  className={`mb-[0.8rem] self-stretch text-center text-black ${player.rank === 1 ? "text-subhead-bold" : "text-body-1-med"}`}
                >
                  {player.score}개
                </span>
                <ProfileImage
                  isSelected={player.rank === 1}
                  isSecond={player.rank === 2}
                  noBorder
                  size={profileSize[player.rank - 1]}
                >
                  {player.name}
                </ProfileImage>
              </div>
            </div>
          ))}
    </section>
  );
};

export default BarGraph;
