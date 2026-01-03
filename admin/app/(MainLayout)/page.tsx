"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const RedirectToCategory = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/category");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-slate-50">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse"></div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">
            Đang chuyển hướng...
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Vui lòng đợi trong giây lát để đến trang danh mục.
          </p>
        </div>
      </div>

      {/* Trang trí phụ phía dưới */}
      <div className="mt-8 flex items-center gap-2 text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
        <span className="w-12 h-px bg-slate-200"></span>
        AuctionHub System
        <span className="w-12 h-px bg-slate-200"></span>
      </div>
    </div>
  );
};

export default RedirectToCategory;
