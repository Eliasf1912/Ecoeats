import { Delivery } from "../../domain/entities";

export interface deliveryRepository {
    save(Delivery : Delivery) : Promise<void>
    findById(Delivery : string) : Promise<Delivery | null>
}