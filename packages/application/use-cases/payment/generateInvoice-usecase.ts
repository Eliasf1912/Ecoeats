/**
 * récupérer la commande et vérifier qu'elle existe
    récupérer le restaurant et vérifier qu'il existe
    récupérer les noms des items via menuItemRepository
    construire et retourner l'InvoiceDTO
 */

import { InvoiceDTO } from "../../dto"
import { orderRepository, restaurantRepository, menuItemRepository } from "../../ports"

export class GenerateInvoice {
    constructor(
        private readonly orderRepository : orderRepository,
        private readonly restaurantRepository : restaurantRepository,
        private readonly menuItemRepository : menuItemRepository,
        ) {
    }

    public async execute(orderId : string) : Promise<InvoiceDTO>{

        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new Error("Le commande n'existe pas !");
        }

        const restaurant = await this.restaurantRepository.findById(order.getRestaurantId());

        if(!restaurant){
            throw new Error("Le restaurant n'existe pas !");
        }

        const orderItems = order.getItems();
        const invoiceItems = [];

        for( const item of orderItems ) {

            const menuItem = await this.menuItemRepository.findById( item.menuItemId);

            if(!menuItem){
                throw new Error("Le produit n'existe pas !");
            }
        
            invoiceItems.push({
                name: menuItem.getName(),
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.quantity * item.unitPrice 
            });
        }

        const orderPaidAt = order.getPaidAt();

        if(!orderPaidAt){
            throw new Error("Cette commande n'as pas était payé")
        }

        return {
            orderId : orderId,
            clientId : order.getClientId(),
            restaurantName : restaurant.getRestaurantName(),
            items : invoiceItems,
            totalPrice : order.getTotalPrice(),
            deliveryFee : order.getDeliveryFee(),
            serviceFee : order.getServiceFee(),
            finalPrice : order.getTotalPrice() + order.getDeliveryFee() + order.getServiceFee(),
            paidAt : orderPaidAt
        }

    }   
}