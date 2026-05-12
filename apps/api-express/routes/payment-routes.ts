import express from "express";
import { generateInvoice } from "../controllers";
import { authMiddleware } from "../middlewares";

export const payementRouter = express.Router();

payementRouter.get("/:id/generateInvoice", authMiddleware("client"), generateInvoice);

