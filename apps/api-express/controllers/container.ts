// container.ts
import { InMemoryClientRepository } from '../../../packages/infrastructure/repositories/in-memory/';
import { PasswordService } from '../../../packages/infrastructure/services';
import { TokenService } from '../../../packages/infrastructure/services';
import { RegisterClient } from '../../../packages/application/use-cases/';

// Repositories
export const clientRepository = new InMemoryClientRepository();

// Services
export const passwordService = new PasswordService();
export const tokenService = new TokenService();

// Use Cases
export const registerClientUseCase = new RegisterClient(
    clientRepository,
    passwordService,
    tokenService
);