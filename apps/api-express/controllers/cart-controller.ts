import { Request, Response } from "express"
import { clearCartUseCase, addItemToCartUseCase, removeItemFromCartUseCase, getCartUseCase } from "../container"

export const clearCart = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        await clearCartUseCase.execute(clientId);
        res.status(200).json({ message: "Panier vidé !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const addItemToCart = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const menuItemId = String(req.params.itemId);
        const { quantity } = req.body;

        if(!menuItemId){
            res.status(400).json({ message: "Il manque le menuItemId !" });
            return;
        }

        if(!quantity){
            res.status(400).json({ message: "Il manque la quantity !" });
            return;
        }

        const cart = await addItemToCartUseCase.execute(clientId, menuItemId, quantity);
        res.status(200).json({ cart });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const removeItemFromCart = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const itemId = String(req.params.itemId);

        if(!itemId){
            res.status(400).json({ message: "Il manque l'id de l'item !" });
            return;
        }

        await removeItemFromCartUseCase.execute(clientId, itemId);
        res.status(200).json({ message: "Le produit a été retiré du panier !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;
        const cart = await getCartUseCase.execute(clientId);
        res.status(200).json({ cart });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}