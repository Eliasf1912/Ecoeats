import { Request, Response } from "express"
import { generateInvoiceUseCase } from "../container"

export const generateInvoice = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);
        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }
        await generateInvoiceUseCase.execute(orderId);
        res.status(200).json({ message: "Vous n'êtes plus en ligne !" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
