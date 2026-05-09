import { Cart } from "../../domain/entities";

export interface cartRepository {
    findByClientId(clientId : string) : Promise< Cart | null>,
    save(cart : Cart) : Promise<void>,
    findById(cartId : string ) : Promise< Cart | null>
}