import { Controller, Post, Body, Inject, Res } from "@nestjs/common";
import { Response } from "express";
import {
    RegisterClient,
    LoginClient,
    RegisterRestaurant,
    LoginRestaurant,
    RegisterDeliveryMan,
    LoginDeliveryMan,
} from "../../../packages/application/use-cases";

@Controller("auth")
export class AuthController {
    private registerClientUseCase: RegisterClient;
    private loginClientUseCase: LoginClient;
    private registerRestaurantUseCase: RegisterRestaurant;
    private loginRestaurantUseCase: LoginRestaurant;
    private registerDeliveryManUseCase: RegisterDeliveryMan;
    private loginDeliveryManUseCase: LoginDeliveryMan;

    constructor(
        @Inject("ClientRepository") private readonly clientRepository: any,
        @Inject("RestaurantRepository") private readonly restaurantRepository: any,
        @Inject("DeliveryManRepository")
        private readonly deliveryManRepository: any,
        @Inject("PasswordService") private readonly passwordService: any,
        @Inject("TokenService") private readonly tokenService: any,
    ) {
        this.registerClientUseCase = new RegisterClient(
            this.clientRepository,
            this.passwordService,
            this.tokenService,
        );
        this.loginClientUseCase = new LoginClient(
            this.clientRepository,
            this.passwordService,
            this.tokenService,
        );
        this.registerRestaurantUseCase = new RegisterRestaurant(
            this.restaurantRepository,
            this.passwordService,
            this.tokenService,
        );
        this.loginRestaurantUseCase = new LoginRestaurant(
            this.restaurantRepository,
            this.passwordService,
            this.tokenService,
        );
        this.registerDeliveryManUseCase = new RegisterDeliveryMan(
            this.deliveryManRepository,
            this.passwordService,
            this.tokenService,
        );
        this.loginDeliveryManUseCase = new LoginDeliveryMan(
            this.deliveryManRepository,
            this.passwordService,
            this.tokenService,
        );
    }

    @Post("register/client")
    async registerClient(@Body() body: any, @Res() res: Response) {
        try {
            if (!body) {
                res.status(400).send("Il manque des informations");
                return;
            }
            const token = await this.registerClientUseCase.execute(body);
            res.status(201).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Post("login/client")
    async loginClient(@Body() body: any, @Res() res: Response) {
        try {
            if (!body) {
                res.status(400).send("Il manque des informations");
                return;
            }
            const token = await this.loginClientUseCase.execute(body);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Post("register/restaurant")
    async registerRestaurant(@Body() body: any, @Res() res: Response) {
        try {
            if (!body) {
                res.status(400).send("Il manque des informations");
                return;
            }
            const token = await this.registerRestaurantUseCase.execute(body);
            res.status(201).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Post("login/restaurant")
    async loginRestaurant(@Body() body: any, @Res() res: Response) {
        try {
            if (!body) {
                res.status(400).send("Il manque des informations");
                return;
            }
            const token = await this.loginRestaurantUseCase.execute(body);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Post("register/deliveryman")
    async registerDeliveryMan(@Body() body: any, @Res() res: Response) {
        try {
            if (!body) {
                res.status(400).send("Il manque des informations");
                return;
            }
            const token = await this.registerDeliveryManUseCase.execute(body);
            res.status(201).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Post("login/deliveryman")
    async loginDeliveryMan(@Body() body: any, @Res() res: Response) {
        try {
            if (!body) {
                res.status(400).send("Il manque des informations");
                return;
            }
            const token = await this.loginDeliveryManUseCase.execute(body);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
