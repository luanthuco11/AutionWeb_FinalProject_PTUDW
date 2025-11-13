import Image from "next/image";

type bidding_product = {
    id: number,
    main_image: string,
    name: string,
    current_price: string,
    bidding_price: string,
}

const BiddingProduct = ({ product }: { product: bidding_product }) => {
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
                        Giá đấu của bạn:{" "}
                        <span className="text-teal-600 font-semibold">{product.bidding_price} đ</span>
                    </span>
                </div>
            </div>
            <div className="text-right flex flex-col gap-1">
                <span className="text-gray-400 font-stretch-50% text-xs">
                    Giá hiện tại
                </span>
                <span className="text-teal-500 font-bold text-sm">
                    {product.current_price} đ
                </span>
            </div>
        </div>
    );
};

// const mockBiddingProducts = [
//     {
//         id: 1,
//         main_image: 'https://via.placeholder.com/150',
//         name: 'Product 1',
//         current_price: "100",
//         bidding_price: "120",
//     },
//     {
//         id: 2,
//         main_image: 'https://via.placeholder.com/150',
//         name: 'Product 2',
//         current_price: "200",
//         bidding_price: "220",
//     },
//     {
//         id: 3,
//         main_image: 'https://via.placeholder.com/150',
//         name: 'Product 3',
//         current_price: "300",
//         bidding_price: "350",
//     },
//     {
//         id: 4,
//         main_image: "/mygf.png",
//         name: "My-Masterpiece",
//         bidding_price: "999.999.999",
//         current_price: "999.999.999"
//     }
// ];

// const BiddingProducts = () => {
//     return (
//         <div className="flex flex-col justify-between gap-3 items-center">
//             {mockBiddingProducts.map(p => (
//                 <BiddingProduct key={p.name} product={p} />
//             ))}
//         </div>
//     );
// };


export default BiddingProduct;
