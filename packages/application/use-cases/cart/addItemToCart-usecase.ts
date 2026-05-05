/*
    INPUT:
    - clientId
    - menuItemId
    - quantity

    STEPS:
    1. récupérer le cart du client
    - si inexistant → créer un nouveau cart

    2. récupérer le menuItem

    3. vérifier stock > 0

    4. si cart a déjà un restaurantId :
        si différent du menuItem.restaurantId → erreur

    5. ajouter item au cart
    - si déjà présent → augmenter quantité
    - sinon → ajouter

    6. sauvegarder le cart

    7. retourner le cart
 */

import { Cart } from "../../../domain/entities";
import { cartRepository, menuItemRepository } from "../../ports"
import { randomUUID } from "crypto"

export class AddItemToCart { 
    public constructor(
        private readonly cartRepository : cartRepository,
        private readonly menuItemRepository : menuItemRepository
    ){}

    public async execute(
        clientId : string, 
        menuItemId : string, 
        quantity : number
    ) : Promise<Cart | null> { 

        let cart = await this.cartRepository.findByClientId(clientId);
        const menuItem = await this.menuItemRepository.findById(menuItemId);

        if(!menuItem){
            throw new Error("Produit introuvable");
        }
        
        if(menuItem.stock === 0){
            throw new Error("Rupture de stock");
        }

        if(!cart){
            cart = new Cart(randomUUID(),clientId,null,[]);
        }

        cart.addItem(menuItemId,quantity,menuItem.price,menuItem.restaurantId);
        
        await this.cartRepository.save(cart);

        return cart;

    }
}