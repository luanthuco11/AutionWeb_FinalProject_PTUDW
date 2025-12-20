"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const NavigationBar = () => {
  const pathname = usePathname();
  interface Section {
    icon: React.ReactNode;
    href: string;
    title: string;
  }
  const sections: Section[] = [
    {
      icon: (
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
          className="lucide lucide-list-icon lucide-list"
        >
          <path d="M3 5h.01" />
          <path d="M3 12h.01" />
          <path d="M3 19h.01" />
          <path d="M8 5h13" />
          <path d="M8 12h13" />
          <path d="M8 19h13" />
        </svg>
      ),
      href: "category",
      title: "Quản lý danh mục",
    },
    {
      icon: (
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
          className="lucide lucide-box-icon lucide-box"
        >
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
      href: "product",
      title: "Quản lý sản phẩm",
    },
    {
      icon: (
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
          className="lucide lucide-user-icon lucide-user"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      ),
      href: "user",
      title: "Quản lý người dùng",
    },
        {
      icon: (
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
          className="lucide lucide-common-icon lucide-common"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      ),
      href: "overall",
      title: "Quản lý chung",
    },

  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-surface shadow-sm flex flex-col">
      <nav className="flex-1 p-2">
        {sections.map((sec, index) => {
          const isActive = pathname.startsWith(`/${sec.href}`);
          return (
            <Link
              key={index}
              href={`/${sec.href}`}
              className={`block w-full px-4 py-3 rounded-lg mb-2 text-lg font-medium hover:text-green-700/60 hover:border-l-4 hover:border-green-500/60 transition-colors duration-200 ${
                isActive
                  ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                  : ""
              }`}
            >
              <div className="flex flex-row items-center">
                {" "}
                <div className="mr-2">{sec.icon}</div> <div>{sec.title}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
