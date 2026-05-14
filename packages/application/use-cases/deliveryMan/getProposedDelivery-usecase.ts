import { deliveryRepository } from "../../ports";
import { Delivery } from "../../../domain/entities";

export class GetProposedDelivery {

    constructor(
        private readonly deliveryRepository : deliveryRepository
    ){}

    public async execute(deliveryManId : string) : Promise<Delivery[]> {

        const deliveries = await this.deliveryRepository.findAllProposedDeliveriesByDeliveryManId(deliveryManId);

        return deliveries;
    }
}