import { cartRepository } from "../../ports";
import { Cart } from "../../../domain/entities";

export class GetCart {
    constructor(
        private readonly cartRepository: cartRepository
    ) {}

    public async execute(clientId: string): Promise<Cart | null> {
        return await this.cartRepository.findByClientId(clientId);
    }
}