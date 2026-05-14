-- ============================================
-- FIXTURES ECOEATS
-- ============================================

-- Nettoyer les données existantes
TRUNCATE TABLE order_items, orders, deliveries, cart_items, carts, menu_items, delivery_men, restaurants, clients CASCADE;

-- ============================================
-- CLIENTS
-- ============================================
INSERT INTO clients (id, name, surname, password, email, address) VALUES
('client-1', 'Marie', 'Dupont', '$2b$10$abcdefghijklmnopqrstuv', 'marie.dupont@gmail.com', 
 '{"street":"10 Rue de la Paix","city":"Paris","country":"France","postal_Code":75002,"lat":48.8698,"lng":2.3311}'),
 
('client-2', 'Thomas', 'Martin', '$2b$10$abcdefghijklmnopqrstuv', 'thomas.martin@gmail.com',
 '{"street":"25 Avenue des Champs","city":"Paris","country":"France","postal_Code":75008,"lat":48.8566,"lng":2.3522}'),
 
('client-3', 'Sophie', 'Bernard', '$2b$10$abcdefghijklmnopqrstuv', 'sophie.bernard@gmail.com',
 '{"street":"5 Boulevard Saint-Michel","city":"Paris","country":"France","postal_Code":75005,"lat":48.8534,"lng":2.3434}');

-- ============================================
-- RESTAURANTS
-- ============================================
INSERT INTO restaurants (id, name, description, email, password, owner, phone_number, address, status) VALUES
('resto-1', 'Chez Mario', 'Restaurant italien authentique', 'contact@chezmario.fr', '$2b$10$abcdefghijklmnopqrstuv', 'Mario Rossi', '0145678901',
 '{"street":"15 Rue de Naples","city":"Paris","country":"France","postal_Code":75008,"lat":48.8606,"lng":2.3376}', 'OPEN'),
 
('resto-2', 'Le Taj Mahal', 'Cuisine indienne traditionnelle', 'contact@tajtmahal.fr', '$2b$10$abcdefghijklmnopqrstuv', 'Raj Kumar', '0145678902',
 '{"street":"30 Rue du Faubourg Saint-Antoine","city":"Paris","country":"France","postal_Code":75012,"lat":48.8534,"lng":2.3767}', 'OPEN'),
 
('resto-3', 'Sushi Master', 'Sushi frais et sashimi', 'contact@sushimaster.fr', '$2b$10$abcdefghijklmnopqrstuv', 'Kenji Tanaka', '0145678903',
 '{"street":"50 Rue Saint-Honoré","city":"Paris","country":"France","postal_Code":75001,"lat":48.8606,"lng":2.3376}', 'OPEN');

-- ============================================
-- MENU ITEMS
-- ============================================
-- Chez Mario
INSERT INTO menu_items (id, restaurant_id, name, description, price, stock, allergens) VALUES
('item-1', 'resto-1', 'Pizza Margherita', 'Tomate, mozzarella, basilic', 12.50, 20, '["gluten","lactose"]'),
('item-2', 'resto-1', 'Pizza 4 Fromages', 'Mozzarella, gorgonzola, parmesan, chèvre', 14.50, 15, '["gluten","lactose"]'),
('item-3', 'resto-1', 'Pâtes Carbonara', 'Pâtes fraîches, crème, lardons, parmesan', 13.00, 25, '["gluten","lactose","œufs"]'),
('item-4', 'resto-1', 'Tiramisu', 'Mascarpone, café, cacao', 6.50, 30, '["gluten","lactose","œufs"]'),

-- Le Taj Mahal
('item-5', 'resto-2', 'Poulet Tikka Masala', 'Poulet mariné sauce épicée', 15.00, 18, '["lactose"]'),
('item-6', 'resto-2', 'Biryani Agneau', 'Riz basmati, agneau, épices', 16.50, 12, '[]'),
('item-7', 'resto-2', 'Naan Fromage', 'Pain indien au fromage', 4.50, 40, '["gluten","lactose"]'),
('item-8', 'resto-2', 'Gulab Jamun', 'Dessert indien au sirop', 5.00, 25, '["lactose"]'),

-- Sushi Master
('item-9', 'resto-3', 'California Roll (8 pcs)', 'Surimi, avocat, concombre', 9.50, 30, '["poisson","crustacés"]'),
('item-10', 'resto-3', 'Sashimi Saumon (6 pcs)', 'Saumon cru tranché', 14.00, 20, '["poisson"]'),
('item-11', 'resto-3', 'Maki Thon (6 pcs)', 'Thon, riz, algue nori', 8.50, 25, '["poisson"]'),
('item-12', 'resto-3', 'Mochi Fraise (3 pcs)', 'Dessert japonais à la fraise', 6.00, 35, '["lactose"]');

-- ============================================
-- DELIVERY MEN
-- ============================================
INSERT INTO delivery_men (id, name, surname, email, password, phone_number, experience, delivery_state, transport_type, wallet_id, wallet_balance, current_deliveries) VALUES
('livreur-1', 'Lucas', 'Dubois', 'lucas.dubois@gmail.com', '$2b$10$abcdefghijklmnopqrstuv', '0612345601', 'EXPERT', 'AVAILABLE', 'BIKE', 'wallet-1', 245.50, '[]'),
('livreur-2', 'Emma', 'Petit', 'emma.petit@gmail.com', '$2b$10$abcdefghijklmnopqrstuv', '0612345602', 'NORMAL', 'AVAILABLE', 'SCOOTER', 'wallet-2', 182.30, '[]'),
('livreur-3', 'Hugo', 'Roux', 'hugo.roux@gmail.com', '$2b$10$abcdefghijklmnopqrstuv', '0612345603', 'EXPERT', 'UNAVAILABLE', 'CAR', 'wallet-3', 521.75, '[]');

-- ============================================
-- CARTS (avec items)
-- ============================================
INSERT INTO carts (id, client_id, restaurant_id) VALUES
('cart-1', 'client-1', 'resto-1'),
('cart-2', 'client-2', 'resto-2');

INSERT INTO cart_items (id, cart_id, menu_item_id, quantity) VALUES
('cart-item-1', 'cart-1', 'item-1', 2),
('cart-item-2', 'cart-1', 'item-4', 1),
('cart-item-3', 'cart-2', 'item-5', 1),
('cart-item-4', 'cart-2', 'item-7', 3);

-- ============================================
-- ORDERS (avec items)
-- ============================================
INSERT INTO orders (id, client_id, restaurant_id, status, total_price, delivery_fee, service_fee, estimated_preparation_time, paid_at) VALUES
('order-1', 'client-1', 'resto-1', 'READY', 31.50, 3.50, 1.58, 25, '2024-05-14 11:30:00'),
('order-2', 'client-2', 'resto-2', 'PREPARING', 28.50, 4.00, 1.43, 30, '2024-05-14 12:00:00'),
('order-3', 'client-3', 'resto-3', 'CREATED', 32.00, 2.50, 1.60, NULL, '2024-05-14 12:15:00');

INSERT INTO order_items (id, order_id, menu_item_id, name, unit_price, quantity) VALUES
('order-item-1', 'order-1', 'item-1', 'Pizza Margherita', 12.50, 2),
('order-item-2', 'order-1', 'item-4', 'Tiramisu', 6.50, 1),

('order-item-3', 'order-2', 'item-5', 'Poulet Tikka Masala', 15.00, 1),
('order-item-4', 'order-2', 'item-7', 'Naan Fromage', 4.50, 3),

('order-item-5', 'order-3', 'item-9', 'California Roll (8 pcs)', 9.50, 2),
('order-item-6', 'order-3', 'item-10', 'Sashimi Saumon (6 pcs)', 14.00, 1);

-- ============================================
-- DELIVERIES
-- ============================================
INSERT INTO deliveries (id, order_id, delivery_man_id, distance, delivery_status, earnings, picked_up_at, delivery_at) VALUES
('delivery-1', 'order-1', 'livreur-1', 2.5, 'PROPOSED', NULL, NULL, NULL),
('delivery-2', 'order-2', NULL, 3.8, 'PENDING', NULL, NULL, NULL);

-- ============================================
-- VÉRIFICATIONS
-- ============================================
SELECT 'Clients:' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'Restaurants:', COUNT(*) FROM restaurants
UNION ALL
SELECT 'Menu Items:', COUNT(*) FROM menu_items
UNION ALL
SELECT 'Delivery Men:', COUNT(*) FROM delivery_men
UNION ALL
SELECT 'Carts:', COUNT(*) FROM carts
UNION ALL
SELECT 'Cart Items:', COUNT(*) FROM cart_items
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items:', COUNT(*) FROM order_items
UNION ALL
SELECT 'Deliveries:', COUNT(*) FROM deliveries;