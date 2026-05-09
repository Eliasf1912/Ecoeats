import { deliveryManRepository, deliveryRepository } from "../../ports";

export class ProposeDelivery {

    constructor(
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly deliveryRepository : deliveryRepository,
    ){}

    public async execute (deliveryId : string, deliveryManId : string) : Promise<void> {

        const delivery = await this.deliveryRepository.findById(deliveryId);

        if(!delivery) {
            throw new Error("La livraison n'existe pas !");
        }

        const isPending = delivery.isPending();

        if(!isPending) {
            throw new Error("La livraison ne peut pas être poposée !");
        }

        const deliveryMan =  await this.deliveryManRepository.findById(deliveryManId);

        if(!deliveryMan) {
            throw new Error("Le livreur n'existe pas !");
        }

        const isDeliveryManAvailable = deliveryMan.canTakeDelivery();

        if(!isDeliveryManAvailable) {
            throw new Error("Le livreur ne peut pas prendre de commande !");
        }

        delivery.markAsProposed(deliveryManId);

        await this.deliveryRepository.save(delivery);

    }

}