
import { Delivery } from "../../../domain/entities"
import { deliveryRepository } from "../../../application/ports"

export class InMemoryDeliveryRepository implements deliveryRepository{

    private deliveries: Map<string, Delivery> = new Map();

    async save(delivery : Delivery) : Promise<void> {
        this.deliveries.set(delivery.getId(),delivery);
    }

    async findById(deliveryId : string) : Promise<Delivery | null> {
        return this.deliveries.get(deliveryId) ?? null;
    }

    async findAllProposedDeliveriesByDeliveryManId(deliveryManId: string): Promise<Delivery[]> {
        const result: Delivery[] = [];
        for(const delivery of this.deliveries.values()) {
            if(delivery.getDeliveryManId() === deliveryManId && delivery.isProposed()) {
                result.push(delivery);
            }
        }
        return result;
    }

}