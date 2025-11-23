import { BidRoute } from "../routes/BidRoute";
import { CategoryRoute } from "../routes/CategoryRoute";
import { FavoriteRoute } from "../routes/FavoriteRoute";
import { OrderRoute } from "../routes/OrderRoute";
import { UserRoute } from "../routes/UserRoute";
import { ProductRoute } from "../routes/ProductRoute";

const resourceMap: Record<string, any> = {
  user: UserRoute,
  category: CategoryRoute,
  bid: BidRoute,
  product: ProductRoute,
  favorite: FavoriteRoute,
  order: OrderRoute
};
export class ResourceFactory {
  static createResource(resource: string) {
    const ResourceClass = resourceMap[resource];
    if (!ResourceClass) throw new Error("Unknown resource");
    return new ResourceClass();
  }
}
