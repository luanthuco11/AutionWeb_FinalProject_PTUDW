import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "../LoadingSpinner";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

// --- Sub-component: SortDropdown ---
function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full">
      <select
        className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 pr-10 cursor-pointer transition-colors"
        defaultValue={currentSort || "ascending-price"}
        onChange={(e) => handleSort(e.target.value)}
      >
        <option value="ascending-price">Giá tăng dần</option>
        <option value="descending-price">Giá giảm dần</option>
        <option value="expiring-soon">Sắp kết thúc</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}

const ShortCategorySideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, error } = CategoryHook.useCategories();

  // Logic hiển thị Sort
  const shouldShowSort =
    (pathname.startsWith("/category") && pathname !== "/category") ||
    pathname.startsWith("/search");

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <>
      {/* --- NÚT TRIGGER MOBILE --- */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 active:bg-slate-50 transition-all"
        >
          <Menu className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-[15px]">Danh mục & Bộ lọc</span>
        </button>
      </div>

      {/* --- SIDEBAR DRAWER --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="relative w-[300px] max-w-[85vw] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            {/* 1. STICKY HEADER AREA (Header + Sort) */}
            <div className="sticky top-0 z-20 bg-white border-b">
              <div className="flex items-center justify-between p-4">
                <h2
                  className="text-lg font-bold text-slate-900 cursor-pointer"
                  onClick={() => router.push("/category")}
                >
                  Danh mục
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Phần Sort nằm trong vùng Sticky nếu có */}
              {shouldShowSort && (
                <div className="px-4 pb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                    Sắp xếp theo
                  </p>
                  <SortDropdown />
                </div>
              )}
            </div>

            {/* 2. SCROLLABLE CONTENT (Danh sách danh mục) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-4">
              {isLoading && (
                <div className="flex justify-center py-10">
                  <LoadingSpinner />
                </div>
              )}

              {error && (
                <div className="text-center text-red-500 text-sm py-4">
                  Không thể tải danh mục
                </div>
              )}

              <div className="space-y-1">
                {data?.map((item: any) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded =
                    expandedCategories.has(item.id) && hasChildren;

                  return (
                    <div key={item.id} className="select-none">
                      {/* Parent Item */}
                      <div
                        className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all ${
                          isExpanded
                            ? "bg-slate-50 text-indigo-600"
                            : "text-slate-700 active:bg-slate-50"
                        }`}
                        onClick={() => hasChildren && toggleCategory(item.id)}
                      >
                        <span
                          className={`text-[15px] ${
                            isExpanded ? "font-bold" : "font-medium"
                          }`}
                        >
                          {item.name}
                        </span>
                        {hasChildren && (
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-90 text-indigo-500" : ""
                            }`}
                          />
                        )}
                      </div>

                      {/* Children Sub-menu */}
                      {isExpanded && (
                        <div className="ml-4 mt-1 border-l-2 border-slate-100 space-y-1 animate-in fade-in slide-in-from-top-1">
                          {item.children?.map((child: any) => {
                            const isChildActive =
                              pathname === `/category/${child.slug}`;
                            return (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}?sort=ascending-price`}
                                className={`block ml-4 px-3 py-2.5 text-[14px] rounded-lg transition-colors ${
                                  isChildActive
                                    ? "text-indigo-600 bg-indigo-50/50 font-bold"
                                    : "text-slate-500 active:text-slate-900"
                                }`}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Khoảng trống cuối để tránh bị che */}
              <div className="h-20" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShortCategorySideBar;
