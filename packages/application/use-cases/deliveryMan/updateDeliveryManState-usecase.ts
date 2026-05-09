/**
 *  récupérer le livreur
    vérifier qu'il existe
    si il passe UNAVAILABLE → vérifier qu'il n'a pas de livraisons en cours
    basculer le statut vers l'opposé
    sauvegarder
 */


import { deliveryManRepository } from "../../ports";

export class UpdateDeliveryManState { 

    constructor(
        private readonly deliveryManRepository : deliveryManRepository
    ){}

    public async execute(deliveryManId : string) : Promise<void> {

        const deliveryMan =  await this.deliveryManRepository.findById(deliveryManId);

        if(!deliveryMan) {
            throw new Error("Le livreur n'existe pas !");
        }

        deliveryMan.toggleState();
        
        await this.deliveryManRepository.save(deliveryMan);
    }
}