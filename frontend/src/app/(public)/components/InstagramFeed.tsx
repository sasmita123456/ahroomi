"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

export interface InstagramPost {
  id: string;
  image: string;
}

interface InstagramFeedProps {
  posts?: InstagramPost[];
}

export default function InstagramFeed({ posts }: InstagramFeedProps) {
  const [feed, setFeed] = useState<InstagramPost[]>([]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setFeed(posts);
    } else {
      setFeed([
        { id: "1", image: "/assets/instagramfeedimg/insta-img1.jpg" },
        { id: "2", image: "/assets/instagramfeedimg/insta-img2.jpg" },
        { id: "3", image: "/assets/instagramfeedimg/insta-img3.jpg" },
        { id: "4", image: "/assets/instagramfeedimg/insta-img4.jpg" },
        { id: "5", image: "/assets/instagramfeedimg/insta-img5.jpg" },
        { id: "6", image: "/assets/instagramfeedimg/insta-img6.jpg" },
        { id: "7", image: "/assets/instagramfeedimg/insta-img7.jpg" },
        { id: "8", image: "/assets/instagramfeedimg/insta-img8.jpg" },
        { id: "9", image: "/assets/instagramfeedimg/insta-img1.jpg" },
        { id: "10", image: "/assets/instagramfeedimg/insta-img2.jpg" },
        { id: "11", image: "/assets/instagramfeedimg/insta-img3.jpg" },
        { id: "12", image: "/assets/instagramfeedimg/insta-img4.jpg" },
        { id: "13", image: "/assets/instagramfeedimg/insta-img5.jpg" },
        { id: "14", image: "/assets/instagramfeedimg/insta-img6.jpg" },
        { id: "15", image: "/assets/instagramfeedimg/insta-img7.jpg" },
        { id: "16", image: "/assets/instagramfeedimg/insta-img8.jpg" },
      ]);
    }
  }, [posts]);

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">

      <div className="flex items-center justify-between mb-10 ">
          <h2 className="title">
            INSTAGRAM <span className="title_sub"> FEED</span>
          </h2>
        </div>

   
        <div className="mt-4">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={8}         
            spaceBetween={10}
            loop={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            // Disable loop if not enough slides
            onInit={(swiper) => {
              const slidesPerView = swiper.params.slidesPerView;
              if (typeof slidesPerView === 'number' && swiper.slides.length < slidesPerView * 2) {
                swiper.loopDestroy();
              }
            }}

            // For small screens:
            breakpoints={{
              320: { slidesPerView: 3 },
              480: { slidesPerView: 4 },
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 8 }, 
            }}
          >
            {feed.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="overflow-hidden rounded-none">
                  <img
                    src={post.image}
                    alt={`Instagram ${post.id}`}
                    className="
                      w-full
                      h-auto
                      max-w-full
                      border-0
                      shadow-none
                      block
                      transition-transform duration-300 ease-in-out
                      hover:scale-105
                    "
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}