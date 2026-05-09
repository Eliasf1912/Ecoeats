
import { orderRepository } from "../../ports";

export class MarkOrderAsReady {

    constructor(
        private readonly orderRepository : orderRepository,
    ) {}

    public async execute(orderId : string) : Promise<void> {

        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new Error("Le commande n'existe pas !");
        }
        
        order.markOrderAsReady();

        await this.orderRepository.save(order);

    }

}