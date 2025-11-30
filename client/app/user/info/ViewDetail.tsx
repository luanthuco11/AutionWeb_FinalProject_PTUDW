import React, { useMemo } from "react"
import Image from 'next/image'
import { CalendarIcon, MailIcon } from "lucide-react"
import Avatar from "./Avatar"
import { User } from "../../../../shared/src/types"

export default function ViewDetail({ user }: { user: User }) {

    // React Hook
    const positiveRatingPercent = useMemo(() => (
        (user.positive_points / (user.negative_points + user.positive_points) * 100)
    ), [user]
    )

    const sumRating = useMemo(() => (
        user.positive_points + user.negative_points
    ), []
    )

    return <div>
        <section className="flex flex-row my-5 mx-2 gap-5">
            <div>
                <Avatar
                    allowEdit={false}
                    imageProps={{
                        src: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTyhgwFBBuEqiLB5BAjQR4hCDCoJYefwwYtelRMap_8uXFoyisZLRptYiqLuXet0zX9X9Z4z_UAxYbYCcyD9Pm8i2iEe1ljOiYaXfrieWMo7cAQCVQZQ8iYoWz5pDdJFY67SAOckK9jv-c&s=19",
                        alt: "avatar",
                        width: 100,
                        height: 100
                    }}
                />
            </div>
            <div className="grow flex flex-col gap-1">
                <p className="text-lg font-medium">{user.name}</p>
                <p className="flex flex-row gap-2 items-center">
                    <MailIcon className="text-gray-500 w-5 h-5" />
                    <span>{user.email}</span>
                </p>
                <p className="flex flex-row gap-2 items-center">
                    <CalendarIcon className="text-gray-500 w-5 h-5" />
                    <span>Thành viên từ {new Date(user.created_at).getFullYear()}</span>
                </p>
                <div className="flex flex-row gap-5 mt-3">
                    <div className="flex flex-col text-sm font-medium gap-1">
                        <p>Đánh giá tích cực</p>
                        <p className="text-center text-2xl font-bold text-green-600">
                            {positiveRatingPercent}%
                        </p>
                    </div>
                    <div className="flex flex-col text-sm font-medium gap-1">
                        <p>Tổng đánh giá</p>
                        <p className="text-center text-2xl font-bold text-gray-600">{sumRating}</p>
                    </div>
                </div>
            </div>
        </section>
        <hr className="border-t border-solid border-gray-300 mt-3 mb-1.5" />
        <section className="flex flex-col gap-5 mt-5">
            <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Tên đầy đủ</p>
                <p className="text-gray-600">{user.name}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Email</p>
                <p className="text-gray-600">{user.email}</p>
            </div>
            {/* <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Ngày sinh</p>
                <p className="text-gray-600">{user.</p>
            </div> */}
            <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">Địa chỉ</p>
                <p className="text-gray-600">{user.address}</p>
            </div>
        </section>
    </div>
}