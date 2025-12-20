"use client";

import React, { useState, useEffect } from "react";
import { Save, Settings, Clock, RotateCcw } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner"; // Giả sử bạn có component này
import SystemHook from "@/hooks/useSystem";

export default function SystemSettingsPage() {
    const {
        data: serverRenewTime,
        isLoading,
        isError
    } = SystemHook.useGetProductRenewTime();

    const {
        mutate: updateRenewTime,
        isPending: isSaving
    } = SystemHook.useUpdateProductRenewTime();

    const [localRenewTime, setLocalRenewTime] = useState<number | string>("");

    console.log(serverRenewTime);

    useEffect(() => {
        if (serverRenewTime !== undefined && serverRenewTime !== null) {
            setLocalRenewTime(serverRenewTime[0].product_renew_time);
        }
    }, [serverRenewTime]);

    const isDirty = serverRenewTime !== undefined && Number(localRenewTime) !== serverRenewTime;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (Number(val) < 0) return;
        setLocalRenewTime(val);
    };

    const handleReset = () => {
        if (serverRenewTime !== undefined) {
            setLocalRenewTime(serverRenewTime);
        }
    };

    const handleSave = () => {
        const timeValue = Number(localRenewTime);

        if (isNaN(timeValue) || timeValue <= 0) {
            alert("Vui lòng nhập khoảng thời gian hợp lệ (> 0).");
            return;
        }

        updateRenewTime(timeValue, {
            onSuccess: () => {
                alert("Cập nhật cấu hình thành công!");
            },
            onError: (error) => {
                console.error("Lỗi:", error);
                alert("Cập nhật thất bại. Vui lòng thử lại.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-8">

            <div className="w-full px-15 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Settings className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold text-gray-800">Cấu hình hệ thống</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                    {/* Card Cấu hình */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* Card Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                Cấu hình Gia hạn Sản phẩm
                            </h2>
                        </div>

                        <div className="p-6">
                            {isLoading ? (
                                // Loading State skeleton
                                <div className="flex items-center justify-center py-10">
                                    <LoadingSpinner />
                                    <span className="ml-2 text-gray-500">Đang tải cấu hình...</span>
                                </div>
                            ) : isError ? (
                                // Error State
                                <div className="text-red-500 py-4 text-center bg-red-50 rounded-lg">
                                    Không thể tải cấu hình hệ thống. Vui lòng tải lại trang.
                                </div>
                            ) : (
                                // Content Chính
                                <div className="max-w-xl animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thời gian gia hạn mặc định
                                    </label>

                                    <div className="relative group">
                                        <input
                                            type="number"
                                            min="1"
                                            value={localRenewTime}
                                            onChange={handleChange}
                                            disabled={isSaving}
                                            className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400 font-mono text-lg"
                                            placeholder="Nhập số phút..."
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm pointer-events-none">
                                            Phút
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                        Thiết lập khoảng thời gian (tính bằng phút) sẽ được cộng thêm vào thời hạn sử dụng của sản phẩm khi người dùng thực hiện thao tác "Gia hạn".
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                                        {/* Nút Hoàn tác (chỉ hiện khi có thay đổi) */}
                                        {isDirty && (
                                            <button
                                                onClick={handleReset}
                                                disabled={isSaving}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Hoàn tác
                                            </button>
                                        )}

                                        {/* Nút Lưu */}
                                        <button
                                            onClick={handleSave}
                                            // Chỉ cho bấm khi: Không đang save VÀ (Dữ liệu khác server HOẶC chưa load xong)
                                            disabled={isSaving || !isDirty}
                                            className={`
                        flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-all shadow-sm
                        ${isSaving || !isDirty
                                                    ? 'bg-gray-300 cursor-not-allowed opacity-70 shadow-none'
                                                    : 'bg-primary hover:bg-blue-600 hover:shadow-md active:scale-95'}
                    `}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Lưu thay đổi
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}