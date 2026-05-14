import { Pool } from 'pg';
import { menuItemRepository } from '../../../application/ports';
import { MenuItem } from '../../../domain/entities';

export class PostgresMenuItemRepository implements menuItemRepository {
    constructor(private pool: Pool) {}

    /**
     * Trouve un plat par son ID
     */
    async findById(menuItemId: string): Promise<MenuItem | null> {
        const query = 'SELECT * FROM menu_items WHERE id = $1';
        const result = await this.pool.query(query, [menuItemId]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToMenuItem(result.rows[0]);
    }

    /**
     * Trouve tous les plats d'un restaurant
     */
    async findItemsByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
        const query = 'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY name';
        const result = await this.pool.query(query, [restaurantId]);

        return result.rows.map(row => this.mapRowToMenuItem(row));
    }

    /**
     * Sauvegarde ou met à jour un plat
     */
    async save(menuItem: MenuItem): Promise<void> {
        const query = `
            INSERT INTO menu_items (id, restaurant_id, name, description, price, stock, allergens)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) 
            DO UPDATE SET
                name = $3,
                description = $4,
                price = $5,
                stock = $6,
                allergens = $7,
                updated_at = CURRENT_TIMESTAMP
        `;

        // Récupérer les données via getters et reflection
        const id = menuItem.getId();
        const restaurantId = menuItem.getRestaurantId();
        const name = menuItem.getName();
        const price = menuItem.getPrice();
        const stock = menuItem.getStock();
        
        // Propriétés privées (via reflection temporaire)
        const description = (menuItem as any).description;
        const allergens = (menuItem as any).allergen; // Note: typo dans l'entité (allergen au lieu de allergens)

        await this.pool.query(query, [
            id,
            restaurantId,
            name,
            description,
            price,
            stock,
            JSON.stringify(allergens)
        ]);
    }

    /**
     * Supprime un plat
     */
    async delete(menuItemId: string): Promise<void> {
        const query = 'DELETE FROM menu_items WHERE id = $1';
        await this.pool.query(query, [menuItemId]);
    }

    /**
     * Convertit une ligne SQL en entité MenuItem
     */
    private mapRowToMenuItem(row: any): MenuItem {
        const allergens: string[] = typeof row.allergens === 'string' 
            ? JSON.parse(row.allergens) 
            : (Array.isArray(row.allergens) ? row.allergens : []);

        return new MenuItem(
            row.id,
            row.restaurant_id,
            row.name,
            row.description,
            parseFloat(row.price),
            parseInt(row.stock),
            allergens
        );
    }
}
