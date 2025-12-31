"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import OrderHook from "@/hooks/useOrder";
import clsx from "clsx";
import { OrderMessage } from "../../../../../../../../shared/src/types";
import { Send, ShoppingBag } from "lucide-react";
import Image from "next/image";

type Props = {
  productId: number;
};

const Avatar = ({ name, img }: { name: string; img?: string | null }) => {
  if (img) {
    return (
      <Image
        src={img}
        alt={name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover shadow-md"
      />
    );
  }

  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-md bg-blue-600"
      )}
    >
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

const OrderChat = ({ productId }: Props) => {
  const user = useAuthStore((s) => s.user);
  const [message, setMessage] = useState("");

  const { data: conversation, isLoading } = OrderHook.useOrderChat(productId);

  const { mutate: sendMessage, isPending } = OrderHook.useCreateOrderChat();

  const bottomRef = useRef<HTMLDivElement>(null);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 animate-pulse">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-slate-600 font-medium">
            Đang tải hội thoại...
          </p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">Chưa có tin nhắn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header - Modern gradient with glass effect */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-blue-800 via-cyan-500 to-indigo-300 overflow-hidden">
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">
              Trao đổi đơn hàng
            </h3>
            <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </div>

      {/* Messages - Modern chat bubbles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
        {conversation.messages.map((msg: OrderMessage, idx: number) => {
          const isMe = msg.user.id === user?.id;
          const showAvatar =
            idx === 0 || conversation.messages[idx - 1].user.id !== msg.user.id;

          return (
            <div
              key={idx}
              className={clsx(
                "flex gap-2 animate-in slide-in-from-bottom-2 duration-300",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              {!isMe && (
                <div className="flex flex-col items-center">
                  {showAvatar ? (
                    <Avatar name={msg.user.name} img={msg.user.profile_img} />
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>
              )}

              <div
                className={clsx(
                  "flex flex-col max-w-[85%]",
                  isMe ? "items-end" : "items-start"
                )}
              >
                {!isMe && showAvatar && (
                  <p className="text-xs font-medium text-slate-600 mb-1 px-1">
                    {msg.user.name}
                  </p>
                )}

                <div className="relative group">
                  <div
                    className={clsx(
                      "inline-block px-4 py-2.5 rounded-[20px] text-[15px] shadow-sm transition-all hover:shadow-md",
                      isMe
                        ? "bg-sky-500 text-white rounded-tr-md"
                        : "bg-slate-100 text-slate-900 rounded-tl-md"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>

                  {/* Tooltip thời gian khi hover */}
                  <div
                    className={clsx(
                      "absolute bottom-full mb-1 px-2 py-1 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-800 text-white shadow-lg z-10",
                      isMe ? "right-0" : "left-0"
                    )}
                  >
                    {new Date(msg.created_at).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              {isMe && (
                <div className="flex flex-col items-center">
                  {showAvatar ? (
                    <Avatar name={msg.user.name} img={msg.user.profile_img} />
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input - Modern floating style */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim() && !isPending) {
                  sendMessage({
                    productId,
                    payload: { message },
                  });
                  setMessage("");
                }
              }}
            />
          </div>

          <button
            disabled={!message.trim() || isPending}
            onClick={() => {
              sendMessage({
                productId,
                payload: { message },
              });
              setMessage("");
            }}
            className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
              message.trim() && !isPending
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 transform hover:scale-105"
                : "bg-slate-300"
            )}
          >
            <Send
              className={clsx(
                "w-5 h-5 transition-transform",
                isPending && "animate-pulse",
                message.trim() ? "text-white" : "text-slate-500"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderChat;
