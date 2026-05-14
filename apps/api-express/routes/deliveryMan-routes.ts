import express from "express";
import { updateDeliveryManState, getProposedDelivery } from "../controllers";
import { authMiddleware } from "../middlewares";

export const deliveryManRouter = express.Router();

deliveryManRouter.patch("/changeState", authMiddleware("deliveryman"), updateDeliveryManState);
deliveryManRouter.get("/", authMiddleware("deliveryman"), getProposedDelivery);

