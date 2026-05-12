import { address } from "../value-objects";

export class Client { 
    constructor(
        private readonly id : string,
        private name : string,
        private surname : string,
        private password : string,
        private email : string,
        private address : address | null
    ){}

    public getId() : string {
        return this.id;
    }

    public getEmail() : string {
        return this.email;
    }

    public getPassword() : string {
        return this.password;
    }
} 