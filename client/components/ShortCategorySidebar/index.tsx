import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ProductCategoryTable from "../ProductCategoryTable";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "../LoadingSpinner";
// --- Icons cho Mobile ---
const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

const ShortCategorySideBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data, isLoading, error } = CategoryHook.useCategories();

  // Tự động đóng khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Khóa cuộn trang khi mở menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-2">
          Error loading categories...
        </div>
      )}

      {/* --- TOGGLE BUTTON --- */}
      {/* Sửa: Thêm md:hidden hoặc lg:hidden nếu bạn chỉ muốn hiện nút này trên mobile */}
      {/* Nếu bạn muốn hiện nút này trên cả Desktop thì giữ nguyên class, nhưng logic Drawer bên dưới phải bỏ lg:hidden */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <MenuIcon className="w-5 h-5" />
          <span className="font-medium">Danh mục & Bộ lọc</span>
        </button>
      </div>

      {/* --- DRAWER / OVERLAY --- */}
      {isMobileMenuOpen && (
        // SỬA QUAN TRỌNG: Đã xóa class "lg:hidden" ở dòng dưới đây
        <div className="fixed inset-0 z-50">
          {/* Backdrop tối màu */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Nội dung Menu trượt */}
          {/* Thêm max-w-xs hoặc w-80 để menu không quá to trên desktop nếu lỡ mở */}
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-xs bg-white shadow-xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="inline-block font-bold text-md text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md">
                Chọn danh mục bạn quan tâm
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Chỉ render Table khi có data để tránh lỗi undefined */}
              {data && (
                <ProductCategoryTable
                  productCategories={data}
                  isMobile={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShortCategorySideBar;
