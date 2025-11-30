import { CreateAnswer, CreateProduct, CreateQuestion } from "../../../shared/src/types";
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

  async getTopEndingSoonProducts(req: Request, res: Response) {
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || null;
    const topEndingSoonProducts = await this.service.getTopEndingSoonProducts(
      limit,
      page
    );
    const totalProducts = await this.service.getTotalProducts();

    return {
      topEndingSoonProducts: topEndingSoonProducts,
      totalProducts: totalProducts,
    };
  }

  async getTopBiddingProducts(req: Request, res: Response) {
    const topBiddingProducts = await this.service.getTopBiddingProducts();

    return {
      topBiddingProducts: topBiddingProducts,
    };
  }

  async getTopPriceProducts(req: Request, res: Response) {
    const topPriceProducts = await this.service.getTopPriceProducts();

    return {
      topPriceProducts: topPriceProducts,
    };
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
    const productId = req.params.productId;
    const product = await this.service.getProductById(productId);
    return {
      product: product,
    };
  }
  async getSoldProducts(req: Request, res: Response) {
    const soldProducts = await this.service.getSoldProducts();
    return {
      soldProducts: soldProducts,
    };
  }

  async createProduct(req: Request, res: Response) {
    const product: CreateProduct = req.body;
    const userId = req.headers["user-id"];
    console.log("this is req: ", req.headers);
    const newProduct = await this.service.createProduct(product, userId);
    return {
      newProduct: newProduct,
    };
  }

  async deleteProductById(req: Request, res: Response) {
    const productId = req.params.productId;
    const deleteProduct = await this.service.deleteProductById(productId);
    return {
      deleteProduct: deleteProduct,
    };
  }

  async updateProductDescription(req: Request, res: Response) {
    const productId = req.params.productId;
    const description = req.body.description;
    const updateProduct = await this.service.updateProductDescription(
      productId,
      description
    );
    return {
      updateProduct: updateProduct,
    };
  }

  async getQuestions(req: Request, res: Response) {
    const productId = req.params.productId;
    const questions = await this.service.getQuestions(productId);
    return {
      questions,
    };
  }

  async createQuestion(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const productId = req.params.productId;
    const createQuestion: CreateQuestion = req.body;
    const question = await this.service.createQuestion(createQuestion, userId, productId);
    return {
      question: question,
    };
  }

  async createAnswer(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const questionId = req.params.questionId;;
    const createAnswer: CreateAnswer = req.body;
    const answer = await this.service.createAnswer(createAnswer, userId, questionId);
    return {
      answer: answer,
    };
  }

  async updateProductExtend(req: Request, res: Response) {
    const productId = req.params.productId;
    const auto_extend = req.body.auto_extend;
    const productExtend = await this.service.updateProductExtend(
      productId,
      auto_extend
    );
    return {
      productExtend: productExtend,
    };
  }
}

// user/
