"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function ProfileUpdatePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  // Load current user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.getProfile();
        const user = response.user;
        setForm({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        setErrorMsg("Failed to load profile data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setSuccessMsg(null);
      setErrorMsg(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate passwords match if password is being updated
    if (form.password && form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await userService.updateProfile(form);
      setSuccessMsg(response.message || "Profile updated successfully.");
      
      // Update the form with the returned user data
      const updatedUser = response.user;
      setForm(prev => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
        mobile: updatedUser.mobile || prev.mobile,
        password: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error("Profile update error:", error);
      setErrorMsg(error.response?.data?.message || error.message || "Failed to update profile");
    }

    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border px-6 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Profile Update
        </h2>

        {successMsg && (
          <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-800 rounded">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-800 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                className="w-full pl-10 pr-3 py-2 text-gray-900 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* EMAIL - Now editable */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full text-gray-900 pl-10 pr-3 py-2 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={form.mobile}
                onChange={handleChange("mobile")}
                className="w-full text-gray-900 pl-10 pr-3 py-2 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />

              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                className="w-full text-gray-900 pl-10 pr-10 py-2 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter new password (leave blank to keep current)"
              />

              {/* Show/Hide Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Re-enter Password
            </label>

            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-500" />

              <input
                type={showCPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                className="w-full text-gray-900 pl-10 pr-10 py-2 border border-gray-200 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() => setShowCPassword(!showCPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showCPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-medium transition
                ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-[#22A6DD] hover:bg-blue-600"}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}