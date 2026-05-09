import { DeliveryMan } from "../../domain/entities";

export interface deliveryManRepository {
    save(DeliveryMan : DeliveryMan) : Promise<DeliveryMan | null>,
    findById(DeliveryMan : string) : Promise<DeliveryMan | null>
}