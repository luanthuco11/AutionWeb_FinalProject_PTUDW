"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  buyerName: string;
}

export default function RatingPopup({
  isOpen,
  onClose,
  onSubmit,
  buyerName,
}: RatingPopupProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[370px] rounded-xl shadow-lg p-5 relative fade-in">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-lg text-center font-semibold ">
            Đánh giá người mua
          </span>
          <span className="text-xl text-amber-800 text-center font-semibold mb-4">
            {buyerName}
          </span>
        </div>

        <div className="flex justify-center gap-4 mb-4 text-xl">
          <button
            onClick={() => setRating(1)}
            className={`px-4 py-2 rounded-md font-semibold border ${
              rating === 1
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            +
          </button>
          <button
            onClick={() => setRating(-1)}
            className={`px-4 py-2 rounded-md font-semibold border ${
              rating === -1
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            -
          </button>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhận xét của bạn..."
          className="w-full border rounded-md p-2 text-sm"
          rows={3}
        />

        <button
          onClick={() => onSubmit(rating, comment)}
          className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold mt-4 hover:bg-teal-700"
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
}
