import { BaseRoute } from "./BaseRoute";
import { ProductController } from "../controllers/ProductController";
import { ProductService } from "../services/ProductService";
import { BaseController } from "../controllers/BaseController";
export class ProductRoute extends BaseRoute {
  private controller: ProductController;
  constructor() {
    super();
    this.controller = new ProductController(ProductService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/",BaseController.handleRequest(this.controller.getProducts.bind(this.controller)));
    this.router.get("/top",BaseController.handleRequest(this.controller.getTopProduct.bind(this.controller)));
    this.router.get("/sold",BaseController.handleRequest(this.controller.getSoldProducts.bind(this.controller)));
    this.router.get("/top_end",BaseController.handleRequest(this.controller.getTopEndingSoonProducts.bind(this.controller)));
    this.router.get("/top_bid",BaseController.handleRequest(this.controller.getTopBiddingProducts.bind(this.controller)));
    this.router.get("/top_price",BaseController.handleRequest(this.controller.getTopPriceProducts.bind(this.controller)));
    this.router.get("/:productId",BaseController.handleRequest(this.controller.getProductById.bind(this.controller)));
    this.router.post("/",BaseController.handleRequest(this.controller.createProduct.bind(this.controller)));
    this.router.delete("/:productId",BaseController.handleRequest(this.controller.deleteProductById.bind(this.controller)));
    this.router.patch("/:productId/description",BaseController.handleRequest(this.controller.updateProductDescription.bind(this.controller)));
    this.router.get("/:productId/questions",BaseController.handleRequest(this.controller.getQuestions.bind(this.controller)));
    this.router.post("/:productId/questions",BaseController.handleRequest(this.controller.createQuestion.bind(this.controller)));
    this.router.post("/:productId/:questionId/answers",BaseController.handleRequest(this.controller.createAnswer.bind(this.controller)));
    this.router.patch("/:productId/extend",BaseController.handleRequest(this.controller.updateProductExtend.bind(this.controller)));
  }
}

