"use client"
import React, { useCallback } from 'react'
import RatingLog from './RatingLog'
import { RatingHook } from '@/hooks/useRating'
import { useAuth } from '@/hooks/useAuth'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useMemo, useState } from 'react'
import Pagination from '@/components/Pagination'

const RatingPage = () => {

    // --- Define State ---
    const limit: number = 4;
    const [offset, setOffset] = useState<number>(0);
    const [currentPage, setPage] = useState<number>(1);

    // --- Custom Hook ---
    const userId = useAuth();
    const { 
        data: userRating, 
        isLoading: isTotalRatingLoading, 
        error: errorTotalRating 
    } = RatingHook.useGetTotalRating(Number(userId.user?.id))
    const { 
        data: ratingByPage, 
        isLoading, 
        error 
    } = RatingHook.useGetRating(Number(userId.user?.id), offset)

    // --- React Hook ---
    const handlePageChange = useCallback((page: number) => {
        setPage(page);
        setOffset((page - 1) * limit);
    }, [])

    // --- Exception ---
    if (isLoading || isTotalRatingLoading) return <LoadingSpinner />;
    if (error || errorTotalRating) return <p>Lỗi tải dữ liệu</p>;
    if (!userRating || !ratingByPage) return <p>Không tìm thấy thông tin người dùng</p>;

    // --- Memo ---
    const positiveRatingPercent = useMemo(() => {
        if (!userRating || !userRating.logs) return 0;

        const positiveCount = userRating.logs.filter((log: any) => log.rating > 0).length;
        const total = userRating.logs.length;

        return Math.round((positiveCount / total) * 100);
    }, [userRating]);

    const sumPositiveRating = useMemo(() => {
        if (!userRating || !userRating.logs.length) return 0;

        return userRating.logs.filter((log: any) => log.rating > 0).length;
    }, [userRating]);

    const sumRating = useMemo(() => {
        return userRating?.logs.length || 0;
    }, [userRating]);


    return <div className="background-user flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Chi tiết đánh giá</h1>
        <div className="mt-4 bg-slate-100 py-7 flex flex-row justify-evenly rounded-lg border-2 border-slate-300">
            <div className="flex flex-col items-center gap-1">
                <p className="text-4xl font-bold text-green-700">{positiveRatingPercent}%</p>
                <p className="text-sm text-gray-500">Điểm tích cực</p>
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="text-4xl font-bold text-slate-600">{sumPositiveRating}</p>
                <p className="text-sm text-gray-500">Đánh giá tích cực</p>
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="text-4xl font-bold text-slate-600">{sumRating}</p>
                <p className="text-sm text-gray-500">Tổng đánh giá</p>
            </div>
        </div>

        <h2 className="mt-6 text-xl font-medium">Những đánh giá gần đây</h2>
        <div className="mt-2 flex flex-col gap-4">
            {ratingByPage.logs.map((log: any) => <RatingLog key={log.id} ratingLog={log} />)}
        </div>

        <Pagination
            totalPages={Math.ceil(sumRating / limit)}
            onPageChange={handlePageChange}
            currentPage={currentPage}
        />

    </div>
}

export default RatingPage