import {
  CreateAnswer,
  CreateProduct,
  CreateQuestion,
} from "../../../shared/src/types";
import { Pagination } from "../../../shared/src/types/Pagination";
import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";

export class ProductController extends BaseController {
  constructor(service: any) {
    super(service); // inject service
  }

  async getCategoryProductList(req: Request, res: Response) {
    const products = await this.service.getCategoryProductList();
    return {
      categoryProducts: products,
    };
  }

  async getProductsBySearch(req: Request, res: Response) {
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || null;
    const query = req.query.query;
    const [products, totalProducts] = await Promise.all([
      this.service.getProductsBySearch(query, limit, page),
      this.service.getTotalProductsBySearch(query),
    ]);

    return {
      products: products,
      totalProducts: totalProducts,
    };
  }

  async getProductsByCategory(req: Request, res: Response) {
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || null;
    const slug = req.query.slug;
    const sort = req.query.sort;
    const products = await this.service.getProductsByCategory(
      limit,
      page,
      slug,
      sort
    );
    const totalProducts = await this.service.getTotalProductsByCategory(slug);
    return {
      products: products,
      totalProducts: totalProducts,
    };
  }

  async getProductsBySearchSuggestion(req: Request, res: Response) {
    const query = req.query.query;
    const limit = Number(req.query.limit);
    const products = await this.service.getProductsBySearchSuggestion(
      query,
      limit
    );
    return {
      products: products,
    };
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
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || null;
    const topBiddingProducts = await this.service.getTopBiddingProducts(
      limit,
      page
    );

    const totalBiddingProducts = await this.service.getTotalBiddingProducts();

    return {
      topBiddingProducts: topBiddingProducts,
      totalBiddingProducts: totalBiddingProducts,
    };
  }

  async getTopPriceProducts(req: Request, res: Response) {
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || null;
    const topPriceProducts = await this.service.getTopPriceProducts(
      limit,
      page
    );
    const totalProducts = await this.service.getTotalProducts();

    return {
      topPriceProducts: topPriceProducts,
      totalProducts: totalProducts,
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
  async getProductBySlug(req: Request, res: Response) {
    const slug = req.params.slug;
    const product = await this.service.getProductBySlug(slug);
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
    const userId = req.headers["user-id"];

    const files = req.files as Express.Multer.File[];
    if (!files) {
      throw new Error("No files were delivered");
    }
    const mainImage = files.find((f) => f.fieldname === "main-image");
    const extraImages = files.filter((f) =>
      f.fieldname.startsWith("extra-image-")
    );

    const payloadStr = req.body.payload;
    if (!payloadStr) {
      throw new Error("No payload were delivered");
    }

    const payload: CreateProduct = JSON.parse(payloadStr);

    const newProduct = await this.service.createProduct(
      payload,
      mainImage,
      extraImages,
      userId
    );
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

  async getQuestionsByPage(req: Request, res: Response) {
    const productId = req.params.productId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const questionPagination = await this.service.getQuestionsByPage(
      productId,
      page,
      limit
    );
    return {
      questionPagination,
    };
  }

  async createQuestion(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const productId = req.params.productId;
    const createQuestion: CreateQuestion = req.body;
    const question = await this.service.createQuestion(
      createQuestion,
      userId,
      productId
    );
    return {
      question: question,
    };
  }

  async createAnswer(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const questionId = req.params.questionId;
    const createAnswer: CreateAnswer = req.body;
    const answer = await this.service.createAnswer(
      createAnswer,
      userId,
      questionId
    );
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
  async getWinningProducts(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || null;

    const products = await this.service.getWinningProducts(userId, limit, page);
    const totalProducts = await this.service.getTotalWinningProductsByUser(
      userId
    );
    return {
      products: products,
      totalProducts: totalProducts,
    };
  }
  async getBiddingProducts(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const limit = Number(req.query.limit) || null;
    const page = Number(req.query.page) || null;
    const products = await this.service.getBiddingProducts(userId, limit, page);
    const totalProducts = await this.service.getTotalBiddingProductsByUser(
      userId
    );
    return {
      products: products,
      totalProducts: totalProducts,
    };
  }
  async getProducts(req: Request, res: Response) {
    const userId = req.headers["user-id"];

    const pagination: Pagination = {
      limit: Number(req.query.limit || "5"),
      page: Number(req.query.page || "1"),
    };

    const products = await this.service.getProducts(pagination);
    const totalProducts = await this.service.getTotalProducts();
    return {
      products: products,
      totalProducts: totalProducts,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

// user/
