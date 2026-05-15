import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { ContainerModule } from '../container-module';

@Module({
    imports: [ContainerModule],
    controllers: [CartController],
})
export class CartModule { }
