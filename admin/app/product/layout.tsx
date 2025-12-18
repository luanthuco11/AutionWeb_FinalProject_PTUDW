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
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <div>Error...</div>}
      <div>
        <SearchBar />
        <h1 className="text-2xl font-bold p-4">Quản lý sản phẩm</h1>
        <div className="flex flex-row justify-between">
          <div className="w-0.7 h-2 mx-4">
            <main>{children}</main>
          </div>
          <div>{data && <ProductCategoryTable productCategories={data} />}</div>
        </div>
      </div>
    </div>
  );
}
