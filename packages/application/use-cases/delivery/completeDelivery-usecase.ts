/**
 * récupérer la livraison
    vérifier qu'elle existe
    récupérer le livreur
    vérifier qu'il existe
    récupérer la commande
    vérifier qu'elle existe
    calculer les earnings avec le tip
    passer la livraison à DELIVERED avec markAsDelivered()
    passer la commande à DELIVERED
    retirer la livraison du livreur avec removeDelivery()
    sauvegarder les trois
 */

import { orderRepository, deliveryManRepository, deliveryRepository } from "../../ports";
import { PayDeliveryMan } from "../payment";
export class CompleteDelivery {

    constructor(
        private readonly orderRepository : orderRepository,
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly deliveryRepository : deliveryRepository,
        private readonly payDeliveryMan : PayDeliveryMan,
    ){}

    public async execute(deliveryManId: string, deliveryId: string): Promise<void> {

        const deliveryMan = await this.deliveryManRepository.findById(deliveryManId);
        if(!deliveryMan){
            throw new Error("Le livreur n'existe pas !");
        }

        const delivery = await this.deliveryRepository.findById(deliveryId);
        if(!delivery){
            throw new Error("La livraison n'existe pas !");
        }

        const order = await this.orderRepository.findById(delivery.getOrderId());
        if(!order){
            throw new Error("La commande n'existe pas !");
        }

        const tip = order.getTip();

        delivery.calculateEarnings(delivery.getDistance(), tip);
        delivery.markAsDelivered();
        order.markAsDelivered();

        await this.orderRepository.save(order);
        await this.deliveryRepository.save(delivery);

        await this.payDeliveryMan.execute(deliveryId);
        
        deliveryMan.removeDelivery(deliveryId);
        await this.deliveryManRepository.save(deliveryMan);
    }

}