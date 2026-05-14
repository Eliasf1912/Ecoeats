import express from 'express';
import cors from 'cors';
import { authRouter, menuRouter, cartRouter, orderRouter, deliveryRouter, deliveryManRouter, payementRouter, restaurantRouter } from './routes/';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter);
app.use("/delivery", deliveryRouter);
app.use("/deliveryMan", deliveryManRouter);
app.use("/payement", payementRouter);
app.use("/restaurant", restaurantRouter);

export default app;