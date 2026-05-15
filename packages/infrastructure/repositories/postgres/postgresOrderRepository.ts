import { Pool } from 'pg';
import { orderRepository } from '../../../application/ports';
import { Order, orderItem } from '../../../domain/entities';
import { orderStatus } from '../../../domain/enums';

export class PostgresOrderRepository implements orderRepository {
    constructor(private pool: Pool) {}

    async findById(orderId: string): Promise<Order | null> {
        const client = await this.pool.connect();

        try {
            const orderQuery = 'SELECT * FROM orders WHERE id = $1';
            const orderResult = await client.query(orderQuery, [orderId]);

            if (orderResult.rows.length === 0) return null;

            const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1';
            const itemsResult = await client.query(itemsQuery, [orderId]);

            return this.mapToOrder(orderResult.rows[0], itemsResult.rows);
        } finally {
            client.release();
        }
    }

    async save(order: Order): Promise<void> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const orderQuery = `
                INSERT INTO orders (
                    id, client_id, restaurant_id, status, 
                    total_price, delivery_fee, service_fee, 
                    estimated_preparation_time, paid_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (id) 
                DO UPDATE SET
                    status = $4,
                    estimated_preparation_time = $8,
                    updated_at = CURRENT_TIMESTAMP
            `;

            await client.query(orderQuery, [
                order.getId(),
                order.getClientId(),
                order.getRestaurantId(),
                (order as any).status,
                order.getTotalPrice(),
                order.getDeliveryFee(),
                order.getServiceFee(),
                (order as any).estimatedPreparationTime,
                order.getPaidAt()
            ]);

            await client.query('DELETE FROM order_items WHERE order_id = $1', [order.getId()]);

            const items = order.getItems();
            if (items.length > 0) {
                const insertItemQuery = `
                    INSERT INTO order_items (id, order_id, menu_item_id, name, unit_price, quantity)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;

                for (const item of items) {
                    await client.query(insertItemQuery, [
                        item.id, order.getId(), item.menuItemId,
                        item.unitPrice, item.quantity
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

    private mapToOrder(orderRow: any, itemRows: any[]): Order {
        const items: orderItem[] = itemRows.map(itemRow => ({
            id: itemRow.id,
            menuItemId: itemRow.menu_item_id,
            unitPrice: parseFloat(itemRow.unit_price),
            quantity: parseInt(itemRow.quantity)
        }));

        return new Order(
            orderRow.id,
            orderRow.client_id,
            orderRow.restaurant_id,
            orderRow.status as orderStatus,
            items,
            parseFloat(orderRow.total_price),
            parseFloat(orderRow.delivery_fee),
            parseFloat(orderRow.service_fee),
            orderRow.restaurantAddress,
            orderRow.delivery_address,
            orderRow.estimated_preparation_time,
            orderRow.updated_at ? new Date(orderRow.updated_at) : null,
            orderRow.created_at,
            orderRow.paid_at ? new Date(orderRow.paid_at) : null,
            orderRow.notes
        );
    }
}