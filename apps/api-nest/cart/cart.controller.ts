import {
    Controller,
    Post,
    Delete,
    Get,
    Body,
    Param,
    Inject,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
    AddItemToCart,
    RemoveItemFromCart,
    ClearCart,
    GetCart,
} from "../../../packages/application/use-cases";
import { AuthGuard } from '../auth/auth.guard';

@Controller("cart")
@UseGuards(AuthGuard('client'))
export class CartController {

    private readonly addItemToCartUseCase : AddItemToCart;
    private readonly removeItemFromCartUseCase : RemoveItemFromCart;
    private readonly clearCartUseCase : ClearCart;
    private readonly getCartUseCase : GetCart;

    constructor(
        @Inject("CartRepository") private readonly cartRepository: any,
        @Inject('MenuItemRepository') private readonly mnuItemRepository: any,
    ) {
        this.addItemToCartUseCase = new AddItemToCart(this.cartRepository, this.mnuItemRepository);

        this.removeItemFromCartUseCase = new RemoveItemFromCart(this.cartRepository)

        this.getCartUseCase = new GetCart(this.cartRepository);

        this.clearCartUseCase = new ClearCart(this.cartRepository);
    }

    @Delete("item/:itemId")
    async removeItem(
        @Req() req: Request,
        @Res() res: Response,
        @Param("itemId") itemId: string,
    ) {
        try {
            const clientId = (req as any).user?.id;
            if (!itemId) {
                res.status(400).json({ message: "Il manque l'id de l'item !" });
                return;
            }
            await this.removeItemFromCartUseCase.execute(clientId, itemId);
            res.status(200).json({ message: "Le produit a été retiré du panier !" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Post("add/:itemId")
    async addItem(
        @Req() req: Request,
        @Res() res: Response,
        @Param("itemId") menuItemId: string,
        @Body() body: any,
    ) {
        try {
            const clientId = (req as any).user?.id;
            const { quantity } = body;
            if (!menuItemId) {
                res.status(400).json({ message: "Il manque le menuItemId !" });
                return;
            }
            if (!quantity) {
                res.status(400).json({ message: "Il manque la quantity !" });
                return;
            }
            const cart = await this.addItemToCartUseCase.execute(
                clientId,
                menuItemId,
                quantity,
            );
            res.status(200).json({ cart });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Delete("clear")
    async clear(@Req() req: Request, @Res() res: Response) {
        try {
            const clientId = (req as any).user?.id;
            await this.clearCartUseCase.execute(clientId);
            res.status(200).json({ message: "Panier vidé !" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @Get()
    async getCart(@Req() req: Request, @Res() res: Response) {
        try {
            const clientId = (req as any).user?.id;
            const cart = await this.getCartUseCase.execute(clientId);
            res.status(200).json({ cart });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
