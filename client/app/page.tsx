"use client"

import ProductCard from '@/components/ProductCard';
import React from 'react'
import { useEffect, useState } from 'react'

function page() {
  return <div className="flex flex-row flex-wrap p-4 gap-2">
    <ProductCard />
    <ProductCard />
    <ProductCard />
    <ProductCard />
    <ProductCard />
  </div>
}

export default page;
// "/category/[:...category_slugs]/product/[:product_slug]"
// "/user/info"
// "/user/rating"
// "/user/favourite_products"
// "/user/bidding_products"
// "/user/winning_products"
// "/user/seller_role"
// "/user/selling_products"
// "/user/sold_products"

