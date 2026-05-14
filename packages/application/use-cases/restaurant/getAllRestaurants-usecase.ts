import { restaurantRepository } from "../../ports";
import { Restaurant } from "../../../domain/entities";

export class GetAllRestaurants {
    constructor(
        private readonly restaurantRepository: restaurantRepository
    ) {}

    public async execute(): Promise<Restaurant[]> {
        return await this.restaurantRepository.findAll();
    }
}