/**
 * valider les inputs (email, password, nom, prénom)
    vérifier que l'email n'existe pas déjà
    hasher le password avec bcrypt
    créer le Client
    sauvegarder
    générer et retourner un JWT token
    */

import { clientRepository } from "../../../ports";
import { Client } from "../../../../domain/entities";
import { PasswordService, TokenService } from "../../../../infrastructure/services";
import { RegisterClientDTO } from "../../../dto";
import { ValidationService } from "../../../../domain/services/validationService";
import { randomUUID } from "crypto";

export class RegisterClient {

    constructor(
        private readonly clientRepository : clientRepository,
        private readonly passwordService : PasswordService,
        private readonly tokenService : TokenService
    ){}

    public async execute(registerInfo : RegisterClientDTO) : Promise<string> {

        if(!registerInfo.email || !ValidationService.verifyEmail(registerInfo.email)){
            throw new Error("L'adresse email n'est pas valide ou est manquante !");
        }

        const existingClient  = await this.clientRepository.findByEmail(registerInfo.email);
        
        if(existingClient){
            throw new Error("L'adresse email existe déja !");
        }

        if(!registerInfo.password || ValidationService.verifyPassword(registerInfo.password)){
            throw new Error("Le mot de passe doit contenir au minimum 8 caractères, 1 majuscule, 1 chiffre, 1 caractére spécial !");
        }

        if(!registerInfo.address || ValidationService.verifyAddress(registerInfo.address)){
            throw new Error("L'address doit est manquane ou imcomplete !");
        }

        if(!registerInfo.name || ValidationService.verifyRegular(registerInfo.name)){
            throw new Error("Le nom est manquant ou pas assez long !");
        }

        if(!registerInfo.surname || ValidationService.verifyRegular(registerInfo.surname)){
            throw new Error("Le nom de famille est manquant ou pas assez long !");
        }

        const PasswordHashed =  await this.passwordService.hash(registerInfo.password);

        const clientId = randomUUID();

        const client = new Client(clientId, registerInfo.name, registerInfo.surname,PasswordHashed,registerInfo.email,registerInfo.address);

        await this.clientRepository.save(client);

        const token = this.tokenService.generate({id : clientId, role : "client"});

        return token;
    }   

}