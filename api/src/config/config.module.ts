import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import appConfig from './app.config.js';
import { ConfigService } from './config.service.js';
import { validate } from './config.validator.js';
import dbConfig from './db.config.js';
import loggerConfig from './logger.config.js';
import throttleConfig from './throttle.config.js';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      load: [appConfig, dbConfig, loggerConfig, throttleConfig],
      validate,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
