import { MenuItem } from "../../domain/entities";

export interface menuItemRepository { 
    findById(menuItemId : string) : Promise<MenuItem | null>
    findItemsByRestaurantId(restaurantId : string) : Promise<MenuItem[] | []>
    save(menuItem : MenuItem) : Promise<void>
    delete(menuItemId: string): Promise<void>
}