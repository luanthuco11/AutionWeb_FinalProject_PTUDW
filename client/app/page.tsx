"use client";
import { SearchBar } from "@/components/SearchBar";
import { SearchItem } from "@/components/SearchBar";
import { ArrowRight } from "@/components/icons";
import Link from "next/link";
import { Product, ProductCategoryTree } from "../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import CategoryHook from "@/hooks/useCategory";
import { Pagination } from "../../shared/src/types/Pagination";
import AuctionHook from "@/hooks/useBid";
import { BidLog } from "../../shared/src/types";
import ProductHook from "@/hooks/useProduct";
import FavoriteHook from "@/hooks/useFavorite";

const mockProductEndTime: Product[] = [
  {
    id: 101,
    slug: "macbook-pro-2022",
    seller: {
      id: 2,
      name: "Trần B",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    category_id: 3,
    main_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    extra_images: [],
    name: "MacBook Pro 2022 – M1 Pro 16 inch",
    initial_price: 25000000,
    buy_now_price: 35000000,
    current_price: 28000000,
    top_bidder: {
      id: 5,
      name: "Lê C",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    bid_count: 12,
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // sau 4 giờ
    description:
      "MacBook Pro M1 Pro 16 inch, RAM 16GB, SSD 512GB, máy đẹp 99%.",
    auto_extend: true,
    price_increment: 500000,
    created_at: new Date(),
    updated_at: null,
  },
  {
    id: 102,
    slug: "macbook-pro-2022",
    seller: {
      id: 2,
      name: "Trần B",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    category_id: 3,
    main_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    extra_images: [],
    name: "MacBook Pro 2022 – M1 Pro 16 inch",
    initial_price: 25000000,
    buy_now_price: 35000000,
    current_price: 28000000,
    top_bidder: {
      id: 5,
      name: "Lê C",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    bid_count: 12,
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // sau 4 giờ
    description:
      "MacBook Pro M1 Pro 16 inch, RAM 16GB, SSD 512GB, máy đẹp 99%.",
    auto_extend: true,
    price_increment: 500000,
    created_at: new Date(),
    updated_at: null,
  },
  {
    id: 103,
    slug: "macbook-pro-2022",
    seller: {
      id: 2,
      name: "Trần B",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    category_id: 3,
    main_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    extra_images: [],
    name: "MacBook Pro 2022 – M1 Pro 16 inch",
    initial_price: 25000000,
    buy_now_price: 35000000,
    current_price: 28000000,
    top_bidder: {
      id: 5,
      name: "Lê C",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    bid_count: 12,
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // sau 4 giờ
    description:
      "MacBook Pro M1 Pro 16 inch, RAM 16GB, SSD 512GB, máy đẹp 99%.",
    auto_extend: true,
    price_increment: 500000,
    created_at: new Date(),
    updated_at: null,
  },
  {
    id: 104,
    slug: "macbook-pro-2022",
    seller: {
      id: 2,
      name: "Trần B",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    category_id: 3,
    main_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    extra_images: [],
    name: "MacBook Pro 2022 – M1 Pro 16 inch",
    initial_price: 25000000,
    buy_now_price: 35000000,
    current_price: 28000000,
    top_bidder: {
      id: 5,
      name: "Lê C",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    bid_count: 12,
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // sau 4 giờ
    description:
      "MacBook Pro M1 Pro 16 inch, RAM 16GB, SSD 512GB, máy đẹp 99%.",
    auto_extend: true,
    price_increment: 500000,
    created_at: new Date(),
    updated_at: null,
  },
  {
    id: 105,
    slug: "macbook-pro-2022",
    seller: {
      id: 2,
      name: "Trần B",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    category_id: 3,
    main_image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    extra_images: [],
    name: "MacBook Pro 2022 – M1 Pro 16 inch",
    initial_price: 25000000,
    buy_now_price: 35000000,
    current_price: 28000000,
    top_bidder: {
      id: 5,
      name: "Lê C",
      profile_img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s",
    },
    bid_count: 12,
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // sau 4 giờ
    description:
      "MacBook Pro M1 Pro 16 inch, RAM 16GB, SSD 512GB, máy đẹp 99%.",
    auto_extend: true,
    price_increment: 500000,
    created_at: new Date(),
    updated_at: null,
  }
];

interface PageItem {
  title: string;
  href?: string;
  products: Product[];
}

const pageItems: PageItem[] = [
  {
    title: "Sản phẩm sắp kết thúc",
    href: "/category",
    products: [],
  },
  {
    title: "Sản phẩm nhiều lượt đấu giá nhất",
    href: "/category",
    products: [],
  },
  {
    title: "Sản phẩm giá cao nhất",
    href: "/category",
    products: [],
  },
];

function Page() {
  // const { data: category, isLoading: loa } = CategoryHook.useCategories();
  // const {data, isLoading} = FavoriteHook.useFavorite();
  const { data, isLoading, error } = ProductHook.useGetProducts();

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error!</p>;

  if (isLoading) return <p>Loading...</p>;


  return (
    <>
      <div>
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
      </div>
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
