const BASE_API = '/api';

const API_ROUTES = {
  user: {
    getUsers: `${BASE_API}/users`,
    getUser: (id: number) => `${BASE_API}/users${id}`,
    updateUser: (id: number) => `${BASE_API}/users${id}`,
    deleteUser: (id: number) => `${BASE_API}/users${id}`,
    createUSer: `${BASE_API}/users`,
  }

};

export default API_ROUTES;