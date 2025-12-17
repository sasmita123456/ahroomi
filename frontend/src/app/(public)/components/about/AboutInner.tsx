"use client";
import Image from "next/image";

import grid1 from "../../../../../public/assets/images/grid1.webp";
import grid2 from "../../../../../public/assets/images/grid2.webp";
import grid3 from "../../../../../public/assets/images/grid3.png";

export default function AboutInner() {
  return (
    <section className="pt-14 pb-10">
      <div className="container mx-auto px-4 space-y-12">
        {/* BLOCK 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative w-full max-w-xl mx-auto">
            <div className="border border-gray-400 p-4 hover:border-gray-600 transition-colors duration-300">
              <Image
                src={grid1}
                alt="Glow your Skin"
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Circular Stamp */}
            <div className="absolute -right-10 -top-12 transition-transform duration-300">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-xl transition-all duration-300">
                  A
                </div>
                <svg
                  className="w-full h-full animate-spin-slow hover:animate-spin transition-all duration-300"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="textcircle"
                    d="M50,50 m-35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text fontSize="8" letterSpacing="2" className="fill-black hover:fill-gray-800 transition-colors duration-300">
                    <textPath href="#textcircle">
                      • RESEARCHED & TRUSTED •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className=" transition-transform duration-300">
            <h2 className="text-4xl font-serif mb-4 hover:text-gray-900 transition-colors duration-300">
              Nature Meets Science
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6 hover:text-gray-800 transition-colors duration-300">
              At Ahroomi, we blend the wisdom of nature with the precision of science. Infused with the powerful benefits of moringa, our products are backed by research to nourish, heal and protect your skin naturally.
            </p>
          </div>
        </div>

        {/* BLOCK 2 (reverse layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          {/* Left Content */}
          <div className=" transition-transform duration-300">
            <h2 className="text-4xl font-serif mb-4 hover:text-gray-900 transition-colors duration-300">
              India's First Moringa-Infused<br /> Skincare Brand
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6 hover:text-gray-800 transition-colors duration-300">
              Ahroomi takes pride in being India's only skincare brand that infuses moringa into self-care products. Rich in antioxidants and vitamins, moringa works at a cellular level to promote radiant, healthy skin.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="relative w-full max-w-xl mx-auto">
            <div className="border border-gray-400 p-4 hover:border-gray-600 transition-colors duration-300">
              <Image
                src={grid2}
                alt="Make yourself Adorable for Skin"
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Circular Stamp */}
            <div className="absolute -right-10 -top-12  transition-transform duration-300">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-xl  transition-all duration-300">
                  A
                </div>
                <svg
                  className="w-full h-full animate-spin-slow hover:animate-spin transition-all duration-300"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="textcircle2"
                    d="M50,50 m-35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text fontSize="8" letterSpacing="2" className="fill-black hover:fill-gray-800 transition-colors duration-300">
                    <textPath href="#textcircle2">
                      • RESEARCHED & TRUSTED •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCK 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative w-full max-w-xl mx-auto">
            <div className="border border-gray-400 p-4 hover:border-gray-600 transition-colors duration-300">
              <Image
                src={grid3}
                alt="Glow your Skin"
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Circular Stamp */}
            <div className="absolute -right-10 -top-12  transition-transform duration-300">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center font-serif font-bold text-xl  transition-all duration-300">
                  A
                </div>
                <svg
                  className="w-full h-full animate-spin-slow hover:animate-spin transition-all duration-300"
                  viewBox="0 0 100 100"
                >
                  <path
                    id="textcircle3"
                    d="M50,50 m-35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text fontSize="8" letterSpacing="2" className="fill-black hover:fill-gray-800 transition-colors duration-300">
                    <textPath href="#textcircle3">
                      • RESEARCHED & TRUSTED •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="transition-transform duration-300">
            <h2 className="text-4xl font-serif mb-4 hover:text-gray-900 transition-colors duration-300">
              Pure. Potent. Powerful.
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6 hover:text-gray-800 transition-colors duration-300">
              We believe in purity. Our products are free from harmful chemicals, parabens, sulfates, and synthetic fragrances. Ahroomi is committed to clean beauty, ensuring safe and effective skincare for all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}