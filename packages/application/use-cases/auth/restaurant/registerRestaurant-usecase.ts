
import { Restaurant } from "../../../../domain/entities";
import { PasswordService, TokenService } from "../../../../infrastructure/services";
import { restaurantRepository } from "../../../ports";
import { RegisterRestaurantDTO } from "../../../dto";
import { ValidationService } from "../../../../domain/services/validationService";
import { randomUUID } from "crypto";
import { restaurantStatus } from "../../../../domain/enums";

export class RegisterRestaurant {

    constructor(
        private readonly restaurantRepository : restaurantRepository,
        private readonly passwordService : PasswordService,
        private readonly tokenService : TokenService
    ){}

    public async execute(registerInfo : RegisterRestaurantDTO) : Promise<string> {

        if(!registerInfo.email || !ValidationService.verifyEmail(registerInfo.email)){
            throw new Error("L'adresse email n'est pas valide ou est manquante !");
        }

        const existingRestaurant = await this.restaurantRepository.findByEmail(registerInfo.email);
        
        if(existingRestaurant){
            throw new Error("L'adresse email existe déjà !");
        }

        if(!registerInfo.password || !ValidationService.verifyPassword(registerInfo.password)){
            throw new Error("Le mot de passe doit contenir au minimum 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial !");
        }

        if(!registerInfo.name || !ValidationService.verifyRegular(registerInfo.name)){
            throw new Error("Le nom est manquant ou pas assez long !");
        }

        if(!registerInfo.address || !ValidationService.verifyAddress(registerInfo.address)){
            throw new Error("L'adresse est manquante ou incomplète !");
        }

        if(!registerInfo.owner || !ValidationService.verifyRegular(registerInfo.owner)){
            throw new Error("Le nom du propriétaire est manquant ou invalide !");
        }

        if(!registerInfo.phoneNumber || !ValidationService.verifyPhone(registerInfo.phoneNumber)){
            throw new Error("Le numéro de téléphone est manquant ou invalide !");
        }

        if(!registerInfo.description){
            throw new Error("La description est manquante !");
        }

        const passwordHashed = await this.passwordService.hash(registerInfo.password);

        const restaurantId = randomUUID();

        const restaurant = new Restaurant(
            restaurantId,
            registerInfo.name,
            registerInfo.description,
            registerInfo.email,
            passwordHashed,
            registerInfo.owner,
            registerInfo.phoneNumber,
            registerInfo.address,
            restaurantStatus.CLOSE
        );

        await this.restaurantRepository.save(restaurant);

        const token = this.tokenService.generate({ id: restaurantId, role: "restaurant" });

        return token;
    }   
}