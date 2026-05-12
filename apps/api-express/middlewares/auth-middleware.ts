import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../container';

export const authMiddleware = (role : string ) => {
    return(req : Request, res : Response, next : NextFunction) => {

        const header = req.headers['authorization'];

        if(!header){
            res.status(400).json({ message: "Token manquant !" });
            return
        }
  
        const token = header.split(" ")[1];

        if(!token){
            res.status(400).json({ message: "Token manquant !" });
            return
        }

        try {
            const tokenVerified = tokenService.verify(token);
            if(tokenVerified.role !== role){
                res.status(401).json({ message: "Accès non autorisé !" });
                return;
            }
            (req as any).user = tokenVerified;
            next();
        } catch (error) {
            res.status(401).json({ message: "Token invalide ou expiré !" });
        }
    }
}