import { restaurantRepository } from "../../../application/ports";
import { Restaurant } from "../../../domain/entities";

export class InMemoryRestaurantRepository implements restaurantRepository {

    private restaurants: Map<string, Restaurant> = new Map();

    async findById(restaurantId: string): Promise<Restaurant | null> {
        return this.restaurants.get(restaurantId) ?? null;
    }

}
