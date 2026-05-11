import { Order } from "../../domain/entities";

export interface orderRepository {
    save(order : Order) : Promise<void>
    findById(orderId : string) : Promise<Order | null>
}