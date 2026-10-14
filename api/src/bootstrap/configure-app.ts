import { ValidationPipe, VersioningType } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppConfigService } from '$config/app-config.service.js';

export const configureApp = (app: NestExpressApplication): void => {
  const config = app.get(AppConfigService);

  if (config.get('TRUST_PROXY')) {
    app.set('trust proxy', 1);
  }

  app.disable('x-powered-by');
  app.use(helmet());

  const origins = config.get('CORS_ORIGINS');
  app.enableCors({
    origin: origins.length > 0 ? origins : false,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.enableShutdownHooks();
};
