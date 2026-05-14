import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../../../packages/infrastructure/services';

@Injectable()
export class AuthGuard implements CanActivate {
    private tokenService = new TokenService();

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const header = request.headers['authorization'];
        
        if(!header) return false;
        
        const token = header.split(' ')[1];
        
        try {
            const decoded = this.tokenService.verify(token);
            request.user = decoded;
            return true;
        } catch {
            return false;
        }
    }
}