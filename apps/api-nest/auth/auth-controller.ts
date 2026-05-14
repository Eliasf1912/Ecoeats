import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth-service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register/client')
    async registerClient(@Body() body: any) {
        const token = await this.authService.registerClient(body);
        return { token };
    }

    @Post('login/client')
    @HttpCode(200)
    async loginClient(@Body() body: any) {
        const token = await this.authService.loginClient(body);
        return { token };
    }
}