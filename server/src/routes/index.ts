import { Router } from "express";
import { ResourceFactory } from "../factories/ResourceFactory";

const router = Router();

// NOTE: dung dấu backtick (``) khi dinh nghia chuoi trong routerKeyFactory


// Khong 's trong resource 
const resource = [`user`, `favorite`, `order`];

resource.forEach((name) => {
  const routerClass = ResourceFactory.createResource(name);
  //  UserRoute
  router.use(`/${name}`, routerClass.router); 
});

export default router;