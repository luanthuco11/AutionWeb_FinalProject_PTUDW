import React from "react";
import Link from "next/link";
type EmptyListProps = {
  content: string;
};
const EmptyList = ({ content }: EmptyListProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center">
      <div className="bg-slate-100 p-4 md:p-6 rounded-full mb-4 md:mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 md:w-16 md:h-16 text-slate-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15.5A2.25 2.25 0 0021.75 18v-4.162c0-1.242-1.008-2.25-2.25-2.25H15.75a2.25 2.25 0 01-2.012-1.244l-.257-.513a2.25 2.25 0 00-2.013-1.244H8.518a2.25 2.25 0 00-2.013 1.244l-.256.513A2.25 2.25 0 014.25 11.25H2.25A2.25 2.25 0 000 13.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg md:text-xl font-medium text-slate-900 mb-2">
        Danh sách trống
      </h3>
      <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 max-w-xs md:max-w-sm">
        {content}
      </p>
      <Link
        href="/"
        className="px-5 py-2 md:px-6 md:py-2.5 bg-primary text-white text-sm md:text-base font-medium rounded-lg hover:bg-primary/90 transition-colors"
      >
        Khám phá sản phẩm
      </Link>
    </div>
  );
};

export default EmptyList;
/*
 Bạn hiện không tham gia đấu giá sản phẩm nào. Hãy tìm kiếm những
                món đồ ưng ý và bắt đầu ra giá nhé!
*/