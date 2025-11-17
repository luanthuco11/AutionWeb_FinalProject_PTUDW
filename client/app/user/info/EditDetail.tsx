"use client"

import React, { useState } from "react"
import Avatar from "./Avatar"
import SecondaryButton from "@/components/SecondaryButton";

export default function EditDetail() {
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);

  return <div>
    <section className="flex flex-col gap-5 mt-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="avatar" className="font-medium text-sm">Ảnh đại diện</label>
        <Avatar
          allowEdit={true}
          imageProps={{
            src: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTyhgwFBBuEqiLB5BAjQR4hCDCoJYefwwYtelRMap_8uXFoyisZLRptYiqLuXet0zX9X9Z4z_UAxYbYCcyD9Pm8i2iEe1ljOiYaXfrieWMo7cAQCVQZQ8iYoWz5pDdJFY67SAOckK9jv-c&s=19"
          }}
        />
      </div>
      <div className="grid grid-cols-2">
        <form className="flex flex-col gap-2">
          <label htmlFor="fullname" className="font-medium text-sm">Tên đầy đủ<span className="text-red-500 ml-0.5">*</span></label>
          <input name="fullname" id="fullname" type="text" defaultValue="Huỳnh Gia Âu" required={true} className="text-black rounded-lg mr-10" />

          <label htmlFor="email" className="mt-3 font-medium text-sm">Email<span className="text-red-500 ml-0.5">*</span></label>
          <input name="email" id="email" type="text" defaultValue="huynhgiaau27112005@gmail.com" required={true} className="text-black rounded-lg mr-10" />

          <label htmlFor="birthday" className="mt-3 font-medium text-sm">Ngày sinh<span className="text-red-500 ml-0.5">*</span></label>
          <input name="birthday" id="birthday" type="date" defaultValue="27/11/2005" required={true} className="text-black rounded-lg mr-10" />

          <label htmlFor="address" className="mt-3 font-medium text-sm">Địa chỉ<span className="text-red-500 ml-0.5">*</span></label>
          <input name="address" id="address" type="text" required={true} defaultValue="47 Lý Thái Tổ, Phường 1, Quận 10, TP Hồ Chí Minh" className="text-black rounded-lg mr-10" />
        </form>
        <div className="flex flex-col gap-2">
          <div className="ml-2 flex flex-row gap-2 items-center">
            <input name="edit-password" id="edit-password" type="checkbox" onChange={(e) => setIsEditingPassword(e.target.checked)} className="checkbox-primary" />
            <label htmlFor="edit-password">Thay đổi mật khẩu</label>
          </div>
          <form aria-disabled={!isEditingPassword} className="relative flex flex-col gap-2 p-6 border border-gray-500 rounded-sm aria-disabled:pointer-events-none">
            {/* Overlay */}
            {!isEditingPassword && (
              <div className="absolute -inset-1 bg-white/70 pointer-events-none rounded-sm" />
            )}

            <label htmlFor="old-password" className="font-medium text-sm">Mật khẩu cũ</label>
            <div className="grid grid-cols-[4fr_2.5fr] gap-2.5">
              <input name="old-password" id="old-password" type="password" disabled={!isEditingPassword} className="text-black rounded-lg basis-4/5 flex-1" />
              <SecondaryButton
                text="Quên mật khẩu"
                onClick={() => console.log("Clicked on 'Quên mật khẩu'")}
              />
            </div>

            <label htmlFor="old-password" className="mt-3 font-medium text-sm">Mật khẩu mới</label>
            <input name="old-password" id="old-password" type="password" disabled={!isEditingPassword} className="text-black rounded-lg" />

            <label htmlFor="old-password" className="mt-3 font-medium text-sm">Xác nhận mật khẩu mới</label>
            <input name="old-password" id="old-password" type="password" disabled={!isEditingPassword} className="text-black rounded-lg" />
          </form>
        </div>
      </div>
    </section>
  </div>
}