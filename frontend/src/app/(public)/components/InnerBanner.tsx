"use client";

import Image, { StaticImageData } from "next/image";

interface InnerBannerProps {
  title: string;
  image: StaticImageData | string;
}

export default function InnerBanner({ title, image }: InnerBannerProps) {
  return (
    <section className="relative w-full h-[200px] md:h-[250px] lg:h-[250px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
         className="object-cover transition-all duration-500"
        />
      </div>
     <div className="absolute inset-0 bg-black/10"></div>
      {/* Centered Title */}
      <div className="relative flex items-center justify-center h-full">
        <h2 className="text-white font-[initial] text-4xl md:text-5xl font-bold drop-shadow-xl tracking-wide animate-fadeIn">
          {title}
        </h2>
      </div>
    </section>
  );
}
