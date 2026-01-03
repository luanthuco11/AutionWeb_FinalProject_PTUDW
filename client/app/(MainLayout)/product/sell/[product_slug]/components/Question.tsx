"use client";

import { FlightOutlineIcon } from "@/components/icons";
import React, { useEffect } from "react";
import { useState } from "react";
import ProductHook from "@/hooks/useProduct";
import {
  ProductQuestion,
  ProductQuestionPagination,
} from "../../../../../../../shared/src/types";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
export function formatDate(date?: Date | string): string {
  if (!date) return "--";
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return "--";

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());

  return `Ngày ${day}/${month}/${year}, ${hour} giờ ${minute} phút`;
}

export function formatCurrency(value: number | null, currency = "₫"): string {
  if (value === null || value === undefined) return "0" + currency;

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "0" + currency;

  return numberValue.toLocaleString("vi-VN") + currency;
}

function QuestionItem({
  id,
  product_id,
  user,
  comment,
  answer,
  created_at,
}: ProductQuestion) {
  const date = new Date(created_at ?? "");

  const [open, setOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { mutate: createAnswer, isPending: isCreateAnswer } =
    ProductHook.useCreateProductAnswer();

  const schema = z.object({
    comment: z.string().nonempty("Vui lòng nhập câu trả lời"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ comment: string }>({
    resolver: zodResolver(schema),
    defaultValues: { comment: "" },
  });

  const handleSend: SubmitHandler<{ comment: string }> = (data) => {
    createAnswer(
      {
        idProduct: product_id,
        idQuestion: id,
        data: { comment: data.comment, productId: product_id },
      },
      {
        onSuccess: () => {
          setValue("comment", "");
          setIsReplying(false);
          setOpen(true);
        },
      }
    );
  };

  return (
    <div className="border-b border-gray-100  last:border-0">
      <div className="flex flex-row justify-between items-center mb-1">
        <p className="font-medium text-gray-900">{user.name}</p>
        {created_at && (
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
        )}
      </div>

      <p className="text-gray-700 mb-3">{comment}</p>

      <div className="flex flex-wrap items-center gap-4 mb-3">
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer flex items-center gap-1"
        >
          {isReplying ? "Đóng khung trả lời" : "Trả lời"}
        </button>

        {answer && answer.length > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="text-sm text-amber-600 hover:text-amber-800 hover:underline cursor-pointer transition-colors"
          >
            {open ? "Ẩn câu trả lời" : `Xem ${answer.length} câu trả lời`}
          </button>
        )}
      </div>

      {open && answer && answer.length > 0 && (
        <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-100">
          {answer.map((item, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold text-gray-900">
                  {item.user.name}
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-1">{item.comment}</p>
            </div>
          ))}
        </div>
      )}
      {isReplying && (
        <form
          className="mt-2 md:mt-3 md:mb-6 animate-in fade-in slide-in-from-top-2 duration-200"
          onSubmit={handleSubmit(handleSend)}
        >
          <div className="w-full">
            <div className="flex flex-col sm:flex-row md:gap-3 items-start">
              <div className="flex-1 w-full">
                <input
                  {...register("comment")}
                  autoFocus
                  placeholder={`Trả lời ${user.name}...`}
                  className="w-full px-4 py-2.5 
                    bg-slate-50 border border-slate-200
                    rounded-lg transition-all duration-200 ease-in-out
                    placeholder:text-slate-400 text-slate-700 text-sm
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  type="text"
                />
                <span className="text-red-600 text-xs mt-1 block h-4">
                  {errors.comment ? errors.comment.message : ""}
                </span>
              </div>

              <button
                type="submit"
                disabled={isCreateAnswer}
                className="w-full sm:w-auto shrink-0
                  px-5 py-2.5 
                  bg-blue-600 text-white font-medium text-sm
                  rounded-lg shadow-sm shadow-blue-600/20
                  flex justify-center items-center gap-2 
                  transition-all duration-200 
                  hover:bg-blue-700 hover:shadow-md
                  active:scale-95
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FlightOutlineIcon className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
interface ProductId {
  productId: number;
}
export const Question = ({ productId }: ProductId) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("limit")) || 5;

  const {
    data: questionPagination,
    isLoading: isLoadingQuestion,
  }: {
    data: ProductQuestionPagination | undefined;
    isLoading: boolean;
  } = ProductHook.useGetProductQuestionsByPage(productId, page, per_page);

  const questions = questionPagination?.questions || [];
  const totalPages = questionPagination
    ? Math.ceil(questionPagination.total / per_page)
    : 0;

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", value.toString());
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  console.log(questions);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800">
          Hỏi & Đáp về sản phẩm
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          {questionPagination?.total || 0} câu hỏi thảo luận
        </p>
      </div>
      <div className="relative min-h-[100px] p-4 md:p-6">
        {isLoadingQuestion ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {questions && questions.length > 0 ? (
              <div className="flex flex-col gap-6">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className={`
                        ${
                          index !== questions.length - 1
                            ? "border-b border-slate-100"
                            : ""
                        }
                      `}
                  >
                    <QuestionItem {...question} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p>Chưa có câu hỏi nào.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 pt-4 border-t border-slate-100">
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
