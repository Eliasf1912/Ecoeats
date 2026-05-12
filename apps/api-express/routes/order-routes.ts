import express from "express"
import { markOrderAsReady, cancelOrder, createOrder, refuseOrder, previewOrder, acceptedOrder, startPreparingOrder } from "../controllers/";
import { authMiddleware } from "../middlewares";

export const orderRouter = express.Router();

orderRouter.post("/", authMiddleware('client'), createOrder);
orderRouter.post("/preview", authMiddleware('client'), previewOrder);
orderRouter.patch("/:id/cancel", authMiddleware('client'), cancelOrder);
orderRouter.patch("/:id/accept", authMiddleware('restaurant'), acceptedOrder);
orderRouter.patch("/:id/refuse", authMiddleware('restaurant'), refuseOrder);
orderRouter.patch("/:id/preparing", authMiddleware('restaurant'), startPreparingOrder);
orderRouter.patch("/:id/ready", authMiddleware('restaurant'), markOrderAsReady);
