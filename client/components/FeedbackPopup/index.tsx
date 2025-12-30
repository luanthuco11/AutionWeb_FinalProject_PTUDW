import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // Đừng quên import icon để làm nút thoát

type FeedbackProps = {
  targetName: string;
  rating: any; // Thay bằng UserRating của bạn
  onRating: (rating: number, message: string) => void;
  onClose: () => void; // Thêm prop để đóng modal
};

type FeedbackType = "plus" | "minus" | null;

const FeedbackTypeDict: Record<number, FeedbackType> = {
  "-1": "minus",
  1: "plus",
};

const RatingDict: Record<string, number> = {
  plus: 1,
  minus: -1,
};

const FeedbackPopup = ({
  targetName,
  rating,
  onRating,
  onClose,
}: FeedbackProps) => {
  const [type, setType] = useState<FeedbackType>(
    rating ? FeedbackTypeDict[rating.rating] : null
  );
  const [comment, setComment] = useState<string>(rating?.comment || "");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Chặn scroll trang web khi modal đang mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRating(RatingDict[type!], comment);
    setSubmitted(true);
  };

  return (
    // Lớp nền mờ toàn màn hình (Overlay)
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop: click vào đây cũng có thể đóng modal */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Nội dung Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Nút thoát góc trên bên phải */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Cảm ơn bạn!</h3>
            <p className="text-gray-500 mt-2">
              Đánh giá của bạn đã được gửi tới{" "}
              <span className="font-semibold">{targetName}</span>
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Bạn thấy giao dịch thế nào?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Trải nghiệm của bạn với {targetName} như thế nào?
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nút chọn hài lòng / không hài lòng */}
              <div className="flex gap-3">
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

              {/* Textarea */}
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none text-sm"
                  placeholder="Chia sẻ thêm chi tiết về giao dịch này..."
                  rows={4}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!type}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
                  type
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    : "bg-gray-200 cursor-not-allowed text-gray-400"
                }`}
              >
                Gửi đánh giá ngay
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPopup;
