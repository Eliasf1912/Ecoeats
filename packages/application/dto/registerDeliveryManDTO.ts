import { transportType } from "../../domain/enums";

export interface RegisterDeliveryManDTO {
    readonly name : string,
    surname : string,
    email : string,
    password : string,
    phoneNumber : string,
    transport_type : transportType,
}