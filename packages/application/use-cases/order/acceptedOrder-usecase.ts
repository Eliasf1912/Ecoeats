/**
 * récupérer la commande
    vérifier qu'elle existe
    vérifier que son statut est CREATED (on ne peut pas accepter une commande déjà acceptée)
    définir acceptedAt
    définir prepTime
    passer le statut à ACCEPTED
    sauvegarder
 */

import { orderRepository } from "../../ports";
import { orderStatus } from "../../../domain/enums";

export class AcceptOrder {

    constructor(
        private readonly orderRepository : orderRepository
    ) {}

    public async execute (orderId : string, prepTime : number) : Promise<void> {

        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new Error("Le commande n'existe pas !");
        }

        const dateNow = new Date();

        order.acceptOrder(prepTime,dateNow);

        await this.orderRepository.save(order);
    }
}
