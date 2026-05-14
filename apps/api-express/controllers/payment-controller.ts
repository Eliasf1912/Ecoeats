import { Request, Response } from "express"
import { generateInvoiceUseCase } from "../container"

export const generateInvoice = async (req: Request, res: Response) => {
    try {
        const orderId = String(req.params.id);
        if(!orderId){
            res.status(400).json({ message: "Il manque l'id de la commande !" });
            return;
        }
        const invoice = await generateInvoiceUseCase.execute(orderId);
        res.status(200).json({ invoice }); 
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}
