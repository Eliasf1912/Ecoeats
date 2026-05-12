/**
 * récupérer la livraison et vérifier qu'elle existe
    vérifier que la livraison est DELIVERED
    récupérer le livreur et vérifier qu'il existe
    vérifier que la livraison appartient au livreur (hasDelivery())
    récupérer les earnings de la livraison et vérifier qu'ils ne sont pas null
    ajouter les earnings au wallet du livreur (addEarnings())
    sauvegarder le livreur
 */

import { deliveryManRepository, deliveryRepository, orderRepository } from "../../ports";
import { GenerateInvoice } from "./generateInvoice-usecase";

export class PayDeliveryMan {

    constructor(
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly deliveryRepository : deliveryRepository,
        private readonly orderRepository : orderRepository,
        private readonly generateInvoice : GenerateInvoice
    ) {}

    public async execute(deliveryId : string) {

        const delivery = await this.deliveryRepository.findById(deliveryId);

        if(!delivery) {
            throw new Error("La livraison n'existe pas !");
        }

        const isDelivered = delivery.isDelivered();

        if(!isDelivered) {
            throw new Error("La livraison n'est pas encore livrée !");
        }

        const deliveryManId = delivery.getDeliveryManId();

        if(!deliveryManId) {
            throw new Error("La livraison n'est associé à aucun livreur !");
        }

        const deliveryMan =  await this.deliveryManRepository.findById(deliveryManId);

        if(!deliveryMan) {
            throw new Error("Le livreur n'existe pas !");
        }

        const hasDelivery = deliveryMan.hasDelivery(deliveryId);

        if(!hasDelivery) {
            throw new Error("Le livreur ne possédé pas cette livraison !");
        }

        const earnings  = delivery.getEarnings();

        if(!earnings) {
            throw new Error("Le prix de la commande n'as pas été calculé !");
        }

        deliveryMan.addEarnings(earnings);

        await this.deliveryManRepository.save(deliveryMan);

        const orderId = delivery.getOrderId();

        const order = await this.orderRepository.findById(orderId);

        if(!order) {
            throw new Error("Le commmande n'existe pas !");
        }

        await this.generateInvoice.execute(orderId);

    }
}