"use client";

import { FC, useState, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import { SearchIcon } from "../icons";

export interface SearchItem {
  id: string | number;
  title: string;
  image?: string;
  price?: string;
}

interface SearchBarProps {
  data: SearchItem[];
  placeHolder?: string;
  handleClick: (item: SearchItem | { query: string }) => void;
  handleEnter: (query: string) => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  data,
  placeHolder,
  handleClick,
  handleEnter,
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Lọc dữ liệu theo query
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEnter(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item: SearchItem | { query: string }) => {
    handleClick(item);
    setShowSuggestions(false);
    setQuery("");
  };

  return (
    <div className="relative w-full px-2">
      {/* Input + nút Search */}
      <div className="flex relative ">
        <button>
          <SearchIcon className="absolute top-[11px] l-1 w-5 h-5 left-[10px]" />
        </button>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeHolder || "Tìm kiếm sản phẩm ..."}
          className="flex-1 p-2 pl-10 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
        />
      </div>

      {/* Dropdown gợi ý */}
      {showSuggestions && query && (
        <ul className="z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredData.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSuggestionClick(item)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.image && (
                <div className="w-12 h-12 relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill // ảnh sẽ fill container div
                    className="rounded-sm object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium">{item.title}</span>
                {item.price && (
                  <span className="text-blue-600 text-sm font-medium">
                    {item.price} đ
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/*
flex-1: làm cho phần tử chiếm toàn bộ không gian còn lại trong container flex. (flex-1 = flex-grow: 1; flex-shrink: 1; flex-basis: 0%;)
*/




/*
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
*/
