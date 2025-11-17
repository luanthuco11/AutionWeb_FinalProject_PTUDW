import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { XService } from "@/services/exampleService";
import { STALE_10_MIN } from "@/config/query.config";

// Một hàm xử lý logic REACT, và chỉ được biết tới REACT(FRONT END) thôi
// Nó không được biết về api
class XHook {

    static useXBySomething(something: string) {
        return useQuery({
            queryKey: ["x_by_something", something],

            queryFn: () => XService.getXBySomething(something),

            enabled: !!something,

            staleTime: STALE_10_MIN,

            // Transform data tại Hook (select)
            select: (data) => {
                // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
                return data;
            }
        });
    }

    static useUpdateX() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (params: { id: string; payload: any }) =>
                XService.updateX(params.id, params.payload),

            onSuccess: (_, params) => {
                // Invalidate cache của dữ liệu
                queryClient.invalidateQueries({
                    queryKey: ["x_by_something"],
                });
            }
        });
    }
}

export default XHook;
