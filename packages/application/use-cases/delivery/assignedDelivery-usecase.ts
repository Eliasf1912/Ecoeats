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
import { orderRepository, deliveryRepository } from "../../ports";
import { Delivery } from "../../../domain/entities";
import { randomUUID } from "crypto";
import { DistanceService } from "../../../domain/services";
import { deliveryStatus } from "../../../domain/enums";

export class AssigneDelivery {

    constructor(
        private readonly orderRepository : orderRepository,
        private readonly deliveryRepository : deliveryRepository,
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

    }

}