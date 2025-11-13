import { Response } from "express";

export class BaseController {
  protected service: any;

  constructor(service: any) {
    this.service = service; // Dependency Injection
  }

  sendSuccess(res: Response, data: any) {
    res.json({ success: true, data });
  }

  sendError(res: Response, error: any, status = 500) {
    res.status(status).json({ success: false, message: error.message || "Internal Server Error" });
  }

  

  // Template Method: controller con override
  handleRequest(...args: any[]) {
    throw new Error("handleRequest must be implemented");
  }
}
