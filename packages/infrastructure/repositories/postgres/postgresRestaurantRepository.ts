import { Pool } from 'pg';
import { restaurantRepository } from '../../../application/ports';
import { Restaurant } from '../../../domain/entities';
import { address } from '../../../domain/value-objects';
import { restaurantStatus } from '../../../domain/enums';

export class PostgresRestaurantRepository implements restaurantRepository {
    constructor(private pool: Pool) {}

    /**
     * Trouve un restaurant par son ID
     */
    async findById(restaurantId: string | null): Promise<Restaurant | null> {
        if (!restaurantId) {
            return null;
        }

        const query = 'SELECT * FROM restaurants WHERE id = $1';
        const result = await this.pool.query(query, [restaurantId]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToRestaurant(result.rows[0]);
    }

    /**
     * Trouve un restaurant par son email
     */
    async findByEmail(email: string): Promise<Restaurant | null> {
        const query = 'SELECT * FROM restaurants WHERE email = $1';
        const result = await this.pool.query(query, [email]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToRestaurant(result.rows[0]);
    }

    /**
     * Sauvegarde ou met à jour un restaurant
     */
    async save(restaurant: Restaurant): Promise<void> {
        const query = `
            INSERT INTO restaurants (id, name, description, email, password, owner, phone_number, address, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) 
            DO UPDATE SET
                name = $2,
                description = $3,
                email = $4,
                password = $5,
                owner = $6,
                phone_number = $7,
                address = $8,
                status = $9,
                updated_at = CURRENT_TIMESTAMP
        `;

        const id = restaurant.getId();
        const name = restaurant.getRestaurantName();
        const email = restaurant.getEmail();
        const password = restaurant.getPassword();
        const addressObj = restaurant.getAddress();
        
        // Propriétés privées (via reflection temporaire)
        const description = (restaurant as any).description;
        const owner = (restaurant as any).owner;
        const phoneNumber = (restaurant as any).phoneNumber;
        const status = (restaurant as any).status;

        await this.pool.query(query, [
            id,
            name,
            description,
            email,
            password,
            owner,
            phoneNumber,
            JSON.stringify(addressObj),
            status
        ]);
    }

    /**
     * Convertit une ligne SQL en entité Restaurant
     */
    private mapRowToRestaurant(row: any): Restaurant {
        const addressObj: address = typeof row.address === 'string' 
            ? JSON.parse(row.address) 
            : row.address;

        const status = row.status as restaurantStatus;

        return new Restaurant(
            row.id,
            row.name,
            row.description,
            row.email,
            row.password,
            row.owner,
            row.phone_number,
            addressObj,
            status
        );
    }

    async findAll(): Promise<Restaurant[]> {
        const result = await this.pool.query("SELECT * FROM restaurants");
        
        return result.rows.map(row => new Restaurant(
            row.id,
            row.name,
            row.description,
            row.email,
            row.password,
            row.owner,
            row.phone_number,
            {
                street: row.street,
                city: row.city,
                country: row.country,
                postal_Code: row.postal_code,
                lat: row.lat,
                lng: row.lng
            },
            row.status
        ));
    }
}
