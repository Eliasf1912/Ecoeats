import { Module } from '@nestjs/common';
import buildRepositories, { RepoImpl } from '../../packages/infrastructure/containerFactory';
import { PasswordService } from '../../packages/infrastructure/services/';
import { TokenService } from '../../packages/infrastructure/services/';

const impl = (process.env.REPO_IMPL) as RepoImpl ?? 'inmemory';

const repos = buildRepositories(impl);

@Module({
    providers: [
        { provide: 'ClientRepository', useValue: repos.clientRepository },
        { provide: 'RestaurantRepository', useValue: repos.restaurantRepository },
        { provide: 'DeliveryManRepository', useValue: repos.deliveryManRepository },
        { provide: 'CartRepository', useValue: repos.cartRepository },
        { provide: 'MenuItemRepository', useValue: repos.menuItemRepository },
        { provide: 'DeliveryRepository', useValue: repos.deliveryRepository },
        { provide: 'OrderRepository', useValue: repos.orderRepository },
        { provide: 'PasswordService', useValue: new PasswordService() },
        { provide: 'TokenService', useValue: new TokenService() },
    ],
    exports: [
        'ClientRepository',
        'RestaurantRepository',
        'DeliveryManRepository',
        'CartRepository',
        'MenuItemRepository',
        'DeliveryRepository',
        'OrderRepository',
        'PasswordService',
        'TokenService',
    ],
})
export class ContainerModule { }
