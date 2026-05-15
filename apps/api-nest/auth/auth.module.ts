import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ContainerModule } from '../container-module';

@Module({
  imports: [ContainerModule],
  controllers: [AuthController],
})
export class AuthModule {}
