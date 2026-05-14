import { Module } from '@nestjs/common';
import buildRepositories from '../../packages/infrastructure/containerFactory.js';
import type { RepoImpl } from '../../packages/infrastructure/containerFactory.js';

const impl = (process.env.REPO_IMPL as RepoImpl) ?? 'inmemory';
const repos = buildRepositories(impl);

@Module({
    providers: [
        { provide: 'ClientRepository', useValue: repos.clientRepository },
        { provide: 'CartRepository', useValue: repos.cartRepository },
        { provide: 'RestaurantRepository', useValue: repos.restaurantRepository },
        { provide: 'DeliveryManRepository', useValue: repos.deliveryManRepository },
        { provide: 'MenuItemRepository', useValue: repos.menuItemRepository },
        { provide: 'DeliveryRepository', useValue: repos.deliveryRepository },
        { provide: 'OrderRepository', useValue: repos.orderRepository },
    ],
    exports: ['ClientRepository', 'CartRepository', 'RestaurantRepository', 'DeliveryManRepository', 'MenuItemRepository', 'DeliveryRepository', 'OrderRepository']
})

export class ContainerModule {}