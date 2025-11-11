import React from "react"

export default function ProductCard() {
  return <div className="w-50 h-118 rounded-lg border-2 border-gray-200 bg-white shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-200">
    <img src="https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/iphone_17_pro_slide_1_c27e78032a.jpg" alt="iPhone 17" className="w-full aspect-5/4 rounded-t-md" />
    <div className="px-3">
      <section className="mt-2">
        <p className="font-medium">IPhone 17 Pro Max Limited Green</p>
        <div className="mt-1 flex flex-row gap-1">
          <svg className="w-6 h-6 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z" />
          </svg>

          <span>5 lượt đấu giá</span>
        </div>
        <div className="mt-3">
          <p className="text-sm">Giá hiện tại</p>
          <p>
            <span className="text-2xl font-medium text-red-500">52.000</span>
          </p>
        </div>
        <div className="mt-1">
          <p className="text-sm">Giá mua ngay</p>
          <p>
            <span className="text-xl font-medium text-blue-600">250.000</span>
          </p>
        </div>
        <div className="mt-3">
          <p className="text-sm">Người trả giá cao nhất:</p>
          <p className="font-medium">Huỳ*********u</p>
        </div>
      </section>
      <hr className="border-t border-solid border-gray-300 my-2.5" />
      <section className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 items-center">
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>20 giờ 20 phút</span>
        </div>
      </section>
    </div>

    {/* Favourite Button */}
    
  </div>
}