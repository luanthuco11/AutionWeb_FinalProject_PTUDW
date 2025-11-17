import Image from "next/image";
import { UserRating } from "../../../../shared/src/types";

export default function RatingLog({ ratingLog }: { ratingLog: UserRating }) {
  const {
    rater,
    rating,
    comment = "",
    created_at: date
  } = ratingLog;

  const goodRating: boolean = (rating == 1); // 0: bad; 1: good

  return <div className="bg-white rounded-lg p-4 border-2 border-gray-200 flex flex-col gap-3">
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-2">
        <Image
          src={rater.profile_img}
          width={100}
          height={100}
          alt={`Avatar của ${rater.name}`}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p className="text-black font-medium">{rater.name}</p>
          <p className="text-sm text-gray-500">{date.toLocaleDateString("en-GB")}</p>
        </div>
      </div>  
      <div className={`rounded-full w-10 h-10 flex justify-center items-center select-none ${goodRating ? "bg-green-200" : "bg-red-200"}`}>
        <span className={`font-bold my-0 text-2xl -translate-y-0.5 ${goodRating ? "text-green-700" : "text-red-800"}`}>{goodRating ? '+' : '-'}</span>
      </div>
    </div>
    {comment && <div>{comment}</div>}
    </div>
}