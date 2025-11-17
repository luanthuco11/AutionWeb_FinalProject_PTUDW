import ProductCard from '@/components/ProductCard'
import React from 'react'
import RatingLog from './RatingLog'
import { UserRatingHistory } from '../../../../shared/src/types'

const ratingHistory: UserRatingHistory = {
  ratee_id: 1,
  logs: [
    {
      id: 1,
      rater: {
        id: 2,
        name: "Donald Trump",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 1,
      comment: "Bán hàng uy tín, hàng không hư hỏng. Hàng hóa giống hình 100%",
      created_at: new Date(2005, 11, 27),
      updated_at: null
    },
    {
      id: 2,
      rater: {
        id: 3,
        name: "Bill Gates",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 0,
      comment: "Không đẹp trai như Huỳnh Gia Âu!",
      created_at: new Date(2023, 0, 15), // 15/01/2023
      updated_at: null
    },
    {
      id: 3,
      rater: {
        id: 4,
        name: "Elon Musk",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 0,
      comment: "Sản phẩm bị lỗi nhỏ, liên hệ hỗ trợ hơi chậm. Cần cải thiện.",
      created_at: new Date(2024, 8, 5), // 05/09/2024
      updated_at: null
    },
    {
      id: 4,
      rater: {
        id: 5,
        name: "Taylor Swift",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 1,
      comment: "Tuyệt vời, sẽ ủng hộ tiếp!",
      created_at: new Date(2024, 10, 20), // 20/11/2024
      updated_at: null
    },
    {
      id: 5,
      rater: {
        id: 6,
        name: "Jeff Bezos",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47DZ33C0"
      },
      rating: 1,
      // Không có trường comment
      created_at: new Date(2022, 5, 3), // 03/06/2022
      updated_at: null
    },
    {
      id: 6,
      rater: {
        id: 7,
        name: "Barack Obama",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 0,
      comment: "Gió ơi xin đừng lấy em đi Hãy mang em về chốn xuân thì Ngày nào còn bồi hồi tóc xanh Ngày nào còn trò chuyện vớ anh Em nói em thương anh mà Nói em yêu em mà Cớ sao ta lại hóa chia xa Đóa phong lan lặng lẽ mơ màng Nàng dịu dàng tựa đèn phố Vinh Đẹp rạng ngời chẳng cần cố Xinh",
      created_at: new Date(2021, 1, 28), // 28/02/2021
      updated_at: null
    },
    {
      id: 7,
      rater: {
        id: 8,
        name: "Rihanna",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 1,
      comment: "Chủ shop nhiệt tình, tư vấn chu đáo.",
      created_at: new Date(2023, 11, 1), // 01/12/2023
      updated_at: null
    },
    {
      id: 8,
      rater: {
        id: 9,
        name: "LeBron James",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 1,
      // Không có trường comment
      created_at: new Date(2024, 3, 10), // 10/04/2024
      updated_at: null
    },
    {
      id: 9,
      rater: {
        id: 10,
        name: "Ariana Grande",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 0,
      comment: "Thời gian giao hàng quá lâu, vượt quá cam kết.",
      created_at: new Date(2023, 7, 22), // 22/08/2023
      updated_at: null
    },
    {
      id: 10,
      rater: {
        id: 11,
        name: "Queen Elizabeth",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      ratee: {
        id: 1,
        name: "Huỳnh Gia Âu",
        profile_img: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTu-GSY_bXjggu92Go8I0Od4bEoIE-RnSuaCRmN5xcL4lfSDQI169Wyg5hK0VegSLUJjpqlG47veDZ33C0"
      },
      rating: 1,
      // Không có trường comment
      created_at: new Date(2024, 6, 4), // 04/07/2024
      updated_at: null
    }
  ]
}

const RatingPage = () => {
  return <div className="background-user flex flex-col gap-2">
    <h1 className="text-2xl font-medium">Chi tiết đánh giá</h1>
    <div className="mt-4 bg-slate-100 py-7 flex flex-row justify-evenly rounded-lg border-2 border-slate-300">
      <div className="flex flex-col items-center gap-1">
        <p className="text-4xl font-bold text-green-700">96%</p>
        <p className="text-sm text-gray-500">Điểm tích cực</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-4xl font-bold text-slate-600">112</p>
        <p className="text-sm text-gray-500">Đánh giá tích cực</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-4xl font-bold text-slate-600">117</p>
        <p className="text-sm text-gray-500">Tổng đánh giá</p>
      </div>
    </div>

    <h2 className="mt-6 text-xl font-medium">Những đánh giá gần đây</h2>
    <div className="mt-2 flex flex-col gap-4">
      {ratingHistory.logs.map(log => <RatingLog key={log.id} ratingLog={log}/>)}
    </div>

    {/* pagination */}
  </div>
}

export default RatingPage