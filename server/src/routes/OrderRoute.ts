import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../services/OrderService";
import { BaseRoute } from "./BaseRoute";

export class OrderRoute extends BaseRoute {
  private controller: OrderController;

  constructor() {
    super();
    this.controller = new OrderController(OrderService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
      this.router.get("/", this.controller.getOrder.bind(this.controller));
      this.router.get("/:productId", this.controller.getOrderById.bind(this.controller));
      this.router.post("/", this.controller.createOrder.bind(this.controller));
      this.router.patch("/:productId/:status", this.controller.updateOrderStatus.bind(this.controller));
      this.router.get("/:productId/chat", this.controller.getOrderChat.bind(this.controller));
      this.router.post("/:productId/chat", this.controller.createOrderChat.bind(this.controller));
  }
}