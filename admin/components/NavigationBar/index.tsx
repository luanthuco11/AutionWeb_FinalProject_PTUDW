"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
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
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
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
          className="lucide lucide-users-icon lucide-users"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <circle cx={9} cy={7} r={4} />
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
          className="lucide lucide-settings-icon lucide-settings"
        >
          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
          <circle cx={12} cy={12} r={3} />
        </svg>
      ),
      href: "overall",
      title: "Quản lý chung",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx={12} cy={7} r={4} />
        </svg>
      ),
      href: "info",
      title: "Thông tin người dùng",
    },
  ];

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-100 flex flex-col antialiased select-none">
      {/* Header Section */}
      <div className="px-8 pt-10">
        <div className="flex items-center gap-2 mb-1">
          {/* Thay đổi dot từ green sang blue */}
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Hệ thống quản trị
          </h2>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-slate-100 to-transparent mt-4" />
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 mt-6 space-y-1.5">
        {sections.map((sec, index) => {
          const isActive = pathname.startsWith(`/${sec.href}`);
          return (
            <Link
              key={index}
              href={`/${sec.href}`}
              className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                isActive
                  ? "bg-blue-600 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] text-white"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-white/40 rounded-r-full" />
              )}

              <div
                className={`mr-3.5 transition-all duration-300 ${
                  isActive
                    ? "text-white scale-110 drop-shadow-sm"
                    : "text-slate-400 group-hover:text-blue-600 group-hover:rotate-3"
                }`}
              >
                {sec.icon}
              </div>

              <span
                className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
                  isActive ? "text-white" : "group-hover:text-blue-700"
                }`}
              >
                {sec.title}
              </span>

              {/* Subtle Inner Glow */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
