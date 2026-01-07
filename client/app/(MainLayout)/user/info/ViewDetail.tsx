import { useMemo } from "react";
import {
  CalendarIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  CakeIcon,
} from "lucide-react";
import Avatar from "./Avatar";
import { User } from "../../../../../shared/src/types";

export default function ViewDetail({ user }: { user: User }) {
  // Logic tính toán giữ nguyên
  const sumRating = useMemo(() => {
    return user.positive_points + user.negative_points;
  }, [user]);

  const positiveRatingPercent = useMemo(
    () =>
      sumRating === 0
        ? -1
        : Math.round(
            (user.positive_points /
              (user.negative_points + user.positive_points)) *
              100
          ),
    [user, sumRating]
  );

  return (
    // <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden my-6">
    <div>
      {/* --- TOP SECTION: HEADER --- */}
      <div className="p-6 sm:p-8 lg:p-10">
        {/* BREAKPOINT 900PX: Chuyển từ cột sang dòng tại đây */}
        <section className="flex flex-col min-[900px]:flex-row! gap-8 items-center min-[900px]:items-start!">
          {/* AVATAR */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative">
              <Avatar
                allowEdit={false}
                imageProps={{
                  src: user.profile_img,
                  alt: "avatar",
                  width: 128,
                  height: 128,
                  className:
                    "w-32 h-32 border-4 border-white shadow-md rounded-full",
                }}
              />
            </div>
          </div>

          {/* USER INFO & RATINGS */}
          {/* Căn giữa khi < 900px, Căn trái khi >= 900px */}
          <div className="flex flex-col flex-grow w-full text-center min-[900px]:text-left! gap-4">
            {/* Name & Contact */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {user.name}
              </h1>

              {/* Căn giữa các item contact khi ở màn hình nhỏ */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center min-[900px]:justify-start! text-gray-500 font-medium text-sm sm:text-base">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 justify-center sm:justify-start">
                  <MailIcon className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="break-all">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 justify-center sm:justify-start">
                  <CalendarIcon className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    Thành viên từ {new Date(user.created_at).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* RATING CARDS */}
            {/* Grid 2 cột giúp không bị vỡ layout khi < 700px. 
                            Khi >= 900px, nó sẽ nằm gọn sang bên trái */}
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto sm:max-w-md mx-auto min-[900px]:mx-0! mt-2">
              {/* Card Tích cực */}
              <div className="flex flex-col justify-center items-center min-[900px]:items-start! p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-widest mb-1">
                  Tích cực
                </p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                  {positiveRatingPercent !== -1
                    ? `${positiveRatingPercent}${
                        positiveRatingPercent ? "%" : ""
                      }`
                    : "--"}
                </p>
              </div>

              {/* Card Tổng */}
              <div className="flex flex-col justify-center items-center min-[900px]:items-start! p-4 bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <p className="text-xs font-bold text-slate-500/80 uppercase tracking-widest mb-1">
                  Tổng đánh giá
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-700">
                  {sumRating !== 0 ? sumRating : "--"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- SEPARATOR --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm font-medium text-gray-400 uppercase tracking-wider">
            Thông tin chi tiết
          </span>
        </div>
      </div>

      {/* --- BOTTOM SECTION: DETAILS --- */}
      <div className="p-6 sm:p-8 lg:p-10 bg-white">
        {/* BREAKPOINT 900PX: Grid chuyển từ 1 cột sang 2 cột */}
        <section className="grid grid-cols-1 min-[900px]:grid-cols-2! gap-6">
          <InfoCard
            label="Tên đầy đủ"
            value={user.name}
            icon={<UserIcon className="w-5 h-5 text-blue-500" />}
          />

          <InfoCard
            label="Email liên hệ"
            value={user.email}
            icon={<MailIcon className="w-5 h-5 text-purple-500" />}
          />

          <InfoCard
            label="Ngày sinh"
            value={
              user.day_of_birth
                ? new Date(user.day_of_birth).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"
            }
            icon={<CakeIcon className="w-5 h-5 text-pink-500" />}
          />

          <InfoCard
            label="Địa chỉ"
            value={user.address || "Chưa cập nhật"}
            icon={<MapPinIcon className="w-5 h-5 text-red-500" />}
            // fullWidth={false} // Có thể bật true nếu muốn địa chỉ dài
          />
        </section>
      </div>
    </div>
  );
}

// --- SUB COMPONENT ---
function InfoCard({
  label,
  value,
  icon,
  fullWidth = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`
            group flex flex-col p-5 rounded-2xl border border-transparent 
            bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5
            transition-all duration-300 ease-in-out
            ${fullWidth ? "min-[900px]:col-span-2!" : ""} 
        `}
    >
      {/* ^ Đã sửa col-span để cũng ăn theo breakpoint 900px */}

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <p className="font-bold text-xs text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
          {label}
        </p>
      </div>
      <p className="text-gray-800 font-semibold text-lg pl-1 break-words">
        {value}
      </p>
    </div>
  );
}
