import { Router } from "express";
import { ResourceFactory } from "../factories/ResourceFactory";

const router = Router();

const resource = [
  `user`,
  `category`,
  `bid`,
  `product`,
  `favorite`,
  `order`,
  `upgrade`,
  `rating`,
  `auth`,
  `system`,
];

resource.forEach((name) => {
  const routerClass = ResourceFactory.createResource(name);
  router.use(`/${name}`, routerClass.router);
});

export default router;
