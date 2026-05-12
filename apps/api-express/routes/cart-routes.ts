import express from "express";
import { clearCart, addItemToCart, removeItemFromCart } from "../controllers";
import { authMiddleware } from "../middlewares";

export const cartRouter = express.Router();

cartRouter.delete("/:id/item/:itemId", authMiddleware("client"), removeItemFromCart);
cartRouter.post("/add/:itemId", authMiddleware("client"), addItemToCart);
cartRouter.delete("/:id/clear", authMiddleware("client"), clearCart);