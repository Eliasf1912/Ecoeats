import { orderStatus } from "../enums"
import { address } from "../value-objects"
import { orderItem } from "./"

export class Order { 
  constructor(
    private readonly id : string,
    private readonly clientId : string,
    private readonly restaurantId : string,
    private status : orderStatus,
    private readonly item : orderItem[],
    private readonly totalPrice : number,
    private readonly deliveryFee : number,
    private readonly serviceFee : number,
    private readonly deliveryAddress : address,
    private readonly restaurantAddress : address,
    private prepTime : Date | null,
    private acceptedAt : Date | null,
    private readonly createdAt : Date,
    private paidAt : Date | null
  ){}

}