const BASE_API = '/api';
const BASE_PRODUCT = `/${BASE_API}/product`;


const API_ROUTES = {
  user: {
    getUsers: `${BASE_API}/users`,
    getUser: (id: number) => `${BASE_API}/users${id}`,
    updateUser: (id: number) => `${BASE_API}/users${id}`,
    deleteUser: (id: number) => `${BASE_API}/users${id}`,
    createUSer: `${BASE_API}/users`,
  },
  product: {
    getProducts: `${BASE_PRODUCT}`, // GET
    getProductTop: `${BASE_PRODUCT}/top`, // GET 
    getProductById: (id: number) => `${BASE_PRODUCT}/:${id}`, // GET
    createProduct: `${BASE_PRODUCT}`, // POST
    updateProductDescription: (id: number) => `${BASE_PRODUCT}/${id}/description`, // PATCH
    deleteProductById: (id: number) => `${BASE_PRODUCT}/${id}`, // DELETE
    geProductQuestion: (id: number) => `${BASE_PRODUCT}/${id}/questions`, // GET
    createProductQuestion: (id: number) => `${BASE_PRODUCT}/${id}/questions`, // POST
    createProductAnswer: (idProduct: number, idQuestion: number) => `${BASE_PRODUCT}/${idProduct}/${idQuestion}/answers`, // POST
    updateProductExtend: (id: number) => `${BASE_PRODUCT}/${id}/extend`, // PATCH
  }
};

export default API_ROUTES;