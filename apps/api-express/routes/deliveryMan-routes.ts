import express from "express";
import { updateDeliveryManState } from "../controllers";
import { authMiddleware } from "../middlewares";

export const deliveryManRouter = express.Router();

deliveryManRouter.patch("/:id/changeState", authMiddleware("deliveryman"), updateDeliveryManState);

