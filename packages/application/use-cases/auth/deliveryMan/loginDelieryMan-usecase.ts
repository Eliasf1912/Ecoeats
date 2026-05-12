import { deliveryManRepository } from "../../../ports";
import { PasswordService, TokenService } from "../../../../infrastructure/services";
import { LoginDTO } from "../../../dto";

export class LoginDeliveryMan {

    constructor(
        private readonly deliveryManRepository : deliveryManRepository,
        private readonly passwordService : PasswordService,
        private readonly tokenService : TokenService
    ){}

    public async execute(loginInfo : LoginDTO) : Promise<string> {

        if(!loginInfo.email){
            throw new Error("L'email est manquant !");
        }

        if(!loginInfo.password){
            throw new Error("Le mot de passe est manquant !");
        }

        const existingDeliveryMan = await this.deliveryManRepository.findByEmail(loginInfo.email);

        if(!existingDeliveryMan){
            throw new Error("Identifiant incorrect !");
        }

        const isPasswordGood = await this.passwordService.compare(loginInfo.password, existingDeliveryMan.getPassword());

        if(!isPasswordGood){
            throw new Error("Identifiant incorrect !");
        }

        const token = this.tokenService.generate({ id: existingDeliveryMan.getId(), role: "deliveryman" });

        return token;
    }   
}