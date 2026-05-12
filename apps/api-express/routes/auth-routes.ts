import express from "express"
import {registerClient, loginClient, registerDeliveryMan, loginDeliveryMan, registerRestaurant, loginRestaurant} from "../controllers/";


export const authRouter = express.Router();

authRouter.post("/register/client", registerClient);
authRouter.post("/login/client", loginClient);
authRouter.post("/register/deliveryman", registerDeliveryMan);
authRouter.post("/login/deliveryman", loginDeliveryMan);
authRouter.post("/register/restaurant", registerRestaurant);
authRouter.post("/login/restaurant", loginRestaurant);