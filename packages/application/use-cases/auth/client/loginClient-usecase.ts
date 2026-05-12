/**
 * récupérer le client via son email
    vérifier qu'il existe
    comparer le password fourni avec le password hashé en BDD via PasswordService.compare()
    vérifier que le password est correct
    générer et retourner un JWT token
    */

import { clientRepository } from "../../../ports";
import { PasswordService, TokenService } from "../../../../infrastructure/services";
import { LoginDTO } from "../../../dto";

export class LoginClient {

    constructor(
        private readonly clientRepository : clientRepository,
        private readonly passwordService : PasswordService,
        private readonly tokenService : TokenService
    ){}

    public async execute( loginInfo : LoginDTO) : Promise<string> {

        if(!loginInfo.email){
            throw new Error("l'email est manquante !");
        }

        if(!loginInfo.password){
            throw new Error("le mot de passe est manquante !");
        }

        const existingClient =  await this.clientRepository.findByEmail(loginInfo.email);

        if(!existingClient){
            throw new Error("Identifiant incorrect !");
        }

        const isPasswordGood = await this.passwordService.compare(loginInfo.password,existingClient.getPassword());

        if(!isPasswordGood){
            throw new Error("Identifiant incorrect !");
        }

        const token = this.tokenService.generate({id : existingClient.getId(), role : "client"});

        return token;
    }   

}