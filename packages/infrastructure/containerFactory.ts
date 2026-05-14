import { InMemoryClientRepository, InMemoryRestaurantRepository, InMemoryDeliveryManRepository, InMemoryCartRepository, InMemoryMenuItemRepository, InMemoryDeliveryRepository, InMemoryOrderRepository } from './repositories/in-memory/index.js';

// NOTE: Postgres implementations are optional and can be added under
// packages/infrastructure/repositories/postgres. For now the factory
// returns in-memory repositories to keep the project runnable.

export type RepoImpl = 'inmemory' | 'postgres';

export function buildRepositories(impl: RepoImpl = 'inmemory'){
    // TODO: when postgres repos exist, instantiate them here
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
