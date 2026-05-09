import { Restaurant } from "../../domain/entities";

export interface restaurantRepository { 
    findById(restaurantId : string | null) : Promise<Restaurant | null>
}
