/** 
 * récupérer le menuItem et vérifier qu'il existe
    valider les inputs (prix >= 0, stock >= 0, nom non vide si fourni)
    mettre à jour les champs via une méthode update() dans MenuItem
    sauvegarder
*/

import { UpdateMenuItemDTO } from "../../dto";
import { menuItemRepository } from "../../ports";

export class UpdateMenuItem { 

    constructor(
        private readonly menuItemRepository : menuItemRepository,
    ) {}

    public async execute(updateMenuItemDTO : UpdateMenuItemDTO, menuItemId : string) : Promise<void> {

        if(updateMenuItemDTO.name !== undefined && updateMenuItemDTO.name.length === 0){
            throw new Error("Le nom ne peut pas être vide !");
        }

        if(updateMenuItemDTO.price !== undefined && updateMenuItemDTO.price < 0){
            throw new Error("Le prix ne peut pas être négatif !");
        }

        if(updateMenuItemDTO.stock !== undefined && updateMenuItemDTO.stock < 0){
            throw new Error("Le stock ne peut pas être négatif !");
        }

        const menuItem = await this.menuItemRepository.findById(menuItemId);

        if(!menuItem){
            throw new Error("Le produit n'existe pas !")
        }

        menuItem.update(updateMenuItemDTO.name,updateMenuItemDTO.description,updateMenuItemDTO.price,updateMenuItemDTO.stock,updateMenuItemDTO.allergens)

        await this.menuItemRepository.save(menuItem);
        
    }

}