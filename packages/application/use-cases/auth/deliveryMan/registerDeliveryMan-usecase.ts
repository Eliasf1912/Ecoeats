import { deliveryManRepository } from "../../../ports";
import { DeliveryMan } from "../../../../domain/entities";
import { PasswordService, TokenService } from "../../../../infrastructure/services";
import { RegisterDeliveryManDTO } from "../../../dto";
import { ValidationService } from "../../../../domain/services/validationService";
import { randomUUID } from "crypto";
import { deliveryManExperience, deliveryState, transportType } from "../../../../domain/enums";

export class RegisterDeliveryMan {

    constructor(
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly passwordService : PasswordService,
        private readonly tokenService : TokenService
    ){}

    public async execute(registerInfo : RegisterDeliveryManDTO) : Promise<string> {

        if(!registerInfo.email || !ValidationService.verifyEmail(registerInfo.email)){
            throw new Error("L'adresse email n'est pas valide ou est manquante !");
        }

        const existingDeliveryMan = await this.deliveryManRepository.findByEmail(registerInfo.email);
        
        if(existingDeliveryMan){
            throw new Error("L'adresse email existe déjà !");
        }

        if(!registerInfo.password || !ValidationService.verifyPassword(registerInfo.password)){
            throw new Error("Le mot de passe doit contenir au minimum 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial !");
        }

        if(!registerInfo.name || !ValidationService.verifyRegular(registerInfo.name)){
            throw new Error("Le nom est manquant ou pas assez long !");
        }

        if(!registerInfo.surname || !ValidationService.verifyRegular(registerInfo.surname)){
            throw new Error("Le prénom est manquant ou pas assez long !");
        }

        if(!registerInfo.phoneNumber || !ValidationService.verifyPhone(registerInfo.phoneNumber)){
            throw new Error("Le numéro de téléphone est manquant ou invalide !");
        }

        if(!registerInfo.transport_type){
            throw new Error("Le type de transport est manquant ou invalide !");
        }

        const passwordHashed = await this.passwordService.hash(registerInfo.password);

        const deliveryManId = randomUUID();

        const deliveryMan = new DeliveryMan(
            deliveryManId,
            registerInfo.name,
            registerInfo.surname,
            registerInfo.email,
            passwordHashed,
            registerInfo.phoneNumber,
            deliveryManExperience.BEGINNER,
            deliveryState.AVAILABLE,
            registerInfo.transport_type,
            { id: randomUUID(), balance: 0 },
            []
        );

        await this.deliveryManRepository.save(deliveryMan);

        const token = this.tokenService.generate({ id: deliveryManId, role: "deliveryman" });

        return token;
    }   
}