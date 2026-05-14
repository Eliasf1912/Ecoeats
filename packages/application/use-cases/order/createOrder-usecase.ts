/*  
    Input : 
        CartRepository
        MenuItemRepository
        OrderRepository
    
    récupérer le cart
    vérifier qu’il existe
    vérifier qu’il n’est pas vide
    récuopérer le restaurant et vérifier qu'il existe et qu'il n'est pas fermé
    récupérer les menuItems
    vérifier les stocks
    calculer :
    totalPrice
    deliveryFee (distance)
    serviceFee
    créer une Order
    sauvegarder
    vider le cart
*/

import { address } from "../../../domain/value-objects";
import { Order,orderItem } from "../../../domain/entities";
import { cartRepository, menuItemRepository, orderRepository, restaurantRepository } from "../../ports";
import { orderStatus } from "../../../domain/enums";
import { randomUUID } from "crypto";
import { DistanceService } from "../../../domain/services";
import { SERVICE_FEE } from "../../../domain/constants/";

export class CreateOrder { 

    constructor(
        private readonly cartRepository : cartRepository,
        private readonly menuItemRepository : menuItemRepository,
        private readonly orderRepository : orderRepository,
        private readonly restaurantRepository : restaurantRepository,
    ) {}

    public async execute(clientId : string, deliveryAddress : address, tip: number = 0) : Promise<string> {
        
        let cart = await this.cartRepository.findByClientId(clientId);

        if(!cart){
            throw new Error("Le panier n'existe pas !");
        }

        if(cart.isEmpty()){
            throw new Error("Le panier est vide !");
        }

        const  restaurantId = cart.getRestaurantId();

        if(!restaurantId){
            throw new Error("Le panier n'est associé à aucun restaurant !");
        }

        const restaurant = await this.restaurantRepository.findById(restaurantId);

        if(!restaurant){
            throw new Error("Le restaurant n'existe pas !");
        }

        if(!restaurant.isOpen()){
            throw new Error("Le restaurant est fermé !");
        }

        const items = cart.getItems();

        for( const menuItem of items ) {
            const item = await this.menuItemRepository.findById(menuItem.menuItemId);

            if(!item){
                throw new Error("Le produit n'existe pas !");
            }

            if(item.getStock() === 0){
                throw new Error("Rupture de stock");
            }
        }

        const orderItems : orderItem[] = items.map(item => ({
            id: item.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }));

        const totalPrice = items.reduce((total,item) =>total + (item.unitPrice * item.quantity),0)

        const distance = DistanceService.calculateDistance(restaurant.getAddress().lat,restaurant.getAddress().lng,deliveryAddress.lat,deliveryAddress.lng)

        const deliverFee = DistanceService.calculateDeliveryFee(distance);

        const serviceFee = Math.round(totalPrice * SERVICE_FEE * 100) / 100;

        const dateNow =  new Date();

        const orderId = randomUUID();

        const  order = new Order(orderId,clientId,restaurant.getRestaurantId(),orderStatus.CREATED,orderItems,totalPrice,deliverFee,serviceFee,deliveryAddress,restaurant.getAddress(),null,null,dateNow,dateNow, tip);

        await this.orderRepository.save(order);
        
        cart.clear();
        
        await this.cartRepository.save(cart);

        return orderId
    }

}