/*  
    Input : 
        CartRepository
        MenuItemRepository
        OrderRepository
    
    récupérer le cart
    vérifier qu’il existe
    vérifier qu’il n’est pas vide
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
import { SERVICE_FEE } from "../../../domain/constants";

export class CreateOrder { 

    constructor(
        private readonly cartRepository : cartRepository,
        private readonly menuItemRepository : menuItemRepository,
        private readonly orderRepository : orderRepository,
        private readonly restaurantRepository : restaurantRepository,
    ) {}

    public async execute(clientId : string, deliveryAddress : address) : Promise<void> {
        
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

        const items = cart.getItems();

        for( const menuItem of items ) {
            const item = await this.menuItemRepository.findById(menuItem.menuItemId);

            if(!item){
                throw new Error("Le produit n'existe pas !");
            }

            if(item.stock === 0){
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

        const deliverFee = DistanceService.calculateDeliveryFee(restaurant.address.lat,restaurant.address.lng,deliveryAddress.lat,deliveryAddress.lng);

        const serviceFee = totalPrice * SERVICE_FEE;

        const dateNow =  new Date();

        const  order = new Order(randomUUID(),clientId,restaurant.id,orderStatus.CREATED,orderItems,totalPrice,deliverFee,serviceFee,deliveryAddress,restaurant.address,null,null,dateNow,null);

        await this.orderRepository.save(order);
        
        cart.clear();
        
        await this.cartRepository.save(cart);
    }

}