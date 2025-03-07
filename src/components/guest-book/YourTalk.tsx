import ProfileImage from "../ProfileImage";

// Defining the types for the component props
interface YourTalkProps {
  formatTimeWithMeridiem: (dateTime: string) => string;
  content: string;
  userName: string;
  dateTime: string;
  color: "PINK" | "YELLOW" | "MINT" | "BLUE";
  shouldShowTime: boolean; // 시간을 표시할지 여부
  shouldShowProfile: boolean; // 프로필 이미지를 표시할지 여부
}

const YourTalk = ({
  formatTimeWithMeridiem,
  content,
  userName,
  dateTime,
  color,
  shouldShowTime,
  shouldShowProfile,
}: YourTalkProps) => {
  const sameStyle = shouldShowProfile ? "mt-[1.6rem]" : "";
  const isFirstStyle = shouldShowProfile ? "mt-[0.8rem]" : "mt-[0.4rem]";
  return (
    <div className={`${sameStyle} flex gap-[0.8rem]`}>
      {shouldShowProfile ? (
        <div className="">
          <ProfileImage size={36} color={color} hasFixedWidth={false} />
        </div>
      ) : (
        <div className="h-full w-[3.6rem]"></div>
      )}
      <div>
        {shouldShowProfile && (
          <span className="text-caption-med text-gray-8">{userName}</span>
        )}
        <div className={` ${isFirstStyle} flex flex-col gap-[0.4rem]`}>
          <div className="flex gap-[0.4rem]">
            {/* 말풍선 */}
            <div className="flex items-center rounded-[1.2rem] bg-white px-[1.2rem] py-[0.6rem] text-body-1-med text-gray-12">
              {content}
            </div>
            <span className="mt-[0.4rem] flex items-end text-caption-med text-gray-6">
              {formatTimeWithMeridiem(dateTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourTalk;
