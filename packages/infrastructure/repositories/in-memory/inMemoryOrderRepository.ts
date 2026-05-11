
import { Order } from "../../../domain/entities"
import { orderRepository } from "../../../application/ports"

export class InMemoryOrderRepository implements orderRepository{

    private orders: Map<string, Order> = new Map();

    async save(order : Order) : Promise<void> {
        this.orders.set(order.getId(),order);
    }

    async findById(orderId : string) : Promise<Order | null> {
        return this.orders.get(orderId) ?? null;
    }

}