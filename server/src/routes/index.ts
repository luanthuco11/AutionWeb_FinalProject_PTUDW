import { Router } from "express";
import { ResourceFactory } from "../factories/ResourceFactory";

const router = Router();

const resources = ["user"];

resources.forEach((name) => {
  const resource = ResourceFactory.createResource(name);
  router.use(`/${name}s`, resource.router); 
});

export default router;
