"use client";

import { useState, useEffect } from "react";
import {
  LiaAngleDownSolid,
  LiaLongArrowAltRightSolid,
} from "react-icons/lia";
import { CiSearch, CiShoppingCart, CiHeart, CiUser } from "react-icons/ci";
import Link from "next/link";
import Image from "next/image";
import ahroomiLogo from "../../../../public/assets/images/ahroomoLogo.png";
import OffcanvasCart from "./OffcanvasCart";
import UserAuthModal from "./UserAuthModal";

export default function HeaderNav() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const megaMenuItems = [
    [
      { name: "Essential Oil", href: "#" },
      { name: "Fragrances", href: "#" },
      { name: "Air Freshner", href: "#" },
      { name: "Gift Sets", href: "#" },
      { name: "Body Mist", href: "#" },
    ],
    [
      { name: "Self Care", href: "#" },
      { name: "Pocket Perfume", href: "#" }
    ],
  ];

  // Sticky + Shadow on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`bg-white w-full z-10 transition-all duration-300 ${
          isSticky
            ? "fixed top-0 shadow-xl backdrop-blur-sm"
            : "relative shadow-none"
        }`}
      >
        <div className="container mx-auto px-4">
          <div
            className="flex items-center py-1 justify-between transition-all duration-300"
          >
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/">
                <Image src={ahroomiLogo} alt="ahroomi logo" priority />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="group relative text-black hover:text-gray-900 transition-colors duration-200 py-2 text-[17px]"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>

              {/* Shop with Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className="group flex items-center space-x-1 text-black hover:text-gray-900 transition-colors duration-200 py-2 text-[17px]">
                  <span>Shop</span>
                  <LiaAngleDownSolid
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMegaMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300 ease-out"></span>
                </button>

                {/* Mega Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 pt-2 w-screen max-w-xl z-50 bg-white">
                    <div className="shadow-2xl rounded-lg overflow-hidden megamenu">
                      <div className="grid grid-cols-2 gap-8 p-8">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 min-w-2xs">
                          {megaMenuItems.map((column, colIndex) => (
                            <div key={colIndex} className="space-y-3">
                              {column.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  href={item.href}
                                  className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm group"
                                >
                                  <span className="mr-2 text-gray-400 group-hover:text-gray-900 transition-colors">
                                    →
                                  </span>
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* View All */}
                      <div className="border-t border-gray-200 bg-gray-50 px-8 py-4">
                        <Link
                          href="#"
                          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group"
                        >
                          <span className="mr-2">*View All Product</span>
                          <LiaLongArrowAltRightSolid className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="group relative text-black hover:text-gray-900 transition-colors duration-200 py-2 text-[17px]"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>

              <Link
                href="/contact"
                className="group relative text-black hover:text-gray-900 transition-colors duration-200 py-2 text-[17px]"
              >
                Contact Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-gray-900 transition">
                <CiSearch className="w-6 h-6" />
              </button>
              <button className="text-gray-700 hover:text-gray-900 transition">
                <CiHeart className="w-6 h-6" />
              </button>

              {/* Cart Icon with Offcanvas Trigger */}
              <button 
                className="text-gray-700 hover:text-gray-900 transition relative"
                onClick={() => setIsCartOpen(true)}
              >
                <CiShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* User Icon with Modal Trigger */}
              <button 
                className="text-gray-700 hover:text-gray-900 transition relative"
                onClick={() => setIsUserModalOpen(true)}
              >
                <CiUser className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <OffcanvasCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <UserAuthModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
    </>
  );
}