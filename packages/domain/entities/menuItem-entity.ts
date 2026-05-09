
export class MenuItem { 
    constructor(
        private readonly id : string,
        private readonly restaurantId : string,
        private name :string,
        private description : string,
        private price : number,
        private stock : number,
        private allergen : string[]
    ) {}

    public update(name?: string, description?: string, price?: number, stock?: number, allergens?: string[]): void {
        if(name !== undefined) this.name = name;
        if(description !== undefined) this.description = description;
        if(price !== undefined) this.price = price;
        if(stock !== undefined) this.stock = stock;
        if(allergens !== undefined) this.allergen = allergens;
    }

    public getPrice() : number { 
        return this.price;
    }

    public getRestaurantId() : string {
        return this.restaurantId;
    }

    public getStock() : number {
        return this.stock;
    }

    public getName() : string {
        return this.name;
    }
}