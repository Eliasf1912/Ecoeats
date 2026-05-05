import { menuItem } from "../../domain/entities";

export interface menuItemRepository { 
    findById(menuItemId : string) : Promise<menuItem | null>
    findByIds(menuItemIds : string[]) : Promise<menuItem[] | []>
}