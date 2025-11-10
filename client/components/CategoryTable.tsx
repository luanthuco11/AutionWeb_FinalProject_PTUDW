"use client"

import { ProductCategoryTree } from "@/types";
import React, { useState } from "react";

export default function CategoryTable({ productCategories }: { productCategories: ProductCategoryTree[] }) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (category_id: number) => {
    setExpandedCategories(prevCategories => {
      const newCategories = new Set(prevCategories);
      if (!newCategories.has(category_id)) {
        newCategories.add(category_id);
      } else {
        newCategories.delete(category_id);
      }

      return newCategories;
    })
  }

  return (
    <div className="w-60 h-120 bg-white border-2 border-gray-400 rounded-xl p-4">
      <p className="text-xl">Danh mục</p>
      {productCategories.map((item) => {
        const isExpanded = expandedCategories.has(item.id) && item.children && item.children.length > 0;
        return (
          <ul key={item.id}>
            <div className="flex flex-row items-center gap-2 mt-2">
              <svg
                className="w-2.5 h-2.5 cursor-pointer"
                onClick={() => toggleCategory(item.id)}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
                style={{ transform: isExpanded ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }}
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
              <span>{item.name}</span>
            </div>
            {isExpanded && (
              <div className="relative pl-6">
                {/* Đường thẳng đứng */}
                <div
                  className="absolute -left-1 top-0"
                  style={{
                    width: "16px",
                    height: `calc(100% - 4px)`,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className="mx-auto bg-gray-400"
                    style={{
                      width: "2px",
                      height: "100%",
                      borderRadius: "1px",
                    }}
                  ></div>
                </div>
                <ul className="">
                  {item.children?.map((child, idx) => (
                    <li key={child.id} className="relative flex items-center min-h-[28px]">
                      {/* Đường ngang từ dọc sang chữ */}
                      <span
                        className="absolute -left-5"
                        style={{
                          top: "50%",
                          width: "30px",
                          height: "2px",
                          background: "#9ca3af",
                          transform: "translateY(-50%)"
                        }}
                      ></span>
                      <span className="ml-4">{child.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ul>
        );
      })}
    </div>
  );
}