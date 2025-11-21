const BASE_API = '/api';




const API_ROUTES = {
    user: {
        getUsers: `${BASE_API}/user`,
        getUser: (id: number) =>  `${BASE_API}/user${id}`,
        updateUser: (id: number) =>  `${BASE_API}/user${id}`,
        deleteUser: (id: number) =>  `${BASE_API}/user${id}`,
        createUSer: `${BASE_API}/user`,
    }

};

export default API_ROUTES;