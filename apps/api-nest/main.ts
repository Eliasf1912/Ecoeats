import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT_NEST ?? 3001;
    await app.listen(port);
    console.log(`Nest app listening on http://localhost:${port}`);
}

bootstrap();
