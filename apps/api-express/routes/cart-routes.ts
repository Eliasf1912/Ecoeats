import express from "express";
import { clearCart, addItemToCart, removeItemFromCart, getCart } from "../controllers";
import { authMiddleware } from "../middlewares";

export const cartRouter = express.Router();

cartRouter.delete("/item/:itemId", authMiddleware("client"), removeItemFromCart);
cartRouter.post("/add/:itemId", authMiddleware("client"), addItemToCart);
cartRouter.delete("/clear", authMiddleware("client"), clearCart);
cartRouter.get("/", authMiddleware("client"), getCart);