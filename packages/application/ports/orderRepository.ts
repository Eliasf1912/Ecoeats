import { Order } from "../../domain/entities";

export interface orderRepository {
    save(order : Order) : Promise<Order | null>
}