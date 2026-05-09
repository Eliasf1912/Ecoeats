/**
 *  récupérer la livraison
    vérifier qu'elle existe
    vérifier que son statut est PENDING
    récupérer le livreur
    vérifier qu'il existe
    vérifier qu'il est disponible et peut prendre une livraison (canTakeDelivery())
    assigner le livreur à la livraison (assignDeliveryMan())
    ajouter la livraison au livreur (addDelivery())
    sauvegarder la livraison et le livreur
 */

import { deliveryManRepository, deliveryRepository } from "../../ports";

export class AcceptDelivery {

    constructor(
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly deliveryRepository : deliveryRepository,
    ){}

    public async execute (deliveryId : string) : Promise<void> {

        const delivery = await this.deliveryRepository.findById(deliveryId);

        if(!delivery) {
            throw new Error("La livraison n'existe pas !");
        }

        const isProposed = delivery.isProposed();

        if(!isProposed) {
            throw new Error("La livraison ne peut pas être prise !");
        }

        const deliveryManId = delivery.getDeliveryManId();

        if(!deliveryManId) {
            throw new Error("La livraison n'est associé à personne !");
        }

        const deliveryMan =  await this.deliveryManRepository.findById(deliveryManId);

        if(!deliveryMan) {
            throw new Error("Le livreur n'existe pas !");
        }

        const isDeliveryManAvailable = deliveryMan.canTakeDelivery();

        if(!isDeliveryManAvailable) {
            throw new Error("Le livreur ne peut pas prendre de commande !");
        }

        delivery.assignDeliveryMan(deliveryManId);

        deliveryMan.addDelivery(deliveryId);

        await this.deliveryRepository.save(delivery);
        await this.deliveryManRepository.save(deliveryMan);

    }

}