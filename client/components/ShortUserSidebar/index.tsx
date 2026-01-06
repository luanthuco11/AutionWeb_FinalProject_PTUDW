import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { userCategories } from "@/app/const";
import { useAuthStore } from "@/store/auth.store";
import RenderIcon from "../RenderIcon";

const ShortUserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  // Lọc categories dựa trên role
  const visibleCategories = userCategories.filter(
    (item) => role && item.roles.includes(role)
  );

  // Đóng sidebar khi đổi route
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll thân trang khi mở menu
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* --- NÚT TRIGGER (Giao diện chính) --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 active:scale-95 transition-all mb-4"
      >
        <Menu className="w-5 h-5 text-indigo-600" />
        <span className="font-semibold text-[15px]">Hồ sơ của tôi</span>
      </button>

      {/* --- SIDEBAR DRAWER --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop mờ - Hiệu ứng fade in */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Nội dung Sidebar - Trượt từ trái sang */}
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            {/* 1. STICKY HEADER: Cố định trên cùng */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-5 bg-white border-b">
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Hồ sơ của tôi
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors active:rotate-90 duration-200"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* 2. SCROLLABLE MENU LIST: Chỉ scroll vùng này */}
            <div className="flex-1 overflow-y-auto overscroll-contain bg-white minimal-scrollbar">
              <div className="px-3 py-4 space-y-1.5">
                {visibleCategories.map((item) => {
                  const isActive = "/user" + item.slug === pathname;

                  return (
                    <Link
                      key={item.id}
                      href={`/user/${item.slug}`}
                      className="block group"
                    >
                      <div
                        className={`relative flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 active:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        {/* Vạch active bên trái hiện đại hơn */}
                        {isActive && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-full" />
                        )}

                        <div className="flex items-center gap-4">
                          <div
                            className={`transition-colors ${
                              isActive
                                ? "text-indigo-600"
                                : "text-slate-400 group-hover:text-indigo-500"
                            }`}
                          >
                            <RenderIcon icon={item.icon} />
                          </div>
                          <span
                            className={`text-[15.5px] tracking-tight ${
                              isActive ? "font-bold" : "font-medium"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 transition-all duration-300 ${
                            isActive
                              ? "opacity-100 translate-x-0 text-indigo-600"
                              : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-slate-300"
                          }`}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Padding bottom để không bị che khuất bởi các nút hệ thống mobile */}
              <div className="h-20" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShortUserSidebar;
