import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import type { AppConfig } from './app.config.js';
import type { DbConfig } from './db.config.js';
import type { LoggerConfig } from './logger.config.js';
import type { ThrottleConfig } from './throttle.config.js';

interface IConfigs extends AppConfig, DbConfig, LoggerConfig, ThrottleConfig {}

@Injectable()
export class ConfigService {
  constructor(
    private readonly nestConfigService: NestConfigService<IConfigs, true>,
  ) {}

  get app() {
    return this.nestConfigService.get('app', { infer: true });
  }

  get db() {
    return this.nestConfigService.get('db', { infer: true });
  }

  get logger() {
    return this.nestConfigService.get('logger', { infer: true });
  }

  get throttle() {
    return this.nestConfigService.get('throttle', { infer: true });
  }
}
