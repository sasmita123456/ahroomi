"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import { BiSolidQuoteAltRight } from "react-icons/bi";

import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";

import review1 from "../../../../public/assets/images/review1.png";
import review2 from "../../../../public/assets/images/review2.png";
import review3 from "../../../../public/assets/images/review3.png";
import review4 from "../../../../public/assets/images/review4.png";
import review5 from "../../../../public/assets/images/review5.png";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Kumari",
      text: "The skincare products truly transformed my routine. The serum absorbs quickly and keeps my skin glowing throughout the day!",
      img: review1,
      rating: 5,
      designation: "Regular Skincare Customer",
      date: "May 9, 2023",
      time: "10.30 PM",
    },
    {
      name: "Gaurav Khana",
      text: "I absolutely love their organic range! The moisturizer feels lightweight and has made my skin softer in just a few days.",
      img: review2,
      rating: 5,
      designation: "Beauty Enthusiast",
      date: "June 15, 2023",
      time: "2.45 PM",
    },
    {
      name: "Riya Dey",
      text: "One of the best face creams I've used so far. My skin feels smooth and refreshed, and the fragrance is just perfect!",
      img: review3,
      rating: 4,
      designation: "Cosmetics Buyer",
      date: "July 22, 2023",
      time: "11.20 AM",
    },
    {
      name: "John Carter",
      text: "The cleansing products work amazingly well! They removed oil and dirt gently without drying out my skin.",
      img: review4,
      rating: 5,
      designation: "Daily Skincare User",
      date: "August 5, 2023",
      time: "4.15 PM",
    },
    {
      name: "Sarah Johnson",
      text: "These beauty products have become my everyday essentials. The quality is premium and results are clearly visible!",
      img: review5,
      rating: 4,
      designation: "Makeup & Skincare Lover",
      date: "September 10, 2023",
      time: "9.30 AM",
    },
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="title">
            Our Clients Say <span className="title_sub">ABOUT US</span>
          </h2>

          <div className="flex items-center gap-2">
            <button className="swiper-button-prev-custom text-4xl text-[#222] hover:text-[#22a6dd] transition-all duration-400">
              <IoArrowBackCircleOutline />
            </button>
            <button className="swiper-button-next-custom text-4xl text-[#222] hover:text-[#22a6dd] transition-all duration-400">
              <IoArrowForwardCircleOutline />
            </button>
          </div>
        </div>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation]}
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
              centeredSlides: false,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: false,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 25,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
              centeredSlides: true,
            },
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index} className="testimonial-slide">
              <div className="relative border rounded-xl p-8 bg-white transition-all duration-300 shadow-sm center-card">

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < item.rating ? "text-[#dda701]" : "text-gray-300"}
                      />
                    ))}
                </div>

                <p className="text-gray-700 leading-relaxed mb-5">{item.text}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.designation}</p>
                  </div>

                  {/* Quote Icon */}
                  <BiSolidQuoteAltRight
                    className="text-5xl"
                    style={{ color: "#2222220d" }}
                  />

                  <div className="text-right text-gray-500 text-sm">
                    <p>{item.date}</p>
                    <p>{item.time}</p>
                  </div>
                </div>

                <div className="testimonial_client hidden absolute"></div>
              </div>

              <div className="profile-image hidden justify-center mt-8">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={90}
                  height={90}
                  className="rounded-full border-4 border-[#e1f6ff] shadow-md"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}