const BASE_API = '/api';
const FAVORITE_API = `${BASE_API}/favorite`;
const ORDER_API = `${BASE_API}/order`;

const API_ROUTES = {
  user: {
    getUsers: `${BASE_API}/users`,
    getUser: (id: number) => `${BASE_API}/users${id}`,
    updateUser: (id: number) => `${BASE_API}/users${id}`,
    deleteUser: (id: number) => `${BASE_API}/users${id}`,
    createUSer: `${BASE_API}/users`,
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