import React, { useState } from "react";
import {
  Order,
  Product,
  UserRating,
  CreateRating,
} from "../../../shared/src/types";

type FeedbackType = "plus" | "minus" | null;

type FeedbackProps = {
  targetName: string;
  rating: UserRating;
  onRating: (rating: number, message: string) => void;
};

const FeedbackTypeDict: Record<number, FeedbackType> = {
  "-1": "minus",
  1: "plus",
};

const RatingDict: Record<string, number> = {
  plus: 1,
  minus: -1,
};

const FeedbackBox = ({ targetName, rating, onRating }: FeedbackProps) => {
  const [type, setType] = useState<FeedbackType>(
    rating ? FeedbackTypeDict[rating.rating] : null
  );
  const [comment, setComment] = useState<string>(rating?.comment || "");
  const [submitted, setSubmitted] = useState<boolean>(!!rating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ type, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md p-6 bg-white rounded-xl shadow-lg text-center border border-gray-100">
        <h3 className="text-xl font-bold text-green-600">Cảm ơn bạn!</h3>
        <p className="text-gray-500 mt-2">
          Đánh giá của bạn sẽ được gửi tới {targetName}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-blue-500 hover:underline text-sm"
        >
          Chỉnh sửa đánh giá
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Bạn thấy giao dịch thế nào?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nút chọn + hoặc - */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType("plus")}
            className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              type === "plus"
                ? "border-green-500 bg-green-50 text-green-600"
                : "border-gray-200 hover:border-green-300 text-gray-400 hover:text-green-300"
            }`}
          >
            <span className="text-2xl font-bold">+</span>
            <span className="font-medium">Hài lòng</span>
          </button>

          <button
            type="button"
            onClick={() => setType("minus")}
            className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              type === "minus"
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-300"
            }`}
          >
            <span className="text-2xl font-bold">−</span>
            <span className="font-medium">Chưa tốt</span>
          </button>
        </div>

        {/* Dòng comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Chia sẻ thêm ý kiến của bạn cho {targetName}
          </label>
          <textarea
            value={comment}
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Tại sao bạn chọn như vậy?..."
            rows={3}
          />
        </div>

        {/* Nút gửi */}
        <button
          type="submit"
          onClick={() => onRating(RatingDict[type!], comment)}
          disabled={!type}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            type
              ? "bg-blue-600 hover:bg-blue-700 shadow-md"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
};

export default FeedbackBox;
