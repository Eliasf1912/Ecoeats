import { Client } from "../../domain/entities"

export interface clientRepository {
    findByEmail(email: string) : Promise<Client | null>;
    save(client: Client) : Promise<void>
}