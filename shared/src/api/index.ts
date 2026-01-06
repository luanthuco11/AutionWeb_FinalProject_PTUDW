const BASE_API = `${process.env.NEXT_PUBLIC_API_URL}/api`;
const USER_API = `${BASE_API}/user`;
const UPGRADE_API = `${BASE_API}/upgrade`;
const RATING_API = `${BASE_API}/rating`;
const PRODUCT_API = `${BASE_API}/product`;
const AUTH_API = `${BASE_API}/auth`;
const CATEGORY_API = `${BASE_API}/category`;
const BID_API = `${BASE_API}/bid`;
const FAVORITE_API = `${BASE_API}/favorite`;
const ORDER_API = `${BASE_API}/order`;
const SYSTEM_API = `${BASE_API}/system`;
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
    fetchMe: `${USER_API}/me`,
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
      return `${CATEGORY_API}/slug/${slug}?page=${page}&limit=${limit}&sort=${sort}`;
    }, //GET
    createCategory: `${CATEGORY_API}`, //POST
    updateCategory: (id: number) => `${CATEGORY_API}/${id}`, //PATCH
    deleteCategory: (id: number) => `${CATEGORY_API}/${id}`, //DELETE
  },
  bid: {
    getBidLogs: (id: number) => `${BID_API}/${id}`, //GET
    getCanBid: (productSlug: string) => `${BID_API}/${productSlug}/can-bid`, //GET
    getUserBid: (productId: number) => `${BID_API}/user-bid/${productId}`, //GET
    createBid: `${BID_API}`, //POST
    createReject: `${BID_API}/reject`, //POST
    createBlacklist: `${BID_API}/blacklist`, //POST
  },
  rating: {
    getRating: (userId: number, offset: number) =>
      `${RATING_API}/${userId}/${offset}`, //GET
    getOneRating: (raterId: number, targetId: number) =>
      `${RATING_API}/rater/${raterId}/target/${targetId}`, // GET
    getTotalRating: (userId: number) => `${RATING_API}/total/${userId}`, //GET
    createRating: `${RATING_API}`, //POST
    updateRating: `${RATING_API}`, //PATCH
  },
  auth: {
    createAccount: `${AUTH_API}/signUp`,
    signIn: `${AUTH_API}/signIn`,
    signInAdmin: `${AUTH_API}/signInAdmin`,
    signOut: `${AUTH_API}/signOut`,
    signOutAdmin: `${AUTH_API}/signOutAdmin`,
    refresh: `${AUTH_API}/refresh`,
    refreshAdmin: `${AUTH_API}/refreshAdmin`,
    forgetPassword: `${AUTH_API}/forget-password`,
    changePassword: `${AUTH_API}/change-password`,
    verifyOTP: `${AUTH_API}/verify-otp`,
    verifyRegisterOTP: `${AUTH_API}/verify-register-otp`,
    resetPassword: `${AUTH_API}/reset-password`,
    resetUserPassword: `${AUTH_API}/reset-user-password`, //PATCH
    reSendRegisterOTP: `${AUTH_API}/reSend-register-otp`,
    reSendResetPasswordOTP: `${AUTH_API}/reSend-resetPassword-otp`,
  },
  product: {
    getProducts: (pagination: Pagination) =>
      `${PRODUCT_API}?page=${pagination.page}&limit=${pagination.limit}`, //GET
    getCategoryProductList: `${PRODUCT_API}/category`,
    getProductTop: `${PRODUCT_API}/top`, // GET
    getProductsBySearch: (
      query: string,
      limit: number,
      page: number,
      sort: string
    ) =>
      `${PRODUCT_API}/search?page=${page}&limit=${limit}&query=${query}&sort=${sort}`, // GET
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
    getSellingProduct: (pagination: Pagination) =>
      `${PRODUCT_API}/selling?limit=${pagination.limit}&page=${pagination.page}`, // GET
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
    buyerPayOrder: (productId: number) =>
      `${ORDER_API}/${productId}/buyer/pay-order`, // PATCH
    sellerConfirmOrder: (productId: number, buyerId: number) =>
      `${ORDER_API}/${productId}/seller/confirm-order/${buyerId}`, // PATCH
    buyerConfirmShipped: (productId: number) =>
      `${ORDER_API}/${productId}/buyer/confirm-shipped`, // PATCH
    sellerRejectOrder: (productId: number, buyerId: number) =>
      `${ORDER_API}/${productId}/seller/reject-order/${buyerId}`, // PATCH
    getOrderChat: (productId: number) => `${ORDER_API}/${productId}/chat`, // GET
    createOrderChat: (productId: number) => `${ORDER_API}/${productId}/chat`, // POST
  },
  system: {
    getProductRenewTime: `${SYSTEM_API}/renew-time`, // GET
    updateProductRenewTime: `${SYSTEM_API}/renew-time`, //PATCH
    getProductMinTime: `${SYSTEM_API}/min-time`, //GET
    updateProductMinTime: `${SYSTEM_API}/min-time`, //PATCH
    getProductThresholdTime: `${SYSTEM_API}/threshold-time`, //GET
    updateProductThresholdTime: `${SYSTEM_API}/threshold-time`, //PATCH
  },
};

export default API_ROUTES;
