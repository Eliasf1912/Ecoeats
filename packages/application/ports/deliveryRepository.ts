import { Delivery } from "../../domain/entities";

export interface deliveryRepository {
    save(Delivery : Delivery) : Promise<Delivery | null>
    findById(Delivery : string) : Promise<Delivery | null>
}