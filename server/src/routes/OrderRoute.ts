import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../services/OrderService";
import { BaseRoute } from "./BaseRoute";
import { BaseController } from "../controllers/BaseController";

export class OrderRoute extends BaseRoute {
  private controller: OrderController;

  constructor() {
    super();
    this.controller = new OrderController(OrderService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", BaseController.handleRequest(this.controller.getOrder.bind(this.controller)));
    this.router.get("/:productId", BaseController.handleRequest(this.controller.getOrderById.bind(this.controller)));
    this.router.post("/", BaseController.handleRequest(this.controller.createOrder.bind(this.controller)));
    this.router.patch("/:productId/:status", BaseController.handleRequest(this.controller.updateOrderStatus.bind(this.controller)));
    this.router.get("/:productId/chat", BaseController.handleRequest(this.controller.getOrderChat.bind(this.controller)));
    this.router.post("/:productId/chat", BaseController.handleRequest(this.controller.createOrderChat.bind(this.controller)));
  }
}