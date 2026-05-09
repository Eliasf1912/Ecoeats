/** 
 * valider les inputs (nom non vide, prix > 0, stock >= 0)
    récupérer le restaurant et vérifier qu'il existe
    vérifier qu'aucun produit avec le même nom n'existe dans ce restaurant
    créer le menuItem
    sauvegarder
*/


import { randomUUID } from "crypto";
import { MenuItem } from "../../../domain/entities";
import { CreateMenuItemDTO } from "../../dto";
import { restaurantRepository, menuItemRepository } from "../../ports";

export class CreateMenuItem { 

    constructor(
        private readonly restaurantRepository : restaurantRepository,
        private readonly menuItemRepository : menuItemRepository,
    ) {}

    public async execute(menuItemDTO : CreateMenuItemDTO) : Promise<void> {

        if(menuItemDTO.name.length === 0){
            throw new Error("Le nom nep eut pas être vide !")
        }

        if(menuItemDTO.price < 0){
            throw new Error("Le prix doit être supérieur à 0 !")
        }

        if(menuItemDTO.stock < 0){
            throw new Error("Le  stock doit être supérieur à 0 !")
        }

        const restaurant = await this.restaurantRepository.findById(menuItemDTO.restaurantId);

        if(!restaurant){
            throw new Error("Le restaurant n'existe pas !")
        }

        const restaurantMenuItems = await this.menuItemRepository.finditemsByRestaurantId(menuItemDTO.restaurantId);

        if(restaurantMenuItems.length > 0) {
            restaurantMenuItems.forEach( menu => {
                const menuName = menu.getName();

                if(menuName === menuItemDTO.name){
                    throw new Error("Le nom doit être unique !");
                }
            });
        }

        const newMenuItem = new MenuItem(randomUUID(),menuItemDTO.restaurantId,menuItemDTO.name,menuItemDTO.description,menuItemDTO.price,menuItemDTO.stock,menuItemDTO.allergens);

        await this.menuItemRepository.save(newMenuItem);
        
    }

}