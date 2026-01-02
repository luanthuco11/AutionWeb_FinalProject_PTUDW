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
      href: "user",
      title: "Quản lý người dùng",
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
      href: "overall",
      title: "Quản lý chung",
    },
  ];

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-100 flex flex-col antialiased select-none">
      {/* Header Section */}
      <div className="px-8 pt-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Hệ thống quản trị
          </h2>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-slate-100 to-transparent mt-4" />
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-1.5">
        {sections.map((sec, index) => {
          const isActive = pathname.startsWith(`/${sec.href}`);
          return (
            <Link
              key={index}
              href={`/${sec.href}`}
              className={`group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                isActive
                  ? "bg-green-600 shadow-[0_10px_20px_-10px_rgba(22,163,74,0.4)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-green-600"
              }`}
            >
              {/* Active Indicator (Tinh tế hơn) */}
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-white/40 rounded-r-full" />
              )}

              <div
                className={`mr-3.5 transition-all duration-300 ${
                  isActive
                    ? "text-white scale-110 drop-shadow-sm"
                    : "text-slate-400 group-hover:text-green-600 group-hover:rotate-3"
                }`}
              >
                {sec.icon}
              </div>

              <span
                className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
                  isActive ? "text-white" : "group-hover:text-green-700"
                }`}
              >
                {sec.title}
              </span>

              {/* Subtle Inner Glow cho thẻ Active */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="p-6">
        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 transition-all hover:border-green-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group/card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-green-300 flex items-center justify-center text-white text-sm font-black shadow-inner">
                AD
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 border-2 border-white rounded-full" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate group-hover/card:text-green-500 transition-colors">
                Administrator
              </span>
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-300" />
                Sẵn sàng
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
