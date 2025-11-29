import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";

export class ProductController extends BaseController {
  constructor(service: any) {
    super(service); // inject service
  }

  async getProducts(req: Request, res: Response) {
    const products = await this.service.getProducts();
    return { products: products };
  }

  async getTopProduct(req: Request, res: Response) {
    const topEndingSoonProducts = await this.service.getTopEndingSoonProducts(
      5
    );
    const topBiddingProducts = await this.service.getTopBiddingProducts(5);
    const topPriceProducts = await this.service.getTopPriceProducts(5);

    return {
      topEndingSoonProducts: topEndingSoonProducts,
      topBiddingProducts: topBiddingProducts,
      topPriceProducts: topPriceProducts,
    };
  }

  async getProductById(req: Request, res: Response) {
    const product = await this.service.getProductById(req);
    return {
      product: product,
    };
  }
  async getSoldProducts(req: Request, res: Response) {
    console.log("ABC");
    const soldProducts = await this.service.getSoldProducts();
    return {
      soldProducts: soldProducts,
    };
  }

  async createProduct(req: Request, res: Response) {
    const newProduct = await this.service.createProduct(req);
    return {
      newProduct: newProduct,
    };
  }

  async deleteProductById(req: Request, res: Response) {
    const deleteProduct = await this.service.deleteProductById(req);
    return {
      deleteProduct: deleteProduct,
    };
  }

  async updateProductDescription(req: Request, res: Response) {
    const updateProduct = await this.service.updateProductDescription(req);
    return {
      updateProduct: updateProduct,
    };
  }

  async getQuestions(req: Request, res: Response) {
    const questions = await this.service.getQuestions(req);
    return {
      questions,
    };
  }

  async createQuestion(req: Request, res: Response) {
    const question = await this.service.createQuestion(req);
    return {
      question: question,
    };
  }

  async createAnswer(req: Request, res: Response) {
    const answer = await this.service.createAnswer(req);
    return {
      answer: answer,
    };
  }

  async updateProductExtend(req: Request, res: Response) {
    const productExtend = await this.service.updateProductExtend(req);
    return {
      productExtend: productExtend,
    };
  }
}

// user/
