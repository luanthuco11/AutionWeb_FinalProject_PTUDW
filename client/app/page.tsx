"use client";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { LoveIcon } from "@/components/icons";
import { SearchBar } from "@/components/SearchBar";
import { SearchItem } from "@/components/SearchBar";
const sampleData: SearchItem[] = [
  { id: 1, title: "Apple", image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000", price: "Fresh fruit" },
  { id: 2, title: "Banana", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s" },
  { id: 3, title: "Orange", image: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/14235/production/_100058428_mediaitem100058424.jpg", price: "Vitamin C" },
  { id: 4, title: "Apple", image: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000", price: "Fresh fruit" },
  { id: 5, title: "Banana", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s" },
  { id: 6, title: "Orange", image: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/14235/production/_100058428_mediaitem100058424.jpg", price: "Vitamin C" },
];

function Page() {
  return (
    <>
      <SearchBar
        data={sampleData}
        handleClick={(item) => console.log("Clicked item:", item)}
        handleEnter={(query) => console.log("Enter search:", query)}
      />
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
