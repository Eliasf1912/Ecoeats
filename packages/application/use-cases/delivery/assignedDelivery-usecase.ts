/**
 * Input : 
 * - commande
 * 
 * repo : 
 * - orderRepository
 * - deliveryRepositories
 * 
 * 
 * étape : 
 * - récuperer la commande
 * - vérifier que la commande est "préte" ou "en cours de préparation"
 * - créer la livraison en initialisant la date de création, avec le status Pending
 * - sauvergarder la livraison
*/
import { orderRepository, deliveryRepository, deliveryManRepository } from "../../ports";
import { Delivery } from "../../../domain/entities";
import { randomUUID } from "crypto";
import { DistanceService } from "../../../domain/services";
import { deliveryStatus } from "../../../domain/enums";
import { ProposeDelivery } from "./poposeDelivery-usecase";

export class AssigneDelivery {

    constructor(
        private readonly orderRepository : orderRepository,
        private readonly deliveryRepository : deliveryRepository,
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly proposeDelivery : ProposeDelivery,
    ){}

    public async execute (orderId : string) : Promise<void> {

        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new Error("Le commande n'existe pas !");
        }

        if(!order.isOrderReady()) {
            throw new Error("La commande ne pas être assigné !");
        }

        const deliveryAdress = order.getDeliveryAdress();
        const restaurantAddress = order.getRestaurantAdress();

        const deliveryDistance = DistanceService.calculateDistance(deliveryAdress.lat,deliveryAdress.lng,restaurantAddress.lat,restaurantAddress.lng);

        const deliveryId = randomUUID();

        const delivery = new Delivery(deliveryId,orderId,deliveryDistance,deliveryStatus.PENDING);

        await this.deliveryRepository.save(delivery);

        const deliveryMan = await this.deliveryManRepository.findAvailable();

        if(!deliveryMan) {
            throw new Error("Aucun livreur disponible !");
        }

        await this.proposeDelivery.execute(deliveryId,deliveryMan.getId());

    }

}