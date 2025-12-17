"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import banner4 from "../../../../public/assets/images/banner4.jpg";
import banner6 from "../../../../public/assets/images/banner6.jpg";
import banner7 from "../../../../public/assets/images/banner7.jpg";
import banner8 from "../../../../public/assets/images/banner8.jpg";

export default function Banner() {
  return (
    <section className="w-full h-[70vh] md:h-[70vh] relative banner">
      <Swiper
        modules={[Pagination, EffectFade, Autoplay]}
        effect="fade"
        loop={true}
        speed={2000} 
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="w-full h-full relative slide-zoom">
            <Image
              src={banner4}
              alt="Banner4"
              fill
              priority
              className="object-cover"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="w-full h-full relative slide-zoom">
            <Image
              src={banner6}
              alt="Banner6"
              fill
              priority
              className="object-cover"
            />
          </div>
        </SwiperSlide>

               <SwiperSlide>
          <div className="w-full h-full relative slide-zoom">
            <Image
              src={banner7}
              alt="Banner7"
              fill
              priority
              className="object-cover"
            />
          </div>
        </SwiperSlide>

               <SwiperSlide>
          <div className="w-full h-full relative slide-zoom">
            <Image
              src={banner8}
              alt="Banner8"
              fill
              priority
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}