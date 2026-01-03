// "use client";

// import React, { useEffect, useState } from "react";
// import FavoriteButton from "../FavoriteButton";
// import { ProductPreview } from "../../../shared/src/types";
// import { getTimeDifference } from "@/utils";
// import Link from "next/link";
// import Image from "next/image";
// import FavoriteHook from "@/hooks/useFavorite";
// import LoadingSpinner from "../LoadingSpinner";
// import { formatCurrency } from "@/app/(MainLayout)/product/[product_slug]/components/Question";
// import SystemHook from "@/hooks/useSystem";

// const defaultImage =
//   "https://img.freepik.com/premium-photo/white-colors-podium-abstract-background-minimal-geometric-shape-3d-rendering_48946-113.jpg?semt=ais_hybrid&w=740&q=80";

// export default function ProductCard({
//   product,
//   isFavorite = false,
// }: {
//   product: ProductPreview;
//   isFavorite: boolean;
// }) {
//   const { mutate: addFavorite, isPending: isAdding } =
//     FavoriteHook.useAddFavorite();
//   const { mutate: removeFavorite, isPending: isRemoving } =
//     FavoriteHook.useRemoveFavorite();

//   const [isHighlight, setIsHighlight] = useState<boolean>(false);
//   /// Min Time
//   const {
//     data: serverMinTime,
//     isLoading: isLoadingMinTime,
//     isError: isErrorMinTime,
//   } = SystemHook.useGetProductMinTime();
//   let minTime;
//   useEffect(() => {
//     if (serverMinTime) {
//       minTime = serverMinTime[0].new_product_min_time;

//       const nowTime = new Date();
//       const createProductTime = new Date(product.created_at);

//       const diffM = (nowTime.getTime() - createProductTime.getTime()) / 60000;
//       if (diffM <= minTime) {
//         setIsHighlight(true);
//       } else {
//         setIsHighlight(false);
//       }
//     }
//   }, [serverMinTime]);
//   ///
//   const handleFavorite = (productId: number, isFavorite: boolean) => {
//     try {
//       if (isFavorite) {
//         addFavorite({ productId: productId });
//       } else {
//         removeFavorite({ productId: productId });
//       }
//     } catch (e) {
//       console.error("Fail to adding or removing favorite products", e);
//     }
//   };

//   return (
//     <div
//       className={`border-2 relative  rounded-lg shadow-md hover:shadow-2xl  hover:border-blue-500  ${
//         isHighlight ? " border-red-500" : "  border-gray-200"
//       }`}
//     >
//       <div className={`${isHighlight ? "absolute z-10 right-1.5" : "hidden"} `}>
//         <svg
//           className="w-6 h-6 text-red-500 dark:text-white"
//           aria-hidden="true"
//           xmlns="http://www.w3.org/2000/svg"
//           width={24}
//           height={24}
//           fill="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z" />
//         </svg>
//       </div>
//       <div className="group relative w-full h-fit pb-3 rounded-lg bg-white transition-all duration-200 select-none">
//         <Image
//           src={product.main_image || defaultImage}
//           width={50}
//           height={123}
//           alt={product.name}
//           className="w-full aspect-5/4 rounded-t-md"
//         />
//         <Link href={`/product/${product.slug}`} className="block px-3">
//           <section className="mt-2">
//             <div className="h-18">
//               <p className="font-medium max-h-12 line-clamp-2">
//                 {product.name}
//               </p>
//               <div className="mt-1 flex flex-row gap-1">
//                 <svg
//                   className="w-6 h-6 text-red-500 dark:text-white"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width={24}
//                   height={24}
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z" />
//                 </svg>

//                 <span>{product.bid_count} lượt đấu giá</span>
//               </div>
//             </div>
//             <div className="mt-3">
//               <p className="text-sm">Giá hiện tại</p>
//               <p>
//                 <span className="text-2xl font-medium text-blue-600">
//                   {formatCurrency(product.current_price)}
//                 </span>
//               </p>
//             </div>
//             <div className="mt-1">
//               <p className="text-sm">Giá mua ngay</p>
//               <p>
//                 <span className="text-xl font-medium text-red-500">
//                   {product.buy_now_price
//                     ? formatCurrency(product.buy_now_price)
//                     : "---"}
//                 </span>
//               </p>
//             </div>

//             <div className="mt-3 h-10">
//               {product.top_bidder_name ? (
//                 <div>
//                   <p className="text-sm">Người trả giá cao nhất</p>
//                   <p className="font-medium">
//                     {product.top_bidder_name[0]}***
//                     {
//                       product.top_bidder_name[
//                         product.top_bidder_name.length - 1
//                       ]
//                     }
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-sm text-gray-800">Chưa có lượt trả giá</p>
//                 </div>
//               )}
//             </div>
//           </section>
//           <hr className="border-t border-solid border-gray-300 mt-3 mb-1.5" />
//           <section className="flex flex-col gap-1.5">
//             <p className="text-sm text-gray-500">
//               Ngày bắt đầu:{" "}
//               {new Date(product.created_at).toLocaleDateString("en-GB")}
//             </p>
//             <div className="flex flex-row gap-2 items-center">
//               <svg
//                 className="w-6 h-6 text-gray-800 dark:text-white"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 width={24}
//                 height={24}
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                 />
//               </svg>
//               <span>
//                 {getTimeDifference(new Date(), new Date(product.end_time))}
//               </span>
//             </div>
//           </section>
//         </Link>

//         {/* Favourite Button */}
//         <div
//           className={`absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
//             (isAdding || isRemoving) && "pointer-events-none"
//           }`}
//         >
//           <FavoriteButton
//             isFavorite={isFavorite}
//             onClick={() => handleFavorite(product.id, !isFavorite)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductPreview } from "../../../shared/src/types";
import { getTimeDifference } from "@/utils";
import FavoriteHook from "@/hooks/useFavorite";
import SystemHook from "@/hooks/useSystem";
import { formatCurrency } from "@/app/(MainLayout)/product/[product_slug]/components/Question";
import FavoriteButton from "../FavoriteButton";

// --- Icons Components (Tách ra cho gọn) ---
const FireIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const DEFAULT_IMAGE =
  "https://img.freepik.com/premium-photo/white-colors-podium-abstract-background-minimal-geometric-shape-3d-rendering_48946-113.jpg?semt=ais_hybrid&w=740&q=80";

interface ProductCardProps {
  product: ProductPreview;
  isFavorite: boolean;
}

export default function ProductCard({
  product,
  isFavorite = false,
}: ProductCardProps) {
  console.log(product.id, isFavorite);
  // --- Hooks ---
  const { mutate: addFavorite, isPending: isAdding } =
    FavoriteHook.useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } =
    FavoriteHook.useRemoveFavorite();

  // Lấy dữ liệu cấu hình hệ thống
  const { data: serverMinTime } = SystemHook.useGetProductMinTime();

  // --- Logic: Tính toán sản phẩm mới (Highlight) ---
  // Sử dụng useMemo thay vì useEffect để tránh re-render không cần thiết
  const isHighlight = useMemo(() => {
    if (!serverMinTime || serverMinTime.length === 0) return false;

    const minTimeConfig = serverMinTime[0].new_product_min_time;
    const nowTime = new Date().getTime();
    const createProductTime = new Date(product.created_at).getTime();
    const diffMinutes = (nowTime - createProductTime) / 60000;

    return diffMinutes <= minTimeConfig;
  }, [serverMinTime, product.created_at]);

  // --- Handlers ---
  const handleFavorite = (
    e: React.MouseEvent,
    productId: number,
    currentStatus: boolean
  ) => {
    e.preventDefault(); // Ngăn chặn sự kiện click lan ra thẻ Link cha (nếu có)
    e.stopPropagation();

    if (currentStatus) {
      removeFavorite({ productId });
    } else {
      addFavorite({ productId });
    }
  };

  const isLoadingFavorite = isAdding || isRemoving;

  return (
    <div
      className={`relative group rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border-2 bg-white
        ${
          isHighlight
            ? "border-red-500/70"
            : "border-gray-200 hover:border-blue-400"
        }
      `}
    >
      {/* Badge Highlight */}
      {isHighlight && (
        <div className="absolute z-20 -right-2 -top-2 bg-white rounded-full p-1 shadow-sm border border-red-100">
          <FireIcon className="w-6 h-6 text-red-500 animate-pulse" />
        </div>
      )}

      {/* Main Link Wrapper: Bao bọc cả ảnh và nội dung để tăng vùng click */}
      <Link
        href={`/product/${product.slug}`}
        className="block h-full flex flex-col"
      >
        {/* Image Section */}
        <div className="relative w-full aspect-[5/4] overflow-hidden rounded-t-lg bg-gray-100">
          <Image
            src={product.main_image || DEFAULT_IMAGE}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-1 justify-between">
          <div>
            {/* Title & Bids */}
            <div className="mb-2">
              <h3
                className="font-semibold text-gray-800 line-clamp-2 h-12 leading-6"
                title={product.name}
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-xs font-medium text-gray-500">
                <FireIcon className="w-4 h-4 text-orange-500" />
                <span>{product.bid_count} lượt đấu giá</span>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="space-y-1 bg-gray-50 p-2 rounded-md">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Giá hiện tại</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(product.current_price)}
                </span>
              </div>

              <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-1">
                <span className="text-xs text-gray-500">Mua ngay</span>
                <span className="text-sm font-semibold text-red-500">
                  {product.buy_now_price
                    ? formatCurrency(product.buy_now_price)
                    : "---"}
                </span>
              </div>
            </div>

            {/* Top Bidder */}
            <div className="mt-3 text-sm">
              <p className="text-xs text-gray-500 mb-0.5">
                Người trả cao nhất:
              </p>
              {product.top_bidder_name ? (
                <p className="font-medium text-gray-700 truncate">
                  {product.top_bidder_name[0]}***
                  {product.top_bidder_name.slice(-1)}
                </p>
              ) : (
                <p className="text-gray-400 italic text-xs">
                  Chưa có lượt trả giá
                </p>
              )}
            </div>
          </div>

          {/* Footer: Date & Time */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col gap-2">
            {/* Dòng 1: Ngày đăng (Màu nhạt, chữ nhỏ) */}
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <span>Ngày đăng:</span>
              <span className="font-medium text-gray-600">
                {new Date(product.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>

            {/* Dòng 2: Đếm ngược (Nổi bật, full width hoặc badge to) */}
            <div className="flex items-center justify-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md text-xs font-semibold">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>
                {getTimeDifference(new Date(), new Date(product.end_time))}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite Button (Absolute Position) */}
      <div className="absolute top-2 left-2 z-20">
        <div
          className={`
            transition-all duration-200 
            ${isLoadingFavorite ? "opacity-50 cursor-wait" : "cursor-pointer"}
            ${isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
          `}
          onClick={(e) =>
            !isLoadingFavorite && handleFavorite(e, product.id, isFavorite)
          }
        >
          {/* Truyền props vào FavoriteButton của bạn, bọc div bên ngoài để xử lý sự kiện click */}
          <FavoriteButton
            isFavorite={isFavorite}
            // Tắt onClick mặc định của component con để xử lý ở div cha cho an toàn
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
