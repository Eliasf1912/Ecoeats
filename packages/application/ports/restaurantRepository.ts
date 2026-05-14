import { Restaurant } from "../../domain/entities";

export interface restaurantRepository { 
    findById(restaurantId : string | null) : Promise<Restaurant | null>
    findByEmail(email: string) : Promise<Restaurant | null>;
    findAll(): Promise<Restaurant[]> 
    save(client: Restaurant) : Promise<void>
}
