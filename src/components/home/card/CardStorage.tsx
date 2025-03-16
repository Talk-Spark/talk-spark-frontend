// 명함 저장소
import { instance } from "@/src/apis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NameCardComponent from "./NameCardComponent";

// 팀 내 명함 정보
export interface cards {
  storedCardId: number;
  name: string;
  age: number;
  major: string;
  mbti: string;
  hobby: string;
  lookAlike: string;
  slogan: string;
  tmi: string;
  cardThema: string;
  bookMark: boolean;
  cardHolderName: string;
}

interface Team {
  cardHolderId: number;
  teamName: string;
  cards: cards[];
}

interface TeamResponse {
  cardHolderId: number;
  teamName: string;
  cards: {
    storedCardId: number;
    name: string;
    age: number;
    major: string;
    mbti: string;
    hobby: string;
    lookAlike: string;
    slogan: string;
    tmi: string;
    cardThema: string;
    bookMark: boolean;
    cardHolderName: string;
  }[];
}

const CardStorage = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchStoredCards = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/storedCards/main");
      console.log("response: ", response);

      const data = response.data;
      // console.log("data: ", data);
      // console.log("data.data: ", data.data);
      // 팀 별로 맵핑
      const formattedTeams = data.data.map((team: TeamResponse) => ({
        cardHolderId: team.cardHolderId,
        teamName: team.teamName,
        // 팀 내 명함 맵핑
        cards: team.cards.map((card) => ({
          storedCardId: card.storedCardId,
          name: card.name,
          age: card.age,
          major: card.major,
          mbti: card.mbti,
          hobby: card.hobby,
          lookAlike: card.lookAlike,
          slogan: card.slogan,
          tmi: card.tmi,
          cardThema: card.cardThema,
          bookMark: card.bookMark,
          cardHolderName: card.cardHolderName,
        })),
      }));
      setTeams(formattedTeams);
      //console.log("formattedTeams: ", formattedTeams);
      setError(null);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("명함 데이터가 없습니다.");
      } else {
        setError("명함 데이터를 가져오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoredCards();
  }, []);

  //console.log("teams: ", teams);

  if (loading) {
    return <div className="text-body-1-med text-gray-7">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-body-1-med text-gray-7">{error} </div>;
  }

  return (
    <div className="flex gap-[1.6rem] overflow-x-auto">
      {/* 최대 5개 렌더링 */}
      {teams.slice(0, 5).map((team, index) => (
        <div
          key={`key-${index}`}
          onClick={() => router.push(`/card/detail/${team.cardHolderId}`)}
        >
          <NameCardComponent
            name={team.teamName}
            storedCards={team.cards || []}
          />
        </div>
      ))}
    </div>
  );
};

export default CardStorage;
