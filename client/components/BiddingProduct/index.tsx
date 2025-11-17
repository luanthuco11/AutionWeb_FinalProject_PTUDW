import Image from "next/image";
import ProductType from "@/types/product";

const BiddingProduct = ({ product }: { product: ProductType.BiddingProduct }) => {
    return (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 w-full">
            <div className="flex items-center gap-3 ">
                <Image
                    src={product.main_image}
                    alt="Ảnh sản phẩm"
                    width={90}
                    height={90}
                    className="rounded-md object-cover p-1 border border-gray-200"
                />
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-700 text-[15px]">
                        {product.name}
                    </span>
                    <span className="text-slate-500 font-stretch-10% text-sm">
                        Giá đấu của bạn:{" "}
                        <span className="text-[#0D9488] font-bold text-md">{product.bidding_price} đ</span>
                    </span>
                </div>
            </div>
            <div className="text-right flex flex-col gap-1">
                <span className="text-slate-500 font-stretch-10% text-sm">
                    Giá hiện tại
                </span>
                <span className="text-[#0D9488] font-bold text-lg">
                    {product.current_price} đ
                </span>
            </div>
        </div>
    );
};


export default BiddingProduct;
