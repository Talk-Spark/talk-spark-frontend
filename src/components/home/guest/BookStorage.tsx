// 방명록 저장소
import { instance } from "@/src/apis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GuestBookComponent from "./GuestBookComponent";

export interface GuestBookRoom {
  roomId: number;
  roomName: string;
  roomDateTime: string;
  roomPeopleCount: number;
  guestBookFavorited: boolean;
  preViewContent: string;
}

const BookStorage = () => {
  const [guestBookRooms, setGuestBookRooms] = useState<GuestBookRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchGuestBookRooms = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/guest-books", {
        params: {
          search: "",
          sortBy: "latest",
        },
      });
      const data = response.data.data;

      if (response.status === 200) {
        setGuestBookRooms(data.guestBookRooms);
        console.log(data.guestBookRooms);
        setError(null);
      }
    } catch (error) {
      console.log("error: ", error);
      setError("방명록 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestBookRooms();
  }, []);

  if (loading) {
    return <div className="text-body-1-med text-gray-7">로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (guestBookRooms.length === 0) {
    return (
      <div className="text-body-1-med text-gray-7">
        저장된 방명록이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex gap-[1.6rem] overflow-x-auto">
      {guestBookRooms.slice(0, 5).map((room) => (
        <div
          key={room.roomId}
          onClick={() => router.push(`/guest-book/${room.roomId}`)}
        >
          <GuestBookComponent
            name={room.roomName}
            messages={room.preViewContent}
          />
        </div>
      ))}
    </div>
  );
};

export default BookStorage;
