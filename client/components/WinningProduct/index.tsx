import Image from "next/image";
import ProductType from "@/types/product";

const WinningProduct = ({ product }: { product: ProductType.WinningProduct }) => {
    return (
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg shadow-xs p-3 w-[75%]">
            <div className="flex items-center gap-3">
                <Image
                    src={product.main_image}
                    alt="Ảnh sản phẩm"
                    width={55}
                    height={55}
                    className="rounded-sm object-cover"
                />
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-700 text-sm">
                        {product.name}
                    </span>
                </div>
            </div>
            <div className="text-right flex flex-col gap-1">
                <span className="text-gray-400 font-stretch-50% text-xs">
                    Giá đấu của bạn:
                </span>
                <span className="text-teal-500 font-bold text-sm">
                    {product.bidding_price} đ
                </span>
            </div>
        </div>
    );
};

export default WinningProduct;
