"use client";
import { useState } from "react";
import Image from "next/image";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaHeart,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

// Import your images
import t1 from "../../../../public/assets/images/t1.jpg";
import t2 from "../../../../public/assets/images/t2.jpg";
import t3 from "../../../../public/assets/images/t3.jpg";
import t4 from "../../../../public/assets/images/t4.jpg";
import buynow from "../../../../public/assets/images/buynow.svg";
import PlaceorderModal from "./PlaceorderModal";

export default function ProductDetails() {
  const [selectedWeight, setSelectedWeight] = useState("25g");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const weightOptions = [
    { id: 1, weight: "25g", price: 350, originalPrice: 500, discount: "30%" },
    { id: 2, weight: "50g", price: 650, originalPrice: 850, discount: "24%" },
    {
      id: 3,
      weight: "100g",
      price: 1200,
      originalPrice: 1500,
      discount: "20%",
    },
    {
      id: 4,
      weight: "200g",
      price: 2200,
      originalPrice: 2800,
      discount: "21%",
    },
  ];

  const selectedWeightOption =
    weightOptions.find((opt) => opt.weight === selectedWeight) ||
    weightOptions[0];

  const product = {
    title: "Face Mask",
    weight: selectedWeight,
    price: selectedWeightOption.price,
    originalPrice: selectedWeightOption.originalPrice,
    discount: selectedWeightOption.discount,
    rating: 4.5,
    reviews: 1,
    inStock: true,
    description:
      "Ahroomi Face Mask is made with pure moringa powder, packed with skin-loving vitamins like A, C, and E. These nutrients help cleanse deeply, soothe dull or tired skin.",
    sku: "BE39VGNT",
    category: "Self Care",
    tags: ["enrato", "lips"],
  };

  const offers = [
    {
      id: 1,
      title: "Bank Offer",
      description: "5% cashback on Axis Bank Flipkart Debit Card up to ₹750",
      terms: "T&C",
      icon: "bank",
      textColor: "text-[#00652f]",
      iconColor: "text-[#00652f]",
    },
    {
      id: 2,
      title: "Special Price",
      description: "Get extra 46% off",
      terms: "T&C",
      icon: "discount",
      textColor: "text-[#00652f]",
      iconColor: "text-[#00652f]",
    },
    {
      id: 3,
      title: "Partner Offer",
      description: "Extra 10% off on UPI payments",
      terms: "T&C",
      icon: "upi",
      textColor: "text-[#00652f]",
      iconColor: "text-[#00652f]",
    },
    {
      id: 4,
      title: "No Cost EMI",
      description: "Available on orders above ₹2,499",
      terms: "T&C",
      icon: "emi",
      textColor: "text-[#00652f]",
      iconColor: "text-[#00652f]",
    },
    {
      id: 5,
      title: "Free Shipping",
      description: "On all orders above ₹499",
      terms: "T&C",
      icon: "shipping",
      textColor: "text-[#00652f]",
      iconColor: "text-[#00652f]",
    },
    {
      id: 6,
      title: "Cashback Offer",
      description: "Additional 5% cashback for Prime members",
      terms: "T&C",
      icon: "cashback",
      textColor: "text-[#00652f]",
      iconColor: "text-[#00652f]",
    },
  ];

  const images = [t1, t2, t3, t4];

  const visibleOffers = showAllOffers ? offers : offers.slice(0, 4);

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product: product.title,
      weight: selectedWeight,
      quantity,
      price: product.price,
    });
  };

  const handleBuyNow = () => {
    console.log("Buy now:", {
      product: product.title,
      weight: selectedWeight,
      quantity,
      price: product.price,
    });
    setShowOrderModal(true);
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-gray-500">
          <a href="/" className="hover:text-black transition-colors">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div className="sticky top-24 h-fit">
            {/* Main Image - Fixed Container */}
            <div className="relative mb-4 rounded-lg overflow-hidden">
              <div className="relative h-[500px] w-full">
                <Image
                  src={images[activeImage]}
                  alt={`${product.title} ${activeImage + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={activeImage === 0}
                />
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() =>
                  setActiveImage((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg border border-gray-200"
              >
                <FaChevronLeft className="text-gray-700" />
              </button>
              <button
                onClick={() =>
                  setActiveImage((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg border border-gray-200"
              >
                <FaChevronRight className="text-gray-700" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                {activeImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto pb-2 px-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index
                      ? "border-[#22a6dd]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:pl-8">
            {/* Product Title with Weight */}
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-3">
              {product.title}

              <span className="text-xl text-gray-600">({product.weight})</span>
            </h2>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">
                    {i < Math.floor(product.rating) ? (
                      <FaStar />
                    ) : i < product.rating ? (
                      <FaStarHalfAlt />
                    ) : (
                      <FaRegStar />
                    )}
                  </span>
                ))}
              </div>
              <span className="text-gray-500 text-sm">
                {product.reviews} customer review
                {product.reviews !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Price and Stock Status */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-gray-800">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                  {product.discount} off
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  Save ₹{(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.inStock
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <div className="mb-5">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="cursor-pointer flex items-center gap-2 px-8 py-2.5 bg-[#22a6dd] text-white font-semibold rounded-lg hover:bg-[#1e96c8] transition-colors shadow-md"
                  >
                    <FiShoppingCart className="text-lg" />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="group cursor-pointer flex items-center gap-2 px-8 py-2.5 
             border-2 border-gray-900 text-gray-800 font-semibold rounded-lg 
             hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    <span className="relative w-4 h-4">
                      <Image
                        src={buynow}
                        alt="Buy Now"
                        fill
                        className="
        object-contain
        scale-x-[-1]
        transition
        group-hover:brightness-0
        group-hover:invert
      "
                      />
                    </span>
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">🚚 Free Delivery</span>
                  <span className="text-gray-400">•</span>
                  <span>Delivery in 2-3 Days</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-green-600 font-medium">
                    Easy Returns
                  </span>
                </div>
              </div>
            </div>

      

            {/* Quantity Selection (Weight/Variant) */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Size</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weightOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedWeight(option.weight)}
                    className={`py-1.5 text-center border rounded-lg transition-all ${
                      selectedWeight === option.weight
                        ? "border-[#22a6dd] bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      {option.weight}
                    </div>
                  </button>
                ))}
              </div>
            </div>
                     {/* Available Offers Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTag className="text-[#00652f]" />
                Available offers
              </h3>

              <div className="space-y-3">
                {visibleOffers.map((offer) => (
                  <div key={offer.id} className="transition-all">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <span className={`${offer.textColor}`}>
                            {offer.title}
                          </span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-600 text-sm">
                            {offer.description}
                          </span>
                          <button
                            className={`text-xs font-medium ${offer.textColor} hover:underline`}
                          >
                            {offer.terms}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More/Less Button */}
              {offers.length > 4 && (
                <button
                  onClick={() => setShowAllOffers(!showAllOffers)}
                  className="mt-4 flex items-center gap-2 text-[#00652f] hover:text-blue-800 font-medium text-sm"
                >
                  {showAllOffers ? (
                    <>
                      <FaChevronUp className="text-xs" />
                      View less offers
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="text-xs" />
                      View {offers.length - 4} more offers
                    </>
                  )}
                </button>
              )}
            </div>

         

            {/* Product Meta Information */}
            <div className="border-t border-gray-200 pt-6 flex items-center gap-6 ">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 ">SKU:</span>
                <span className="text-gray-900 font-medium">{product.sku}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 ">Category:</span>
                <span className="text-gray-900 font-medium">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Tags:</span>
                <span className="text-gray-900 font-medium">
                  {product.tags.join(", ")}
                </span>
              </div>
            </div>

            {/* Wishlist and Share */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group">
                  <div className="p-2 border border-gray-300 rounded-full group-hover:border-red-300 group-hover:bg-red-50 transition-colors">
                    <FaHeart className="text-lg" />
                  </div>
                  <span className="text-sm font-medium">Add to Wishlist</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-[#00652f] transition-colors group">
                  <div className="p-2 border border-gray-300 rounded-full group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">
                    <FaShareAlt className="text-lg" />
                  </div>
                  <span className="text-sm font-medium">
                    Share This Product
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlaceorderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </section>
  );
}
