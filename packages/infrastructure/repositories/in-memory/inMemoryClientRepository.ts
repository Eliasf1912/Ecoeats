import { clientRepository } from "../../../application/ports";
import { Client } from "../../../domain/entities";

export class InMemoryClientRepository implements clientRepository {

    private clients: Map<string, Client> = new Map();

    async findById(clientId: string): Promise<Client | null> {
        return this.clients.get(clientId) ?? null;
    }

    async save(client: Client): Promise<void> {
        this.clients.set(client.getId(), client);
    }

    async findByEmail(email: string): Promise<Client | null> {
        for(const client of this.clients.values()) {
            if(client.getEmail() === email) {
                return client;
            }
        }
        return null;
    }
}
