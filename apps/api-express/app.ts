import express from 'express';
import cors from 'cors';
import { authRouter, menuRouter, cartRouter, orderRouter, deliveryRouter, deliveryManRouter, payementRouter } from './routes/';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Routes (on les ajoutera après)
app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter);
app.use("/delivery", deliveryRouter);
app.use("/deliveryMan", deliveryManRouter);
app.use("/payement", payementRouter);

export default app;