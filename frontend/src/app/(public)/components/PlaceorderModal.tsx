"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import ahroomiLogo from "../../../../public/assets/images/ahroomoLogo.png";
import discount from "../../../../public/assets/images/discount.png";
import shCart from "../../../../public/assets/images/shCart.png";
import cartImg from "../../../../public/assets/images/cartImg.jpg";
import gokwik from "../../../../public/assets/images/gokwik.svg";
import india from "../../../../public/assets/images/india.png";


interface PlaceorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  isAvailable: boolean;
}

type Step = "mobile" | "otp" | "address" | "payment";

type AddressForm = {
  pincode: string;
  city: string;
  state: string;
  phone: string;
  country: string;
  fullName: string;
  email: string;
  fullAddress: string;
  addressType: "home" | "office" | "others";
};

type SavedAddress = Omit<AddressForm, "addressType"> & {
  addressType: AddressForm["addressType"];
};

export default function PlaceorderModal({
  isOpen,
  onClose,
}: PlaceorderModalProps) {
  // Steps & state
  const [currentStep, setCurrentStep] = useState<Step>("mobile");
  const [mobileCompleted, setMobileCompleted] = useState(false);
  const [otpCompleted, setOtpCompleted] = useState(false);
  const [addressCompleted, setAddressCompleted] = useState(false);

  // UI toggles
  const [openSummary, setOpenSummary] = useState(false);
  const [openCoupons, setOpenCoupons] = useState(false);

  // Mobile & OTP
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [notifyMe, setNotifyMe] = useState(false);
  const otpRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  // Address
  const [addressForm, setAddressForm] = useState<AddressForm>({
    pincode: "",
    city: "",
    state: "",
    phone: "",
    country: "India",
    fullName: "",
    email: "",
    fullAddress: "",
    addressType: "home",
  });
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);

  // Coupons
  const availableCoupons: Coupon[] = [
    {
      id: "1",
      code: "SANTA",
      description: "Buy & Get 2 ACV Sachets on orders Rs.999+",
      isAvailable: true,
    },
  ];
  const unavailableCoupons: Coupon[] = [
    {
      id: "2",
      code: "SANTA1",
      description: "Buy & Get Serum on orders Rs.1499+",
      isAvailable: false,
    },
    {
      id: "3",
      code: "SANTA2",
      description: "Rs.200 Cashback on orders Rs.1299+",
      isAvailable: false,
    },
  ];

  // Payment
  type PaymentMethod =
    | "razorpay"
    | "cod"
    | "upi"
    | "card"
    | "netbanking"
    | null;
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);

  // Timer effect for OTP
  useEffect(() => {
    if (currentStep === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    return;
  }, [currentStep, timer]);

  // prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} Min ${secs
      .toString()
      .padStart(2, "0")} Sec`;
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "");
    if (sanitized.length > 1) return;
    const newOtp = [...otp] as string[];
    newOtp[index] = sanitized;
    setOtp(newOtp);
    if (sanitized && index < otpRefs.length - 1) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  // Navigation / validation
  const handleContinueFromMobile = () => {
    if (mobileNumber.length === 10) {
      setMobileCompleted(true);
      setCurrentStep("otp");
      setTimer(120);
    }
  };

  const handleContinueFromOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      setOtpCompleted(true);
      setCurrentStep("address");
    }
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("mobile");
      setOtp(["", "", "", ""]);
    } else if (currentStep === "address") {
      setCurrentStep("otp");
    } else if (currentStep === "payment") {
      setCurrentStep("address");
    }
  };

  const validateAddress = (form: AddressForm) => {
    // minimal validation: required fields not empty; pincode length 6; phone length 10
    if (!form.pincode || form.pincode.trim().length < 3) return false;
    if (!form.city) return false;
    if (!form.state) return false;
    if (!form.phone || form.phone.trim().length < 7) return false;
    if (!form.fullName) return false;
    if (!form.fullAddress) return false;
    return true;
  };

  const handleAddressSubmit = () => {
    if (!validateAddress(addressForm)) {
      // simple feedback; in production display friendly UI message
      alert("Please fill required address fields correctly.");
      return;
    }
    // Save address (so it can be shown on payment screen)
    setSavedAddress({
      pincode: addressForm.pincode,
      city: addressForm.city,
      state: addressForm.state,
      phone: addressForm.phone,
      country: addressForm.country,
      fullName: addressForm.fullName,
      email: addressForm.email,
      fullAddress: addressForm.fullAddress,
      addressType: addressForm.addressType,
    });
    setAddressCompleted(true);
    setCurrentStep("payment");
    // reset selected payment (so user chooses again)
    setSelectedPayment(null);
  };

  // Payment handling
  const handlePayNow = () => {
    if (!selectedPayment) {
      alert("Please choose a payment method.");
      return;
    }

    // Example flow: for COD, show fee; for others, proceed to payment gateway.
    if (selectedPayment === "cod") {
      // For demonstration, show confirmation
      alert("Order placed with COD. ₹49 fee applied.");
    } else {
      // Simulate payment success
      alert(`Payment successful via ${selectedPayment.toUpperCase()}`);
    }
    // close modal or reset — here we reset to initial state and close
    resetAll();
    onClose();
  };

  const resetAll = () => {
    setCurrentStep("mobile");
    setMobileNumber("");
    setOtp(["", "", "", ""]);
    setTimer(120);
    setNotifyMe(false);
    setAddressForm({
      pincode: "",
      city: "",
      state: "",
      phone: "",
      country: "India",
      fullName: "",
      email: "",
      fullAddress: "",
      addressType: "home",
    });
    setSavedAddress(null);
    setSelectedPayment(null);
    setOpenCoupons(false);
    setOpenSummary(false);
    setMobileCompleted(false);
    setOtpCompleted(false);
    setAddressCompleted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" aria-hidden />

      <div className="relative w-full max-w-lg h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {currentStep !== "mobile" && (
              <button
                onClick={handleBack}
                className="p-2 rounded-md hover:bg-gray-100 transition"
                aria-label="Back"
              >
                <FaArrowLeft className="text-gray-600 text-base" />
              </button>
            )}
            <Image
              src={ahroomiLogo}
              alt="Ahroomi Logo"
              width={80}
              height={28}
              priority
            />
          </div>

          <div className="flex justify-center items-center gap-3 text-sm">
            <span
              className={`font-medium ${
                mobileCompleted ||
                currentStep === "otp" ||
                currentStep === "address" ||
                currentStep === "payment"
                  ? "text-[#22a6dd]"
                  : "text-gray-600"
              }`}
            >
              {mobileCompleted ? "✓ Mobile" : "Mobile"}
            </span>
            <span className="text-gray-300">•••••</span>
            <span
              className={`font-medium ${
                addressCompleted ||
                currentStep === "address" ||
                currentStep === "payment"
                  ? "text-[#22a6dd]"
                  : "text-gray-400"
              }`}
            >
              {addressCompleted ? "✓ Address" : "Address"}
            </span>
            <span className="text-gray-300">•••••</span>
            <span
              className={`font-medium ${
                currentStep === "payment" ? "text-[#22a6dd]" : "text-gray-400"
              }`}
            >
              Pay
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white shadow-sm hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <RxCross2 className="text-gray-600 text-xl" />
          </button>
        </div>

        {/* Cashback slider */}
        <div className="bg-[#a7e0ff] px-4 py-2 border-b border-gray-100">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            slidesPerView={1}
            className="text-sm"
          >
            <SwiperSlide>
              <div className="text-center text-gray-800 font-medium">
                You Will Get <span className="font-bold">₹188</span> Cashback
                With This Order
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center text-red-600 font-medium">
                No Cashback on COD Orders
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="text-center text-gray-800 font-medium">
                Get Exciting Offers on Prepaid Orders!
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-40 bg-[#f9f9f9]">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 mb-4">
            <button
              onClick={() => setOpenSummary(!openSummary)}
              className="flex justify-between items-center w-full cursor-pointer"
            >
              <div className="flex items-center gap-2 font-medium text-gray-700">
                <Image src={shCart} alt="Cart" width={15} />
                <span className="flex items-center gap-1">
                  Order Summary
                  <TfiAngleDown
                    className={`transition-transform duration-300 ${
                      openSummary ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </div>
              <span className="font-semibold text-gray-700">₹1,154</span>
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                openSummary ? "max-h-[500px] mt-3" : "max-h-0"
              }`}
            >
              <div className="flex items-start gap-3">
                <Image
                  src={cartImg}
                  alt="Product"
                  width={55}
                  className="rounded-md"
                />
                <div>
                  <p className="text-gray-800 font-medium leading-snug">
                    Multi Power 500mg Apple Cider Vinegar Effervescent (Pack of
                    3)
                  </p>
                  <p className="text-sm text-gray-500">Quantity: 1</p>
                  <p className="text-sm text-gray-500">
                    Price: <span className="line-through">₹1,245</span>{" "}
                    <span className="font-semibold text-gray-800">₹1,199</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>MRP</span>
                  <span>₹1,245</span>
                </div>
                <div className="flex justify-between">
                  <span>Item Discount</span>
                  <span className="text-green-600">-₹46</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹1,199</span>
                </div>
                <div className="flex justify-between">
                  <span>Prepaid Discount</span>
                  <span className="text-green-600">-₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹5</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-semibold text-gray-900">
                  <span>To Pay</span>
                  <span>₹1,154</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon & Wallet - Show only in mobile/otp */}
          {currentStep !== "address" && (
            <>
              <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 mb-3">
                <div className="flex justify-between items-center py-1 px-2 rounded bg-[#e6f7ff]">
                  <div className="flex items-center gap-2">
                    <Image src={discount} alt="Discount" width={15} />
                    <span className="font-medium text-gray-700">SANTA</span>
                  </div>
                  <button className="text-[#22a6dd] font-medium">Apply</button>
                </div>

                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>3 Coupons Available</span>
                  <button
                    onClick={() => setOpenCoupons(!openCoupons)}
                    className="text-[#22a6dd] font-medium flex items-center gap-2"
                  >
                    View All Coupons <TfiAngleRight />
                  </button>
                </div>

                {openCoupons && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="mb-2 pb-4 border-b border-dashed border-[#a7e0ff]">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Enter Coupon Code
                      </h3>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22a6dd]"
                      />
                    </div>

                    <div className="mb-4">
                      <h3 className="font-medium text-[#075090] mb-2">
                        Available Offers
                      </h3>
                      <div className="space-y-2">
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="border border-gray-200 rounded-md p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {coupon.code}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {coupon.description}
                                </p>
                              </div>
                              <button className="px-3 py-1 bg-[#22a6dd] text-white rounded text-sm font-medium">
                                APPLY
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-[#075090] mb-2">
                        Unavailable Offers
                      </h3>
                      <div className="space-y-2">
                        {unavailableCoupons.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="border border-gray-200 rounded-md p-3 opacity-60"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {coupon.code}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {coupon.description}
                                </p>
                              </div>
                              <button
                                disabled
                                className="px-3 py-1 bg-gray-300 text-gray-500 rounded text-sm font-medium cursor-not-allowed"
                              >
                                APPLY
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      Use Wallet Credit
                    </p>
                    <p className="text-sm text-gray-500">
                      Available Wallet Balance ₹195
                    </p>
                  </div>
                  <button className="text-[#22a6dd] font-medium">Apply</button>
                </div>
              </div>
            </>
          )}

          {/* MOBILE STEP */}
          {currentStep === "mobile" && (
            <>
              <p className="text-center text-gray-800 font-semibold mb-4 mt-1">
                Enter Mobile Number
              </p>
              <div className="flex items-center gap-3 bg-white border border-green-300 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 pl-1">
                  <Image src={india} alt="IN" width={20} />
                  <span className="text-gray-700 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setMobileNumber(value);
                  }}
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={notifyMe}
                  onChange={(e) => setNotifyMe(e.target.checked)}
                  className="accent-[#22a6dd] w-4 h-4"
                />
                <span>Notify me for orders, updates & offers</span>
              </label>
            </>
          )}

          {/* OTP STEP */}
          {currentStep === "otp" && (
            <>
              <p className="text-center text-gray-800 font-semibold mb-2">
                Verify Mobile Number
              </p>
              <p className="text-center text-sm text-gray-600 mb-4">
                To use your saved address, enter the OTP sent to
              </p>
              <p className="text-center text-[#22a6dd] font-medium mb-6">
                +91- {mobileNumber.slice(0, 5)} {mobileNumber.slice(5)} ✏️
              </p>

              <div className="flex justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]} // ✅ Correct TypeScript-safe ref
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-14 h-14 text-center text-xl font-semibold border-2 border-green-300 rounded-lg focus:outline-none bg-white"
                  />
                ))}
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Resend OTP in</p>
                <p className="text-orange-500 font-medium">
                  {formatTime(timer)}
                </p>
              </div>
            </>
          )}

          {/* ADDRESS STEP */}
          {currentStep === "address" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-800 font-semibold text-lg">
                  New Address
                </h3>
                <span className="text-sm text-red-500">* Mandatory Fields</span>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, pincode: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                />

                <div className="grid grid-cols-2 gap-3">
                          <input
                    type="text"
                    placeholder="Country *"
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                  />
          
                  <input
                    type="text"
                    placeholder="State *"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                          <input
                    type="text"
                    placeholder="City *"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="Phone No *"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={addressForm.fullName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        fullName: e.target.value,
                      })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={addressForm.email}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, email: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white"
                  />
                </div>

                <textarea
                  placeholder="Full Address (House no., Area, etc) *"
                  value={addressForm.fullAddress}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      fullAddress: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22a6dd] bg-white resize-none"
                />

                <div>
                  <h4 className="text-gray-800 font-medium mb-3">
                    Address Type
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        "home",
                        "office",
                        "others",
                      ] as AddressForm["addressType"][]
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setAddressForm({ ...addressForm, addressType: type })
                        }
                        type="button"
                        className={`px-2 py-3 border-2 rounded-lg font-medium transition text-left ${
                          addressForm.addressType === type
                            ? "border-[#22a6dd] bg-[#e6f7ff] text-[#22a6dd]"
                            : "border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              addressForm.addressType === type
                                ? "border-[#22a6dd]"
                                : "border-gray-400"
                            } flex items-center justify-center`}
                          >
                            {addressForm.addressType === type && (
                              <div className="w-2 h-2 bg-[#22a6dd] rounded-full" />
                            )}
                          </div>
                          <div className="text-sm">
                            <div className="font-medium capitalize">
                              {type === "home"
                                ? "Home"
                                : type === "office"
                                ? "Office"
                                : "Others"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {type === "home"
                                ? "7AM-9PM"
                                : type === "office"
                                ? "10AM-6PM"
                                : ""}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-gray-800 font-medium mb-3">
                    Shipping method
                  </h4>
                  <div className="flex items-center gap-3 px-4 py-3 border-2 border-[#22a6dd] bg-[#e6f7ff] rounded-lg">
                    <div className="w-5 h-5 rounded-full border-2 border-[#22a6dd] bg-[#22a6dd] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>
                    <span className="text-[#22a6dd] font-medium">
                      Standard Shipping
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PAYMENT STEP */}
          {currentStep === "payment" && (
            <>
              {/* Show saved address box with edit */}
              <div className="bg-white rounded-xl shadow-sm px-4 py-3 mb-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-gray-800 font-medium">
                      {savedAddress?.fullName ?? "Shipping Address"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {savedAddress
                        ? `${savedAddress.fullAddress}, ${savedAddress.city}, ${savedAddress.state} - ${savedAddress.pincode}`
                        : "No address found."}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {savedAddress
                        ? `${savedAddress.country} | ${savedAddress.phone}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => setCurrentStep("address")}
                      className="text-[#22a6dd] font-medium text-sm"
                    >
                      Edit
                    </button>
                    {addressCompleted ? (
                      <span className="text-sm text-green-600 font-medium">
                        Selected
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Not saved</span>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-gray-800 font-semibold text-lg mb-3">
                Payment Options
              </h3>

              {/* Payment option component */}
              <div className="space-y-3">
                {/* Razorpay */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("razorpay")}
                  className={`w-full flex justify-between items-center bg-white rounded-xl shadow-sm p-4 border ${
                    selectedPayment === "razorpay"
                      ? "border-[#22a6dd]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f3f9ff] flex items-center justify-center text-sm font-medium">
                      R
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Razorpay</div>
                      <div className="text-xs text-gray-500">Fast & secure</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700 font-semibold">
                      ₹1,254
                    </div>
                    <div className="text-xs text-green-600">
                      10% off upto ₹50
                    </div>
                  </div>
                </button>

                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("upi")}
                  className={`w-full flex justify-between items-center bg-white rounded-xl shadow-sm p-4 border ${
                    selectedPayment === "upi"
                      ? "border-[#22a6dd]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center text-sm font-medium">
                      UPI
                    </div>
                    <div className="text-left">
                      <div className="font-medium">UPI</div>
                      <div className="text-xs text-gray-500">
                        Pay with UPI apps
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700 font-semibold">
                      ₹1,254
                    </div>
                    <div className="text-xs text-green-600">
                      10% off upto ₹50
                    </div>
                  </div>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("card")}
                  className={`w-full flex justify-between items-center bg-white rounded-xl shadow-sm p-4 border ${
                    selectedPayment === "card"
                      ? "border-[#22a6dd]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fff7ed] flex items-center justify-center text-sm font-medium">
                      💳
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Debit/Credit Card</div>
                      <div className="text-xs text-gray-500">
                        Visa, MasterCard, Rupay
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700 font-semibold">
                      ₹1,254
                    </div>
                    <div className="text-xs text-green-600">
                      10% off upto ₹50
                    </div>
                  </div>
                </button>

                {/* Netbanking */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("netbanking")}
                  className={`w-full flex justify-between items-center bg-white rounded-xl shadow-sm p-4 border ${
                    selectedPayment === "netbanking"
                      ? "border-[#22a6dd]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center text-sm font-medium">
                      🏦
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Netbanking</div>
                      <div className="text-xs text-gray-500">
                        Select your bank
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700 font-semibold">
                      ₹1,254
                    </div>
                    <div className="text-xs text-green-600">
                      10% off upto ₹50
                    </div>
                  </div>
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setSelectedPayment("cod")}
                  className={`w-full flex justify-between items-center bg-white rounded-xl shadow-sm p-4 border ${
                    selectedPayment === "cod"
                      ? "border-[#22a6dd]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#fff1f2] flex items-center justify-center text-sm font-medium">
                      COD
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-xs text-gray-500">
                        No cashback, ₹49 fee
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700 font-semibold">
                      ₹1,353
                    </div>
                    <div className="text-xs text-red-600">+ ₹49 fee</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-0 left-0 w-full px-5 pb-5 pt-3 bg-white border-t border-[#ccc]">
          <button
            onClick={
              currentStep === "mobile"
                ? handleContinueFromMobile
                : currentStep === "otp"
                ? handleContinueFromOtp
                : currentStep === "address"
                ? handleAddressSubmit
                : handlePayNow
            }
            disabled={
              (currentStep === "mobile" && mobileNumber.length !== 10) ||
              (currentStep === "otp" && otp.join("").length !== 4) ||
              (currentStep === "address" && !validateAddress(addressForm))
            }
            className="w-full bg-[#22a6dd] text-white py-2.5 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === "payment" ? "Pay Now →" : "Continue →"}
          </button>

          <p className="text-center text-xs text-gray-500 mt-2">
            By proceeding, I accept that I have read and understood the{" "}
            <span className="text-[#22a6dd]">Privacy Policy</span> and{" "}
            <span className="text-[#22a6dd]">T&C</span>
          </p>

          <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-500">
            <span>🔒 PCI DSS</span>
            <span>💳 Secured Payment</span>
            <span>✔ Verified</span>
            <Image src={gokwik} alt="gokwik" width={60} />
          </div>
        </div>
      </div>
    </div>
  );
}
