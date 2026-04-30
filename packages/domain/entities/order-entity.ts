import { orderStatus } from "../enums"
import { address } from "../value-objects"
import { orderItem } from "./"

export interface order { 
    id : string,
    clientId : string,
    restaurantId : string,
    status : orderStatus,
    item : orderItem[],
    totalPrice : number,
    deliveryFee : number,
    serviceFee : number,
    deliveryAddress : address,
    restaurantAddress : address,
    orderStatut : orderStatus,
    prepTime : Date,
    acceptedAt : Date,
    createdAt : Date,
    paidAt : Date
}