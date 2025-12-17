"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import card1 from "../../../../public/assets/images/card1.webp";
import card2 from "../../../../public/assets/images/card2.webp";
import card3 from "../../../../public/assets/images/card3.webp";
import card4 from "../../../../public/assets/images/card4.webp";
import card5 from "../../../../public/assets/images/card5.webp";
import card6 from "../../../../public/assets/images/card6.png";
import card7 from "../../../../public/assets/images/card7.png";
import card8 from "../../../../public/assets/images/card8.png";
import FancyButton from "./FancyButton";
import Link from "next/link";

// Card pair configurations
const cardPairs = [
  {
    images: [card1, card5],
    texts: ["Serums", "Serums"],
    alt: ["Serums collection", "New serums collection"],
  },
  {
    images: [card2, card6],
    texts: ["Lotion", "Body Lotion"],
    alt: ["Lotion collection", "Body lotion collection"],
  },
  {
    images: [card3, card7],
    texts: ["Face Cream", "Premium Cream"],
    alt: ["Face cream", "Premium face cream"],
  },
  {
    images: [card4, card8],
    texts: ["Cleanse", "Deep Cleanse"],
    alt: ["Cleanse products", "Deep cleanse products"],
  },
];

export default function CategoryGrid() {
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // Start transition
      setTimeout(() => {
        setCurrentIndices((prev) => {
          const newIndices = [...prev];
          // Toggle only the current card (0→1 or 1→0)
          newIndices[currentCardIndex] = prev[currentCardIndex] === 0 ? 1 : 0;
          return newIndices;
        });

        setIsTransitioning(false);

        // Move to next card for next change
        setCurrentCardIndex((prev) => (prev + 1) % 4);
      }, 300); // Transition duration
    }, 2000); // 2 seconds between each card change

    return () => clearInterval(interval);
  }, [currentCardIndex]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Header - EXACTLY SAME */}
        <div className="flex items-center justify-between mb-10 ">
          <h2 className="title">
            POPULAR <span className="title_sub">CATEGORY</span>
          </h2>
          <Link href="/shop">
            <button className="text-gray-700 hover:text-black flex items-center gap-2 view_all">
              *View All Category
              <span className="inline-block transform translate-y-px">→</span>
            </button>
          </Link>
        </div>

        {/* Grid Layout - EXACTLY SAME structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 category_grid">
          {/* Card 1 - Left Big Card */}
          <div className="relative overflow-hidden h-[540px]">
            <Image
              src={cardPairs[0].images[currentIndices[0]]}
              alt={cardPairs[0].alt[currentIndices[0]]}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover hover:scale-105 transition-all duration-500 ${
                isTransitioning && currentCardIndex === 0
                  ? "opacity-80 scale-[1.02]"
                  : "opacity-100 scale-100"
              }`}
            />
            <FancyButton
              borderColor="#22a6dd"
              bgColor="#fff"
              textColor="#000"
              hoverColor="#22a6dd"
              className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                isTransitioning && currentCardIndex === 0
                  ? "scale-105"
                  : "scale-100"
              }`}
            >
              {cardPairs[0].texts[currentIndices[0]]}
            </FancyButton>
          </div>

          <div className="grid grid-cols-2 col-span-2">
            {/* Center Text - UNCHANGED */}
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-500 mb-1">Vital Categories</p>
              <h3 className="text-2xl font-semibold text-gray-800 leading-snug">
                Worldwide Fashion <br /> Collections
              </h3>
            </div>

            {/* Card 2 - Right Top Card */}
            <div className="relative overflow-hidden h-[270px]">
              <Image
                src={cardPairs[1].images[currentIndices[1]]}
                alt={cardPairs[1].alt[currentIndices[1]]}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover hover:scale-105 transition-all duration-500 ${
                  isTransitioning && currentCardIndex === 1
                    ? "opacity-80 scale-[1.02]"
                    : "opacity-100 scale-100"
                }`}
              />
              <FancyButton
                borderColor="#22a6dd"
                bgColor="#fff"
                textColor="#000"
                hoverColor="#22a6dd"
                className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                  isTransitioning && currentCardIndex === 1
                    ? "scale-105"
                    : "scale-100"
                }`}
              >
                {cardPairs[1].texts[currentIndices[1]]}
              </FancyButton>
            </div>

            {/* Card 3 - Bottom Left Card */}
            <div className="relative overflow-hidden h-[270px]">
              <Image
                src={cardPairs[2].images[currentIndices[2]]}
                alt={cardPairs[2].alt[currentIndices[2]]}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover hover:scale-105 transition-all duration-500 ${
                  isTransitioning && currentCardIndex === 2
                    ? "opacity-80 scale-[1.02]"
                    : "opacity-100 scale-100"
                }`}
              />
              <FancyButton
                borderColor="#22a6dd"
                bgColor="#fff"
                textColor="#000"
                hoverColor="#22a6dd"
                className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                  isTransitioning && currentCardIndex === 2
                    ? "scale-105"
                    : "scale-100"
                }`}
              >
                {cardPairs[2].texts[currentIndices[2]]}
              </FancyButton>
            </div>

            {/* Card 4 - Bottom Right Card */}
            <div className="relative overflow-hidden h-[270px]">
              <Image
                src={cardPairs[3].images[currentIndices[3]]}
                alt={cardPairs[3].alt[currentIndices[3]]}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={`object-cover hover:scale-105 transition-all duration-500 ${
                  isTransitioning && currentCardIndex === 3
                    ? "opacity-80 scale-[1.02]"
                    : "opacity-100 scale-100"
                }`}
              />
              <FancyButton
                borderColor="#22a6dd"
                bgColor="#fff"
                textColor="#000"
                hoverColor="#22a6dd"
                className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                  isTransitioning && currentCardIndex === 3
                    ? "scale-105"
                    : "scale-100"
                }`}
              >
                {cardPairs[3].texts[currentIndices[3]]}
              </FancyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
