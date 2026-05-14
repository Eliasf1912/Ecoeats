import { menuItemRepository } from "../../../application/ports";
import { MenuItem } from "../../../domain/entities";

export class InMemoryMenuItemRepository implements menuItemRepository {

    private menuItems: Map<string, MenuItem> = new Map();

    async findById(menuItemId: string): Promise<MenuItem | null> {
        return this.menuItems.get(menuItemId) ?? null;
    }

    async findItemsByRestaurantId(restaurantId : string) : Promise<MenuItem[] | []> {
        const menuItems : MenuItem[] = []
        for(const menuItem of this.menuItems.values()) {
            if(menuItem.getRestaurantId() === restaurantId) {
                menuItems.push(menuItem);
            }
        }
        return menuItems;
    }

    async save(menuItem: MenuItem): Promise<void> {
        this.menuItems.set(menuItem.getId(), menuItem);
    }

    async delete(menuItemId: string): Promise<void> {
        this.menuItems.delete(menuItemId);
    }

    async findByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
        const result: MenuItem[] = [];
        for(const menuItem of this.menuItems.values()) {
            if(menuItem.getRestaurantId() === restaurantId) {
                result.push(menuItem);
            }
        }
        return result;
    }

}
