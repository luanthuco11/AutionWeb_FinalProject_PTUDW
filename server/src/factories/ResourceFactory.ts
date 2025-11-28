import { BidRoute } from "../routes/BidRoute";
import { CategoryRoute } from "../routes/CategoryRoute";
import { FavoriteRoute } from "../routes/FavoriteRoute";
import { OrderRoute } from "../routes/OrderRoute";
import { UserRoute } from "../routes/UserRoute";
import { ProductRoute } from "../routes/ProductRoute";
import { UpgradeRoute } from "../routes/UpgradeRoute";
const resourceMap: Record<string, any> = {
  user: UserRoute,
  category: CategoryRoute,
  bid: BidRoute,
  product: ProductRoute,
  favorite: FavoriteRoute,
  order: OrderRoute,
  upgrade: UpgradeRoute
};
export class ResourceFactory {
  static createResource(resource: string) {
    const ResourceClass = resourceMap[resource];
    if (!ResourceClass) throw new Error("Unknown resource");
    return new ResourceClass();
  }
}
