"use client";
import { ArrowRight } from "@/components/icons";
import Link from "next/link";
import { ProductPreview } from "../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PageItem {
  title: string;
  href?: string;
  products: ProductPreview[];
}

function Page() {
  const {
    data: productTop,
    isLoading: isLoadingTopPriceProduct,
    error: errorTopPriceProduct,
  } = ProductHook.useGetTopPriceProduct();

  if (isLoadingTopPriceProduct)
    return (
      <>
        <LoadingSpinner />
      </>
    );
  if (errorTopPriceProduct) {
    return <>{errorTopPriceProduct.message};</>;
  }

  console.log(productTop);

  // const pageItems: PageItem[] = [
  //   {
  //     title: "Sản phẩm sắp kết thúc",
  //     href: "/top_end_product",
  //     products: productTop.topEndingSoonProducts,
  //   },
  //   {
  //     title: "Sản phẩm nhiều lượt đấu giá nhất",
  //     href: "/top_bid_product",
  //     products: productTop.topBiddingProducts,
  //   },
  //   {
  //     title: "Sản phẩm giá cao nhất",
  //     href: "/top_price_product",
  //     products: productTop.topPriceProducts,
  //   },
  // ];

  return (
    <>
      {/* <div>
        <div className="text-center w-full">
          <h1 className="text-4xl">Chào mừng đến AuctionHub</h1>
          <div className="mt-2 text-gray-500">
            Tìm kiếm và đấu giá hàng triệu sản phẩm từ những người bán uy tín
          </div>
        </div>
        {pageItems.map((item, index) => {
          return (
            <div key={index}>
              <div className="mt-15">
                <div className="flex justify-between font-medium">
                  <div className=" text-2xl">{item.title}</div>
                  <Link
                    href={item.href || "/"}
                    className="text-blue-500 flex items-center  gap-2"
                  >
                    <div className="text-[15px]">Xem tất cả</div>
                    <ArrowRight className="w-5 h-5 mt-0.5" />
                  </Link>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-3">
                {item.products.map((item, index) => {
                  return (
                    <div key={index} className="mt-3">
                      <ProductCard key={index} product={item} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div> */}
      <div>Tri</div>
    </>
  );
}
export default Page;
// "/category/[:...category_slugs]/product/[:product_slug]"
// "/user/info"
// "/user/rating"
// "/user/favourite_products"
// "/user/bidding_products"
// "/user/winning_products"
// "/user/seller_role"
// "/user/selling_products"
// "/user/sold_products"
