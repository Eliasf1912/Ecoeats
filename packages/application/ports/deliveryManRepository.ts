import { DeliveryMan } from "../../domain/entities";

export interface deliveryManRepository {
    findByEmail(email: string) : Promise<DeliveryMan | null>;
    save(DeliveryMan : DeliveryMan) : Promise<void>,
    findById(DeliveryMan : string) : Promise<DeliveryMan | null>
}