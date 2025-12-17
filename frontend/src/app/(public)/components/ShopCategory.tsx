"use client";

import Image from "next/image";
import Link from "next/link"; 

import { parentProducts } from "../../(public)/data/parentProducts";

const ShopCategory = () => {
  return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">

    

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8">
            {parentProducts.map((item) => (
              <div key={item.id} className="group block">

                {/* CARD */}
                <div className="relative w-full h-[260px] md:h-[300px] rounded-2xl p-2 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl">

                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#f5f5f5]">

                    {/* Default Image */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />

                    {/* Hover Image */}
                    <Image
                      src={item.hoverImage}
                      alt={`${item.title} hover`}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* VIEW COLLECTION BUTTON */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Link
                       href={`/productlist`} passHref
                        className="px-5 py-2 bg-white text-sm font-medium rounded-full shadow hover:bg-gray-100 transition"
                      >
                        View Collections
                      </Link>
                    </div>

                  </div>
                </div>

                {/* TITLE */}
                <div className="text-center mt-2">
                  <h3 className="text-[22px] font-medium text-gray-900">
                    {item.title}
                  </h3>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
  );
};

export default ShopCategory;
