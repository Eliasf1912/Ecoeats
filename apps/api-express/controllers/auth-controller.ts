import { Request,Response } from "express"
import { registerClientUseCase, loginClientUseCase, registerRestaurantUseCase, loginRestaurantUseCase, registerDeliveryManUseCase, loginDeliveryManUseCase } from "../container"

export const registerClient = async (req : Request, res : Response) => {
    try {
        if(!req.body){
            res.status(400).send('Il manque des informations');
            return
        }
        const token = await registerClientUseCase.execute(req.body);
        res.status(201).json({token});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
}

export const loginClient = async (req : Request, res : Response) => {
    try {
        if(!req.body){
            res.status(400).send('Il manque des informations');
            return
        }
        const token = await loginClientUseCase.execute(req.body);
        res.status(200).json({token});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
}

export const registerRestaurant = async (req : Request, res : Response) => {
    try {
        if(!req.body){
            res.status(400).send('Il manque des informations');
            return
        }
        const token = await registerRestaurantUseCase.execute(req.body);
        res.status(201).json({token});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
}

export const loginRestaurant = async (req : Request, res : Response) => {
    try {
        if(!req.body){
            res.status(400).send('Il manque des informations');
            return
        }
        const token = await loginRestaurantUseCase.execute(req.body);
        res.status(200).json({token});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
}

export const registerDeliveryMan = async (req : Request, res : Response) => {
    try {
        if(!req.body){
            res.status(400).send('Il manque des informations');
            return
        }
        const token = await registerDeliveryManUseCase.execute(req.body);
        res.status(201).json({token});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
}

export const loginDeliveryMan = async (req : Request, res : Response) => {
    try {
        if(!req.body){
            res.status(400).send('Il manque des informations');
            return
        }
        const token = await loginDeliveryManUseCase.execute(req.body);
        res.status(200).json({token});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
}