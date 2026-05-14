import { Pool } from 'pg';
import { clientRepository } from '../../../application/ports';
import { Client } from '../../../domain/entities';
import { address } from '../../../domain/value-objects';

export class PostgresClientRepository implements clientRepository {
    constructor(private pool: Pool) {}

    /**
     * Trouve un client par son email
     */
    async findByEmail(email: string): Promise<Client | null> {
        const query = 'SELECT * FROM clients WHERE email = $1';
        const result = await this.pool.query(query, [email]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToClient(result.rows[0]);
    }

    /**
     * Sauvegarde ou met à jour un client
     */
    async save(client: Client): Promise<void> {
        const query = `
            INSERT INTO clients (id, name, surname, password, email, address)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) 
            DO UPDATE SET
                name = $2,
                surname = $3,
                password = $4,
                email = $5,
                address = $6,
                updated_at = CURRENT_TIMESTAMP
        `;

        // Récupérer les données privées via les getters
        const id = client.getId();
        const email = client.getEmail();
        const password = client.getPassword();
        
        // Note: Il faudrait ajouter des getters pour name, surname et address dans l'entité Client
        // Pour l'instant on utilise reflection (hack temporaire)
        const name = (client as any).name;
        const surname = (client as any).surname;
        const addressObj = (client as any).address;

        const addressJson = addressObj ? JSON.stringify(addressObj) : null;

        await this.pool.query(query, [
            id,
            name,
            surname,
            password,
            email,
            addressJson
        ]);
    }

    /**
     * Convertit une ligne SQL en entité Client
     */
    private mapRowToClient(row: any): Client {
        const addressObj: address | null = row.address 
            ? (typeof row.address === 'string' 
                ? JSON.parse(row.address) 
                : row.address)
            : null;

        return new Client(
            row.id,
            row.name,
            row.surname,
            row.password,
            row.email,
            addressObj
        );
    }
}
