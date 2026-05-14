import { Request, Response } from "express";
import { getRestaurantUseCase, getAllRestaurantsUseCase, getMenuItemsByRestaurantUseCase } from "../container";

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = String(req.params.id);
        if(!restaurantId){
            res.status(400).json({ message: "Il manque l'id du restaurant !" });
            return;
        }
        const restaurant = await getRestaurantUseCase.execute(restaurantId);
        res.status(200).json({ restaurant });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await getAllRestaurantsUseCase.execute();
        res.status(200).json({ restaurants });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const getMenuItemsByRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = String(req.params.id);
        if(!restaurantId){
            res.status(400).json({ message: "Il manque l'id du restaurant !" });
            return;
        }
        const menuItems = await getMenuItemsByRestaurantUseCase.execute(restaurantId);
        res.status(200).json({ menuItems });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}