import { address } from "../value-objects"
import { restaurantStatus } from "../enums"

export class Restaurant {
    constructor(
        private readonly id : string,
        private name : string,
        private description : string,
        private email : string,
        private password : string,
        private owner : string,
        private phoneNumber : string,
        private address : address,
        private status : restaurantStatus
    ) {}

    public getRestaurantId() : string {
        return this.id;
    }
    
    public getRestaurantName() : string {
        return this.name;
    }

    public isOpen() : boolean { 
        return this.status === restaurantStatus.OPEN;
    }

    public getAddress() : address { 
        return this.address;
    }

    public getPassword() : string { 
        return this.password;
    }

    public getEmail() : string { 
        return this.email;
    }

    public getId() : string { 
        return this.id;
    }
}