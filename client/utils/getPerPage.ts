import { useState, useEffect } from "react";
export const usePerPage = () => {
  // Mặc định là số lượng cho mobile (để tối ưu tốc độ load đầu) hoặc desktop tùy bạn
  const [perPage, setPerPage] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      // Logic giống breakpoint của Tailwind
      // sm: 640px, md: 768px, lg: 1024px, xl: 1280px
      if (window.innerWidth >= 1280) {
        setPerPage(15);
      } else if (window.innerWidth >= 1024) {
        setPerPage(12);
      } else if (window.innerWidth >= 768) {
        setPerPage(9);
      } else if (window.innerWidth >= 640) {
        setPerPage(6);
      } else {
        setPerPage(5);
      }
    };

    // Gọi 1 lần khi component mount
    handleResize();

    // Lắng nghe sự kiện resize
    window.addEventListener("resize", handleResize);

    // Cleanup khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return perPage;
};
