import { Module } from '@nestjs/common';
import buildRepositories from '../../packages/infrastructure/containerFactory.js';
import type { RepoImpl } from '../../packages/infrastructure/containerFactory.js';
import { TokenService, PasswordService } from '../../packages/infrastructure/services';

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
        { provide: 'TokenService', useValue: new TokenService()},
        { provide: 'PasswordService', useValue: new PasswordService()}
    ],
    exports: ['ClientRepository', 'CartRepository', 'RestaurantRepository', 'DeliveryManRepository', 'MenuItemRepository', 'DeliveryRepository', 'OrderRepository']
})

export class ContainerModule {}