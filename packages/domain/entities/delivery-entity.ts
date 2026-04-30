import { deliveryStatus } from "../enums";

export interface delivery { 
    id : string,
    orderId : string,
    deliveryManId : string,
    distance : number,
    deliveryStatus : deliveryStatus,
    pickedUpAt : Date,
    deliveryAt : Date,
    earnings : number
}