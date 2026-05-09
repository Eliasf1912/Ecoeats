import { cartRepository } from "../../ports";

export class ClearCart { 
    
    constructor(
        private readonly cartRepository : cartRepository
    ) {}

    public async execute (cartId : string) : Promise<void> {
        
        const cart = await this.cartRepository.findById(cartId);

        if(!cart){
            throw  new Error("Le panier n'existe pas !");
        }

        const isEmpty = cart.isEmpty();

        if(isEmpty){
            throw  new Error("Il y a aucun produit dans le panier !");
        }

        cart.clear();

        await this.cartRepository.save(cart);
    }   

}