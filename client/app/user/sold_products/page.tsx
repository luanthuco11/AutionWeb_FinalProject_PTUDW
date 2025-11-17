"use client"

import SoldProduct from '@/components/SoldProduct'
import ProductType from "@/types/product"
import { useState } from "react"

const mockProducts = [
  {
    id: 1,
    name: "Patek Philippe Nautilus - Rose Gold",
    main_image: "https://binhminhdigital.com/storedata/images/product/camera/fujifilm/may-anh-fujifilm-instax-mini-12-blossom-pink-chinh-hang.jpg",
    intial_price: "91.000.000",
    closing_price: "91.000.000",
    buyer_name: "Đỗ Văn Hà",
  },
  {
    id: 2,
    name: "Rolex Datejust - Stainless Steel",
    main_image: "https://binhminhdigital.com/storedata/images/product/camera/fujifilm/may-anh-fujifilm-instax-mini-12-blossom-pink-chinh-hang.jpg",
    intial_price: "52.000.000",
    closing_price: "91.000.000",
    buyer_name: "Huỳnh Gia Âu",
  },
  {
    id: 3,
    name: "Vintage Omega Seamaster 300",
    main_image: "https://binhminhdigital.com/storedata/images/product/camera/fujifilm/may-anh-fujifilm-instax-mini-12-blossom-pink-chinh-hang.jpg",
    intial_price: "42.000.000",
    closing_price: "91.000.000",
    buyer_name: "Nguyễn Minh Luân",
  },
  {
    id: 4,
    name: "MacBook Pro 16 inch M3 Max",
    main_image: "https://binhminhdigital.com/storedata/images/product/camera/fujifilm/may-anh-fujifilm-instax-mini-12-blossom-pink-chinh-hang.jpg",
    intial_price: "37.500.000",
    closing_price: "91.000.000",
    buyer_name: "Đỗ Nguyễn Minh Trí",
  },
  {
    id: 5,
    name: "Canon EOS R5 - Mirrorless Camera",
    main_image: "https://binhminhdigital.com/storedata/images/product/camera/fujifilm/may-anh-fujifilm-instax-mini-12-blossom-pink-chinh-hang.jpg",
    intial_price: "28.500.000",
    closing_price: "91.000.000",
    buyer_name: "no one know",
  },
];

for (let i = 6; i <= 30; i++) {
  mockProducts.push({
    id: i,
    name: `Sản phẩm đấu giá #${i}`,
    main_image: "https://binhminhdigital.com/storedata/images/product/camera/fujifilm/may-anh-fujifilm-instax-mini-12-blossom-pink-chinh-hang.jpg",
    intial_price: `${10_000_000 + i * 100_000} `,
    closing_price: `${10_000_000 + i * 100_000} `,
    buyer_name: "Fuck bitch"
  });
}

const SoldProductPage = () => {
    const [soldProduct, setSoldProduct] = useState<ProductType.SoldProduct[]>(mockProducts)
    
    return (
        <div className='bg-card shadow-sm rounded-lg p-8'>
            <div className="text-3xl text-[#1e293b] font-semibold mb-7">
                Sản phẩm đã bán
            </div>
            <div className="flex flex-col gap-5">
                {soldProduct.map((bP, index) => (
                    <SoldProduct key={index} product={bP}/>
                ))}
            </div>
        </div>
    )
}

export default SoldProductPage