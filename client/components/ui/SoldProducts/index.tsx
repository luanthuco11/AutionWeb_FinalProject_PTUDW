import Image from "next/image";

type sold_product = {
    id: number,
    main_image: string,
    name: string,
    intial_price: string,
    closing_price: string,
}

const SoldProduct = ({ product }: { product: sold_product }) => {
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
                    <span className="text-gray-400 font-stretch-50% text-xs">
                        Giá chốt:{" "}
                        <span className="text-teal-600 font-semibold">{product.closing_price} đ</span>
                    </span>
                </div>
            </div>
            <div className="text-right flex flex-col gap-1">
                <span className="text-gray-400 font-stretch-50% text-xs">
                    Giá ban đầu
                </span>
                <span className="text-teal-500 font-bold text-sm">
                    {product.intial_price} đ
                </span>
            </div>
        </div>
    );
};

export default SoldProduct;
