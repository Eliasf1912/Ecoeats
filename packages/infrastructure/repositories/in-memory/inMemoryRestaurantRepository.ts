import { restaurantRepository } from "../../../application/ports";
import { Restaurant } from "../../../domain/entities";

export class InMemoryRestaurantRepository implements restaurantRepository {

    private restaurants: Map<string, Restaurant> = new Map();

    async findById(restaurantId: string): Promise<Restaurant | null> {
        return this.restaurants.get(restaurantId) ?? null;
    }

    async findByEmail(email: string): Promise<Restaurant | null> {
        for(const restaurant of this.restaurants.values()) {
            if(restaurant.getEmail() === email) {
                return restaurant;
            }
        }
        return null;
    }

    async save(restaurant: Restaurant): Promise<void> {
        this.restaurants.set(restaurant.getId(), restaurant);
    }

    async findAll(): Promise<Restaurant[]> {
        return Array.from(this.restaurants.values());
    }

}
