import { address } from "../../domain/value-objects"

export interface RegisterRestaurantDTO {
    name: string,
    description: string,
    email: string,
    password: string,
    owner: string,
    phoneNumber: string,
    address: address
}