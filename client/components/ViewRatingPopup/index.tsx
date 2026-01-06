"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { X, Star, TrendingUp, MessageSquare } from "lucide-react";
import RatingLog from "@/app/(MainLayout)/user/rating/RatingLog";
import { RatingHook } from "@/hooks/useRating";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

interface ViewRatingPopupProps {
  isOpen: boolean;
  ratee_id: number;
  ratee_name?: string;
  onClose: () => void;
}

const StatMiniBox = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string | number;
  colorClass: string;
}) => (
  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
    <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
    <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
      {label}
    </span>
  </div>
);

const ViewRatingPopup = ({
  isOpen,
  ratee_id,
  ratee_name,
  onClose,
}: ViewRatingPopupProps) => {
  const limit = 5;
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Lấy tổng quan (Stats)
  const { data: totalData, isLoading: isTotalLoading } =
    RatingHook.useGetTotalRating(ratee_id, user ? true : false);

  // 2. Lấy danh sách phân trang
  const {
    data: pageData,
    isLoading: isPageLoading,
    isFetching,
  } = RatingHook.useGetRating(ratee_id, offset, user ? true : false);

  // Xử lý khi có dữ liệu mới từ API phân trang
  useEffect(() => {
    if (pageData && pageData.logs) {
      if (offset === 0) {
        setLogs(pageData.logs);
      } else {
        setLogs((prev) => [...prev, ...pageData.logs]);
      }

      // Nếu số lượng lấy về ít hơn limit thì hết dữ liệu
      if (pageData.logs.length < limit) {
        setHasMore(false);
      }
    }
  }, [pageData, offset]);

  // Logic Infinite Scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isFetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Nếu cuộn gần tới đáy (còn 20px)
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      setOffset((prev) => prev + limit);
    }
  }, [isFetching, hasMore]);

  // Tính toán Stats
  const stats = useMemo(() => {
    if (!totalData || !totalData.logs)
      return { percent: 0, positive: 0, total: 0 };
    const positive = totalData.logs.filter((l: any) => l.rating > 0).length;
    const total = totalData.logs.length;
    return {
      percent: total === 0 ? 0 : Math.round((positive / total) * 100),
      positive,
      total,
    };
  }, [totalData]);

  if (!isOpen) return;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Đánh giá về {ratee_name || "người dùng"}
            </h2>
            <p className="text-xs text-slate-500">
              Phản hồi từ những giao dịch trước đó
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="p-4 bg-slate-50/50">
          {isTotalLoading ? (
            <div className="h-20 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <StatMiniBox
                label="Tỷ lệ tích cực"
                value={`${stats.percent}%`}
                colorClass="text-emerald-600"
              />
              <StatMiniBox
                label="Tích cực"
                value={stats.positive}
                colorClass="text-blue-600"
              />
              <StatMiniBox
                label="Tổng số"
                value={stats.total}
                colorClass="text-purple-600"
              />
            </div>
          )}
        </div>

        {/* Content - Scrollable */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200"
        >
          {logs.length > 0 ? (
            <>
              {logs.map((log, index) => (
                <div
                  key={`${log.id}-${index}`}
                  className="animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                >
                  <RatingLog ratingLog={log} />
                </div>
              ))}

              {/* Loading indicator ở cuối danh sách */}
              {isFetching && hasMore && (
                <div className="py-4 flex justify-center">
                  <LoadingSpinner />
                </div>
              )}

              {!hasMore && logs.length > 0 && (
                <p className="text-center text-gray-400 text-xs py-4 italic">
                  Đã hiển thị tất cả đánh giá.
                </p>
              )}
            </>
          ) : (
            !isPageLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                <p className="italic">Chưa có đánh giá nào.</p>
              </div>
            )
          )}

          {isPageLoading && offset === 0 && (
            <div className="py-10 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Footer (Tùy chọn) */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30 text-center">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-slate-600 hover:text-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRatingPopup;
