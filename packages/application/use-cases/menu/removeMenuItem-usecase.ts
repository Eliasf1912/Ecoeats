
import { menuItemRepository } from "../../ports";

export class RemoveMenuItem { 

    constructor(
        private readonly menuItemRepository : menuItemRepository,
    ) {}

    public async execute(menuItemId : string) : Promise<void> {

        const menuItem = await this.menuItemRepository.findById(menuItemId);

        if(!menuItem){
            throw new Error("Le produit n'existe pas !")
        }

        await this.menuItemRepository.delete(menuItemId);
        
    }

}