"use client";
import React, { useState } from "react";
import { Request } from "./components/Request";
import { UserList } from "./components/UserList";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [manageState, setManageState] = useState<number>(0); // 0: Quản lý chung | 1 : Duyệt
  const router = useRouter();

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Quản lý người dùng
        </h1>
        <div className="flex gap-4 mb-6 border-b border-slate-200 ">
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition cursor-pointer ${
              manageState === 0
                ? " border-teal-500 text-teal-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => {
              setManageState(0);
              router.push("/user");
            }}
          >
            Quản lý chung
          </button>
          <button
            onClick={() => {
              setManageState(1);
              router.push("/user");
            }}
            className={`px-4 py-2 font-semibold border-b-2 transition cursor-pointer ${
              manageState === 1
                ? " border-teal-500 text-teal-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Duyệt Seller
          </button>
        </div>
        {manageState === 0 ? <UserList /> : <Request />}
      </div>
    </>
  );
}
