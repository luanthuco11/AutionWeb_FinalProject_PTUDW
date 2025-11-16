import ProductCard from '@/components/ProductCard'
import React from 'react'
import { Product } from '../../../../shared/src/types';

export const mockProducts: Product[] = [
  {
    id: 1,
    slug: "dong-ho-rolex-day-kim-loai",
    seller: {
      id: 10,
      name: "Nguyễn Văn A",
      profile_img: "https://ui-avatars.com/api/?name=Nguyen+Van+A",
    },
    category_id: 1,
    main_image: "https://picsum.photos/seed/rolex/600/400",
    extra_images: [
      "https://picsum.photos/seed/rolex1/600/400",
      "https://picsum.photos/seed/rolex2/600/400",
    ],
    name: "Đồng hồ Rolex Day-Date 40mm",
    initial_price: 150000000,
    buy_now_price: 200000000,
    current_price: 155000000,
    top_bidder: {
      id: 22,
      name: "Trần Minh",
      profile_img: "https://ui-avatars.com/api/?name=Tran+Minh",
    },
    bid_count: 12,
    end_time: new Date("2025-12-20T15:30:00"),
    description: "Rolex Day-Date 40mm dây vàng khối, tình trạng 99%, fullbox.",
    auto_extend: true,
    price_increment: 2000000,
    created_at: new Date("2025-10-10T13:20:00"),
    updated_at: new Date("2025-11-01T09:15:00"),
  },

  {
    id: 2,
    slug: "macbook-pro-m3-2025",
    seller: {
      id: 11,
      name: "Trần Quốc Bảo",
      profile_img: "https://ui-avatars.com/api/?name=Tran+Quoc+Bao",
    },
    category_id: 2,
    main_image: "https://picsum.photos/seed/macbook/600/400",
    extra_images: ["https://picsum.photos/seed/macbook1/600/400"],
    name: "MacBook Pro M3 Max 2025 – 32GB / 1TB",
    initial_price: 45000000,
    buy_now_price: 55000000,
    current_price: 46800000,
    top_bidder: null,
    bid_count: 0,
    end_time: new Date("2025-12-28T20:00:00"),
    description:
      "MacBook Pro M3 Max mới 98%, hiệu năng cực mạnh, phù hợp editor.",
    auto_extend: false,
    price_increment: 500000,
    created_at: new Date("2025-11-05T08:30:00"),
    updated_at: null,
  },

  {
    id: 3,
    slug: "giay-jordan-1-lost-and-found",
    seller: {
      id: 15,
      name: "Phạm Hoàng Long",
      profile_img: "https://ui-avatars.com/api/?name=Pham+Hoang+Long",
    },
    category_id: 3,
    main_image: "https://picsum.photos/seed/jordan/600/400",
    extra_images: [
      "https://picsum.photos/seed/jordan1/600/400",
      "https://picsum.photos/seed/jordan2/600/400",
    ],
    name: "Jordan 1 Retro High OG - Lost & Found",
    initial_price: 8000000,
    buy_now_price: 11000000,
    current_price: 9000000,
    top_bidder: {
      id: 24,
      name: "Lê Thanh",
      profile_img: "https://ui-avatars.com/api/?name=Le+Thanh",
    },
    bid_count: 5,
    end_time: new Date("2025-12-25T18:45:00"),
    description: "Jordan 1 Lost & Found size 42, hàng chính hãng 100%.",
    auto_extend: true,
    price_increment: 200000,
    created_at: new Date("2025-10-30T11:00:00"),
    updated_at: new Date("2025-11-10T12:00:00"),
  },

  {
    id: 4,
    slug: "camera-sony-a7m4-body",
    seller: {
      id: 12,
      name: "Hoàng Gia Minh",
      profile_img: "https://ui-avatars.com/api/?name=Hoang+Gia+Minh",
    },
    category_id: 4,
    main_image: "https://picsum.photos/seed/sony/600/400",
    extra_images: [],
    name: "Sony A7 Mark IV (Body)",
    initial_price: 30000000,
    buy_now_price: 38000000,
    current_price: 31500000,
    top_bidder: null,
    bid_count: 2,
    end_time: new Date("2025-12-22T19:00:00"),
    description: "Sony A7M4 body đẹp 97%, chụp 25k shots.",
    auto_extend: true,
    price_increment: 1000000,
    created_at: new Date("2025-10-18T14:30:00"),
    updated_at: null,
  },

  {
    id: 5,
    slug: "lego-star-wars-millennium-falcon",
    seller: {
      id: 14,
      name: "Đỗ Hải Phong",
      profile_img: "https://ui-avatars.com/api/?name=Do+Hai+Phong",
    },
    category_id: 5,
    main_image: "https://picsum.photos/seed/lego/600/400",
    extra_images: ["https://picsum.photos/seed/lego1/600/400"],
    name: "LEGO Star Wars – Millennium Falcon (Ultimate Edition)",
    initial_price: 16000000,
    buy_now_price: 20000000,
    current_price: 16800000,
    top_bidder: {
      id: 33,
      name: "Ngô Nhật",
      profile_img: "https://ui-avatars.com/api/?name=Ngo+Nhat",
    },
    bid_count: 8,
    end_time: new Date("2025-12-30T21:30:00"),
    description: "Bản LEGO Millennium Falcon cực lớn, hơn 7,500 chi tiết.",
    auto_extend: false,
    price_increment: 300000,
    created_at: new Date("2025-11-02T10:00:00"),
    updated_at: new Date("2025-11-12T16:00:00"),
  },
];

const RatingPage = () => {
  return <div className="flex flex-row gap-2">
    {mockProducts.map(product => <ProductCard key={product.slug} product={product}/>)}
  </div>
}

export default RatingPage