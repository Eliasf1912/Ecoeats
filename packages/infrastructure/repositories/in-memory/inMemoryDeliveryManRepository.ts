
import { DeliveryMan } from "../../../domain/entities"
import { deliveryManRepository } from "../../../application/ports"

export class InMemoryDeliveryManRepository implements deliveryManRepository{

    private deliveryMen: Map<string, DeliveryMan> = new Map();

    async save(deliveryMan : DeliveryMan) : Promise<void> {
        this.deliveryMen.set(deliveryMan.getId(),deliveryMan);
    }

    async findById(deliveryManId : string) : Promise<DeliveryMan | null> {
        return this.deliveryMen.get(deliveryManId) ?? null;
    }

}