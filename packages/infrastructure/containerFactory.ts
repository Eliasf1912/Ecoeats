import { InMemoryClientRepository, InMemoryRestaurantRepository, InMemoryDeliveryManRepository, InMemoryCartRepository, InMemoryMenuItemRepository, InMemoryDeliveryRepository, InMemoryOrderRepository } from './repositories/in-memory/index.js';
import { createPostgresPool, getPostgresPool } from './config/database.js';
import { PostgresClientRepository, PostgresRestaurantRepository, PostgresDeliveryManRepository, PostgresCartRepository, PostgresMenuItemRepository, PostgresDeliveryRepository, PostgresOrderRepository } from './repositories/postgres/index.js';

export type RepoImpl = 'inmemory' | 'postgres';

export function buildRepositories(impl: RepoImpl = 'inmemory') {
    if (impl === 'postgres') {
        return {
            clientRepository: new PostgresClientRepository(getPostgresPool()),
            restaurantRepository: new PostgresRestaurantRepository(getPostgresPool()),
            deliveryManRepository: new PostgresDeliveryManRepository(getPostgresPool()),
            cartRepository: new PostgresCartRepository(getPostgresPool()),
            menuItemRepository: new PostgresMenuItemRepository(getPostgresPool()),
            deliveryRepository: new PostgresDeliveryRepository(getPostgresPool()),
            orderRepository: new PostgresOrderRepository(getPostgresPool()),

        }
    }
    return {
        clientRepository: new InMemoryClientRepository(),
        restaurantRepository: new InMemoryRestaurantRepository(),
        deliveryManRepository: new InMemoryDeliveryManRepository(),
        cartRepository: new InMemoryCartRepository(),
        menuItemRepository: new InMemoryMenuItemRepository(),
        deliveryRepository: new InMemoryDeliveryRepository(),
        orderRepository: new InMemoryOrderRepository(),
    }
}

export default buildRepositories;
