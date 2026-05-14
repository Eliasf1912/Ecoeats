import { Pool, PoolConfig } from 'pg';

// Configuration de connexion PostgreSQL
const poolConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'ecoeats',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ecoeats_db',
    max: 20, // Nombre maximum de clients dans le pool
    idleTimeoutMillis: 30000, // Temps avant qu'un client inactif soit fermé
    connectionTimeoutMillis: 2000, // Temps maximum d'attente de connexion
};


//Crée et retourne une instance de Pool PostgreSQL

export const createPostgresPool = (): Pool => {
    return new Pool(poolConfig);
};

//Pool singleton pour réutilisation
let pool: Pool | null = null;

export const getPostgresPool = (): Pool => {
    if (!pool) {
        pool = createPostgresPool();
    }
    return pool;
};

// Ferme le pool de connexions (utile pour les tests ou l'arrêt propre)
export const closePool = async (): Promise<void> => {
    if (pool) {
        await pool.end();
        pool = null;
    }
};
