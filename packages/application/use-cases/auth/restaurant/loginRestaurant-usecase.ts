import { restaurantRepository } from "../../../ports";
import { PasswordService, TokenService } from "../../../../infrastructure/services";
import { LoginDTO } from "../../../dto";

export class LoginRestaurant {

    constructor(
        private readonly restaurantRepository : restaurantRepository,
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

        const existingRestaurant = await this.restaurantRepository.findByEmail(loginInfo.email);

        if(!existingRestaurant){
            throw new Error("Identifiant incorrect !");
        }

        const isPasswordGood = await this.passwordService.compare(loginInfo.password, existingRestaurant.getPassword());

        if(!isPasswordGood){
            throw new Error("Identifiant incorrect !");
        }

        const token = this.tokenService.generate({ id: existingRestaurant.getRestaurantId(), role: "restaurant" });

        return token;
    }   
}