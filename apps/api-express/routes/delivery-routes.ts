import express from "express";
import { acceptDelivery, refuseDelivery, pickupDelivery, completeDelivery } from "../controllers";
import { authMiddleware } from "../middlewares";

export const deliveryRouter = express.Router();

deliveryRouter.patch("/:id/accept", authMiddleware("deliveryman"), acceptDelivery);
deliveryRouter.patch("/:id/refuse", authMiddleware("deliveryman"), refuseDelivery);
deliveryRouter.patch("/:id/pickup/:orderId", authMiddleware("deliveryman"), pickupDelivery);
deliveryRouter.patch("/:id/complete/:deliveryManId", authMiddleware("deliveryman"), completeDelivery);
