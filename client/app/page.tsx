"use client"

import React from 'react'
import { useEffect, useState } from 'react'
import BiddingProduct from '@/components/ui/BiddingProducts';
import SoldProduct from '@/components/ui/SoldProducts';

function page() {
  const [message, setMessage] = useState("Loading");

  useEffect(() => {
    fetch("http://localhost:8080/").then(
      response => response.json()
    ).then(
      data => {
        console.log(data);
        setMessage(data.message);
      }
    )
  }, [])
  return (
    <div>
      {message}
      
    </div>
  )
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

