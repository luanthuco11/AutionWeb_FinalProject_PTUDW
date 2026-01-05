"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import UserHook from "@/hooks/useUser";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { Pagination as PaginationType } from "../../../../shared/src/types/Pagination";
import Pagination from "@/components/Pagination";
import { User } from "../../../../../shared/src/types";
import { formatDate } from "@/app/utils";
import { DeleteCategoryModal } from "@/components/CategoryCard/DeleteCategoryModal";
import { ConfirmPopup } from "@/components/ConfirmPopup";
import AuthHook from "@/hooks/userAuth";
import { KeyRound } from "lucide-react";
import { ConfirmResetPasswordPopup } from "@/components/ConfirmResetPasswordPopup";

export const UserList = () => {
  const searchParams = useSearchParams();
  let totalPages = 1;
  const [users, setUsers] = useState<User[]>([]);
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const router = useRouter();
  const [isPopup, setIsPopup] = useState(false);
  const [isResetPopup, setIsResetPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    content: string;
  }>({ id: 0, content: "Chưa có" });
  const [selectedResetUser, setSelectedResetUser] = useState<{
    userId: string;
    mail: string;
  }>({ userId: "0", mail: "Chưa có" });
  const pagination: PaginationType = {
    page: Number(page),
    limit: Number(limit),
  };
  const { data, isLoading } = UserHook.useGetUsers(pagination);
  const { mutate: deleteUser, isPending: isDeletingUser } =
    UserHook.useDeleteUser();
  const { mutate: resetUserPassword, isPending: isResetUserPassword } =
    AuthHook.useResetUserPassword();

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    next.set("limit", "10");
    router.push(`?${next.toString()}`);
  };
  useEffect(() => {
    if (data) {
      if (data.users) {
        setUsers(data.users);
      }
    }
  }, [data]);
  if (data) {
    totalPages = Math.ceil(Number(data.totalUsers) / Number(limit));
  }
  const handleOnDelete = (id: number, content: string) => {
    setSelectedUser({ id, content });
    setIsPopup(true);
  };
  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
    }
    setIsPopup(false);
  };
  const handleOnResetUserPassword = (user: User) => {
    setSelectedResetUser({userId: String(user.id), mail: user.email});
    setIsResetPopup(true);
  };
  const handleResetUserPassword = () => {
    if (selectedResetUser) {
        resetUserPassword(selectedResetUser)
    }
    setIsResetPopup(false);
  };
  console.log(users);
  return (
    <>
      {isLoading || isDeletingUser || isResetUserPassword ? (
        <LoadingSpinner />
      ) : (
        users && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-white rounded-lg border border-surface overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface border-b border-surface">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-text">
                        Tên
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-text">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-text">
                        Điểm uy tín
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-text">
                        Loại
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-text">
                        Ngày tham gia
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-text">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item: User, index: number) => {
                      let point = 100;
                      if (item.positive_points + item.negative_points != 0)
                        point = Math.round(
                          (Number(item.positive_points) /
                            (Number(item.positive_points) +
                              Number(item.negative_points))) *
                            100
                        );

                      return (
                        <tr
                          key={index}
                          className="border-b border-surface hover:bg-bg transition-colors"
                        >
                          <td className="px-4 py-3 text-text font-medium">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-text-light">
                            {item.email}
                          </td>
                          <td
                            className={`px-4 py-3 font-bold ${
                              point <= 60
                                ? "text-red-500"
                                : point < 80
                                ? "text-yellow-400"
                                : "text-green-500"
                            }`}
                          >
                            {point}%
                          </td>
                          <td className="px-4 py-3">{item.role}</td>
                          <td className="px-4 py-3 text-text-light ">
                            {formatDate(item.created_at)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOnResetUserPassword(item)}
                                title="Reset mật khẩu"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleOnDelete(item.id, "xóa" + item.name)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash2 w-4 h-4"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1={10} x2={10} y1={11} y2={17} />
                                  <line x1={14} x2={14} y1={11} y2={17} />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-full flex flex-row justify-center my-4">
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
                currentPage={Number(page)}
              />
            </div>
          </div>
        )
      )}
      {/* Confirm */}
      <ConfirmPopup
        isOpen={isPopup}
        onClose={() => setIsPopup(false)}
        selected={selectedUser}
        onConfirm={handleDeleteUser}
      />
      <ConfirmResetPasswordPopup
        isOpen={isResetPopup}
        onClose={() => setIsResetPopup(false)}
        selected={selectedResetUser}
        onConfirm={handleResetUserPassword}
      />
    </>
  );
};
