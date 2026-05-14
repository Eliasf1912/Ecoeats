import { Pool } from 'pg';
import { deliveryRepository } from '../../../application/ports';
import { Delivery } from '../../../domain/entities';
import { deliveryStatus } from '../../../domain/enums';

export class PostgresDeliveryRepository implements deliveryRepository {
    constructor(private pool: Pool) {}

    async findById(deliveryId: string): Promise<Delivery | null> {
        const query = 'SELECT * FROM deliveries WHERE id = $1';
        const result = await this.pool.query(query, [deliveryId]);

        if (result.rows.length === 0) return null;
        
        return this.mapRowToDelivery(result.rows[0]);
    }

    async save(delivery: Delivery): Promise<void> {
        const query = `
            INSERT INTO deliveries (id, order_id, delivery_man_id, distance, delivery_status, earnings)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) 
            DO UPDATE SET
                delivery_man_id = $3,
                delivery_status = $5,
                earnings = $6,
                updated_at = CURRENT_TIMESTAMP
        `;

        const id = delivery.getId();
        const orderId = delivery.getOrderId();
        const deliveryManId = delivery.getDeliveryManId();
        const distance = delivery.getDistance();
        const status = (delivery as any).deliveryStatus;
        const earnings = delivery.getEarnings();

        await this.pool.query(query, [id, orderId, deliveryManId, distance, status, earnings]);
    }

    async findAllProposedDeliveriesByDeliveryManId(deliveryManId: string): Promise<Delivery[] | []> {
        const query = 'SELECT * FROM deliveries WHERE delivery_man_id = $1 AND delivery_status = $2';
        const result = await this.pool.query(query, [deliveryManId, 'proposed']);

        if (result.rows.length === 0) return [];

        return result.rows.map((row: any) => this.mapRowToDelivery(row));
    }

    private mapRowToDelivery(row: any): Delivery {
        return new Delivery(
            row.id,
            row.order_id,
            parseFloat(row.distance),
            row.delivery_status as deliveryStatus,
            row.delivery_man_id,
            row.picked_up_at ? new Date(row.picked_up_at) : null,
            row.delivery_at ? new Date(row.delivery_at) : null,
            row.earnings ? parseFloat(row.earnings) : null
        );
    }
}