import { Pool } from 'pg';
import { cartRepository } from '../../../application/ports';
import { Cart, cartItem } from '../../../domain/entities';

export class PostgresCartRepository implements cartRepository {
    constructor(private pool: Pool) {}

    async findByClientId(clientId: string): Promise<Cart | null> {
        const client = await this.pool.connect();

        try {
            const cartQuery = 'SELECT * FROM carts WHERE client_id = $1';
            const cartResult = await client.query(cartQuery, [clientId]);

            if (cartResult.rows.length === 0) return null;

            const itemsQuery = 'SELECT * FROM cart_items WHERE cart_id = $1';
            const itemsResult = await client.query(itemsQuery, [cartResult.rows[0].id]);

            return this.mapToCart(cartResult.rows[0], itemsResult.rows);
        } finally {
            client.release();
        }
    }

    async findById(cartId: string): Promise<Cart | null> {
        const client = await this.pool.connect();

        try {
            const cartQuery = 'SELECT * FROM carts WHERE id = $1';
            const cartResult = await client.query(cartQuery, [cartId]);

            if (cartResult.rows.length === 0) return null;

            const itemsQuery = 'SELECT * FROM cart_items WHERE cart_id = $1';
            const itemsResult = await client.query(itemsQuery, [cartId]);

            return this.mapToCart(cartResult.rows[0], itemsResult.rows);
        } finally {
            client.release();
        }
    }

    async save(cart: Cart): Promise<void> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const cartQuery = `
                INSERT INTO carts (id, client_id, restaurant_id)
                VALUES ($1, $2, $3)
                ON CONFLICT (id) 
                DO UPDATE SET
                    restaurant_id = $3,
                    updated_at = CURRENT_TIMESTAMP
            `;

            await client.query(cartQuery, [
                cart.getId(),
                cart.getClientId(),
                cart.getRestaurantId()
            ]);

            await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.getId()]);

            const items = cart.getItems();
            if (items.length > 0) {
                const insertItemQuery = `
                    INSERT INTO cart_items (id, cart_id, menu_item_id, quantity)
                    VALUES ($1, $2, $3, $4)
                `;

                for (const item of items) {
                    await client.query(insertItemQuery, [
                        item.id,
                        cart.getId(),
                        item.menuItemId,
                        item.quantity
                    ]);
                }
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    private mapToCart(cartRow: any, itemRows: any[]): Cart {
        const items: cartItem[] = itemRows.map(itemRow => ({
            id: itemRow.id,
            menuItemId: itemRow.menu_item_id,
            quantity: parseInt(itemRow.quantity),
            unitPrice: 0
        }));

        return new Cart(
            cartRow.id,
            cartRow.client_id,
            cartRow.restaurant_id,
            items
        );
    }
}