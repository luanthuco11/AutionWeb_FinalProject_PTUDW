import Image from "next/image";

interface SoldProductProps {
    id: number,
    main_image: string,
    name: string,
    intial_price: string,
    closing_price: string,
}

const SoldProduct = ({ product }: { product: SoldProductProps }) => {
    return (
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg shadow-xs p-4 w-full">
            <div className="flex items-center gap-3">
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
                        Giá chốt:{" "}
                        <span className="text-[#0D9488] font-bold text-md">{product.closing_price} đ</span>
                    </span>
                </div>
            </div>
            <div className="text-right flex flex-col gap-1">
                <span className="text-slate-500 font-stretch-10% text-sm">
                    Giá ban đầu
                </span>
                <span className="text-[#0D9488] font-bold text-lg">
                    {product.intial_price} đ
                </span>
            </div>
        </div>
    );
};

export default SoldProduct;
