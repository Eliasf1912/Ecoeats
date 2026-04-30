import { deliveryManExperience, deliveryState, transportType } from "../enums";
import { wallet } from "./";

export interface deliveryMan { 
    id : string,
    name : string,
    surname : string,
    email : string,
    password : string,
    phoneNumber : string,
    experience : deliveryManExperience,
    deliveryState : deliveryState,
    transport_type : transportType,
    wallet : wallet
}