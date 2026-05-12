import { address } from "../../domain/value-objects"

export interface RegisterClientDTO {
    name: string,
    surname: string,
    email: string,
    password: string,
    address: address
}