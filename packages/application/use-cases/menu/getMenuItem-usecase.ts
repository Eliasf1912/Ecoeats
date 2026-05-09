
import { MenuItem } from "../../../domain/entities";
import { menuItemRepository } from "../../ports";

export class GetMenuItem { 

    constructor(
        private readonly menuItemRepository : menuItemRepository,
    ) {}

    public async execute(menuItemId : string) : Promise<MenuItem | null> {

        return await this.menuItemRepository.findById(menuItemId);
        
    }

}