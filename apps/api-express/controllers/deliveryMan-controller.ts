import { Request, Response } from "express"
import { updateDeliveryManStateUseCase, getProposedDeliveryUseCase } from "../container"

export const updateDeliveryManState = async (req: Request, res: Response) => {
    try {
        const deliveryManId = (req as any).user.id;
        await updateDeliveryManStateUseCase.execute(deliveryManId);
        res.status(200).json({ message: "Statut mis à jour !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const getProposedDelivery = async (req: Request, res: Response) => {
    try {
        const deliveryManId = (req as any).user.id;   
        
        if(!deliveryManId){
            res.status(400).json({ message: "Il manque l'id du livreur !" });
            return;
        }

        const deliveries = await getProposedDeliveryUseCase.execute(deliveryManId);
        res.status(200).json({deliveries});
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
