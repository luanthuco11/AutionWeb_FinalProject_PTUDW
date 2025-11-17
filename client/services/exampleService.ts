import { api, safeRequest } from "../config/axios.config"

// Một hàm để tạo kết nối tới endpoint bên backend
// Không được biết gì về frontend cả
// NO COUPLING 

export class XService {

    static async getXBySomething(something: string): Promise<any> {
        return safeRequest(async () => {
            const res = await api.get(`/X/${something}`);
            return res.data
        });
    }

    static async createX(payload: any) {
        return safeRequest(async () => {
            const res = await api.post('/X', payload);
            return res.data;
        });
    }

    static async updateX(id: string, payload: any): Promise<any> {
        return safeRequest(async () => {
            const res = await api.put(`/X/${id}`, payload)
            return res.data;
        });
    }
}

