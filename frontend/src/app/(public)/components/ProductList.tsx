"use client";

import Image from "next/image";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import styles from "../styles/home.module.css";
import { shopItems } from "../../(public)/data/productlist";
import Link from "next/link";

export default function ProductList() {
  return (
    <section className="w-full bg-white py-12">
      <div className="container mx-auto grid grid-cols-12 gap-6 ">
        {/* LEFT SIDEBAR */}
    <aside className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-3 space-y-10">

  {/* ====================== CATEGORIES ====================== */}
  <div className="bg-[#f5f8fb] rounded-2xl border border-[#c9d6e3] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.10)] transition-all duration-300">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-semibold text-[18px] text-[#1b2a38] flex items-center gap-2">
        <span className="w-2 h-6 bg-[#22a6dd] rounded-full" />
        CATEGORIES
      </h3>
      <span className="text-[11px] text-[#1b2a38] bg-[#cdd9e4] px-2 py-1 rounded-full">
        {shopItems.length} items
      </span>
    </div>

    <ul className="space-y-3">
      {[
        { name: "SELF CARE", count: 24 },
        { name: "ESSENTIAL OIL", count: 18 },
        { name: "POCKET PERFUME", count: 12 },
        { name: "BODY MIST", count: 8 },
        { name: "GIFT SETS", count: 6 },
        { name: "AIR FRESHENER", count: 15 },
      ].map((category) => (
        <li key={category.name}>
          <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-white hover:bg-[#e8f2fa] hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#22a6dd]/40">
            <span className="text-[14px] font-medium text-gray-700">
              {category.name}
            </span>
            <span className="text-[11px] bg-[#cdd9e4] text-[#1d2a35] px-2 py-1 rounded-full min-w-8 text-center transition-all">
              {category.count}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>

  {/* ====================== PRICE RANGE ====================== */}
  <div className="bg-[#f5f8fb] rounded-2xl border border-[#c9d6e3] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.10)] transition-all duration-300">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-semibold text-[18px] text-[#1b2a38] flex items-center gap-2">
        <span className="w-2 h-6 bg-[#22a6dd] rounded-full" />
        PRICE RANGE
      </h3>
      <span className="text-[11px] text-[#1b2a38]">₹</span>
    </div>

    <div className="mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>₹0</span>
        <span>₹5000+</span>
      </div>

      <div className="relative h-2 bg-[#cdd9e4]/60 rounded-full mb-1">
        <div
          className="absolute h-full bg-linear-to-r from-[#cdd9e4] to-[#22a6dd] rounded-full"
          style={{ width: "60%" }}
        />
        <div className="absolute w-4 h-4 bg-white border-2 border-[#22a6dd] rounded-full -top-1 left-[60%] -translate-x-1/2 shadow-md" />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Min: ₹0</span>
        <span>Max: ₹3000</span>
      </div>
    </div>

    <ul className="space-y-2">
      {[
        { range: "Under ₹500", active: true },
        { range: "₹500 – ₹1000", active: false },
        { range: "₹1000 – ₹2000", active: false },
        { range: "₹2000 – ₹5000", active: false },
        { range: "Over ₹5000", active: false },
      ].map((item) => (
        <li key={item.range}>
          <button
            className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-200 text-sm ${
              item.active
                ? "bg-[#22a6dd] text-white shadow-md"
                : "text-gray-700 bg-white hover:bg-[#e8f2fa]"
            }`}
          >
            {item.range}
          </button>
        </li>
      ))}
    </ul>
  </div>

  {/* ====================== DISCOUNT OFFERS ====================== */}
  <div className="bg-[#f5f8fb] rounded-2xl border border-[#c9d6e3] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.10)] transition-all duration-300">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-semibold text-[18px] text-[#1b2a38] flex items-center gap-2">
        <span className="w-2 h-6 bg-[#22a6dd] rounded-full" />
        DISCOUNT OFFERS
      </h3>
      <span className="text-[11px] text-[#22a6dd] bg-[#cdd9e4]/60 px-2 py-1 rounded-full">
        Hot Deals
      </span>
    </div>

    <ul className="space-y-3">
      {[
        { discount: "5% or more", tag: "SAVE 5%", active: true },
        { discount: "10% or more", tag: "BEST VALUE", active: false },
        { discount: "20% or more", tag: "MEGA SALE", active: false },
        { discount: "30% or more", tag: "LIMITED", active: false },
        { discount: "40% or more", tag: "SUPER SAVE", active: false },
      ].map((item) => (
        <li key={item.discount}>
          <button
            className={`w-full flex items-center justify-between py-3 px-4 rounded-xl border transition-all duration-200 ${
              item.active
                ? "border-[#22a6dd] bg-[#22a6dd]/10"
                : "border-[#cdd9e4] bg-white hover:bg-[#e8f2fa]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  item.active ? "bg-[#22a6dd]" : "border border-[#cdd9e4]"
                }`}
              >
                {item.active && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-sm font-medium">{item.discount}</span>
            </div>

            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                item.active
                  ? "bg-[#22a6dd] text-white"
                  : "bg-[#cdd9e4] text-[#1d2a35]"
              }`}
            >
              {item.tag}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>

  {/* ====================== FEATURED PRODUCTS ====================== */}
  <div className="bg-[#f5f8fb] rounded-2xl border border-[#c9d6e3] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_18px_rgba(0,0,0,0.10)] transition-all duration-300">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-semibold text-[18px] text-[#1b2a38] flex items-center gap-2">
        <span className="w-2 h-6 bg-[#22a6dd] rounded-full" />
        FEATURED PRODUCTS
      </h3>
      <span className="text-[11px] text-[#22a6dd] bg-[#cdd9e4]/60 px-2 py-1 rounded-full">
        Popular
      </span>
    </div>

    <ul className="space-y-5">
      {shopItems
        .filter((p) => p.featured)
        .slice(0, 4)
        .map((product) => (
          <li key={product.id}>
            <a
              href={`/product/${product.id}`}
              className="flex gap-4 items-start p-3 rounded-xl bg-white hover:bg-[#e8f2fa] hover:shadow-md border border-transparent hover:border-[#22a6dd]/40 transition-all duration-300"
            >
              <div className="relative shrink-0 w-18 h-18 rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />

                {product.discount && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#22a6dd] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1d2a38] truncate hover:text-[#22a6dd] transition">
                  {product.title}
                </p>
              </div>
            </a>
          </li>
        ))}
    </ul>

    {shopItems.filter((p) => p.featured).length > 0 && (
      <button className="w-full mt-6 py-3 text-sm font-semibold text-[#22a6dd] border border-[#22a6dd] rounded-xl hover:bg-[#22a6dd] hover:text-white transition-all duration-300">
        View All Featured →
      </button>
    )}
  </div>

  {/* ====================== PROMO CARD ====================== */}
  <div className="bg-linear-to-br from-[#22a6dd] to-[#1d2a35] rounded-2xl p-6 text-white shadow-md">
    <div className="text-center">
      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-2xl">🎁</span>
      </div>

      <h4 className="font-bold text-lg mb-2">Special Offer</h4>

      <p className="text-sm text-white/80 mb-4">
        Get 20% off on your first purchase with code: <b>WELCOME20</b>
      </p>

      <button className="w-full py-3 bg-white text-[#1d2a35] font-semibold rounded-xl hover:bg-gray-100 transition-colors">
        Shop Now
      </button>
    </div>
  </div>

</aside>


       <main className="col-span-12 md:col-span-9">

  {/* SORT BY DROPDOWN */}
  <div className="flex justify-end mb-10">
    <select
      className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm hover:border-[#22a6dd] focus:border-[#22a6dd] transition"
    >
      <option value="default">Sort By: Default</option>
      <option value="discount">Discount</option>
      <option value="lowtohigh">Price: Low → High</option>
      <option value="hightolow">Price: High → Low</option>
    </select>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
    {shopItems.map((item) => {
      const oldPrice = item.discount
        ? Math.round(item.price / (1 - item.discount / 100))
        : null;

      return (
        <div
          key={item.id}
          className="flex flex-col h-full rounded-xl border border-gray-200 bg-white overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="relative w-full h-[250px] bg-[#f8f8f8] overflow-hidden">
          <Link href={`/product`} passHref>
              <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover  w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

            {item.discount && (
              <div className="absolute">
                <div className={styles.discountBadgeCustom}>
                  -{item.discount}%
                </div>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <Link href={`/product`} passHref>
                <button className="px-5 py-2 bg-white text-black border border-[#22a6dd] rounded-full font-medium hover:bg-[#22a6dd] hover:text-white transition">
                Buy Now
              </button>
              </Link>
            </div>

            <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition duration-300 ">
              <div className="relative group/icon">
                <button className="w-8 h-8 flex items-center justify-center border border-[#22a6dd] text-[#22a6dd] bg-white rounded-sm hover:bg-[#22a6dd] hover:text-white transition">
                  <FiShoppingCart />
                </button>
              </div>

              <div className="relative group/icon">
                <button className="w-8 h-8 flex items-center justify-center border border-[#22a6dd] text-[#22a6dd] bg-white rounded-sm hover:bg-[#22a6dd] hover:text-white transition">
                  <FiHeart />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col text-center p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate hover:text-[#22a6dd]">
              {item.title}
            </h3>

            <div className="flex justify-center items-center gap-2 mt-1">
              <p className="text-[16px] font-bold text-black">
                ₹{item.price}
              </p>
              {oldPrice && (
                <p className="text-xs text-gray-500 line-through">
                  ₹{oldPrice}
                </p>
              )}
            </div>

            <div className="mt-1 text-yellow-500 text-xs">★★★★★</div>
          </div>
        </div>
      );
    })}
  </div>

</main>

      </div>
    </section>
  );
}
