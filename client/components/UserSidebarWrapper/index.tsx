// components/UserSidebarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { ProductCategoryTree } from "../../../shared/src/types";
import ProductCategoryTable from "@/components/ProductCategoryTable";
import UserCategoryTable from "@/components/UserCategoryTable";
import { userCategories } from "@/app/const";

const productCategories: ProductCategoryTree[] = [
  /* dữ liệu cũ productCategories của bạn */
];

export default function UserSidebarWrapper() {
  const pathname = usePathname();
  const isUserRoute = pathname.startsWith("/user");

  return isUserRoute ? (
    <UserCategoryTable userCategories={userCategories} />
  ) : (
    <ProductCategoryTable productCategories={productCategories} />
  );
}
