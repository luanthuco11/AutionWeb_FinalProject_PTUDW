"use client";

import Link from "next/link";
import { FC, SVGProps, useState } from "react";
import RenderIcon from "../RenderIcon";
import { useAuthStore } from "@/store/auth.store";
import { USER_ROLES } from "@/shared/role";
import { ChevronRight } from "lucide-react"; // Thêm icon để chỉ hướng
import { usePathname, useRouter } from "next/navigation";

export type UserRole = "guest" | "bidder" | "seller" | "admin" | undefined;
export interface UserCategory {
  id: number;
  name: string;
  slug: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  roles: UserRole[];
}

export default function UserCategoryTable({
  userCategories,
   isMobile = false,
}: {
  userCategories: UserCategory[];
   isMobile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = (slug: string) => {
    router.push(`/user/${slug}`);
  };

  const user = useAuthStore((s) => s.user);
  const isBidder = user?.role === USER_ROLES.BIDDER;

  console.log("role", user?.role);
  const categories = userCategories.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  return (
    <div
      className={`relative w-68 ${
        // isBidder ? "h-[468px]" : "h-[508px]"
        isBidder ? "h-[520px]" : "h-[580px]"
      } flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden`}
    >
      {/* Header Sidebar */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Hồ sơ của tôi
        </h2>
      </div>

      {/* Menu List */}
      <div className="grow px-3 pb-4 minimal-scrollbar space-y-1">
        {categories.map((item) => {
          // const isActive = item.id === idCurrent;
          console.log("/user" + item.slug);
          console.log("pathname: ", pathname);
          const isActive = "/user" + item.slug === pathname;

          return (
            <div key={item.id} className="relative group">
              {/* Active Indicator (Vạch xanh bên trái) */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full z-10" />
              )}

              <Link href={`/user/${item.slug}`} prefetch className="block">
                <button
                  onClick={() => handleClick(item.slug)}
                  className={`w-full group flex items-center justify-between px-2 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1 rounded-lg transition-colors ${
                        isActive
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-blue-500"
                      }`}
                    >
                      <RenderIcon icon={item.icon} />
                    </div>
                    <span
                      className={`text-[15px] ${
                        isActive ? "font-bold" : "font-medium"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Mũi tên nhỏ bên phải khi hover hoặc active */}
                  <ChevronRight
                    className={`w-4 h-4 transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  />
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
