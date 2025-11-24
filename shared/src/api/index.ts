const BASE_API = "http://localhost:8080/api";
const PRODUCT_API = `${BASE_API}/product`;
const CATEGORY_API = `${BASE_API}/category`;
const BID_API = `${BASE_API}/bid`;
const FAVORITE_API = `${BASE_API}/favorite`;
const ORDER_API = `${BASE_API}/order`;
import { Pagination } from "../types/Pagination";

const API_ROUTES = {
  user: {
    getUsers: `${BASE_API}/users`,
    getUser: (id: number) => `${BASE_API}/users${id}`,
    updateUser: (id: number) => `${BASE_API}/users${id}`,
    deleteUser: (id: number) => `${BASE_API}/users${id}`,
    createUSer: `${BASE_API}/users`,
  },
  category: {
    getCategories: `${CATEGORY_API}`, //GET
    getProductsByCategory: (pagination: Pagination) =>
      `${CATEGORY_API}/${pagination.id}/products?page${pagination.page}&limit=${pagination.limit}&sort=${pagination.sort}`, //GET
    createCategory: `${CATEGORY_API}`, //POST
    updateCategory: (id: number) => `${CATEGORY_API}/${id}`, //PATCH
    deleteCategory: (id: number) => ` ${CATEGORY_API}/${id}`, //DELETE
  },
  bid: {
    getBidLogs: (id: number) => `${BID_API}/${id}`, //GET
    createBid: `${BID_API}`, //POST
    createReject: `${BID_API}/reject`, //POST
  },
  product: {
    getProducts: `${PRODUCT_API}`, // GET
    getProductTop: `${PRODUCT_API}/top`, // GET 
    getProductById: (id: number) => `${PRODUCT_API}/:${id}`, // GET
    createProduct: `${PRODUCT_API}`, // POST
    updateProductDescription: (id: number) => `${PRODUCT_API}/${id}/description`, // PATCH
    deleteProductById: (id: number) => `${PRODUCT_API}/${id}`, // DELETE
    geProductQuestion: (id: number) => `${PRODUCT_API}/${id}/questions`, // GET
    createProductQuestion: (id: number) => `${PRODUCT_API}/${id}/questions`, // POST
    createProductAnswer: (idProduct: number, idQuestion: number) => `${PRODUCT_API}/${idProduct}/${idQuestion}/answers`, // POST
    updateProductExtend: (id: number) => `${PRODUCT_API}/${id}/extend`, // PATCH
  },
  favorite: {
    getFavorite: FAVORITE_API, // GET
    addFavorite: (productId: number) => `${FAVORITE_API}/${productId}`, // POST
    removeFavorite: (productId: number) => `${FAVORITE_API}/${productId}`, // DELETE
  },
  order: {
    getOrder: ORDER_API, // GET
    getOrderById: (productId: number) => `${ORDER_API}/${productId}`, // GET
    createOrder: ORDER_API, // POST
    updateOrderStatus: (productId: number, status: string) => `/${ORDER_API}/${productId}/${status}`, // PATCH
    getOrderChat: (productId: number) => `${ORDER_API}/${productId}/chat`, // GET
    createOrderChat: (productId: number) =>  `${ORDER_API}/${productId}/chat` // POST
  }
};

export default API_ROUTES;


