// delivery.controller.ts
import { Request, Response } from "express";
import { acceptDeliveryUseCase, refuseDeliveryUseCase, pickupDeliveryUseCase, completeDeliveryUseCase } from "../container";

export const acceptDelivery = async (req: Request, res: Response) => {
    try {
        const deliveryId = String(req.params.id);
        if(!deliveryId){
            res.status(400).json({ message: "Il manque l'id de la livraison !" });
            return;
        }
        await acceptDeliveryUseCase.execute(deliveryId);
        res.status(200).json({ message: "Livraison acceptée !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const refuseDelivery = async (req: Request, res: Response) => {
    try {
        const deliveryId = String(req.params.id);
        if(!deliveryId){
            res.status(400).json({ message: "Il manque l'id de la livraison !" });
            return;
        }
        await refuseDeliveryUseCase.execute(deliveryId);
        res.status(200).json({ message: "Livraison refusée !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const pickupDelivery = async (req: Request, res: Response) => {
    try {
        const deliveryId = String(req.params.id);
        if(!deliveryId){
            res.status(400).json({ message: "Il manque l'id de la livraison !" });
            return;
        }
        const orderId = String(req.params.orderId);
        if(!orderId){
            res.status(400).json({ message: "Il manque l'orderId !" });
            return;
        }
        await pickupDeliveryUseCase.execute(orderId, deliveryId);
        res.status(200).json({ message: "Commande récupérée !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const completeDelivery = async (req: Request, res: Response) => {
    try {
        const deliveryId = String(req.params.id);
        const deliveryManId = String(req.params.deliveryManId);
        
        if(!deliveryId || !deliveryManId){
            res.status(400).json({ message: "Il manque des paramètres !" });
            return;
        }

        const tip = req.body.tip ?? 0;

        await completeDeliveryUseCase.execute(deliveryManId, deliveryId, tip);
        res.status(200).json({ message: "Livraison complétée !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
