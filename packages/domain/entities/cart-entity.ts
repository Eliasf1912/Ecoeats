import { cartItem } from "./"

export interface cart { 
    id : string,
    clientId : string,
    restaurantId : string,
    items : cartItem[]
}