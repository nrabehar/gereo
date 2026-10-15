import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

import { AppModule } from '@/app.module.js';
import { configureApp } from '@/bootstrap/configure-app.js';
import { setupSwagger } from '@/bootstrap/swagger.js';
import { ConfigService } from '$config/config.service.js';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  configureApp(app);

  const config = app.get(ConfigService);
  if (config.app.swaggerEnabled) {
    setupSwagger(app);
  }

  await app.listen(config.app.port, config.app.host);
};

await bootstrap();
