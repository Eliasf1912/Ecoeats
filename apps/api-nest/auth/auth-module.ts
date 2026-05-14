import { Module } from '@nestjs/common';
import { AuthController } from './auth-controller';
import { AuthService } from './auth-service';
import { ContainerModule } from '../container-module';

@Module({
    imports: [ContainerModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}