import { cartItem } from "./";
import { randomUUID } from "crypto";

export class Cart { 

    constructor(
        private readonly id : string,
        private readonly clientId : string,
        private restaurantId : string | null,
        private items : cartItem[]
    ) {

    }

    public addItem(menuItemId : string, quantity : number, price : number,restaurantId : string) : void {
        
        if(!this.restaurantId){
            this.restaurantId = restaurantId
        }else if(this.restaurantId !== restaurantId){
            throw new Error("Un seul restaurant par panier");
        }

        const IsItemIn = this.items.find(item => item.menuItemId === menuItemId);

        if(IsItemIn) {
            IsItemIn.quantity += quantity;
        }
        else{
            this.items.push({
                id : randomUUID(),
                menuItemId : menuItemId,
                quantity : quantity,
                unitPrice : price
            })
        }

    }

    public isEmpty() : boolean {
      return this.items.length === 0;
    }

    public clear() : void {
        this.items = [];
        this.restaurantId = null
    }

    public getItems() : cartItem[] | [] {
        return this.items;
    }
    
    public getRestaurantId() : string | null {
        return this.restaurantId;
    }

    public getClientId() : string {
        return this.clientId;
    }

}

