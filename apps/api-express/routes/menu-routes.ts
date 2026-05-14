import express from "express"
import {getMenuItem, createMenuItem, removeMenuItem, updateMenuItem} from "../controllers/";
import { authMiddleware } from "../middlewares";


export const menuRouter = express.Router();

menuRouter.get("/:id", authMiddleware('restaurant'),  getMenuItem);
menuRouter.post("/", authMiddleware('restaurant'),  createMenuItem);
menuRouter.delete("/:id", authMiddleware('restaurant'),  removeMenuItem);
menuRouter.put("/:id", authMiddleware('restaurant'),  updateMenuItem);
