import { Module } from '@nestjs/common';
import { ContainerModule } from './container-module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ContainerModule, CartModule, AuthModule],
})
export class AppModule {}
