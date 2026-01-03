"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Gavel,
  Home,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Image from "next/image";

const Header = () => {
  const { signOut, user } = useAuthStore(); // Giả sử store có trả về info user
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(event.target as Node)
      ) {
        setOpenLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setOpenLogout(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* --- LOGO --- */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="ActionHub Logo"
              width={190}
              height={190}
            />
          </div>

          {/* --- DESKTOP USER MENU --- */}
          <div
            className="hidden md:flex items-center gap-4 relative"
            ref={logoutRef}
          >
            <button
              onClick={() => setOpenLogout(!openLogout)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <span className="text-sm font-medium">
                {user?.name || "Tài khoản"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  openLogout ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {openLogout && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU CONTENT --- */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 pb-4 border-t border-gray-200 px-4">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={24} />
              </div>
              <div>
                <div className="text-base font-medium text-gray-800">
                  {user?.name || "Người dùng"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user?.email || "user@example.com"}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
