import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

import { AppModule } from '@/app.module.js';
import { configureApp } from '@/bootstrap/configure-app.js';
import { setupSwagger } from '@/bootstrap/swagger.js';
import { AppConfigService } from '$config/app-config.service.js';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  configureApp(app);

  const config = app.get(AppConfigService);
  if (config.get('SWAGGER_ENABLED')) {
    setupSwagger(app);
  }

  await app.listen(config.get('PORT'), config.get('HOST'));
};

await bootstrap();
