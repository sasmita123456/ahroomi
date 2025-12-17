"use client";
import Image from "next/image";

import nlf1 from "../../../../public/assets/images/nlf1.png";
import nlf2 from "../../../../public/assets/images/nlf2.png";
import nlf3 from "../../../../public/assets/images/nlf3.png";
import nlf4 from "../../../../public/assets/images/nlf4.png";

export default function Newsletter() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="relative bg-[#f4f0d7] rounded-xl overflow-hidden py-[100px] px-2.5">

          
          <Image
            src={nlf1}
            alt="decor1"
            className="absolute top-0 left-0 w-auto h-auto"
          />

          <Image
            src={nlf3}
            alt="decor2"
            className="absolute top-0 right-0 w-auto h-auto"
          />

       
          <Image
            src={nlf2}
            alt="decor3"
            className="absolute bottom-0 left-0 w-auto h-auto"
          />

          
          <Image
            src={nlf4}
            alt="decor4"
            className="absolute bottom-0 right-0 w-auto h-auto"
          />

         
          <div className="text-center relative ">
            <h2 className="text-2xl md:text-3xl font-bold text-black leading-snug max-w-3xl mx-auto">
              Sign Up to Our Newsletter For All The <br />
              Latest Offer & Discounts.
            </h2>

   
            <div className="mt-10 flex justify-center">
              <div className="flex items-center border-b border-black w-full max-w-md pb-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent outline-none text-black"
                />
                <span className="text-black text-xl cursor-pointer">
                  →
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}