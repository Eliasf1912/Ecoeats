import { deliveryStatus } from "../enums";
import { DELIVERY_BASE_FEE, DELIVERY_PRICE_PER_KM } from "../constants"

export class Delivery { 
    constructor(
        private readonly id : string,
        private readonly orderId : string,
        private readonly distance : number,
        private deliveryStatus : deliveryStatus,
        private deliveryManId : string | null = null,
        private pickedUpAt : Date | null = null, 
        private deliveryAt : Date | null = null,
        private earnings : number | null = null
    ){}

    public markAsPickedUp() : void { 
        const dateNow = new Date();
        if(this.pickedUpAt) {
            throw new Error("La commande à déja été récupéré !");
        }
        this.pickedUpAt = dateNow;
        this.deliveryStatus = deliveryStatus.PICKED_UP;
    }

    public isProposed() : boolean {
        return this.deliveryStatus === deliveryStatus.PROPOSED;
    }

    public isPending() : boolean {
        return this.deliveryStatus === deliveryStatus.PENDING;
    }
    
    public isDelivered() : boolean {
        return this.deliveryStatus === deliveryStatus.DELIVERED;
    }

    public isCreated() : boolean {
        return this.deliveryStatus === deliveryStatus.PENDING;
    }

    public canBePickeup() : boolean {
        return this.deliveryStatus === deliveryStatus.ASSIGNED;
    }

    public assignDeliveryMan(deliveryManId: string): void {
        this.deliveryManId = deliveryManId;
        this.deliveryStatus = deliveryStatus.ASSIGNED;
    }

    public refuseDelivery() : void {
        if(!this.deliveryManId){
            throw new Error("La livraison ne peut pas être refusée !");
        }
        this.deliveryManId = null;
        this.deliveryStatus = deliveryStatus.PENDING;
    }

    public markAsDelivered() : void { 
        const dateNow = new Date();
        if(this.deliveryAt) {
            throw new Error("La commande à déja été livrée");
        }
        this.deliveryAt = dateNow;
        this.deliveryStatus = deliveryStatus.DELIVERED;
    }

    public markAsProposed(deliveryManId : string) : void { 
        if(this.deliveryManId){
            throw new Error("La livraison ne peut pas être poposée !");
        }
        this.deliveryManId = deliveryManId;
        this.deliveryStatus = deliveryStatus.PROPOSED;
    }

    public calculateEarnings(distanceKm : number, tip : number) : number {
        if(this.earnings){
            throw new Error("La commande à déja été payée !");
        }
        
        const totalEarning = DELIVERY_BASE_FEE + (distanceKm * DELIVERY_PRICE_PER_KM) + tip;

        this.earnings = totalEarning;

        return this.earnings;
    }

    public getDistance() : number {
        return this.distance;
    }

    public getDeliveryManId() : string | null {
        return this.deliveryManId;
    }

    public getEarnings() : number | null {
        return this.earnings;
    }

    public getId() : string {
        return this.id;
    }

    public getOrderId() : string {
        return this.orderId;
    }

}

