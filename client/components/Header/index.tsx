"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, UserPen } from "lucide-react";
import { SearchBar } from "../SearchBar";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = useAuthStore().user?.role;

  return (
    <header className="w-full h-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="container-layout">
        <div className="flex items-center justify-between h-16">
          <div className="relative h-full py-2">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="Logo AuctionHub"
                width={180}
                height={180}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <SearchBar />
          </div>
          {role && role !== "guest" ? (
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/user/favorite_products"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <ShoppingCart size={20} />
                <span className="text-sm">Yêu thích</span>
              </Link>
              <Link
                href="/user/info"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <User size={20} />
                <span className="text-sm">Hồ sơ cá nhân</span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <User size={20} />
                <span className="text-sm">Đăng nhập</span>
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <UserPen size={20} />
                <span className="text-sm">Đăng ký</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* HÀNG 2: Mobile SearchBar (MỚI THÊM - Chỉ hiện trên mobile) */}
        <div className="md:hidden pb-3 pt-1 w-full">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top duration-200">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/user/favorite_products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span className="flex-1">Sản phẩm yêu thích</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                href="/user/info"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span className="flex-1">Hồ sơ cá nhân</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
