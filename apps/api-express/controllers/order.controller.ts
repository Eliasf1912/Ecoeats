import { Request, Response } from "express";
import { markOrderAsReadyUseCase, cancelOrderUseCase, createOrderUseCase, refuseOrderUseCase, previewOrderUseCase, acceptedOrderUseCase, startPreparingOrderUseCase } from "../container";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;

        const { deliveryAddress, tip = 0 } = req.body;

        if(!deliveryAddress){
            res.status(400).json({ message: "Il manque l'adresse de livraison !" });
            return;
        }

        const orderId = await createOrderUseCase.execute(clientId, deliveryAddress,tip);
        res.status(201).json({ orderId });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const previewOrder = async (req: Request, res: Response) => {
    try {
        const clientId = (req as any).user.id;

        const { deliveryAddress, tip = 0 } = req.body;

        if(!deliveryAddress){
            res.status(400).json({ message: "Il manque l'adresse de livraison !" });
            return;
        }

        const orderPreview = await previewOrderUseCase.execute(clientId, deliveryAddress, tip);
        res.status(200).json({ orderPreview });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);

        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }

        await cancelOrderUseCase.execute(orderId);
        res.status(200).json({ message: "La commande a bien été annulée." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const acceptedOrder = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);

        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }

        const { prepTime } = req.body;

        if(prepTime === undefined || typeof prepTime !== 'number'){
            res.status(400).json({ message: "Il manque prepTime (nombre de minutes) !" });
            return;
        }

        await acceptedOrderUseCase.execute(orderId, prepTime);
        res.status(200).json({ message: "La commande a bien été acceptée." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const refuseOrder = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);

        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }

        await refuseOrderUseCase.execute(orderId);
        res.status(200).json({ message: "La commande a bien été refusée." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const startPreparingOrder = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);

        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }

        await startPreparingOrderUseCase.execute(orderId);
        res.status(200).json({ message: "La commande est maintenant en préparation." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const markOrderAsReady = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);

        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }

        await markOrderAsReadyUseCase.execute(orderId);
        res.status(200).json({ message: "La commande est prête !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}