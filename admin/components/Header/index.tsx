"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className=" md:flex bg-white border-b border-gray-200 shadow-sm z-50 h-full w-full items-center">
      <div className="container-layer">
        <div className="flex items-center justify-between  ">
          <Link href="/" className="shrink-0">
            <div className="text-2xl font-bold text-blue-600">
              4<span className="text-amber-400"> thằng lỏ nha</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 relative">
            <button
              onClick={() => {
                setOpenLogout(true);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium hover:cursor-pointer"
            >
              <User size={24} />
              <span className="text-xl">User</span>
            </button>
            {openLogout ? (
              <div
                ref={logoutRef}
                className="absolute  top-[calc(100%+4px)] left-0"
              >
                <div className="bg-white text-red-500  w-35 p-2  border-2 border-gray-100 rounded-[6px] ">
                  <div
                    className="flex flex-row hover:cursor-pointer"
                    onClick={() => {
                      console.log(2);
                    }}
                  >
                    <div className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-log-out-icon lucide-log-out"
                      >
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      </svg>
                    </div>

                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="bg-white text-red-500  ">
              <div
                className="flex flex-row hover:cursor-pointer"
                onClick={() => {
                  console.log(2);
                }}
              >
                <div className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-log-out-icon lucide-log-out"
                  >
                    <path d="m16 17 5-5-5-5" />
                    <path d="M21 12H9" />
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                </div>

                <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
