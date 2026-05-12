
import { orderRepository } from "../../ports";
import { AssigneDelivery } from "../"
export class MarkOrderAsReady {

    constructor(
        private readonly orderRepository : orderRepository,
        private readonly assigneDelivery : AssigneDelivery,
    ) {}

    public async execute(orderId : string) : Promise<void> {

        const order = await this.orderRepository.findById(orderId);

        if(!order){
            throw new Error("Le commande n'existe pas !");
        }
        
        order.markOrderAsReady();

        await this.orderRepository.save(order);

        await this.assigneDelivery.execute(orderId);
    }

}