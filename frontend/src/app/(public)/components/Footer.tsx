"use client";
import Image from "next/image";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";

import nutritechLogo from "../../../../public/assets/images/nutritechLogo.png";
import blackLogo from "../../../../public/assets/images/blackLogo.png";
import visa from "../../../../public/assets/images/visa.svg";
import mastercard from "../../../../public/assets/images/mastercard.svg";
import american from "../../../../public/assets/images/payment.svg";
import maestro from "../../../../public/assets/images/maestro.svg";
import vector1 from "../../../../public/assets/images/vector1.svg";
import vector2 from "../../../../public/assets/images/vector2.svg";

export default function Footer() {
  return (
    <footer className="bg-[#d3f0ff] pt-5 pb-5 relative">
      {/* Beautiful Wave Shape at Top */}
      <div className="absolute top-0 left-0 w-full h-24">
        <svg
          className="absolute -top-10 left-0 w-full h-24 rotate-180"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,96L48,90C96,84,192,72,288,72C384,72,480,84,576,90C672,96,768,96,864,90C960,84,1056,72,1152,72C1248,72,1344,84,1392,90L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="#d3f0ff"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-1/5">
        <Image src={vector1} alt="Vector1" />
      </div>
      <div className="absolute top-0 right-0">
        <Image src={vector2} alt="Vector2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mt-5">
          {/* LEFT CTA SECTION */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex flex-col mb-5">
              <Image src={blackLogo}  width={120}
               alt="Ahroomi logo" priority />
            </div>
            <h3 className="text-base font-medium text-gray-700 leading-relaxed mb-5">
              <span className="font-bold text-gray-700">
                Science-Backed Beauty,
              </span>{" "}
              Inspired by Nature. <br /> A unit of{" "}
              <span className="font-bold text-gray-700">Aashdit Nutritech</span>{" "}
              Private Limited
            </h3>

            <button className="relative bg-[#f9c11c] text-black px-6 py-2.5  text-base tracking-wider  whitespace-nowrap border border-[#f9c11c] overflow-hidden group transition-all duration-500 hover:text-[#f9c11c]">
              <span className="relative z-10">*Shop Now*</span>

              <div className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-500 group-hover:translate-x-0"></div>
            </button>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold text-xl mb-6 text-gray-900 ">
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-700">
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                Help & Contact Us
              </li>
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                Return & Refunds
              </li>
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold text-xl mb-6 text-gray-900 ">Company</h4>
            <ul className="space-y-4 text-gray-700">
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                What We Do
              </li>
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                Gift Offers
              </li>
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                Latest Posts
              </li>
              <li className="hover:text-[#22a6dd] transition-colors cursor-pointer">
                FAQs
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h4 className="font-semibold text-xl mb-6 text-gray-900">
              Contact Info
            </h4>
            <ul className="space-y-5 text-gray-700">
              <li className="flex items-center gap-3">
                <div className="text-[#22a6dd]">
                  <FaPhoneAlt className="w-5 h-5" />
                </div>
                <div>
                  <a
                    href="tel:+918327729174"
                    className="hover:text-[#22a6dd] transition-colors"
                  >
                    +91-8327729174
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="text-[#22a6dd]">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div>
                  <a
                    href="mailto: ahroomi@aashdit.com"
                    className="hover:text-[#22a6dd] transition-colors"
                  >
                     ahroomi@aashdit.com
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="text-[#22a6dd]">
                  <FaGlobe className="w-5 h-5" />
                </div>
                <div>
                  <a
                    href="https://aashditnutritech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#22a6dd] transition-colors"
                  >
                    www.aashditnutritech.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-6  border-t border-gray-400/50"></div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-3 text-gray-700">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <p className="text-xs">
              © Copyright 2025{" "}
              <span className="font-bold text-gray-900">Ahroomi</span> | Developed
              By{" "}
              <span className="font-bold text-gray-900">
                Aashdit Technologies
              </span>
            </p>
          </div>

          {/* CENTER LOGO */}
          <div className="mb-6 lg:mb-0">
            <Image
              src={nutritechLogo}
              width={130}
              height={65}
              alt="Nutritech Logo"
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* PAYMENT METHODS */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Image
              src={visa}
              width={50}
              alt="Visa"
              className="hover:scale-105 transition-transform"
            />
            <Image
              src={mastercard}
              width={50}
              alt="Mastercard"
              className="hover:scale-105 transition-transform"
            />
            <Image
              src={american}
              width={50}
              alt="American Express"
              className="hover:scale-105 transition-transform"
            />
            <Image
              src={maestro}
              width={50}
              alt="Maestro"
              className="hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}