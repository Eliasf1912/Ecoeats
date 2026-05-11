import { cartRepository } from "../../../application/ports";
import { Cart } from "../../../domain/entities";

export class InMemoryCartRepository implements cartRepository {

    private carts: Map<string, Cart> = new Map();

    async findById(cartId: string): Promise<Cart | null> {
        return this.carts.get(cartId) ?? null;
    }

    async save(cart: Cart): Promise<void> {
        this.carts.set(cart.getId(), cart);
    }

    async findByClientId(clientId: string): Promise<Cart | null> {
        for(const cart of this.carts.values()) {
            if(cart.getClientId() === clientId) {
                return cart;
            }
        }
        return null;
    }
}
