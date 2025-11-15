"use client"

import React from 'react'
import Image from 'next/image'
import { CalendarIcon, MailIcon, EditIcon, LogoutIcon } from '@/components/icons'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'

const InfoPage = () => {
  return <div className="bg-white w-full h-full border-2 border-gray-200 shadow-md rounded-lg p-7">
    <p className="text-2xl font-medium">Thông tin tài khoản</p>
    <section className="flex flex-row my-5 mx-2 gap-5">
      <div> 
        <Image
          src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTyhgwFBBuEqiLB5BAjQR4hCDCoJYefwwYtelRMap_8uXFoyisZLRptYiqLuXet0zX9X9Z4z_UAxYbYCcyD9Pm8i2iEe1ljOiYaXfrieWMo7cAQCVQZQ8iYoWz5pDdJFY67SAOckK9jv-c&s=19"
          alt="avatar"
          width={100}
          height={100}
          className="border-2 border-black rounded-full object-cover"
        />
      </div>
      <div className="grow flex flex-col gap-1">
        <p className="text-lg font-medium">Huỳnh Gia Âu</p>
        <p className="flex flex-row gap-2 items-center">
          <MailIcon className="text-gray-500 w-5 h-5" />
          <span>huynhgiaau27112005@gmail.com</span>
        </p>
        <p className="flex flex-row gap-2 items-center">
          <CalendarIcon className="text-gray-500 w-5 h-5" />
          <span>Thành viên từ 1997</span>
        </p>
        <div className="flex flex-row gap-5 mt-3">
          <div className="flex flex-col text-sm font-medium gap-1">
            <p>Đánh giá tích cực</p>
            <p className="text-center text-2xl font-bold text-green-600">96%</p>
          </div>
          <div className="flex flex-col text-sm font-medium gap-1">
            <p>Tổng đánh giá</p>
            <p className="text-center text-2xl font-bold text-gray-600">102</p>
          </div>
        </div>
      </div>
    </section>
    <hr className="border-t border-solid border-gray-300 mt-3 mb-1.5" />
    <section className="flex flex-col gap-5 mt-5">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Tên đầy đủ</p>
        <p className="text-gray-600">Huỳnh Gia Âu</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Email</p>
        <p className="text-gray-600">huynhgiaau27112005@gmail.com</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Ngày sinh</p>
        <p className="text-gray-600">27/11/2005</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-sm">Địa chỉ</p>
        <p className="text-gray-600">47 Lý Thái Tổ, Phường 1, Quận 10, TP Hồ Chí Minh</p>
      </div>
    </section>
    <section className="flex flex-row gap-5 mt-10 max-w-80">
      <PrimaryButton
        text="Chỉnh sửa"
        icon={() => <EditIcon className="text-white"/>}
      />
      <SecondaryButton
        text="Đăng xuất"
        icon={() => <LogoutIcon className="text-red-[#FF0505]"/>}
        textColor="#FF0505"
        hoverBackgroundColor="#FFE0E0"
      />
    </section>
  </div>
}

export default InfoPage