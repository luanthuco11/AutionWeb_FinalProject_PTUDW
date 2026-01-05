import { OrderController } from "../controllers/OrderController";
import { OrderService } from "../services/OrderService";
import { BaseRoute } from "./BaseRoute";
import { BaseController } from "../controllers/BaseController";
import { protectedRoutes } from "../middlewares/authMiddleware";
import { BidService } from "../services/BidService";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export class OrderRoute extends BaseRoute {
  private controller: OrderController;

  constructor() {
    super();
    this.controller = new OrderController(
      OrderService.getInstance(BidService.getInstance())
    );
    this.initRoutes();
  }

  initRoutes() {
    this.router.use(protectedRoutes);
    this.router.get(
      "/",
      BaseController.handleRequest(
        this.controller.getOrder.bind(this.controller)
      )
    );
    this.router.patch(
      "/:productId/buyer/pay-order",
      upload.any(),
      BaseController.handleRequest(
        this.controller.buyerPayOrder.bind(this.controller)
      )
    );
    this.router.patch(
      "/:productId/seller/confirm-order/:buyerId",
      BaseController.handleRequest(
        this.controller.sellerConfirmOrder.bind(this.controller)
      )
    );
    this.router.patch(
      "/:productId/buyer/confirm-shipped",
      BaseController.handleRequest(
        this.controller.buyerConfirmShipped.bind(this.controller)
      )
    );
    this.router.patch(
      "/:productId/seller/reject-order/:buyerId",
      BaseController.handleRequest(
        this.controller.sellerRejectOrder.bind(this.controller)
      )
    );
    this.router.get(
      "/:productId",
      BaseController.handleRequest(
        this.controller.getOrderById.bind(this.controller)
      )
    );
    this.router.post(
      "/",
      BaseController.handleRequest(
        this.controller.createOrder.bind(this.controller)
      )
    );
    this.router.patch(
      "/:productId/:status",
      BaseController.handleRequest(
        this.controller.updateOrderStatus.bind(this.controller)
      )
    );
    this.router.get(
      "/:productId/chat",
      BaseController.handleRequest(
        this.controller.getOrderChat.bind(this.controller)
      )
    );
    this.router.post(
      "/:productId/chat",
      BaseController.handleRequest(
        this.controller.createOrderChat.bind(this.controller)
      )
    );
  }
}
