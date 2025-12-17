"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export default function MScience() {
  const descriptions = [
    `“Moringa, known as the “miracle tree,” is packed with vitamins, antioxidants, and healthy fats that help protect, nourish, and restore. It fights damage from pollution, keeps skin and hair healthy, and deeply hydrates—bringing the power of nature into self-care.”`,

    `“Rich in omega fatty acids and plant-based nutrients, Moringa helps calm inflammation, brighten dull skin, and support natural regeneration for a smoother, healthier appearance.”`,

    `“With antimicrobial and healing properties, Moringa naturally purifies the skin while maintaining moisture balance—perfect for daily rejuvenation.”`,
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-14 m_science relative">
      <div className="container mx-auto px-4 flex">

        {/* Outer Card */}
        <div className="bg-white max-w-3xl w-full p-8 relative shadow-[0_0_20px_rgba(0,0,0,0.05)]">

          {/* Inner Border */}
          <div className="border border-gray-300 p-10 relative">

            {/* Speech Bubble Tail */}
            <div className="absolute left-10 -bottom-5 w-10 h-10 bg-white border-l border-b border-gray-300 rotate-135"></div>

            {/* Title */}
            <h2 className="mb-6 title">THE M SCIENCE</h2>

            {/* Smooth Slide Swiper */}
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 8000 }}
              loop
              speed={400}
              className="w-full mb-8"
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {descriptions.map((text, index) => (
                <SwiperSlide key={index}>
                  <p className="text-gray-600 leading-relaxed transition-all duration-700">
                    {text}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Dynamic Slider Dots */}
            <div className="flex items-center gap-3">
              {descriptions.map((_, index) => (
                <span key={index} className="flex items-center justify-center">
                  {activeIndex === index ? (
                    // ACTIVE DOT (big border + filled center)
                    <span className="w-3 h-3 rounded-full border border-gray-700 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
                    </span>
                  ) : (
                    // INACTIVE DOT
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  )}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
