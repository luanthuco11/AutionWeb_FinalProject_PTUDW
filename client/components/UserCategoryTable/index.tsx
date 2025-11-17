"use client";

import Link from "next/link";
import { FC, SVGProps, useState } from "react";
import RenderIcon from "../RenderIcon";
export interface UserCategory {
  id: number;
  name: string;
  slug: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}

export default function UserCategoryTable({
  userCategories,
}: {
  userCategories: UserCategory[];
}) {
  const [idCurrent, setIdCurrent] = useState<number | null>(null);
  const handleClick = (id: number) => {
    setIdCurrent(id);
  };
  return (
    <div className="relative w-60 h-125 flex flex-col bg-white border-2 border-gray-200 rounded-xl py-4 pl-4 pr-2 shadow-sm">
      <p className="text-xl font-medium">Hồ sơ</p>
      <div className="grow overflow-y-auto minimal-scrollbar">
        {userCategories.map((item, index) => {
          const isActive: boolean = item.id === idCurrent;
          return (
            <ul key={index}>
              <Link href={`/user/${item.slug}`} prefetch>
                <button
                  onClick={() => handleClick(item.id)}
                  className={` w-full px-[5px] py-2.5 flex flex-row items-center gap-2 mt-1 font-medium  rounded-lg ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-100  hover:text-blue-500"
                  }`}
                >
                  <RenderIcon icon={item.icon} />
                  {item.name}
                </button>
              </Link>
            </ul>
          );
        })}
      </div>
    </div>
  );
}
