
import { restaurantRepository } from "../../ports";
import { Restaurant } from "../../../domain/entities";

export class GetRestaurant {
    constructor(
        private readonly restaurantRepository: restaurantRepository
    ) {}

    public async execute(restaurantId: string): Promise<Restaurant> {
        const restaurant = await this.restaurantRepository.findById(restaurantId);
        if(!restaurant){
            throw new Error("Le restaurant n'existe pas !");
        }
        return restaurant;
    }
}