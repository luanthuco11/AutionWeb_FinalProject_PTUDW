"use client";

import { useRouter } from "next/navigation";

interface BreadCrumpProps {
  category_name: string;
  category_slug: string;
  product_name: string;
}

const BreadCrump = ({
  category_name,
  category_slug,
  product_name,
}: BreadCrumpProps) => {
  const router = useRouter();

  const handleClickHome = () => {
    router.push("/");
  };

  const handleClickCategory = (category_slug: string) => {
    router.push(`/category/${category_slug}`);
  };

  return (
    <div>
      <span
        className="text-sm text-teal-900 hover:text-teal-600 cursor-pointer mr-2"
        onClick={handleClickHome}
      >
        Trang chủ
      </span>
      <span className="text-sm text-slate-900">/</span>
      <span
        className="text-sm text-teal-900 hover:text-teal-600 cursor-pointer mx-2"
        onClick={() => handleClickCategory(category_slug)}
      >
        {category_name}
      </span>
      <span className="text-sm text-slate-900">/</span>
      <span className="text-sm text-slate-900 ml-2">{product_name}</span>
    </div>
  );
};

export default BreadCrump;
