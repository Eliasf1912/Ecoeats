import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
} from "@nestjs/common";
import { Request } from "express";

export function AuthGuard(role: string) {
    @Injectable()
    class RoleGuard implements CanActivate {
        constructor(@Inject("TokenService") private readonly tokenService: any) { }

        canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest<Request>();
            const header = req.headers["authorization"];
            if (!header) return false;
            const token = String(header).split(" ")[1];
            if (!token) return false;
            try {
                const tokenVerified = this.tokenService.verify(token);
                if (tokenVerified.role !== role) return false;
                (req as any).user = tokenVerified;
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    return RoleGuard;
}
