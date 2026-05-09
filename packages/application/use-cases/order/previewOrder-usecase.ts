/**
 * récupérer le cart et vérifier qu'il existe et n'est pas vide
    récupérer le restaurant et vérifier qu'il existe et est ouvert
    vérifier les stocks
    calculer totalPrice, deliveryFee, serviceFee, finalPrice
    construire et retourner l'OrderPreviewDTO
 */

import { OrderPreviewDTO } from "../../dto";
import { cartRepository, restaurantRepository, menuItemRepository } from "../../ports";
import { DistanceService } from "../../../domain/services";
import { SERVICE_FEE } from "../../../domain/constants";
import { address } from "../../../domain/value-objects";

export class PreviewOrder {
    constructor(
        private readonly cartRepository : cartRepository,
        private readonly restaurantRepository : restaurantRepository,
        private readonly menuItemRepository : menuItemRepository,
    ) {
        
    }

    public async execute(clientId : string, deliveryAddress : address) : Promise<OrderPreviewDTO> {

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

        const orderItems = []

        for( const cartItem  of items ) {
            const menuItem = await this.menuItemRepository.findById(cartItem .menuItemId);

            if(!menuItem){
                throw new Error("Le produit n'existe pas !");
            }

            if(menuItem.getStock() === 0){
                throw new Error("Rupture de stock");
            }

            orderItems.push({
                name: menuItem.getName(),
                quantity: cartItem.quantity,
                unitPrice: cartItem.unitPrice,
                subtotal: cartItem.quantity * cartItem.unitPrice
            });
        }

        const estimatedDistance = DistanceService.calculateDistance(restaurant.getAddress().lat,restaurant.getAddress().lng,deliveryAddress.lat,deliveryAddress.lng);
        
        const totalPrice = items.reduce((total,item) =>total + (item.unitPrice * item.quantity),0);
        
        const deliverFee = DistanceService.calculateDeliveryFee(estimatedDistance);

        const serviceFee = totalPrice * SERVICE_FEE;

        const finalPrice = totalPrice + deliverFee + serviceFee;

        const orderPreview : OrderPreviewDTO = {
            totalPrice: totalPrice,
            deliveryFee: deliverFee,
            serviceFee: serviceFee,
            finalPrice: finalPrice,
            items : orderItems,
            estimatedDeliveryDistance : estimatedDistance
        }

        return orderPreview;
    }
}