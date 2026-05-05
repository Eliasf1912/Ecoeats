import { restaurant } from "../../domain/entities";

export interface restaurantRepository { 
    findById(restaurantId : string) : Promise<restaurant | null>
}