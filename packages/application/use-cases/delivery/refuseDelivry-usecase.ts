import { deliveryRepository } from "../../ports";

export class RefuseDelivery {

    constructor(
        private readonly deliveryRepository : deliveryRepository,
    ){}

    public async execute (deliveryId : string) : Promise<void> {

        const delivery = await this.deliveryRepository.findById(deliveryId);

        if(!delivery) {
            throw new Error("La livraison n'existe pas !");
        }

        const isProposed = delivery.isProposed();

        if(!isProposed) {
            throw new Error("La livraison ne peut pas être refusée !");
        }

        delivery.refuseDelivery();

        await this.deliveryRepository.save(delivery);

    }

}