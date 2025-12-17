import { Product } from "../lib/types";
import styles from "../styles/home.module.css";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import Link from "next/link"; // Import Link component

export default function FeaturedProducts({ items }: { items: Product[] }) {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="title">
            FEATURED <span className="title_sub"> PRODUCT</span>
          </h2>

          <button className="text-gray-700 hover:text-black flex items-center gap-2 view_all">
            *View All Product
            <span className="inline-block transform translate-y-px">→</span>
          </button>
        </div>

        {/* GRID */}
        <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p, index) => {
            let discount = 0;
            if (index === 0) discount = 25.53;
            else if (index === 2) discount = 22.22;
            else if (index === 3) discount = 36.45;
            else if (index === 4) discount = 18.5;
            else if (index === 5) discount = 20.0;
            else if (index === 6) discount = 15.0;
            else if (index === 7) discount = 30.0;

            const oldPrice =
              discount > 0 ? Math.round(p.price / (1 - discount / 100)) : 0;

            return (
              <div
                key={p.id}
                className="rounded-xl border border-[#ccc] bg-white duration-300 overflow-hidden group hover:shadow-lg transition-all relative"
              >
                {/* IMAGE AREA */}
                <div className="relative bg-white p-2">
                  <div className="relative rounded-lg overflow-hidden bg-[#f7f7f7] group">
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute z-1">
                        <div className={styles.discountBadgeCustom}>
                          -{discount.toFixed(2)}%
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay with Buy Now */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-1 pointer-events-none">
                      <Link href={`/product`} passHref>
                        <button
                          className="pointer-events-auto text-black border border-[#22a6dd] font-jost font-medium px-8 py-2 rounded-full bg-white transition-all duration-500 transform scale-95 hover:scale-100 hover:bg-[#22a6dd] hover:text-white"
                        >
                          Buy Now
                        </button>
                      </Link>
                    </div>

                    {/* Product Image */}
                    <Link href={`/product`} passHref>
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-[300px] object-cover block transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      />
                    </Link>

                    {/* Bottom-right icons */}
                    <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      {/* Cart Icon */}
                      <div className="relative group">
                        <button className="w-8 h-8 flex items-center justify-center border border-[#22a6dd] text-[#22a6dd] bg-white hover:bg-[#22a6dd] hover:text-white transition-colors duration-300 rounded-sm">
                          <FiShoppingCart />
                        </button>
                        <span className="absolute -right-24 top-1/2 -translate-y-1/2 bg-gray-300 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Add to Cart
                        </span>
                      </div>

                      {/* Wishlist Icon */}
                      <div className="relative group">
                        <button className="w-8 h-8 flex items-center justify-center border border-[#22a6dd] text-[#22a6dd] bg-white hover:bg-[#22a6dd] hover:text-white transition-colors duration-300 rounded-sm">
                          <FiHeart />
                        </button>
                        <span className="absolute -right-24 top-1/2 -translate-y-1/2 bg-gray-300 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Wishlist
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="px-4 pb-6 pt-4 text-center">
                  {/* Title */}
                  <div className="text-[16px] font-semibold text-black mb-2">
                    <Link href={`/product`} passHref>
                      <span className={`${styles.productTitleHover} cursor-pointer`}>
                        {p.title}
                      </span>
                    </Link>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-[20px] font-bold text-black">
                      ₹{p.price}.00
                    </div>
                    {discount > 0 && (
                      <div className="text-[14px] text-gray-400 line-through">
                        ₹{oldPrice}.00
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-[14px] text-yellow-500">
                      {"★".repeat(Math.round(p.rating || 5))}
                    </div>
                    <div className="text-[12px] text-gray-400">(1)</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}