"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "@/src/app/(flow)/all-cards/mystyle.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import StorageNameCard from "@/src/components/StorageNameCard";
import { FinalPeopleProps } from "../flow/page";
import Header from "@/src/components/Headers/Header";
import { getDataFromLocalStorage } from "@/src/utils";
import { useRouter } from "next/navigation";
import { instance } from "@/src/apis";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

import Arrow from "@/src/components/Storage/card/Arrow";
import rightArrow from "@/public/nameCard/rightArrow.svg";
import leftArrow from "@/public/nameCard/leftArrow.svg";

const AllCards = () => {
  //깃허브 테스트
  const [finalPeople, setFinalPeople] = useState<FinalPeopleProps[] | null>(
    null,
  );
  const router = useRouter();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slickRef = useRef<Slider | null>(null);

  useEffect(() => {
    // const storedRoomId = localStorage.getItem("roomId");
    // setRoomId(storedRoomId);

    const finalPeople: FinalPeopleProps[] =
      getDataFromLocalStorage("finalPeople");
    setFinalPeople(finalPeople);
  }, []);

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

  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const response = await instance.get(`/api/guest-books/room-id`);
        setRoomId(response.data.data.roomId);
        console.log("API 응답:", response.data);
        console.log("roomId:", response.data.data.roomId);
      } catch (error) {
        console.error("Error fetching roomId:", error);
      }
    };

    fetchRoomId();
    localStorage.setItem("gameEnd", JSON.stringify(true));
  }, []);

  const headerBtn2 = () => {
    if (roomId) {
      router.push(`/guest-book/${roomId}`);
      instance.delete(`/api/game/${roomId}`);
    } else {
      console.log("roomId is null");
    }
  };

  if (!finalPeople) return;
  return (
    <>
      <Header
        title="전체 명함 공개"
        button2Type="next"
        button2Action={() => headerBtn2()}
      />
      <section className="mt-[3.2rem] flex flex-col items-center gap-[2.4rem]">
        <article className="flex flex-col items-center gap-[0.8rem]">
          <h1 className="text-center text-headline-3 text-black">
            모든 명함을 다 모았어요!
          </h1>
          <span className="text-body-1-med text-gray-12">
            보관함에 자동으로 저장돼요
          </span>
        </article>
        {/* <Swiper
          className="myclass"
          modules={[Navigation, Pagination]}
          spaceBetween={12}
          slidesPerView={1}
          centeredSlides={true}
          navigation={true}
          pagination={{ clickable: true, type: "fraction" }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => {}}
          onSlideChange={() => {}}
          style={{ width: "100%", height: "590px" }}
        >
          {finalPeople.map((user, index) => (
            <SwiperSlide>
              <StorageNameCard
                key={`key-${index}`}
                oneCard={user}
                isFull={true}
              />
            </SwiperSlide>
          ))}
        </Swiper> */}
        {/* 슬라이더 */}
        <div className={`h-[60.3rem] w-[50rem]`}>
          {" "}
          {finalPeople && finalPeople.length > 1 ? (
            <Slider {...sliderSettings} ref={slickRef}>
              {finalPeople.map((user, index) => (
                <div key={`key-${index}`} className="flex justify-center">
                  <div
                    className={`${
                      index === currentIndex
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-80"
                    } flex w-[35rem] items-center justify-normal transition-all duration-200 ease-in-out`}
                  >
                    <StorageNameCard
                      oneCard={user}
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
                oneCard={finalPeople[0]}
                isFull={true}
                isStorage={false}
              />
            </div>
          )}
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
                {finalPeople.length}
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
        </div>
      </section>
    </>
  );
};

export default AllCards;
