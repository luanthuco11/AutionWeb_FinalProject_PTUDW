const BASE_API = "http://localhost:8080/api";
const USER_API = `${BASE_API}/user`;
const UPGRADE_API = `${BASE_API}/upgrade`;
const RATING_API = `${BASE_API}/rating`;
const PRODUCT_API = `${BASE_API}/product`;
const CATEGORY_API = `${BASE_API}/category`;
const BID_API = `${BASE_API}/bid`;
const FAVORITE_API = `${BASE_API}/favorite`;
const ORDER_API = `${BASE_API}/order`;
import { Pagination } from "../types/Pagination";

const API_ROUTES = {
  user: {
    getUsers: (pagination: Pagination) =>
      `${USER_API}?page=${pagination.page}&limit=${pagination.limit}`, //GET
    getUser: (id: number) => `${BASE_API}/users${id}`,
    updateUser: (id: number) => `${BASE_API}/users${id}`,
    deleteUser: (id: number) => `${USER_API}/${id}`,
    createUSer: `${BASE_API}/users`,
    getProfile: () => `${USER_API}/profile`, //GET
    updateProfile: `${USER_API}/profile`, //PATCH
    updatePassword: `${USER_API}/password`, //PATCH
  },
  upgrade: {
    getUpgradeRequests: (pagination: Pagination) => `${UPGRADE_API}/request`, //GET
    createSellerRequest: `${UPGRADE_API}/request`, //POST
    getRequestStatus: (id: number) => `${UPGRADE_API}/status/${id}`, //GET
    updateApproveRequest: `${UPGRADE_API}/approve`, //PATCH
    updateRejectRequest: `${UPGRADE_API}/reject`, //PATCH
  },
  category: {
    getCategories: `${CATEGORY_API}`, //GET
    getCountProduct: `${CATEGORY_API}/count`, //GET
    getCategoryDetailById: (id: number) => `${CATEGORY_API}/detail/${id}`, // GET
    getProductsByCategoryId: (pagination: Pagination) =>
      `${CATEGORY_API}/${pagination.id}/products?page=${pagination.page}&limit=${pagination.limit}&sort=${pagination.sort}`, //GET
    getProductsByCategorySlug: (
      slug: string,
      page: number,
      limit: number,
      sort: string
    ) => {
      console.log("page:,", page);
      return `${CATEGORY_API}/slug/${slug}?page=${page}&limit=${limit}&sort=${sort}`;
    }, //GET
    createCategory: `${CATEGORY_API}`, //POST
    updateCategory: (id: number) => `${CATEGORY_API}/${id}`, //PATCH
    deleteCategory: (id: number) => ` ${CATEGORY_API}/${id}`, //DELETE
  },
  bid: {
    getBidLogs: (id: number) => `${BID_API}/${id}`, //GET
    getUserBid: (productId: number) => `${BID_API}/user-bid/${productId}`, //GET
    createBid: `${BID_API}`, //POST
    createReject: `${BID_API}/reject`, //POST
  },
  rating: {
    getRating: (userId: number, offset: number) =>
      `${RATING_API}/${userId}/${offset}`, //GET
    getTotalRating: (userId: number) => `${RATING_API}/total/${userId}`, //GET
    createRating: `${RATING_API}`, //POST
  },
  product: {
    getProducts: (pagination: Pagination) =>
      `${PRODUCT_API}?page=${pagination.page}&limit=${pagination.limit}`, //GET
    getCategoryProductList: `${PRODUCT_API}/category`,
    getProductTop: `${PRODUCT_API}/top`, // GET
    getProductsBySearch: (query: string, limit: number, page: number) =>
      `${PRODUCT_API}/search?page=${page}&limit=${limit}&query=${query}`, // GET
    getProductsBySearchSuggestion: (query: string, limit: number) =>
      `${PRODUCT_API}/search-suggestion?query=${query}&limit=${limit}`, // GET
    getProductById: (id: number) => `${PRODUCT_API}/${id}`, // GET
    getProductsByCategory: (
      slug: string,
      page: number,
      limit: number,
      sort: string
    ) => `${CATEGORY_API}/${slug}?page${page}&limit=${limit}&sort=${sort}`, //GET
    getSoldProduct: `${PRODUCT_API}/sold`, // GET
    getBiddingProduct: (limit: number, page: number) =>
      `${PRODUCT_API}/bidding?limit=${limit}&page=${page}`, // GET
    getWinningProduct: (limit: number, page: number) =>
      `${PRODUCT_API}/winning?limit=${limit}&page=${page}`, // GET
    getTopEndingSoonProduct: (limit: number, page: number) =>
      `${PRODUCT_API}/top_end?limit=${limit}&page=${page}`, // GET
    getTopBiddingProduct: (limit: number, page: number) =>
      `${PRODUCT_API}/top_bid?limit=${limit}&page=${page}`, // GET
    getTopPriceProduct: (limit: number, page: number) =>
      `${PRODUCT_API}/top_price?limit=${limit}&page=${page}`, // GET
    getProductBySlug: (slug: string) => `${PRODUCT_API}/slug/${slug}`, // GET
    createProduct: `${PRODUCT_API}`, // POST
    updateProductDescription: (id: number) =>
      `${PRODUCT_API}/${id}/description`, // PATCH
    deleteProductById: (id: number) => `${PRODUCT_API}/${id}`, // DELETE
    getProductQuestion: (id: number) => `${PRODUCT_API}/${id}/questions`, // GET
    getProductQuestionsByPage: (
      id: number,
      page: number = 1,
      limit: number = 10
    ) => `${PRODUCT_API}/${id}/questions-by-page?page=${page}&limit=${limit}`, // GET
    createProductQuestion: (id: number) => `${PRODUCT_API}/${id}/questions`, // POST
    createProductAnswer: (idProduct: number, idQuestion: number) =>
      `${PRODUCT_API}/${idProduct}/${idQuestion}/answers`, // POST
    updateProductExtend: (id: number) => `${PRODUCT_API}/${id}/extend`, // PATCH
  },
  favorite: {
    getAllFavorite: `${FAVORITE_API}/all`, // get
    getFavorite: (pagination: Pagination) =>
      `${FAVORITE_API}?page=${pagination.page}&limit=${pagination.limit}`, // GET
    addFavorite: (productId: number) => `${FAVORITE_API}/${productId}`, // POST
    removeFavorite: (productId: number) => `${FAVORITE_API}/${productId}`, // DELETE
  },
  order: {
    getOrder: ORDER_API, // GET
    getOrderById: (productId: number) => `${ORDER_API}/${productId}`, // GET
    createOrder: ORDER_API, // POST
    updateOrderStatus: (productId: number, status: string) =>
      `/${ORDER_API}/${productId}/${status}`, // PATCH
    getOrderChat: (productId: number) => `${ORDER_API}/${productId}/chat`, // GET
    createOrderChat: (productId: number) => `${ORDER_API}/${productId}/chat`, // POST
  },
};

export default API_ROUTES;
