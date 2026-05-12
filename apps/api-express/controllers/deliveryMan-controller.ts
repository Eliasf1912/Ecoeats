import { Request, Response } from "express"
import { updateDeliveryManStateUseCase } from "../container"

export const updateDeliveryManState = async (req: Request, res: Response) => {
    try {
        const deliveryManId = (req as any).user.id;
        await updateDeliveryManStateUseCase.execute(deliveryManId);
        res.status(200).json({ message: "Vous n'êtes plus disponible !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
