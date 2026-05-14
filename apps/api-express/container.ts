import buildRepositories from '../../packages/infrastructure/containerFactory.js';
import type { RepoImpl } from '../../packages/infrastructure/containerFactory.js';
import { PasswordService } from '../../packages/infrastructure/services/index.js';
import { TokenService } from '../../packages/infrastructure/services/';
import { LoginClient, RegisterClient, RegisterRestaurant, LoginRestaurant, LoginDeliveryMan, RegisterDeliveryMan, AddItemToCart, RemoveItemFromCart, ClearCart, AcceptDelivery, AssigneDelivery, CompleteDelivery, PickupDelivery, ProposeDelivery, RefuseDelivery, CreateMenuItem, GetMenuItem, RemoveMenuItem, UpdateMenuItem, AcceptOrder, CancelOrder, MarkOrderAsReady, PreviewOrder, RefuseOrder, StartPreparingOrder, CreateOrder, UpdateDeliveryManState, GenerateInvoice, PayDeliveryMan, GetProposedDelivery, GetRestaurant, GetAllRestaurants, GetMenuItemsByRestaurant, GetCart } from '../../packages/application/use-cases';

// impl de la bdd
const impl = (process.env.REPO_IMPL as RepoImpl) ?? 'inmemory';
const {
    clientRepository,
    restaurantRepository,
    deliveryManRepository,
    cartRepository,
    menuItemRepository,
    deliveryRepository,
    orderRepository,
} = buildRepositories(impl);

export const passwordService = new PasswordService();
export const tokenService = new TokenService();


// ---------------------- auth -------------------------- //
    export const registerClientUseCase = new RegisterClient(
        clientRepository,
        passwordService,
        tokenService
    );
    export const loginClientUseCase = new LoginClient(
        clientRepository,
        passwordService,
        tokenService
    );
    export const registerRestaurantUseCase = new RegisterRestaurant(
        restaurantRepository,
        passwordService,
        tokenService
    );
    export const loginRestaurantUseCase = new LoginRestaurant(
        restaurantRepository,
        passwordService,
        tokenService
    );
    export const registerDeliveryManUseCase = new RegisterDeliveryMan(
        deliveryManRepository,
        passwordService,
        tokenService
    );
    export const loginDeliveryManUseCase = new LoginDeliveryMan(
        deliveryManRepository,
        passwordService,
        tokenService
    );

// ---------------------- cart -------------------------- //

    export const addItemToCartUseCase = new AddItemToCart(
        cartRepository,
        menuItemRepository
    );
    export const removeItemFromCartUseCase = new RemoveItemFromCart(cartRepository);
    export const clearCartUseCase = new ClearCart(cartRepository);
    export const getCartUseCase = new GetCart(cartRepository);

// ---------------------- payement -------------------------- //

    export const generateInvoiceUseCase = new GenerateInvoice(
        orderRepository, 
        restaurantRepository, 
        menuItemRepository
    );

    export const payDeliveryManUseCase = new PayDeliveryMan(
        deliveryManRepository, 
        deliveryRepository,
        orderRepository,
        generateInvoiceUseCase
    )

// ---------------------- delivery -------------------------- //

    export const acceptDeliveryUseCase = new AcceptDelivery(
        deliveryManRepository, 
        deliveryRepository
    );
    export const proposeDeliveryUseCase = new ProposeDelivery(
        deliveryManRepository, 
        deliveryRepository
    );
    export const assignDeliveryManUseCase = new AssigneDelivery(
        orderRepository, 
        deliveryRepository,
        deliveryManRepository,
        proposeDeliveryUseCase
    );
    export const completeDeliveryUseCase = new CompleteDelivery(
        orderRepository, 
        deliveryManRepository, 
        deliveryRepository,
        payDeliveryManUseCase
    );
    export const pickupDeliveryUseCase = new PickupDelivery(
        orderRepository, 
        deliveryRepository

    );
    export const refuseDeliveryUseCase = new RefuseDelivery(deliveryRepository);

// ---------------------- Menu -------------------------- //

    export const createMenuItemUseCase = new CreateMenuItem(
        restaurantRepository, 
        menuItemRepository
    );
    export const getMenuItemUseCase = new GetMenuItem(menuItemRepository);
    export const removeMenuItemUseCase = new RemoveMenuItem(menuItemRepository);
    export const updateMenuItemUseCase = new UpdateMenuItem(menuItemRepository);

// ---------------------- order -------------------------- //

    export const createOrderUseCase = new CreateOrder(
        cartRepository, 
        menuItemRepository, 
        orderRepository, 
        restaurantRepository
    );
    export const cancelOrderUseCase = new CancelOrder(orderRepository);
    export const acceptedOrderUseCase = new AcceptOrder(orderRepository);
    export const markOrderAsReadyUseCase = new MarkOrderAsReady(orderRepository,assignDeliveryManUseCase);
    export const previewOrderUseCase = new PreviewOrder(
        cartRepository, 
        restaurantRepository, 
        menuItemRepository
    );
    export const refuseOrderUseCase = new RefuseOrder(orderRepository);
    export const startPreparingOrderUseCase = new StartPreparingOrder(orderRepository); 

// ---------------------- deliveryMan -------------------------- //

    export const updateDeliveryManStateUseCase = new UpdateDeliveryManState(deliveryManRepository); 

    export const getProposedDeliveryUseCase = new GetProposedDelivery(deliveryRepository);


// ---------------------- restaurant -------------------------- //

    export const getRestaurantUseCase = new GetRestaurant(restaurantRepository);
    export const getAllRestaurantsUseCase = new GetAllRestaurants(restaurantRepository);
    export const getMenuItemsByRestaurantUseCase = new GetMenuItemsByRestaurant(
        restaurantRepository,
        menuItemRepository
    )