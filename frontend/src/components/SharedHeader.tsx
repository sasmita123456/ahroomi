"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

import {
  FiMenu,
  FiBell,
  FiLogOut,
  FiChevronDown,
  FiSettings,
} from "react-icons/fi";

import { FaUserCircle } from "react-icons/fa";
import { MdInventory, MdPeopleAlt } from "react-icons/md";

interface SharedHeaderProps {
  toggleSidebar: () => void;
  user?: any;
  userRole: 'ADMIN' | 'CMS';
}

export default function SharedHeader({ toggleSidebar, user, userRole }: SharedHeaderProps) {
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  // Refs for dropdowns
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch (error) {
      window.location.href = "/login";
    }
  };

  // Get profile link based on role
  const getProfileLink = () => {
    return userRole === 'ADMIN' ? "/admin/Profile" : "/cms/profile";
  };

  // Get settings link based on role
  const getSettingsLink = () => {
    return userRole === 'ADMIN' ? "/admin/settings" : "/cms/settings";
  };

  return (
    <header className="h-20 bg-white shadow-sm flex items-center px-4 justify-between border-b">

      {/* Sidebar Toggle */}
      <button onClick={toggleSidebar} className="text-2xl text-gray-700">
        <FiMenu />
      </button>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* NOTIFICATIONS */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => {
              setOpenNotifications(!openNotifications);
              setOpenProfile(false);
            }}
            className="relative text-2xl text-gray-700 hover:text-blue-500"
          >
            <FiBell />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {/* NOTIFICATION DROPDOWN */}
          {openNotifications && (
            <div
              className="absolute right-0 mt-3 w-80 bg-white shadow-xl border rounded-lg z-50 animate-dropdown"
            >
              <div className="p-4 border-b">
                <p className="font-semibold text-gray-900">Notifications</p>
              </div>

              <ul className="max-h-60 overflow-auto">

                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-900 font-medium flex items-center gap-2">
                  <FiBell className="text-blue-500 text-lg" />
                  New notification
                </li>

                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-900 font-medium flex items-center gap-2">
                  <MdInventory className="text-yellow-500 text-xl" />
                  System update
                </li>

                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-900 font-medium flex items-center gap-2">
                  <MdPeopleAlt className="text-green-600 text-xl" />
                  New message
                </li>

              </ul>
            </div>
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setOpenProfile(!openProfile);
              setOpenNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <FaUserCircle className="text-3xl text-gray-600" />
            <span className="text-gray-800 font-medium hidden md:block">
              {user?.name || (userRole === 'ADMIN' ? "Admin" : "CMS User")}
            </span>
            <FiChevronDown className="text-gray-600" />
          </button>

          {/* PROFILE DROPDOWN */}
          {openProfile && (
            <div
              className="absolute right-0 mt-3 w-86 bg-white shadow-xl border rounded-lg z-50 animate-dropdown"
            >
              <div className="p-4 border-b">
                <p className="font-semibold text-gray-900">Logged in as</p>
                <p className="text-gray-800 text-sm">{user?.email || "user@example.com"}</p>
                <p className="text-gray-600 text-xs mt-1">
                  Role: {userRole === 'ADMIN' ? 'Administrator' : 'Content Manager'}
                </p>
              </div>

              <ul className="py-2">

                {/* Profile Update */}
                <li>
                  <button
                    onClick={() => router.push(getProfileLink())}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2 items-center text-gray-900 font-medium"
                  >
                    <FaUserCircle className="text-blue-500 text-xl" />
                    Profile Update
                  </button>
                </li>

                {/* Settings */}
                <li>
                  <button
                    onClick={() => router.push(getSettingsLink())}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2 items-center text-gray-900 font-medium"
                  >
                    <FiSettings className="text-gray-700 text-xl" />
                    Settings
                  </button>
                </li>

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex gap-2 items-center font-semibold"
                  >
                    <FiLogOut className="text-red-600 text-lg" />
                    Logout
                  </button>
                </li>

              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}