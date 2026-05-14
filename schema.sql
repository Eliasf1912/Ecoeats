-- ============================================
-- ECOEATS - Schéma PostgreSQL
-- ============================================

-- Extension pour UUID (si besoin)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: clients
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address JSONB NULL,  -- Stocké en JSON: {street, city, country, postal_Code, lat, lng}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherche rapide par email
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- ============================================
-- TABLE: restaurants
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    address JSONB NOT NULL,  -- {street, city, country, postal_Code, lat, lng}
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',  -- OPEN, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_restaurants_email ON restaurants(email);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);

-- ============================================
-- TABLE: menu_items
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(255) PRIMARY KEY,
    restaurant_id VARCHAR(255) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    allergens JSONB DEFAULT '[]'::jsonb,  -- Array de strings en JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Un restaurant ne peut pas avoir 2 plats avec le même nom
    UNIQUE(restaurant_id, name)
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_stock ON menu_items(stock) WHERE stock > 0;

-- ============================================
-- TABLE: carts
-- ============================================
CREATE TABLE IF NOT EXISTS carts (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(255) NULL REFERENCES restaurants(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Un client ne peut avoir qu'un seul panier
    UNIQUE(client_id)
);

CREATE INDEX IF NOT EXISTS idx_carts_client ON carts(client_id);

-- ============================================
-- TABLE: cart_items
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(255) PRIMARY KEY,
    cart_id VARCHAR(255) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(255) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Un panier ne peut pas avoir 2 fois le même item
    UNIQUE(cart_id, menu_item_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    restaurant_id VARCHAR(255) NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    delivery_fee DECIMAL(10, 2) NOT NULL CHECK (delivery_fee >= 0),
    service_fee DECIMAL(10, 2) NOT NULL CHECK (service_fee >= 0),
    estimated_preparation_time INTEGER NULL,  -- en minutes
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(255) NOT NULL,  -- Pas de FK car c'est un snapshot
    name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================
-- TABLE: delivery_men
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_men (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    experience VARCHAR(50) NOT NULL DEFAULT 'NORMAL',  -- NORMAL, EXPERT
    delivery_state VARCHAR(50) NOT NULL DEFAULT 'UNAVAILABLE',  -- AVAILABLE, UNAVAILABLE
    transport_type VARCHAR(50) NOT NULL DEFAULT 'BIKE',  -- BIKE, SCOOTER, CAR
    wallet_id VARCHAR(255) NOT NULL,
    wallet_balance DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (wallet_balance >= 0),
    current_deliveries JSONB DEFAULT '[]'::jsonb,  -- Array d'IDs de deliveries
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_men_email ON delivery_men(email);
CREATE INDEX IF NOT EXISTS idx_delivery_men_state ON delivery_men(delivery_state);

-- ============================================
-- TABLE: deliveries
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_man_id VARCHAR(255) NULL REFERENCES delivery_men(id) ON DELETE SET NULL,
    distance DECIMAL(10, 2) NOT NULL CHECK (distance >= 0),  -- en km
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    earnings DECIMAL(10, 2) NULL CHECK (earnings >= 0),
    picked_up_at TIMESTAMP NULL,
    delivery_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Une commande ne peut avoir qu'une seule livraison
    UNIQUE(order_id)
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_delivery_man ON deliveries(delivery_man_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(delivery_status);

-- ============================================
-- Trigger pour updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger sur toutes les tables avec updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_men_updated_at BEFORE UPDATE ON delivery_men
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
