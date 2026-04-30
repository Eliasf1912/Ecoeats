import { address } from "../value-objects";

export interface client { 
    id : string,
    name : string,
    surname : string,
    password : string,
    email : string,
    address : address 
} 