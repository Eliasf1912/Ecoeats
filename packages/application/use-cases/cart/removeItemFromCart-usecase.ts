import { cartRepository } from "../../ports";

export class RemoveItemFromCart { 
    
    constructor(
        private readonly cartRepository : cartRepository
    ) {}

    public async execute (cartId : string, itemId : string) : Promise<void> {
        
        const cart = await this.cartRepository.findById(cartId);

        if(!cart){
            throw  new Error("Le panier n'existe pas !");
        }

        cart.removeItem(itemId);

        await this.cartRepository.save(cart);
    }   

}