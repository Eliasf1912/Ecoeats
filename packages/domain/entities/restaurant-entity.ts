import { address } from "../value-objects"
import { restaurantStatus } from "../enums"

export interface restaurant {
    id : string,
    name : string,
    description : string,
    email : string,
    password : string,
    owner : string,
    phoneNumber : string,
    address : address,
    status : restaurantStatus
}