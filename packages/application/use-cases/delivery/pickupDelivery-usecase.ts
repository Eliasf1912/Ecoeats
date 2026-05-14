/**
 *  récupérer la livraison
    récupérer la commande
    vérifier qu'elles existent
    vérifier que la livraison est ASSIGNED
    vérifier que la commande est ACCEPTED
    appeler delivery.markAsPickedUp()
    sauvegarder la livraison
 */

import { orderRepository, deliveryRepository } from "../../ports";
export class PickupDelivery {

    constructor(
        private readonly orderRepository : orderRepository,
        private readonly deliveryRepository : deliveryRepository,
    ){}

    public async execute(deliveryId : string) : Promise<void> {

        const delivery = await this.deliveryRepository.findById(deliveryId);

        if(!delivery){
            throw new Error("La livraison n'existe pas !");
        }

        const order = await this.orderRepository.findById(delivery.getOrderId());

        if(!order){
            throw new Error("Le commande n'existe pas !");
        }
        
        const isOrderReady = order.isReady();

        if(!isOrderReady){
            throw new Error("Le commande n'est pas prête !");
        }

        const canBePickup = delivery.canBePickeup();

        if(!canBePickup){
            throw new Error("Le commande n'est pas prête !");
        }

        delivery.markAsPickedUp();

        await this.deliveryRepository.save(delivery);

    }
}