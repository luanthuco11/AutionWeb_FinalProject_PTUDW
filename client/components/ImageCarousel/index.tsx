"use client";

import { useState } from "react";
import Image from "next/image";
import { defaultImage } from "@/app/const";
import { ChevronLeft, ChevronRight, X } from "lucide-react"; // Sử dụng Lucide cho icon đẹp hơn

interface ImageProps {
  images: string[];
}

export const ImageCarousel = ({ images }: ImageProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3 w-full animate-in fade-in duration-500">
      {/* Main Image Container */}
      <div className="relative group overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
        <div
          className="relative aspect-square cursor-zoom-in flex items-center justify-center overflow-hidden"
          onClick={openModal}
        >
          {/* Ảnh chính với hiệu ứng transition mượt */}
          <Image
            key={currentImage} // Key giúp trigger animation khi đổi ảnh
            src={images[currentImage] || defaultImage}
            fill
            alt="Product view"
            className="object-contain p-2 transition-all duration-500 ease-out animate-in zoom-in-95"
            priority
          />
        </div>

        {/* Chỉ số ảnh (Badge) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
            {currentImage + 1} / {images.length}
          </div>
        </div>

        {/* Nút điều hướng - Chỉ hiện rõ khi hover */}
        <button
          onClick={handleMoveLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleMoveRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 shadow-md text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails List */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        {images.map((link, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-white ${
              currentImage === index
                ? "border-blue-500 ring-2 ring-blue-500/20 scale-95"
                : "border-transparent hover:border-slate-300 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={link || defaultImage}
              fill
              alt={`Thumbnail ${index}`}
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={closeModal}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative w-[90vw] h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentImage] || defaultImage}
              alt="Fullscreen view"
              fill
              className="object-contain animate-in zoom-in-90 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};
