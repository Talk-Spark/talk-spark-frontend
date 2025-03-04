"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick"; // 모듈 추가
import Image from "next/image";
import favStar from "@/public/nameCard/Star.svg";
import favPinkStar from "@/public/nameCard/pinkStar.svg";
import StorageNameCard from "@/src/components/StorageNameCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Arrow from "@/src/components/Storage/card/Arrow";
import { useParams } from "next/navigation";
import { instance, put } from "@/src/apis";
import Header from "@/src/components/Headers/Header";
import { useRouter } from "next/navigation";
import PageTransition from "@/src/components/common/PageTransition";

type OthersNameCardProps = {
  storedCardId: number;
  name: string;
  age: number;
  major: string;
  mbti?: string;
  hobby?: string;
  lookAlike?: string;
  slogan?: string;
  tmi?: string;

  bookMark: boolean;
  cardHolderName?: string;
  cardThema: "PINK" | "MINT" | "YELLOW" | "BLUE";
};

// const defaultCard
const DetailCard = () => {
  const [isFav, setIsFav] = useState(false); // 여기 즐겨찾기 put api 구현 필요
  const [currentIndex, setCurrentIndex] = useState(0);
  const slickRef = useRef<Slider | null>(null);
  const { id } = useParams();
  const [otherCards, setOtherCards] = useState<OthersNameCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("cardDetail", JSON.stringify(true));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      if (id) {
        console.log(id);
        /* 팀 명함 조회하기 */
        const getOthers = async () => {
          try {
            const res = await instance.get(`/api/storedCard/${id}`);
            if (res.data.data) {
              setOtherCards(res.data.data);
              //console.log(res.data.data);
            }
          } catch (e) {
            console.log(e);
          }
        };
        getOthers();
      }
      setIsLoading(false);
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [isFav]);

  const putFav = async () => {
    await put(`/api/storedCard/${id}`);
    setIsFav(!isFav);
  };

  const previous = useCallback(() => {
    slickRef.current?.slickPrev();
  }, []);

  const next = useCallback(() => {
    slickRef.current?.slickNext();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    centerMode: true,
    centerPadding: "81px",
    speed: 500,
    slidesToShow: 1,
    focusOnSelect: true,
    arrows: false,
    swipeToSlide: true,
    initialSlide: 0,
    afterChange: (index: number) => setCurrentIndex(index),
  };

  const router = useRouter();

  if (otherCards.length < 1) {
    return (
      <div className="relative -mx-[2rem] flex w-[calc(100%+4rem)] flex-col items-center justify-center overflow-hidden pb-[4rem]">
        <div className="mb-[2rem] mt-[1.6rem] flex w-[37.5rem] flex-col items-center justify-center gap-[0.8rem]">
          <Image src={favStar} alt="즐겨찾기" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative -mx-[2rem] flex h-[100vh] w-[calc(100%+4rem)] flex-col items-center overflow-hidden bg-white pb-[4rem]">
        <div className="w-full bg-white">
          <Header
            title="명함 보관함"
            padding={true}
            showButton1={true}
            button1Action={() => router.push("/card?view=others")}
          />
        </div>
        {/* 즐겨찾기 */}
        <div className="mb-[2rem] mt-[1.6rem] flex w-[37.5rem] flex-col items-center justify-center gap-[0.8rem]">
          <Image
            src={otherCards[0]?.bookMark ? favPinkStar : favStar}
            onClick={() => putFav()}
            alt="즐겨찾기"
          />
          <span className="text-headline-5 text-black">
            {otherCards[0]?.cardHolderName}
          </span>
        </div>
        {/* 슬라이더 */}
        <div
          className={`h-[60.3rem] w-[50rem] ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
        >
          {otherCards && otherCards.length > 1 ? (
            <Slider {...sliderSettings} ref={slickRef}>
              {otherCards.map((card, index) => (
                <div key={card.storedCardId} className="flex justify-center">
                  <div
                    className={`${
                      index === currentIndex
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-80"
                    } flex w-[35rem] items-center justify-normal transition-all duration-200 ease-in-out`}
                  >
                    <StorageNameCard
                      oneCard={card}
                      isFull={true}
                      isStorage={false}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="flex justify-center">
              <StorageNameCard
                oneCard={otherCards[0]}
                isFull={true}
                isStorage={false}
              />
            </div>
          )}
          <Arrow
            otherCards={otherCards}
            previous={previous}
            next={next}
            currentIndex={currentIndex}
          />
        </div>{" "}
      </div>
    </PageTransition>
  );
};

export default DetailCard;
