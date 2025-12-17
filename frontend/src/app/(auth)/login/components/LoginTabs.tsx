"use client";

import React, { useState, useEffect } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { authService } from '@/services/auth.service';
import { encryptPayloadAll } from "@/utils/encryption";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginTabs = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("cms");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Changed to empty initial value
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loginEmail, setLoginEmail] = useState(""); // Store email used during login
  const [otpSuccess, setOtpSuccess] = useState(false); // New state for OTP success
  const [cmsLoginSuccess, setCmsLoginSuccess] = useState(false); // New state for CMS login success

  // Mark when we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        requestAnimationFrame(() => {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          if (nextInput) (nextInput as HTMLInputElement).focus();
        });
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      requestAnimationFrame(() => {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) (prevInput as HTMLInputElement).focus();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userType === "admin") {
        // For admin, we now collect email and password from the form
        // Use the email from the input field instead of hardcoded email
        const payload = { email, password };
        const encryptedPayload = await encryptPayloadAll(payload);
        const result = await authService.adminLogin(encryptedPayload);
      
        // Handle the new standardized response format
        if (result.outcome) {
          toast.success(result.message);
        
          setLoginEmail(email);
        
          setShowOtpModal(true);
        } else {
          throw new Error(result.message);
        }
      } else {
        const payload = { username, password };
        const encryptedPayload = await encryptPayloadAll(payload); 
        const result = await authService.secureCmsLogin(encryptedPayload);
      
        // Handle the new standardized response format
        if (result.outcome) {
          toast.success(result.message);
          console.log("CMS Login result:", result);
        
          // Set CMS login success state to show success screen
          setCmsLoginSuccess(true);
        
          // For CMS, redirect immediately after successful login
          setTimeout(() => {
            router.push('/cms/dashboard');
          }, 2000);
        } else {
          throw new Error(result.message);
        }
      }
    } catch (error: any) {
      // Extract the full error message from the response
      let errorMessage = "An error occurred during login";
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      // Use the email from the login form instead of hardcoded email
      const payload = { email: loginEmail, otp: otpValue };
      const encryptedPayload = await encryptPayloadAll(payload);
      const result = await authService.verifyOtp(encryptedPayload);
    
      // Handle the new standardized response format
      if (result.outcome) {
        toast.success("Admin login successful!");
        console.log("Admin login result:", result);
      
        // Set OTP success state to show success screen
        setOtpSuccess(true);
        setShowOtpModal(false);
        
        // Redirect after delay
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      // Extract the full error message from the response
      let errorMessage = "Invalid OTP";
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      // For resend, we use the email from the form
      const payload = { email: loginEmail, password }; // Include password for resend as well
      const encryptedPayload = await encryptPayloadAll(payload);
      const result = await authService.adminLogin(encryptedPayload);
    
      // Handle the new standardized response format
      if (result.outcome) {
        toast.success(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      // Extract the full error message from the response
      let errorMessage = "Failed to resend OTP";
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  // Show success screen after OTP verification or CMS login
  if (otpSuccess || cmsLoginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?fit=crop&w=1950&q=80')",
        }}
      >
        <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-xl shadow-2xl space-y-8 border border-gray-100 relative overflow-hidden">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {cmsLoginSuccess ? "Login Successful!" : "OTP Verified!"}
            </h2>
            <p className="mt-2 text-gray-600">
              {cmsLoginSuccess 
                ? "Redirecting to your CMS dashboard..." 
                : "Redirecting to your admin dashboard..."}
            </p>
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?fit=crop&w=1950&q=80')",
      }}
    >
      
      <div className="w-full max-w-sm bg-white p-8 md:p-10 rounded-xl shadow-2xl space-y-8 border border-gray-100 relative overflow-hidden">
        {/* Subtle Background Overlay/Shape */}
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/clean-textile.png')",
            backgroundSize: "300px",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <div className="relative w-40">
              <label htmlFor="user-type" className="sr-only">
                Select User Type
              </label>
              <select
                id="user-type"
                name="user-type"
                className={`block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150`}
                value={userType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setUserType(e.target.value);
                  // Reset form when switching user types
                  setUsername("");
                  setPassword("");
                  setEmail("");
                  setOtp(Array(6).fill(""));
                }}
                disabled={loading}
              >
                <option value="cms">CMS</option>
                <option value="admin">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* --- Form Fields Container --- */}
          <div className="space-y-4">
            {/* CMS Form Fields */}
            {userType === "cms" && (
              <>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150`}
                    placeholder="Email Address"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(e.target.value)
                    }
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiMail className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Password Field with HIDE/SHOW Functionality */}
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    // Toggle input type based on showPassword state
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150`}
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    disabled={loading}
                  />
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
                    ) : (
                      <FiEye className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Admin Form Fields - Email and Password */}
            {userType === "admin" && (
              <>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150`}
                    placeholder="Email Address"
                    value={email} // Remove the hardcoded default value
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiMail className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <input
                    id="admin-password"
                    name="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150`}
                    placeholder="Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    disabled={loading}
                  />
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
                    ) : (
                      <FiEye className="w-5 h-5 text-gray-500 hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Submit Button (Color confirmed) */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary hover:bg-accent transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md hover:shadow-lg ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : userType === "admin" ? (
                "Send OTP"
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* --- OTP Modal --- */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                Enter OTP
              </h3>
              <p className="text-sm text-gray-500 mb-6 text-center">
                We have sent a 6-digit OTP to your email address: {loginEmail}
              </p>

              {/* OTP Input Group */}
              <div className="flex justify-center space-x-2 sm:space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOtpChange(index, e.target.value)
                    }
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleOtpKeyDown(index, e)
                    }
                    className="w-10 text-gray-900 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-50 outline-none transition duration-150"
                    onFocus={(e) => e.target.select()}
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleOtpSubmit}
                  disabled={otp.some((d) => d === "") || loading}
                  className={`py-2.5 px-4 border border-transparent text-base font-medium rounded-lg text-white transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    otp.some((d) => d === "") || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-accent focus:ring-primary shadow-md"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtp(Array(6).fill(""));
                  }}
                  className="py-2.5 px-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>

              {/* Resend Link */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm font-medium text-primary hover:text-accent transition duration-150 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginTabs;