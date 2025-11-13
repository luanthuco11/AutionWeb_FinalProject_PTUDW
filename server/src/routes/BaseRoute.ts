import { Router } from "express";

export class BaseRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    throw new Error("initRoutes must be implemented");
  }
}
