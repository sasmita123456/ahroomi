"use client";

import { useRef } from "react";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import type { CategoryProduct } from "../lib/types";
import styles from "../styles/home.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";

interface TopSellingProps {
  items: CategoryProduct[];
}

export default function TopSelling({ items }: TopSellingProps) {
  const swiperRef = useRef<any>(null); // Ref for swiper instance

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* TITLE + CUSTOM ARROWS */}
            <div className="flex items-center justify-between mb-10 ">
          <h2 className="title">
            TOP SELLING <span className="title_sub"> PRODUCT</span>
          </h2>

        <div className={styles.headerIconGroup}>
            <button
              className={styles.headerIcon}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <FaArrowLeftLong className={styles.headerIconSvg} />
            </button>
            <button
              className={styles.headerIcon}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <FaArrowRightLong className={styles.headerIconSvg} />
            </button>
          </div>
        </div>

        {/* SWIPER SLIDER */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)} 
          slidesPerView={4}
          spaceBetween={30}
          loop={false}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 15 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {items.map((p, index) => {
            let discount = 0;
            if (index === 0) discount = 20;
            else if (index === 1) discount = 15;
            else if (index === 2) discount = 25;
            else if (index === 3) discount = 36.45;

            const oldPrice =
              discount > 0 ? Math.round(p.price / (1 - discount / 100)) : 0;

            return (
              <SwiperSlide key={p.id}>
                <div className="rounded-xl border border-[#ccc] bg-white duration-300 overflow-hidden group hover:shadow-lg transition-all relative">
                  {/* IMAGE AREA */}
                  <div className="relative bg-white p-2">
                    <div className="relative rounded-lg overflow-hidden bg-[#f7f7f7] group">
                      {discount > 0 && (
                        <div className="absolute z-20">
                          <div className={styles.discountBadgeCustom}>
                            -{discount.toFixed(2)}%
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                        <button className="pointer-events-auto text-black border border-[#22a6dd] font-jost font-medium px-8 py-2 rounded-full bg-white transition-all duration-500 transform scale-95 hover:scale-100 hover:bg-[#22a6dd] hover:text-white">
                          Buy Now
                        </button>
                      </div>

                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-[300px] object-cover block transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* FLOATING ICONS */}
                      <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        {[
                          { icon: FiShoppingCart, label: "Add to Cart" },
                          { icon: FiHeart, label: "Wishlist" },
                          { icon: FiEye, label: "View" },
                        ].map((item, i) => (
                          <div key={i} className="relative group">
                            <button className="w-8 h-8 flex items-center justify-center border border-[#22a6dd] text-[#22a6dd] bg-white hover:bg-[#22a6dd] hover:text-white transition-colors duration-300 rounded-sm">
                              <item.icon />
                            </button>
                            <span className="absolute -right-24 top-1/2 -translate-y-1/2 bg-gray-300 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="px-4 pb-6 pt-4 text-center">
                    <div className="text-[16px] font-semibold text-black mb-2">
                      <span className={styles.productTitleHover}>{p.title}</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 ">
                      <div className="text-[20px] font-bold text-black">
                        ₹{p.price}.00
                      </div>
                      {discount > 0 && (
                        <div className="text-[14px] text-gray-400 line-through">
                          ₹{oldPrice}.00
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="text-[14px] text-yellow-500">
                        {"★".repeat(Math.round(p.rating || 5))}
                      </div>
                      <div className="text-[12px] text-gray-400">(1)</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}