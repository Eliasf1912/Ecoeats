import express from "express";
import { getRestaurant, getAllRestaurants, getMenuItemsByRestaurant } from "../controllers";
import { authMiddleware } from "../middlewares";

export const restaurantRouter = express.Router();

restaurantRouter.get("/", authMiddleware("client"), getAllRestaurants);
restaurantRouter.get("/:id", authMiddleware("client"), getRestaurant);
restaurantRouter.get("/:id/menu", authMiddleware("client"), getMenuItemsByRestaurant);