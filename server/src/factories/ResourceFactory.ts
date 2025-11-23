import { FavoriteRoute } from "../routes/FavoriteRoute";
import { OrderRoute } from "../routes/OrderRoute";
import { UserRoute } from "../routes/UserRoute";


const resourceMap: Record<string, any> = {
    user: UserRoute,
    favorite: FavoriteRoute,
    order: OrderRoute
}
export class ResourceFactory {
    static createResource(resource: string){
        const ResourceClass = resourceMap[resource];
        if (!ResourceClass) throw new Error("Unknown resource");
        return new ResourceClass();
    }
}


