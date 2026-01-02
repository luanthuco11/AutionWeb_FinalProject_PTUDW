"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCategoryTable from "@/components/ProductCategoryTable";
import { SearchBar } from "@/components/SearchBar";
import CategoryHook from "@/hooks/useCategory";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = CategoryHook.useCategories();
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 shadow-lg flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Đã có lỗi xảy ra. Vui lòng tải lại trang.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <div className="w-full md:w-96 mb-4">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <main className="lg:col-span-9 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] p-4">
              <div className="w-full h-full">{children}</div>
            </div>
          </main>
          <aside className="lg:col-span-3 order-1 lg:order-2 sticky top-4 flex flex-col items-end">
            {data ? (
              <ProductCategoryTable productCategories={data} />
            ) : (
              <LoadingSpinner />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
