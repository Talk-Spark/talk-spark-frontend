interface MyTalkProps {
  content: string;
  dateTime: string;
  formatTimeWithMeridiem: (dateTime: string) => string;
  shouldShowTime: boolean; // 시간을 표시할지 여부
  isFirstOfSameUserAndTime: boolean;
}

const MyTalk = ({
  content,
  dateTime,
  formatTimeWithMeridiem,
  shouldShowTime,
  isFirstOfSameUserAndTime,
}: MyTalkProps) => {
  const myStyle = isFirstOfSameUserAndTime ? "mt-[1.6rem]" : "mt-[0.4rem]";
  return (
    <div className={`${myStyle} flex flex-col items-end`}>
      {/* 말풍선 */}
      <div className="flex items-end gap-[0.4rem]">
        {/* 시간 표시 여부 조건부 렌더링 */}
        <span className="min-w-[5.4rem] flex-1 text-caption-med text-gray-6">
          {formatTimeWithMeridiem(dateTime)}
        </span>

        <div className="whitespace-pre-wrap rounded-[1.2rem] bg-sub-palePink px-[1.2rem] py-[0.6rem] text-body-1-med text-gray-12">
          {content}
        </div>
      </div>
    </div>
  );
};

export default MyTalk;
