import { deliveryManExperience, deliveryState, transportType } from "../enums";
import { wallet } from "./";

export class DeliveryMan { 
    constructor(
        private readonly id : string,
        private readonly name : string,
        private readonly surname : string,
        private readonly email : string,
        private readonly password : string,
        private readonly phoneNumber : string,
        private experience : deliveryManExperience,
        private deliveryState : deliveryState,
        private transport_type : transportType,
        private wallet : wallet,
        private currentDeliveries : string[]
    ){}

    public isAvailable() : boolean {
        return this.deliveryState === deliveryState.AVAILABLE;
    }

    public isExpert() : boolean {
        return this.experience === deliveryManExperience.EXPERT;
    }

    public canTakeDelivery() : boolean {
        const maxDeliveries = this.isExpert() ? 2 : 1;
        return this.isAvailable() && this.currentDeliveries.length < maxDeliveries;
    }

    public addDelivery(orderId : string) : void {
        if(this.currentDeliveries.includes(orderId)){
            throw new Error("La commande est déja prise !");
        }
        this.currentDeliveries.push(orderId);
    }

    public removeDelivery(orderId : string) : void {
        if(!this.currentDeliveries.includes(orderId)){
            throw new Error("La commande n'existe pas !");
        }
        this.currentDeliveries = this.currentDeliveries.filter((order) => order !== orderId);
    }

    public toggleState () : void {
        const isAvailable = this.isAvailable();

        if(isAvailable){
            if(this.currentDeliveries.length > 0){
                throw new Error("Vous devez d'abord terminé vos livraisons !");
            }
            this.deliveryState = deliveryState.UNAVAILABLE;
        }
        else{
            this.deliveryState = deliveryState.AVAILABLE;
        }
    }

    public hasDelivery(deliveryId: string): boolean {
        return this.currentDeliveries.includes(deliveryId);
    }

    public addEarnings(amount: number): void {
        this.wallet.balance += amount;
    }

    public getId() : string { 
        return this.id;
    }

    public getEmail() : string {
        return this.email;
    }

    public getPassword() : string {
        return this.password;
    }
}