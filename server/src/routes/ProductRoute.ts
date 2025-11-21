import { BaseRoute } from "./BaseRoute";
import { ProductController } from "../controllers/ProductController";
import { ProductService } from "../services/ProductService";
import { BaseController } from "../controllers/BaseController";
export class ProductRoute extends BaseRoute {
  private productController: ProductController;
  constructor() {
    super();
    this.productController = new ProductController(ProductService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/",BaseController.handleRequest(this.productController.getProducts.bind(this.productController)));
    this.router.get("/top",BaseController.handleRequest(this.productController.getTopProduct.bind(this.productController)));
    this.router.get("/:productId",BaseController.handleRequest(this.productController.getProductById.bind(this.productController)));
    this.router.post("/",BaseController.handleRequest(this.productController.createProduct.bind(this.productController)));
    this.router.delete("/:productId",BaseController.handleRequest(this.productController.deleteProductById.bind(this.productController)));
    this.router.patch("/:productId/description",BaseController.handleRequest(this.productController.updateProductDescription.bind(this.productController)));
    this.router.get("/:productId/questions",BaseController.handleRequest(this.productController.getQuestions.bind(this.productController)));
    this.router.post("/:productId/questions",BaseController.handleRequest(this.productController.createQuestion.bind(this.productController)));
    this.router.post("/:productId/:questionId/answers",BaseController.handleRequest(this.productController.createAnswer.bind(this.productController)));
    this.router.post("/:productId/extend",BaseController.handleRequest(this.productController.updateProductExtend.bind(this.productController)));
  }
}

