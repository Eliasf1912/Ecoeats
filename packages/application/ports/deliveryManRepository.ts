import { DeliveryMan } from "../../domain/entities";

export interface deliveryManRepository {
    save(DeliveryMan : DeliveryMan) : Promise<void>,
    findById(DeliveryMan : string) : Promise<DeliveryMan | null>
}