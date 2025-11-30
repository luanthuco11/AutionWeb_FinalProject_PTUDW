import { Request, Response, NextFunction } from "express";

export type AsyncControllerFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<any>;

export class BaseController {
  protected service: any;

  constructor(service: any) {
    this.service = service; // Dependency Injection
  }


  static handleRequest(controllerFn: AsyncControllerFunction) {
    return async (req: Request, res: Response) => {
      try {
        // Gọi controller và nhận kết quả
        const result = await controllerFn(req, res);
        return res.status(200).json({
          success: true,
          ...result,
        });
      } catch (error: any) {
        console.error("Controller Error:", error);
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";

        return res.status(statusCode).json({
          success: false,
          message: message,
        });
      }
    };
  }
}
