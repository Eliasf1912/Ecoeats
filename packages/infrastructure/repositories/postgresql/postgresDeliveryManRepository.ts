import { Pool } from 'pg';
import { deliveryManRepository } from '../../../application/ports';
import { DeliveryMan, wallet } from '../../../domain/entities';
import { deliveryManExperience, deliveryState, transportType } from '../../../domain/enums';

export class PostgresDeliveryManRepository implements deliveryManRepository {
    constructor(private pool: Pool) {}

    async findById(deliveryManId: string): Promise<DeliveryMan | null> {
        const query = 'SELECT * FROM delivery_men WHERE id = $1';
        const result = await this.pool.query(query, [deliveryManId]);

        if (result.rows.length === 0) return null;
        
        return this.mapRowToDeliveryMan(result.rows[0]);
    }

    async findByEmail(email: string): Promise<DeliveryMan | null> {
        const query = 'SELECT * FROM delivery_men WHERE email = $1';
        const result = await this.pool.query(query, [email]);

        if (result.rows.length === 0) return null;
        
        return this.mapRowToDeliveryMan(result.rows[0]);
    }

    async save(deliveryMan: DeliveryMan): Promise<void> {
        const query = `
            INSERT INTO delivery_men (
                id, name, surname, email, password, phone_number, 
                experience, delivery_state, transport_type, 
                wallet_id, wallet_balance, current_deliveries
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) 
            DO UPDATE SET
                email = $4,
                password = $5,
                delivery_state = $8,
                wallet_balance = $11,
                current_deliveries = $12,
                updated_at = CURRENT_TIMESTAMP
        `;

        const id = deliveryMan.getId();
        const email = deliveryMan.getEmail();
        const password = deliveryMan.getPassword();
        const name = (deliveryMan as any).name;
        const surname = (deliveryMan as any).surname;
        const phoneNumber = (deliveryMan as any).phoneNumber;
        const experience = (deliveryMan as any).experience;
        const state = (deliveryMan as any).deliveryState;
        const transport = (deliveryMan as any).transport_type;
        const walletObj: wallet = (deliveryMan as any).wallet;
        const currentDeliveries: string[] = (deliveryMan as any).currentDeliveries;

        await this.pool.query(query, [
            id, name, surname, email, password, phoneNumber,
            experience, state, transport,
            walletObj.id, walletObj.balance, JSON.stringify(currentDeliveries)
        ]);
    }

    private mapRowToDeliveryMan(row: any): DeliveryMan {
        const walletObj: wallet = {
            id: row.wallet_id,
            balance: parseFloat(row.wallet_balance)
        };
        
        const currentDeliveries: string[] = typeof row.current_deliveries === 'string'
            ? JSON.parse(row.current_deliveries)
            : (Array.isArray(row.current_deliveries) ? row.current_deliveries : []);

        return new DeliveryMan(
            row.id,
            row.name,
            row.surname,
            row.email,
            row.password,
            row.phone_number,
            row.experience as deliveryManExperience,
            row.delivery_state as deliveryState,
            row.transport_type as transportType,
            walletObj,
            currentDeliveries
        );
    }
}