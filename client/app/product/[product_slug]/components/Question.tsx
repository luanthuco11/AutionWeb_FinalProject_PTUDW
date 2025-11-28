import { FlightOutlineIcon } from "@/components/icons";
import React, { useEffect } from "react";
import { useState } from "react";
import ProductHook from "@/hooks/useProduct";
import { ProductQuestion } from "../../../../../shared/src/types";

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
  const second = pad(d.getSeconds());

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
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
  return (
    <>
      <div className="flex flex-row justify-between">
        <p className="font-medium text-gray-900">{user.name}</p>
        {created_at && (
          <p className="text-xs text-gray-600"> {formatDate(date)}</p>
        )}
      </div>
      <p className="text-gray-600 mb-3">Câu hỏi: {comment}</p>
      {answer && (
        <div className="ml-4 pl-4 border-l-2 border-amber-400">
          <p className="text-sm font-medium text-amber-600 mb-1">
            Trả lời từ người bán:
          </p>
          <p className="text-sm text-gray-700">{answer.comment}</p>
        </div>
      )}
    </>
  );
}
interface ProductId {
  productId: number;
}
export const Question = ({ productId }: ProductId) => {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);

  const { data, isLoading: isLoadingQuestion } =
    ProductHook.useGetProductQuestion(productId);
  useEffect(() => {
    if (data) {
      if (data.data) {
        setQuestions(data.data.questions);
      }
    }
  }, [data]);
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (question != "") {
      alert("Đã gửi:" + question);
      setQuestion("");
    }
  };

  const handleChangeQuesion = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQuestion(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 mb-8 border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">Hỏi & Đáp</h3>
      <div>
        <form
          className="flex flex-row gap-2 mb-8 "
          onSubmit={(e) => handleSend(e)}
        >
          <div className="flex-8 md:flex-9">
            <input
              placeholder="Bạn có câu hỏi về sản phẩm này?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              value={question}
              onChange={(e) => handleChangeQuesion(e)}
            />
          </div>

          <button
            type="submit"
            className="flex-2 md:flex-1 bg-blue-600 text-white flex justify-center items-center gap-1 rounded-2xl hover:cursor-pointer"
          >
            <FlightOutlineIcon />

            <span>Gửi</span>
          </button>
        </form>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="py-6 border-t border-gray-200">
          {" "}
          <QuestionItem {...question} />{" "}
        </div>
      ))}
    </div>
  );
};
