"use client";

import { ProductCategoryTree } from "../../../shared/src/types/index";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import "flowbite";

function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort");

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="pr-2">
      <select
        className="mt-2 border border-gray-300 rounded-sm text-sm w-full py-1.5 bg-white hover:border-blue-500 transition-all"
        defaultValue={currentSort || "ascending-price"}
        onChange={(e) => handleSort(e.target.value)}
      >
        <option value="ascending-price">Giá tăng dần</option>
        <option value="descending-price">Giá giảm dần</option>
        <option value="expiring-soon">Sắp kết thúc</option>
      </select>
    </div>
  );
}

export default function ProductCategoryTable({
  productCategories,
}: {
  productCategories: ProductCategoryTree[];
}) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const sort = useSearchParams().get("sort");
  const isInCategoryPage: boolean = usePathname().startsWith("/category/");

  const router = useRouter();
  const toggleCategory = (category_id: number) => {
    setExpandedCategories((prevCategories) => {
      const newCategories = new Set(prevCategories);
      if (!newCategories.has(category_id)) {
        newCategories.add(category_id);
      } else {
        newCategories.delete(category_id);
      }

      return newCategories;
    });
  };

  return (
    <div className=" w-60 h-120 flex flex-col bg-white border-2 border-gray-200 rounded-xl py-4 pl-4 pr-2 shadow-sm">
      {isInCategoryPage && (
        <div className="mb-5">
          <p className="text-xl font-medium">Sắp xếp sản phẩm</p>
          <SortDropdown />
        </div>
      )}
      <div>
        <p className="text-xl font-medium">Danh mục</p>
      </div>
      <div className="grow overflow-y-auto minimal-scrollbar">
        {productCategories.map((item) => {
          const isExpanded =
            expandedCategories.has(item.id) &&
            item.children &&
            item.children.length > 0;
          return (
            <ul key={item.id}>
              <div className="flex flex-row items-center gap-2 mt-3 font-medium hover:text-blue-500 transition-all duration-200 select-none">
                <svg
                  className="w-2.5 h-2.5 cursor-pointer transition-all duration-200"
                  onClick={() => toggleCategory(item.id)}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                  style={{ transform: isExpanded ? "none" : "rotate(-90deg)" }}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
                <p className="select-none">{item.name}</p>
              </div>
              {isExpanded && (
                <div className="relative pl-6">
                  {/* Đường thẳng đứng */}
                  <div
                    className="absolute -left-1 top-0"
                    style={{
                      width: "16px",
                      height: `calc(100% - 13px)`,
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      className="mx-auto bg-gray-300"
                      style={{
                        width: "2px",
                        height: "100%",
                        borderRadius: "1px",
                      }}
                    ></div>
                  </div>
                  <ul className="">
                    {item.children?.map((child) => (
                      <li
                        key={child.id}
                        className="relative flex items-center min-h-7"
                      >
                        {/* Đường ngang từ dọc sang chữ */}
                        <span
                          className="absolute -left-5 bg-gray-300"
                          style={{
                            top: "50%",
                            width: "27px",
                            height: "2px",
                            transform: "translateY(-50%)",
                          }}
                        ></span>
                        <Link
                          href={`/product/category/${child.slug}`}
                          className="ml-4 select-none hover:text-blue-500 transition:all duration-200"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
