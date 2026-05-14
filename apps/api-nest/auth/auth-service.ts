import { Injectable, Inject } from '@nestjs/common';
import { TokenService, PasswordService} from '../../../packages/infrastructure/services';
import { clientRepository, deliveryManRepository, restaurantRepository } from '../../../packages/application/ports';
import { RegisterClient, LoginClient, RegisterRestaurant, LoginRestaurant, RegisterDeliveryMan, LoginDeliveryMan  } from '../../../packages/application/use-cases/auth/';
import { LoginDTO, RegisterClientDTO, RegisterDeliveryManDTO, RegisterRestaurantDTO} from "../../../packages/application/dto"

@Injectable()
export class AuthService {

    private readonly registerClientUseCase: RegisterClient;
    private readonly loginClientUseCase : LoginClient;
    private readonly registerRestaurantUseCase : RegisterRestaurant;
    private readonly loginRestaurantUseCase : LoginRestaurant;
    private readonly registerDeliveryManUseCase : RegisterDeliveryMan;
    private readonly loginDeliveryManUseCase : LoginDeliveryMan;


    constructor(
        @Inject('ClientRepository') private readonly clientRepository: clientRepository,
        @Inject('DeliveryManRepository') private readonly deliveryManRepository: deliveryManRepository,
        @Inject('RestaurantRepository') private readonly restaurantRepository: restaurantRepository,
        @Inject('TokenService') private readonly tokenService: TokenService,
        @Inject('PasswordService') private readonly passwordService : PasswordService
    ){
        this.registerClientUseCase = new RegisterClient(
            this.clientRepository,
            this.passwordService,
            this.tokenService
        );
        this.loginClientUseCase = new LoginClient(
            this.clientRepository,
            this.passwordService,
            this.tokenService,
        );
        this.registerRestaurantUseCase = new RegisterRestaurant(
            this.restaurantRepository,
            this.passwordService,
            this.tokenService
        );
        this.loginRestaurantUseCase = new LoginRestaurant(
            this.restaurantRepository,
            this.passwordService,
            this.tokenService
        );
        this.registerDeliveryManUseCase = new RegisterDeliveryMan(
            this.deliveryManRepository,
            this.passwordService,
            this.tokenService
        );
        this.loginDeliveryManUseCase = new LoginDeliveryMan(
            this.deliveryManRepository,
            this.passwordService,
            this.tokenService
        );
    }

    async registerClient(dto: RegisterClientDTO): Promise<string> {
        return await this.registerClientUseCase.execute(dto);
    }   

    async loginClient(dto: LoginDTO) : Promise<any> { 
        return await this.loginClientUseCase.execute(dto);
    }

    async registerRestaurant(dto: RegisterRestaurantDTO): Promise<string> {
        return await this.registerRestaurantUseCase.execute(dto);
    }   

    async loginRestaurant(dto: LoginDTO) : Promise<string> { 
        return await this.loginRestaurantUseCase.execute(dto);
    }

    async registerDeliveryMan(dto: RegisterDeliveryManDTO): Promise<string> {
        return await this.registerDeliveryManUseCase.execute(dto);
    }   

    async loginDeliveryMan(dto: LoginDTO) : Promise<string> { 
        return await this.loginDeliveryManUseCase.execute(dto);
    }
}