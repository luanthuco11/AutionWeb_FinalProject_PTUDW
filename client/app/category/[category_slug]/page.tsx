"use client"

import React from "react";
import { productCategories } from "@/app/page";
import CategoryTable from "@/components/CategoryTable";
import { useSearchParams } from "next/navigation";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort');

  return <div className="flex flex-row gap-10 p-5">
    <CategoryTable productCategories={productCategories}/>
    {sort && <p>{sort}</p>}
  </div>
}