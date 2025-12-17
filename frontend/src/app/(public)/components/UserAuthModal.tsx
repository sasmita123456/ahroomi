// UserAuthModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { RxCross2, RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsShieldCheck } from "react-icons/bs";

type UserAuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserAuthModal({ isOpen, onClose }: UserAuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
    } else {
      document.removeEventListener("keydown", onKey);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple email validation
    if (email && email.includes("@")) {
      setShowOtp(true);
      setTimer(30);
      // In real app, send OTP to email
      console.log("OTP sent to:", email);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      // In real app, verify OTP
      console.log("OTP verified:", enteredOtp);
      // Simulate success
      alert("OTP verified successfully!");
      onClose();
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtp(["", "", "", ""]);
    // In real app, resend OTP
    console.log("OTP resent to:", email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginMode) {
      console.log("Sign up with:", { name, email, password });
      onClose();
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setShowOtp(false);
    setEmail("");
    setPassword("");
    setName("");
    setOtp(["", "", "", ""]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-[#22a6dd] to-[#2cb5e8] px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                {showOtp ? (
                  <BsShieldCheck className="text-white" size={24} />
                ) : (
                  <HiOutlineMail className="text-white" size={24} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {showOtp ? "Verify OTP" : isLoginMode ? "Welcome Back!" : "Join AHroomi"}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {showOtp ? "Enter 4-digit code sent to your email" : 
                   isLoginMode ? "Sign in to your account" : "Create your account"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <RxCross2 className="text-white" size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {showOtp ? (
              // OTP Verification View
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-50 to-blue-100 rounded-full mb-4">
                    <BsShieldCheck className="text-[#22a6dd]" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    OTP Verification
                  </h3>
                  <p className="text-gray-600">
                    Enter 4-digit code sent to{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className="flex justify-center gap-3 mb-5">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#22a6dd] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="text-center mb-5">
                    {timer > 0 ? (
                      <p className="text-gray-600">
                        Resend OTP in <span className="font-semibold text-[#22a6dd]">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#22a6dd] font-semibold hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-[#22a6dd] to-[#2cb5e8] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-200"
                  >
                    Verify & Continue
                    <LiaLongArrowAltRightSolid className="text-white text-xl" />
                  </button>
                </form>
              </div>
            ) : isLoginMode ? (
              // Login View
              <>
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <HiOutlineMail className="text-gray-500" />
                        <span>Email Address</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#22a6dd] focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-[#22a6dd] to-[#2cb5e8] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-200"
                  >
                    Login with OTP
                    <LiaLongArrowAltRightSolid className="text-white text-xl" />
                  </button>

                  <p className="text-center text-xs text-gray-600 mt-8">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-[#22a6dd] font-medium hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#22a6dd] font-medium hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </>
            ) : (
              // Signup View
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#22a6dd] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#22a6dd] focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#22a6dd] focus:border-transparent pr-12"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <RxEyeClosed size={20} />
                      ) : (
                        <RxEyeOpen size={20} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Must be at least 8 characters with a number and symbol
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-[#22a6dd] to-[#2cb5e8] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-200 mt-6"
                >
                  Create an Account
                  <LiaLongArrowAltRightSolid className="text-white text-xl" />
                </button>

                <div className="mt-5 text-center">
                  <p className="text-gray-600">
                    Already have an account?
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="ml-1 text-[#22a6dd] font-semibold hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Back to login from OTP */}
            {showOtp && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-[#22a6dd] font-medium hover:underline"
                >
                  ← Back to login
                </button>
              </div>
            )}

            {/* Toggle between login and signup (not in OTP view) */}
            {!showOtp && isLoginMode && (
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  New to AHroomi?
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-1 text-[#22a6dd] font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}