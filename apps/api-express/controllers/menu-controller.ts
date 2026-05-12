import { Request,Response } from "express";
import { createMenuItemUseCase, updateMenuItemUseCase, removeMenuItemUseCase, getMenuItemUseCase } from "../container";
import { CreateMenuItemDTO, UpdateMenuItemDTO } from "../../../packages/application/dto";

export const createMenuItem = async (req : Request, res : Response) => {
    try {

        const restaurantId = (req as any).user.id;

        const {
            name,
            description,
            price,
            stock,
            allergens
        } = req.body;

        const dto : CreateMenuItemDTO = {
            restaurantId,
            ...req.body
        }


        if(!name){
            res.status(400).send('Il manque le nom');
            return
        }

        if(!description){
            res.status(400).send('Il manque la description');
            return
        }

        if(price === undefined){
            res.status(400).send('Il manque le prix');
            return
        }

        if(stock === undefined){
            res.status(400).send('Il manque le stock');
            return
        }

        if(!allergens){
            res.status(400).send('Il manque les allergens');
            return
        }

        await createMenuItemUseCase.execute(dto);
        res.status(200).json("Le produit à été créer");
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
} 

export const updateMenuItem = async (req : Request, res : Response) => {
    try {

        const menuItemId = String(req.params.id);
        if(!menuItemId){
            res.status(400).send("Il manque l'id du produit !");
            return
        } 

        const {
            name,
            description,
            price,
            stock,
            allergens
        } = req.body as UpdateMenuItemDTO;

        if(!name && !description && price === undefined && stock === undefined && !allergens) {
            res.status(400).json({ message: "Il faut au moins un champ à modifier !" });
        return;
}
        await updateMenuItemUseCase.execute(req.body, menuItemId);
        res.status(200).json("Le produit à été mis à jour");
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
} 

export const removeMenuItem = async (req : Request, res : Response) => {
    try {
        const menuItemId = String(req.params.id);
        if(!menuItemId){
            res.status(400).send("Il manque l'id du produit !");
            return
        } 
        await removeMenuItemUseCase.execute(menuItemId);
        res.status(200).json("Le produit à été supprimer");
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
} 

export const getMenuItem = async (req : Request, res : Response) => {
    try {
        const menuItemId = String(req.params.id);
        if(!menuItemId){
            res.status(400).send("Il manque l'id du produit !");
            return
        } 
        const menuItem = await getMenuItemUseCase.execute(menuItemId);
        res.status(200).json({menuItem});
    } catch (error : any) {
        res.status(400).json({message : error.message})
    }
} 



