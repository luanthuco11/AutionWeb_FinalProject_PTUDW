"use client"

import React from "react";
import { ProductCategoryTree } from "@/types";
import CategoryTable from "@/components/CategoryTable"

// Mock Data
export const productCategories: ProductCategoryTree[] = [{
  id: 1,
  slug: "điện-tử",
  name: "Điện tử",
  children: [
    {
      id: 11,
      slug: "điện-thoại-di-động",
      name: "Điện thoại di động",
      parent_id: 1,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    },
    {
      id: 12,
      slug: "máy-tính-xách-tay",
      name: "Máy tính xách tay",
      parent_id: 1,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    },
    {
      id: 13,
      slug: "máy-tính-bảng",
      name: "Máy tính bảng",
      parent_id: 1,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    }
  ],
  created_at: new Date("2025-11-10T10:00:00Z"),
  updated_at: null
}, {
  id: 2,
  slug: "thời-trang",
  name: "Thời trang",
  children: [
    {
      id: 21,
      slug: "giày",
      name: "Giày",
      parent_id: 2,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    },
    {
      id: 22,
      slug: "đồng-hồ",
      name: "Đồng hồ",
      parent_id: 2,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    },
    {
      id: 23,
      slug: "quần-áo",
      name: "Quần áo",
      parent_id: 2,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    }
  ],
  created_at: new Date("2025-11-10T10:00:00Z"),
  updated_at: null
}, {
  id: 3,
  slug: "nhà-gia-đình",
  name: "Nhà & Gia đình",
  children: [
    {
      id: 31,
      slug: "nội-thất",
      name: "Nội thất",
      parent_id: 3,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    },
    {
      id: 32,
      slug: "trang-trí",
      name: "Trang trí",
      parent_id: 3,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    }
  ],
  created_at: new Date("2025-11-10T10:00:00Z"),
  updated_at: null
}, {
  id: 4,
  slug: "sưu-tầm",
  name: "Sưu tầm",
  children: [
    {
      id: 41,
      slug: "đồ-cổ",
      name: "Đồ cổ",
      parent_id: 4,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    },
    {
      id: 42,
      slug: "nghệ-thuật",
      name: "Nghệ thuật",
      parent_id: 4,
      created_at: new Date("2025-11-10T10:00:00Z"),
      updated_at: null
    }
  ],
  created_at: new Date("2025-11-10T10:00:00Z"),
  updated_at: null
}]

export default function page() {
  return <div>
    <div className="flex flex-row gap-10 p-5">
      <CategoryTable productCategories={productCategories} />
    </div>
  </div>
}

