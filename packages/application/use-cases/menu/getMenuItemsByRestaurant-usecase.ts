import { menuItemRepository, restaurantRepository } from "../../ports";
import { MenuItem } from "../../../domain/entities";

export class GetMenuItemsByRestaurant {
    constructor(
        private readonly restaurantRepository: restaurantRepository,
        private readonly menuItemRepository: menuItemRepository
    ) {}

    public async execute(restaurantId: string): Promise<MenuItem[]> {
        const restaurant = await this.restaurantRepository.findById(restaurantId);
        if(!restaurant){
            throw new Error("Le restaurant n'existe pas !");
        }
        return await this.menuItemRepository.findItemsByRestaurantId(restaurantId);
    }
}