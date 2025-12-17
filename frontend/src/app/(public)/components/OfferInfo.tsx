"use client";
import Image from "next/image";

import info1 from "../../../../public/assets/images/info1.jpg";
import info2 from "../../../../public/assets/images/info2.jpg";
import FancyButton from "./FancyButton";

export default function OfferInfo() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT CARD */}
          <div className="relative rounded-2xl overflow-hidden offer_card">
            <Image
              src={info1}
              alt="Offer 1"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-center pl-10">
              <h2 className="text-white text-3xl font-bold leading-tight">
                Up to <span className="text-white">40% Off</span> <br />
                All Accessory.
              </h2>

           <div className="mt-5">
               <a
                href="#"
                className="mt-5 underline text-white text-lg tracking-wide"
              >
                *Shop Now*
              </a>
           </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="relative rounded-2xl overflow-hidden offer_card">
            <Image
              src={info2}
              alt="Offer 2"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-center pl-10 max-w-[350px]">
              <h2 className="text-black text-center text-3xl font-bold leading-tight font-[cursive]">
                Organic <span className="text-white">Product</span>  For Your Face. 
              
              </h2>
           <div className="mt-5">
                   <FancyButton className="absolute bottom-0 left-1/2 -translate-x-1/2">
                Shop Now
              </FancyButton>
           </div>
        
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}