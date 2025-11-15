
namespace ProductType {
    export interface BiddingProduct {
        id: number,
        main_image: string,
        name: string,
        current_price: string,
        bidding_price: string,
    }

    export interface SoldProduct {
        id: number,
        main_image: string,
        name: string,
        intial_price: string,
        closing_price: string,
    }

    export interface WinningProduct{
        id: number,
        main_image: string,
        name: string,
        bidding_price: string,
    }
}

export default ProductType